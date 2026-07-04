import React from 'react';
import { ECO_ACTIONS } from '../../constants';
import { useLocalization } from '../../hooks/useLocalization';
import { ActionToLog } from '../../types';

interface ActionLoggerProps {
    onLogActions: (actions: ActionToLog[]) => void;
    userDefaults: Record<string, number>;
    actionValues: Record<string, number>;
    setActionValues: (values: Record<string, number>) => void;
}

const ActionLogger: React.FC<ActionLoggerProps> = ({ onLogActions, userDefaults, actionValues, setActionValues }) => {
    const { t } = useLocalization();
    
    const handleValueChange = (actionId: string, value: number) => {
        setActionValues({ ...actionValues, [actionId]: value });
    };

    const handleLog = () => {
        const actionsToLog: ActionToLog[] = [];
        ECO_ACTIONS.forEach(category => {
            category.actions.forEach(action => {
                const value = actionValues[action.id] || 0;
                if (value > 0) {
                   actionsToLog.push({ category: category.id, actionId: action.id, value });
                }
            });
            category.bonuses.forEach(bonus => {
                const value = actionValues[bonus.id] || 0;
                if (value > 0) {
                    actionsToLog.push({ category: category.id, actionId: bonus.id, value: 1 });
                }
            });
        });
        
        if (actionsToLog.length > 0) {
            onLogActions(actionsToLog);
            alert(t('logged_actions_alert'));
            setActionValues({});
        }
    };

    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center text-green-700">{t('log_todays_actions')}</h2>
            {ECO_ACTIONS.map(category => (
                <div key={category.id} className="p-4 border border-gray-200 rounded-lg bg-white/50">
                    <h3 className="text-lg font-semibold text-green-800 mb-4">{category.icon} {t(category.labelKey)}</h3>
                    <div className="space-y-4">
                        {category.actions.map(action => {
                            const value = actionValues[action.id] || 0;
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
                                            onChange={(e) => handleValueChange(action.id, parseInt(e.target.value, 10))}
                                            className="glowing-slider"
                                            style={{ '--progress-percent': `${progress}%` } as React.CSSProperties}
                                        />
                                        <span className="text-green-700 font-bold w-16 text-center">{value} {action.unit}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="flex flex-wrap gap-2 pt-2">
                             {category.bonuses.map(bonus => (
                                 <button key={bonus.id} 
                                    onClick={() => handleValueChange(bonus.id, (actionValues[bonus.id] || 0) > 0 ? 0 : 1)}
                                    className={`px-3 py-1.5 text-sm rounded-full border-2 transition-all ${
                                        (actionValues[bonus.id] || 0) > 0 
                                        ? 'bg-yellow-400 border-yellow-500 text-yellow-900' 
                                        : 'bg-white hover:bg-yellow-100 border-gray-300 text-gray-700'
                                    }`}>
                                     🌟 {t(bonus.labelKey)} (+{bonus.points})
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={handleLog}
                className="w-full bg-green-500 text-white font-bold py-4 px-4 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 text-lg shadow-lg"
            >
                {t('log_todays_actions')}
            </button>
        </div>
    );
};

export default ActionLogger;