import { useState, useEffect, useCallback } from 'react';
import { UserData, DailyLog, Achievement, ActionToLog } from '../types';
import { ECO_ACTIONS, ACHIEVEMENTS_LIST } from '../constants';
import { getTodayDateString } from '../utils/helpers';

const initialUserData: UserData = {
    profile: {
        name: 'Eco Warrior',
        nickname: 'GreenGuard',
        country: 'India',
        avatar: null,
        weeklyGoal: 2500,
        defaults: {},
        profileLockedUntil: null,
    },
    logs: [],
    stats: {
        totalPoints: 0,
        treesPlanted: 0,
        dailyAverage: 0,
        weeklyAverage: 0,
        monthlyAverage: 0,
        yearlyAverage: 0,
        streak: 0,
        mysteryBoxesOpened: 0,
        totalCo2Saved: 0,
    },
    friends: [
        { id: 1, name: 'Alex Green', nickname: 'Leafy', points: 7250, streak: 12, avatar: { gender: 'male' } },
        { id: 2, name: 'Terra Bloom', nickname: 'FlowerPower', points: 6800, streak: 25, avatar: { gender: 'female' } },
        { id: 3, name: 'River Stone', nickname: 'Stoney', points: 6100, streak: 5, avatar: { gender: 'male' } },
    ],
    unlockedAchievements: [],
};


export const useUserData = () => {
    const [user, setUser] = useState<UserData>(initialUserData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('ecoUserData');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                // Basic migration for users who had the old achievement structure
                if (parsedUser.achievements && !parsedUser.unlockedAchievements) {
                    parsedUser.unlockedAchievements = parsedUser.achievements.map((a: any) => a.id);
                    delete parsedUser.achievements;
                }
                // Backfill CO2 data for existing users
                if (parsedUser.stats && typeof parsedUser.stats.totalCo2Saved === 'undefined') {
                    let co2Total = 0;
                    parsedUser.logs.forEach((log: DailyLog) => {
                        Object.entries(log.actions).forEach(([categoryId, actions]) => {
                            const category = ECO_ACTIONS.find(c => c.id === categoryId);
                            if (!category) return;
                            Object.entries(actions).forEach(([actionId, value]) => {
                                const actionDef = category.actions.find(a => a.id === actionId);
                                if (actionDef) {
                                    co2Total += value * actionDef.co2KgPerUnit;
                                } else {
                                    const bonusDef = category.bonuses.find(b => b.id === actionId);
                                    if (bonusDef) {
                                        co2Total += value * bonusDef.co2Kg;
                                    }
                                }
                            });
                        });
                    });
                    parsedUser.stats.totalCo2Saved = co2Total;
                }
                setUser(parsedUser);
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const saveData = useCallback((newUserData: UserData) => {
        try {
            localStorage.setItem('ecoUserData', JSON.stringify(newUserData));
            setUser(newUserData);
        } catch (error) {
            console.error("Failed to save user data to localStorage", error);
        }
    }, []);

    const calculateStats = (logs: DailyLog[], totalPoints: number, streak: number, mysteryBoxesOpened: number, totalCo2Saved: number): UserData['stats'] => {
        const treesPlanted = Math.floor(totalPoints / 10000);
        return {
            totalPoints,
            treesPlanted,
            dailyAverage: logs.length > 0 ? totalPoints / logs.length : 0,
            weeklyAverage: 0, 
            monthlyAverage: 0,
            yearlyAverage: 0,
            streak,
            mysteryBoxesOpened,
            totalCo2Saved,
        };
    };

    const logActions = (actionsToLog: ActionToLog[]) => {
        if (actionsToLog.length === 0) {
            return { shouldShowMysteryBox: false, newlyEarnedAchievements: [] };
        }

        let totalPointsFromActions = 0;
        let totalCo2SavedFromActions = 0;
        const newActionsByCategoryId: Record<string, Record<string, number>> = {};

        actionsToLog.forEach(({ category, actionId, value }) => {
            const categoryData = ECO_ACTIONS.find(c => c.id === category);
            if (!categoryData) return;
            
            const actionData = categoryData.actions.find(a => a.id === actionId) || categoryData.bonuses.find(b => b.id === actionId);
            if (!actionData) return;

            const isBonus = 'points' in actionData;
            const points = isBonus ? actionData.points : actionData.pointsPerUnit * value;
            const co2 = isBonus ? actionData.co2Kg : (actionData.co2KgPerUnit || 0) * value;

            totalPointsFromActions += points;
            totalCo2SavedFromActions += co2;
            
            if (!newActionsByCategoryId[category]) {
                newActionsByCategoryId[category] = {};
            }
            const loggedValue = isBonus ? 1 : value;
            newActionsByCategoryId[category][actionId] = (newActionsByCategoryId[category][actionId] || 0) + loggedValue;
        });
        
        const oldTotalPoints = user.stats.totalPoints;
        let provisionalTotalPoints = oldTotalPoints + totalPointsFromActions;
        
        // --- Achievements Check ---
        const newlyEarnedAchievements = ACHIEVEMENTS_LIST.filter(ach => 
            provisionalTotalPoints >= ach.pointsThreshold && !user.unlockedAchievements.includes(ach.id)
        );
        const pointsFromBadges = newlyEarnedAchievements.reduce((sum, ach) => sum + ach.pointsAwarded, 0);
        provisionalTotalPoints += pointsFromBadges;

        // --- Mystery Box Check (for every 1000 points) ---
        const old1000Multiples = Math.floor(oldTotalPoints / 1000);
        const new1000Multiples = Math.floor(provisionalTotalPoints / 1000);
        
        let shouldShowMysteryBox = false;
        let pointsFromMysteryBox = 0;
        let newMysteryBoxesOpened = user.stats.mysteryBoxesOpened;
        if (new1000Multiples > old1000Multiples) {
            const boxesToAdd = new1000Multiples - old1000Multiples;
            pointsFromMysteryBox = 10 * boxesToAdd;
            shouldShowMysteryBox = true;
            newMysteryBoxesOpened += boxesToAdd;
        }
        provisionalTotalPoints += pointsFromMysteryBox;

        const totalPointsGained = provisionalTotalPoints - oldTotalPoints;

        // --- Update Logs ---
        const todayStr = getTodayDateString();
        let newLogs = user.logs.map(log => ({ ...log, actions: { ...log.actions } })); // Deep copy to avoid mutation issues
        let todayLog = newLogs.find(log => log.date === todayStr);
        const isFirstLogToday = !todayLog;

        if (todayLog) {
            todayLog.points += totalPointsGained;
            // Merge actions
            Object.keys(newActionsByCategoryId).forEach(catId => {
                if (!todayLog.actions[catId]) {
                    todayLog.actions[catId] = {};
                }
                Object.keys(newActionsByCategoryId[catId]).forEach(actId => {
                    todayLog.actions[catId][actId] = (todayLog.actions[catId][actId] || 0) + newActionsByCategoryId[catId][actId];
                });
            });
        } else {
            todayLog = {
                date: todayStr,
                points: totalPointsGained,
                actions: newActionsByCategoryId,
            };
            newLogs.push(todayLog);
            newLogs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }

        // --- Update Streak ---
        let newStreak = user.stats.streak;
        if (isFirstLogToday) {
             const yesterday = new Date();
             yesterday.setDate(yesterday.getDate() - 1);
             const yesterdayStr = yesterday.toISOString().split('T')[0];
             const lastLogDate = user.logs.length > 0 ? user.logs[user.logs.length - 1].date : null;
            if (lastLogDate === yesterdayStr) {
                newStreak += 1;
            } else {
                newStreak = 1;
            }
        }
        
        const newTotalCo2Saved = (user.stats.totalCo2Saved || 0) + totalCo2SavedFromActions;
        const newStats = calculateStats(newLogs, provisionalTotalPoints, newStreak, newMysteryBoxesOpened, newTotalCo2Saved);
        const newUnlockedAchievements = [...user.unlockedAchievements, ...newlyEarnedAchievements.map(a => a.id)];

        const newUser: UserData = { ...user, logs: newLogs, stats: newStats, unlockedAchievements: newUnlockedAchievements };
        saveData(newUser);
        return { shouldShowMysteryBox, newlyEarnedAchievements };
    };
    
    const updateUser = (updatedProfile: Partial<UserData['profile']>) => {
        const lockDuration = 24 * 60 * 60 * 1000; // 24 hours
        const lockedUntil = new Date(Date.now() + lockDuration).toISOString();

        const newProfile = { ...user.profile, ...updatedProfile, profileLockedUntil: lockedUntil };
        const newUser = { ...user, profile: newProfile };
        saveData(newUser);
    };

    const addFriend = (name: string) => {
         const newFriend = {
            id: Date.now(),
            name,
            nickname: name.slice(0, 5),
            points: Math.floor(Math.random() * 5000),
            streak: Math.floor(Math.random() * 10),
            avatar: { gender: Math.random() > 0.5 ? 'male' : 'female' } as const,
        };
        const newUser = { ...user, friends: [...user.friends, newFriend] };
        saveData(newUser);
    }

    return { user, loading, logActions, updateUser, addFriend };
};