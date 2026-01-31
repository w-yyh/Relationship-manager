import React from 'react';
import { Box, Settings as SettingsIcon, Users, BarChart3, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function Layout({ children, activeTab, onTabChange }) {
    const { t } = useLanguage();
    const { logout } = useAuth();
    
    const tabs = [
        { id: 'visualization', label: t('layout.visualization'), icon: Box },
        { id: 'dashboard', label: t('layout.dashboard'), icon: BarChart3 },
        { id: 'contacts', label: t('layout.contacts'), icon: Users },
    ];

    return (
        <div className="flex h-screen w-full bg-black text-white overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-16 md:w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col items-center md:items-start p-4 backdrop-blur-sm z-50">
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                    <span className="text-lg font-bold hidden md:block tracking-tighter">{t('layout.title')}</span>
                </div>

                <nav className="flex-1 w-full space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <Icon size={20} className={cn("transition-transform", isActive ? "scale-110" : "group-hover:scale-110")} />
                                <span className="hidden md:block font-medium">{tab.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto pt-4 border-t border-zinc-800 w-full space-y-2">
                    <button
                        onClick={() => onTabChange('settings')}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 transition-colors",
                            activeTab === 'settings' ? "text-white bg-zinc-800 rounded" : "text-zinc-500 hover:text-white"
                        )}
                    >
                        <SettingsIcon size={20} />
                        <span className="hidden md:block text-sm">{t('layout.settings')}</span>
                    </button>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="hidden md:block text-sm">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
                {children}
            </div>
        </div>
    );
}
