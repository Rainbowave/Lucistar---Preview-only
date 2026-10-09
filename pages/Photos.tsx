
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, Image as ImageIcon, TrendingUp, Hash, Camera, Plus } from 'lucide-react';
import { ContentHeader } from '../components/ContentHeader';
import { api } from '../services/api';
import { db } from '../services/db';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal'; 
import { authService } from '../services/authService';
import { MasonryGrid } from '../components/MasonryGrid';
import { InterestHub, Interest } from '../components/InterestHub';

const PHOTO_FILTERS = ['All', 'Trending', 'Newest', 'Portrait', 'Landscape', 'Abstract', 'Urban', 'Nature', 'Fashion', 'Editorial', 'B&W', 'Macro', 'Film', 'Digital'];

export default function Photos() {
    const [searchParams] = useSearchParams();
    const [activeFilter, setActiveFilter] = useState('All');
    
    const [rawPhotos, setRawPhotos] = useState<any[]>([]);
    const [trends, setTrends] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [findInterestActive, setFindInterestActive] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true);
            try {
                await new Promise(r => setTimeout(r, 800));

                const generatedPhotos: any[] = Array.from({ length: 40 }).map((_, i) => {
                    const heights = [400, 500, 600, 800, 350, 450, 700];
                    const height = heights[i % heights.length];
                    const width = 600;
                    
                    return {
                        id: `gen_photo_${i}`,
                        title: `Photo ${i + 1}`,
                        thumbnailUrl: `https://picsum.photos/${width}/${height}?random=${i + 500}`,
                        userId: `u_${(i % 10) + 1}`,
                        user: { username: `Creator_${(i % 10) + 1}`, avatar: `https://picsum.photos/100/100?random=${(i % 10) + 500}` },
                        isPromoted: false, 
                        type: 'PHOTO',
                        category: ['Portrait', 'Landscape', 'Abstract', 'Urban', 'Nature', 'Fashion'][i % 6],
                        isAdult: isAdultMode,
                        content: i % 3 === 0 ? "A stunning visual piece" : "Abstract concepts in light"
                    };
                });
                
                const injectedPhotos = await db.injectContent(generatedPhotos, 'photos');
                setRawPhotos(injectedPhotos);
                
                // Fetch dynamic trends
                const [trendsData, interestsData] = await Promise.all([
                    api.get<any[]>('/trends/hashtags'),
                    api.get<any[]>('/trends/tags?section=photos')
                ]);
                
                setTrends(trendsData);
                // Map the trending tags to Interest objects
                const mappedInterests: Interest[] = interestsData.map((t: any) => ({
                    id: t.id,
                    title: t.tag,
                    image: t.image
                }));
                setInterests(mappedInterests);

            } catch (e) {
                console.error("Failed to load photos", e);
            } finally {
                setLoading(false);
            }
        };
        loadPhotos();
    }, [isAdultMode]);

    const photos = useMemo(() => {
        let filtered = rawPhotos;
        
        if (activeFilter !== 'All') {
            filtered = filtered.filter(p => p.category === activeFilter || p.type === 'AD');
        }
        
        if (findInterestActive && currentUser) {
            const userLikes = currentUser.interestProfile?.likes || ['Photography', 'Art', 'Nature'];
            filtered = filtered.map(p => ({
                ...p,
                isInterestMatch: userLikes.some(like => 
                    p.category?.toLowerCase().includes(like.toLowerCase()) || 
                    p.title?.toLowerCase().includes(like.toLowerCase())
                )
            }));
        }
        
        return filtered;
    }, [rawPhotos, activeFilter, findInterestActive, currentUser]);

    return (
        <div className="flex flex-col min-h-screen bg-dark-850">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

            <div className="flex-1 min-w-0 flex flex-col relative">
                <ContentHeader 
                    title="Photos"
                    icon={Camera}
                    stats={[
                        { label: 'Total Photos', value: '12.4K' },
                        { label: 'Daily Uploads', value: '850+' }
                    ]}
                    userStats={[
                        { label: 'My Photos', value: '156' },
                        { label: 'Reach', value: '45.2K', color: 'text-brand-500' }
                    ]}
                    tags={PHOTO_FILTERS.map(f => ({ id: f, label: f, count: Math.floor(Math.random() * 500).toString() }))}
                    activeTag={activeFilter}
                    onTagClick={setActiveFilter}
                    onAddTag={(label) => setSearchQuery(prev => prev ? `${prev} ${label}` : label)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFindInterest={() => setFindInterestActive(prev => !prev)}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onCreateClick={() => {}}
                    createLabel="Upload Photo"
                    bgImage="https://picsum.photos/seed/photography/1920/1080?blur=10"
                />

                <div className="p-4 md:p-10 pb-24">
                    {/* Interest Hub Removed as it's now in ContentHeader */}

                    {loading ? (
                        <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" /></div>
                    ) : (
                        <MasonryGrid 
                            items={photos} 
                            onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                            onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                        />
                    )}
                    
                    {photos.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40">
                             <ImageIcon className="mx-auto mb-4 text-gray-500" size={48} />
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No photos found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
