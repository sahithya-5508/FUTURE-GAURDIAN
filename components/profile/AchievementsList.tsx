
import React from 'react';
import { ACHIEVEMENTS_LIST } from '../../constants';
import { useLocalization } from '../../hooks/useLocalization';

interface AchievementsListProps {
    unlockedAchievementIds: string[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({ unlockedAchievementIds }) => {
    const { t } = useLocalization();
    const unlockedAchievements = ACHIEVEMENTS_LIST.filter(ach => unlockedAchievementIds.includes(ach.id));

    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">{t('achievements')}</h2>
            {unlockedAchievements.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {unlockedAchievements.map(ach => (
                        <div key={ach.id} className="group relative flex flex-col items-center text-center p-4 bg-lime-50 rounded-lg border border-lime-200 transition-transform transform hover:scale-105 hover:shadow-xl">
                            <span className="text-5xl drop-shadow-md">{ach.icon}</span>
                            <p className="font-bold text-sm mt-2 text-lime-800">{t(ach.nameKey)}</p>
                            <div className="absolute inset-0 bg-black/80 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center">
                                <p className="text-xs font-semibold">{t(ach.nameKey)}</p>
                                <p className="text-xs italic mt-1">"{t(ach.quoteKey)}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AchievementsList;
