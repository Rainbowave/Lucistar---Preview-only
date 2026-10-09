
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Radio, Users, Video, Tag, ArrowRight, Sparkles, Loader2, Search, CheckCircle, X, SkipForward, ExternalLink, Trophy, Gift, Lock, Heart, Flame, Pause, Coins, Timer, Play, MoreHorizontal, ChevronRight, AlertCircle, Share2, Star } from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { LiveChat } from '../components/LiveChat';
import Hls from 'hls.js';
import { api } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Watermark } from '../components/Shared';
import { db } from '../services/db';
import { AdCard } from '../components/ads/AdCard';
import { ContentHeader } from '../components/ContentHeader';
import { CommentsModal } from '../components/comments/CommentsModal'; 

interface Stream {
    id: number;
    title: string;
    streamer: string;
    viewers: number;
    thumbnail: string;
    avatar: string;
    category: string;
    tags: string[];
    isLive: boolean;
    hlsUrl: string;
    isPaid?: boolean;
    isAdult?: boolean;
    price?: string;
}

const LIVE_FILTERS = ['All', 'Just Chatting', 'Gaming', 'Music', 'Esports', 'IRL', 'Creative', 'Education', 'Sports', 'Charity', 'Special Events'];

const LiveStreamCard: React.FC<{ stream: Stream, onClick: () => void }> = ({ stream, onClick }) => (
    <div onClick={onClick} className="bg-[#0f0f0f] border border-white/5 rounded-xl overflow-hidden shadow-lg group relative flex flex-col h-full cursor-pointer hover:border-brand-500/50 transition-all">
        {/* Visual Decoration: Handles on corners and sides to give a 'studio' feel */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 rounded-tl-xl z-30"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 rounded-tr-xl z-30"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20 rounded-bl-xl z-30"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 rounded-br-xl z-30"></div>
        {/* Side Handles */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[1px] h-4 bg-white/10 z-30"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[1px] h-4 bg-white/10 z-30"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/10 z-30"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[1px] bg-white/10 z-30"></div>

        {/* Content Preview (Thumbnail) */}
        <div className="relative aspect-video bg-black overflow-hidden flex-shrink-0">
            <img src={stream.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={stream.title} />
            
            {/* Live Indicator */}
            <div className="absolute top-3 left-3 z-20">
                <div className="bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1 shadow-lg">
                    <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span> LIVE
                </div>
            </div>

            {/* Tipping Rate Label on Image */}
            <div className="absolute top-3 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[9px] font-black px-2.5 py-1 rounded-sm uppercase tracking-widest flex items-center gap-1 shadow-[0_0_15px_rgba(234,179,8,0.5)] border border-yellow-400">
                    <Gift size={11} /> {stream.price ? `TIP RATE: ${stream.price} LSC` : 'FREE TIPPING'}
                </div>
            </div>

            {/* Viewer Count Overlay */}
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-sm text-[8px] font-black text-white border border-white/5 uppercase tracking-widest flex items-center gap-1 z-20">
                <Users size={10} className="text-brand-500" /> {(stream.viewers || 0).toLocaleString()}
            </div>

            {/* Content Preview Hover Interaction */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                    <Play size={20} fill="currentColor" className="ml-1" />
                </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
        </div>

        {/* Content Info & Tipping Preview */}
        <div className="p-3 flex flex-col flex-1">
             <h3 className="font-bold text-white text-xs line-clamp-1 group-hover:text-brand-500 transition-colors uppercase tracking-tight mb-0.5">
                {stream.title}
            </h3>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate mb-3">
                {stream.streamer}
            </p>

            {/* Tipping Content Preview Section */}
            <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between bg-dark-800 -mx-3 -mb-3 p-3 relative">
                {/* Decorative Side Handles */}
                <div className="absolute top-0 left-0 w-[2px] h-full bg-brand-500/20 group-hover:bg-brand-500 transition-colors"></div>
                <div className="absolute top-0 right-0 w-[2px] h-full bg-brand-500/20 group-hover:bg-brand-500 transition-colors"></div>
                
                <div className="flex flex-col">
                    <span className="text-[8px] text-brand-500 font-black uppercase tracking-widest mb-0.5">Tipping Content</span>
                    <div className="flex items-center gap-1.5">
                        <Gift size={12} className="text-yellow-500" />
                        <span className="text-[10px] font-black text-white tracking-widest tabular-nums">
                            {stream.price ? `Rate: ${stream.price} LSC` : 'Free Tipping'}
                        </span>
                    </div>
                </div>
                
                <div className="flex flex-col items-end">
                    <button className="bg-brand-500 text-white hover:bg-brand-400 px-3 py-1.5 rounded-sm text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-500/20">
                        View
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const PreRollAd = ({ onComplete }: { onComplete: () => void }) => {
    // Sponsored Ad Removed
    useEffect(() => {
        onComplete();
    }, [onComplete]);
    return null;
};

export default function Live() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false); 
  const [streams, setStreams] = useState<Stream[]>([]);
  const [trends, setTrends] = useState<any[]>([]);
  const [activeStream, setActiveStream] = useState<Stream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Ad State
  const [showPreRoll, setShowPreRoll] = useState(false);
  const [adConfig, setAdConfig] = useState<any>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(true); 
  const [isLocked, setIsLocked] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(60);
  const [hlsError, setHlsError] = useState<string | null>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number, x: number }[]>([]);

  const handleLike = () => {
      const id = Date.now();
      const x = Math.random() * 80 + 10;
      setFloatingHearts(prev => [...prev, { id, x }]);
      setTimeout(() => {
          setFloatingHearts(prev => prev.filter(h => h.id !== id));
      }, 2000);
  };

  const loadInitial = async () => {
      setLoading(true);
      setError(null);
      try {
          const [streamData, trendsData] = await Promise.all([
              api.get<Stream[]>('/live'),
              api.get<any[]>('/trends/hashtags')
          ]);
          
          const enhancedStreams = (streamData || []).map((s, i) => ({
              ...s,
              isPaid: s.isPaid || i % 5 === 0,
              price: s.price || ((i % 5 === 0) ? '50.00' : undefined),
              isAdult: s.isAdult
          }));

          setStreams(enhancedStreams);
          setTrends(trendsData || []);
          
          const settings: any = db.getSiteSettings();
          const videoAds = settings.contentAds?.dating?.videoMedia as any;
          const liveAdEnabled = videoAds?.enabled && (videoAds?.targets?.includes('live') || videoAds?.targets?.includes('Live'));
          const liveAdConfig = { enabled: !!liveAdEnabled };
          setAdConfig(liveAdConfig);

          if (enhancedStreams.length > 0 && !activeStream) {
              const first = enhancedStreams[0];
              setActiveStream(first);
              if (first.isPaid) setIsLocked(true);
              else if (liveAdConfig.enabled) setShowPreRoll(true);
          }
      } catch (e) { 
          console.error('Failed to load live data:', e);
          setError('Failed to load live streams. Please try again.');
      } finally { 
          setLoading(false); 
      }
  };

  useEffect(() => {
      loadInitial();
  }, []);

  const handleStreamClick = (stream: Stream) => {
      setActiveStream(stream);
      setPreviewTimeLeft(60);
      setIsPreviewing(false);

      if (stream.isPaid) {
          setIsLocked(true);
          setShowPreRoll(false); 
          if(videoRef.current) videoRef.current.pause();
      } else {
          setIsLocked(false);
          if (adConfig?.enabled && Math.random() > 0.7) {
              setShowPreRoll(true);
          } else {
              setShowPreRoll(false);
              if(videoRef.current) videoRef.current.play().catch(() => {});
          }
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtering based on Category and Search
  const filteredStreams = useMemo(() => {
      return streams.filter(s => {
          const matchCategory = activeFilter === 'All' || s.category === activeFilter;
          const matchSearch = !searchQuery || s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.streamer.toLowerCase().includes(searchQuery.toLowerCase());
          return matchCategory && matchSearch;
      });
  }, [streams, activeFilter, searchQuery]);

  // Player Logic
  useEffect(() => {
    if (!activeStream || showPreRoll || (isLocked && !isPreviewing)) return; 
    
    const hlsUrl = activeStream.hlsUrl;
    setHlsError(null);

    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null; }
    
    if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({ 
            enableWorker: true, 
            lowLatencyMode: true,
            manifestLoadingMaxRetry: 3,
            levelLoadingMaxRetry: 3
        });
        hlsRef.current = hls; 
        hls.loadSource(hlsUrl); 
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => { 
            if(isPlaying) videoRef.current?.play().catch(e => console.log('Autoplay blocked or failed:', e)); 
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.error('Fatal network error encountered, trying to recover');
                        hls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.error('Fatal media error encountered, trying to recover');
                        hls.recoverMediaError();
                        break;
                    default:
                        console.error('Fatal HLS error:', data.type);
                        setHlsError('The stream encountered a fatal error and cannot be played.');
                        hls.destroy();
                        break;
                }
            }
        });
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = hlsUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
            if(isPlaying) videoRef.current?.play().catch(e => console.log(e));
        });
        videoRef.current.addEventListener('error', () => {
            setHlsError('Native playback error.');
        });
    }
  }, [activeStream, showPreRoll, isLocked, isPreviewing]);

  useEffect(() => {
      let interval: any;
      if (isPreviewing && previewTimeLeft > 0) {
          interval = setInterval(() => {
              setPreviewTimeLeft(prev => {
                  if (prev <= 1) {
                      setIsPreviewing(false);
                      setIsLocked(true);
                      if (videoRef.current) videoRef.current.pause();
                      return 0;
                  }
                  return prev - 1;
              });
          }, 1000);
      }
      return () => clearInterval(interval);
  }, [isPreviewing, previewTimeLeft]);

  const handleUnlock = () => {
      if (window.confirm(`Unlock full stream for ${activeStream?.price} LSC?`)) {
          setIsLocked(false);
          setIsPreviewing(false);
          if (videoRef.current) videoRef.current.play();
      }
  };

  const handleStartPreview = () => {
      setIsLocked(false); 
      setIsPreviewing(true);
      setPreviewTimeLeft(60);
      if (videoRef.current) videoRef.current.play();
  };

  const togglePlayback = () => {
      if (videoRef.current) {
          if (isPlaying) videoRef.current.pause();
          else videoRef.current.play();
          setIsPlaying(!isPlaying);
      }
  };

  const heroContent = (
    <div className="w-full bg-dark-900 border-b border-white/5 pt-8 pb-16">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        {/* Active Stream Player */}
        <div className="flex justify-between items-center mb-6 px-2">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[5px] bg-brand-500 p-[2px] shadow-xl"><img src={activeStream?.avatar} className="w-full h-full rounded-[3px] border-2 border-dark-900 object-cover" alt="" /></div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter leading-none">{activeStream?.title || "Loading Stream..."}</h1>
                    <p className="text-[10px] text-brand-500 font-black uppercase tracking-[0.4em] mt-1 flex items-center gap-2">
                        {activeStream?.streamer} • {(activeStream?.viewers || 0).toLocaleString()} Watching
                    </p>
                </div>
                <button onClick={() => setIsTipModalOpen(true)} className="ml-4 hidden md:flex bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-1.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest items-center gap-1 shadow-lg transition-transform hover:scale-105">
                    <Gift size={12} /> Gift
                </button>
            </div>
            
            <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                <span className="text-white font-black uppercase text-[10px] tracking-widest bg-red-600/20 text-red-500 px-2 py-0.5 rounded-[3px] border border-red-500/20">LIVE</span>
            </div>
        </div>

        <div className="flex flex-col xl:flex-row h-auto xl:h-[500px] gap-6">
            <div className="flex-1 bg-black rounded-[5px] overflow-hidden relative group shadow-2xl border border-white/5 flex items-center justify-center min-h-[400px]">
                {/* Visual Resizer Handles - Aesthetic only for studio feel */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20 z-50"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20 z-50"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20 z-50"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20 z-50"></div>
                {/* Side Handles */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-12 bg-white/5 z-50 rounded-full"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1 h-12 bg-white/5 z-50 rounded-full"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/5 z-50 rounded-full"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/5 z-50 rounded-full"></div>
                
                {/* Cinematic Controls Overlay */}
                <div className="absolute bottom-4 left-4 z-40 flex gap-2 pointer-events-auto">
                    <button className="bg-black/60 hover:bg-brand-600 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-all transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                         <Flame size={18} /> Heat
                    </button>
                    <button className="bg-black/60 hover:bg-yellow-500 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-all transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                         <Gift size={18} /> Gift
                    </button>
                    <button className="bg-black/60 hover:bg-purple-500 text-white p-3 rounded-full backdrop-blur-md border border-white/10 transition-all transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                         <Star size={18} /> Pride Up
                    </button>
                </div>
                
                {/* Visual Resizer Handles */}
                <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-[5px] backdrop-blur-md border border-white/10 pointer-events-auto transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" title="Cinematic View">
                        <Video size={14} /> Wide View
                    </button>
                    <button className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-[5px] backdrop-blur-md border border-white/10 pointer-events-auto transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>

                 {showPreRoll ? (
                    <PreRollAd onComplete={() => setShowPreRoll(false)} />
                ) : (isLocked && !isPreviewing) ? (
                    <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-xl z-20 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-white/10"><Lock size={40} className="text-yellow-500" /></div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Tip to Watch</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Unlock full access to continue watching.</p>
                        <div className="flex gap-4">
                            <button onClick={handleStartPreview} className="bg-white/10 hover:bg-white/20 text-white font-black py-3 px-6 rounded-sm text-xs uppercase tracking-widest border border-white/10 transition-all">Preview (60s)</button>
                            <button onClick={handleUnlock} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-3 px-8 rounded-sm text-xs uppercase tracking-widest shadow-lg transition-all flex items-center gap-2"><Coins size={14} /> Tip {activeStream?.price} LSC</button>
                        </div>
                    </div>
                ) : hlsError ? (
                    <div className="absolute inset-0 bg-dark-900 z-20 flex flex-col items-center justify-center p-8 text-center">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">Playback Error</h2>
                        <p className="text-gray-400 text-sm mb-6">{hlsError}</p>
                        <button onClick={() => window.location.reload()} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-bold transition-all">Reload Page</button>
                    </div>
                ) : (
                    <>
                        <Watermark />
                        <video ref={videoRef} className="w-full h-full object-contain cursor-pointer" controls={false} playsInline muted poster={activeStream?.thumbnail} onClick={togglePlayback} />
                        {!isPlaying && !isLocked && !showPreRoll && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 z-10">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 shadow-2xl"><Play size={40} fill="white" className="ml-2" /></div>
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
                            <button onClick={togglePlayback} className="p-2 bg-black/60 rounded-full text-white hover:bg-brand-600 transition-colors">{isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}</button>
                        </div>
                        {isPreviewing && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-brand-600/90 backdrop-blur text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-white/20 shadow-xl z-30 animate-pulse">
                                Time till tip: {previewTimeLeft}s
                            </div>
                        )}
                        {/* Floating Hearts */}
                        {floatingHearts.map(heart => (
                            <div key={heart.id} className="absolute bottom-16 z-50 animate-bounce pointer-events-none transition-all duration-1000 opacity-0" style={{ left: `${heart.x}%`, animation: `floatUp 2s ease-out forwards` }}>
                                <Heart size={24} fill="#ef4444" className="text-red-500 shadow-xl drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]" />
                            </div>
                        ))}
                    </>
                )}
            </div>
            <div className="w-full xl:w-[397px] bg-dark-800 rounded-sm overflow-hidden flex flex-col border border-white/5 shadow-xl shrink-0 h-[500px] xl:h-[500px]">
                <LiveChat isLive={!showPreRoll && !isLocked} streamId={activeStream?.id} onGiftClick={() => setIsTipModalOpen(true)} onLikeClick={handleLike} />
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-full mx-auto min-h-screen bg-dark-850">
       <TipModal isOpen={isTipModalOpen} onClose={() => setIsTipModalOpen(false)} creatorName={activeStream?.streamer || 'Streamer'} />
       <CommentsModal isOpen={commentsModalOpen} onClose={() => setCommentsModalOpen(false)} postId={0} />

       <div className="flex flex-col min-h-screen">
           <div className="flex-1 min-w-0 flex flex-col relative">
                
                <ContentHeader 
                    title="Live Streams"
                    icon={Radio}
                    stats={[
                        { label: 'Live Now', value: '1.2K' },
                        { label: 'Viewers', value: '450K' }
                    ]}
                    tags={LIVE_FILTERS.map(f => ({ id: f, label: f, count: Math.floor(Math.random() * 300).toString() }))}
                    activeTag={activeFilter}
                    onTagClick={setActiveFilter}
                    onAddTag={(label) => setSearchQuery(prev => prev ? `${prev} ${label}` : label)}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    viewMode={'grid'}
                    onViewModeChange={() => {}}
                    onCreateClick={() => navigate('/live/setup')}
                    createLabel="Go Live"
                    bgImage="https://picsum.photos/seed/live/1920/1080?blur=10"
                    heroContent={heroContent}
                />

                {/* Content Layout */}
                <div className="flex-1 flex overflow-hidden relative">
                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-dark-900 p-4 md:p-8">
                            <div className="max-w-[1600px] mx-auto">
                                {/* Live Grid */}
                                {error ? (
                                    <div className="py-20 text-center">
                                        <p className="text-red-500 font-bold mb-4">{error}</p>
                                        <button onClick={loadInitial} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2 rounded-lg font-bold transition-all">Retry Loading</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-10 relative">
                                        {/* Container Handles for Studio Feel - Expanded to all sides */}
                                        <div className="absolute top-0 -left-2 w-1 h-12 bg-brand-500/20 rounded-full group-hover:bg-brand-500/40 transition-colors"></div>
                                        <div className="absolute top-0 -right-2 w-1 h-12 bg-brand-500/20 rounded-full group-hover:bg-brand-500/40 transition-colors"></div>
                                        <div className="absolute bottom-0 -left-2 w-1 h-12 bg-brand-500/20 rounded-full group-hover:bg-brand-500/40 transition-colors"></div>
                                        <div className="absolute bottom-0 -right-2 w-1 h-12 bg-brand-500/20 rounded-full group-hover:bg-brand-500/40 transition-colors"></div>

                                        <div className="sticky top-0 z-40 bg-dark-900 border-b border-brand-500/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] -mx-4 md:-mx-8 px-4 md:px-8 py-3 mb-6 relative">
                                            {/* Studio handles for sticky header */}
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500/40 rounded-r-md"></div>
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500/40 rounded-l-md"></div>
                                            
                                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1600px] mx-auto">
                                                <div className="flex items-center gap-3 w-full md:w-auto">
                                                    <div className="w-10 h-10 bg-brand-500/10 rounded-lg flex items-center justify-center border border-brand-500/20 shrink-0">
                                                        {searchQuery ? <Search size={18} className="text-brand-500" /> : <Video size={18} className="text-brand-500" />}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <h2 className="text-lg font-black text-white uppercase tracking-tighter truncate">
                                                            {searchQuery ? `Search Results` : "Content Preview"}
                                                        </h2>
                                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em] truncate">
                                                            {searchQuery ? `${filteredStreams.length} matches for "${searchQuery}"` : "Global Live Feed"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Dedicated Search Input in Content Section */}
                                                <div className="relative w-full md:w-96 group/search shrink-0">
                                                    <div className="absolute -inset-[1px] bg-brand-500/20 rounded-lg blur-sm opacity-0 group-hover/search:opacity-100 transition-opacity"></div>
                                                    <div className="relative flex items-center bg-dark-800 border border-white/10 rounded-lg px-3 py-2 transition-all group-focus-within/search:border-brand-500/50">
                                                        <Search size={16} className="text-gray-500 group-focus-within/search:text-brand-500 transition-colors" />
                                                        <input 
                                                            type="text"
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            placeholder="Search streams, categories, or tags..."
                                                            className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder-gray-600 block w-full px-3 uppercase tracking-wider font-bold"
                                                        />
                                                        {searchQuery && (
                                                            <button 
                                                                onClick={() => setSearchQuery('')}
                                                                className="p-1 hover:bg-white/5 rounded-md text-gray-500 hover:text-white transition-colors"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}
                                                        {/* Small handles on search box */}
                                                        <div className="absolute top-0 left-0 w-1 h-3 border-t border-l border-white/20"></div>
                                                        <div className="absolute bottom-0 right-0 w-1 h-3 border-b border-r border-white/20"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {filteredStreams.length === 0 && !loading ? (
                                            <div className="px-2">
                                                <div className="bg-brand-500/5 border border-dashed border-brand-500/20 rounded-xl p-8 mb-8 text-center">
                                                    <AlertCircle size={32} className="mx-auto text-brand-500/50 mb-3" />
                                                    <p className="text-xs text-brand-500 font-black uppercase tracking-widest">
                                                        {activeFilter === 'All' && searchQuery === '' ? 'No live streams currently available' : `No results for "${searchQuery || activeFilter}"`}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Showing popular streams instead</p>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
                                                    {streams.slice(0, 12).map((stream) => (
                                                        <LiveStreamCard 
                                                            key={`popular-${stream.id}`} 
                                                            stream={stream} 
                                                            onClick={() => handleStreamClick(stream)} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12 px-2">
                                                {filteredStreams.map((stream) => (
                                                    <LiveStreamCard 
                                                        key={stream.id} 
                                                        stream={stream} 
                                                        onClick={() => handleStreamClick(stream)} 
                                                    />
                                                ))}
                                            </div>
                                        )}
                                        {/* Tipping Content Preview Section */}
                                        <div className="flex flex-col gap-10 mt-16 relative">
                                            {/* Container Handles */}
                                            <div className="absolute top-0 -left-2 w-1 h-12 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/40 transition-colors"></div>
                                            <div className="absolute top-0 -right-2 w-1 h-12 bg-yellow-500/20 rounded-full group-hover:bg-yellow-500/40 transition-colors"></div>

                                            <div className="flex items-center justify-between border-b border-white/5 pb-4 px-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center border border-yellow-500/20">
                                                        <Gift size={18} className="text-yellow-500" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-black text-white uppercase tracking-tighter">Tipping Content Preview</h2>
                                                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.3em]">Top Trending & Premium Streams</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12 px-2">
                                                {streams.filter(s => s.isPaid).slice(0, 6).map((stream) => (
                                                    <LiveStreamCard 
                                                        key={`tipping-${stream.id}`} 
                                                        stream={stream} 
                                                        onClick={() => handleStreamClick(stream)} 
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {loading && <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-500" /></div>}
                            </div>
                        </div>
                    </div>
               </div>
           </div>
       </div>
    </div>
  );
}