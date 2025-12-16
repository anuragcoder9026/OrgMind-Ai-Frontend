import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
    Bot, Shield, Zap, Globe, Code, Layout, ArrowRight, Check, Terminal,
    MessageSquare, Cpu, Users, Star, ChevronDown, ChevronUp, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-200 dark:border-gray-700">
            <button
                className="flex justify-between items-center w-full py-6 text-left focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-gray-600 dark:text-gray-300">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Landing() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 font-sans selection:bg-indigo-500 selection:text-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-400/30 via-transparent to-transparent dark:from-indigo-900/30"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-400/30 via-transparent to-transparent dark:from-purple-900/30"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <motion.div
                        className="text-center max-w-4xl mx-auto"
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full px-4 py-1 text-sm font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 mb-8 border border-indigo-100 dark:border-indigo-800">
                            <span className="flex h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 mr-2 animate-pulse"></span>
                            New: Multi-Tenant Architecture & API
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight">
                            Build Custom AI Chatbots <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                In Minutes, Not Months
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
                            Train ChatGPT-like assistants on your own data. Embed them on your website instantly.
                            Secure, scalable, and developer-friendly.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link
                                to="/signup"
                                className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/30"
                            >
                                Start Building Free
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 dark:border-gray-700 text-lg font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                <Play className="mr-2 h-5 w-5 fill-current" />
                                Watch Demo
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Integration Showcase */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-20 max-w-6xl mx-auto"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left: Code Snippet */}
                                <div className="p-8 md:p-12 bg-gray-900 flex flex-col justify-center">
                                    <h3 className="text-2xl font-bold text-white mb-6">
                                        Integrate in seconds
                                    </h3>
                                    <p className="text-gray-400 mb-8">
                                        Simply install our React widget and drop it into your app. It's fully customizable and works with any backend.
                                    </p>

                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">1. Install Package</p>
                                            <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 border border-gray-700">
                                                <span className="text-pink-500">npm</span> install orgmindai-chatbot-widget
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">2. Use Component</p>
                                            <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm text-gray-300 border border-gray-700 overflow-x-auto">
                                                <span className="text-indigo-400">import</span> {`{ ChatBotWidget }`} <span className="text-indigo-400">from</span> <span className="text-green-400">'orgmindai-chatbot-widget'</span>;<br />
                                                <br />
                                                <span className="text-indigo-400">export default</span> <span className="text-yellow-300">function</span> <span className="text-blue-300">App</span>() {'{'}<br />
                                                &nbsp;&nbsp;<span className="text-pink-500">return</span> (<br />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-yellow-300">ChatBotWidget</span> <br />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;apiKey={<span className="text-green-400">"YOUR_API_KEY_HERE"</span>} <br />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;title={<span className="text-green-400">"AI Support"</span>} <br />
                                                &nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br />
                                                &nbsp;&nbsp;);<br />
                                                {'}'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Preview Image */}
                                <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-8 md:p-12">
                                    <div className="relative w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                        {/* Mockup using the generated image */}
                                        <img
                                            src="/assets/chatbot-preview.png"
                                            alt="Chatbot Widget Preview"
                                            className="w-full h-auto"
                                        />
                                    </div>

                                    {/* Decorative elements */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                        className="absolute top-10 right-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
                                    ></motion.div>
                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                                        className="absolute bottom-10 left-10 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl"
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Workflow</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            How it works
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-800 -translate-y-1/2 z-0"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            {[
                                { title: "1. Upload Data", desc: "Connect your extensive knowledge base. Upload PDFs, Word docs, or crawl your website URLs.", icon: Globe },
                                { title: "2. Train & Customize", desc: "Our AI processes your data, creating a custom model. Adjust the tone, personality, and instructions.", icon: Cpu },
                                { title: "3. Embed & Deploy", desc: "Copy a simple snippet of code and paste it into your website. Your chatbot is live instantly.", icon: Code },
                            ].map((step, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 text-center">
                                    <div className="w-16 h-16 mx-auto bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                                        <step.icon className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* Features Grid */}
            <div className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Everything you need to build world-class AI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Smart Ingestion',
                                desc: 'Drag & drop PDFs, DOCX, or paste URLs. We handle the text extraction, cleaning, and chunking automatically.',
                                icon: Globe,
                                color: 'bg-blue-500'
                            },
                            {
                                title: 'Vector Search',
                                desc: 'Powered by Pinecone and Gemini embeddings for semantic search that understands context, not just keywords.',
                                icon: Zap,
                                color: 'bg-yellow-500'
                            },
                            {
                                title: 'Enterprise Security',
                                desc: 'Your data is isolated in secure namespaces. We use industry-standard encryption at rest and in transit.',
                                icon: Shield,
                                color: 'bg-green-500'
                            },
                            {
                                title: 'Custom API',
                                desc: 'Build your own UI or integrate into existing apps with our robust and documented REST API.',
                                icon: Terminal,
                                color: 'bg-purple-500'
                            },
                            {
                                title: 'Analytics Dashboard',
                                desc: 'Track usage, view conversation history, and gain insights into what your users are asking.',
                                icon: Layout,
                                color: 'bg-pink-500'
                            },
                            {
                                title: 'Multi-Agent Support',
                                desc: 'Orchestrate complex workflows with specialized agents for support, sales, and more.',
                                icon: Users,
                                color: 'bg-orange-500'
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg border border-gray-100 dark:border-gray-700 transition-all"
                            >
                                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg`}>
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Pricing</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Simple, transparent pricing
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Starter</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">Perfect for hobby projects</p>
                            <div className="my-6">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$0</span>
                                <span className="text-gray-500 dark:text-gray-400">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {['1 Chatbot', '50 MB Storage', '100 Msg/mo', 'Community Support'].map((feat) => (
                                    <li key={feat} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-gray-600 dark:text-gray-300">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup" className="block w-full py-3 px-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-center font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                Get Started
                            </Link>
                        </div>

                        {/* Pro Tier */}
                        <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl shadow-2xl border border-indigo-500 p-8 flex flex-col relative transform scale-105 z-10">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                            <h3 className="text-xl font-bold text-white">Pro</h3>
                            <p className="text-indigo-100 mt-2">For growing businesses</p>
                            <div className="my-6">
                                <span className="text-4xl font-extrabold text-white">$49</span>
                                <span className="text-indigo-200">/mo</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {['5 Chatbots', '1 GB Storage', '10,000 Msg/mo', 'Priority Email Support', 'Remove Branding'].map((feat) => (
                                    <li key={feat} className="flex items-center">
                                        <Check className="h-5 w-5 text-indigo-200 mr-2" />
                                        <span className="text-indigo-50">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/signup" className="block w-full py-3 px-4 bg-white text-indigo-600 text-center font-bold rounded-lg hover:bg-gray-50 transition-colors shadow-lg">
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Enterprise</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2">For large scale needs</p>
                            <div className="my-6">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">Custom</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {['Unlimited Chatbots', 'Custom Storage', 'Unlimited Msg', 'Dedicated Account Manager', 'SLA'].map((feat) => (
                                    <li key={feat} className="flex items-center">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-gray-600 dark:text-gray-300">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link to="/contact" className="block w-full py-3 px-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-center font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                Contact Sales
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className="py-24 bg-gray-50 dark:bg-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase">Testimonials</h2>
                        <h2 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                            Loved by developers
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Sarah K.", role: "CTO at TechFlow", text: "Implementation was a breeze. We had our support bot running in less than an hour." },
                            { name: "Michael R.", role: "Product Manager", text: "The vector search accuracy is incredible. Much better than our previous keyword-based solution." },
                            { name: "Jessica T.", role: "Founder", text: "It scales perfectly. We went from 100 to 10k users without a hiccup. Highly recommended." }
                        ].map((t, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex text-yellow-400 mb-4">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-5 w-5 fill-current" />)}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">"{t.text}"</p>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="py-24 bg-white dark:bg-gray-900">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { q: "Can I use my own OpenAI API key?", a: "Yes! You can bring your own key or use our managed infrastructure. We support GPT-4, Gemini 1.5, and Claude 3." },
                            { q: "Is my data secure?", a: "Absolutely. We encrypt all data at rest and in transit. Your documents are stored in a private vector namespace accessible only to your account." },
                            { q: "How do I embed the chatbot?", a: "It's as simple as copying a <script> tag or installing our React component via npm. We provide full documentation." },
                            { q: "What file types are supported?", a: "We currently support PDF, DOCX, TXT, CSV, and MD files. You can also scrape website URLs directly." }
                        ].map((item, i) => (
                            <FaqItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-indigo-600 dark:bg-indigo-900">
                <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        <span className="block">Ready to dive in?</span>
                        <span className="block text-indigo-200">Start your free trial today.</span>
                    </h2>
                    <p className="mt-4 text-lg leading-6 text-indigo-100">
                        No credit card required. Get 100 free message credits and 50MB of storage.
                    </p>
                    <Link
                        to="/signup"
                        className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
                    >
                        Sign up for free
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
