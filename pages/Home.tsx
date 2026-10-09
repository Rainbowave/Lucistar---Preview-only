
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { TipModal } from '../components/TipModal';
import { User } from '../types';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { PostCard } from '../components/PostCard';
import { CommentsModal } from '../components/comments/CommentsModal';
import { PromoteModal } from '../components/PromoteModal';
import { api } from '../services/api';
import { Loader2, UserPlus, Heart, Users, Ticket, Flame, Sparkles, Gift, Dices, Zap, Hexagon, Barcode, Vote, CircleDot, RotateCcw } from 'lucide-react';
import { ExploreStickyNav, StickyContainer } from '../components/ExploreStickyNav';

interface HomeProps {
    user: User;
}

const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
};

// Updated Filter Tags: Replaced 'Polls' with 'Tickets'
const FILTER_TAGS = ['Trending', 'Newest', 'Intimacies', 'Circles', 'Tickets'];

export default function Home({ user }: HomeProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('Trending');
    const [trends, setTrends] = useState<any[]>([]);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [promoteModalOpen, setPromoteModalOpen] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const trendsData = await api.get<any[]>('/trends/hashtags');
                setTrends(trendsData || []);
            } catch (e) { console.error(e); }
        };
        loadInitialData();
    }, [user.contentPreference]);

    const fetchFeed = useCallback(async (cursor?: string) => {
        let typeParam = 'All';
        let sortParam = 'trending';

        if (activeTab === 'Trending') { typeParam = 'Trending'; sortParam = 'trending'; }
        if (activeTab === 'Newest') { typeParam = 'All'; sortParam = 'newest'; }
        if (activeTab === 'Tickets') { typeParam = 'POLL'; sortParam = 'trending'; } // Maps to POLL type
        if (activeTab === 'Intimacies' || activeTab === 'Circles') { typeParam = 'All'; sortParam = 'trending'; }

        const response = await api.get<{ items: any[], nextCursor?: string }>(`/feed?limit=10&cursor=${cursor || ''}&type=${typeParam}&sort=${sortParam}`);
        let items = response.items || [];
        
        if (activeTab === 'Tickets') {
            items = items.filter((i: any) => i.type === 'POLL' || i.pollData);
        }
        if (activeTab === 'Newest') {
             items.sort((a: any, b: any) => b.timestamp - a.timestamp);
        }

        if (!cursor) {
             const demoMix = items.length > 0 ? [...items] : [];

             if (activeTab === 'Trending' || activeTab === 'Newest') {
                 // ... (Rest of injected demo content remains same)
                 const photoCard = {
                     id: 'feed_photo_1',
                     type: 'PHOTO',
                     content: "Just captured this amazing sunset in the cyberpunk district. The neon reflections are unreal tonight. #photography #cyberpunk #cityscape",
                     thumbnailUrl: 'https://picsum.photos/800/800?random=photo_feed_1',
                     user: { username: "alex_smith", displayName: "Alex Smith", avatar: "https://picsum.photos/100/100?random=nv", isVerified: true },
                     heat: 3400,
                     tags: ['photography', 'cyberpunk', 'cityscape'],
                     timestamp: Date.now() - 1200000
                 };
                 
                 const videoCard = {
                    id: 'feed_video_mock',
                    type: 'VIDEO',
                    title: 'Cinematic Travel Vlog: Neon City',
                    content: 'Exploring the nightlife in 1080p. The atmosphere is incredible. #travel #vlog #1080p',
                    thumbnailUrl: 'https://picsum.photos/800/450?random=vid_mock',
                    user: { username: "sarah_jones", displayName: "Sarah Jones", avatar: "https://picsum.photos/100/100?random=vs", isVerified: true },
                    heat: 5400,
                    tags: ['travel', 'vlog', '1080p'],
                    timestamp: Date.now() - 3600000
                };

                const shortCard = {
                    id: 'feed_short_mock',
                    type: 'SHORT',
                    title: 'Quick Drawing Tip',
                    content: 'How to shade in 30 seconds! ✏️ #art #tutorial #shorts',
                    thumbnailUrl: 'https://picsum.photos/400/700?random=short_mock',
                    user: { username: "mike_johnson", displayName: "Mike Johnson", avatar: "https://picsum.photos/100/100?random=ss" },
                    heat: 12000,
                    tags: ['art', 'tutorial', 'shorts'],
                    timestamp: Date.now() - 7200000
                };

                const comicCard = {
                    id: 'feed_comic_mock',
                    type: 'COMIC',
                    title: 'The Cyber Chronicles: Ep 1',
                    content: 'Read the first chapter of my new sci-fi series. #comic #webtoon #scifi',
                    thumbnailUrl: 'https://picsum.photos/600/800?random=comic_mock',
                    user: { username: "emily_davis", displayName: "Emily Davis", avatar: "https://picsum.photos/100/100?random=cs", isVerified: true },
                    heat: 3200,
                    tags: ['comic', 'webtoon', 'scifi'],
                    timestamp: Date.now() - 10800000
                };

                const collectionCard = {
                    id: 'feed_coll_mock',
                    type: 'COLLECTION',
                    title: 'Pro Asset Pack Vol. 1',
                    content: 'High-res textures for your projects. Available now! #assets #design',
                    thumbnailUrl: 'https://picsum.photos/600/600?random=coll_mock',
                    user: { username: "chris_brown", displayName: "Chris Brown", avatar: "https://picsum.photos/100/100?random=cls" },
                    price: "15.00",
                    heat: 600,
                    tags: ['assets', 'design', 'store'],
                    timestamp: Date.now() - 14400000
                };

                const ticketPollCard = {
                    id: 'feed_poll_ticket',
                    type: 'POLL',
                    user: { username: "jessica_wilson", displayName: "Jessica Wilson", avatar: "https://picsum.photos/100/100?random=pool", isVerified: true },
                    pollData: {
                        question: "Weekly 5000 LSC Pool",
                        subtitle: "Weekend Jackpot",
                        options: [
                            { id: '1', label: '1x Entry Ticket', votes: 120 },
                            { id: '2', label: '5x Bundle Entry', votes: 45 },
                        ],
                        type: 'ticket_pool',
                        ticketPrice: "50",
                        endsAt: "24H"
                    },
                    tags: ['LOTTO', 'WIN'],
                    timestamp: Date.now() - 500000
                };

                const interactivePollCard = {
                    id: 'feed_poll_map',
                    type: 'POLL',
                    user: { username: "david_taylor", displayName: "David Taylor", avatar: "https://picsum.photos/100/100?random=map", isVerified: true },
                    pollData: {
                        question: "Where do we drop?",
                        subtitle: "Map Strategy Vote",
                        type: 'standard',
                        mode: 'interactive',
                        image: "https://picsum.photos/1200/800?random=map_base",
                        markers: [
                            { id: '1', x: 20, y: 30, label: 'Sector A', votes: 120 },
                            { id: '2', x: 50, y: 50, label: 'Central Hub', votes: 450 },
                            { id: '3', x: 80, y: 70, label: 'Outpost', votes: 80 }
                        ],
                        endsAt: "15m"
                    },
                    tags: ['GAMING', 'STRATEGY'],
                    timestamp: Date.now() - 300000
                };
                
                const resourceCard = {
                    id: 'feed_res_mock',
                    type: 'RESOURCE',
                    title: 'Creator Growth Guide 2025',
                    content: 'Learn how to maximize your reach on LuciSin. #guide #tips',
                    thumbnailUrl: 'https://picsum.photos/800/500?random=res_mock',
                    user: { username: "lucisin_official", displayName: "LuciSin Official", avatar: "https://picsum.photos/100/100?random=rs", isVerified: true },
                    heat: 8900,
                    category: "Knowledge",
                    tags: ['guide', 'tips', 'growth'],
                    timestamp: Date.now() - 14400000
                };

                demoMix.splice(0, 0, photoCard);
                demoMix.splice(2, 0, videoCard);
                demoMix.splice(3, 0, ticketPollCard);
                demoMix.splice(5, 0, shortCard);
                demoMix.splice(6, 0, interactivePollCard);
                demoMix.splice(7, 0, comicCard);
                demoMix.splice(8, 0, collectionCard);
                demoMix.splice(9, 0, resourceCard);
             }

             if (activeTab === 'Intimacies') {
                 items.length = 0; 
                 
                 const intimacyMocks = Array.from({ length: 5 }).map((_, i) => ({
                    id: `intimacy_post_${i}`,
                    type: 'PHOTO',
                    content: `Sharing a vulnerable moment with my close circle. 🤍 #intimacy #connection`,
                    thumbnailUrl: `https://picsum.photos/800/1000?random=intimacy_${i}`,
                    user: { username: `user_${i}`, displayName: `User ${i}`, avatar: `https://picsum.photos/100/100?random=int_${i}`, isVerified: true },
                    heat: 500 + (i * 50),
                    tags: ['Intimacy', 'Deep', 'Connection'],
                    timestamp: Date.now() - (i * 3600000),
                    isAdult: true 
                 }));
                 items.push(...intimacyMocks);
                 demoMix.length = 0;
                 demoMix.push(...intimacyMocks);
             }

             if (activeTab === 'Circles') {
                 items.length = 0;
                 const circleMocks = Array.from({ length: 5 }).map((_, i) => ({
                    id: `circle_update_${i}`,
                    type: 'POST', 
                    title: `Circle Update: Neon Nights`,
                    content: `Hey everyone in the Neon Nights circle! We have a new event starting this Friday. Don't miss out! 🌃 #circle #community`,
                    user: { username: `group_admin_${i}`, displayName: `Group Admin ${i}`, avatar: `https://picsum.photos/100/100?random=cir_${i}`, isVerified: true },
                    heat: 120 + (i * 10),
                    tags: ['Circle', 'Update', 'Event'],
                    timestamp: Date.now() - (i * 7200000),
                    category: 'Community'
                 }));
                 items.push(...circleMocks);
                 demoMix.length = 0;
                 demoMix.push(...circleMocks);
             }

             return { items: demoMix, nextCursor: response.nextCursor };
        }
        
        return { items, nextCursor: response.nextCursor };
    }, [activeTab]);

    const { data: feedItems, loading, refresh } = useInfiniteScroll(fetchFeed);

    useEffect(() => {
        if (activeTab || user.contentPreference) {
            refresh();
        }
    }, [activeTab, user.contentPreference]);

    const handlePostClick = (item: any) => {
        if (item.type === 'POLL') navigate(`/poll/${item.id}`);
        else if (item.type === 'COLLECTION' || item.type === 'PRODUCT') navigate(`/collection/view/${item.id}`);
        else if (item.type === 'COMIC') navigate(`/comic/${item.id}`);
        else if (item.type === 'RESOURCE') navigate(`/knowledge/${item.id}`);
        else if (item.type === 'VIDEO') navigate(`/video/${item.id}`);
        else if (item.type === 'SHORT') navigate(`/videos`);
        else if (item.type === 'PHOTO') navigate(`/photo/${item.id}`);
        else navigate(`/post/${item.id}`);
    };

    const mainFeedItems = feedItems;

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />
            <PromoteModal isOpen={promoteModalOpen} onClose={() => setPromoteModalOpen(false)} mode="hashtag" />
            
            <div className="flex-1 min-w-0 flex flex-col relative bg-[#101010]">
                {/* Filters & Navigation - Sticky bar */}
                <StickyContainer className="px-4 md:px-8">
                        {/* Sorting Filters */}
                        <div className="flex items-start gap-4 relative w-full">
                            <div className="flex flex-wrap items-center gap-2 flex-1">
                                {FILTER_TAGS.map(filter => (
                                    <button
                                        key={filter}
                                        onClick={() => setActiveTab(filter)}
                                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all flex items-center gap-2 rounded-[5px] ${
                                            activeTab === filter 
                                            ? 'text-[#fc8347] bg-white/5 border border-white/10' 
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                        }`}
                                    >
                                        {filter === 'Trending' && <Flame size={18} className={activeTab === 'Trending' ? 'text-[#fc8347]' : 'opacity-50'} />}
                                        {filter === 'Newest' && <Sparkles size={18} className={activeTab === 'Newest' ? 'text-[#fc8347]' : 'opacity-50'} />}
                                        {filter === 'Intimacies' && <Heart size={18} className={activeTab === 'Intimacies' ? 'text-[#fc8347]' : 'opacity-50'} />}
                                        {filter === 'Circles' && <CircleDot size={18} className={activeTab === 'Circles' ? 'text-[#fc8347]' : 'opacity-50'} />}
                                        {filter === 'Tickets' && <Vote size={18} className={activeTab === 'Tickets' ? 'text-[#fc8347]' : 'opacity-50'} />}
                                        {filter}
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => refresh()}
                                className="p-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-[5px] text-gray-500 hover:text-white transition-all shadow-lg shrink-0"
                                title="Refresh Feed"
                            >
                                <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </StickyContainer>

                    <div className="w-full max-w-[800px] mx-auto pb-20 mt-8 px-4 md:px-8">
                    <div className="space-y-12">
                        {mainFeedItems.map((item: any, index) => (
                            <div key={`${item.id}-${index}`} className={item.isNew ? "animate-in fade-in slide-in-from-top-4 duration-1000" : ""}>
                                <div onClick={() => handlePostClick(item)} className="cursor-pointer transition-transform duration-300 hover:scale-[1.01] h-full mb-8">
                                    <PostCard 
                                        id={item.id} 
                                        type={item.type || 'photo'} 
                                        category={item.category || item.type}
                                        date={formatDate(item.timestamp)}
                                        content={item.content || item.title}
                                        imageUrl={item.thumbnailUrl || item.url}
                                        pollData={item.pollData}
                                        isPaid={item.privacy === 'paid' || (item.price && parseFloat(item.price) > 0)}
                                        price={item.price}
                                        ownerId={item.userId}
                                        privacy={item.privacy}
                                        author={item.user}
                                        tags={item.tags}
                                        isPromoted={item.isPromoted} 
                                        onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }} 
                                        onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }} 
                                    />
                                </div>
                            </div>
                        ))}
                        
                        {mainFeedItems.length === 0 && !loading && (
                            <div className="py-20 text-center opacity-40 text-xs font-black uppercase tracking-widest text-gray-500">
                                No content found for these filters.
                            </div>
                        )}
                        
                        {loading && <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-brand-500" size={32} /></div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
