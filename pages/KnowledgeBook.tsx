import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  CheckCircle, Loader2,
  ChevronDown, ChevronUp, FileText,
  BookOpen, TrendingUp, Search
} from 'lucide-react';
import { db } from '../services/db'; 
import { authService } from '../services/authService';
import { api } from '../services/api';
import { Interest, InterestHub } from '../components/InterestHub';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { PostCard } from '../components/PostCard';
import { ContentHeader } from '../components/ContentHeader';

const KNOWLEDGE_CATEGORIES = [
    { id: 'digital-art', title: 'Digital Art', image: 'https://picsum.photos/seed/digitalart/400/300', count: '1.2K' },
    { id: '3d-modeling', title: '3D Modeling', image: 'https://picsum.photos/seed/3dmodeling/400/300', count: '850' },
    { id: 'video-editing', title: 'Video Editing', image: 'https://picsum.photos/seed/videoediting/400/300', count: '2.1K' },
    { id: 'programming', title: 'Programming', image: 'https://picsum.photos/seed/programming/400/300', count: '3.4K' },
    { id: 'writing', title: 'Writing', image: 'https://picsum.photos/seed/writing/400/300', count: '1.5K' },
    { id: 'music', title: 'Music', image: 'https://picsum.photos/seed/music/400/300', count: '920' }
];

// KnowledgeBook component
export default function KnowledgeBook() {
    const navigate = useNavigate();
    const { category } = useParams<{ category: string }>();
    const activeCategory = category && category !== 'all' ? category : 'All';
    
    // Local Search & View State
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [resources, setResources] = useState<any[]>([]);
    const [interests, setInterests] = useState<Interest[]>(KNOWLEDGE_CATEGORIES);
    const [loading, setLoading] = useState(true);
    
    // Interaction State
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [commentsModalOpen, setCommentsModalOpen] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

    const currentUser = authService.getCurrentUser();
    const isAdultMode = currentUser?.contentPreference === 'adult';

    const handleCategoryChange = (newCategory: string) => {
        navigate(`/knowledge-book/${newCategory === 'All' ? 'all' : newCategory}`);
    };

    // Data Loading
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // Fetch Trends & Dynamic Interests
                const interestsData = await api.get<any[]>('/trends/tags?section=photos');
                
                const fetchedInterests = interestsData.map((t: any) => ({
                    id: t.id,
                    title: t.tag,
                    image: t.image,
                    label: t.tag,
                    count: Math.floor(Math.random() * 1000).toString()
                }));

                // Merge static and dynamic interests, avoiding duplicates
                const merged = [...KNOWLEDGE_CATEGORIES];
                fetchedInterests.forEach(fi => {
                    if (!merged.find(m => m.title.toLowerCase() === fi.title.toLowerCase())) {
                        merged.push(fi);
                    }
                });
                setInterests(merged);
                
                // Mock Resources Data
                const mockResources = Array.from({ length: 30 }).map((_, i) => ({
                    id: `res_${i}`,
                    title: [
                        "Drawing Basics", 
                        "Video Editing Guide", 
                        "Selling Art Online", 
                        "Growing Your Audience", 
                        "Streaming Setup",
                        "Color Theory"
                    ][i % 6] + ` - Part ${i+1}`,
                    thumbnailUrl: `https://picsum.photos/seed/res_${i}/600/${[400, 500, 350][i % 3]}`,
                    category: merged[i % merged.length]?.title || 'General',
                    user: { 
                        username: `Author_${i}`, 
                        avatar: `https://picsum.photos/seed/a_${i}/100/100`,
                        displayName: `User ${i + 1}`
                    },
                    userId: `u_${i}`,
                    date: "Oct 24, 2025",
                    readTime: `${Math.floor(Math.random() * 10) + 3} min read`,
                    type: 'RESOURCE',
                    isAdult: isAdultMode,
                    content: "A simple guide to help you learn and improve your skills. This covers the basics and some practical tips."
                }));

                // Inject Ads
                const injectedResources = await db.injectContent(mockResources, 'homeFeed'); 
                setResources(injectedResources);
                
            } catch (e) { console.error(e); } finally { setLoading(false); }
        };
        loadData();
    }, [isAdultMode]);

    const filteredResources = useMemo(() => {
        let filtered = resources;
        
        if (activeCategory !== 'All') {
            filtered = filtered.filter(r => r.category === activeCategory || r.type === 'AD');
        }

        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(r => r.title && r.title.toLowerCase().includes(lowerQuery));
        }

        return filtered;
    }, [resources, activeCategory, searchQuery]);

    return (
        <div className="flex flex-col min-h-screen bg-dark-850">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={`Creator ${selectedPostId}`} />
            <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={selectedPostId || 0} />

            <div className="flex-1 min-w-0 flex flex-col relative">
                <ContentHeader 
                    title="Knowledge Book"
                    icon={BookOpen}
                    stats={[
                        { label: 'Resources', value: '8.4K' },
                        { label: 'Learners', value: '125K' }
                    ]}
                    userStats={[
                        { label: 'My Library', value: '42' },
                        { label: 'Points', value: '1,250', color: 'text-brand-500' }
                    ]}
                    tags={[{ id: 'All', label: 'All', count: resources.length.toString() }, ...interests.map(i => ({ id: i.title, label: i.title, count: i.count || '0' }))]}
                    activeTag={activeCategory}
                    onTagClick={handleCategoryChange}
                    onAddTag={() => {}}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                    onCreateClick={() => {}}
                    createLabel="Share Knowledge"
                    bgImage="https://picsum.photos/seed/knowledge/1920/1080?blur=10"
                    heroHeight="h-[250px]"
                />

                <div className="p-4 md:p-10 pb-24 grid grid-cols-1 gap-10">
                    {/* Content Grid */}
                    {loading ? (
                        <div className="py-20 flex justify-center shadow-none"><Loader2 className="animate-spin text-brand-500" size={48} /></div>
                    ) : (
                        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
                            {filteredResources.map((item) => (
                                <div key={item.id} className="h-full flex flex-col">
                                    <PostCard 
                                        {...item}
                                        imageUrl={item.thumbnailUrl}
                                        compact={true}
                                        onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                                        onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                                    />
                                    <h3 className="mt-2 text-xs font-black text-white uppercase tracking-tighter line-clamp-2">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {filteredResources.length === 0 && !loading && (
                        <div className="py-20 text-center opacity-40">
                             <FileText className="mx-auto mb-4 text-gray-500" size={48} />
                             <p className="text-xs font-black uppercase tracking-widest text-gray-500">No resources found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
