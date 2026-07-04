import React, { useState } from 'react';
import { UserData } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface FriendsProps {
    user: UserData;
    onAddFriend: (name: string) => void;
}

const Friends: React.FC<FriendsProps> = ({ user, onAddFriend }) => {
    const { t } = useLocalization();
    const [newFriendName, setNewFriendName] = useState('');

    const handleAddFriend = (e: React.FormEvent) => {
        e.preventDefault();
        if (newFriendName.trim()) {
            onAddFriend(newFriendName.trim());
            setNewFriendName('');
        }
    };
    
    return (
        <div className="max-w-3xl mx-auto pb-20 md:pb-8">
            <h1 className="text-4xl font-bold text-green-800 font-pixel text-center mb-2">{t('friends')}</h1>
            <p className="text-center text-gray-600 mb-8">{t('friends_slogan')}</p>

            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg mb-8">
                <h2 className="text-xl font-bold text-green-700 mb-4">{t('add_a_friend')}</h2>
                <form onSubmit={handleAddFriend} className="flex gap-4">
                    <input
                        type="text"
                        value={newFriendName}
                        onChange={(e) => setNewFriendName(e.target.value)}
                        placeholder={t('enter_friend_name_placeholder')}
                        className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                        type="submit"
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-transform transform hover:scale-105 shadow"
                    >
                        {t('add_button')}
                    </button>
                </form>
                 <p className="text-xs text-gray-500 mt-2">{t('add_friend_simulation_note')}</p>
            </div>

            <div className="space-y-4">
                {user.friends.map(friend => (
                     <div key={friend.id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-4 flex items-center gap-4">
                        <div className="w-16 h-16 bg-lime-100 rounded-full flex items-center justify-center text-4xl flex-shrink-0 border-2 border-white">
                           <div className="transform scale-125">{friend.avatar.gender === 'male' ? '👨‍🌾' : '👩‍🌾'}</div>
                        </div>
                        <div className="flex-grow">
                            <p className="font-bold text-lg text-green-800">{friend.name}</p>
                            <p className="text-sm text-gray-600">"{friend.nickname}"</p>
                        </div>
                         <div className="text-right">
                             <p className="font-bold text-green-600 font-pixel text-lg">{friend.points} pts</p>
                             <p className="text-sm text-orange-500 font-semibold">{t('day_streak').replace('{value}', String(friend.streak))} 🔥</p>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Friends;