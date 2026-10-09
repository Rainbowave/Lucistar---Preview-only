
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Trash2, Edit2, Filter, 
    Image as ImageIcon, Video, BookOpen, ShoppingBag, 
    Eye, Heart, MessageCircle,
    Loader2, Megaphone, Plus, CheckSquare, X, FileText,
    BarChart2, Zap, LayoutGrid, Clock, Maximize2, Layers,
    Smartphone, Grid, Clapperboard, Film, Flame, FolderPlus,
    MoreHorizontal, Coins
} from 'lucide-react';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { CreatePostModal, PostType } from '../components/CreatePostModal';
import { PromoteModal } from '../components/PromoteModal';
import { EditPostModal } from '../components/EditPostModal';
import { PostCard } from '../components/PostCard';

// Map Site Sections to Post Types for filtering
const SECTION_FILTERS = [
    { label: 'All Content', value: 'ALL', icon: LayoutGrid },
    { label: 'Photos', value: 'PHOTO', icon: ImageIcon },
    { label: 'Videos', value: 'VIDEO', icon: Film },
    { label: 'Shorts', value: 'SHORT', icon: Smartphone },
    { label: 'Comics', value: 'COMIC', icon: BookOpen },
    { label: 'Collection', value: 'COLLECTION', icon: ShoppingBag },
    { label: 'Commissions', value: 'COMMISSION', icon: Coins },
    { label: 'Live', value: 'LIVE', icon: Clapperboard },
];

export default function ContentStudio() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';
    const accentColor = isAdultMode ? 'text-brand-500' : 'text-brand-second';
    
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Creation State
    const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
    const [createType, setCreateType] = useState<PostType>('PHOTO');
    
    const [filterType, setFilterType] = useState('ALL');
    
    // Editing State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any>(null);

    // Promote Modal State
    const [showPromote, setShowPromote] = useState(false);
    const [promoteTarget, setPromoteTarget] = useState<string | null>(null);

    const fetchPosts = async () => {
        setLoading(true);
        // Simulate API fetch of user's own content
        await new Promise(r => setTimeout(r, 600));
        const userPosts = await db.getUserPosts(currentUser?.id || '');
        setPosts(userPosts);
        setLoading(false);
    };

    // Use ID to stabilize dependency and prevent infinite loops
    useEffect(() => {
        fetchPosts();
    }, [currentUser?.id]);

    const handleDelete = (id: number | string) => {
        if(confirm("Are you sure you want to delete this content?")) {
            db.deletePost(id.toString());
            setPosts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handlePromoteClick = (id: string | number) => {
        setPromoteTarget(id.toString());
        setShowPromote(true);
    };

    const handleEditClick = (post: any) => {
        setSelectedPost(post);
        setIsEditOpen(true);
    };

    const filteredPosts = posts.filter(p => filterType === 'ALL' || (filterType === 'COLLECTION' ? (p.type === 'PRODUCT' || p.type === 'COLLECTION') : p.type === filterType));

    const commissionPosts = posts.filter(p => p.type === 'COMMISSION');

    if (!currentUser) return null;

    // --- RENDER CREATE MODE (In-Page) ---
    if (viewMode === 'create') {
        return (
            <div className="min-h-screen bg-dark-900 flex flex-col">
                <CreatePostModal 
                    isOpen={true} 
                    onClose={() => setViewMode('list')} 
                    userAvatar={currentUser.avatarUrl}
                    userId={currentUser.id}
                    isPremium={currentUser.isPremium}
                    contentPreference={currentUser.contentPreference} 
                    initialType={createType}
                    variant='page'
                    onSuccess={() => { setViewMode('list'); fetchPosts(); }}
                    userRole={currentUser.role}
                />
            </div>
        );
    }

    // --- RENDER LIST MODE ---
    return (
        <div className="min-h-screen pb-24">
             {/* Header */}
            <div className="border-b border-white/5 bg-transparent backdrop-blur sticky top-0 z-40">
                 <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                <LayoutGrid size={24} className={accentColor} /> 
                                {isAdultMode ? 'Naughty Studio' : 'Content Studio'}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
                
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="border border-white/5 p-4 rounded-[5px]">
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Content</div>
                        <div className="text-xl md:text-2xl font-black text-white">{posts.length}</div>
                    </div>
                    <div className="border border-white/5 p-4 rounded-[5px]">
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Views</div>
                        <div className="text-xl md:text-2xl font-black text-white">{(posts.reduce((acc, p) => acc + (p.views || 0), 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="border border-white/5 p-4 rounded-[5px]">
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Heat</div>
                        <div className="text-xl md:text-2xl font-black text-white">{(posts.reduce((acc, p) => acc + (p.heat || 0), 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="border border-white/5 p-4 rounded-[5px]">
                         <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1">Avg Engagement</div>
                         <div className="text-xl md:text-2xl font-black text-brand-500">4.2%</div>
                    </div>
                </div>
                
                {/* Modals for non-creation actions */}
                <PromoteModal 
                    isOpen={showPromote}
                    onClose={() => setShowPromote(false)}
                    mode="post"
                />
                
                <EditPostModal 
                    isOpen={isEditOpen} 
                    onClose={() => setIsEditOpen(false)} 
                    post={selectedPost} 
                    onSave={fetchPosts}
                />

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
                    {SECTION_FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterType(filter.value)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${filterType === filter.value ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-900/20' : 'bg-dark-800 border-white/5 text-gray-400 hover:border-white/20'}`}
                        >
                            <filter.icon size={14} />
                            {filter.label}
                        </button>
                    ))}
                </div>

                {filterType === 'COMMISSION' ? (
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <Coins size={24} className="text-yellow-500" /> Commissioned Art Studio
                            </h2>
                            <button 
                                onClick={() => { setCreateType('COMMISSION' as any); setViewMode('create'); }}
                                className="px-6 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                            >
                                <Plus size={16} /> New Commission Drop
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {commissionPosts.length === 0 ? (
                                <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-xl">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Coins size={32} className="text-gray-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-tight">No Commissions Yet</h3>
                                    <p className="text-gray-500 text-sm max-w-xs mx-auto mb-6">Start selling your art by creating your first commission drop.</p>
                                    <button 
                                        onClick={() => { setCreateType('COMMISSION' as any); setViewMode('create'); }}
                                        className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Create First Drop
                                    </button>
                                </div>
                            ) : (
                                commissionPosts.map((post) => (
                                    <div key={post.id} className="group bg-dark-800 border border-white/5 rounded-xl overflow-hidden hover:border-brand-500/30 transition-all">
                                        <div className="aspect-square relative overflow-hidden">
                                            <img src={post.imageUrl || post.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                                <span className="text-xs font-black text-yellow-500">${post.price || '0.00'}</span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h4 className="text-sm font-black text-white uppercase tracking-tight mb-1 truncate">{post.title || post.content?.split('\n')[0] || 'Untitled Commission'}</h4>
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <Eye size={12} />
                                                        <span className="text-[10px] font-bold">{post.views || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-500">
                                                        <Heart size={12} />
                                                        <span className="text-[10px] font-bold">{post.likes || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleEditClick(post)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-red-500 transition-colors">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[400px]">
                        {loading ? (
                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
                        ) : (
                            <div className="flex flex-col gap-4 md:gap-6">
                                
                                {/* "Create New" Card */}
                                <div 
                                    onClick={() => setViewMode('create')}
                                    className="bg-brand-600/10 border border-brand-500/20 rounded-2xl flex items-center justify-center p-8 cursor-pointer hover:bg-brand-600/20 hover:border-brand-500 transition-all group h-32 shadow-lg shadow-brand-900/10 gap-6"
                                >
                                    <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl shadow-brand-600/30">
                                        <Plus size={28} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-white uppercase tracking-tighter text-xl mb-1">New Drop</h3>
                                        <p className="text-[9px] font-bold text-brand-200 uppercase tracking-[0.2em]">Upload & Monetize</p>
                                    </div>
                                </div>

                                {/* Existing Content Cards */}
                                {filteredPosts.map(post => (
                                    <div key={post.id} className="relative group bg-dark-800 rounded-2xl border border-white/5 overflow-hidden shadow-lg flex flex-col md:flex-row h-auto md:h-48">
                                        {/* Thumbnail Area */}
                                        <div className="relative h-48 md:h-full w-full md:w-64 bg-dark-900 shrink-0">
                                            <img 
                                                src={post.thumbnailUrl || post.url || post.imageUrl || `https://picsum.photos/400/300?random=${post.id}`} 
                                                alt={post.title || 'Content'} 
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent md:bg-gradient-to-r"></div>
                                            
                                            {/* Type Badge */}
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                                                {post.type === 'VIDEO' && <Film size={12} className="text-white" />}
                                                {post.type === 'PHOTO' && <ImageIcon size={12} className="text-white" />}
                                                {post.type === 'SHORT' && <Smartphone size={12} className="text-white" />}
                                                {post.type === 'COMIC' && <BookOpen size={12} className="text-white" />}
                                                {post.type === 'COLLECTION' && <ShoppingBag size={12} className="text-white" />}
                                                {post.type === 'COMMISSION' && <Coins size={12} className="text-yellow-500" />}
                                                <span className="text-[9px] font-black text-white uppercase tracking-widest">{post.type}</span>
                                            </div>

                                            {/* Quick Actions (Hover) */}
                                            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(post); }} className="w-8 h-8 bg-black/80 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-brand-500 transition-colors shadow-lg border border-white/10" title="Edit">
                                                    <Edit2 size={14} />
                                                </button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="w-8 h-8 bg-black/80 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-lg border border-white/10" title="Delete">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content Info */}
                                        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h4 className="text-lg font-black text-white line-clamp-2 mb-2 leading-tight">
                                                    {post.title || post.content || 'Untitled Content'}
                                                </h4>
                                                
                                                {/* Stats Row */}
                                                <div className="flex items-center gap-6 mb-4">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Eye size={16} />
                                                        <span className="text-sm font-bold">{(post.views || Math.floor(Math.random() * 5000)).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Flame size={16} className={accentColor} />
                                                        <span className="text-sm font-bold">{(post.heat || Math.floor(Math.random() * 1000)).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-white/5">
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); handlePromoteClick(post.id); }} 
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-dark-700 hover:bg-white/10 text-white rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    <Megaphone size={14} /> Promote
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); /* Monetize logic */ }} 
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest"
                                                >
                                                    <Coins size={14} /> Monetize
                                                </button>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); /* Analytics logic */ }} 
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors text-[10px] font-black uppercase tracking-widest shadow-lg shadow-brand-900/20 ml-auto"
                                                >
                                                    <BarChart2 size={14} /> Content Performance
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
