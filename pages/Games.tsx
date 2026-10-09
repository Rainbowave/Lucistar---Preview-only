
import React, { useState, useEffect } from 'react';
import { 
  Coins, Dices, Play, RotateCw, Gem, Brain, 
  TrendingUp, Trophy, Zap, Users, Star, Flame, History, 
  ChevronRight, Sparkles, Target, Activity, Clock, 
  ShieldCheck, Layers, ArrowRightLeft, Eye, BarChart3,
  Dna, Cpu, Fingerprint, ArrowRight, Gamepad2, Plus
} from 'lucide-react';
import { IconChip } from '../components/GamifiedIcons';
import { useNavigate } from 'react-router-dom';
import { ContentHeader } from '../components/ContentHeader';
import { api } from '../services/api';

const GameCard = ({ id, title, desc, icon: Icon, color, image, badge, players, entryCost, multiplier }: any) => {
    const navigate = useNavigate();
    return (
        <div 
            className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden group transition-all cursor-pointer shadow-2xl flex flex-col h-full relative hover:border-brand-500/50" 
            onClick={() => navigate(`/arcade/${id}`)}
        >
            <div className="aspect-[16/9] bg-dark-900 relative overflow-hidden">
                <img src={image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt={title} />
                <div className="absolute top-3 left-3 bg-brand-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase shadow-lg">
                    {multiplier}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all">
                    <button className="bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase shadow-2xl flex items-center gap-2">
                        Play Now <ArrowRight size={12} />
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-xl ${color} text-white shadow-lg`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-white truncate">{title}</h3>
                        <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                        <Users size={12} /> {players} Playing
                    </div>
                    <div className="text-yellow-500 font-bold text-xs flex items-center gap-1">
                        <Coins size={12} /> {entryCost} LSC
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Games() {
    const navigate = useNavigate();
    const [points, setPoints] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const [findInterestActive, setFindInterestActive] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const wallet = await api.get<any>('/wallet');
                if (wallet?.balance) setPoints(wallet.balance);
            } catch (e) { console.error(e); }
        };
        fetchBalance();
    }, []);

    const categories = [
        { id: 'featured', label: 'Classic Games', icon: IconChip },
        { id: 'instant', label: 'Instant Wins', icon: Zap },
        { id: 'skill', label: 'Puzzles & Skills', icon: Brain },
    ];

    const gamesData = {
        featured: [],
        instant: [],
        skill: []
    };

    return (
        <div className="flex flex-col w-full h-full bg-black">
            <ContentHeader 
                title="Games"
                icon={Gamepad2}
                stats={[
                    { label: 'Active Players', value: '12.4K' },
                    { label: 'Daily Jackpots', value: '1.5M LSC' }
                ]}
                userStats={[
                    { label: 'My Balance', value: points.toLocaleString(), color: 'text-yellow-500' },
                    { label: 'Rank', value: '#42' }
                ]}
                tags={[
                    { id: 'All', label: 'All Games', count: '120' },
                    { id: 'Classic', label: 'Classic', count: '45' },
                    { id: 'Instant', label: 'Instant Win', count: '30' },
                    { id: 'Skill', label: 'Skill Based', count: '25' },
                    { id: 'Tournament', label: 'Tournaments', count: '12' }
                ]}
                activeTag={activeFilter}
                onTagClick={setActiveFilter}
                onAddTag={(label) => setSearchQuery(prev => prev ? `${prev} ${label}` : label)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFindInterest={() => setFindInterestActive(prev => !prev)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onCreateClick={() => {}}
                createLabel="Submit Game"
                bgImage="https://picsum.photos/seed/gaming/1920/1080?blur=10"
            />

            <div className="max-w-[1400px] mx-auto pt-10 px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                <div className="lg:col-span-8 bg-dark-800 rounded-3xl p-10 border border-white/5 relative overflow-hidden flex flex-col justify-center min-h-[400px] shadow-2xl">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-brand-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <Trophy size={16} fill="currentColor" /> Live Tournament
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
                            Arcade <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-yellow-600">Jackpots</span>
                        </h1>
                        <button onClick={() => navigate('/leaderboard')} className="bg-white text-black hover:bg-brand-500 hover:text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all">
                            View Leaderboard
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-dark-800 border border-white/5 rounded-3xl p-10 flex flex-col justify-between shadow-2xl">
                    <div className="space-y-10">
                        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={16} className="text-brand-500" /> Account Stats
                        </h2>
                        <div>
                            <span className="text-xs font-bold text-gray-500 uppercase block mb-2">My Points Balance</span>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                                    <Coins size={28} />
                                </div>
                                <span className="text-5xl font-black text-white tabular-nums">{points.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => navigate('/points')} className="w-full bg-brand-500 hover:bg-brand-600 text-white font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest text-xs transition-all mt-10">
                        Buy More Points
                    </button>
                </div>
            </div>

            <div className="space-y-24">
                {categories.map(cat => (
                    <section key={cat.id}>
                        <div className="flex items-center gap-3 mb-10 border-b border-white/5 pb-4">
                            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
                                <cat.icon size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{cat.label}</h2>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
                            {(gamesData as any)[cat.id].map((game: any) => (
                                <GameCard key={game.id} {...game} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    </div>
  );
}
