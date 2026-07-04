import React, { useState, useMemo } from 'react';
import { UserProfile, FriendProfile, UserStats } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface LeaderboardProps {
    currentUser: UserProfile;
    friends: FriendProfile[];
    stats: UserStats;
}

const mockGlobalData = [
    { id: 99, name: 'Alex Green', nickname: 'Leafy', points: 7250, streak: 12, avatar: { gender: 'male' } },
    { id: 100, name: 'Terra Bloom', nickname: 'FlowerPower', points: 6800, streak: 25, avatar: { gender: 'female' } },
    { id: 101, name: 'River Stone', nickname: 'Stoney', points: 6100, streak: 5, avatar: { gender: 'male' } },
    { id: 102, name: 'Sam Woods', nickname: 'Woody', points: 5500, streak: 8, avatar: { gender: 'male' } },
    { id: 103, name: 'Lily Pad', nickname: 'Pads', points: 4900, streak: 15, avatar: { gender: 'female' } },
    { id: 104, name: 'Kai Ocean', nickname: 'Wave', points: 4200, streak: 3, avatar: { gender: 'male' } },
    { id: 105, name: 'Willow Breeze', nickname: 'Windy', points: 3500, streak: 30, avatar: { gender: 'female' } },
].sort((a, b) => b.points - a.points);


const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser, friends, stats }) => {
    const { t } = useLocalization();
    const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
    
    const userAsFriend: FriendProfile = {
        id: 0,
        name: currentUser.name,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar!,
        points: stats.totalPoints,
        streak: stats.streak,
    };

    const sortedFriends = useMemo(() => [...friends, userAsFriend].sort((a, b) => b.points - a.points), [friends, stats.totalPoints]);
    
    const combinedGlobal = useMemo(() => {
        const globalWithoutUser = mockGlobalData.filter(u => u.name !== currentUser.name);
        return [...globalWithoutUser, userAsFriend].sort((a, b) => b.points - a.points);
    }, [mockGlobalData, stats.totalPoints]);

    const dataToShow = activeTab === 'global' ? combinedGlobal : sortedFriends;
    const hero = dataToShow[0];

    const rankIcons = ['🏆', '🥈', '🥉'];

    return (
        <div className="max-w-3xl mx-auto pb-20 md:pb-8">
            <h1 className="text-4xl font-bold text-green-800 font-pixel text-center mb-2">{t('leaderboard')}</h1>
            <p className="text-center text-gray-600 mb-6">{t('leaderboard_slogan')}</p>

            <div className="flex justify-center mb-6">
                <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full shadow-md">
                    <button onClick={() => setActiveTab('global')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'global' ? 'bg-green-500 text-white shadow' : 'text-gray-600'}`}>🌍 {t('global')}</button>
                    <button onClick={() => setActiveTab('friends')} className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'friends' ? 'bg-green-500 text-white shadow' : 'text-gray-600'}`}>🧑‍🤝‍🧑 {t('friends')}</button>
                </div>
            </div>

            {hero && hero.avatar && (
                <div className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-400 p-6 rounded-2xl shadow-xl mb-8 text-center relative overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <div className="absolute -top-4 -right-4 text-8xl opacity-10 rotate-12">🏆</div>
                     <div className="absolute -bottom-8 -left-8 text-9xl opacity-10 rotate-12">🌿</div>
                    <h2 className="text-2xl font-bold text-yellow-900 drop-shadow-sm">{t('green_hero_of_the_month')}</h2>
                    <div className="flex items-center justify-center gap-4 mt-4">
                        <div className="w-20 h-20 bg-lime-200 rounded-full flex items-center justify-center text-5xl border-4 border-white/80 shadow-lg">
                            <div className="transform scale-150">{hero.avatar.gender === 'male' ? '👨‍🌾' : '👩‍🌾'}</div>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-yellow-900">{hero.name}</p>
                            <p className="text-3xl font-pixel text-white drop-shadow-md">{hero.points} pts</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-4 space-y-3">
                {dataToShow.map((user, index) => user.avatar && (
                    <div key={user.id} className={`flex items-center p-3 rounded-xl transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 ${
                        user.name === currentUser.name ? 'ring-2 ring-green-500 bg-green-50' : ''
                    } ${
                        index < 3 ? 'bg-gradient-to-r from-green-100 to-lime-100 border-l-4' : 'bg-white/60'
                    } ${index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-300' : index === 2 ? 'border-yellow-600' : 'border-transparent'}`}>
                        <span className="text-2xl font-bold text-gray-500 w-12 text-center">{rankIcons[index] || index + 1}</span>
                         <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                           <div className="transform scale-125">{user.avatar.gender === 'male' ? '👨‍🌾' : '👩‍🌾'}</div>
                        </div>
                        <div className="ml-4 flex-grow">
                             <p className="font-semibold text-gray-800">{user.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-center">
                                <span className="font-bold text-orange-500">{user.streak}</span>
                                <span className="text-gray-500"> 🔥</span>
                            </div>
                            <p className="font-bold text-green-600 font-pixel w-24 text-right">{user.points} pts</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Leaderboard;