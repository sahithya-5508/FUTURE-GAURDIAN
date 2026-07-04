import React, { useState, useEffect } from 'react';
import { Avatar } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';
import { ECO_QUOTES } from '../../constants';

interface AvatarCreatorProps {
    currentAvatar: Avatar | null;
    onAvatarChange: (avatar: Avatar) => void;
    isLocked: boolean;
}

const genders = [
    { id: 'male', icon: '👨‍🌾' },
    { id: 'female', icon: '👩‍🌾' }
];

const AvatarCreator: React.FC<AvatarCreatorProps> = ({ currentAvatar, onAvatarChange, isLocked }) => {
    const { t } = useLocalization();
    const [gender, setGender] = useState<'male' | 'female'>(currentAvatar?.gender || 'female');
    const [quote, setQuote] = useState<{ text: string, id: number } | null>(null);

    useEffect(() => {
        if (!isLocked) {
           onAvatarChange({ gender });
        }
    }, [gender, onAvatarChange, isLocked]);
    
    const speakQuote = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            setQuote(null);
            return;
        }

        if ('speechSynthesis' in window) {
            const randomIndex = Math.floor(Math.random() * ECO_QUOTES.length);
            const text = ECO_QUOTES[randomIndex];
            const utterance = new SpeechSynthesisUtterance(text);
            
            utterance.onstart = () => {
                setQuote({ text, id: Date.now() });
            };
            utterance.onend = () => {
                setQuote(null);
            };

            window.speechSynthesis.speak(utterance);
        } else {
            alert(t('tts_not_supported_alert'));
        }
    };

    const selectedAvatarIcon = genders.find(g => g.id === gender)?.icon || '👤';

    return (
        <div className={`bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg ${isLocked ? 'opacity-70' : ''}`}>
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">{t('choose_your_guardian')}</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="relative">
                    <div
                        className="w-32 h-32 bg-lime-200 rounded-full flex items-center justify-center text-6xl border-4 border-green-300 cursor-pointer"
                        onClick={speakQuote}
                        title={t('hear_eco_quote_tooltip')}
                        role="button"
                        aria-label="Hear an eco quote"
                    >
                       <div className="transform scale-150">{selectedAvatarIcon}</div>
                    </div>
                     {quote && (
                        <div key={quote.id} className="absolute bottom-full mb-2 w-max max-w-xs bg-white p-2 rounded-lg shadow-md text-center text-sm text-gray-700 animate-fade-in">
                            {quote.text}
                        </div>
                    )}
                    <style>{`
                        @keyframes fade-in {
                            from { opacity: 0; transform: translateY(10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .animate-fade-in {
                            animation: fade-in 0.5s forwards;
                        }
                    `}</style>
                </div>
                <div className={`space-y-4 w-full md:w-1/2 ${isLocked ? 'pointer-events-none' : ''}`}>
                    <div>
                        <div className="flex gap-4 justify-center">
                            {genders.map(g => (
                                <button key={g.id} onClick={() => setGender(g.id as 'male' | 'female')} className={`px-4 py-2 rounded-full font-semibold transition-all w-28 h-12 flex items-center justify-center gap-2 ${gender === g.id ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-200'}`}>
                                    <span className="text-2xl">{g.icon}</span>
                                    <span>{t(g.id)}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarCreator;