
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
    Search as SearchIcon, Users, Grid, Hash, Filter, Loader2, 
    Video, Image as ImageIcon, BookOpen, ShoppingBag, 
    Flame, Heart, FileText, Smartphone, Radio, ChevronRight, LayoutGrid,
    Plus, Check, Sparkles, X, Palette, Gamepad2, ArrowRight, RotateCcw
} from 'lucide-react';
import { ExploreStickyNav, StickyContainer } from '../components/ExploreStickyNav';
import { api } from '../services/api';
import { db } from '../services/db';
import { MasonryGrid } from '../components/MasonryGrid';
import { authService } from '../services/authService';
import { PostCard } from '../components/PostCard';
import { HashtagCard } from '../components/HashtagCard';

const SEARCH_FILTERS = [
    { id: 'photos', label: 'Photos', icon: ImageIcon },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'shorts', label: 'Shorts', icon: Smartphone },
    { id: 'comics', label: 'Comics', icon: BookOpen },
    { id: 'collection', label: 'Collection', icon: ShoppingBag },
    { id: 'knowledge', label: 'Knowledge', icon: FileText },
    { id: 'live', label: 'Live Streams', icon: Radio },
    { id: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { id: 'users', label: 'Users', icon: Users }
];

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const query = searchParams.get('q') || '';
    const tags = query.split(',').map(t => t.trim()).filter(Boolean);
    const category = searchParams.get('category') || 'everything';
    const mode = searchParams.get('mode');
    
    const [groupedResults, setGroupedResults] = useState<Record<string, any[]>>({});
    const [allItems, setAllItems] = useState<any[]>([]); 
    const [loading, setLoading] = useState(false);
    const [isFallback, setIsFallback] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);
    const [isTagsCollapsed, setIsTagsCollapsed] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = () => setRefreshKey(prev => prev + 1);

    // Initialize search state from URL query to persist it
    const [searchQuery, setSearchQuery] = useState(query);
    const [activeTags, setActiveTags] = useState<string[]>(tags);

    // Pride State
    const [isPrided, setIsPrided] = useState(false);

    const currentUser = authService.getCurrentUser();
    const isNaughtyMode = currentUser?.contentPreference === 'adult';
    const accentColor = isNaughtyMode ? 'text-brand-500' : 'text-brand-second';
    
    // Sync local state if URL changes externally
    useEffect(() => {
        setSearchQuery('');
        setActiveTags(tags);
    }, [query]);

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const newQuery = [...activeTags, searchQuery.trim()].filter(Boolean).join(',');
            setSearchQuery('');
            navigate(`/search?q=${encodeURIComponent(newQuery)}&category=${category}`);
        }
    };

    useEffect(() => {
        // Check Pride Status
        if (query && query.startsWith('#')) {
             const tag = query;
             const prideTags = db.getPrideTags();
             setIsPrided(prideTags.includes(tag));
        } else {
            setIsPrided(false);
        }

        const fetchResults = async () => {
            setLoading(true);
            setIsFallback(false);
            await new Promise(r => setTimeout(r, 600));

            // 1. Fetch Real + Seeded Content
            let allContent = await db.getPosts();

            // 2. Generate Extra Mock Data for dense search results
            const extraMocks: any[] = [];
            
            // 3. Generate Mock Creators (Users)
            const mockUsers: any[] = [];

            // 4. Generate Mock Tags
            const mockTags: any[] = [];

            // 5. Generate Specific Post Mocks
            const specificPostMocks: any[] = [];

            // 5.5 Generate Mock Arcade Games
            const ALL_GAMES = [
                { id: 'miner', title: 'Time Miner', desc: 'Click & Earn', color: 'bg-yellow-600', image: 'https://picsum.photos/600/400?random=miner', multiplier: '100PTS', type: 'ARCADE' },
                { id: 'heads', title: 'Flip Fate', desc: 'Heads or Tails', color: 'bg-amber-500', image: 'https://picsum.photos/600/400?random=101', multiplier: '2X', type: 'ARCADE' },
                { id: 'rps', title: 'Tactical Arena', desc: 'Rock Paper Scissors', color: 'bg-pink-500', image: 'https://picsum.photos/600/400?random=102', multiplier: '2X', type: 'ARCADE' },
                { id: 'wheel', title: 'Neon Wheel', desc: 'Spin to Win', color: 'bg-purple-500', image: 'https://picsum.photos/600/400?random=103', multiplier: '10X', type: 'ARCADE' },
                { id: 'guess', title: 'Neural Guess', desc: 'Higher or Lower', color: 'bg-blue-500', image: 'https://picsum.photos/600/400?random=104', multiplier: 'Variable', type: 'ARCADE' },
                { id: 'dice', title: 'Cosmic Dice', desc: 'Roll the Bones', color: 'bg-emerald-500', image: 'https://picsum.photos/600/400?random=105', multiplier: '5X', type: 'ARCADE' },
                { id: 'ace', title: 'Ace Hunter', desc: 'Find the Card', color: 'bg-slate-500', image: 'https://picsum.photos/600/400?random=106', multiplier: '3X', type: 'ARCADE' },
                { id: 'crypto_slots', title: 'Slot Machine', desc: 'Match Symbols', color: 'bg-orange-500', image: 'https://picsum.photos/600/400?random=107', multiplier: '100X', type: 'ARCADE' },
                { id: 'roulette', title: 'Roulette', desc: 'Red or Black', color: 'bg-red-600', image: 'https://picsum.photos/600/400?random=108', multiplier: '14X', type: 'ARCADE' },
                { id: 'keno', title: 'Keno Grid', desc: 'Pick Numbers', color: 'bg-indigo-500', image: 'https://picsum.photos/600/400?random=109', multiplier: 'Variable', type: 'ARCADE' },
                { id: 'blackjack', title: 'Blackjack', desc: 'Hit or Stand', color: 'bg-green-600', image: 'https://picsum.photos/600/400?random=110', multiplier: '2.5X', type: 'ARCADE' },
                { id: 'mines', title: 'Mines', desc: 'Extraction', color: 'bg-red-800', image: 'https://picsum.photos/600/400?random=111', multiplier: 'Scaling', type: 'ARCADE' },
                { id: 'color', title: 'Color Predict', desc: 'Blue or Red', color: 'bg-cyan-500', image: 'https://picsum.photos/600/400?random=112', multiplier: '1.9X', type: 'ARCADE' },
                { id: 'crazy', title: 'Crazy Times', desc: 'Wheel Bonus', color: 'bg-yellow-500', image: 'https://picsum.photos/600/400?random=113', multiplier: '500X', type: 'ARCADE' },
                { id: 'double', title: 'Double Risk', desc: 'Risk it all', color: 'bg-zinc-500', image: 'https://picsum.photos/600/400?random=114', multiplier: '2X++', type: 'ARCADE' },
            ];

            allContent = [...allContent, ...extraMocks, ...specificPostMocks, ...ALL_GAMES];

            // 6. Filter by Query & Mode
            let searchResults = allContent.filter((p: any) => {
                // Strict Mode Filtering
                if (!isNaughtyMode && p.isAdult) return false;
                
                // Exclude RESOURCES if any snuck in from DB
                if (p.type === 'RESOURCE') return false;

                if (!query) return true; // Show all if no query (Trending view)

                const username = p.user?.username || (typeof p.user === 'string' ? p.user : '');
                const t = p.title || '';
                const c = p.content || '';
                const cat = p.category || '';
                const tags = p.tags || [];

                if (mode === 'interest') {
                    const userTags = p.user?.tags || [];
                    const myTags = currentUser?.interestProfile?.tags || currentUser?.tags || [];
                    if (myTags.length > 0) {
                        return userTags.some((tag: string) => myTags.some((myTag: string) => tag.toLowerCase().includes(myTag.toLowerCase())));
                    }
                    return userTags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()));
                }

                const searchStr = `${t} ${c} ${tags.join(' ')} ${cat} ${username}`.toLowerCase();
                return searchStr.includes(query.toLowerCase());
            });

            // 6.5 LuciStar Priority Sorting
            searchResults.sort((a: any, b: any) => {
                // Priority 0: LuciStar Status
                if (a.user?.isLuciStar && !b.user?.isLuciStar) return -1;
                if (!a.user?.isLuciStar && b.user?.isLuciStar) return 1;

                // Priority 1: Interest Match
                if (a.user?.isInterestMatch && !b.user?.isInterestMatch) return -1;
                if (!a.user?.isInterestMatch && b.user?.isInterestMatch) return 1;
                
                // Priority 2: Verified Status
                if (a.user?.isVerified && !b.user?.isVerified) return -1;
                if (!a.user?.isVerified && b.user?.isVerified) return 1;

                // Priority 3: Heat/Popularity
                return (b.heat || 0) - (a.heat || 0);
            });

            // Fallback if no results
            if (searchResults.length === 0) {
                setIsFallback(true);
                searchResults = allContent
                    .filter((p: any) => (!isNaughtyMode ? !p.isAdult : true) && p.type !== 'RESOURCE')
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 20);
            }

            // 7. Group Results for specific tabs
            const groups: Record<string, any[]> = {
                shorts: [],
                photos: [],
                videos: [],
                comics: [],
                collection: [],
                posts: [],
                users: mockUsers,
                tags: mockTags,
                arcade: []
            };

            searchResults.forEach((item: any) => {
                if (item.type === 'SHORT') groups.shorts.push(item);
                else if (item.type === 'PHOTO') groups.photos.push(item);
                else if (item.type === 'VIDEO') groups.videos.push(item);
                else if (item.type === 'COMIC') groups.comics.push(item);
                else if (item.type === 'COLLECTION' || item.type === 'PRODUCT') groups.collection.push(item);
                else if (item.type === 'ARCADE') groups.arcade.push(item);
                else groups.posts.push(item);
            });

            setGroupedResults(groups);
            
            // Set all items for Masonry Grid ("All Results" View)
            setAllItems([...specificPostMocks, ...searchResults]);
            
            setLoading(false);
        };
        
        fetchResults();
    }, [query, isNaughtyMode, refreshKey]);

    const handlePrideToggle = () => {
        if (!query || !query.startsWith('#')) return;
        db.togglePrideTag(query);
        setIsPrided(!isPrided);
    };

    const getActiveList = () => {
        switch(category) {
            case 'shorts': return groupedResults.shorts || [];
            case 'photos': return groupedResults.photos || [];
            case 'videos': return groupedResults.videos || [];
            case 'comics': return groupedResults.comics || [];
            case 'collection': return groupedResults.collection || [];
            case 'posts': return groupedResults.posts || []; 
            case 'users': return groupedResults.users || [];
            case 'tags': return groupedResults.tags || [];
            case 'arcade': return groupedResults.arcade || [];
            case 'everything': return allItems;
            default: return [];
        }
    };
    
    const updateCategory = (cat: string) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('category', cat);
            return newParams;
        });
    };

    return (
        <div className="min-h-screen bg-dark-900 pb-20 overflow-x-hidden">
            <StickyContainer className="px-6">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        {/* Full Width Search Bar */}
                            <div className="flex items-center gap-2 bg-dark-800 border border-white/5 rounded-full p-1.5 flex-1 shadow-inner">
                            <SearchIcon size={18} className="text-gray-500 ml-3" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                placeholder="Search for content, creators, or tags..."
                                className="bg-transparent text-white outline-none flex-1 px-2 py-2 text-sm font-medium"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-2 text-gray-500 hover:text-white">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tags and Filter Row */}
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-2 py-1">
                            {activeTags.length > 0 ? activeTags.map(tag => (
                                <span key={tag} className="bg-dark-800 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5 whitespace-nowrap hover:border-brand-500 transition-colors">
                                    {tag}
                                    <button onClick={() => {
                                        const newTags = activeTags.filter(t => t !== tag);
                                        navigate(`/search?q=${encodeURIComponent(newTags.join(','))}`);
                                    }} className="text-gray-500 hover:text-white">
                                        <X size={12} />
                                    </button>
                                </span>
                            )) : (
                                <div className="flex gap-2">
                                    {['#Trending', '#LuciStars', '#NewArrivals', '#MostHyped'].map(tag => (
                                        <span key={tag} className="text-[10px] font-black text-gray-600 uppercase tracking-widest border border-white/5 px-4 py-2 rounded-full hover:text-gray-400 cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                       
                       <div className="flex items-center gap-3 shrink-0">
                           {query.startsWith('#') && (
                               <button 
                                   onClick={handlePrideToggle}
                                   className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${
                                       isPrided 
                                       ? 'bg-transparent border border-brand-500 text-brand-500' 
                                       : 'bg-brand-500 text-white hover:bg-brand-600'
                                   }`}
                               >
                                   {isPrided ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                                   {isPrided ? 'Prided' : 'Pride'}
                               </button>
                           )}

                           <button className="flex items-center gap-2 px-5 py-2.5 bg-dark-800 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-brand-500 transition-all">
                               <Filter size={14} />
                               <span>Filter</span>
                           </button>
                       </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-col gap-4">
                         <div className="flex items-start gap-4 relative w-full">
                           <div className="flex flex-wrap items-center gap-2 flex-1 pb-2">
                           {SEARCH_FILTERS.map(filter => (
                               <button
                                   key={filter.id}
                                   onClick={() => updateCategory(filter.id)}
                                   className={`h-10 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all flex items-center gap-2 border px-4 ${
                                       category === filter.id 
                                       ? 'bg-brand-500 text-white border-brand-500 shadow-lg' 
                                       : 'text-gray-500 border-white/5 hover:text-white hover:bg-dark-700'
                                   }`}
                               >
                                   <filter.icon size={14} />
                                   <span>{filter.label}</span>
                               </button>
                           ))}
                           </div>
                           <button 
                               onClick={refresh}
                               className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-[5px] text-gray-500 hover:text-white transition-all shadow-lg shrink-0"
                               title="Refresh Results"
                           >
                               <RotateCcw size={18} className={loading ? "animate-spin" : ""} />
                           </button>
                       </div>
                    </div>
                </div>
            </StickyContainer>

             <div className="max-w-[1600px] mx-auto px-6 py-6">
                 {loading ? (
                     <div className="flex justify-center py-20"><Loader2 className={`animate-spin ${accentColor}`} size={40} /></div>
                 ) : (
                     <>
                        <div className="w-full">
                            {isFallback && category === 'everything' && (
                                <div className="mb-8 p-4 bg-dark-800 border border-white/5 rounded-xl text-center">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No exact matches found. Showing suggested content:</p>
                                </div>
                            )}
                            
                            {category === 'users' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {getActiveList().map((user, index) => (
                                        <div key={`${user.id}-${index}`} className="bg-dark-800 border border-white/5 rounded-xl p-4 flex flex-col gap-3 hover:border-brand-500/50 transition-all cursor-pointer" onClick={() => navigate(`/profile/${user.username}`)}>
                                            <div className="flex items-center gap-4">
                                                <img src={user.avatar} className="w-16 h-16 rounded-full object-cover border border-white/10" alt={user.displayName} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-white truncate flex items-center gap-1">
                                                        {user.displayName}
                                                        {user.isVerified && <Check size={12} className="text-blue-500" />}
                                                        {user.isInterestMatch && <Sparkles size={12} className="text-brand-500 fill-brand-500" />}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 truncate">@{user.username}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 truncate">{user.followers?.toLocaleString() || 0} Followers</p>
                                                </div>
                                                <button className="px-4 py-1.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-brand-500 hover:text-white transition-colors">
                                                    Follow
                                                </button>
                                            </div>
                                            {(user.tags?.length > 0 || user.interests?.length > 0) && (
                                                <div className="mt-2 pt-2 border-t border-white/5">
                                                    <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1.5 flex items-center gap-1">
                                                        <Heart size={10} className="text-pink-500" /> Intimacy Tags
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {(user.tags || user.interests || []).slice(0, 3).map((tag: string, i: number) => (
                                                            <span key={i} className="text-[9px] px-2 py-0.5 bg-pink-500/10 rounded-full text-pink-400 border border-pink-500/20 flex items-center gap-1">
                                                                <Hash size={8} />
                                                                {tag}
                                                            </span>
                                                        ))}
                                                        {(user.tags || user.interests || []).length > 3 && (
                                                            <span className="text-[9px] px-2 py-0.5 bg-dark-700 rounded-full text-gray-400 border border-white/5">
                                                                +{(user.tags || user.interests || []).length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : category === 'arcade' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {getActiveList().map((game, index) => (
                                        <div 
                                            key={`${game.id}-${index}`} 
                                            className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden group transition-all cursor-pointer flex flex-col relative hover:border-brand-500/50 shadow-none hover:shadow-2xl hover:scale-[1.02]" 
                                            onClick={() => navigate(`/arcade/${game.id}`)}
                                        >
                                            <div className="aspect-[16/9] bg-dark-900 relative overflow-hidden">
                                                <img src={game.image} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-all duration-700" alt={game.title} />
                                                <div className="absolute top-3 left-3 bg-brand-500 text-white text-[8px] font-black px-2 py-1 rounded-lg uppercase z-10">
                                                    {game.multiplier}
                                                </div>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all z-20">
                                                    <button className="bg-white text-black font-black px-6 py-2 rounded-xl text-[10px] uppercase flex items-center gap-2 hover:bg-brand-500 hover:text-white transition-all shadow-none">
                                                        Play Now <ArrowRight size={12} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-5 flex flex-col flex-1 relative z-10 bg-dark-800">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className={`p-2 rounded-lg ${game.color} bg-opacity-20 text-white`}>
                                                        <Gamepad2 size={24} className="grayscale group-hover:grayscale-0 transition-all duration-300" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black text-white uppercase tracking-wide leading-none">{game.title}</h3>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{game.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : category === 'tags' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {getActiveList().map((tag, index) => (
                                        <HashtagCard 
                                            key={`${tag.id}-${index}`} 
                                            tag={{
                                                id: tag.id,
                                                tag: tag.name.startsWith('#') ? tag.name : `#${tag.name}`,
                                                count: tag.posts?.toLocaleString() || '0',
                                                trend: 'stable'
                                            }} 
                                        />
                                    ))}
                                </div>
                            ) : category === 'posts' ? (
                                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
                                     {getActiveList().map((item, index) => (
                                        <div key={`${item.id}-${index}`} className="break-inside-avoid mb-4">
                                            <PostCard 
                                                id={item.id}
                                                type={item.type}
                                                content={item.content}
                                                pollData={item.pollData}
                                                author={item.user}
                                                heat={item.heat}
                                                date={new Date(item.timestamp).toLocaleDateString()}
                                                compact={true}
                                                masonry={true}
                                                hideTags={false}
                                                tags={item.tags} // Pass tags explicitly if available
                                                onTip={(id) => setSelectedPostId(id)}
                                                onCommentClick={(id) => setSelectedPostId(id)}
                                            />
                                        </div>
                                     ))}
                                </div>
                            ) : (
                                <MasonryGrid 
                                    items={getActiveList()} 
                                    onTip={(id) => setSelectedPostId(id)}
                                    onCommentClick={(id) => setSelectedPostId(id)}
                                    className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 w-full"
                                />
                            )}
                        </div>
                        
                        {!loading && getActiveList().length === 0 && !isFallback && (
                             <div className="text-center py-20 opacity-50">
                                 <SearchIcon size={48} className="mx-auto mb-4 text-gray-600" />
                                 <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
                                 <p className="text-sm text-gray-500">Try adjusting your filters</p>
                             </div>
                        )}
                     </>
                 )}
             </div>
        </div>
    );
}
