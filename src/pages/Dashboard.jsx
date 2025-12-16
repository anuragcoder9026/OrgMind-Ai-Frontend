import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Home from './dashboard/Home';
import Uploads from './dashboard/Uploads';
import Settings from './dashboard/Settings';
import ChatPreview from './dashboard/ChatPreview';
import Analytics from './dashboard/Analytics';

export default function Dashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200 overflow-hidden relative selection:bg-indigo-500/30">
            {/* Background Gradients (Global) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[100px] animate-blob animation-delay-2000"></div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-4 transition-all duration-200">
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">ChatBot</span>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex z-20">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                    <div className="relative w-64 bg-gray-900 h-full shadow-2xl transform transition-transform duration-300 ease-out">
                        <div className="absolute top-4 right-4 z-50">
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="p-1 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative z-10 pt-16 md:pt-0">
                <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/uploads" element={<Uploads />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/chat" element={<ChatPreview />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
}
