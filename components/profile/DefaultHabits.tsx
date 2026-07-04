import React, { useState } from 'react';
import { ECO_ACTIONS } from '../../constants';
import { useLocalization } from '../../hooks/useLocalization';

interface DefaultHabitsProps {
    defaults: Record<string, number>;
    onDefaultsChange: (defaults: Record<string, number>) => void;
    isLocked: boolean;
}

const DefaultHabits: React.FC<DefaultHabitsProps> = ({ defaults, onDefaultsChange, isLocked }) => {
    const [openCategory, setOpenCategory] = useState<string | null>(ECO_ACTIONS[0].id);
    const { t } = useLocalization();
    
    const handleSliderChange = (actionId: string, value: number) => {
        if (isLocked) return;
        const newDefaults = { ...defaults, [actionId]: value };
        onDefaultsChange(newDefaults);
    };

    return (
        <div className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg ${isLocked ? 'opacity-70' : ''}`}>
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">{t('my_daily_eco_habits')}</h2>
            <p className="text-center text-gray-600 text-sm mb-4">{t('set_daily_defaults_desc')}</p>
            <div className="space-y-2">
                {ECO_ACTIONS.map(category => (
                    <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                            className="w-full text-left p-4 bg-white/50 hover:bg-green-50 flex justify-between items-center"
                        >
                            <h3 className="text-lg font-semibold text-green-800">{category.icon} {t(category.labelKey)}</h3>
                            <span className={`transform transition-transform ${openCategory === category.id ? 'rotate-180' : 'rotate-0'}`}>▼</span>
                        </button>
                        {openCategory === category.id && (
                            <div className="p-4 space-y-4 bg-gray-50">
                                {category.actions.map(action => {
                                    const value = defaults[action.id] || 0;
                                    const progress = action.max > 0 ? (value / action.max) * 100 : 0;
                                    return (
                                        <div key={action.id}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{t(action.labelKey)}</label>
                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={action.max}
                                                    value={value}
                                                    onChange={(e) => handleSliderChange(action.id, parseInt(e.target.value, 10))}
                                                    className="glowing-slider"
                                                    style={{ '--progress-percent': `${progress}%` } as React.CSSProperties}
                                                    disabled={isLocked}
                                                />
                                                <span className="text-green-700 font-bold w-16 text-center">{value} {action.unit}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DefaultHabits;