
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';

interface PointsTrackerProps {
    totalPoints: number;
    weeklyGoal: number;
    streak: number;
}

const PointsTracker: React.FC<PointsTrackerProps> = ({ totalPoints, weeklyGoal, streak }) => {
    const { t } = useLocalization();
    const weeklyPoints = totalPoints % weeklyGoal; // Example logic, can be improved
    const progress = weeklyGoal > 0 ? Math.min(weeklyPoints / weeklyGoal * 100, 100) : 0;
    
    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-600">{t('total_points')}</h2>
                    <p className="text-4xl md:text-5xl font-bold text-green-600 font-pixel">{totalPoints}</p>
                </div>
                <div className="md:col-span-1">
                     <h2 className="text-lg font-semibold text-gray-600">{t('current_streak')}</h2>
                     <p className="text-4xl md:text-5xl font-bold text-orange-500 font-pixel flex items-center justify-center gap-2">
                        {streak} <span className="text-4xl">🔥</span>
                     </p>
                </div>
                <div className="col-span-2 md:col-span-1">
                    <div className="w-full">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
                            <span>{t('my_weekly_goal')}</span>
                            <span>{weeklyPoints} / {weeklyGoal}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden border border-gray-300 shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PointsTracker;
