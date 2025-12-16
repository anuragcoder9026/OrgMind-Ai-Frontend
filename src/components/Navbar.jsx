import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Bot } from 'lucide-react';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">OrgMind AI</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white focus:outline-none"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                        {localStorage.getItem('token') ? (
                            <Link to="/dashboard" className="flex items-center space-x-2">
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {JSON.parse(localStorage.getItem('user'))?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
