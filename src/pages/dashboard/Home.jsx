import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { FileText, MessageSquare, Database } from 'lucide-react';

export default function Home() {
    const [stats, setStats] = useState({ docs: 0, chats: 0 });
    const [copied, setCopied] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const docsRes = await api.get('/upload');
                const logsRes = await api.get('/chat/logs');
                setStats({
                    docs: docsRes.data.length,
                    chats: logsRes.data.pagination?.total || 0
                });
            } catch (error) {
                console.error('Error fetching stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-8 w-full pb-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Welcome back, {user.name}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stats Cards */}
                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/20"></div>
                    <div className="relative z-10">
                        <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 w-fit mb-6">
                            <FileText className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Knowledge Base</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.docs} <span className="text-base font-normal text-gray-400">docs</span></p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-green-500/20"></div>
                    <div className="relative z-10">
                        <div className="p-3 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 w-fit mb-6">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">Total Conversations</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.chats} <span className="text-base font-normal text-gray-400">chats</span></p>
                    </div>
                </div>

                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-500/20"></div>
                    <div className="relative z-10">
                        <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 w-fit mb-6">
                            <Database className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">System Status</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">Active & Ready</p>
                        </div>
                    </div>
                </div>

                {/* API Key Section */}
                <div className="md:col-span-3 bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-indigo-500/20 blur-[120px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">QUICK ACCESS</span>
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Your API Key</h2>
                            <p className="text-gray-400 text-sm max-w-xl">Use this key to integrate the chatbot widget into your website. Keep it secure.</p>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <code className="flex-1 md:w-64 bg-black/50 p-4 rounded-xl text-indigo-300 font-mono text-sm border border-gray-800 truncate shadow-inner">
                                {user.apiKey}
                            </code>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(user.apiKey);
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                }}
                                className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-900/50 transition-all active:scale-95 whitespace-nowrap"
                            >
                                {copied ? 'Copied!' : 'Copy Key'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
