import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import Confetti from './Confetti';
import { Achievement } from '../../types';

interface AchievementModalProps {
    achievement: Achievement;
    userName: string;
    onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, userName, onClose }) => {
    const { t } = useLocalization();
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);
    }, []);

    const handleClose = () => {
        setShow(false);
        setTimeout(onClose, 300);
    }

    const handleShare = async () => {
        const shareData = {
            title: t('share_achievement_title'),
            text: t('share_achievement_text').replace('{achievementName}', t(achievement.nameKey)),
            url: window.location.href
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                navigator.clipboard.writeText(shareData.text);
                alert(t('achievement_copied_alert'));
            }
        } catch (error) {
            console.error('Error sharing achievement:', error);
            alert(t('share_failed_alert'));
        }
    };
    
    const handleDownloadCertificate = () => {
        const today = new Date().toLocaleDateString();
        const svgContent = `
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg" style="font-family: 'Poppins', sans-serif;">
            <rect width="100%" height="100%" fill="#F7FDF3"/>
            <rect x="20" y="20" width="760" height="560" fill="none" stroke="#4CAF50" stroke-width="10"/>
            <g transform="translate(400, 100)" text-anchor="middle">
                <text font-size="40" fill="#2E7D32" font-weight="bold">Certificate of Achievement</text>
            </g>
            <g transform="translate(400, 180)" text-anchor="middle">
                <text font-size="24" fill="#555">This certificate is proudly presented to</text>
            </g>
            <g transform="translate(400, 260)" text-anchor="middle">
                <text font-size="48" fill="#1B5E20" font-weight="bold" font-family="'Press Start 2P', cursive">${userName}</text>
            </g>
            <g transform="translate(400, 340)" text-anchor="middle">
                 <text font-size="22" fill="#555" text-anchor="middle">
                    For outstanding dedication to protecting our planet and achieving the milestone of
                </text>
                 <text y="30" font-size="28" fill="#388E3C" font-weight="bold">${t(achievement.nameKey)} (${achievement.pointsThreshold} Points)</text>
            </g>
            <g transform="translate(200, 480)" text-anchor="middle">
                <text font-size="18" fill="#555">Date: ${today}</text>
                <line x1="-100" y1="0" x2="100" y2="0" stroke="#4CAF50" stroke-width="2"/>
                <text y="25" font-size="14" fill="#777">Date Issued</text>
            </g>
             <g transform="translate(600, 480)" text-anchor="middle">
                <text font-family="'Press Start 2P', cursive" font-size="18" fill="#2E7D32">FUTURE GAURDIAN</text>
                <line x1="-100" y1="0" x2="100" y2="0" stroke="#4CAF50" stroke-width="2"/>
                <text y="25" font-size="14" fill="#777">Official Recognition</text>
            </g>
             <text x="760" y="575" font-size="40" text-anchor="end">🌳</text>
        </svg>
        `;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FutureGuardian_Certificate_${userName}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`relative bg-gradient-to-br from-yellow-100 to-orange-200 rounded-2xl shadow-2xl p-8 text-center transform transition-all duration-300 ${show ? 'scale-100' : 'scale-90'}`}>
                {achievement.pointsThreshold >= 1000 && achievement.pointsThreshold % 1000 === 0 && <Confetti />}
                <h2 className="text-3xl font-bold font-pixel text-yellow-600 mb-2">{t('congratulations')}</h2>
                <p className="text-gray-700 mb-4">{t('youve_unlocked_a_new_achievement')}</p>
                <div className="bg-white/50 rounded-lg p-4 mb-6 border-2 border-yellow-400">
                    <p className="text-5xl mb-2">{achievement.icon}</p>
                    <p className="text-xl font-bold text-orange-600">{t(achievement.nameKey)}</p>
                    <p className="text-sm text-gray-600 mt-1">{t(achievement.descriptionKey)}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleClose}
                        className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-full hover:bg-orange-600 transition-transform transform hover:scale-105"
                    >
                        {t('continue_button')}
                    </button>
                    <button
                        onClick={handleShare}
                        className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-transform transform hover:scale-105"
                    >
                        {t('share_achievement')}
                    </button>
                    {achievement.pointsThreshold >= 1000 && achievement.pointsThreshold % 1000 === 0 && (
                         <button
                            onClick={handleDownloadCertificate}
                            className="w-full mt-2 px-6 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-transform transform hover:scale-105"
                        >
                           🎉 {t('download_certificate')} 🎉
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AchievementModal;