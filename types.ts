


export enum Page {
    Dashboard = 'dashboard',
    Profile = 'profile',
    MyGarden = 'my-garden',
    Leaderboard = 'leaderboard',
    Friends = 'friends',
}

export interface Avatar {
    gender: 'male' | 'female';
}

export interface UserProfile {
    name: string;
    nickname: string;
    country: string;
    avatar: Avatar | null;
    weeklyGoal: number;
    defaults: Record<string, number>;
    profileLockedUntil: string | null; // ISO Date String
}

export interface DailyLog {
    date: string; // YYYY-MM-DD
    points: number;
    actions: Record<string, Record<string, number>>;
}

export interface UserStats {
    totalPoints: number;
    treesPlanted: number;
    dailyAverage: number;
    weeklyAverage: number;
    monthlyAverage: number;
    yearlyAverage: number;
    streak: number;
    mysteryBoxesOpened: number;
    totalCo2Saved: number;
}

export interface FriendProfile {
    id: number;
    name: string;
    nickname: string;
    avatar: Avatar;
    points: number;
    streak: number;
}

export interface Achievement {
    id: string;
    nameKey: string;
    descriptionKey: string;
    quoteKey: string;
    icon: string;
    pointsThreshold: number;
    pointsAwarded: number; // For the badge itself
}

export interface UserData {
    profile: UserProfile;
    logs: DailyLog[];
    stats: UserStats;
    friends: FriendProfile[];
    unlockedAchievements: string[]; // Array of achievement IDs
}

// FIX: Added missing Milestone interface to fix import error.
export interface Milestone {
    id: string;
    title: string;
    points: number;
}


export interface Action {
    id: string;
    labelKey: string;
    pointsPerUnit: number;
    unit: string;
    max: number;
    co2KgPerUnit: number;
}

export interface Bonus {
    id: string;
    labelKey: string;
    points: number;
    co2Kg: number;
}

export interface ActionCategory {
    id:string;
    labelKey: string;
    icon: string;
    actions: Action[];
    bonuses: Bonus[];
}

export interface Flora {
    name: string;
    icons: string[];
}

export interface ActionToLog {
    category: string;
    actionId: string;
    value: number;
}
