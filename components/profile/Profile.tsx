import React, { useState, useEffect } from 'react';
import { UserData } from '../../types';
import { COUNTRIES } from '../../constants';
import AvatarCreator from './AvatarCreator';
import DefaultHabits from './DefaultHabits';
import GoalSetter from './GoalSetter';
import AchievementsList from './AchievementsList';
import { useLocalization } from '../../hooks/useLocalization';

interface ProfileProps {
    user: UserData;
    onUpdateUser: (updatedUser: Partial<UserData['profile']>) => void;
}

const Profile: React.FC<ProfileProps> = ({ user: userData, onUpdateUser }) => {
    const { profile, unlockedAchievements } = userData;
    const [name, setName] = useState(profile.name);
    const [nickname, setNickname] = useState(profile.nickname);
    const [country, setCountry] = useState(profile.country);
    const [avatar, setAvatar] = useState(profile.avatar);
    const [defaults, setDefaults] = useState(profile.defaults);
    const [weeklyGoal, setWeeklyGoal] = useState(profile.weeklyGoal);
    const [timeLeft, setTimeLeft] = useState('');
    const { t } = useLocalization();

    const isLocked = profile.profileLockedUntil && new Date(profile.profileLockedUntil) > new Date();

    useEffect(() => {
        if (!isLocked) return;

        const interval = setInterval(() => {
            const now = new Date();
            const unlockTime = new Date(profile.profileLockedUntil!);
            const diff = unlockTime.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft('');
                clearInterval(interval);
                // This state update will trigger a re-render to unlock fields
                // A full reload is a bit disruptive
                onUpdateUser({ ...profile, profileLockedUntil: null });
            } else {
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / 1000 / 60) % 60);
                const seconds = Math.floor((diff / 1000) % 60);
                setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [profile.profileLockedUntil, isLocked]);

    const handleUpdate = () => {
        if (!avatar) {
            alert(t('choose_avatar_alert'));
            return;
        }
        if (!nickname.trim() || !name.trim()) {
            alert(t('name_nickname_empty_alert'));
            return;
        }
        onUpdateUser({ name, nickname, country, avatar, defaults, weeklyGoal });
        alert(t('profile_updated_alert'));
    };
    
    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 disabled:bg-gray-200 disabled:cursor-not-allowed";

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20 md:pb-8">
            {!profile.avatar && (
                 <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-r-lg" role="alert">
                    <p className="font-bold">{t('welcome_banner_title')}</p>
                    <p>{t('welcome_banner_text')}</p>
                </div>
            )}

            {isLocked && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-center" role="alert">
                    <p className="font-bold">{t('profile_locked')}</p>
                    <p>{t('unlocks_in')} <span className="font-mono font-bold text-lg">{timeLeft}</span></p>
                </div>
            )}
            
            <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">My Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">{t('name_label')}</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLocked} className={inputClasses} />
                    </div>
                     <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">{t('nickname')}</label>
                        <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} disabled={isLocked} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700">{t('country_label')}</label>
                        <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} disabled={isLocked} className={inputClasses}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <AvatarCreator currentAvatar={avatar} onAvatarChange={setAvatar} isLocked={isLocked}/>
            <AchievementsList unlockedAchievementIds={unlockedAchievements} />
            <DefaultHabits defaults={defaults} onDefaultsChange={setDefaults} isLocked={isLocked}/>
            <GoalSetter weeklyGoal={weeklyGoal} onGoalChange={setWeeklyGoal} isLocked={isLocked}/>
            
            <button
                onClick={handleUpdate}
                disabled={isLocked}
                className="w-full bg-green-500 text-white font-bold py-4 px-4 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
                {profile.avatar ? t('lock_in_my_vibe') : `${t('create_avatar')} ${t('start_journey_button')}`}
            </button>
        </div>
    );
};

export default Profile;