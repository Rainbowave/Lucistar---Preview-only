
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, Search, Users, Hash, Heart, Gamepad2, 
  ChevronRight, Star, Target, Flame, Zap, 
  ArrowLeft, LayoutGrid, Crown, Medal, Check, Activity,
  ArrowUp, ArrowDown, Globe, Clock, Calendar as CalendarIcon
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { motion, AnimatePresence } from 'motion/react';

import { LeaderboardMember } from '../types';

const MODE_ITEMS = [
    { id: 'users', label: 'Users', icon: Users, color: 'text-brand-main', description: 'The most popular and active creators in the community. Ranked by followers and content quality.' },
    { id: 'intimacy', label: 'Intimacy', icon: Heart, color: 'text-brand-main', description: 'The most active and supportive intimacy circles. Ranked by member engagement and shared moments.' },
    { id: 'tags', label: 'Tags', icon: Hash, color: 'text-brand-main', description: 'The most influential hashtags and trends. Ranked by reach, posts, and community interaction.' },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2, color: 'text-brand-main', description: 'The ultimate masters of the LuciSin Arcade. Your total score across all available games.' },
    { id: 'global', label: 'Global', icon: Globe, color: 'text-brand-main', description: 'Global rankings across all categories.' },
    { id: 'weekly', label: 'Weekly', icon: Clock, color: 'text-brand-main', description: 'Rankings for the current week.' },
];

export default function GlobalLeaderboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMode, setActiveMode] = useState(searchParams.get('mode') || 'users');
    const [timeFilter, setTimeFilter] = useState<'monthly' | 'all-time'>('monthly');
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<LeaderboardMember[]>([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const currentUser = authService.getCurrentUser();

    const activeModeData = useMemo(() => 
        MODE_ITEMS.find(m => m.id === activeMode) || MODE_ITEMS[0]
    , [activeMode]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setPage(1);
            try {
                const data = await api.get<LeaderboardMember[]>(`/leaderboard?mode=${activeMode}&time=${timeFilter}`);
                setItems(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeMode, timeFilter]);

    const filteredModes = MODE_ITEMS.filter(m => 
        m.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const searchResults = useMemo(() => {
        if (!searchQuery) return items;
        return items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.handle?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [items, searchQuery]);

    const loadMore = async () => {
        if (loadingMore || loading) return;
        setLoadingMore(true);
        try {
            await new Promise(r => setTimeout(r, 500));
            const newItems: LeaderboardMember[] = Array.from({ length: 10 }, (_, i) => {
                const rank = items.length + i + 1;
                return {
                    id: `user-${rank}-${Date.now()}`,
                    rank: rank,
                    name: ['Darlene', 'Kyle', 'Arlene', 'Dianne', 'Aubrey', 'Jerome', 'Eleanor', 'Max', 'Luna', 'Felix'][Math.floor(Math.random() * 10)],
                    handle: `@user${rank}`,
                    score: Math.max(100, items[items.length - 1]?.score - Math.floor(Math.random() * 100) || 1000),
                    highScore: Math.floor(Math.random() * 200) + 50,
                    avatar: `https://i.pravatar.cc/150?u=${activeMode}_${rank}`,
                    isVerified: Math.random() > 0.7,
                    type: activeMode === 'tags' ? 'TAG' : activeMode === 'intimacy' ? 'CIRCLE' : 'USER'
                };
            });
            setItems(prev => [...prev, ...newItems]);
            setPage(p => p + 1);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight * 1.5) {
            loadMore();
        }
    };

    const topThree = items.slice(0, 3);
    const remainingItems = items.slice(3);

    return (
        <div className="min-h-screen bg-background text-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-white/5 bg-card flex flex-col shrink-0">
                <div className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-8">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-[5px] text-gray-500 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter">Select Mode</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-6 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                        {MODE_ITEMS.map(mode => {
                            const Icon = mode.icon;
                            return (
                                <button
                                    key={mode.id}
                                    onClick={() => setActiveMode(mode.id)}
                                    className={`py-3 px-2 rounded-[5px] text-[9px] font-black uppercase tracking-widest transition-all border flex flex-col items-center justify-center gap-2 ${
                                        activeMode === mode.id 
                                        ? 'bg-brand-main border-brand-main text-white shadow-lg shadow-brand-main/20' 
                                        : 'bg-card border-white/5 text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <Icon size={16} className={activeMode === mode.id ? 'text-white' : 'text-brand-main'} />
                                    {mode.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                        <input 
                            type="text"
                            placeholder="Search rankings..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-card border border-white/5 rounded-[5px] py-3 pl-10 pr-4 text-xs text-white focus:border-brand-main/50 outline-none transition-all"
                        />
                    </div>

                    <div className="space-y-2 overflow-y-auto no-scrollbar flex-1 pr-2">
                        {searchResults.map((result) => {
                            const isArcade = result.type === 'GAME';
                            const isUp = result.score % 2 === 0;
                            const displayName = isArcade ? result.name : (result.name.startsWith('#') ? result.name : `#${result.name.replace(/\s+/g, '').toLowerCase()}`);
                            const statLabel = isArcade ? 'PLAYS' : 'POSTS';

                            return (
                                <div 
                                    key={result.id} 
                                    onClick={() => {
                                        if (activeMode === 'tags') {
                                            navigate(`/explore?tag=${result.name.replace('#', '')}`);
                                        }
                                    }}
                                    className={`flex items-stretch gap-3 p-3 rounded-[5px] bg-card border border-white/5 hover:border-brand-main/50 transition-all group relative overflow-hidden ${activeMode === 'tags' ? 'cursor-pointer' : ''}`}
                                >
                                    {/* No Visual Handles */}

                                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                                        {isArcade ? (
                                            <Gamepad2 size={20} className="text-brand-main" />
                                        ) : isUp ? (
                                            <ArrowUp size={20} className="text-green-500" />
                                        ) : (
                                            <ArrowDown size={20} className="text-red-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex items-center">
                                        <h4 className="font-black text-white text-xs uppercase tracking-tight truncate">{displayName}</h4>
                                    </div>
                                    <div className="text-right shrink-0 flex flex-col justify-between py-0.5">
                                        <div className="text-brand-main font-black text-[10px] uppercase leading-none">#{result.rank}</div>
                                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest leading-none">{result.score.toLocaleString()} {statLabel}</div>
                                    </div>
                                </div>
                            );
                        })}
                        {searchResults.length === 0 && (
                            <div className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest py-4">
                                No results found
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                        {/* Global Statistics removed */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-[#171717] shadow-[0_0_20px_rgba(0,0,0,0.5)] px-4 md:px-8 h-full">
                {/* Banner */}
                <div className="relative rounded-[5px] bg-card bg-pattern border border-white/5 p-10 overflow-hidden mb-8 flex items-center justify-between shadow-2xl group">
                    {/* No Visual Handles */}

                    {/* Background elements */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_70%_30%,rgba(243,202,11,0.1),transparent_70%)]"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-main/5 rounded-full blur-[100px]"></div>

                    <div className="relative z-10 flex-1">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-2 h-2 rounded-full bg-brand-main shadow-[0_0_10px_rgba(243,202,11,0.5)]"></div>
                        </div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                            LEADER<span className="text-brand-main">BOARD</span>
                        </h1>
                        <p className="text-gray-400 text-xs font-medium max-w-md leading-relaxed">
                            {activeModeData.description}
                            <br />
                            <span className="text-brand-main/80 mt-2 block font-bold">Rewards: Top 3 players receive exclusive partner gifts at the end of the month!</span>
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0 hidden lg:block">
                        <div className="relative w-64 h-64 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-main/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                            <div className="relative transform hover:scale-110 transition-transform duration-500">
                                <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                                <div className="absolute top-10 -right-6 w-16 h-16 bg-white/5 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-4 -left-8 w-8 h-8 bg-brand-main/20 rounded-full blur-lg"></div>
                                <div className="absolute -bottom-2 right-4 w-10 h-10 bg-brand-main/30 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Podium Section */}
                {!loading && items.length >= 3 && (
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        {/* 2nd Place */}
                        <div className="relative group h-full">
                                <div className="bg-post bg-pattern border border-white/5 rounded-[5px] p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-main/30 transition-all shadow-[0_0_40px_rgba(0,0,0,0.2)] h-full">
                                    
                                    {/* Subtle Glow */}
                                    <div className="absolute inset-0 bg-brand-second/10 animate-glow-subtle blur-2xl"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-second/20"></div>
                                    <div className="relative mb-4">
                                        <img src={topThree[1].avatar} className="w-20 h-20 rounded-[5px] object-cover border-2 border-brand-second/30" alt="" />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-second text-black rounded-[5px] flex items-center justify-center font-black text-sm shadow-lg">2</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-black text-white uppercase tracking-tight">{topThree[1].name}</div>
                                        <div className="text-[10px] font-bold text-brand-second uppercase tracking-widest mt-1">{topThree[1].score.toLocaleString()} PTS</div>
                                    </div>
                                </div>
                        </div>

                        {/* 1st Place */}
                        <div className="relative group h-full">
                                <div className="bg-post bg-pattern border border-brand-main/30 rounded-[5px] p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-main/50 transition-all scale-105 shadow-[0_0_60px_rgba(var(--brand-main),0.2)] h-full">

                                    {/* Glowing Background */}
                                    <div className="absolute inset-0 bg-brand-mixed opacity-20 animate-glow blur-3xl"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--brand-main),0.15),transparent_70%)]"></div>
                                    
                                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-main/50"></div>
                                    <div className="relative mb-4 z-10">
                                        <img src={topThree[0].avatar} className="w-24 h-24 rounded-[5px] object-cover border-2 border-brand-main/50 shadow-[0_0_20px_rgba(var(--brand-main),0.2)]" alt="" />
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-main text-black rounded-[5px] flex items-center justify-center font-black text-lg shadow-lg">1</div>
                                        <Crown className="absolute -top-6 left-1/2 -translate-x-1/2 text-brand-main animate-bounce" size={24} fill="currentColor" />
                                    </div>
                                    <div className="text-center z-10">
                                        <div className="text-lg font-black text-white uppercase tracking-tight">{topThree[0].name}</div>
                                        <div className="text-xs font-bold text-brand-main uppercase tracking-widest mt-1">{topThree[0].score.toLocaleString()} PTS</div>
                                    </div>
                                </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="relative group h-full">
                                <div className="bg-post bg-pattern border border-white/5 rounded-[5px] p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-main/30 transition-all shadow-[0_0_40px_rgba(0,0,0,0.2)] h-full">
                                    
                                    {/* Subtle Glow */}
                                    <div className="absolute inset-0 bg-brand-main/10 animate-glow-subtle blur-2xl"></div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"></div>
                                    <div className="absolute top-0 left-0 w-full h-1 bg-brand-main/20"></div>
                                    <div className="relative mb-4">
                                        <img src={topThree[2].avatar} className="w-20 h-20 rounded-[5px] object-cover border-2 border-brand-main/30" alt="" />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-brand-main text-black rounded-[5px] flex items-center justify-center font-black text-sm shadow-lg">3</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-sm font-black text-white uppercase tracking-tight">{topThree[2].name}</div>
                                        <div className="text-[10px] font-bold text-brand-main uppercase tracking-widest mt-1">{topThree[2].score.toLocaleString()} PTS</div>
                                    </div>
                                </div>
                        </div>
                    </div>
                )}

                {/* Rankings Section */}
                <div className="space-y-8">
                    <div className="bg-card border border-white/5 rounded-[5px] p-8 shadow-2xl relative overflow-hidden group">
                        {/* No Visual Handles */}

                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1 bg-card p-1 rounded-[5px] border border-white/5">
                                    <button 
                                        onClick={() => setTimeFilter('monthly')}
                                        className={`px-6 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === 'monthly' ? 'bg-brand-main text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button 
                                        onClick={() => setTimeFilter('all-time')}
                                        className={`px-6 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${timeFilter === 'all-time' ? 'bg-brand-main text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        All Time
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                <Activity size={12} className="text-brand-main" />
                                Live Updates
                            </div>
                        </div>

                        <div className="w-full max-h-[600px] overflow-y-auto custom-scrollbar pr-2" onScroll={handleScroll}>
                            {loading && page === 1 ? (
                                <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-main" /></div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <AnimatePresence mode="popLayout">
                                        {remainingItems.map((member, index) => (
                                            <motion.div 
                                                key={member.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.2, delay: index * 0.02 }}
                                                className="mb-2 relative group h-full"
                                            >
                                                    <div 
                                                        onClick={() => {
                                                            if (activeMode === 'tags') {
                                                                navigate(`/explore?tag=${member.name.replace('#', '')}`);
                                                            }
                                                        }}
                                                        className={`flex flex-col p-5 rounded-[5px] transition-all border relative overflow-hidden group h-full ${
                                                            member.id === currentUser?.id 
                                                            ? 'bg-post bg-pattern border-brand-main/50 shadow-[0_0_20px_rgba(var(--brand-main),0.1)]' 
                                                            : 'bg-post bg-pattern border-white/5 hover:border-brand-main/30'
                                                        } ${activeMode === 'tags' ? 'cursor-pointer' : ''}`}
                                                    >
                                                        
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative">
                                                                    <img src={member.avatar} className="w-12 h-12 rounded-[5px] object-cover border border-white/10" alt="" />
                                                                    {member.isVerified && (
                                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-main rounded-full flex items-center justify-center border-2 border-card">
                                                                            <Check size={8} className="text-white" strokeWidth={4} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="text-sm font-black text-white uppercase tracking-tight truncate">{member.name}</div>
                                                                    <div className="text-[9px] font-bold text-gray-600 uppercase tracking-widest truncate">{member.handle}</div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xl font-black text-white/20 group-hover:text-brand-main/40 transition-colors">#{member.rank}</div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                                            <div className="flex flex-col">
                                                                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Score</span>
                                                                <span className="text-sm font-black text-brand-main tabular-nums">{member.score.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                {member.id === currentUser?.id && (
                                                                    <div className="px-2 py-1 bg-brand-main/20 rounded-[5px] text-[8px] font-black text-brand-main uppercase">You</div>
                                                                )}
                                                                <div className={`flex items-center gap-1 text-[10px] font-bold ${member.score % 2 === 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                                    {member.score % 2 === 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Hover effect background */}
                                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-main/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                                    </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {loadingMore && (
                                        <div className="py-4 col-span-full flex justify-center"><Loader2 className="animate-spin text-brand-main" size={20} /></div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Loader2 = ({ className, size = 24 }: { className?: string, size?: number }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);
