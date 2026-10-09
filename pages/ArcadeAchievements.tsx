
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, Cpu, Zap, Flame, Star, Globe, ChevronDown, Check, Coins, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ALL_ACHIEVEMENTS = [
    { id: 1, title: 'Grand Champion', description: 'Reached the highest rank in competitive play.', game: 'Cyber Dash', icon: Trophy, color: 'bg-brand-mixed', lsc: 500, xp: 1000 },
    { id: 2, title: 'Sharpshooter', description: 'Achieved 95% accuracy in 10 consecutive matches.', game: 'Cyber Dash', icon: Target, color: 'bg-white/10', lsc: 250, xp: 500 },
    { id: 3, title: 'System Overlord', description: 'Hacked 100 terminals without detection.', game: 'Cyber Dash', icon: Cpu, color: 'bg-white/10', lsc: 300, xp: 600 },
    { id: 4, title: 'Speed Demon', description: 'Completed all time trials in under 2 minutes.', game: 'Cyber Dash', icon: Zap, color: 'bg-white/10', lsc: 200, xp: 400 },
    { id: 5, title: 'On Fire', description: 'Maintained a 20-match win streak.', game: 'Cyber Dash', icon: Flame, color: 'bg-white/10', lsc: 400, xp: 800 },
    { id: 6, title: 'Rising Star', description: 'Gained 10,000 XP in a single day.', game: 'Cyber Dash', icon: Star, color: 'bg-white/10', lsc: 150, xp: 300 },
    { id: 7, title: 'Pixel Perfect', description: 'Win a match without taking any damage.', game: 'Cyber Dash', icon: Target, color: 'bg-white/10', lsc: 600, xp: 1200 },
    { id: 8, title: 'Data Miner', description: 'Collect all hidden data fragments in Level 5.', game: 'Cyber Dash', icon: Cpu, color: 'bg-white/10', lsc: 350, xp: 700 },
    { id: 9, title: 'Neon Knight', description: 'Unlock the legendary Neon skin.', game: 'Cyber Dash', icon: Trophy, color: 'bg-brand-mixed', lsc: 1000, xp: 2000 },
];

const ARCADE_GAMES = [
    { id: 'cyber-dash', name: 'Cyber Dash', icon: Zap, color: 'from-brand-500 to-purple-600' },
    { id: 'neon-racer', name: 'Neon Racer', icon: Flame, color: 'from-orange-500 to-red-600' },
    { id: 'bit-battler', name: 'Bit Battler', icon: Target, color: 'from-blue-500 to-cyan-600' },
];

const ArcadeAchievements = () => {
    const navigate = useNavigate();
    const [equippedIds, setEquippedIds] = useState([1, 2, 3, 4, 5, 6]);
    const [expandedGame, setExpandedGame] = useState<string | null>('cyber-dash');
    const [hoveredEquippedIndex, setHoveredEquippedIndex] = useState<number | null>(null);

    const handleEquip = (id: number) => {
        if (equippedIds.includes(id)) return;
        
        if (hoveredEquippedIndex !== null) {
            const newEquipped = [...equippedIds];
            newEquipped[hoveredEquippedIndex] = id;
            setEquippedIds(newEquipped);
            setHoveredEquippedIndex(null);
        } else {
            const newEquipped = [...equippedIds];
            newEquipped[5] = id;
            setEquippedIds(newEquipped);
        }
    };

    const equippedAchievements = equippedIds.map(id => ALL_ACHIEVEMENTS.find(a => a.id === id)!);
    const totalLsc = ALL_ACHIEVEMENTS.reduce((acc, curr) => acc + curr.lsc, 0);
    const totalXp = ALL_ACHIEVEMENTS.reduce((acc, curr) => acc + curr.xp, 0);

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {/* Header */}
            <div className="bg-dark-800 border-b border-white/5 p-6 sticky top-0 z-40 backdrop-blur-md bg-dark-800/80">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 rounded-[5px] bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <Plus size={20} className="rotate-45" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-2">
                                <Trophy size={20} className="text-brand-500" /> Arcade Hall of Fame
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Equip your best achievements to your profile</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-dark-900/50 border border-white/5 px-4 py-2 rounded-[5px] flex flex-col items-center">
                            <span className="text-lg font-black text-white">{ALL_ACHIEVEMENTS.length}</span>
                            <span className="text-[7px] text-gray-500 uppercase font-black tracking-widest">Total Achievements</span>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-[5px] flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-yellow-500">
                                <Coins size={14} />
                                <span className="text-lg font-black">{totalLsc.toLocaleString()}</span>
                            </div>
                            <span className="text-[7px] text-yellow-500/60 uppercase font-black tracking-widest">Total LSC Earned</span>
                        </div>
                        <div className="bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-[5px] flex flex-col items-center">
                            <div className="flex items-center gap-1.5 text-brand-500">
                                <Zap size={14} />
                                <span className="text-lg font-black">{totalXp.toLocaleString()}</span>
                            </div>
                            <span className="text-[7px] text-brand-500/60 uppercase font-black tracking-widest">Total XP Gained</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-12">
                {/* Equipped Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Check size={14} className="text-brand-500" /> Currently Equipped
                        </h2>
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Hover a slot to replace it</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {equippedAchievements.map((achievement, index) => (
                            <motion.div 
                                key={`equipped-${index}`}
                                onMouseEnter={() => setHoveredEquippedIndex(index)}
                                onMouseLeave={() => setHoveredEquippedIndex(null)}
                                className={`relative group aspect-square bg-dark-800 border-2 rounded-[5px] flex flex-col items-center justify-center p-4 transition-all duration-300 ${hoveredEquippedIndex === index ? 'border-brand-500 bg-brand-500/5 shadow-lg shadow-brand-500/10' : 'border-white/5'}`}
                            >
                                <div className={`w-12 h-12 ${achievement.color} rounded-[5px] flex items-center justify-center shadow-xl mb-2 group-hover:scale-110 transition-transform`}>
                                    <achievement.icon size={24} className="text-white" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-white text-center line-clamp-1">{achievement.title}</span>
                                <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest mt-1">{achievement.game}</span>

                                {hoveredEquippedIndex === index && (
                                    <div className="absolute inset-0 bg-brand-500/90 flex items-center justify-center rounded-[3px] animate-in fade-in duration-200">
                                        <span className="text-[8px] font-black text-white uppercase tracking-widest text-center px-2">Select new to replace</span>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Games Section */}
                <section className="space-y-6">
                    <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Globe size={14} className="text-brand-500" /> Arcade Games
                    </h2>

                    <div className="space-y-4">
                        {ARCADE_GAMES.map((game) => (
                            <div key={game.id} className="bg-dark-800 border border-white/5 rounded-[5px] overflow-hidden">
                                <button 
                                    onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 bg-gradient-to-br ${game.color} rounded-[5px] flex items-center justify-center shadow-lg`}>
                                            <game.icon size={24} className="text-white" />
                                        </div>
                                        <div className="text-left">
                                            <h3 className="text-sm font-black uppercase tracking-widest text-white">{game.name}</h3>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                                                {ALL_ACHIEVEMENTS.filter(a => a.game === game.name).length} Achievements Available
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 ${expandedGame === game.id ? 'rotate-180 text-brand-500' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {expandedGame === game.id && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-white/5 bg-dark-900/30"
                                        >
                                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {ALL_ACHIEVEMENTS.filter(a => a.game === game.name).map((achievement) => (
                                                    <div 
                                                        key={achievement.id} 
                                                        className={`bg-dark-800 border p-4 rounded-[5px] flex items-center gap-4 transition-all group/card ${equippedIds.includes(achievement.id) ? 'border-brand-500/50' : 'border-transparent hover:border-white/10 hover:bg-white/5'}`}
                                                    >
                                                        <div className={`w-14 h-14 ${achievement.color} rounded-[5px] flex items-center justify-center shadow-lg shrink-0 group-hover/card:scale-105 transition-transform`}>
                                                            <achievement.icon size={28} className="text-white" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <h4 className="text-[11px] font-black uppercase tracking-widest text-white truncate">{achievement.title}</h4>
                                                                <div className="flex flex-col items-end">
                                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                                        <Coins size={8} />
                                                                        <span className="text-[8px] font-black">{achievement.lsc} LSC</span>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-brand-500">
                                                                        <Zap size={8} />
                                                                        <span className="text-[8px] font-black">{achievement.xp} XP</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed mb-3 line-clamp-2">{achievement.description}</p>
                                                            
                                                            <div className="flex justify-end">
                                                                <button 
                                                                    onClick={() => handleEquip(achievement.id)}
                                                                    disabled={equippedIds.includes(achievement.id)}
                                                                    className={`px-3 py-1 rounded-[3px] text-[7px] font-black uppercase tracking-widest transition-all ${
                                                                        equippedIds.includes(achievement.id) 
                                                                        ? 'bg-brand-500/20 text-brand-500 cursor-default' 
                                                                        : 'bg-white text-black hover:bg-brand-500 hover:text-white opacity-0 group-hover/card:opacity-100'
                                                                    }`}
                                                                >
                                                                    {equippedIds.includes(achievement.id) ? 'Equipped' : 'Equip'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ArcadeAchievements;
