
import React, { useState, useEffect } from 'react';
import { 
    Heart, Lock, Users, Hash, BarChart2, ShieldCheck, 
    MessageCircle, ArrowRight, Activity, Plus, ChevronLeft,
    Image as ImageIcon, MoreHorizontal, Sparkles, ChevronDown,
    Filter, LayoutGrid, Shield, CheckCircle, Send, Crown, Circle,
    Globe, Search, UserPlus, Info, Flame, Eye, SortAsc, Trophy, Coins, FileText, Megaphone, Play, Video,
    Palette, Gamepad2, Calendar, ShoppingBag, Coffee, MapPin, Clock, Calendar as CalendarIcon,
    AlertCircle, User, Settings, PieChart as PieChartIcon, TrendingUp
} from 'lucide-react';
import { IconDice } from '../components/GamifiedIcons';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { PostCard } from '../components/PostCard';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { SubscriptionModal } from '../components/SubscriptionModal'; 
import { authService } from '../services/authService';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';

const GroupCard = ({ id, name, members, image, isPrivate, onClick, isJoined }: any) => (
    <div 
        onClick={onClick}
        className={`bg-dark-800 border border-white/5 rounded-lg p-3 flex items-center gap-4 cursor-pointer group hover:border-brand-500/30 transition-all ${isJoined ? 'border-brand-500/30 bg-brand-900/10' : ''}`}
    >
        <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-brand-500 to-purple-600 shrink-0">
            <img src={image} className="w-full h-full rounded-full object-cover border-2 border-dark-900" alt={name} />
            {isPrivate && (
                <div className="absolute -bottom-1 -right-1 bg-dark-900 rounded-full p-1 border border-white/10">
                    <Lock size={8} className="text-gray-400" />
                </div>
            )}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white text-sm truncate">{name}</h4>
            <div className="flex items-center gap-2 text-[9px] text-gray-500 font-bold uppercase tracking-wide mt-0.5">
                <Users size={10} /> {members.toLocaleString()}
            </div>
        </div>
        {isJoined && <CheckCircle size={14} className="text-brand-500" />}
    </div>
);

// --- NEW GROUP DETAIL VIEW ---

const GroupDetailView = ({ group, onClose }: { group: any, onClose: () => void }) => {
    const navigate = useNavigate();
    const [sort, setSort] = useState('Newest');
    const [isJoined, setIsJoined] = useState(false);
    const [activeTab, setActiveTab] = useState('Group Feed');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin';

    // Analytics Data
    const growthData = [
        { name: 'Mon', members: 400, engagement: 240 },
        { name: 'Tue', members: 600, engagement: 300 },
        { name: 'Wed', members: 800, engagement: 450 },
        { name: 'Thu', members: 1100, engagement: 600 },
        { name: 'Fri', members: 1500, engagement: 800 },
        { name: 'Sat', members: 1800, engagement: 950 },
        { name: 'Sun', members: 2100, engagement: 1100 },
    ];

    const sexualityData = [
        { name: 'Gay', value: 45, gradient: 'from-teal-400 via-green-500 to-blue-600', shadow: 'rgba(20, 184, 166, 0.4)' },
        { name: 'Bisexual', value: 30, gradient: 'from-pink-500 via-purple-500 to-blue-500', shadow: 'rgba(236, 72, 153, 0.4)' },
        { name: 'Pansexual', value: 15, gradient: 'from-pink-400 via-yellow-400 to-blue-400', shadow: 'rgba(244, 114, 182, 0.4)' },
        { name: 'Other', value: 10, gradient: 'from-gray-400 to-gray-600', shadow: 'rgba(156, 163, 175, 0.4)' },
    ];
    
    // Generate Mock Posts for Group Feed
    const groupPosts: any[] = [];

    const topPosts = [...groupPosts].sort((a, b) => b.heat - a.heat).slice(0, 3);

    // Generate Mock Events
    const groupEvents: any[] = [];

    const handleJoin = () => {
        setIsJoined(!isJoined);
    };
    
    const handlePostClick = (postId: number) => {
        // Link to PhotoDetail layout as requested for intimacy content
        navigate(`/photo/${postId}?layout=intimacy`);
    };

    return (
        <div className="animate-in fade-in duration-500 w-full">
            {/* 1. Header Banner */}
            <div className="relative h-[320px] rounded-xl overflow-hidden group w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                <img src={group.image} className="w-full h-full object-cover" alt="Banner" />
                
                {/* Back Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-6 left-6 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-md p-2 rounded-full text-white transition-colors border border-white/10"
                >
                    <ChevronLeft size={20} />
                </button>

                {/* Group Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 flex flex-wrap items-end justify-between gap-6">
                    <div className="flex items-end gap-6">
                        <div className="w-32 h-32 rounded-xl border-4 border-dark-900 overflow-hidden shadow-2xl relative bg-dark-800">
                            <img src={group.image} className="w-full h-full object-cover" alt="Avatar" />
                        </div>
                        <div className="mb-2">
                            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{group.name}</h1>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
                                <span className="flex items-center gap-1"><Users size={14} className="text-brand-500" /> {group.members.toLocaleString()} Members</span>
                                <span className="flex items-center gap-1"><Activity size={14} className="text-green-500" /> Very Active</span>
                                {group.isPrivate && <span className="flex items-center gap-1"><Lock size={14} className="text-yellow-500" /> Private</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isAdmin && (
                            <button 
                                onClick={() => setIsEditModalOpen(true)}
                                className="p-3 bg-dark-800 hover:bg-dark-700 text-gray-400 hover:text-white rounded-xl border border-white/10 transition-all"
                                title="Edit Circle"
                            >
                                <Settings size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Circle Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-dark-900 border border-white/10 rounded-2xl p-8 w-full max-w-lg animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Edit Circle Settings</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white"><MoreHorizontal size={20}/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Circle Name</label>
                                <input type="text" defaultValue={group.name} className="w-full bg-dark-800 border border-white/5 rounded-lg px-4 py-3 text-white focus:border-brand-500 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Description</label>
                                <textarea rows={3} className="w-full bg-dark-800 border border-white/5 rounded-lg px-4 py-3 text-white focus:border-brand-500 outline-none transition-all resize-none">Welcome to the {group.name}. This space is dedicated to open expression, mutual respect, and connecting with like-minded individuals.</textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Privacy</label>
                                    <select className="w-full bg-dark-800 border border-white/5 rounded-lg px-4 py-3 text-white outline-none">
                                        <option>Public</option>
                                        <option selected={group.isPrivate}>Private</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Category</label>
                                    <select className="w-full bg-dark-800 border border-white/5 rounded-lg px-4 py-3 text-white outline-none">
                                        <option>Social</option>
                                        <option>Art</option>
                                        <option>Support</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest">Cancel</button>
                            <button onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-black uppercase tracking-widest transition-all">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Feed & Sidebar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                
                {/* Left: Main Content (3 Cols) */}
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                         <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                             {['Group Feed', 'Discussions', 'Circle Info', 'Moderators'].map(tab => (
                                 <button 
                                    key={tab} 
                                    onClick={() => setActiveTab(tab)}
                                    className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-500 border-brand-500' : 'text-gray-500 border-transparent hover:text-white'}`}
                                 >
                                     {tab}
                                 </button>
                             ))}
                         </div>
                         {activeTab === 'Group Feed' && (
                             <div className="flex items-center gap-2 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                 Sort by <span className="text-white flex items-center gap-1 cursor-pointer">{sort} <ChevronDown size={12}/></span>
                             </div>
                         )}
                    </div>

                    {/* Content Views */}
                    {activeTab === 'Group Feed' && (
                        <div className="space-y-8">
                            {/* Top Posts Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Trophy size={16} className="text-yellow-500" />
                                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Top Posts This Week</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {topPosts.map((post: any) => (
                                        <div key={`top-${post.id}`} className="relative group cursor-pointer" onClick={() => handlePostClick(post.id)}>
                                            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/5">
                                                <img src={post.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <img src={post.user.avatar} className="w-5 h-5 rounded-full border border-white/20" alt="" />
                                                        <span className="text-[9px] font-bold text-white truncate">@{post.user.username}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[8px] font-black text-gray-300 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1"><Flame size={10} className="text-brand-500" /> {post.heat}</span>
                                                        <span className="flex items-center gap-1"><MessageCircle size={10} /> {post.comments}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Feed List (Activity Hub Style) */}
                            <div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Activity size={18} className="text-brand-500" />
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Activity</h3>
                                </div>
                                <div className="space-y-3">
                                    {groupPosts.map((post: any) => (
                                        <div 
                                            key={post.id} 
                                            onClick={() => handlePostClick(post.id)}
                                            className="group flex items-start gap-5 p-5 rounded-2xl border border-white/[0.03] bg-dark-900 transition-all cursor-pointer relative overflow-hidden hover:bg-dark-800/80 hover:border-brand-500/20"
                                        >
                                            <div className="relative shrink-0 mt-1">
                                                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-dark-800 border border-white/10">
                                                    {post.type === 'PHOTO' ? <ImageIcon size={24} className="text-blue-500" /> : post.type === 'VIDEO' ? <Video size={24} className="text-pink-500" /> : <FileText size={24} className="text-gray-400" />}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full border-2 border-dark-800 overflow-hidden shadow-md">
                                                    <img src={post.user.avatar} className="w-full h-full object-cover" alt="" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="text-sm text-gray-200 leading-snug font-medium mb-1">
                                                    <span className="font-black text-white uppercase tracking-tighter mr-1.5 hover:underline">@{post.user.username}</span>
                                                    <span className="text-gray-400">shared a new {post.type.toLowerCase()} in the circle.</span>
                                                    <div className="mt-1 text-xs text-gray-500 line-clamp-1">"{post.content}"</div>
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1"><Flame size={10} className="text-brand-500" /> {post.heat}</span>
                                                        <span className="flex items-center gap-1"><MessageCircle size={10} /> {post.comments}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {post.thumbnailUrl && (
                                                <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/5 group-hover:border-brand-500/30 transition-colors shadow-lg">
                                                    <img src={post.thumbnailUrl} className="w-full h-full object-cover" alt="Content" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Discussions' && (
                        <div className="space-y-6">
                            {/* Moderator Tools Section */}
                            <div className="bg-dark-800 border border-brand-500/20 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white uppercase tracking-wide">Admin Announcements</h4>
                                        <p className="text-[10px] text-gray-500">Official updates from circle leaders</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2">
                                    <Plus size={12} /> New Announcement
                                </button>
                            </div>

                            {/* Discussions List */}
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 1, title: 'Welcome to our new members!', author: 'Admin_Sarah', time: '2h ago', content: 'We are excited to have so many new faces in the circle. Please introduce yourselves in the comments!', type: 'announcement' },
                                    { id: 2, title: 'What is your favorite cyberpunk movie?', author: 'NeonRider', time: '5h ago', content: 'I just watched Blade Runner 2049 again and it blew my mind. What else should I watch?', type: 'discussion' },
                                    { id: 3, title: 'Circle Guidelines Update', author: 'Mod_Art', time: '1d ago', content: 'We have updated our community rules to ensure a safer space for everyone. Please review them in the Circle Info tab.', type: 'announcement' }
                                ].map(item => (
                                    <div key={item.id} onClick={() => navigate(`/post/${item.id}`)} className={`bg-dark-800 border rounded-xl p-5 hover:border-brand-500/30 transition-all group cursor-pointer ${item.type === 'announcement' ? 'border-brand-500/20' : 'border-white/5'}`}>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${item.type === 'announcement' ? 'bg-brand-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
                                                    {item.type}
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-bold">{item.time}</span>
                                            </div>
                                            <button className="text-gray-500 hover:text-white"><MoreHorizontal size={16}/></button>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-2 group-hover:text-brand-500 transition-colors">{item.title}</h4>
                                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">{item.content}</p>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                            <div className="flex items-center gap-2">
                                                <img src={`https://picsum.photos/50/50?random=${item.author}`} className="w-6 h-6 rounded-full border border-white/10" alt="" />
                                                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{item.author}</span>
                                            </div>
                                            <button className="flex items-center gap-1.5 text-[10px] font-black text-brand-500 uppercase tracking-widest hover:text-white transition-colors">
                                                <MessageCircle size={12} /> Join Discussion
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'Circle Info' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                             <div className="bg-dark-800 border border-white/5 rounded-xl p-8">
                                 <h3 className="text-lg font-black text-white uppercase tracking-tighter mb-4 flex items-center gap-2">
                                     <Info size={18} className="text-brand-500"/> Circle Manifesto
                                 </h3>
                                 <p className="text-gray-300 text-sm leading-relaxed mb-6 font-medium">
                                     Welcome to the {group.name}. This space is dedicated to open expression, mutual respect, and connecting with like-minded individuals. We encourage sharing art, thoughts, and experiences that align with our core values.
                                 </p>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Community Identity</h4>
                                         <div className="flex flex-wrap gap-2">
                                             {['LGBTQ+', 'Safe Space', 'Dating', 'Naughty', 'Verified', '18+'].map(tag => (
                                                 <span key={tag} className="px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-500 rounded text-[10px] font-black uppercase tracking-widest">
                                                     {tag}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                     <div>
                                         <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">Vibe Check</h4>
                                         <div className="flex flex-wrap gap-2">
                                             {['Chill', 'Supportive', 'Creative', 'Respectful'].map(tag => (
                                                 <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[10px] font-black uppercase tracking-widest">
                                                     {tag}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                 </div>

                                 <div className="mt-8">
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                                         <PieChartIcon size={14} className="text-purple-500"/> Sexuality Distribution
                                     </h4>
                                     <div className="space-y-4">
                                         {sexualityData.map((item, i) => (
                                             <div key={i} className="space-y-1.5">
                                                 <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                     <span className="text-white">{item.name}</span>
                                                     <span className="text-gray-500">{item.value}%</span>
                                                 </div>
                                                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                     <div 
                                                         className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${item.gradient}`} 
                                                         style={{ 
                                                             width: `${item.value}%`, 
                                                             boxShadow: `0 0 10px ${item.shadow}`
                                                         }}
                                                     ></div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div className="bg-dark-800 border border-white/5 rounded-xl p-6">
                                     <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                         <Shield size={16} className="text-green-500"/> Guardians (Admins)
                                     </h3>
                                     <div className="space-y-3">
                                         {[1, 2, 3].map(i => (
                                             <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                                                 <img src={`https://picsum.photos/50/50?random=admin${i}`} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                                 <div>
                                                     <div className="text-xs font-bold text-white">Admin_User_{i}</div>
                                                     <div className="text-[9px] text-gray-500 uppercase tracking-wider">Circle Leader</div>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                                 
                                 <div className="bg-dark-800 border border-white/5 rounded-xl p-6">
                                     <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                         <AlertCircle size={16} className="text-red-500"/> Rules
                                     </h3>
                                     <ul className="space-y-3 text-xs text-gray-400 font-medium">
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> No harassment or hate speech.</li>
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Respect privacy and consent.</li>
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> No spam or self-promotion without approval.</li>
                                         <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Keep content relevant to the circle theme.</li>
                                     </ul>
                                 </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'Moderators' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: 'Admin_Sarah', role: 'Circle Leader', avatar: 'https://picsum.photos/100/100?random=mod1', bio: 'Passionate about building safe spaces.' },
                                    { name: 'Mod_Art', role: 'Content Moderator', avatar: 'https://picsum.photos/100/100?random=mod2', bio: 'Art enthusiast and community guardian.' },
                                    { name: 'Gamer_Joe', role: 'Event Coordinator', avatar: 'https://picsum.photos/100/100?random=mod3', bio: 'Organizing the best weekly mixers.' },
                                ].map((mod, i) => (
                                    <div key={i} className="bg-dark-800 border border-white/5 rounded-xl p-6 flex flex-col items-center text-center group hover:border-brand-500/30 transition-all">
                                        <div className="relative mb-4">
                                            <img src={mod.avatar} className="w-20 h-20 rounded-full border-2 border-brand-500/20 p-1" alt="" />
                                            <div className="absolute -bottom-1 -right-1 bg-brand-500 rounded-full p-1.5 border-2 border-dark-900">
                                                <Shield size={12} className="text-white" />
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-widest mb-1">{mod.name}</h4>
                                        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-3">{mod.role}</span>
                                        <p className="text-[10px] text-gray-500 leading-relaxed mb-4">{mod.bio}</p>
                                        <div className="flex gap-2 w-full">
                                            <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Message</button>
                                            <button className="flex-1 py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Profile</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Info Sidebar (1 Col) - Simplified */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-dark-800 border border-white/5 rounded-xl p-6 sticky top-24">
                        <button 
                            onClick={handleJoin}
                            className={`w-full mb-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs shadow-lg transition-all ${isJoined ? 'bg-dark-700 text-white border border-white/20' : 'bg-brand-600 text-white hover:bg-brand-500'}`}
                        >
                            {isJoined ? 'Joined' : 'Join Circle'}
                        </button>
                        
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Quick Stats</h4>
                        <div className="space-y-4">
                              <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Active Ratio</span>
                                 <span className="text-brand-500 font-bold">84%</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Established</span>
                                 <span className="text-white font-bold">Oct 2024</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Access</span>
                                 <span className="text-yellow-500 font-bold uppercase">{group.isPrivate ? 'Private' : 'Public'}</span>
                             </div>
                             <div className="flex justify-between items-center text-xs">
                                 <span className="text-gray-500">Posts Today</span>
                                 <span className="text-green-500 font-bold">+124</span>
                             </div>
                        </div>
                        <div className="h-px bg-white/5 my-6"></div>
                        <button className="w-full py-3 rounded-lg bg-white text-black hover:bg-brand-500 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all">
                            Invite Friends
                        </button>

                        <div className="mt-6 p-4 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 bg-yellow-500/10 rounded-full blur-xl -mr-4 -mt-4"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-500">
                                    <Trophy size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-yellow-500/70 uppercase tracking-widest mb-0.5">Circle Rank</p>
                                    <h4 className="text-lg font-black text-white">Top 1%</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function Intimacy() {
    const navigate = useNavigate();
    const [selectedGroup, setSelectedGroup] = useState<any | null>(null);
    const [filter, setFilter] = useState('All');
    
    // Generate Groups
    const groups: any[] = [];

    const filteredGroups = groups.filter(g => filter === 'All' || g.category === filter);

    // Circle Categories Data
    const categoryStats = [
        { id: 'All', label: 'All Circles', members: '850K', icon: IconDice, color: 'from-blue-400 to-indigo-500' },
        { id: 'LGBTQ+', label: 'LGBTQ+', members: '150K', icon: Heart, color: 'from-purple-500 to-pink-500' },
        { id: 'Social', label: 'Social', members: '240K', icon: MessageCircle, color: 'from-pink-500 to-rose-500' },
        { id: 'Art', label: 'Art', members: '95K', icon: Palette, color: 'from-purple-500 to-violet-500' },
        { id: 'Support', label: 'Support', members: '45K', icon: Heart, color: 'from-red-500 to-orange-500' },
        { id: 'Events', label: 'Events', members: '28K', icon: Calendar, color: 'from-yellow-400 to-amber-500' },
        { id: 'Makeup', label: 'Makeup', members: '62K', icon: Sparkles, color: 'from-fuchsia-400 to-pink-400' },
        { id: 'Fashion', label: 'Fashion', members: '88K', icon: ShoppingBag, color: 'from-emerald-400 to-teal-500' },
        { id: 'Lifestyle', label: 'Lifestyle', members: '110K', icon: Coffee, color: 'from-orange-400 to-amber-500' },
    ];

    // Active Tag Contests
    const activeContests: any[] = [];

    return (
        <div className="min-h-screen bg-dark-900 pb-20">
            {selectedGroup ? (
                <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
                    <GroupDetailView group={selectedGroup} onClose={() => setSelectedGroup(null)} />
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-brand-500/10 rounded-lg text-brand-500">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white uppercase  tracking-tighter">Intimacy Circles</h1>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Safe spaces for deeper connection</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => navigate('/intimacy/create')}
                                className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                            >
                                <Plus size={14} /> Create Circle
                            </button>
                        </div>
                    </div>

                    <div className="max-w-[1600px] mx-auto p-6 md:p-8 space-y-10">
                        
                        {/* Circle Category Bar */}
                        <div className="overflow-x-auto no-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0">
                            <div className="flex gap-6 min-w-max">
                                {categoryStats.map(cat => {
                                    const isActive = filter === cat.id;
                                    return (
                                        <button 
                                            key={cat.id} 
                                            onClick={() => setFilter(cat.id)}
                                            className="flex flex-col items-center gap-3 group min-w-[80px]"
                                        >
                                            <div className={`p-[2px] rounded-full bg-gradient-to-tr ${isActive ? cat.color : 'from-dark-700 to-dark-800 group-hover:from-dark-600 group-hover:to-dark-700'} transition-all`}>
                                                <div className="w-16 h-16 rounded-full bg-dark-900 flex items-center justify-center border-4 border-dark-900 relative shadow-lg">
                                                     <cat.icon size={22} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'} />
                                                     {isActive && <div className="absolute inset-0 bg-white/10 rounded-full animate-pulse"></div>}
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <span className={`block text-[10px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>{cat.label}</span>
                                                <span className="block text-[9px] font-bold text-gray-600 tabular-nums">{cat.members}</span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Active Tag Contests Container Bar */}
                        <div className="mb-6 border-t border-b border-white/5 py-8">
                            <div className="flex items-center gap-2 mb-6 px-1">
                                <Trophy size={18} className="text-yellow-500" />
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">Active Tag Contests</h3>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                                {activeContests.map((contest) => (
                                    <div 
                                        key={contest.id}
                                        className="min-w-[240px] bg-dark-800 border border-white/5 rounded-xl p-5 relative overflow-hidden group cursor-pointer hover:border-white/20 transition-all shadow-lg"
                                        onClick={() => navigate(`/tags/${contest.hashtag.replace('#', '')}`)}
                                    >
                                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${contest.bg} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>
                                        
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-lg font-black text-white tracking-tighter mb-1">{contest.hashtag}</h4>
                                                <span className="text-[10px] font-black bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded border border-yellow-500/20">
                                                    {contest.rewardPool.toLocaleString()} LSC
                                                </span>
                                            </div>
                                            
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-4 truncate">{contest.title}</p>
                                            
                                            <button className="w-full py-2 bg-white text-black hover:bg-brand-500 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
                                                <Megaphone size={12} /> Join Contest
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Search Control */}
                        <div className="flex justify-end mb-4">
                            <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 rounded-lg border border-white/5">
                                <Search size={14} className="text-gray-500"/>
                                <input type="text" placeholder="Find a circle..." className="bg-transparent text-xs text-white placeholder-gray-600 outline-none w-32 font-bold" />
                            </div>
                        </div>

                        {/* Groups Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredGroups.map(group => (
                                <GroupCard 
                                    key={group.id} 
                                    {...group} 
                                    isJoined={false}
                                    onClick={() => setSelectedGroup(group)} 
                                />
                            ))}
                            {filteredGroups.length === 0 && (
                                <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
                                    No circles found in {filter}.
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
