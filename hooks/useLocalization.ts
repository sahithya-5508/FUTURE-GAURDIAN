import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LOCALIZATION_STRINGS } from '../constants';

type Language = 'en' | 'ta' | 'hi';

interface LocalizationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string): string => {
        return LOCALIZATION_STRINGS[language][key as keyof typeof LOCALIZATION_STRINGS['en']] || key;
    };

    // FIX: Replaced JSX with React.createElement to prevent syntax errors in a .ts file.
    // The TypeScript compiler was misinterpreting JSX syntax as operators.
    return React.createElement(
        LocalizationContext.Provider,
        { value: { language, setLanguage, t } },
        children
    );
};

export const useLocalization = (): LocalizationContextType => {
    const context = useContext(LocalizationContext);
    if (!context) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};
