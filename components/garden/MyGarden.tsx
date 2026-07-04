import React, { useState, useEffect, useRef, DragEvent } from 'react';
import { UserData, Flora } from '../../types';
import { FLORA_LIST } from '../../constants';
import { useLocalization } from '../../hooks/useLocalization';

interface MyGardenProps {
    user: UserData;
}

interface GardenItem {
    id: number;
    flora: Flora;
    size: number;
    growthStage: number;
    rotation: number;
    isNew: boolean;
}

const MyGarden: React.FC<MyGardenProps> = ({ user }) => {
    const { t } = useLocalization();
    const { totalPoints, treesPlanted } = user.stats;
    const plantsCount = treesPlanted;
    const pointsToNextPlant = 10000 - (totalPoints % 10000);
    
    const [gardenItems, setGardenItems] = useState<GardenItem[]>([]);
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);
    const prevPlantsCount = useRef(plantsCount);

    useEffect(() => {
        // Growth stage is now simpler: it can grow every 200 and 500 points after it was planted
        const calculateGrowthStage = (plantIndex: number, currentTotalPoints: number): number => {
            const pointsWhenPlanted = (plantIndex + 1) * 10000;
            const pointsSincePlanted = currentTotalPoints - pointsWhenPlanted;
            if (pointsSincePlanted >= 500) return 2; // Stage 2
            if (pointsSincePlanted >= 200) return 1; // Stage 1
            return 0; // Stage 0
        };

        const generateGarden = (count: number, prevCount: number) => {
            const items: GardenItem[] = [];
            for (let i = 0; i < count; i++) {
                const flora = FLORA_LIST[i % FLORA_LIST.length];
                const growthStage = calculateGrowthStage(i, totalPoints);

                items.push({
                    id: i,
                    flora: flora,
                    size: 40 + (i % 5) * 8 + Math.random() * 10,
                    growthStage: Math.min(growthStage, flora.icons.length - 1),
                    rotation: Math.random() * 20 - 10,
                    isNew: i >= prevCount,
                });
            }
            setGardenItems(items);
        };
        
        // Regenerate garden if a new plant is added or if the garden is empty but should have plants
        if (plantsCount !== prevPlantsCount.current || (plantsCount > 0 && gardenItems.length === 0)) {
            generateGarden(plantsCount, prevPlantsCount.current);
        } else {
            // Otherwise, just check for growth updates
            const updatedItems = gardenItems.map(item => ({
                ...item,
                growthStage: Math.min(calculateGrowthStage(item.id, totalPoints), item.flora.icons.length - 1),
                isNew: false, 
            }));
            
            const hasGrowthChanged = updatedItems.some((item, index) => item.growthStage !== gardenItems[index]?.growthStage);
            
            if (hasGrowthChanged) {
               setGardenItems(updatedItems);
            }
        }
        
        prevPlantsCount.current = plantsCount;

    }, [totalPoints, plantsCount, gardenItems.length]);

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnter = (index: number) => {
        dragOverItem.current = index;
    };

    const handleDrop = () => {
        if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
            const newGardenItems = [...gardenItems];
            const draggedItemContent = newGardenItems.splice(dragItem.current, 1)[0];
            newGardenItems.splice(dragOverItem.current, 0, draggedItemContent);
            dragItem.current = null;
            dragOverItem.current = null;
            setGardenItems(newGardenItems);
        }
    };
    
    const soilBg = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236B4F2C' fill-opacity='0.6' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`;

    return (
        <div className="max-w-5xl mx-auto text-center pb-20 md:pb-8">
            <h1 className="text-4xl font-bold text-green-800 font-pixel mb-2">{t('my_garden')}</h1>
            <p className="text-gray-600 mb-8">{t('garden_slogan')}</p>
            
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-100 rounded-lg">
                        <h3 className="font-bold text-green-800 text-lg">{t('total_points')}</h3>
                        <p className="text-3xl font-pixel text-green-600">{user.stats.totalPoints}</p>
                    </div>
                    <div className="p-4 bg-lime-100 rounded-lg">
                        <h3 className="font-bold text-lime-800 text-lg">{t('trees_planted')}</h3>
                        <p className="text-3xl font-pixel text-lime-600">{plantsCount}</p>
                    </div>
                    <div className="p-4 bg-yellow-100 rounded-lg">
                        <h3 className="font-bold text-yellow-800 text-lg">{t('next_plant_in')}</h3>
                        <p className="text-3xl font-pixel text-yellow-600">{pointsToNextPlant === 0 && totalPoints > 0 ? 10000 : pointsToNextPlant} pts</p>
                    </div>
                </div>
            </div>

            <div 
                className="bg-[#A07B4F] p-8 rounded-2xl min-h-[400px] flex items-end justify-center flex-wrap gap-x-4 gap-y-2 overflow-hidden border-4 border-white/50 shadow-inner relative"
                style={{ backgroundImage: soilBg }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                <div className="absolute bottom-4 right-4 text-6xl drop-shadow-lg" title={t('farmer_tooltip')}>👩‍🌾</div>
                {gardenItems.length > 0 ? (
                    gardenItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`flex flex-col items-center cursor-grab active:cursor-grabbing plant-container ${item.isNew ? 'animate-sprout' : ''}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={() => handleDragEnter(index)}
                            style={{ transform: `rotate(${item.rotation}deg)` }}
                        >
                            <span 
                                className="drop-shadow-lg transition-all duration-500 hover:scale-110" 
                                style={{ fontSize: `${item.size}px` }}
                            >
                                {item.flora.icons[item.growthStage]}
                            </span>
                            <span className="text-xs font-semibold bg-black/40 text-white rounded-full px-2 py-0.5 -mt-2">
                                {item.flora.name}
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-white bg-black/30 p-4 rounded-lg">
                        <p className="text-6xl mb-4">🌰</p>
                        <p className="font-semibold">{t('garden_is_seed_title')}</p>
                        <p>{t('garden_is_seed_desc')}</p>
                    </div>
                )}
            </div>
             <p className="text-sm text-gray-600 mt-2">{t('drag_and_drop_info')}</p>
             <style>{`
                @keyframes sprout {
                    0% { transform: scale(0) rotate(0deg); opacity: 0; }
                    70% { transform: scale(1.1) rotate(0deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }
                .animate-sprout {
                    animation: sprout 0.5s ease-out;
                }
                .plant-container {
                    transition: transform 0.2s ease-in-out;
                }
             `}</style>
        </div>
    );
};

export default MyGarden;