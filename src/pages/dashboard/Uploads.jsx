import { useEffect, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../../api/axios';
import { Trash2, File, Link as LinkIcon, Loader } from 'lucide-react';

export default function Uploads() {
    const [documents, setDocuments] = useState([]);
    const [url, setUrl] = useState('');
    const [fileUploading, setFileUploading] = useState(false);
    const [urlUploading, setUrlUploading] = useState(false);

    const fetchDocs = async () => {
        try {
            const { data } = await api.get('/upload');
            setDocuments(data);
        } catch (error) {
            console.error('Error fetching docs', error);
        }
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        setFileUploading(true);
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);

        try {
            await api.post('/upload/file', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchDocs();
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setFileUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleUrlUpload = async (e) => {
        e.preventDefault();
        if (!url) return;
        setUrlUploading(true);
        try {
            await api.post('/upload/url', { url });
            setUrl('');
            fetchDocs();
        } catch (error) {
            console.error('URL upload failed', error);
        } finally {
            setUrlUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await api.delete(`/upload/${id}`);
            fetchDocs();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    return (
        <div className="space-y-8 w-full pb-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Knowledge Base
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* File Upload */}
                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 flex flex-col">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <File className="w-5 h-5" />
                        </span>
                        Upload File
                    </h2>
                    <div
                        {...getRootProps()}
                        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 group ${isDragActive
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 scale-[1.02]'
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-400 hover:bg-gray-50/50 dark:hover:bg-gray-700/30'
                            }`}
                    >
                        <input {...getInputProps()} />
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-lg ${isDragActive ? 'bg-indigo-500 text-white' : 'bg-white dark:bg-gray-700 text-indigo-500 dark:text-indigo-400 group-hover:scale-110'}`}>
                            {fileUploading ? (
                                <Loader className="w-8 h-8 animate-spin" />
                            ) : (
                                <File className="w-8 h-8" />
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {isDragActive ? 'Drop it here!' : 'Click or drop file'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, TXT, CSV (Max 10MB)</p>
                    </div>
                </div>

                {/* URL Upload */}
                <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl p-8 rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 flex flex-col">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <LinkIcon className="w-5 h-5" />
                        </span>
                        Add Website URL
                    </h2>
                    <form onSubmit={handleUrlUpload} className="space-y-6 flex-1 flex flex-col justify-center">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Website URL</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    type="url"
                                    className="block w-full pl-11 pr-4 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-400"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={urlUploading}
                            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {urlUploading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    Start Scraping
                                    <span className="px-2 py-0.5 bg-white/20 rounded text-xs">BETA</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Document List */}
            <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden">
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Uploaded Resources</h3>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                        {documents.length} Items
                    </span>
                </div>
                <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                    {documents.map((doc) => (
                        <li key={doc._id} className="p-6 flex items-center justify-between hover:bg-white/40 dark:hover:bg-gray-700/30 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${doc.type === 'file'
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                    : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                    }`}>
                                    {doc.type === 'file' ? <File className="h-6 w-6" /> : <LinkIcon className="h-6 w-6" />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md">{doc.filename}</p>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span className={`px-2 py-0.5 rounded-md font-medium ${doc.status === 'processed'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                            }`}>
                                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                        </span>
                                        <span>• {new Date(doc.createdAt).toLocaleDateString()}</span>
                                        <span>• {doc.chunkCount} chunks</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(doc._id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                                title="Delete"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </li>
                    ))}
                    {documents.length === 0 && (
                        <li className="p-12 text-center flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                                <File className="w-8 h-8" />
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No documents uploaded yet</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Upload a file or add a URL to get started</p>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
