
import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, MessageSquare, Sparkles, Heart, Check, Crown, Star, Flame, Globe, Trophy } from 'lucide-react';
import { User } from '../types';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  onMessageClick?: (e: React.MouseEvent) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick, onMessageClick }) => {
  const navigate = useNavigate();
  
  // Name Coloring Logic (simplified from ProfileHeader)
  const getNameClass = () => {
    if (user.isLuciStarPremium) return "text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500";
    if (user.isLuciStar) return "text-brand-400";
    return "text-white";
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.1}
      onClick={onClick}
      className="relative group cursor-pointer h-full z-10"
    >
        {/* Decorative Number '8' */}
        <div className="absolute -left-[23px] top-1/2 -translate-y-1/2 text-[64px] font-black text-white/[0.03] pointer-events-none select-none z-0 group-hover:text-brand-main/10 transition-colors duration-500">
            8
        </div>

        {/* Resizer Handles */}
        <div className="absolute inset-0 pointer-events-none z-50">
            <div className="absolute top-0 left-0 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity m-1"></div>
            <div className="absolute top-0 right-0 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity m-1"></div>
            <div className="absolute bottom-0 left-0 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity m-1"></div>
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity m-1"></div>
            
            <div className="absolute top-1/2 left-0 w-1 h-[15px] -translate-y-1/2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5"></div>
            <div className="absolute top-1/2 right-0 w-1 h-[15px] -translate-y-1/2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-0.5"></div>
        </div>

        <div className="relative bg-[#1a1a1a] bg-pattern rounded-[5px] p-5 shadow-xl transition-all duration-300 overflow-hidden h-full border border-white/5 group-hover:border-brand-main/30 z-10">
        
        {/* Main Content: Avatar & Info Row */}
        <div className="flex gap-4">
            {/* Left Column: Rectangular Avatar & Rating */}
            <div className="flex flex-col items-center shrink-0">
                <div className="relative mb-2">
                    <div className="w-14 h-14 rounded-[5px] bg-card overflow-hidden relative z-10 shadow-xl border border-white/10 group-hover:border-brand-main/30 transition-colors">
                        <img src={user.avatarUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={user.displayName} />
                    </div>
                    {user.isVerified && (
                        <div className="absolute -top-1 -right-1 bg-brand-second text-white p-0.5 rounded-[2px] shadow-lg z-20">
                            <Check size={8} strokeWidth={4} />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#fc8347] font-black uppercase">
                    <span>{user.level ? (4.0 + (user.level / 100)).toFixed(1) : '4.5'}</span>
                    <Star size={10} fill="currentColor" />
                </div>
            </div>

            {/* Right Column: Name & Details */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <div className="min-w-0">
                        <h4 className={`text-sm font-black uppercase tracking-tighter truncate ${getNameClass()}`}>
                            {user.displayName}
                        </h4>
                        <p className="text-[10px] text-gray-500 font-bold truncate">@{user.username}</p>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${user.username}`); }}
                        className="text-gray-400 hover:text-[#fc8347] transition-colors p-1"
                    >
                        <UserPlus size={16} />
                    </button>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                    {user.isLuciStarPremium && <span className="bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded-[2px] text-[7px] font-black uppercase tracking-wider flex items-center gap-0.5 border border-yellow-500/20"><Crown size={8} fill="currentColor"/> LuciStar</span>}
                    <span className="bg-white/5 text-gray-400 px-1.5 py-0.5 rounded-[2px] text-[7px] font-black uppercase tracking-wider border border-white/10">LVL {user.level || 42}</span>
                </div>

                <p className="text-[9px] text-gray-400 leading-relaxed line-clamp-2 mt-2">
                    <span className="font-bold text-gray-300 mr-1">Bio:</span> {user.description || 'Exploring the boundaries of connection and digital intimacy.'}
                </p>
            </div>
        </div>

        {/* Action Buttons Section */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
            <button 
                onClick={(e) => { e.stopPropagation(); onMessageClick?.(e); }}
                className="flex-1 py-2 rounded-[5px] bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
                <MessageSquare size={12} /> Chat
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/profile/${user.username}`); }}
                className="flex-1 py-2 rounded-[5px] bg-[#fc8347] text-black text-[9px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
            >
                View Profile
            </button>
        </div>
      </div>
    </motion.div>
  );
};
