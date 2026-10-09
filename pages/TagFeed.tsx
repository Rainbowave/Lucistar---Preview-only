
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { Hash, ArrowLeft, Loader2, Plus, Check, Trophy, Timer, Coins, Megaphone, CheckCircle, Play, Users, Zap, RotateCcw } from 'lucide-react';
import { ExploreStickyNav, StickyContainer } from '../components/ExploreStickyNav';
import { api } from '../services/api';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PostCard } from '../components/PostCard';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { CreatePostModal } from '../components/CreatePostModal';

export default function TagFeed() {
    const { tag } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = authService.getCurrentUser();
    
    const [isPrided, setIsPrided] = useState(false);
    const [trends, setTrends] = useState<any[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    
    // Tag Feed Bar Filters
    const [filter, setFilter] = useState('Top');

    const cleanTag = tag?.replace('#', '') || 'General';

    // Mock Campaign Data for the current tag
    const campaignDetails = {
        title: `${cleanTag} Challenge`,
        description: "Show us your best content fitting this theme. Whether it's photography, digital art, or a short film, we want to see your unique perspective.",
        requirements: [
            `Must use tag #${cleanTag}`,
            "Original content only",
            "Minimum 1080p resolution for video",
            "No AI-generated heavy edits (max 20%)"
        ],
        rewardPool: "5,000 LSC",
        endDate: "Oct 31, 2025"
    };

    useEffect(() => {
        // Check if this tag is already in user's pride
        const prideTags = db.getPrideTags();
        if (tag && prideTags.includes(`#${tag}`)) {
            setIsPrided(true);
        } else if (tag && prideTags.includes(tag)) {
             setIsPrided(true);
        }

        const fetchTrends = async () => {
            try {
                const trendsData = await api.get<any[]>('/trends/hashtags');
                setTrends(trendsData);
            } catch (e) { console.error(e); }
        };
        fetchTrends();
    }, [tag]);

    const handlePrideToggle = () => {
        if (!tag) return;
        const tagWithHash = tag.startsWith('#') ? tag : `#${tag}`;
        db.togglePrideTag(tagWithHash);
        setIsPrided(!isPrided);
    };

    const handleSubmitEntry = () => {
        if (!currentUser) {
            navigate('/auth/login');
            return;
        }
        setIsSubmitModalOpen(true);
    };

    const fetchFeed = useCallback(async (cursor?: string) => {
        try {
            const res = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=12&cursor=${cursor || ''}&tag=${tag}&sort=${filter.toLowerCase()}`);
            
            // If API returns no items (common for specific tags in demo), generate mock content to populate the feed
            if (!res.items || res.items.length === 0) {
                const mockItems = Array.from({ length: 12 }).map((_, i) => ({
                    id: `tag_mock_${cleanTag}_${i}_${cursor || 0}`,
                    type: ['PHOTO', 'VIDEO', 'SHORT'][i % 3],
                    category: cleanTag,
                    title: `${cleanTag} Vibes #${i + 1}`,
                    content: `Exploring the best of #${cleanTag}. This is some auto-generated content for the feed.`,
                    thumbnailUrl: `https://picsum.photos/600/${i % 2 === 0 ? 800 : 450}?random=${cleanTag}${i}${cursor}`,
                    userId: `u_${i}`,
                    user: { 
                        username: `Creator_${i}`, 
                        displayName: `Artist ${i}`, 
                        avatar: `https://picsum.photos/50/50?random=u${i}`,
                        isVerified: i % 3 === 0
                    },
                    heat: Math.floor(Math.random() * 5000) + 100,
                    comments: Math.floor(Math.random() * 50),
                    timestamp: Date.now() - (i * 3600000),
                    isAdult: false
                }));
                return { items: mockItems, nextCursor: 'end' };
            }

            return res;
        } catch (e) {
            return { items: [], nextCursor: undefined };
        }
    }, [tag, filter, cleanTag]);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchFeed);

    useEffect(() => {
        refresh();
    }, [filter]);

    const feedFilters = ['Contest', 'Top', 'Recent'];

    return (
        <div className="relative w-full min-h-screen bg-background font-sans flex flex-col">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />
            
            {/* Contest Entry Modal */}
            {currentUser && (
                <CreatePostModal 
                    isOpen={isSubmitModalOpen} 
                    onClose={() => setIsSubmitModalOpen(false)} 
                    userAvatar={currentUser.avatarUrl}
                    userId={currentUser.id}
                    isPremium={currentUser.isPremium}
                    contentPreference={currentUser.contentPreference}
                    initialType="PHOTO"
                    initialTags={[`#${cleanTag}`, '#ContestEntry']}
                    onSuccess={() => {
                        setIsSubmitModalOpen(false);
                        refresh();
                        alert("Contest entry submitted successfully!");
                    }}
                    userRole={currentUser.role} 
                />
            )}

            {/* Header */}
            <StickyContainer className="px-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                <Hash size={24} className="text-brand-500" /> {cleanTag}
                            </h1>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Tag Feed</p>
                        </div>
                    </div>
                    
                    {campaignDetails ? (
                        <button 
                            onClick={handleSubmitEntry}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg bg-yellow-500 text-black hover:bg-yellow-400"
                        >
                            <Trophy size={14} strokeWidth={3} />
                            Contest
                        </button>
                    ) : (
                        <button 
                            onClick={handlePrideToggle}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                                isPrided 
                                ? 'bg-transparent border border-brand-500 text-brand-500' 
                                : 'bg-brand-500 text-white hover:bg-brand-600'
                            }`}
                        >
                            {isPrided ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                            {isPrided ? 'Following' : 'Follow'}
                        </button>
                    )}
                </div>

                {/* Tag Feed Bar */}
                <div className="flex items-start gap-4">
                    <div className="flex flex-wrap items-center gap-2 pb-1 flex-1">
                        {feedFilters.map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                                    filter === f 
                                    ? 'bg-white text-black border-white shadow-lg' 
                                    : 'bg-card text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <button 
                        onClick={() => refresh()}
                        className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-[5px] text-gray-400 hover:text-white transition-all shadow-lg shrink-0"
                        title="Refresh Feed"
                    >
                        <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </StickyContainer>

            <div className="flex flex-col lg:flex-row relative flex-1 min-h-0">
                <div className="flex-1 min-w-0 bg-dark-850 p-4 md:p-8">
                    
                    {/* Grid Layout Container */}
                    <div className="w-full pb-20">

                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Users size={14} /> Contributors
                            </h3>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        {feedItems.length === 0 && !loading ? (
                            <div className="py-20 text-center opacity-40 flex flex-col items-center">
                                <Hash size={48} className="mb-4 text-gray-500" />
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Posts Yet</h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Be the first to post with #{cleanTag}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {feedItems.map((item: any, index) => (
                                    <div key={`${item.id}-${index}`} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <PostCard 
                                            id={item.id} 
                                            type={item.type || 'photo'} 
                                            category={item.category || item.type}
                                            date={new Date(item.timestamp).toLocaleDateString()}
                                            content={item.content}
                                            pollData={item.pollData}
                                            isPaid={item.privacy === 'paid'}
                                            price={item.price}
                                            ownerId={item.userId}
                                            author={item.user}
                                            isPromoted={item.isPromoted} 
                                            compact={true} 
                                            onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }} 
                                            onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {loading && <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
