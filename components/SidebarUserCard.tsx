import React from 'react';
import { Coins, Sparkles, Check, Crown, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface SidebarUserCardProps {
    user: User;
}

export const SidebarUserCard: React.FC<SidebarUserCardProps> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="p-4 border-b border-[#fc8347]/30 bg-dark-800 relative overflow-hidden group/container">
            {/* Decorative Handles */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity"></div>
            <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/container:opacity-100 transition-opacity"></div>

            <div className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80" onClick={() => navigate(`/profile/${user.username}`)}>
                <div className="relative">
                    <img src={user.avatarUrl} className="w-12 h-12 rounded-[5px] border-2 border-dark-900 shadow-xl" alt="" />
                    {user.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-brand-second text-white p-0.5 rounded-[3px] shadow-lg">
                            <Check size={8} strokeWidth={4} />
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className={`font-black text-sm truncate uppercase tracking-tighter ${user.isLuciStarPremium ? 'text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500' : user.isLuciStar ? 'text-brand-400' : 'text-white'}`}>
                            {user.displayName}
                        </h4>
                        <span className="text-[8px] font-black text-white bg-white/10 px-1 rounded-[2px]">LVL {user.level || 42}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] text-gray-500 font-bold truncate">@{user.username}</p>
                        {user.isLuciStarPremium && <Crown size={10} className="text-yellow-500" fill="currentColor" />}
                        {user.isLuciStar && <Star size={10} className="text-slate-300" fill="currentColor" />}
                    </div>
                </div>
            </div>
            
            <div 
                className="bg-dark-800 p-3 rounded-lg flex justify-between items-center cursor-pointer hover:bg-dark-700" 
                onClick={() => navigate('/points')}
            >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Balance</span>
                <span className="text-sm font-black text-yellow-500 tabular-nums flex items-center gap-1">
                    <Coins size={14} />
                    {(user.walletBalance || 0).toLocaleString()}
                </span>
            </div>
        </div>
    );
};
