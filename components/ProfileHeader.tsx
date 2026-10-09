
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { MapPin, Link as LinkIcon, Calendar, Crown, Gift, Trophy, Check, Plus, MessageCircle, ChevronDown, Video, Palette, Cpu, ArrowRight, Flame, Users, Tag, Settings, Mic, Star, Coins, ShoppingBag, Target, Globe, Zap, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileHeaderProps {
    user: User;
    isOwnProfile: boolean;
    isFollowing: boolean;
    onFollow: () => void;
    onSubscribe: (tier: string) => void;
    onTip: () => void;
    onMessage: () => void;
    activeTab: string;
    onTabChange: (tabId: string) => void;
    tabs: { id: string; icon: any; label: string }[];
    children?: React.ReactNode;
    leftChildren?: React.ReactNode;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
    user, 
    isOwnProfile, 
    isFollowing, 
    onFollow, 
    onSubscribe,
    onTip,
    onMessage,
    activeTab,
    onTabChange,
    tabs,
    children,
    leftChildren
}) => {
    const navigate = useNavigate();
    const [showFollowingMenu, setShowFollowingMenu] = useState(false);
    const followingDropdownRef = useRef<HTMLDivElement>(null);

    const achievements = [
        { id: 1, title: 'Grand Champion', description: 'Reached the highest rank in competitive play.', game: 'Cyber Dash', icon: Trophy, color: 'bg-brand-mixed' },
        { id: 2, title: 'Sharpshooter', description: 'Achieved 95% accuracy in 10 consecutive matches.', game: 'Cyber Dash', icon: Target, color: 'bg-white/10' },
        { id: 3, title: 'System Overlord', description: 'Hacked 100 terminals without detection.', game: 'Cyber Dash', icon: Cpu, color: 'bg-white/10' },
        { id: 4, title: 'Speed Demon', description: 'Completed all time trials in under 2 minutes.', game: 'Cyber Dash', icon: Zap, color: 'bg-white/10' },
        { id: 5, title: 'On Fire', description: 'Maintained a 20-match win streak.', game: 'Cyber Dash', icon: Flame, color: 'bg-white/10' },
        { id: 6, title: 'Rising Star', description: 'Gained 10,000 XP in a single day.', game: 'Cyber Dash', icon: Star, color: 'bg-white/10' },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (followingDropdownRef.current && !followingDropdownRef.current.contains(event.target as Node)) {
                setShowFollowingMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMessageClick = () => {
        navigate('/chat');
    };

    // Name Coloring Logic
    const getNameClass = () => {
        if (user.isLuciStarPremium) {
            // Sexuality Gradient Map
            const sexuality = user.sexuality || 'Other';
            if (sexuality.includes('Gay')) return "text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-green-500 to-blue-500";
            if (sexuality.includes('Lesbian')) return "text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-pink-500";
            if (sexuality.includes('Bi')) return "text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500";
            if (sexuality.includes('Pan')) return "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400";
            if (sexuality.includes('Trans')) return "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-white";
            if (sexuality.includes('Queer')) return "text-transparent bg-clip-text bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500";
            return "text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500"; // Gradient Name (Gold)
        }
        if (user.isLuciStar) {
            return "text-brand-400 drop-shadow-[0_0_10px_rgba(0,210,255,0.3)]"; // Colored Name (Silver)
        }
        return "text-white";
    };

    return (
        <div className="px-6 md:px-12 relative mt-[30px] mb-8 bg-[#1a1a1a] pb-8 rounded-b-[5px] group/profile-header">
            {/* Resizer Handles */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/profile-header:opacity-100 transition-opacity"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/profile-header:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/profile-header:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/profile-header:opacity-100 transition-opacity"></div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 items-start pt-6 relative z-20 group/main-header">
                {/* Avatar & Info - Left */}
                <div className="shrink-0 relative group flex flex-col w-32 md:w-56 items-center bg-[#1b1b1b] rounded-[5px] p-5 shadow-2xl border border-white/5 overflow-hidden group/avatar">
                    <div className="relative w-full aspect-square mt-2">
                        <div className="w-full h-full rounded-[5px] overflow-hidden shadow-lg relative z-10 border border-white/5">
                            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>

                        {isOwnProfile && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[5px] cursor-pointer z-20" onClick={() => navigate(`/profile/${user.username}/settings`)}>
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Update</span>
                            </div>
                        )}
                    </div>

                    {/* Name & Badges - Aligned with Profile Picture */}
                    <div className="w-full mt-4 text-center">
                        <h1 className={`text-xl font-black flex items-center justify-center gap-1 uppercase tracking-tighter ${getNameClass()}`}>
                            {user.displayName} 
                            {user.isVerified && <span className="bg-brand-second rounded-[3px] p-0.5 text-white"><Check size={8} strokeWidth={4} /></span>}
                        </h1>
                        <div className="flex flex-col items-center gap-1 mt-1">
                            <div className="flex items-center gap-1">
                                {user.isLuciStarPremium && <span className="bg-yellow-500 text-black px-1.5 py-0.5 rounded-[2px] text-[7px] font-black uppercase tracking-wider flex items-center gap-0.5"><Crown size={8} fill="currentColor"/> Luci</span>}
                                {user.isLuciStar && <span className="bg-slate-300 text-black px-1.5 py-0.5 rounded-[2px] text-[7px] font-black uppercase tracking-wider flex items-center gap-0.5"><Star size={8} fill="currentColor"/> Lusciou</span>}
                            </div>
                        </div>
                    </div>

                    {/* Stats - Pride, Following, Heat */}
                    <div className="flex items-center justify-between mt-2.5 mb-2.5 px-2 w-full">
                        <div 
                            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/profile/${user.username}/network/pride`)}
                        >
                            <div className="flex items-center">
                                <Users size={12} className="text-[#fc8347] mr-0.5" />
                                <span className="font-bold text-[#e9e8ed] text-sm tracking-tighter">{(user.followers / 1000).toFixed(1)}K</span>
                            </div>
                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mt-0.5">Pride</span>
                        </div>
                        <div 
                            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate(`/profile/${user.username}/network/following`)}
                        >
                            <div className="flex items-center">
                                <Plus size={12} className="text-[#fc8347] mr-0.5" />
                                <span className="font-bold text-[#e9e8ed] text-sm tracking-tighter">450</span>
                            </div>
                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mt-0.5">Following</span>
                        </div>
                        <div className="flex flex-col items-center cursor-default">
                            <div className="flex items-center">
                                <Flame size={12} className="text-orange-500 mr-0.5" />
                                <span className="font-bold text-[#e9e8ed] text-sm tracking-tighter">1.2M</span>
                            </div>
                            <span className="text-[8px] text-gray-500 uppercase font-black tracking-widest mt-0.5">Heat</span>
                        </div>
                    </div>

                    {/* CCC Container - Collection, Cam, Commission */}
                    <div className="mt-5 w-full flex items-center justify-center bg-background/50 p-2 rounded-[5px] relative group/container z-10 border border-white/5">
                        {[
                            { label: 'Collection', icon: ShoppingBag, rating: '4.8', onClick: () => navigate(`/profile/${user.username}/collection`) },
                            { label: 'Random Cam', icon: Camera, rating: '4.9', onClick: () => navigate(`/profile/${user.username}/cam`) },
                            { label: 'Commission', icon: Palette, rating: '4.7', onClick: () => navigate(`/profile/${user.username}/commissions`) },
                        ].map((item) => (
                            <div 
                                key={item.label}
                                className="flex-1 group relative flex flex-col items-center py-2 hover:bg-white/5 rounded-[3px] transition-all cursor-pointer"
                                onClick={item.onClick}
                            >
                                <item.icon size={14} className="text-gray-500 group-hover:text-brand-500 transition-colors" />
                                <div className="flex items-center gap-0.5 mt-1">
                                    <Star size={8} fill="currentColor" className="text-yellow-500" />
                                    <span className="text-[8px] font-black text-white">{item.rating}</span>
                                </div>
                                
                                {/* Hover Label */}
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[7px] font-black uppercase tracking-widest px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-white/10 z-30">
                                    {item.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Edit/Settings Buttons - Moved directly under user name */}
                    {isOwnProfile && (
                        <div className="flex flex-col gap-2 w-full mt-4 z-10 relative">
                            <button onClick={() => navigate(`/profile/${user.username}/settings`)} className="bg-white text-black font-black py-3 px-3 rounded-[5px] transition-colors shadow-lg text-[10px] uppercase tracking-widest w-full hover:bg-[#fc8347] hover:text-black border-none text-center">
                                Edit Profile
                            </button>
                            <button onClick={() => navigate('/content-studio')} className="bg-transparent text-gray-400 font-bold py-2 px-3 rounded-[5px] transition-colors text-[9px] uppercase tracking-widest hover:bg-white/5 hover:text-white flex items-center justify-center gap-2 border border-white/10 border-solid">
                                <Settings size={12} /> Studio Settings
                            </button>
                        </div>
                    )}

                    {leftChildren && <div className="w-full mt-4 z-10 relative">{leftChildren}</div>}
                </div>

                {/* Main Info - Center */}
                <div className="flex-1 min-w-0 pt-2 md:pt-20 lg:pt-20 space-y-6">
                    <div className="flex flex-col xl:flex-row gap-8">
                        {/* Description & Links */}
                        <div className="flex-1 space-y-4">
                            <p className="text-gray-200 text-lg leading-relaxed font-light max-w-2xl pt-2.5">
                                {user.description || "Sharing high-fidelity content within the network. 🎮 🎨 This is a multi-line description example to showcase how the profile looks with more text content. We are building the future of digital intimacy and creative expression."}
                            </p>

                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium pb-4 border-b border-white/5">
                                <div className="flex items-center gap-2"><MapPin size={16} className="text-brand-500" /> {user.location || 'Unknown Location'}</div>
                                
                                <a href="#" className="flex items-center gap-2 text-brand-second hover:text-brand-400 transition-colors"><LinkIcon size={16} /> lucisin.com/{user.username}</a>
                                <div className="flex items-center gap-2"><Calendar size={16} className="text-brand-500" /> Joined {new Date().getFullYear()}</div>
                            </div>
                        </div>

                        {/* Arcade Achievements & User Level Container */}
                        <div className="w-full xl:w-auto shrink-0 flex items-start justify-end mt-4 xl:mt-0 xl:-mt-[15px]">
                            <div className="relative group/pride rounded-[5px] flex items-center gap-5 border border-white/5 bg-[#1b1b1b] shadow-xl p-3">
                                
                                {/* User Level (Moved to Left) */}
                                <div className="flex flex-col items-center justify-center px-1">
                                    <span className="text-lg font-black text-white leading-none tracking-tighter">LVL {user.level || 42}</span>
                                    <span className="text-[7px] text-gray-500 uppercase font-black tracking-widest mt-1">User Level</span>
                                </div>
                                
                                <div className="w-px h-8 bg-white/10"></div>

                                {/* Arcade Section */}
                                <div className="flex items-center gap-1.5 relative group/arcade z-10 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/arcade/achievements')}>
                                    <div className="group/achievement relative px-3 py-1.5 bg-brand-mixed rounded-[3px] flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 shrink-0">
                                        <Trophy size={14} className="text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Achievements</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Categories Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 mt-2.5 scrollbar-none">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => onTabChange(tab.id)}
                                    className={`group/tab relative flex items-center justify-center h-[36px] rounded-[5px] text-[10px] uppercase font-black tracking-widest transition-all duration-300 ease-out border ${
                                        isActive 
                                        ? 'bg-[#fc8347] text-black border-[#fc8347] shadow-lg px-4' 
                                        : 'bg-card text-gray-400 hover:bg-white/5 hover:text-white border-white/5 w-[36px] px-0 hover:w-[120px]'
                                    }`}
                                >
                                    <Icon size={14} className="shrink-0" />
                                    <span className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out flex items-center ${
                                        isActive
                                        ? 'max-w-[150px] opacity-100 ml-2'
                                        : 'max-w-0 opacity-0 group-hover/tab:max-w-[150px] group-hover/tab:opacity-100 group-hover/tab:ml-2'
                                    }`}>
                                        {tab.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="w-full mt-8">
                        {children}
                    </div>
                </div>

                {/* Right Column: Actions Card (Only for non-owners now) */}
                {!isOwnProfile && (
                    <div className="w-full lg:w-72 shrink-0 mt-[30px]">
                        <div className="bg-card border border-white/5 rounded-[5px] p-4 pt-[15px] shadow-xl relative group/actions">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <div className="relative flex-1" ref={followingDropdownRef}>
                                        <button 
                                            onClick={isFollowing ? () => setShowFollowingMenu(!showFollowingMenu) : onFollow} 
                                            className={`w-full font-black py-2.5 px-4 rounded-[5px] transition-all shadow-lg flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest ${isFollowing ? 'bg-card text-white border border-white/5' : 'bg-white text-black hover:bg-brand-main hover:text-white'}`}
                                        >
                                            {isFollowing ? (
                                                <>Following Pride <ChevronDown size={16} className={`transition-transform duration-200 ${showFollowingMenu ? 'rotate-180' : ''}`} /></>
                                            ) : (
                                                'Join Pride'
                                            )}
                                        </button>

                                        {isFollowing && showFollowingMenu && (
                                            <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-white/5 rounded-[5px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-white/5">
                                                <button 
                                                    onClick={() => {onSubscribe('1'); setShowFollowingMenu(false);}} 
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                                                >
                                                    <Crown size={14} className="text-brand-500" /> Subscription Plans
                                                </button>
                                                <button 
                                                    onClick={() => {onFollow(); setShowFollowingMenu(false);}} 
                                                    className="w-full text-left px-4 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors border-t border-white/5"
                                                >
                                                    Leave Pride
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button onClick={onMessage} className="bg-card text-white border border-white/5 font-black py-2.5 px-4 rounded-[5px] transition-colors shadow-lg text-[10px] uppercase tracking-widest hover:bg-white/10 flex items-center justify-center">
                                        <MessageCircle size={16} />
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={onTip} className="flex-1 py-2.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-[5px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                                        <Gift size={14} /> Send Gift
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
