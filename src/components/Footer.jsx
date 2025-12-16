import { Link } from 'react-router-dom';
import { Bot, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center">
                            <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">RAG SaaS</span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                            Build custom AI chatbots trained on your data in minutes. Secure, scalable, and powered by Gemini.
                        </p>
                        <div className="mt-6 flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <span className="sr-only">GitHub</span>
                                <Github className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                <span className="sr-only">LinkedIn</span>
                                <Linkedin className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Documentation
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Careers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
                        <ul className="mt-4 space-y-4">
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-base text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8">
                    <p className="text-base text-gray-400 xl:text-center">
                        &copy; {new Date().getFullYear()} RAG SaaS, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
