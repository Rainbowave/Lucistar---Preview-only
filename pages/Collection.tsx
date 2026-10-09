import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search as SearchIcon, Loader2, Package, Film, Sparkles, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CartDrawer } from '../components/cart/CartDrawer';
import { authService } from '../services/authService';
import { db } from '../services/db';
import { InterestHub, Interest } from '../components/InterestHub';
import { MasonryGrid } from '../components/MasonryGrid';

interface CollectionItem {
    id: number | string;
    name: string;
    price: string;
    category: string;
    image: string;
    creator: string;
    avatar: string;
    isPromoted?: boolean;
    type?: 'PRODUCT' | 'AD' | 'COLLECTION';
    link?: string;
    isAdult?: boolean;
}

const COLLECTION_FILTERS = ['All', 'Assets', 'Merch', 'Tools', 'Art', 'Music', '3D Models', 'Software', 'Services', 'Presets', 'Tutorials', 'Statics'];

import { ContentHeader } from '../components/ContentHeader';

// Collection component
export default function Collection() {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const [rawCollections, setRawCollections] = useState<CollectionItem[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    
    useEffect(() => {
        const fetchInitial = async () => {
            setLoading(true);
            try {
                const [productData, trendsData, interestsData] = await Promise.all([
                    api.get<any[]>('/products'),
                    api.get<any[]>('/trends/hashtags'),
                    api.get<any[]>('/trends/tags?section=collection')
                ]);
                
                const formatted: CollectionItem[] = [];
                const sourceData = productData && productData.length > 0 ? [...productData, ...productData] : Array.from({length: 40});

                sourceData.forEach((p: any, i: number) => {
                    const height = [400, 500, 600, 350, 450][i % 5];
                    formatted.push({
                        id: p?.id ? `${p.id}_${i}` : i,
                        name: p?.title || `Product ${i+1}`,
                        price: p?.price || "45.00",
                        category: ['Assets', 'Merch', 'Tools', 'Art', 'Music'][i % 5],
                        image: p?.thumbnailUrl || `https://picsum.photos/600/${height}?random=${i+200}`,
                        creator: p?.userId ? `Creator_${p.userId}` : 'Artist',
                        avatar: `https://picsum.photos/100/100?random=${i}`,
                        isPromoted: i % 10 === 0, 
                        type: 'COLLECTION',
                        isAdult: isAdultMode
                    });
                });

                const injectedCollection = await db.injectContent(formatted, 'collection');
                setRawCollections(injectedCollection);
                setTrends(trendsData);
                
                setInterests(interestsData.map((t: any) => ({
                    id: t.id,
                    title: t.tag,
                    image: t.image
                })));

            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        fetchInitial();
    }, [isAdultMode]);

    const collections = useMemo(() => {
        return rawCollections.filter(p => {
            const matchesFilter = activeFilter === 'All' || p.category === activeFilter || p.type === 'AD';
            return matchesFilter;
        });
    }, [rawCollections, activeFilter]);

    // Statics data
    const staticsData = [
        { id: 's1', title: 'Top Performance', author: 'System', image: 'https://picsum.photos/seed/s1/400/300' },
        { id: 's2', title: 'User Engagement', author: 'System', image: 'https://picsum.photos/seed/s2/400/300' },
        { id: 's3', title: 'Content Reach', author: 'System', image: 'https://picsum.photos/seed/s3/400/300' }
    ];

    const handleAddToCart = () => {
        setIsCartOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-dark-850">
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

            <div className="flex-1 min-w-0 flex flex-col relative">
                <ContentHeader 
                    title="Collection"
                    icon={ShoppingCart}
                    stats={[
                        { label: 'My Library', value: '42' },
                        { label: 'Points', value: '1,250' }
                    ]}
                    userStats={[
                        { label: 'My LSC', value: '25K', color: 'text-yellow-500' }
                    ]}
                    tags={COLLECTION_FILTERS.map(f => ({ id: f, label: f, count: Math.floor(Math.random() * 200).toString() }))}
                    activeTag={activeFilter}
                    onTagClick={setActiveFilter}
                    onAddTag={() => {}}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onCreateClick={() => {}}
                    createLabel="Marketplace"
                    bgImage="https://picsum.photos/seed/market/1920/1080?blur=10"
                    heroHeight="h-[250px]"
                    rightContent={
                        <div className="flex items-center gap-4">
                             <div className="hidden md:flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/5 p-2 rounded-[5px]">
                                <div className="text-center px-2">
                                    <div className="text-sm font-black tracking-tighter text-white">42</div>
                                    <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">My Library</div>
                                </div>
                                <div className="text-center px-2 border-l border-white/10">
                                    <div className="text-sm font-black tracking-tighter text-white">1,250</div>
                                    <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Points</div>
                                </div>
                                <div className="text-center px-2 border-l border-white/10">
                                    <div className="text-sm font-black tracking-tighter text-yellow-500">25K</div>
                                    <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">My LSC</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate('/collection/gallery')} 
                                className="bg-white text-black font-black px-4 py-2.5 rounded-[5px] text-[10px] uppercase tracking-widest shadow-xl hover:bg-gray-200 transition-all flex items-center gap-2 border border-white"
                            >
                                <Film size={14} /> Gallery
                            </button>
                        </div>
                    }
                />

                <div className="p-4 md:p-10 pb-24">
                     {loading ? (
                         <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>
                    ) : (
                         <MasonryGrid 
                             items={collections} 
                             onAddToCart={handleAddToCart}
                             onTip={() => {}}
                             onCommentClick={() => {}}
                         />
                    )}
                    
                    {collections.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40 text-xs font-black uppercase tracking-widest text-gray-500 flex flex-col items-center gap-4">
                             <Package size={48} />
                             No items found in {activeFilter}.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}