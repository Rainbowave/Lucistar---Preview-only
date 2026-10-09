import React from 'react';
import { Crown, Users, BarChart2, Ban, Unlock, Eye, ArrowRight } from 'lucide-react';

interface PimpUserCardProps {
    user: any;
    onAction: (userId: string, type: 'warn' | 'suspend' | 'ban' | 'activate') => void;
    onNavigate: (path: string) => void;
}

export const PimpUserCard: React.FC<PimpUserCardProps> = ({ user, onAction, onNavigate }) => {
    // Mock top recruits for visual if not present
    const topRecruits = user.pimpSettings?.topRecruits || [
        { id: '1', avatar: `https://picsum.photos/seed/${user.id}1/50` },
        { id: '2', avatar: `https://picsum.photos/seed/${user.id}2/50` },
        { id: '3', avatar: `https://picsum.photos/seed/${user.id}3/50` },
    ];

    return (
        <div className="bg-card border border-primary/30 rounded-[5px] p-5 shadow-lg hover:border-primary hover:shadow-primary/10 transition-all group flex flex-col gap-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 p-20 bg-brand-second/5 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity opacity-50 group-hover:opacity-100 pointer-events-none"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative cursor-pointer" onClick={() => onNavigate(`/admin/users/${user.id}`)}>
                        <img 
                            src={user.avatarUrl} 
                            className="w-14 h-14 rounded-[5px] object-cover border-2 border-brand-second/20 group-hover:border-brand-second transition-colors" 
                            alt={user.username} 
                        />
                        <div className="absolute -bottom-1 -right-1 bg-brand-second text-white rounded-full p-1 border border-background shadow-sm">
                            <Crown size={10} strokeWidth={3} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-base font-black text-white tracking-tight cursor-pointer hover:text-brand-second transition-colors" onClick={() => onNavigate(`/admin/users/${user.id}`)}>
                            @{user.username}
                        </h3>
                        <p className="text-[10px] text-brand-second font-bold uppercase tracking-widest">Pimp Master</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${user.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {user.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Total Earnings</p>
                    <p className="text-lg font-black text-white tabular-nums">{(user.pimpSettings?.earnings || 0).toLocaleString()} <span className="text-xs text-brand-second">LSC</span></p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
                <div className="bg-background/50 p-3 rounded-[5px] border border-border group-hover:border-brand-second/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={12} className="text-brand-second" />
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Recruits</span>
                    </div>
                    <p className="text-sm font-bold text-white">{user.pimpSettings?.referralCount || 0}</p>
                </div>
                <div className="bg-background/50 p-3 rounded-[5px] border border-border group-hover:border-brand-second/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                        <BarChart2 size={12} className="text-green-500" />
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Commission</span>
                    </div>
                    <p className="text-sm font-bold text-white">15%</p>
                </div>
            </div>

            {/* Recruits Preview (Interactive) */}
            <div className="bg-background/30 p-3 rounded-[5px] border border-border relative z-10">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Top Recruits</span>
                    <button onClick={() => onNavigate(`/admin/users/${user.id}`)} className="text-[9px] text-brand-second hover:text-white font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
                        View All <ArrowRight size={10} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {topRecruits.map((recruit: any, i: number) => (
                        <div 
                            key={i} 
                            className="w-8 h-8 rounded-full border border-border overflow-hidden cursor-pointer hover:scale-110 hover:border-brand-second transition-all relative group/recruit"
                            onClick={(e) => { e.stopPropagation(); /* In real app, navigate to recruit profile */ }}
                            title={`Recruit ${i+1}`}
                        >
                            <img src={recruit.avatar} className="w-full h-full object-cover" alt="" />
                        </div>
                    ))}
                    {(user.pimpSettings?.referralCount || 0) > 3 && (
                        <div 
                            className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-[9px] font-bold text-gray-500 cursor-pointer hover:text-white hover:border-brand-second transition-all"
                            onClick={() => onNavigate(`/admin/users/${user.id}`)}
                        >
                            +{user.pimpSettings.referralCount - 3}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto relative z-10 pt-2 border-t border-border">
                <button 
                    onClick={() => onNavigate(`/admin/users/${user.id}`)} 
                    className="flex-1 py-2 bg-brand-second/10 hover:bg-brand-second text-brand-second hover:text-white rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all border border-brand-second/20 hover:border-brand-second flex items-center justify-center gap-2"
                >
                    <Eye size={12} /> View Network
                </button>
                {user.status === 'active' ? (
                    <button 
                        onClick={() => onAction(user.id, 'ban')} 
                        className="p-2 bg-background hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-[5px] border border-border transition-all"
                        title="Ban Pimp"
                    >
                        <Ban size={16} />
                    </button>
                ) : (
                    <button 
                        onClick={() => onAction(user.id, 'activate')} 
                        className="p-2 bg-background hover:bg-green-500/20 text-gray-500 hover:text-green-500 rounded-[5px] border border-border transition-all"
                        title="Activate Pimp"
                    >
                        <Unlock size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};
