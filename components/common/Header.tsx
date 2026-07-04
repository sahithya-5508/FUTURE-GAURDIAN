
import React from 'react';
import { Page } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
    const { language, setLanguage, t } = useLocalization();

    const navItems = [
        { page: Page.Dashboard, label: t('dashboard'), icon: '📊' },
        { page: Page.MyGarden, label: t('my_garden'), icon: '🌳' },
        { page: Page.Leaderboard, label: t('leaderboard'), icon: '🏆' },
        { page: Page.Friends, label: t('friends'), icon: '🧑‍🤝‍🧑' },
        { page: Page.Profile, label: t('profile'), icon: '👤' },
    ];
    
    const languages: { id: 'en' | 'ta' | 'hi', label: string }[] = [
        { id: 'en', label: 'EN' },
        { id: 'ta', label: 'த' },
        { id: 'hi', label: 'हि' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-md sticky top-0 z-50 p-2">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-xl md:text-2xl font-bold text-green-700 font-pixel tracking-tighter">
                    FUTURE GAURDIAN
                </div>
                <nav className="hidden md:flex items-center space-x-2">
                    {navItems.map(item => (
                        <button
                            key={item.page}
                            onClick={() => setCurrentPage(item.page)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                                currentPage === item.page
                                    ? 'bg-green-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:bg-green-100'
                            }`}
                        >
                           {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                 <div className="flex items-center bg-gray-200/80 rounded-full p-1 shadow-inner">
                    {languages.map(lang => (
                        <button
                            key={lang.id}
                            onClick={() => setLanguage(lang.id)}
                            className={`w-9 h-9 rounded-full text-sm font-bold transition-all duration-300 transform flex items-center justify-center ${
                                language === lang.id
                                ? 'bg-white text-green-600 shadow-md scale-110'
                                : 'text-gray-500 hover:bg-white/50'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-[0_-2px_5px_rgba(0,0,0,0.1)] flex justify-around p-2 z-50">
                 {navItems.map(item => (
                    <button
                        key={item.page}
                        onClick={() => setCurrentPage(item.page)}
                        className={`flex flex-col items-center w-1/5 text-xs transition-colors duration-200 ${
                            currentPage === item.page ? 'text-green-600' : 'text-gray-500'
                        }`}
                        aria-label={item.label}
                    >
                       <span className="text-2xl">{item.icon}</span>
                       <span className="text-center">{item.label}</span>
                    </button>
                ))}
            </div>
        </header>
    );
};

export default Header;
