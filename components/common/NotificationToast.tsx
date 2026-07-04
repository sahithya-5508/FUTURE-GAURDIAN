import React, { useEffect } from 'react';
import { Achievement } from '../../types';
import { useLocalization } from '../../hooks/useLocalization';

interface NotificationToastProps {
    achievement: Achievement;
    onView: () => void;
    onClose: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ achievement, onView, onClose }) => {
    const { t } = useLocalization();

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 8000); // Auto-dismiss after 8 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-5 right-5 w-full max-w-sm bg-white rounded-xl shadow-lg p-4 z-[100] animate-slide-in">
            <div className="flex items-start">
                <div className="flex-shrink-0 text-3xl">{achievement.icon}</div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-bold text-gray-900">{t('new_badge_unlocked')}</p>
                    <p className="mt-1 text-sm text-gray-600">{t(achievement.nameKey)}</p>
                    <div className="mt-3 flex space-x-3">
                        <button
                            onClick={onView}
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-green-600"
                        >
                            {t('click_to_see')}
                        </button>
                        <button
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-gray-300"
                        >
                            {t('dismiss')}
                        </button>
                    </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                    <button onClick={onClose} className="inline-flex text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .animate-slide-in {
                    animation: slide-in 0.5s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
                }
            `}</style>
        </div>
    );
};

export default NotificationToast;