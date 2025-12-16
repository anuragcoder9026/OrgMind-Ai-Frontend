import { useState, useRef, useEffect } from 'react';
import api from '../../api/axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Bot, User, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChatPreview() {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            // Use fetch for streaming support since axios doesn't handle streams in browsers
            const token = localStorage.getItem('token');
            const response = await fetch('https://orgmind-ai-backend.onrender.com/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({ role: m.role === 'assistant' ? 'system' : 'user', content: m.content }))
                })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') break;

                        try {
                            const parsed = JSON.parse(data);

                            // Check if it's an error message
                            if (parsed.error) {
                                const errorText = parsed.statusText || parsed.message || 'An error occurred';
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = errorText;
                                    newMessages[newMessages.length - 1].isError = true;
                                    return newMessages;
                                });
                            } else if (parsed.content) {
                                assistantMessage += parsed.content;

                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    newMessages[newMessages.length - 1].content = assistantMessage;

                                    return newMessages;
                                });
                            }
                        } catch (e) {
                            console.error('Error parsing stream', e);
                        }
                    }
                }
            }
            console.log('Assistant message:', assistantMessage);
        } catch (error) {
            console.error('Chat error', error);
            const errorMessage = error.statusText || error.message || 'Sorry, something went wrong.';
            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage, isError: true }]);
        } finally {
            setLoading(false);
        }
    };

    // Handle copy message to clipboard
    const handleCopyMessage = (content, index) => {
        navigator.clipboard.writeText(content).then(() => {
            setCopiedIndex(index);
            toast.success('Message copied to clipboard!');
            setTimeout(() => setCopiedIndex(null), 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy message');
        });
    };

    // Custom markdown components with better syntax highlighting
    const markdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            return !inline && language ? (
                <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={language}
                    PreTag="div"
                    className="rounded-lg my-3"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            ) : (
                <code className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400" {...props}>
                    {children}
                </code>
            );
        },
        table({ children }) {
            return (
                <div className="overflow-x-auto my-4">
                    <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700 border border-gray-300 dark:border-gray-700">
                        {children}
                    </table>
                </div>
            );
        },
        thead({ children }) {
            return (
                <thead className="bg-gray-100 dark:bg-gray-800">
                    {children}
                </thead>
            );
        },
        th({ children }) {
            return (
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b-2 border-gray-400 dark:border-gray-600">
                    {children}
                </th>
            );
        },
        tr({ children }) {
            return (
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    {children}
                </tr>
            );
        },
        td({ children }) {
            return (
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                    {children}
                </td>
            );
        },
        ul({ children }) {
            return (
                <ul className="list-disc list-inside my-2 space-y-1">
                    {children}
                </ul>
            );
        },
        ol({ children }) {
            return (
                <ol className="list-decimal list-inside my-2 space-y-1">
                    {children}
                </ol>
            );
        },
        li({ children }) {
            return (
                <li className="text-sm">
                    {children}
                </li>
            );
        },
        p({ children }) {
            return (
                <p className="my-2 leading-relaxed">
                    {children}
                </p>
            );
        },
        h1({ children }) {
            return (
                <h1 className="text-2xl font-bold my-3">
                    {children}
                </h1>
            );
        },
        h2({ children }) {
            return (
                <h2 className="text-xl font-bold my-2">
                    {children}
                </h2>
            );
        },
        h3({ children }) {
            return (
                <h3 className="text-lg font-semibold my-2">
                    {children}
                </h3>
            );
        },
        blockquote({ children }) {
            return (
                <blockquote className="border-l-4 border-indigo-500 pl-4 italic my-2 text-gray-700 dark:text-gray-300">
                    {children}
                </blockquote>
            );
        },
        a({ href, children }) {
            return (
                <a href={href} className="text-indigo-600 dark:text-indigo-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        },
        strong({ children }) {
            return (
                <strong className="font-bold text-gray-900 dark:text-gray-100">
                    {children}
                </strong>
            );
        },
        em({ children }) {
            return (
                <em className="italic">
                    {children}
                </em>
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-xl overflow-hidden relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 shrink-0 flex items-center justify-between bg-white/40 dark:bg-gray-900/40">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Bot className="w-6 h-6 text-indigo-500" />
                        Chat Preview
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Test your chatbot interactivity and responses.</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium border border-green-200 dark:border-green-800 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Live Mode
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth bg-gray-50/50 dark:bg-gray-900/50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 md:gap-4`}
                        >
                            <div
                                className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${msg.role === 'user'
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                    : 'bg-white dark:bg-gray-800 text-indigo-500 border border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-6 w-6" />}
                            </div>
                            <div
                                className={`p-5 rounded-3xl shadow-md backdrop-blur-sm text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : msg.isError
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-tl-sm border-2 border-red-300 dark:border-red-700'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700'
                                    }`}
                            >
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={markdownComponents}
                                >
                                    {msg.content}
                                </ReactMarkdown>

                                {/* Copy Button */}
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => handleCopyMessage(msg.content, index)}
                                        className={`p-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 text-xs ${msg.role === 'user'
                                            ? 'hover:bg-white/20 text-white/80 hover:text-white'
                                            : msg.isError
                                                ? 'hover:bg-red-100 dark:hover:bg-red-800/30 text-red-500 dark:text-red-400'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
                                            }`}
                                        title="Copy message"
                                    >
                                        {copiedIndex === index ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Copied!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex flex-row items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-gray-800 text-indigo-500 border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg">
                                <Bot className="h-6 w-6" />
                            </div>
                            <div className="bg-white dark:bg-gray-800 px-6 py-4 rounded-3xl rounded-tl-sm border border-gray-100 dark:border-gray-700 shadow-sm flex items-center space-x-2">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-100"></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-200"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md">
                <div className="relative flex items-center gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your documents..."
                        className="flex-1 rounded-2xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white shadow-inner focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 py-4 px-6 border transition-all placeholder-gray-400"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/40 transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="h-6 w-6" />
                    </button>
                </div>
            </form>
        </div>
    );
}
