
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

// Map Site Sections to Post Types for filtering
const SECTION_FILTERS = [
    { label: 'All Content', value: 'ALL', icon: LayoutGrid },
    { label: 'Photos', value: 'PHOTO', icon: ImageIcon },
    { label: 'Videos', value: 'VIDEO', icon: Film },
    { label: 'Shorts', value: 'SHORT', icon: Smartphone },
    { label: 'Comics', value: 'COMIC', icon: BookOpen },
    { label: 'Collection', value: 'COLLECTION', icon: ShoppingBag },
    { label: 'Live', value: 'LIVE', icon: Clapperboard },
];

export default function ManageContent() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const accentColor = 'text-brand-500';
    
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

    // Pricing Modal State
    const [showPricing, setShowPricing] = useState(false);
    const [pricingTarget, setPricingTarget] = useState<any>(null);

    // Analytics Modal State
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsTarget, setAnalyticsTarget] = useState<any>(null);

    const fetchPosts = async () => {
        setLoading(true);
        // Simulate API fetch of user's own content
        await new Promise(r => setTimeout(r, 600));
        const userPosts = await db.getUserPosts(currentUser?.id || '');
        setPosts(userPosts);
        setLoading(false);
    };

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

    const handlePricingClick = (post: any) => {
        setPricingTarget(post);
        setShowPricing(true);
    };

    const handleAnalyticsClick = (post: any) => {
        setAnalyticsTarget(post);
        setShowAnalytics(true);
    };

    const handleEditClick = (post: any) => {
        setSelectedPost(post);
        setIsEditOpen(true);
    };

    const filteredPosts = posts.filter(p => filterType === 'ALL' || (filterType === 'COLLECTION' ? (p.type === 'PRODUCT' || p.type === 'COLLECTION') : p.type === filterType));

    if (!currentUser) return null;

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

    return (
        <div className="min-h-screen pb-24">
             {/* Header */}
            <div className="border-b border-white/5 bg-transparent backdrop-blur sticky top-0 z-40">
                 <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-[5px] text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg md:text-xl font-medium text-white flex items-center gap-2">
                                <LayoutGrid size={24} className={accentColor} /> 
                                Content Studio
                            </h1>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
                
                {/* Stats Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="border border-white/5 p-4 rounded-[5px] bg-dark-800">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Content</div>
                        <div className="text-xl md:text-2xl font-semibold text-white">{posts.length}</div>
                    </div>
                    <div className="border border-white/5 p-4 rounded-[5px] bg-dark-800">
                        <div className="text-xs text-gray-500 font-medium mb-1">Total Views</div>
                        <div className="text-xl md:text-2xl font-semibold text-white">{(posts.reduce((acc, p) => acc + (p.views || 0), 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="border border-white/5 p-4 rounded-[5px] bg-dark-800">
                        <div className="text-xs text-gray-500 font-medium mb-1">Heat</div>
                        <div className="text-xl md:text-2xl font-semibold text-white">{(posts.reduce((acc, p) => acc + (p.heat || 0), 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="border border-white/5 p-4 rounded-[5px] bg-dark-800">
                         <div className="text-xs text-gray-500 font-medium mb-1">Avg Engagement</div>
                         <div className="text-xl md:text-2xl font-semibold text-brand-500">4.2%</div>
                    </div>
                </div>
                
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

                {/* Simple Pricing Modal */}
                {showPricing && pricingTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-dark-800 border border-white/10 rounded-[5px] w-full max-w-md p-6 relative">
                            <button onClick={() => setShowPricing(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
                                <Coins className="text-yellow-500" size={24} /> Set Pricing
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Price (Tokens)</label>
                                    <input type="number" defaultValue={pricingTarget.price || 0} className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-4 py-2 text-white outline-none focus:border-brand-500" />
                                </div>
                                <button onClick={() => setShowPricing(false)} className="w-full bg-brand-600 hover:bg-brand-500 text-white rounded-[5px] py-2 font-medium transition-colors">
                                    Save Pricing
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Simple Analytics Modal */}
                {showAnalytics && analyticsTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-dark-800 border border-white/10 rounded-[5px] w-full max-w-lg p-6 relative">
                            <button onClick={() => setShowAnalytics(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <X size={20} />
                            </button>
                            <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                                <BarChart2 className="text-brand-500" size={24} /> Performance Analytics
                            </h2>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-dark-900 border border-white/5 rounded-[5px] p-4">
                                    <div className="text-xs text-gray-500 mb-1">Total Views</div>
                                    <div className="text-2xl font-semibold text-white">{(analyticsTarget.views || 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-dark-900 border border-white/5 rounded-[5px] p-4">
                                    <div className="text-xs text-gray-500 mb-1">Total Likes</div>
                                    <div className="text-2xl font-semibold text-white">{(analyticsTarget.likes || 0).toLocaleString()}</div>
                                </div>
                                <div className="bg-dark-900 border border-white/5 rounded-[5px] p-4">
                                    <div className="text-xs text-gray-500 mb-1">Revenue</div>
                                    <div className="text-2xl font-semibold text-yellow-500">{(analyticsTarget.revenue || 0).toLocaleString()} Tokens</div>
                                </div>
                                <div className="bg-dark-900 border border-white/5 rounded-[5px] p-4">
                                    <div className="text-xs text-gray-500 mb-1">Engagement Rate</div>
                                    <div className="text-2xl font-semibold text-brand-500">{(Math.random() * 10).toFixed(1)}%</div>
                                </div>
                            </div>
                            <button onClick={() => setShowAnalytics(false)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-[5px] py-2 font-medium transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 w-full">
                        {SECTION_FILTERS.map(section => (
                            <button 
                                key={section.value}
                                onClick={() => setFilterType(section.value)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-[5px] text-xs font-medium whitespace-nowrap transition-all border ${filterType === section.value ? 'bg-white text-black border-white shadow-sm' : 'text-gray-400 hover:text-white bg-dark-800 border-white/5'}`}
                            >
                                <section.icon size={14} /> {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="w-full">
                    {loading ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                            {/* "Create New" Card */}
                            <div 
                                onClick={() => setViewMode('create')}
                                className="bg-brand-600/10 border border-dashed border-brand-600/30 rounded-[5px] flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-brand-600/20 transition-all h-[400px]"
                            >
                                <div className="w-12 h-12 bg-brand-600 rounded-[5px] flex items-center justify-center mb-4 shadow-sm">
                                    <Plus size={24} className="text-white" />
                                </div>
                                <h3 className="font-medium text-white text-lg mb-1 text-center">Upload Content</h3>
                                <p className="text-xs text-brand-200 text-center">Add new posts or videos</p>
                            </div>

                            {/* Existing Content Cards */}
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="bg-dark-800 rounded-[5px] border border-white/5 overflow-hidden shadow-sm flex flex-col relative group h-[400px] hover:border-brand-500/30 transition-all">
                                    {/* Thumbnail Area */}
                                    <div className="relative h-48 w-full bg-dark-900 shrink-0">
                                        <img 
                                            src={post.thumbnailUrl || post.url || `https://picsum.photos/400/300?random=${post.id}`} 
                                            alt={post.title || 'Content'} 
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-dark-800 via-transparent to-transparent"></div>
                                        
                                        {/* Type Badge */}
                                        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-[5px] border border-white/10 flex items-center gap-1.5 z-20">
                                            {post.type === 'VIDEO' && <Film size={12} className="text-white" />}
                                            {post.type === 'PHOTO' && <ImageIcon size={12} className="text-white" />}
                                            {post.type === 'SHORT' && <Smartphone size={12} className="text-white" />}
                                            {post.type === 'COMIC' && <BookOpen size={12} className="text-white" />}
                                            {post.type === 'COLLECTION' && <ShoppingBag size={12} className="text-white" />}
                                            <span className="text-[10px] font-medium text-white">{post.type}</span>
                                        </div>

                                        {/* Quick Actions (Hover) */}
                                        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                            <button onClick={(e) => { e.stopPropagation(); handleEditClick(post); }} className="w-8 h-8 bg-black/80 backdrop-blur rounded-[5px] flex items-center justify-center text-white hover:bg-brand-500 transition-colors shadow-sm border border-white/10" title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="w-8 h-8 bg-black/80 backdrop-blur rounded-[5px] flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-sm border border-white/10" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Info */}
                                    <div className="p-4 flex-1 flex flex-col bg-dark-800">
                                        <h4 className="text-sm font-medium text-white line-clamp-2 mb-2 leading-tight">
                                            {post.title || post.content || 'Untitled Content'}
                                        </h4>
                                        
                                        {/* Stats Row */}
                                        <div className="flex items-center gap-4 mb-4 mt-auto">
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Eye size={14} />
                                                <span className="text-xs font-medium">{(post.views || Math.floor(Math.random() * 5000)).toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-400">
                                                <Flame size={14} className={accentColor} />
                                                <span className="text-xs font-medium">{(post.heat || Math.floor(Math.random() * 1000)).toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handlePromoteClick(post.id); }} 
                                                className="flex items-center justify-center gap-2 py-2 bg-dark-700 hover:bg-white/10 text-white rounded-[5px] transition-colors text-xs font-medium"
                                            >
                                                <Megaphone size={14} /> Promote
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handlePricingClick(post); }} 
                                                className="flex items-center justify-center gap-2 py-2 bg-dark-700 hover:bg-white/10 text-white rounded-[5px] transition-colors text-xs font-medium"
                                            >
                                                <Coins size={14} /> Pricing
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleAnalyticsClick(post); }} 
                                                className="col-span-2 flex items-center justify-center gap-2 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-[5px] transition-colors text-xs font-medium mt-1 shadow-sm"
                                            >
                                                <BarChart2 size={14} /> Analytics
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
