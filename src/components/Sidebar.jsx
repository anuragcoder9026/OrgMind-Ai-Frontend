import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Upload, Settings, MessageSquare, LogOut, Sun, Moon, Bot, BarChart3 } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../context/ThemeContext';

const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Documents', href: '/dashboard/uploads', icon: Upload },
    { name: 'Chat Preview', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar({ onNavigate }) {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="flex flex-col w-64 bg-gray-800 dark:bg-gray-900 min-h-screen text-white transition-colors duration-200 border-r border-gray-700 dark:border-gray-800">
            <div className="flex items-center justify-center h-16 border-b border-gray-700 dark:border-gray-800">
                <Bot className="h-8 w-8 mr-2 text-indigo-600 dark:text-indigo-400" />
                <Link to={`/`} className="text-xl font-bold">OrgMind AI</Link>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={onNavigate}
                            className={clsx(
                                'flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors',
                                location.pathname === item.href
                                    ? 'bg-gray-900 dark:bg-gray-800 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800'
                            )}
                        >
                            <Icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-700 dark:border-gray-800 space-y-2">
                <button
                    onClick={toggleTheme}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                >
                    {theme === 'light' ? <Moon className="mr-3 h-5 w-5" /> : <Sun className="mr-3 h-5 w-5" />}
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </button>
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
                >
                    <LogOut className="mr-3 h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
