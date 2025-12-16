import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Copy, RefreshCw, Key, CheckCircle, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Settings() {
    const [settings, setSettings] = useState({
        chatbotTone: 'professional',
        systemInstructions: '',
        displayName: 'AI Assistant'
    });
    const [apiKey, setApiKey] = useState('');
    const [geminiApiKey, setGeminiApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);
    const [testingKey, setTestingKey] = useState(false);
    const [keyStatus, setKeyStatus] = useState(null); // 'valid', 'invalid', null
    const [savingKey, setSavingKey] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/auth/me');
                setSettings(data.settings);
                setApiKey(data.apiKey);
                setGeminiApiKey(data.geminiApiKey || '');
            } catch (error) {
                console.error('Error fetching settings', error);
                toast.error('Failed to load settings');
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put('/org/settings', settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error saving settings', error);
            toast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateKey = async () => {
        if (!window.confirm('Are you sure? This will invalidate the old key.')) return;
        try {
            const { data } = await api.post('/org/regenerate-key');
            setApiKey(data.apiKey);
            toast.success('API key regenerated successfully');
        } catch (error) {
            console.error('Error regenerating key', error);
            toast.error('Failed to regenerate API key');
        }
    };

    const handleTestGeminiKey = async () => {
        if (!geminiApiKey.trim()) {
            setKeyStatus('invalid');
            toast.error('Please enter an API key');
            return;
        }

        setTestingKey(true);
        setKeyStatus(null);
        try {
            const { data } = await api.post('/org/test-gemini-key', { apiKey: geminiApiKey });
            setKeyStatus(data.valid ? 'valid' : 'invalid');
            if (data.valid) {
                toast.success('API key is valid!');
            } else {
                toast.error('Invalid API key');
            }
        } catch (error) {
            console.error('Error testing API key', error);
            setKeyStatus('invalid');
            toast.error(error.response?.data?.message || 'Failed to validate API key');
        } finally {
            setTestingKey(false);
        }
    };

    const handleSaveGeminiKey = async () => {
        if (!geminiApiKey.trim()) {
            toast.error('Please enter a Gemini API key');
            return;
        }

        setSavingKey(true);
        const toastId = toast.loading('Saving API key...');
        try {
            await api.put('/org/gemini-api-key', { geminiApiKey });
            toast.success('Gemini API key saved successfully!', { id: toastId });
        } catch (error) {
            console.error('Error saving Gemini API key', error);
            toast.error(error.response?.data?.message || 'Failed to save API key', { id: toastId });
        } finally {
            setSavingKey(false);
        }
    };

    const handleResetGeminiKey = async () => {
        if (!window.confirm('Are you sure you want to remove your custom Gemini API key?')) return;

        const toastId = toast.loading('Resetting to global key...');
        try {
            await api.delete('/org/gemini-api-key');
            setGeminiApiKey('');
            setKeyStatus(null);
            toast.success('Reset to global key successfully!', { id: toastId });
        } catch (error) {
            console.error('Error removing Gemini API key', error);
            toast.error('Failed to reset API key', { id: toastId });
        }
    };


    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1f2937',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            <div className="space-y-8 w-full pb-10">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                    Organisation Settings
                </h1>

                {/* API Key Section */}
                <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-[-50%] right-[-50%] w-full h-full bg-indigo-500/20 blur-[120px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-500/20 rounded-lg">
                                <span className="text-indigo-400 font-mono text-xs font-bold">KEY</span>
                            </div>
                            <h2 className="text-xl font-bold text-white">API Integration Key</h2>
                        </div>

                        <p className="text-gray-400 mb-6 text-sm max-w-xl">
                            This key authenticates your widget requests. Keep it secure and never share it in client-side code other than the allowed widget configuration.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch gap-4">
                            <code className="flex-1 bg-black/50 p-4 rounded-xl text-indigo-300 font-mono text-sm border border-gray-800 break-all shadow-inner flex items-center">
                                {apiKey}
                            </code>
                            <div className="flex gap-2 shrink-0">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(apiKey);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-900/50 transition-all active:scale-95 flex items-center gap-2"
                                >
                                    {copied ? 'Copied' : 'Copy Key'}
                                    {!copied && <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                    onClick={handleRegenerateKey}
                                    className="p-3 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-900/10 rounded-xl transition-all border border-gray-700 hover:border-red-500/50"
                                    title="Regenerate Key"
                                >
                                    <RefreshCw className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* LLM Configuration Section */}
                <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-3xl p-8 border border-purple-700/50 shadow-xl overflow-hidden relative group">
                    <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-purple-500/10 blur-[120px] rounded-full group-hover:bg-purple-500/20 transition-all duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Key className="h-5 w-5 text-purple-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white">LLM Configuration</h2>
                        </div>

                        <p className="text-gray-300 mb-6 text-sm max-w-xl">
                            Configure your own Gemini API key for AI operations. If not set, the system will use a shared key.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-200 mb-2 block">Gemini API Key</label>
                                <div className="flex gap-3">
                                    <input
                                        type="password"
                                        className="flex-1 rounded-xl border border-purple-600/50 bg-black/30 text-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent py-3 px-4 transition-all font-mono text-sm"
                                        value={geminiApiKey}
                                        onChange={(e) => {
                                            setGeminiApiKey(e.target.value);
                                            setKeyStatus(null);
                                        }}
                                        placeholder="AIzaSy..."
                                    />
                                    {keyStatus === 'valid' && (
                                        <div className="flex items-center text-green-400">
                                            <CheckCircle className="h-6 w-6" />
                                        </div>
                                    )}
                                    {keyStatus === 'invalid' && (
                                        <div className="flex items-center text-red-400">
                                            <XCircle className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                <button
                                    onClick={handleTestGeminiKey}
                                    disabled={testingKey || !geminiApiKey.trim()}
                                    className="px-6 py-3 rounded-xl bg-purple-600/50 hover:bg-purple-600 text-white font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {testingKey ? 'Testing...' : 'Test Key'}
                                </button>
                                <button
                                    onClick={handleSaveGeminiKey}
                                    disabled={savingKey || !geminiApiKey.trim()}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {savingKey ? 'Saving...' : 'Save Key'}
                                </button>
                                {geminiApiKey && (
                                    <button
                                        onClick={handleResetGeminiKey}
                                        className="px-6 py-3 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 font-medium border border-red-500/50 transition-all"
                                    >
                                        Reset to Global Key
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chatbot Configuration */}
                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold mb-8 text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                            Chatbot Configuration
                        </h2>

                        <form onSubmit={handleSave} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Display Name</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3 px-4 transition-all"
                                            value={settings.displayName}
                                            onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
                                            placeholder="e.g. Acme Support AI"
                                        />
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity"></div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Persona Tone</label>
                                    <div className="relative">
                                        <select
                                            className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3 px-4 transition-all appearance-none"
                                            value={settings.chatbotTone}
                                            onChange={(e) => setSettings({ ...settings, chatbotTone: e.target.value })}
                                        >
                                            <option value="professional">Professional & Formal</option>
                                            <option value="friendly">Friendly & Casual</option>
                                            <option value="concise">Concise & Direct</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">System Instructions</label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Define specific behaviors, constraints, or knowledge scope for your AI agent.
                                </p>
                                <div className="relative group">
                                    <textarea
                                        rows={6}
                                        className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent py-3 px-4 transition-all text-sm leading-relaxed resize-none"
                                        value={settings.systemInstructions}
                                        onChange={(e) => setSettings({ ...settings, systemInstructions: e.target.value })}
                                        placeholder="You are a helpful support agent. You only answer questions about our products..."
                                    />
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 group-focus-within:opacity-50 transition-opacity"></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                <span className="text-sm">
                                    {message && (
                                        <span className="inline-flex items-center text-green-600 dark:text-green-400 font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30">
                                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                            {message}
                                        </span>
                                    )}
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-indigo-600 dark:to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-[1px] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving Changes...' : 'Save Configuration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
