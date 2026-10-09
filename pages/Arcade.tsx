
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ArrowRight, Loader2, Trophy, Gamepad2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { IconGiftSearch, IconDice, IconChip, IconFlame3D, IconHeart3D } from '../components/GamifiedIcons';

const GameCard = ({ id, title, desc, icon: Icon, color, image, multiplier }: any) => {
    const navigate = useNavigate();
    return (
        <div 
            className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden group transition-all cursor-pointer flex flex-col h-full relative hover:border-brand-500/50 shadow-none hover:shadow-2xl hover:scale-[1.02]" 
            onClick={() => navigate(`/arcade/${id}`)}
        >
            <div className="aspect-[16/9] bg-dark-900 relative overflow-hidden">
                <img src={image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt={title} />
                <div className="absolute top-3 left-3 bg-brand-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase z-10">
                    {multiplier}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all z-20">
                    <button className="bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase flex items-center gap-2 hover:bg-brand-500 hover:text-white transition-all shadow-none">
                        Play Now <ArrowRight size={12} />
                    </button>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1 relative z-10 bg-dark-800">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${color} bg-opacity-20 text-white`}>
                        <Icon size={24} className="grayscale group-hover:grayscale-0 transition-all duration-300" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wide leading-none">{title}</h3>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{desc}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { ContentHeader } from '../components/ContentHeader';

const ARCADE_CATEGORIES = ['All', 'Slots', 'Table Games', 'Strategy', 'Instant Win', 'Risk'];

export default function Arcade() {
    const navigate = useNavigate();
    const [points, setPoints] = useState(0);
    const [activeGames, setActiveGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [findInterestActive, setFindInterestActive] = useState(false);
    
    const user = authService.getCurrentUser();
    const mood = user?.contentPreference === 'adult' ? 'naughty' : 'dating';

    useEffect(() => {
        const init = async () => {
            try {
                // Fetch Wallet
                const wallet = await api.get<any>('/wallet');
                if (wallet?.balance) setPoints(wallet.balance);
                
                // Fetch Game Config
                const settings: any = db.getSiteSettings();
                const gameConfigs = settings.configs?.arcade?.games || {};

                const ALL_GAMES = [
                    { id: 'miner', title: 'Time Miner', desc: 'Click & Earn', icon: IconChip, color: 'bg-yellow-600', image: 'https://picsum.photos/600/400?random=miner', multiplier: '100PTS', category: 'Instant Win' },
                    { id: 'heads', title: 'Flip Fate', desc: 'Heads or Tails', icon: IconDice, color: 'bg-amber-500', image: 'https://picsum.photos/600/400?random=101', multiplier: '2X', category: 'Risk' },
                    { id: 'rps', title: 'Tactical Arena', desc: 'Rock Paper Scissors', icon: IconFlame3D, color: 'bg-pink-500', image: 'https://picsum.photos/600/400?random=102', multiplier: '2X', category: 'Strategy' },
                    { id: 'wheel', title: 'Neon Wheel', desc: 'Spin to Win', icon: IconGiftSearch, color: 'bg-purple-500', image: 'https://picsum.photos/600/400?random=103', multiplier: '10X', category: 'Instant Win' },
                    { id: 'guess', title: 'Neural Guess', desc: 'Higher or Lower', icon: IconHeart3D, color: 'bg-blue-500', image: 'https://picsum.photos/600/400?random=104', multiplier: 'Variable', category: 'Risk' },
                    { id: 'dice', title: 'Cosmic Dice', desc: 'Roll the Bones', icon: IconDice, color: 'bg-emerald-500', image: 'https://picsum.photos/600/400?random=105', multiplier: '5X', category: 'Table Games' },
                    { id: 'ace', title: 'Ace Hunter', desc: 'Find the Card', icon: IconGiftSearch, color: 'bg-slate-500', image: 'https://picsum.photos/600/400?random=106', multiplier: '3X', category: 'Table Games' },
                    { id: 'crypto_slots', title: 'Slot Machine', desc: 'Match Symbols', icon: IconChip, color: 'bg-orange-500', image: 'https://picsum.photos/600/400?random=107', multiplier: '100X', category: 'Slots' },
                    { id: 'roulette', title: 'Roulette', desc: 'Red or Black', icon: IconFlame3D, color: 'bg-red-600', image: 'https://picsum.photos/600/400?random=108', multiplier: '14X', category: 'Table Games' },
                    { id: 'keno', title: 'Keno Grid', desc: 'Pick Numbers', icon: IconHeart3D, color: 'bg-indigo-500', image: 'https://picsum.photos/600/400?random=109', multiplier: 'Variable', category: 'Instant Win' },
                    { id: 'blackjack', title: 'Blackjack', desc: 'Hit or Stand', icon: IconChip, color: 'bg-green-600', image: 'https://picsum.photos/600/400?random=110', multiplier: '2.5X', category: 'Table Games' },
                    { id: 'mines', title: 'Mines', desc: 'Extraction', icon: IconFlame3D, color: 'bg-red-800', image: 'https://picsum.photos/600/400?random=111', multiplier: 'Scaling', category: 'Strategy' },
                    { id: 'color', title: 'Color Predict', desc: 'Blue or Red', icon: IconHeart3D, color: 'bg-cyan-500', image: 'https://picsum.photos/600/400?random=112', multiplier: '1.9X', category: 'Risk' },
                    { id: 'crazy', title: 'Crazy Times', desc: 'Wheel Bonus', icon: IconGiftSearch, color: 'bg-yellow-500', image: 'https://picsum.photos/600/400?random=113', multiplier: '500X', category: 'Instant Win' },
                    { id: 'double', title: 'Double Risk', desc: 'Risk it all', icon: IconDice, color: 'bg-zinc-500', image: 'https://picsum.photos/600/400?random=114', multiplier: '2X++', category: 'Risk' },
                ];

                const visible = ALL_GAMES.filter(g => {
                    const conf = gameConfigs[g.id];
                    return conf ? conf.enabled : true; 
                });

                setActiveGames(visible);
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        init();
    }, []);

    const filteredGames = useMemo(() => {
        return activeGames.filter(g => activeFilter === 'All' || g.category === activeFilter);
    }, [activeGames, activeFilter]);

    return (
        <div className="flex flex-col min-h-screen bg-dark-850">
            <ContentHeader 
                title="Arcade"
                icon={Gamepad2}
                stats={[
                    { label: 'Active Games', value: activeGames.length.toString() },
                    { label: 'Live Players', value: '4.2K' }
                ]}
                userStats={[
                    { label: 'My Balance', value: `${points.toLocaleString()} LSC`, color: 'text-yellow-500' },
                    { label: 'Daily Win', value: '1.2K' }
                ]}
                tags={ARCADE_CATEGORIES.map(f => ({ id: f, label: f, count: activeGames.filter(g => f === 'All' || g.category === f).length.toString() }))}
                activeTag={activeFilter}
                onTagClick={setActiveFilter}
                onAddTag={(label) => setSearchQuery(prev => prev ? `${prev} ${label}` : label)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFindInterest={() => setFindInterestActive(prev => !prev)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onCreateClick={() => {}}
                createLabel="Provably Fair"
                bgImage="https://picsum.photos/seed/arcade/1920/1080?blur=10"
            />

            <div className="p-4 md:p-10 pb-24">
                <div className="mb-8 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 px-4 py-3 rounded-[5px] text-xs font-bold flex items-center gap-3">
                    <Trophy size={16} />
                    <span>LuciStars get <strong>5% loss recovery</strong> on all arcade plays.</span>
                </div>

                {loading ? (
                     <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" size={40} /></div>
                ) : (
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-[repeat(auto-fill,minmax(300px,1fr))]' : 'grid-cols-1'}`}>
                        {filteredGames.map((game) => (
                            <GameCard key={game.id} {...game} />
                        ))}
                        {filteredGames.length === 0 && (
                            <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-dark-700 rounded-[5px]">
                                No games found in this category.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
