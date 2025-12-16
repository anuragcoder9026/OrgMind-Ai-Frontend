import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { ChevronLeft, ChevronRight, Calendar, Search, TrendingUp, MessageSquare, Clock, Save, Check, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import toast, { Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Analytics() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 0
    });
    const [dateFilter, setDateFilter] = useState('all');
    const [editingResponses, setEditingResponses] = useState({});
    const [savingIds, setSavingIds] = useState(new Set());
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchLogs();
    }, [pagination.page, dateFilter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/chat/logs', {
                params: {
                    page: pagination.page,
                    limit: pagination.limit,
                    dateFilter
                }
            });
            setLogs(response.data.logs);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleDateFilterChange = (filter) => {
        setDateFilter(filter);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleResponseChange = (logId, value) => {
        setEditingResponses(prev => ({
            ...prev,
            [logId]: value
        }));
    };

    const handleSaveFeedback = async (log) => {
        const correctResponse = editingResponses[log._id];

        if (!correctResponse || !correctResponse.trim()) {
            toast.error('Please enter a correct response');
            return;
        }

        setSavingIds(prev => new Set(prev).add(log._id));

        try {
            await api.post('/chat/feedback', {
                questionId: log._id,
                userQuestion: log.userQuestion,
                correctResponse: correctResponse.trim()
            });

            toast.success('Correct response saved to knowledge base!');

            // Clear the editing state for this log
            setEditingResponses(prev => {
                const newState = { ...prev };
                delete newState[log._id];
                return newState;
            });
        } catch (error) {
            console.error('Error saving feedback:', error);
            toast.error('Failed to save response');
        } finally {
            setSavingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(log._id);
                return newSet;
            });
        }
    };

    const formatDate = (date) => {
        try {
            return format(new Date(date), 'MMM dd, yyyy HH:mm');
        } catch (e) {
            return 'Invalid date';
        }
    };

    // Custom markdown components for rich formatting
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
            return <thead className="bg-gray-50 dark:bg-gray-800">{children}</thead>;
        },
        th({ children }) {
            return <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">{children}</th>;
        },
        tr({ children }) {
            return <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">{children}</tr>;
        },
        td({ children }) {
            return <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{children}</td>;
        },
        a({ href, children }) {
            return (
                <a href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                </a>
            );
        }
    };

    const filterButtons = [
        { label: 'All Time', value: 'all', icon: Calendar },
        { label: 'Today', value: 'today', icon: Clock },
        { label: 'Last Week', value: 'week', icon: TrendingUp },
        { label: 'Last Month', value: 'month', icon: TrendingUp }
    ];

    return (
        <div className="min-h-screen">
            <Toaster position="top-right" />

            {/* Header Section with Gradient */}
            <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white">Analytics Dashboard</h1>
                    </div>
                    <p className="text-white/90 text-lg">
                        Track user interactions and improve responses
                    </p>
                </div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <MessageSquare className="w-8 h-8 text-white/80" />
                            <span className="text-2xl font-bold text-white">{pagination.total}</span>
                        </div>
                        <p className="text-white/90 font-medium">Total Queries</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <Calendar className="w-8 h-8 text-white/80" />
                            <span className="text-2xl font-bold text-white">{pagination.page}</span>
                        </div>
                        <p className="text-white/90 font-medium">Current Page</p>
                    </div>
                </div>

                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <TrendingUp className="w-8 h-8 text-white/80" />
                            <span className="text-2xl font-bold text-white">{pagination.totalPages}</span>
                        </div>
                        <p className="text-white/90 font-medium">Total Pages</p>
                    </div>
                </div>
            </div>

            {/* Filters Section */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider">Filter by Date</h3>
                <div className="flex flex-wrap gap-3">
                    {filterButtons.map(({ label, value, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => handleDateFilterChange(value)}
                            className={`group relative overflow-hidden px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${dateFilter === value
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{label}</span>
                            {dateFilter === value && (
                                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table Section */}
            {loading ? (
                <div className="flex items-center justify-center py-32 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                    <div className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Loading analytics data...</p>
                    </div>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-32 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <Search className="w-24 h-24 text-gray-300 dark:text-gray-600" />
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-xl font-semibold mb-2">No queries found</p>
                    <p className="text-gray-500 dark:text-gray-500">Try selecting a different date filter</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-1/5">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4" />
                                            Date & Time
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-2/5">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            User Question
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-2/5">
                                        <div className="flex items-center gap-2">
                                            <Save className="w-4 h-4" />
                                            Provide Correct Response
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                                {logs.map((log, index) => {
                                    const isSaving = savingIds.has(log._id);
                                    const currentResponse = editingResponses[log._id] || '';

                                    return (
                                        <tr
                                            key={log._id || index}
                                            className="group hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-gray-700 dark:hover:to-gray-700 transition-all duration-200"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full group-hover:scale-150 transition-transform"></div>
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {formatDate(log.timestamp)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm text-gray-900 dark:text-gray-100 font-medium mb-2">
                                                        {log.userQuestion}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedResponse(log.botResponse);
                                                            setIsModalOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-all duration-200 hover:scale-105"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        View Response
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <textarea
                                                        value={currentResponse}
                                                        onChange={(e) => handleResponseChange(log._id, e.target.value)}
                                                        placeholder="Enter the correct response..."
                                                        rows={3}
                                                        className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                                    />
                                                    <div className="">
                                                        <button
                                                            onClick={() => handleSaveFeedback(log)}
                                                            disabled={isSaving || !currentResponse.trim()}
                                                            className="mt-12 px-3 py-2 text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 whitespace-nowrap"
                                                        >
                                                            {isSaving ? (
                                                                <>
                                                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                    <span>Saving...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save className="w-3.5 h-3.5" />
                                                                    <span>Save</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                Showing <span className="font-bold text-indigo-600 dark:text-indigo-400">{((pagination.page - 1) * pagination.limit) + 1}</span> to <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-bold text-indigo-600 dark:text-indigo-400">{pagination.total}</span> results
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="p-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 hover:scale-110"
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                        let pageNum;
                                        if (pagination.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (pagination.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (pagination.page >= pagination.totalPages - 2) {
                                            pageNum = pagination.totalPages - 4 + i;
                                        } else {
                                            pageNum = pagination.page - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`min-w-[40px] px-4 py-2 rounded-xl font-semibold transition-all duration-200 hover:scale-110 ${pagination.page === pageNum
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-110'
                                                    : 'border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.totalPages}
                                    className="p-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-indigo-50 dark:hover:bg-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 hover:scale-110"
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Bot Response Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bot Response</h3>
                            </div>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={markdownComponents}
                                className="prose prose-sm dark:prose-invert max-w-none"
                            >
                                {selectedResponse || 'No response available'}
                            </ReactMarkdown>
                        </div>


                    </div>
                </div>
            )}
        </div>
    );
}
