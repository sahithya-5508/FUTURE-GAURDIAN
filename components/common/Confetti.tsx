
import React from 'react';

const Confetti: React.FC = () => {
    const confettiPieces = Array.from({ length: 50 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 2 + 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
        };
        const flowers = ['🌸', '🌼', '🌻', '🌷', '🌺', '🌹'];
        const flower = flowers[Math.floor(Math.random() * flowers.length)];

        return (
            <div
                key={i}
                className="absolute top-[-20px] text-2xl animate-fall"
                style={style}
            >
                {flower}
            </div>
        );
    });

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {confettiPieces}
            <style>
                {`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0); opacity: 1; }
                    100% { transform: translateY(150vh) rotate(720deg); opacity: 0; }
                }
                .animate-fall {
                    animation-name: fall;
                    animation-timing-function: linear;
                    animation-iteration-count: infinite;
                }
                `}
            </style>
        </div>
    );
};

export default Confetti;
