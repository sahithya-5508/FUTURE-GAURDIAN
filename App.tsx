
import React, { useState, useEffect, useMemo } from 'react';
import { useUserData } from './hooks/useUserData';
import { LocalizationProvider, useLocalization } from './hooks/useLocalization';
import { Page, UserData, Achievement, ActionToLog } from './types';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Profile from './components/profile/Profile';
import MyGarden from './components/garden/MyGarden';
import Leaderboard from './components/leaderboard/Leaderboard';
import Friends from './components/friends/Friends';
import AchievementModal from './components/common/AchievementModal';
import MysteryBoxModal from './components/common/MysteryBoxModal';
import NotificationToast from './components/common/NotificationToast';

const FloatingBubbles: React.FC = () => {
    const bubbles = useMemo(() => Array.from({ length: 20 }).map((_, i) => {
        const size = `${Math.random() * 80 + 20}px`;
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 15 + 10}s`;
        const animationDelay = `${Math.random() * 5}s`;
        return (
            <div
                key={i}
                className="bubble"
                style={{
                    width: size,
                    height: size,
                    left,
                    animationDuration,
                    animationDelay,
                }}
            />
        );
    }), []);
    return <div className="absolute top-0 left-0 w-full h-full -z-10">{bubbles}</div>;
};


const AppContent: React.FC = () => {
    const { user, loading, logActions, updateUser, addFriend } = useUserData();
    const { t } = useLocalization();
    const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
    const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
    const [showMysteryBox, setShowMysteryBox] = useState(false);
    const [notification, setNotification] = useState<{ achievement: Achievement } | null>(null);


    useEffect(() => {
        if (!loading && !user.profile.avatar) {
            setCurrentPage(Page.Profile);
        }
    }, [loading, user.profile.avatar]);

    const handleLogActions = (actions: ActionToLog[]) => {
        const { shouldShowMysteryBox, newlyEarnedAchievements } = logActions(actions);
        
        if (newlyEarnedAchievements && newlyEarnedAchievements.length > 0) {
            // Show notification for the first new achievement, preventing stacking
            if (!notification && !newAchievement) {
                setNotification({ achievement: newlyEarnedAchievements[0] });
            }
        }
        if (shouldShowMysteryBox) {
            setShowMysteryBox(true);
        }
    };
    
    const handleUpdateUser = (updatedUserData: Partial<UserData['profile']>) => {
        updateUser(updatedUserData);
        if (updatedUserData.avatar && currentPage === Page.Profile) {
            setCurrentPage(Page.Dashboard);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-green-100"><div className="text-2xl font-bold text-green-700">{t('loading_eco_journey')}</div></div>;
    }

    const renderPage = () => {
        switch (currentPage) {
            case Page.Dashboard:
                return <Dashboard user={user} onLogActions={handleLogActions} />;
            case Page.Profile:
                return <Profile user={user} onUpdateUser={handleUpdateUser} />;
            case Page.MyGarden:
                return <MyGarden user={user} />;
            case Page.Leaderboard:
                return <Leaderboard currentUser={user.profile} friends={user.friends} stats={user.stats} />;
            case Page.Friends:
                return <Friends user={user} onAddFriend={addFriend} />;
            default:
                return <Dashboard user={user} onLogActions={handleLogActions} />;
        }
    };

    return (
        <div className="min-h-screen bubbles-bg transition-colors duration-1000">
            <FloatingBubbles />
            <div className="relative z-10">
                {user.profile.avatar && <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />}
                <main className="p-4 md:p-8">
                    {renderPage()}
                </main>
                {notification && (
                    <NotificationToast
                        achievement={notification.achievement}
                        onView={() => {
                            setNewAchievement(notification.achievement);
                            setNotification(null);
                        }}
                        onClose={() => setNotification(null)}
                    />
                )}
                {newAchievement && (
                    <AchievementModal
                        achievement={newAchievement}
                        userName={user.profile.name}
                        onClose={() => setNewAchievement(null)}
                    />
                )}
                {showMysteryBox && (
                    <MysteryBoxModal onClose={() => setShowMysteryBox(false)} />
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <LocalizationProvider>
            <AppContent />
        </LocalizationProvider>
    );
};

export default App;