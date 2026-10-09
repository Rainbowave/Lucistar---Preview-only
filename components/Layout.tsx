
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Video, Camera, Gamepad2, 
  BookOpen, User, Settings, Bell, Search, Plus, 
  Brain,
  MessageCircle, LogOut,
  Shuffle, Image as ImageIcon, Coins, Users,
  Trophy, HelpCircle, Zap, Vote, CircleDot,
  Heart, ChevronDown,
  ShoppingBag, MessageSquare, FileText,
  LayoutGrid, Moon, Sun, LayoutList, Flame, Activity, Sparkles,
  UserPlus, BarChart2, X, ShieldAlert, Lock, Hash, Crown, UploadCloud, Smartphone, Target, Palette
} from 'lucide-react';
import { CreatePostModal, PostType } from './CreatePostModal';
import { BottomNav } from './mobile/BottomNav';
import { CartDrawer } from './cart/CartDrawer';
import { ChatBar } from './ChatBar';
import { db } from '../services/db';
import { authService } from '../services/authService';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
  onUserUpdate?: (user: any) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, onUserUpdate }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState<PostType | undefined>(undefined);
  const [createContext, setCreateContext] = useState<'general' | 'intimacy'>('general');
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Naughty Gate State
  const [isNaughtyGateOpen, setIsNaughtyGateOpen] = useState(false);
  const [gateProcessing, setGateProcessing] = useState(false);

  // Header Navigation State
  const [isContentOpen, setIsContentOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Right Menu State
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  
  // Split Notification State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const postMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const currentMode = user.contentPreference || 'dating';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) setIsContentOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) setIsProfileMenuOpen(false);
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
      if (postMenuRef.current && !postMenuRef.current.contains(event.target as Node)) setIsPostMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainCreateClick = () => {
    const path = location.pathname;
    setCreateContext('general');
    if (path.includes('/videos')) setCreateModalType('SHORT');
    else if (path.includes('/photos')) setCreateModalType('PHOTO');
    else if (path.includes('/comics')) setCreateModalType('COMIC');
    else if (path.includes('/collection')) setCreateModalType('COLLECTION');
    else if (path.includes('/knowledge-book')) setCreateModalType('RESOURCE');
    else setCreateModalType(undefined);
    setIsCreateModalOpen(true);
  };
  
  const handleIntimacyPost = () => {
      setCreateModalType('PHOTO');
      setCreateContext('intimacy');
      setIsCreateModalOpen(true);
      setIsPostMenuOpen(false);
  };

  const handleModeChange = (mode: 'dating' | 'adult') => {
    if (mode === 'adult' && user.contentPreference !== 'adult') {
        setIsNaughtyGateOpen(true);
        setIsProfileMenuOpen(false);
        return;
    }
    
    authService.updateContentPreference(mode);
    if (onUserUpdate) {
        onUserUpdate({ ...user, contentPreference: mode });
    }
    setIsProfileMenuOpen(false);
    navigate('/home');
  };

  const handleConfirmNaughty = async () => {
      setGateProcessing(true);
      // Simulate transaction processing
      await new Promise(r => setTimeout(r, 1200));
      
      // Update preference
      authService.updateContentPreference('adult');
      if (onUserUpdate) {
          onUserUpdate({ ...user, contentPreference: 'adult' });
      }
      
      setGateProcessing(false);
      setIsNaughtyGateOpen(false);
      navigate('/home');
      window.scrollTo(0, 0);
  };

  const toggleTheme = () => {
    const newTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
          setIsSearchFocused(false);
          setSearchQuery('');
      }
  };

  // Redesigned Mock Notifications using standardized Activity Hub Types
  const mockNotifications = [
      { id: 1, text: 'New follower: @NeonRider', time: '2m', unread: true, type: 'subscription' },
      { id: 2, text: 'Your post is trending!', time: '1h', unread: true, type: 'reach' },
      { id: 3, text: 'System update available', time: '1d', unread: false, type: 'system' },
      { id: 4, text: 'Sara sent a gift', time: '2h', unread: false, type: 'gift' },
      { id: 5, text: 'New comment on "City Lights"', time: '3h', unread: false, type: 'comment' },
      { id: 6, text: 'Video processed successfully', time: '4h', unread: true, type: 'upload' },
  ];
  
  const unreadNotifs = mockNotifications.filter(n => n.unread).length;

  // Content Menu Items
  const mediaItems = [
      { label: 'Photos', path: '/photos', icon: ImageIcon },
      { label: 'Videos', path: '/videos', icon: Video },
      { label: 'Comics', path: '/comics', icon: BookOpen },
      { label: 'Commission', path: '/commissions', icon: Palette },
      { label: 'Collection', path: '/collection', icon: ShoppingBag },
      { label: 'Knowledge', path: '/knowledge-book', icon: FileText },
  ];

  const interactiveItems = [
      { label: 'Live Streams', path: '/live', icon: Camera },
      { label: 'Arcade', path: '/arcade', icon: Gamepad2 },
      { label: 'Random Cam', path: '/random-cam', icon: Shuffle }
  ];

  const contentItems = [...mediaItems, ...interactiveItems];

  const getNotifIconInfo = (type: string) => {
      switch(type) {
          case 'like': return { icon: Flame, color: 'text-yellow-500', bg: 'bg-transparent', border: 'border-transparent' };
          case 'subscription': return { icon: Crown, color: 'text-brand-500', bg: 'bg-transparent', border: 'border-transparent' };
          case 'comment': return { icon: MessageCircle, color: 'text-blue-500', bg: 'bg-transparent', border: 'border-transparent' };
          case 'upload': return { icon: UploadCloud, color: 'text-emerald-500', bg: 'bg-transparent', border: 'border-transparent' };
          case 'reach': return { icon: BarChart2, color: 'text-purple-500', bg: 'bg-transparent', border: 'border-transparent' };
          case 'gift': return { icon: Zap, color: 'text-orange-500', bg: 'bg-transparent', border: 'border-transparent' };
          case 'system': return { icon: Settings, color: 'text-gray-400', bg: 'bg-transparent', border: 'border-transparent' };
          default: return { icon: Bell, color: 'text-gray-500', bg: 'bg-transparent', border: 'border-transparent' };
      }
  };

  return (
    <div className="flex h-screen text-gray-100 font-sans bg-background overflow-hidden">
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Naughty Gate Modal */}
      {isNaughtyGateOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-300">
              <div className="w-full max-w-md bg-dark-850 border border-red-600/30 rounded-[5px] p-8 relative overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.2)]">
                  {/* Top Red Line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-16 h-16 bg-red-600/10 rounded-full flex items-center justify-center border border-red-600/20 text-red-500 shadow-lg shadow-red-900/40">
                          <ShieldAlert size={32} />
                      </div>
                      
                      <div>
                          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Restricted Access</h2>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">18+ Content • Naughty Mode</p>
                      </div>

                      <div className="bg-red-950/20 border border-red-600/20 p-4 rounded-[5px] w-full">
                          <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Entry Fee</span>
                              <span className="text-lg font-black text-white flex items-center gap-1"><Lock size={14} className="text-red-500"/> 500 LSC</span>
                          </div>
                          <p className="text-[10px] text-gray-500 text-left">Unlocks uncensored feed, exclusive superiority content, and private circles.</p>
                      </div>

                      <div className="flex gap-3 w-full">
                          <button 
                              onClick={() => setIsNaughtyGateOpen(false)}
                              className="flex-1 py-3.5 rounded-[5px] border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
                          >
                              Cancel
                          </button>
                          <button 
                              onClick={handleConfirmNaughty}
                              disabled={gateProcessing}
                              className="flex-1 py-3.5 rounded-[5px] bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest shadow-[5px] shadow-red-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                          >
                              {gateProcessing ? 'Verifying...' : 'Confirm'}
                          </button>
                      </div>
                      
                      <p className="text-[9px] text-gray-600 font-medium">
                          By confirming, you verify that you are 18 years of age or older.
                      </p>
                  </div>
              </div>
          </div>
      )}

      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        userAvatar={user.avatarUrl}
        userId={user.id}
        isPremium={user.isPremium}
        contentPreference={user.contentPreference}
        initialType={createModalType}
        context={createContext}
        userRole={user.role} 
      />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />      {/* --- HEADER --- */}
      <header className="h-[75px] border-b border-white/5 bg-[#101010] backdrop-blur-xl sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between gap-4">
         
         {/* Left Side: Logo, Timeline, Content */}
         <div className="flex items-center gap-4 md:gap-6 h-full">
             <div onClick={() => navigate('/home')} className="flex items-center gap-3 cursor-pointer group shrink-0">
                <div className="w-10 h-10 bg-brand-mixed rounded-[5px] flex items-center justify-center font-bold text-white transition-transform group-hover:scale-105 shadow-lg">L</div>
                <span className="hidden md:block text-xl font-black tracking-tighter text-gray-100 uppercase">LuciSin</span>
                <Sparkles size={16} className="text-brand-main hidden md:block" />
             </div>

             {/* Timeline Button - Hidden on Mobile */}
             <button 
                onClick={() => navigate('/home')}
                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-[10px] font-bold uppercase tracking-wide transition-all ${location.pathname === '/home' ? 'text-brand-main' : 'text-gray-400 hover:text-brand-main hover:bg-white/5'}`}
             >
                 <LayoutList size={18} />
                 <span>Content</span>
             </button>

             {/* Content Dropdown */}
             <div className="relative shrink-0" ref={contentRef}>
                 <button 
                    onClick={() => setIsContentOpen(!isContentOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[5px] text-[10px] font-bold uppercase tracking-wide transition-all ${isContentOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                 >
                     <div className="md:hidden flex items-center gap-2">
                        <Search size={16} />
                     </div>
                      <div className="hidden md:flex items-center gap-2">
                         <LayoutGrid size={16} /> <span>Explore</span> <ChevronDown size={12} />
                      </div>
                 </button>
                 {isContentOpen && (
                     <div className="absolute top-full left-0 mt-3 w-[calc(100vw-32px)] md:w-[480px] bg-card border border-white/10 rounded-[5px] shadow-2xl p-6 z-50 animate-in slide-in-from-top-4 duration-300 origin-top-left">
                         <div className="grid grid-cols-2 gap-8">
                            {/* Media Content Section */}
                            <div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Sparkles size={12} className="text-brand-main" /> Media Content
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {mediaItems.map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => { navigate(item.path); setIsContentOpen(false); }}
                                            className="flex items-center gap-3 p-3 bg-background border border-white/5 rounded-[5px] hover:bg-brand-mixed hover:border-transparent transition-all group"
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                                <item.icon size={18} className="text-gray-400 group-hover:text-white" />
                                            </div>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate group-hover:text-white">{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Content Section */}
                            <div>
                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Zap size={12} className="text-brand-main" /> Interactive Content
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {interactiveItems.filter(i => !['Arcade', 'Random Cam'].includes(i.label)).map((item) => (
                                        <button
                                            key={item.label}
                                            onClick={() => { navigate(item.path); setIsContentOpen(false); }}
                                            className="flex items-center gap-3 p-3 bg-background border border-white/5 rounded-[5px] hover:bg-brand-mixed hover:border-transparent transition-all group"
                                        >
                                            <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                                <item.icon size={18} className="text-gray-400 group-hover:text-white" />
                                            </div>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate group-hover:text-white">{item.label}</span>
                                        </button>
                                    ))}
                                    
                                    {/* Separate Arcade and Random Cam */}
                                    <div className="mt-2 pt-2 border-t border-white/5 grid grid-cols-1 gap-2">
                                        {interactiveItems.filter(i => ['Arcade', 'Random Cam'].includes(i.label)).map((item) => (
                                            <button
                                                key={item.label}
                                                onClick={() => { navigate(item.path); setIsContentOpen(false); }}
                                                className="flex items-center gap-3 p-3 bg-background border border-white/5 rounded-[5px] hover:bg-brand-mixed hover:border-transparent transition-all group"
                                            >
                                                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                                                    <item.icon size={18} className="text-gray-400 group-hover:text-white" />
                                                </div>
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate group-hover:text-white">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                         </div>
                      </div>
                 )}
             </div>
         </div>

         {/* Right Side: User Actions & Profile */}
         <div className="flex items-center gap-2 h-full">
             <div className="hidden md:flex items-center h-full gap-4">
                 {/* User Info & Level */}
                 <div className="flex items-center gap-3 p-2 pr-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-[5px] hover:text-white transition-all shadow-lg cursor-pointer group" onClick={() => navigate(`/profile/${user.username}`)}>
                     <div 
                        className="relative shrink-0"
                     >
                         <img src={user.avatarUrl} className="w-[40px] h-[40px] rounded-[3px] object-cover" alt="" />
                     </div>

                     <div className="flex flex-col justify-center">
                         <div className="flex items-center justify-between">
                             <span className="text-xs font-black text-white uppercase tracking-tighter leading-none">{user.displayName}</span>
                         </div>
                         
                         <div className="flex items-center gap-2 mt-1 cursor-default" onClick={(e) => e.stopPropagation()}>
                            {/* Balance Brick */}
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-2 bg-brand-mixed rounded-[1px] shadow-[0_0_5px_rgba(138,180,248,0.5)]"></div>
                                <span className="text-[9px] font-black text-brand-500 tabular-nums">{(user.walletBalance || 0).toLocaleString()} LSC</span>
                            </div>
                            <div className="w-[1px] h-2 bg-white/20"></div>
                            {/* Level Brick */}
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-2 bg-[#e8eaed] rounded-[1px] shadow-[0_0_5px_rgba(232,234,237,0.5)]"></div>
                                <span className="text-[8px] font-black text-[#e8eaed] uppercase tracking-widest">LVL {user.level || 65}</span>
                            </div>
                         </div>
                     </div>
                 </div>

                 {/* Actions inside Card */}
                 <div className="flex items-center gap-1 pl-2">
                      {/* Notifications */}
                     <div className="relative" ref={notificationsRef}>
                         <button 
                            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
                            className={`p-2 rounded-[5px] transition-all relative ${isNotificationsOpen ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                         >
                             <Bell size={16} />
                             {unreadNotifs > 0 && (
                                 <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-dark-900"></div>
                             )}
                         </button>
                         {isNotificationsOpen && (
                             <div className="absolute top-full right-0 mt-3 w-80 bg-background border border-white/10 rounded-[5px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                                 <div className="p-3 border-b border-white/5 bg-card flex items-center gap-2">
                                     <Activity size={14} className="text-brand-500"/>
                                     <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recent Activity</h3>
                                 </div>
                                 <div className="max-h-80 overflow-y-auto no-scrollbar p-2 space-y-2">
                                    {mockNotifications.map(n => {
                                        const { icon: Icon, color, bg, border } = getNotifIconInfo(n.type);
                                        return (
                                            <div 
                                                key={n.id} 
                                                onClick={() => { navigate('/notifications'); setIsNotificationsOpen(false); }}
                                                className={`group flex items-start gap-3 p-3 rounded-[5px] border transition-all cursor-pointer relative overflow-hidden hover:bg-card/80 ${!n.unread ? 'bg-background border-white/[0.03]' : 'bg-card border-brand-500/20 shadow-none'}`}
                                             >
                                                 {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500"></div>}
                                                 
                                                 <div className="relative shrink-0 mt-1">
                                                     <div className={`w-10 h-10 rounded-[5px] flex items-center justify-center ${bg} ${border} border bg-background`}>
                                                         <Icon size={18} className={color} />
                                                     </div>
                                                 </div>
                                                 
                                                 <div className="flex-1 min-w-0 pt-0.5">
                                                     <p className="text-[10px] text-gray-200 leading-snug font-medium mb-1">{n.text}</p>
                                                     <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{n.time} ago</p>
                                                 </div>
        
                                                 <div className="shrink-0 w-10 h-10 rounded-[5px] overflow-hidden border border-white/5 group-hover:border-brand-500/30 transition-colors">
                                                     <img src={`https://picsum.photos/100/100?random=notif_${n.id}`} className="w-full h-full object-cover" alt="" />
                                                 </div>
                                             </div>
                                        );
                                    })}
                                 </div>
                                 <button onClick={() => { navigate('/notifications'); setIsNotificationsOpen(false); }} className="w-full py-3 bg-card text-[10px] font-black uppercase text-white hover:bg-card">View All Hub</button>
                             </div>
                         )}
                     </div>

                     {/* Create Button */}
                     <div className="relative" ref={postMenuRef}>
                        <button 
                            onClick={() => setIsPostMenuOpen(!isPostMenuOpen)}
                            className={`p-2 rounded-[5px] transition-all ${isPostMenuOpen ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Plus size={16} />
                        </button>
                        {isPostMenuOpen && (
                            <div className="absolute top-full right-0 mt-3 w-56 bg-background border border-white/10 rounded-[5px] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-card/50">
                                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Create</span>
                                     <button onClick={() => setIsPostMenuOpen(false)} className="text-gray-400 hover:text-white"><X size={14}/></button>
                                </div>
                                <button onClick={() => { handleMainCreateClick(); setIsPostMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2">
                                    <Zap size={14} className="text-brand-500"/> Standard Post
                                </button>
                                <button onClick={handleIntimacyPost} className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                                    <Heart size={14}/> Post Intimacy
                                </button>
                                <button onClick={() => { navigate('/manage-content'); setIsPostMenuOpen(false); }} className="w-full text-left px-4 py-3 text-xs font-bold text-white hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                                    <LayoutGrid size={14}/> Content Studio
                                </button>
                            </div>
                        )}
                     </div>

                     {/* Settings Button (Profile Menu) */}
                     <div className="relative" ref={profileMenuRef}>
                         <button 
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                            className={`p-2 rounded-[5px] transition-all ${isProfileMenuOpen ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                         >
                             <Settings size={16} />
                         </button>
                         {isProfileMenuOpen && (
                             <div className="absolute top-full right-0 mt-3 w-64 bg-background border border-white/10 rounded-[5px] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                                 {/* Become LuciStar Button */}
                                 <div className="p-2 border-b border-white/5">
                                     <button 
                                        onClick={() => { navigate('/subscriptions'); setIsProfileMenuOpen(false); }}
                                        className="w-full py-2.5 bg-[#fc8347] hover:opacity-90 text-black font-black text-[10px] uppercase tracking-widest rounded-[5px] shadow-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                         <Sparkles size={14} fill="currentColor"/> Become LuciStar
                                     </button>
                                 </div>
        
                                 {/* Experience Mode Section */}
                                 <div className="p-4 border-b border-white/5">
                                     <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">Experience Mode</div>
                                     <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => handleModeChange('dating')} 
                                            className={`py-2.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1 ${currentMode === 'dating' ? 'bg-brand-second text-black border-brand-second' : 'bg-card text-gray-400 border-white/5 hover:text-white'}`}
                                        >
                                            {currentMode === 'dating' && <Heart size={10} fill="currentColor"/>} Dating
                                        </button>
                                        <button 
                                            onClick={() => handleModeChange('adult')} 
                                            className={`py-2.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-1 ${currentMode === 'adult' ? 'bg-[#fc8347] text-black border-[#fc8347]' : 'bg-card text-gray-400 border-white/5 hover:text-white'}`}
                                        >
                                            {currentMode === 'adult' && <Flame size={10} fill="currentColor"/>} Naughty
                                        </button>
                                     </div>
                                 </div>
        
                                 {/* Account Section */}
                                 <div className="p-2 border-b border-white/5">
                                     <div className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account</div>
                                     <button onClick={() => { navigate(`/profile/${user.username}`); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <User size={14}/> My Profile
                                     </button>
                                     <button onClick={() => { navigate('/manage-content'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <LayoutGrid size={14}/> Content Studio
                                     </button>
                                     <button onClick={() => { navigate(`/profile/${user.username}/settings`); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <Settings size={14}/> Settings
                                     </button>
                                     <button onClick={() => { navigate('/downloads'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <UploadCloud size={14}/> Downloads
                                     </button>
                                 </div>
        
                                 {/* Community Section */}
                                 <div className="p-2 border-b border-white/5">
                                     <div className="px-4 py-2 text-[10px] font-black text-gray-500 uppercase tracking-widest">Community</div>
                                     <button onClick={() => { navigate('/intimacy'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <Heart size={14}/> Intimacy
                                     </button>
                                     <button onClick={() => { navigate(`/profile/${user.username}/network/groups`); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <CircleDot size={14}/> My Circles
                                     </button>
                                     <button onClick={() => { navigate('/leaderboard'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <Trophy size={14}/> Leaderboard
                                     </button>
        
                                     <button onClick={() => { navigate('/referrals'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 rounded-[5px] flex items-center gap-3">
                                         <UserPlus size={14}/> {currentMode === 'adult' ? 'Affiliate Program' : 'Referrals'}
                                     </button>
                                 </div>
        
                                 {/* Log Out & Help */}
                                 <div className="p-2 grid grid-cols-5 gap-1">
                                     <button onClick={() => { onLogout(); setIsProfileMenuOpen(false); }} className="col-span-4 w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-[5px] flex items-center gap-3">
                                         <LogOut size={16}/> Log Out
                                     </button>
                                     <button onClick={() => { navigate('/help-center'); setIsProfileMenuOpen(false); }} className="col-span-1 flex items-center justify-center bg-card hover:bg-white/10 rounded-[5px] text-gray-400 hover:text-white transition-colors" title="Help Center">
                                         <HelpCircle size={16}/>
                                     </button>
                                 </div>
                             </div>
                         )}
                     </div>
                 </div>
             </div>
         </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 overflow-y-auto no-scrollbar relative bg-background" ref={scrollContainerRef}>
        {children}
      </main>

      {!location.pathname.startsWith('/random-cam') && <ChatBar />}
      <BottomNav onCreateClick={handleMainCreateClick} onMenuClick={() => setIsProfileMenuOpen(true)} />
      </div>
    </div>
  );
};
