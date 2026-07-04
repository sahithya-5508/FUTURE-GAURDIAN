
import React, { useState } from 'react';
import { UserData, ActionToLog } from '../../types';
import PointsTracker from './PointsTracker';
import ActionLogger from './ActionLogger';
import StatsCharts from './StatsCharts';
import { useLocalization } from '../../hooks/useLocalization';
import { getEcoTipAndImage } from '../../services/geminiService';

interface DashboardProps {
    user: UserData;
    onLogActions: (actions: ActionToLog[]) => void;
}

const Co2Tracker: React.FC<{ totalCo2Saved: number }> = ({ totalCo2Saved }) => {
    const { t } = useLocalization();
    return (
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-600">{t('co2_emissions_prevented')}</h2>
            <p className="text-4xl md:text-5xl font-bold text-cyan-600 font-pixel flex items-center justify-center gap-2">
                {totalCo2Saved.toFixed(2)} <span className="text-2xl font-sans">kg</span>
            </p>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ user, onLogActions }) => {
    const { t, language } = useLocalization();
    const [ecoTip, setEcoTip] = useState<{ text: string; imageUrl: string | null } | null>(null);
    const [isTipLoading, setIsTipLoading] = useState(false);
    const [liveActionValues, setLiveActionValues] = useState<Record<string, number>>({});

    const handleGetTip = async () => {
        setIsTipLoading(true);
        setEcoTip(null);
        const tipAndImage = await getEcoTipAndImage(language);
        setEcoTip(tipAndImage);
        setIsTipLoading(false);
    };
    
    // FIX: Removed unused and incorrect `handleLog` function.
    // The `onLogAction` prop expects three arguments but was being called with one, causing a type error.
    // The `ActionLogger` component correctly handles this logic.

    return (
        <div className="space-y-8 pb-20 md:pb-8">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-green-800">{t('welcome_back').replace('{name}', user.profile.nickname || user.profile.name)}</h1>
                <p className="text-gray-600 mt-2">{t('ready_to_make_difference')}</p>
            </div>
            
            <PointsTracker totalPoints={user.stats.totalPoints} weeklyGoal={user.profile.weeklyGoal} streak={user.stats.streak} />
            <Co2Tracker totalCo2Saved={user.stats.totalCo2Saved} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ActionLogger 
                        onLogActions={onLogActions} 
                        userDefaults={user.profile.defaults}
                        actionValues={liveActionValues}
                        setActionValues={setLiveActionValues}
                    />
                </div>
                <div className="space-y-6">
                    <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                        <h3 className="font-bold text-xl text-green-700 mb-4">{t('eco_hero_corner')}</h3>
                        <button 
                            onClick={handleGetTip}
                            disabled={isTipLoading}
                            className="w-full bg-yellow-400 text-yellow-900 font-bold py-3 px-4 rounded-xl hover:bg-yellow-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isTipLoading ? t('thinking') : t('get_eco_tip')}💡
                        </button>
                        {isTipLoading && !ecoTip && <div className="mt-4 text-center text-gray-600">{t('thinking')}</div>}
                        {ecoTip && (
                            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg space-y-4">
                               {ecoTip.imageUrl ? (
                                    <img src={ecoTip.imageUrl} alt="Eco tip illustration" className="rounded-lg shadow-md w-full aspect-square object-cover" />
                               ) : isTipLoading ? (
                                    <div className="w-full aspect-square bg-yellow-200 rounded-lg flex items-center justify-center">
                                       <p>{t('generating_image')}</p>
                                    </div>
                               ) : null}
                               <p className="italic">"{ecoTip.text}"</p>
                            </div>
                        )}
                    </div>
                    <StatsCharts logs={user.logs} liveActionValues={liveActionValues} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
