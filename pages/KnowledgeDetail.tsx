
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Heart, MessageCircle, Gift, Bookmark, 
    Clock, Flame, Loader2, Share2, ShieldCheck, 
    FileText, BookOpen, User as UserIcon, Calendar,
    ChevronRight, Download, Printer, Copy
} from 'lucide-react';
import { TipModal } from '../components/TipModal';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { DiscussionSection } from '../components/comments/DiscussionSection';
import { api } from '../services/api';

export default function KnowledgeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser();
    
    const [tipModalOpen, setTipModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);
    const [heat, setHeat] = useState(120);
    const [resource, setResource] = useState<any>(null);

    useEffect(() => {
        const fetchResource = async () => {
            setLoading(true);
            try {
                // In a real app, we'd fetch by ID. For demo, we'll use mock data if not found.
                const data = await api.get<any>(`/posts/${id}`);
                if (data && data.type === 'RESOURCE') {
                    setResource(data);
                    setHeat(data.heat || 120);
                } else {
                    // Fallback mock for demo
                    setResource({
                        id: id,
                        title: "Mastering the Digital Canvas: Professional Workflows",
                        content: "This comprehensive guide explores the advanced techniques used by industry-leading digital artists. From initial sketch to final render, we cover the essential tools and mental models required to elevate your art to a professional standard.\n\n### Introduction\nDigital art is more than just using software; it's about understanding light, form, and composition in a virtual space. This resource breaks down the complex processes into manageable steps.\n\n### Key Workflows\n1. **Conceptualization**: How to build a strong foundation for your piece.\n2. **Value Blocking**: Establishing depth and form early on.\n3. **Refining Details**: Knowing when to add detail and when to let the viewer's eye rest.\n4. **Post-Processing**: Final touches that make a piece pop.\n\n### Conclusion\nConsistency is key. By following these structured workflows, you can ensure a high level of quality in every piece you produce.",
                        thumbnailUrl: `https://picsum.photos/1200/600?random=${id}`,
                        category: 'Design',
                        user: { 
                            username: 'Expert_Creator', 
                            avatar: 'https://picsum.photos/100/100?random=expert',
                            displayName: 'Master Artist'
                        },
                        userId: 'u_expert',
                        timestamp: Date.now() - 86400000 * 5,
                        readTime: '12 min read',
                        views: '5.2K'
                    });
                }
            } catch (e) {
                console.error("Failed to fetch resource", e);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-dark-900">
                <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
            </div>
        );
    }

    if (!resource) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-dark-900 text-center p-6">
                <FileText className="text-gray-600 mb-4" size={64} />
                <h2 className="text-2xl font-bold text-white mb-2">Resource Not Found</h2>
                <button onClick={() => navigate('/knowledge-book')} className="mt-6 bg-brand-600 text-white px-6 py-2 rounded-xl font-bold">Back to Knowledge Book</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark-850 text-[#f4f4f5] font-sans pb-32">
            <TipModal isOpen={tipModalOpen} onClose={() => setTipModalOpen(false)} creatorName={resource.user.displayName} />
            
            {/* Header Bar */}
            <div className="sticky top-0 z-10 bg-dark-900/95 backdrop-blur-xl border-b border-white/5 h-14 md:h-16 flex items-center px-4 md:px-8 justify-between shadow-lg">
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-3 text-white hover:text-brand-500 transition-all group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-black tracking-tighter uppercase hidden md:inline">Back</span>
                </button>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                        <Share2 size={20} />
                    </button>
                    <button 
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 transition-all rounded-full hover:bg-white/5 ${isSaved ? 'text-brand-500' : 'text-gray-400 hover:text-white'}`}
                    >
                        <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto pt-8 px-4 md:px-10">
                {/* Hero Image */}
                <div className="w-full aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-10 relative group">
                    <img src={resource.thumbnailUrl} className="w-full h-full object-cover" alt={resource.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                                {resource.category}
                            </span>
                            <span className="px-3 py-1 bg-dark-800/80 backdrop-blur-md text-gray-300 text-[10px] font-black uppercase tracking-widest rounded-sm flex items-center gap-1">
                                <Clock size={12} /> {resource.readTime}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-[0.9] drop-shadow-lg">
                            {resource.title}
                        </h1>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        <div className="prose prose-invert max-w-none">
                            <div className="bg-dark-800/50 border border-white/5 rounded-2xl p-8 md:p-12 shadow-xl">
                                <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                                    {resource.content}
                                </p>
                                
                                {/* Resource Actions */}
                                <div className="mt-12 pt-8 border-t border-white/5 flex flex-wrap gap-4">
                                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all">
                                        <Download size={18} /> Download PDF
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-dark-700 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-dark-600 transition-all border border-white/5">
                                        <Printer size={18} /> Print
                                    </button>
                                    <button className="flex items-center gap-2 px-6 py-3 bg-dark-700 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-dark-600 transition-all border border-white/5">
                                        <Copy size={18} /> Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Bar */}
                        <div className="flex items-center justify-between py-8 border-b border-white/5 mt-8">
                            <div className="flex items-center gap-8">
                                <button 
                                    onClick={() => { setIsLiked(!isLiked); setHeat(h => isLiked ? h-1 : h+1); }}
                                    className={`flex items-center gap-3 transition-all active:scale-90 ${isLiked ? 'text-brand-500' : 'text-white'}`}
                                >
                                    <Flame size={24} fill={isLiked ? "currentColor" : "none"} />
                                    <span className="text-xl font-black tracking-tighter">{heat}</span>
                                </button>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MessageCircle size={24} />
                                    <span className="text-sm font-black uppercase tracking-widest">Discussion</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => setTipModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-2 bg-brand-600/10 border border-brand-500/30 text-brand-500 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all"
                            >
                                <Gift size={18} /> Support Author
                            </button>
                        </div>

                        {/* Discussion */}
                        <div className="mt-12">
                            <DiscussionSection initialComments={[]} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-[350px] space-y-8 shrink-0">
                        {/* Author Card */}
                        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">About the Author</h3>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-brand-main to-brand-second p-[2px]">
                                    <img src={resource.user.avatar} className="w-full h-full rounded-[10px] object-cover border-2 border-dark-800" alt="" />
                                </div>
                                <div>
                                    <h4 className="font-black text-white text-lg leading-none mb-1 uppercase tracking-tighter">{resource.user.displayName}</h4>
                                    <p className="text-[10px] text-brand-500 font-black uppercase tracking-widest flex items-center gap-1">
                                        <ShieldCheck size={12} /> Expert Contributor
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => navigate(`/profile/${resource.user.username}`)}
                                className="w-full py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all shadow-lg"
                            >
                                View Profile
                            </button>
                        </div>

                        {/* Resource Stats */}
                        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Resource Stats</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold flex items-center gap-2"><Calendar size={14} /> Published</span>
                                    <span className="text-white font-black">{new Date(resource.timestamp).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold flex items-center gap-2"><BookOpen size={14} /> Category</span>
                                    <span className="text-white font-black">{resource.category}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500 font-bold flex items-center gap-2"><UserIcon size={14} /> Views</span>
                                    <span className="text-white font-black">{resource.views || '1.2K'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Related Resources */}
                        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-6">Related Knowledge</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-3 group cursor-pointer" onClick={() => navigate(`/knowledge/res_${i}`)}>
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                            <img src={`https://picsum.photos/100/100?random=rel_${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-white leading-tight mb-1 group-hover:text-brand-500 transition-colors line-clamp-2">Advanced Color Theory for Digital Painters</h4>
                                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Design • 8 min</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
