import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';

interface GoalSetterProps {
    weeklyGoal: number;
    onGoalChange: (goal: number) => void;
    isLocked: boolean;
}

const GoalSetter: React.FC<GoalSetterProps> = ({ weeklyGoal, onGoalChange, isLocked }) => {
    const { t } = useLocalization();

    const min = 500;
    const max = 10000;
    const progress = ((weeklyGoal - min) / (max - min)) * 100;

    return (
        <div className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center ${isLocked ? 'opacity-70' : ''}`}>
            <h2 className="text-xl font-bold text-green-700 mb-2">{t('my_weekly_goal')}</h2>
            <p className="text-gray-600 text-sm mb-4">{t('set_your_goal')}</p>
            <div className="flex items-center space-x-4">
                <span className="text-lg">🌱</span>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step="100"
                    value={weeklyGoal}
                    onChange={(e) => onGoalChange(parseInt(e.target.value, 10))}
                    className="glowing-slider"
                    style={{ '--progress-percent': `${progress}%` } as React.CSSProperties}
                    disabled={isLocked}
                />
                <span className="text-3xl">🌳</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-600 font-pixel">{weeklyGoal} pts</p>
        </div>
    );
};

export default GoalSetter;