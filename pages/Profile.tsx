
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../types';
import { Grid, List, Bookmark, Loader2, AlertCircle, Clapperboard, ImageIcon, FileText, Camera, Video, BookOpen, ShoppingBag, Flame, MessageCircle, Eye, Heart, Info, MapPin, Globe, User as UserIcon, Calendar, ShieldCheck, Tag, Languages, CheckCircle, Trophy, Hash, Target, Crown, Plus, Palette } from 'lucide-react';
import { api } from '../services/api';
import { db } from '../services/db';
import { ProfileHeader } from '../components/ProfileHeader';
import { PostCard } from '../components/PostCard';
import { SubscriptionModal } from '../components/SubscriptionModal';
import { TipModal } from '../components/TipModal';
import { CommentsModal } from '../components/comments/CommentsModal';
import { InterestProfileCard } from '../components/InterestProfileCard';
import { InterestProfile } from '../types';

interface ProfileProps {
  currentUser: User | null;
}

const getSexualityGradient = (sexuality?: string) => {
    switch(sexuality) {
        case 'Gay': return 'bg-gradient-to-r from-teal-400 via-green-500 to-blue-600';
        case 'Lesbian': return 'bg-gradient-to-r from-red-500 via-orange-500 to-pink-500';
        case 'Bisexual': return 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500';
        case 'Pansexual': return 'bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400';
        case 'Transgender': return 'bg-gradient-to-r from-cyan-400 via-pink-400 to-white';
        case 'Asexual': return 'bg-gradient-to-r from-gray-900 via-gray-500 to-purple-800';
        default: return 'bg-gradient-to-r from-brand-900 via-dark-800 to-dark-900';
    }
};

export default function Profile({ currentUser }: ProfileProps) {
  const navigate = useNavigate();
  const { username, '*': subpath } = useParams();
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('All');
  const [isFollowing, setIsFollowing] = useState(false);

  // Sync filter with subpath
  useEffect(() => {
    if (subpath) {
      const tab = subpath.split('/')[0].toLowerCase();
      if (tab === 'collection') setFilter('Collection');
      else if (tab === 'photos') setFilter('Photos');
      else if (tab === 'videos') setFilter('Videos');
      else if (tab === 'shorts') setFilter('Shorts');
      else if (tab === 'comics') setFilter('Comics');
      else if (tab === 'knowledge') setFilter('KnowledgeBook');
      else if (tab === 'live') setFilter('Live');
      else if (tab === 'info') setFilter('Info');
      else setFilter('All');
    }
  }, [subpath]);
  
  // Modals
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [tipModalOpen, setTipModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | string | null>(null);

  // Get current mode from currentUser prop passed from App
  const currentMode = currentUser?.contentPreference || 'dating';
  const isNaughtyMode = currentMode === 'adult';

  useEffect(() => {
    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            await new Promise(r => setTimeout(r, 600));
            // Simulate fetching user by username
            
            let user: User | null = null;
            
            // Check if looking at own profile
            if (username === 'me' || (currentUser && username === currentUser.username)) {
                if (currentUser) {
                    user = currentUser;
                } else {
                    // Not logged in, redirect to login or show error
                    setError('Please login to view your profile');
                    setLoading(false);
                    return;
                }
            } else {
                // Fetch public profile
                user = await api.get<User>(`/users/${username || ''}`);
                
                // Fallback Mock for demo if not found in db
                if (!user && username) {
                    user = {
                        id: `u_${username}`,
                        username: username || 'unknown',
                        displayName: (username || 'User').charAt(0).toUpperCase() + (username || 'User').slice(1),
                        avatarUrl: `https://picsum.photos/200/200?random=${username}`,
                        isVerified: true,
                        followers: 12500,
                        role: 'creator',
                        isPremium: true,
                        coins: 0,
                        contentPreference: 'dating',
                        pronunciation: 'Lu-ci-sin' // Mock
                    };
                }
            }

            if (user) {
                // Ensure pronunciation exists for demo
                if (!user.pronunciation) user.pronunciation = "Pro-nun-ci-a-tion";
                setActiveUser(user);
                // Check follow status
                if (currentUser) {
                    const following = await db.isFollowing(currentUser.id, user.id);
                    setIsFollowing(following);
                }
            } else {
                setError('User not found');
            }
        } catch (e) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    fetchProfile();
  }, [username, currentUser]);

  useEffect(() => {
      if (activeUser) {
          const fetchPosts = async () => {
              setPostsLoading(true);
              try {
                  // Use api.get directly to get seeded content
                  let userPosts = await api.get<any[]>(`/users/${activeUser.id}/posts`);
                  
                  // If user has no posts (new mock user), generate fillers for tabs
                  if (!userPosts || userPosts.length < 5) {
                      const fillers = Array.from({length: 20}).map((_, i) => ({
                          id: `fill_${i}`,
                          type: ['PHOTO', 'VIDEO', 'SHORT', 'COMIC', 'COLLECTION', 'RESOURCE'][i % 6],
                          title: `Recent Content ${i+1}`,
                          content: "Check out my latest creation on LuciSin!",
                          thumbnailUrl: `https://picsum.photos/400/500?random=${activeUser.id}_${i}`,
                          userId: activeUser.id,
                          user: { username: activeUser.username, displayName: activeUser.displayName, avatar: activeUser.avatarUrl },
                          heat: Math.floor(Math.random() * 500),
                          comments: 5,
                          timestamp: Date.now() - (i * 100000),
                          isAdult: activeUser.contentPreference === 'adult'
                      }));
                      userPosts = [...userPosts, ...fillers];
                  }

                  setPosts(userPosts);
              } catch (e) {
                  console.error(e);
              } finally {
                  setPostsLoading(false);
              }
          };
          fetchPosts();
      }
  }, [activeUser]);

  const handleFollow = async () => {
      if (!currentUser || !activeUser) return;
      await db.followUser(currentUser.id, activeUser.id);
      setIsFollowing(true);
  };

  // Define Available Tabs explicitly requested
  const availableTabs = [
    { id: 'All', icon: Grid, label: 'All' },
    { id: 'Info', icon: Info, label: 'Info' },
    { id: 'Photos', icon: ImageIcon, label: 'Photos' },
    { id: 'Videos', icon: Video, label: 'Videos' },
    { id: 'Shorts', icon: Clapperboard, label: 'Shorts' },
    { id: 'Comics', icon: BookOpen, label: 'Comics' },
    { id: 'Collection', icon: ShoppingBag, label: 'Collection' },
    { id: 'KnowledgeBook', icon: FileText, label: 'Knowledge' },
    { id: 'Live', icon: Camera, label: 'Live Streams' }
  ];

  // Filtering Logic based on site sections with SIMULATION FALLBACK
  const filteredDisplayPosts = useMemo(() => {
      let results = posts;

      // 1. Strict Mode Filtering
      // If user is in Dating mode, remove ALL adult content.
      if (!isNaughtyMode) {
          results = results.filter(p => !p.isAdult);
      }
      
      if (filter === 'Shorts') results = results.filter(p => p.type === 'SHORT');
      else if (filter === 'Photos') results = results.filter(p => p.type === 'PHOTO');
      else if (filter === 'Videos') results = results.filter(p => p.type === 'VIDEO');
      else if (filter === 'Comics') results = results.filter(p => p.type === 'COMIC');
      else if (filter === 'Collection') results = results.filter(p => p.type === 'COLLECTION' || p.type === 'PRODUCT');
      else if (filter === 'KnowledgeBook') results = results.filter(p => p.type === 'RESOURCE');
      else if (filter === 'Live') results = results.filter(p => p.type === 'LIVE');

      return results;
  }, [posts, filter, isNaughtyMode]);

  if (loading) {
      return <div className="flex justify-center items-center h-screen bg-background"><Loader2 className="animate-spin text-brand-500" size={48}/></div>;
  }

  if (error || !activeUser) {
      return (
          <div className="flex flex-col justify-center items-center h-screen bg-background text-center p-6">
              <AlertCircle className="text-red-500 mb-4" size={48} />
              <h2 className="text-2xl font-bold text-white mb-2">Profile Unavailable</h2>
              <p className="text-gray-500">{error || "The user you are looking for does not exist."}</p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                    onClick={() => {
                        setLoading(true);
                        setError(null);
                        // Re-trigger fetch by changing state or just calling it
                        window.location.reload();
                    }} 
                    className="bg-brand-600 text-white px-6 py-2 rounded-[5px] font-bold hover:bg-brand-500 transition-all shadow-lg shadow-brand-500/20"
                >
                    Reconnect Profile
                </button>
                <button 
                    onClick={() => navigate('/home')} 
                    className="bg-card text-gray-400 px-6 py-2 rounded-[5px] font-bold hover:bg-dark-700 transition-all"
                >
                    Go Home
                </button>
              </div>
          </div>
      );
  }

  const isOwnProfile = currentUser?.id === activeUser.id;

  // Background rendering logic
  const hasCustomBackground = activeUser.backgroundUrl && activeUser.backgroundUrl.startsWith('http');
  
  // High Density Grid for "Smaller by Half" look
  const gridClasses = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2";

  const renderInfoTab = () => {
    if (!activeUser) return null;

    const infoCards = [
        { label: 'Language', value: activeUser.language || 'English', icon: Languages, color: 'text-green-500' },
        { label: 'Gender', value: activeUser.gender || 'Not Specified', icon: UserIcon, color: 'text-purple-500' },
        { label: 'Orientation', value: activeUser.sexuality || 'Private', icon: Heart, color: 'text-red-500' },
        { label: 'Pronouns', value: activeUser.pronouns || 'They/Them', icon: Info, color: 'text-yellow-500' },
        { label: 'Joined', value: new Date(activeUser.joinedAt || Date.now()).toLocaleDateString(), icon: Calendar, color: 'text-gray-400' },
    ];

    // Mock distance for demo
    const distance = Math.floor(Math.random() * 500) + 1;
    // Mock Ranking Data
    const globalRank = Math.floor(Math.random() * 500) + 1;
    const topTag = activeUser.tags && activeUser.tags.length > 0 ? activeUser.tags[0] : 'General';
    const tagRank = Math.floor(Math.random() * 50) + 1;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Left Column: Interests & Ranking */}
            <div className="space-y-6">
                <div className="bg-card border border-white/5 rounded-[5px] p-6 shadow-xl h-full relative group/interests">

                    <h3 className="text-lg font-bold text-white uppercase  tracking-tighter mb-6 flex items-center gap-2">
                        <Tag size={18} className="text-yellow-500" /> Interests & Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {activeUser.tags && activeUser.tags.length > 0 ? (
                            activeUser.tags.map((tag) => (
                                <span 
                                    key={tag} 
                                    className="px-4 py-2 bg-background border border-white/10 rounded-[5px] text-xs font-bold text-gray-300 uppercase tracking-wide hover:text-white hover:border-brand-500/50 transition-colors cursor-default"
                                >
                                    #{tag}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-gray-500 ">No interests listed.</span>
                        )}
                    </div>
                </div>

                <div className="bg-card border border-white/5 rounded-[5px] p-6 shadow-xl relative group/rankings">

                    <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <Trophy size={14} className="text-yellow-500" /> Rankings
                    </h3>
                    <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-[5px] border border-white/5 mb-2">
                        <span className="text-xs text-gray-400 font-bold uppercase">Global Rank</span>
                        <div className="flex items-center gap-2">
                                <Crown size={12} className="text-yellow-500" />
                                <span className="text-sm font-bold text-white">#{globalRank}</span>
                        </div>
                    </div>
                    {activeUser.tags && activeUser.tags.length > 0 ? (
                        activeUser.tags.slice(0, 3).map((tag, index) => (
                            <div key={tag} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-[5px] border border-white/5 mt-2">
                                <span className="text-xs text-gray-400 font-bold uppercase">#{tag}</span>
                                <div className="flex items-center gap-2">
                                        <Hash size={12} className="text-brand-500" />
                                        <span className="text-sm font-bold text-white ">#{Math.floor(Math.random() * 50) + 1 + index}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-dark-900/50 rounded-[5px] border border-white/5 mt-2">
                            <span className="text-xs text-gray-400 font-bold uppercase">#General</span>
                            <div className="flex items-center gap-2">
                                    <Hash size={12} className="text-brand-500" />
                                    <span className="text-sm font-bold text-white ">#{tagRank}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Column: Demographics & Region */}
            <div className="lg:col-span-2 space-y-8">
                    <InterestProfileCard 
                    user={activeUser} 
                    isOwnProfile={isOwnProfile} 
                    onUpdate={(updatedProfile) => {
                        setActiveUser(prev => prev ? ({...prev, interestProfile: updatedProfile}) : null);
                    }}
                    />
                <div className="bg-dark-800 border border-white/5 rounded-[5px] p-6 shadow-xl relative group/traits">

                    <h3 className="text-lg font-bold text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <UserIcon size={18} className="text-brand-second" /> Identity & Traits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {infoCards.filter(item => item.label !== 'Location').map((item) => (
                            <div key={item.label} className="h-full relative group">
                                    <div className="flex items-center gap-4 p-4 bg-dark-900/40 rounded-[5px] border border-white/5 hover:border-brand-500/30 transition-colors group h-full relative">
                                        <div className={`p-3 rounded-[5px] bg-dark-800 ${item.color} border border-white/5 group-hover:scale-110 transition-transform`}>
                                            <item.icon size={18} />
                                        </div>
                                        <div>
                                            <span className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</span>
                                            <span className="block text-sm font-bold text-white">{item.value}</span>
                                        </div>
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
         {/* Profile Background Layer */}
         <div className="h-[250px] w-full relative overflow-hidden">
             {hasCustomBackground ? (
                 <img src={activeUser.backgroundUrl} className="w-full h-full object-cover" alt="Cover" />
             ) : (
                 <div className={`w-full h-full ${getSexualityGradient(activeUser.sexuality)}`}></div>
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
         </div>

         <ProfileHeader 
            user={activeUser} 
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            onFollow={handleFollow}
            onSubscribe={(tier) => setSubModalOpen(true)}
            onTip={() => setTipModalOpen(true)}
            onMessage={() => navigate(`/chat`)}
            activeTab={filter}
            onTabChange={(tabId) => {
                setFilter(tabId);
                if (tabId === 'All') navigate(`/profile/${username}`);
                else if (tabId === 'KnowledgeBook') navigate(`/profile/${username}/knowledge`);
                else if (tabId === 'Live') navigate(`/profile/${username}/live`);
                else navigate(`/profile/${username}/${tabId.toLowerCase()}`);
            }}
            tabs={availableTabs}
            leftChildren={
                filter === 'Info' && (
                    <div className="bg-card border border-white/5 rounded-[5px] p-4 shadow-xl animate-in fade-in slide-in-from-left-2 duration-500 relative group/info-side">
                        <h4 className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Quick Info</h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[7px] text-gray-400 uppercase font-bold">Status</span>
                                <span className="text-[8px] text-green-500 font-bold uppercase">Online</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[7px] text-gray-400 uppercase font-bold">Mood</span>
                                <span className="text-[8px] text-brand-500 font-bold uppercase">Creative</span>
                            </div>
                        </div>
                    </div>
                )
            }
         >
             {filter === 'Info' ? (
                 renderInfoTab()
             ) : (
                 <>
                    {postsLoading ? (
                        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-500" /></div>
                    ) : filteredDisplayPosts.length === 0 ? (
                        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[5px] relative group/empty">
                            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                                <Grid size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Content Yet</h3>
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">This Superiority hasn't posted in this category.</p>
                            {isOwnProfile && (
                                <button onClick={() => navigate('/content-studio')} className="mt-6 bg-white text-black px-6 py-2 rounded-[5px] font-bold text-xs uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
                                    Create Post
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={`${gridClasses} relative group/grid`}>
                            {isOwnProfile && (
                                <div className="aspect-square bg-dark-800 border-2 border-dashed border-white/10 rounded-[5px] flex flex-col items-center justify-center text-gray-500 hover:border-brand-500 hover:text-brand-500 cursor-pointer transition-all" onClick={() => navigate('/manage-content')}>
                                    <Plus size={32} />
                                    <span className="text-xs font-bold uppercase mt-2">Create Post</span>
                                </div>
                            )}
                            {filteredDisplayPosts.map((post: any) => (
                                <PostCard 
                                    key={post.id}
                                    id={post.id}
                                    type={post.type}
                                    category={post.category}
                                    date={new Date(post.timestamp).toLocaleDateString()}
                                    content={post.title || post.content}
                                    imageUrl={post.thumbnailUrl || post.url}
                                    isPaid={post.price && parseFloat(post.price) > 0}
                                    price={post.price}
                                    ownerId={post.userId}
                                    privacy={post.privacy}
                                    isPromoted={post.isPromoted}
                                    compact={true}
                                    hideTags={true}
                                    hideMoodBadge={true}
                                    isAdult={post.isAdult}
                                    hideUser={true}
                                    isStudioMode={isOwnProfile}
                                    onMonetize={(id) => console.log('Monetize', id)}
                                    onAnalytics={(id) => navigate(`/content-performance/${id}`)}
                                    onPromote={(id) => console.log('Promote', id)}
                                    onTip={(id) => { setSelectedPostId(id); setTipModalOpen(true); }}
                                    onCommentClick={(id) => { setSelectedPostId(id); setCommentsModalOpen(true); }}
                                    imageHeight="aspect-square"
                                />
                            ))}
                        </div>
                    )}
                 </>
             )}
         </ProfileHeader>

         <SubscriptionModal 
            isOpen={subModalOpen} 
            onClose={() => setSubModalOpen(false)} 
            creatorName={activeUser.displayName} 
            avatarUrl={activeUser.avatarUrl} 
         />

         <TipModal 
            isOpen={tipModalOpen} 
            onClose={() => setTipModalOpen(false)} 
            creatorName={activeUser.displayName} 
         />
         
         <CommentsModal 
            isOpen={commentsModalOpen} 
            onClose={() => setCommentsModalOpen(false)} 
            postId={selectedPostId || 0} 
         />
    </div>
  );
}
