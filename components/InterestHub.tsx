
import React, { useState, useEffect } from 'react';
import { Search, Shuffle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Interest {
    id: string;
    title: string;
    image?: string;
    count?: string;
}

interface InterestHubProps {
    items: Interest[];
    onSelect: (title: string) => void;
    activeItem?: string;
    className?: string;
    variant?: 'shuffle' | 'grid';
}

export const InterestHub: React.FC<InterestHubProps> = ({ items, onSelect, activeItem, className = '', variant = 'shuffle' }) => {
    const [displayItems, setDisplayItems] = useState<Interest[]>([]);
    const navigate = useNavigate();

    // Function to get a random subset
    const getRandomSubset = (all: Interest[], count: number) => {
        const shuffled = [...all].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    };

    const shuffleItems = () => {
        if (items.length > 0) {
            if (variant === 'grid') {
                setDisplayItems(items);
            } else {
                setDisplayItems(getRandomSubset(items, 4));
            }
        }
    };

    useEffect(() => {
        shuffleItems();
    }, [items, variant]);

    const handleSearch = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate('/search?mode=interest');
    };

    const handleChangeCards = (e: React.MouseEvent) => {
        e.stopPropagation();
        shuffleItems();
        if (onSelect) {
            onSelect('All');
        }
    };

    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full ${className}`}>
            {displayItems.map((item) => (
                <div 
                    key={item.id || item.title}
                    onClick={() => onSelect(item.title)}
                    className={`relative w-full h-[80px] rounded-[5px] overflow-hidden cursor-pointer group border transition-all shadow-md ${
                        activeItem === item.title 
                        ? 'border-brand-500 shadow-brand-500/20' 
                        : 'border-white/5 hover:border-brand-500/50'
                    }`}
                >
                    <img 
                        src={item.image || `https://picsum.photos/400/300?random=${item.id || item.title}`} 
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                        <h3 className={`text-xs font-bold tracking-tighter drop-shadow-md ${
                            activeItem === item.title ? 'text-brand-500' : 'text-white'
                        }`}>
                            #{item.title.replace('#', '')}
                        </h3>
                    </div>
                </div>
            ))}

            {/* Shuffle Button */}
            {variant === 'shuffle' && (
                <div 
                    onClick={handleChangeCards}
                    className="relative w-full h-[80px] rounded-[5px] overflow-hidden cursor-pointer group border border-white/5 hover:border-brand-500/50 transition-all shadow-md bg-dark-800 flex flex-col items-center justify-center"
                    title="Shuffle"
                >
                    <Shuffle size={24} className="text-brand-500 group-hover:scale-110 transition-transform duration-500 mb-2" />
                    <h3 className="text-[10px] font-bold text-gray-400 group-hover:text-white tracking-widest drop-shadow-md text-center px-2">
                        Shuffle
                    </h3>
                </div>
            )}
        </div>
    );
};
