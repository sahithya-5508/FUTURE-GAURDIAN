import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { DailyLog } from '../../types';
import { getTodayDateString } from '../../utils/helpers';
import { ECO_ACTIONS } from '../../constants';
import { useLocalization } from '../../hooks/useLocalization';

interface StatsChartsProps {
    logs: DailyLog[];
    liveActionValues: Record<string, number>;
}

const COLORS = ['#84cc16', '#22c55e', '#10b981', '#f59e0b', '#3b82f6'];

const StatsCharts: React.FC<StatsChartsProps> = ({ logs, liveActionValues }) => {
    const { t } = useLocalization();

    const dailyCategoryData = useMemo(() => {
        const liveData = ECO_ACTIONS.map(category => {
            const points = Object.entries(liveActionValues).reduce((sum, [actionId, value]) => {
                if (value === 0) return sum;

                const actionDef = category.actions.find(a => a.id === actionId);
                if (actionDef) return sum + value * actionDef.pointsPerUnit;

                const bonusDef = category.bonuses.find(b => b.id === actionId);
                if (bonusDef) return sum + bonusDef.points;
                
                return sum;
            }, 0);
            return { name: category.icon, points, label: t(category.labelKey) };
        }).filter(item => item.points > 0);
        
        if (liveData.length > 0) return liveData;

        // Fallback to today's logged data if no live values
        const todayLog = logs.find(log => log.date === getTodayDateString());
        if (!todayLog) return [];
        return ECO_ACTIONS.map(category => {
            const points = Object.entries(todayLog.actions[category.id] || {}).reduce((sum, [actionId, value]) => {
                const actionDef = category.actions.find(a => a.id === actionId);
                if (actionDef) return sum + value * actionDef.pointsPerUnit;
                const bonusDef = category.bonuses.find(b => b.id === actionId);
                if (bonusDef) return sum + value * bonusDef.points;
                return sum;
            }, 0);
            return { name: category.icon, points, label: t(category.labelKey) };
        }).filter(item => item.points > 0);

    }, [liveActionValues, logs, t]);

    const weeklyData = useMemo(() => {
        const last7Days: { name: string, points: number, date: string }[] = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const log = logs.find(l => l.date === dateStr);
            last7Days.push({
                name: d.toLocaleDateString(undefined, { weekday: 'short' }),
                points: log ? log.points : 0,
                date: dateStr,
            });
        }
        return last7Days;
    }, [logs]);

    const ChartContainer: React.FC<{ title: string; children: React.ReactElement; data: any[] }> = ({ title, children, data }) => (
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg">
            <h3 className="font-bold text-xl text-green-700 mb-4 text-center">{title}</h3>
            <div style={{ width: '100%', height: 250 }}>
                {data.length > 0 ? (
                    <ResponsiveContainer>{children}</ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-center text-gray-500">
                        <p>{t('log_actions_to_see_progress')}</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <ChartContainer title={t('daily_progress')} data={dailyCategoryData}>
                <BarChart data={dailyCategoryData} layout="vertical" margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis type="number" tick={{ fill: '#4b5563' }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 20 }} width={40} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} formatter={(value, name, props) => [`${value} ${t('points')}`, props.payload.label]} />
                    <Bar dataKey="points" name={t('points')} radius={[0, 8, 8, 0]} barSize={20}>
                        {dailyCategoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ChartContainer>

            <ChartContainer title={t('weekly_progress')} data={weeklyData.filter(d => d.points > 0)}>
                <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#4b5563' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '0.75rem', border: '1px solid #d1d5db' }} formatter={(value) => `${value} ${t('points')}`} />
                    <Bar dataKey="points" fill="url(#colorWeekly)" name={t('points_earned')} radius={[8, 8, 0, 0]} barSize={25} />
                    <defs>
                        <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#84cc16" stopOpacity={0.9}/>
                            <stop offset="95%" stopColor="#22c55e" stopOpacity={1}/>
                        </linearGradient>
                    </defs>
                </BarChart>
            </ChartContainer>
        </div>
    );
};

export default StatsCharts;