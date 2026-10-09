
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Heart, Users, MessageCircle, MapPin, Sparkles, Filter, Search, X, Check, RotateCcw } from 'lucide-react';
import { ExploreStickyNav, StickyContainer } from '../components/ExploreStickyNav';
import { api } from '../services/api';
import { PostCard } from '../components/PostCard';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';

interface DatingProps {
    currentUser?: any;
}

const ShuffleCard: React.FC<{ item: any, onSwipe: (direction: 'left' | 'right') => void, index: number }> = ({ item, onSwipe, index }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
    const heartOpacity = useTransform(x, [50, 150], [0, 1]);
    const xOpacity = useTransform(x, [-150, -50], [1, 0]);

    const handleDragEnd = (event: any, info: any) => {
        if (info.offset.x > 100) onSwipe('right');
        else if (info.offset.x < -100) onSwipe('left');
    };

    return (
        <motion.div
            style={{ x, rotate, opacity, zIndex: 100 - index }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
            <div className="w-full h-full bg-dark-800 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                <img 
                    src={item.thumbnailUrl || item.url || `https://picsum.photos/seed/${item.id}/800/1200`} 
                    className="w-full h-full object-cover pointer-events-none" 
                    alt={item.user?.username} 
                />
                
                {/* Swipe Indicators */}
                <motion.div style={{ opacity: heartOpacity }} className="absolute top-10 left-10 border-4 border-green-500 text-green-500 px-4 py-2 rounded-xl font-black text-4xl uppercase tracking-tighter rotate-[-15deg] pointer-events-none">
                    Like
                </motion.div>
                <motion.div style={{ opacity: xOpacity }} className="absolute top-10 right-10 border-4 border-red-500 text-red-500 px-4 py-2 rounded-xl font-black text-4xl uppercase tracking-tighter rotate-[15deg] pointer-events-none">
                    Nope
                </motion.div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 pointer-events-none">
                    <div className="flex items-center gap-3 mb-3">
                        <img src={item.user?.avatar} className="w-12 h-12 rounded-full border-2 border-white/20" alt="" />
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">
                                {item.user?.username}, {Math.floor(Math.random() * 10) + 20}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                <MapPin size={12} className="text-brand-second" /> 5km Away
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-300 font-medium line-clamp-2 mb-4">
                        {item.content || "Hey! I'm looking for someone to explore the city with. Let's connect!"}
                    </p>
                    <div className="flex gap-2">
                        {['Gamer', 'Creative', 'Night Owl'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black text-white uppercase tracking-widest backdrop-blur-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function Dating({ currentUser }: DatingProps) {
    const [activeTab, setActiveTab] = useState('Shuffle');
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchDatingContent = useCallback(async (cursor?: string) => {
        const response = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=20&cursor=${cursor || ''}&type=All`);
        const datingItems = response.items.filter(item => !item.isAdult);
        return {
            items: datingItems,
            nextCursor: response.nextCursor
        };
    }, []);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchDatingContent, containerRef);

    useEffect(() => {
        refresh();
    }, [currentUser?.contentPreference]);

    const handleSwipe = (direction: 'left' | 'right') => {
        setCurrentIndex(prev => prev + 1);
    };

    const shuffleItems = useMemo(() => feedItems.slice(currentIndex, currentIndex + 5), [feedItems, currentIndex]);

    return (
        <div className="min-h-screen bg-dark-900 pb-20 overflow-hidden">
            {/* Dating Header */}
            <div className="relative bg-gradient-to-b from-brand-second/20 to-dark-900 pt-10 pb-8 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-second/10 text-brand-second border border-brand-second/20 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                        <Heart size={12} fill="currentColor" /> Dating Mode
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        Dating <span className="text-brand-second">Shuffle</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                {/* Filters - Sticky Container */}
                <StickyContainer>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 flex-1">
                             {['Shuffle', 'Feed', 'Matches', 'Nearby'].map(tab => (
                                 <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-white text-black border-white shadow-lg' : 'bg-dark-800 text-gray-500 border-white/5 hover:text-white'}`}
                                 >
                                     {tab}
                                 </button>
                             ))}
                        </div>

                        <button 
                            onClick={() => refresh()}
                            className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-[5px] text-gray-400 hover:text-white transition-all shadow-lg shrink-0"
                            title="Refresh Matches"
                        >
                            <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
                </StickyContainer>

                {activeTab === 'Shuffle' ? (
                    <div className="relative max-w-md mx-auto aspect-[3/4] mb-20">
                        <AnimatePresence>
                            {shuffleItems.length > 0 ? (
                                shuffleItems.map((item: any, idx: number) => (
                                    <ShuffleCard 
                                        key={item.id} 
                                        item={item} 
                                        index={idx}
                                        onSwipe={handleSwipe} 
                                    />
                                ))
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-dark-800 rounded-3xl border border-white/5">
                                    <Loader2 className="animate-spin text-brand-second mb-4" size={48} />
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Finding more matches...</h3>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Hold tight, we're shuffling the deck.</p>
                                </div>
                            )}
                        </AnimatePresence>

                        {/* Controls */}
                        <div className="absolute -bottom-24 left-0 right-0 flex justify-center items-center gap-6">
                            <button 
                                onClick={() => setCurrentIndex(0)}
                                className="w-14 h-14 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all shadow-xl"
                            >
                                <RotateCcw size={24} />
                            </button>
                            <button 
                                onClick={() => handleSwipe('left')}
                                className="w-20 h-20 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl"
                            >
                                <X size={32} />
                            </button>
                            <button 
                                onClick={() => handleSwipe('right')}
                                className="w-20 h-20 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-xl"
                            >
                                <Check size={32} />
                            </button>
                            <button className="w-14 h-14 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-brand-second hover:bg-brand-second hover:text-black transition-all shadow-xl">
                                <Sparkles size={24} />
                            </button>
                        </div>
                    </div>
                ) : activeTab === 'Feed' ? (
                    <div className="space-y-8" ref={containerRef}>
                        {feedItems.map((item: any, index) => (
                                <PostCard 
                                    key={`${item.id}-${index}`}
                                    id={item.id}
                                    type={item.type || 'PHOTO'}
                                    category="Dating"
                                    date="Just now"
                                    content={item.content || item.title}
                                    imageUrl={item.thumbnailUrl || item.url}
                                    ownerId={item.userId}
                                    author={item.user}
                                    hideMoodBadge={true}
                                    isAdult={false}
                                    onTip={() => {}}
                                    onCommentClick={() => {}}
                                />
                        ))}
                        {loading && (
                            <div className="py-10 flex justify-center">
                                <Loader2 className="animate-spin text-brand-second" size={32} />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                        No {activeTab.toLowerCase()} found.
                    </div>
                )}
            </div>
        </div>
    );
}
