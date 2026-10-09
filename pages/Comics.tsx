
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, BookOpen, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ContentHeader } from '../components/ContentHeader';
import { api } from '../services/api';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { MasonryGrid } from '../components/MasonryGrid';
import { InterestHub, Interest } from '../components/InterestHub';

const COMIC_FILTERS = ['All', 'Trending', 'Newest', 'Action', 'Romance', 'Fantasy', 'Sci-Fi', 'Horror', 'Slice of Life', 'Superhero', 'Noir', 'Comedy', 'Drama', 'Mystery'];

export default function Comics() {
    const [searchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState('All');

    const [rawComics, setRawComics] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [findInterestActive, setFindInterestActive] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const loadComics = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise(r => setTimeout(r, 800));

            const generatedComics: any[] = Array.from({ length: 24 }).map((_, i) => {
                 const height = i % 2 === 0 ? 500 : 400;
                 return {
                    id: `comic_${i}`,
                    title: `Visual Novel ${i + 1}`,
                    thumbnailUrl: `https://picsum.photos/400/${height}?random=${i + 600}`,
                    userId: `u_${(i % 5) + 1}`,
                    user: { username: `Creator_${(i % 5) + 1}`, avatar: `https://picsum.photos/100/100?random=${(i % 5) + 600}` },
                    category: ['Action', 'Romance', 'Fantasy', 'Sci-Fi'][i % 4],
                    episodes: Math.floor(Math.random() * 50) + 1,
                    type: 'COMIC',
                    isAdult: isAdultMode,
                    content: `An exciting story about ${['heroes', 'love', 'dragons', 'space'][i % 4]} and adventure.`
                };
            });

            const injectedComics = await db.injectContent(generatedComics, 'comicReader');
            setRawComics(injectedComics);
            
            // Dynamic Trends
            const [trendsData, interestsData] = await Promise.all([
                 api.get<any[]>('/trends/hashtags'),
                 api.get<any[]>('/trends/tags?section=comics')
            ]);
            
            setTrends(trendsData);
            setInterests(interestsData.map((t: any) => ({
                id: t.id,
                title: t.tag,
                image: t.image
            })));

        } catch (e) { console.error(e); } finally { setLoading(false); }
    }, [isAdultMode]);

    useEffect(() => {
        loadComics();
    }, [loadComics]);

    const comics = useMemo(() => {
        let filtered = rawComics;
        
        if (activeFilter !== 'All') {
            filtered = filtered.filter(p => p.category === activeFilter || p.type === 'AD');
        }

        if (findInterestActive && currentUser) {
            const userLikes = currentUser.interestProfile?.likes || ['Comics', 'Manga', 'Art'];
            filtered = filtered.map(p => ({
                ...p,
                isInterestMatch: userLikes.some(like => 
                    p.category?.toLowerCase().includes(like.toLowerCase()) || 
                    p.title?.toLowerCase().includes(like.toLowerCase())
                )
            }));
        }

        return filtered;
    }, [rawComics, activeFilter, findInterestActive, currentUser]);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            <div className="flex-1 min-w-0 flex flex-col relative">
                <ContentHeader 
                    title="Comics"
                    icon={BookOpen}
                    stats={[
                        { label: 'Total Series', value: '1.4K' },
                        { label: 'Readers', value: '240K' }
                    ]}
                    userStats={[
                        { label: 'My Library', value: '15' },
                        { label: 'Unread', value: '3', color: 'text-brand-500' }
                    ]}
                    tags={COMIC_FILTERS.map(f => ({ id: f, label: f, count: Math.floor(Math.random() * 100).toString() }))}
                    activeTag={activeFilter}
                    onTagClick={setActiveFilter}
                    onAddTag={(label) => setSearchQuery(prev => prev ? `${prev} ${label}` : label)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFindInterest={() => setFindInterestActive(prev => !prev)}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onCreateClick={() => {}}
                    createLabel="Publish Comic"
                    bgImage="https://picsum.photos/seed/comic/1920/1080?blur=10"
                />

                <div className="p-4 md:p-10 pb-24">
                     {/* Interest Hub Removed as it's now in ContentHeader */}

                    {loading ? (
                        <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>
                    ) : (
                        <MasonryGrid items={comics} onTip={() => {}} onCommentClick={() => {}} />
                    )}

                    {comics.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40">
                             <BookOpen className="mx-auto mb-4 text-gray-500" size={48} />
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No comics found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
