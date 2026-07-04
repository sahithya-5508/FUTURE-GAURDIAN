import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';

interface MysteryBoxModalProps {
    onClose: () => void;
}

const MysteryBoxModal: React.FC<MysteryBoxModalProps> = ({ onClose }) => {
    const [isOpening, setIsOpening] = useState(false);
    const [isRevealed, setIsRevealed] = useState(false);
    const { t } = useLocalization();

    useEffect(() => {
        const openTimer = setTimeout(() => {
            setIsOpening(true);
        }, 1500);

        const revealTimer = setTimeout(() => {
            setIsRevealed(true);
        }, 2500);

        return () => {
            clearTimeout(openTimer);
            clearTimeout(revealTimer);
        };
    }, []);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100]">
            <div className="relative text-center p-8">
                 <div className={`transition-transform duration-500 ${isRevealed ? 'opacity-100 scale-125 -translate-y-16' : 'opacity-0 scale-0'}`}>
                    <span className="text-5xl font-pixel text-yellow-300 drop-shadow-lg">{t('plus_10_points')}</span>
                </div>
                
                <div 
                    className={`relative w-48 h-48 cursor-pointer transform transition-transform duration-300 ${!isOpening ? 'animate-shake' : ''}`}
                    onClick={() => { setIsOpening(true); setTimeout(() => setIsRevealed(true), 1000); }}
                >
                    <div 
                        className={`absolute w-full h-1/2 bg-gradient-to-b from-purple-600 to-purple-800 top-0 rounded-t-lg transition-all duration-1000 origin-bottom ${isOpening ? '-translate-y-8 -rotate-12' : ''}`}
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                         <div className="absolute w-12 h-4 bg-yellow-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="absolute w-full h-1/2 bg-gradient-to-b from-purple-500 to-purple-700 bottom-0 rounded-b-lg">
                        <div className="absolute w-12 h-4 bg-yellow-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    <div className={`absolute inset-0 bg-yellow-300 transition-opacity duration-500 ${isOpening ? 'opacity-50' : 'opacity-0'}`} style={{ filter: 'blur(20px)' }}></div>
                </div>

                <div className={`mt-8 transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
                    <h2 className="text-2xl font-bold text-white mb-2">{t('mystery_box_opened')}</h2>
                    <p className="text-white/80 mb-4">{t('found_bonus_inside')}</p>
                     <button
                        onClick={onClose}
                        className="px-6 py-2 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-transform transform hover:scale-105"
                    >
                        {t('awesome_button')}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) rotate(-2deg); }
                    20%, 40%, 60%, 80% { transform: translateX(5px) rotate(2deg); }
                }
                .animate-shake {
                    animation: shake 0.8s cubic-bezier(.36,.07,.19,.97) infinite;
                }
            `}</style>
        </div>
    );
};

export default MysteryBoxModal;