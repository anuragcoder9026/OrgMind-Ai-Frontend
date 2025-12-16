import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import api from '../api/axios';
import { Lock, Mail, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            window.location.href = '/dashboard';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data } = await api.post('/auth/google', { token: tokenResponse.access_token });
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = '/dashboard';
            } catch (err) {
                setError('Google login failed');
            }
        },
    });

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-200 font-sans">
            {/* Left Side - Brand & Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-indigo-600 dark:bg-indigo-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-purple-700/90 dark:from-indigo-900/90 dark:to-purple-900/90"></div>

                <div className="relative w-full flex flex-col justify-between p-12 text-white z-10">
                    <div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h1 className="text-5xl font-extrabold leading-tight mb-4">
                                Turn your data into <br />
                                <span className="text-indigo-200">intelligent conversations.</span>
                            </h1>
                            <p className="text-xl text-indigo-100 max-w-md">
                                Join thousands of companies using OrgAI to build, train, and deploy custom chatbots in minutes.
                            </p>
                        </motion.div>

                        <div className="space-y-4">
                            {['Secure Enterprise Data', 'One-Click Deployment', 'Multi-Model Support'].map((feature, i) => (
                                <motion.div
                                    key={feature}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="flex items-center space-x-3"
                                >
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/50 flex items-center justify-center border border-indigo-400">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className="text-sm text-indigo-200 opacity-70">
                        © 2024 OrgAI Inc. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-12 lg:p-24 relative">
                <Link to="/" className="absolute top-8 right-8 text-sm font-medium text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Back to Home
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                            Please enter your details to sign in.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.5 }}
                        className="mt-8 space-y-6"
                    >
                        {error && (
                            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                                        <div className="text-sm">
                                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Forgot password?</a>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            required
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-700 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/30"
                            >
                                Sign in
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={() => googleLogin()}
                            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Sign in with Google
                        </button>

                        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
