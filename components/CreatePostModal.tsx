
import React, { useState, useRef, useEffect } from 'react';
import { 
    X, UploadCloud, Image as ImageIcon, Video, BookOpen, 
    BarChart2, PlusCircle, Coins,
    Target, Loader2, Sparkles,
    MapPin, Hash, Trash2, Send, Lock,
    FileText, Smartphone, Film, Grid, Layout,
    Archive, Save, ChevronRight, Layers, Clock, List, ChevronDown, Ticket, Users, Vote, CircleDot
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { uploadService } from '../services/uploadService';
import { analyzeImageForTags } from '../services/geminiService';
import { db } from '../services/db'; 
import { UserRole } from '../types';

// Updated Post Types
export type PostType = 'POST' | 'PHOTO' | 'VIDEO' | 'SHORT' | 'COMIC' | 'COLLECTION' | 'POLL' | 'PRODUCT' | 'RESOURCE';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    userAvatar: string;
    userId: string;
    isPremium?: boolean;
    contentPreference?: string;
    initialType?: PostType;
    initialTags?: string[];
    initialMediaUrl?: string;
    context?: 'general' | 'intimacy';
    onSuccess?: () => void;
    variant?: 'modal' | 'inline' | 'page';
    userRole?: UserRole; 
}

interface UploadFile {
    id: string;
    file: File | null;
    preview: string;
    progress: number;
    status: 'pending' | 'uploading' | 'completed' | 'error';
    url?: string;
    tags: string[]; // Per-file tags
    title?: string; // Optional per-file title
}

interface ImageMarker {
    id: number;
    x: number;
    y: number;
    label: string;
}

interface PollOptionItem {
    id: string;
    text: string;
}

interface CurriculumItem {
    id: string;
    title: string;
    type: 'head' | 'sub';
    duration: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ 
    isOpen, 
    onClose, 
    userAvatar, 
    userId, 
    initialType,
    initialTags,
    initialMediaUrl,
    context = 'general',
    onSuccess,
    userRole = 'user' 
}) => {
    const [postType, setPostType] = useState<PostType>(initialType || 'POST');
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [activeFileIndex, setActiveFileIndex] = useState(0);
    
    // Metadata (Global)
    const [caption, setCaption] = useState(''); 
    const [category, setCategory] = useState('');
    
    // Intimacy Circle Selection
    const [selectedCircle, setSelectedCircle] = useState('');
    
    // Tag Input State
    const [tagInput, setTagInput] = useState('');
    
    // Curriculum State (For Knowledge Book)
    const [curriculum, setCurriculum] = useState<CurriculumItem[]>([]);
    const [newLessonTitle, setNewLessonTitle] = useState('');
    const [newLessonType, setNewLessonType] = useState<'head' | 'sub'>('sub');
    const [newLessonDuration, setNewLessonDuration] = useState('');

    // Monetization & Access
    const [privacy, setPrivacy] = useState<'public' | 'subscribers' | 'unlock'>('public');
    const [price, setPrice] = useState(''); 
    
    // Ticket/Poll State
    const [showTicketConfig, setShowTicketConfig] = useState(false);
    const [ticketType, setTicketType] = useState<'standard' | 'ticket_pool'>('standard');
    const [ticketMode, setTicketMode] = useState<'text' | 'media' | 'interactive'>('text');
    const [ticketQuestion, setTicketQuestion] = useState('');
    const [ticketPrice, setTicketPrice] = useState('10');
    const [ticketOptions, setTicketOptions] = useState<PollOptionItem[]>([
        { id: '1', text: '' },
        { id: '2', text: '' }
    ]);
    const [markers, setMarkers] = useState<ImageMarker[]>([]);

    const [isUploading, setIsUploading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isGeneratingAi, setIsGeneratingAi] = useState(false);
    const [draftCount, setDraftCount] = useState(3);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const canMonetize = userRole !== 'user'; 

    const CONTENT_MENU = [
        { id: 'POST', label: 'Standard Post', icon: FileText },
        { id: 'PHOTO', label: 'Photo Set', icon: ImageIcon },
        { id: 'VIDEO', label: 'Video', icon: Film },
        { id: 'SHORT', label: 'Shorts', icon: Smartphone },
        { id: 'COMIC', label: 'Comic Strip', icon: BookOpen },
        { id: 'COLLECTION', label: 'Collection', icon: PlusCircle },
    ];
    
    // Mock Circles for selection
    const availableCircles = [
        { id: 'c1', name: 'Neon Nights' },
        { id: 'c2', name: 'Creators Hub' },
        { id: 'c3', name: 'VIP Lounge' },
        { id: 'c4', name: 'Close Friends' }
    ];

    // Initialize State
    useEffect(() => {
        if (isOpen) {
            setPostType(initialType || 'POST');
            
            if (initialType === 'POLL') {
                setShowTicketConfig(true);
            } else {
                setShowTicketConfig(false);
            }
            
            if (initialMediaUrl) {
                setFiles([{
                    id: 'prefilled-media',
                    file: null,
                    preview: initialMediaUrl,
                    progress: 100,
                    status: 'completed',
                    tags: initialTags || []
                }]);
                setActiveFileIndex(0);
            } else {
                setFiles([]);
            }
            
            // Default circle selection if in intimacy mode
            if (context === 'intimacy' && availableCircles.length > 0) {
                setSelectedCircle(availableCircles[0].id);
                setPrivacy('subscribers'); // Default to restricted for intimacy
            }
        }
    }, [isOpen, initialType, initialTags, initialMediaUrl, context]);

    const handleClose = () => {
        if (isUploading || isPublishing) {
            if (!window.confirm("Upload in progress. Are you sure you want to cancel?")) return;
        }
        
        const hasContent = caption || files.length > 0 || ticketQuestion || ticketOptions.some(o => o.text);
        if (hasContent) {
            if (window.confirm("You have unsaved changes. Save as draft before exiting?")) {
                // Logic to save draft could go here
                onClose();
                return;
            }
        }
        onClose();
    };

    // --- AI TAGS ---
    const handleAiTags = async (mode: 'single' | 'all') => {
        if (files.length === 0) return;
        
        setIsGeneratingAi(true);
        try {
            if (mode === 'single') {
                // Tag active file only
                const activeFile = files[activeFileIndex];
                if (!activeFile.file) return;

                const generatedTags = await analyzeImageForTags(activeFile.file);
                const finalTags = generatedTags.length > 0 ? generatedTags : ['Trending', 'Viral', 'New', postType];
                
                const updatedFiles = [...files];
                updatedFiles[activeFileIndex].tags = [...new Set([...updatedFiles[activeFileIndex].tags, ...finalTags])];
                setFiles(updatedFiles);

            } else {
                // Batch Tag All Files
                const updatedFiles = [...files];
                // Process sequentially to simulate processing and avoid rate limits in mock
                for (let i = 0; i < updatedFiles.length; i++) {
                    if (updatedFiles[i].file) {
                        const generatedTags = await analyzeImageForTags(updatedFiles[i].file!);
                        const finalTags = generatedTags.length > 0 ? generatedTags : ['Trending', 'Viral', 'Collection'];
                        updatedFiles[i].tags = [...new Set([...updatedFiles[i].tags, ...finalTags])];
                    }
                }
                setFiles(updatedFiles);
            }

        } catch (e) {
            console.error("AI Tag Error", e);
        } finally {
            setIsGeneratingAi(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim()) {
            const newTag = tagInput.trim();
            if (files.length > 0) {
                const updatedFiles = [...files];
                if (!updatedFiles[activeFileIndex].tags.includes(newTag)) {
                    updatedFiles[activeFileIndex].tags = [...updatedFiles[activeFileIndex].tags, newTag];
                    setFiles(updatedFiles);
                }
            }
            setTagInput('');
        }
    };
    
    const removeTag = (tag: string) => {
        if (files.length > 0) {
            const updatedFiles = [...files];
            updatedFiles[activeFileIndex].tags = updatedFiles[activeFileIndex].tags.filter(t => t !== tag);
            setFiles(updatedFiles);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files).map((file: File) => {
                const fileName = file.name.split('.').slice(0, -1).join('.') || file.name;
                return {
                    id: Date.now().toString() + Math.random(),
                    file: file,
                    preview: URL.createObjectURL(file),
                    progress: 0,
                    status: 'completed' as const,
                    tags: [],
                    title: fileName
                };
            });
            
            if (postType === 'COLLECTION' || postType === 'COMIC') {
                setFiles(prev => [...prev, ...newFiles]);
            } else {
                setFiles(newFiles.slice(0, 1)); // Replace if single mode
                setActiveFileIndex(0);
            }
        }
    };

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await new Promise(r => setTimeout(r, 1200)); 
            
            if (postType === 'COLLECTION') {
                // Split collection into individual posts
                for (const f of files) {
                    const isVideo = f.file?.type.startsWith('video') || f.preview.includes('.mp4');
                    const itemType = isVideo ? 'VIDEO' : 'COLLECTION';
                    
                    const newPost = {
                        type: itemType,
                        title: f.title || 'Untitled',
                        content: caption,
                        category,
                        price: privacy === 'unlock' ? price : undefined,
                        privacy,
                        userId: userId,
                        media: [{
                            url: f.preview,
                            tags: f.tags,
                            type: isVideo ? 'video' : 'image'
                        }],
                        thumbnailUrl: f.preview, 
                        circleId: context === 'intimacy' ? selectedCircle : undefined
                    };
                    db.createPost(newPost);
                }
            } else {
                // Standard single post (or other multi-file types like COMIC)
                const newPost = {
                    type: postType,
                    title: 'Untitled',
                    content: caption,
                    category,
                    price: privacy === 'unlock' ? price : undefined,
                    privacy,
                    userId: userId,
                    media: files.map(f => ({
                        url: f.preview,
                        tags: f.tags,
                        type: f.file?.type.startsWith('video') ? 'video' : 'image'
                    })),
                    thumbnailUrl: files[0]?.preview, 
                    pollData: showTicketConfig ? {
                        question: ticketQuestion,
                        type: ticketType,
                        mode: ticketMode,
                        ticketPrice: ticketType === 'ticket_pool' ? ticketPrice : undefined,
                        options: ticketOptions.map(o => ({ id: o.id, label: o.text, votes: 0 })),
                    } : undefined,
                    circleId: context === 'intimacy' ? selectedCircle : undefined
                };
                db.createPost(newPost);
            }

            if (onSuccess) onSuccess();
            handleClose();
        } catch (e) {
            alert("Failed to publish.");
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isOpen) return null;

    const isMultiFile = postType === 'COLLECTION' || postType === 'COMIC';
    const activeFile = files[activeFileIndex];

    return (
        <div className="fixed inset-0 z-[100] flex justify-center items-center bg-black/50 animate-in fade-in duration-300">
            {/* Background Close Area */}
            <div 
                className="absolute inset-0 cursor-pointer" 
                onClick={handleClose}
            />
            
            {/* Content Area */}
            <div className="bg-[#0f0f11] w-full max-w-2xl h-full flex flex-col shadow-2xl border border-white/10 relative overflow-hidden">
                {/* Header */}
                <div className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0 bg-[#0f0f11]/80 backdrop-blur-md sticky top-0 z-20 cursor-move">
                    <div className="flex flex-col pointer-events-none">
                        <h2 className="text-sm font-black text-white tracking-tighter">
                            {context === 'intimacy' ? 'New Circle Post' : `Create ${postType}`}
                        </h2>
                        <p className="text-[9px] text-white/40 font-mono tracking-widest">Draft Auto-Saved</p>
                    </div>
                    <div className="flex items-center gap-4 cursor-default">
                        <button 
                            onClick={() => {/* Drafts logic */}}
                            className="text-gray-500 text-[10px] font-black tracking-widest hover:text-white transition-colors flex items-center gap-2"
                        >
                            <Archive size={14}/> Drafts ({draftCount})
                        </button>
                        <button onClick={handleClose} className="text-gray-500 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* TOP NAVIGATION - Content Type */}
                <div className="bg-[#0a0a0a]/50 border-b border-white/5 flex items-center gap-2 px-8 py-3 overflow-x-auto no-scrollbar shrink-0">
                    {CONTENT_MENU.map((item) => {
                        const isActive = postType === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setPostType(item.id as PostType);
                                    setShowTicketConfig(false);
                                    setFiles([]);
                                }}
                                className={`px-4 py-2 text-[10px] font-black tracking-widest flex items-center gap-2 transition-all rounded-[5px] border whitespace-nowrap ${
                                    isActive 
                                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-600/20' 
                                    : 'text-gray-400 border-white/5 hover:bg-white/5 hover:text-white'
                                }`}
                            >
                                <item.icon size={14} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* MAIN CONTENT */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Scrollable Form Area */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                        
                        {/* Intimacy Circle Selection */}
                        {context === 'intimacy' && (
                            <div className="bg-brand-900/10 border border-brand-500/30 rounded-[5px] p-6 animate-in slide-in-from-top-2">
                                <label className="text-[10px] font-bold text-brand-500 tracking-widest mb-3 block flex items-center gap-2">
                                    <CircleDot size={14} /> Select Circle
                                </label>
                                <div className="relative">
                                    <select 
                                        value={selectedCircle}
                                        onChange={(e) => setSelectedCircle(e.target.value)}
                                        className="w-full bg-dark-900 border border-brand-500/20 rounded-[5px] px-4 py-3 text-white text-sm font-bold focus:border-brand-500 outline-none appearance-none"
                                    >
                                        {availableCircles.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                </div>
                                <p className="text-[9px] text-gray-500 mt-2 font-bold tracking-widest">
                                    This content will be exclusive to members of the selected circle.
                                </p>
                            </div>
                        )}

                        {/* 1. Media Upload Section */}
                        {postType !== 'POST' && (
                            <div>
                                 {files.length === 0 ? (
                                 // Empty State
                                 <div 
                                    className="w-full h-32 border-2 border-dashed border-white/10 rounded-[5px] flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-white/5 transition-all relative overflow-hidden group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple={isMultiFile} />
                                    <UploadCloud size={24} className="text-gray-600 mb-2 group-hover:text-white transition-colors" />
                                    <span className="text-[10px] font-bold text-gray-500 tracking-widest">Click to Upload</span>
                                 </div>
                             ) : (
                                 // Filled State
                                 <div className="flex flex-col gap-4 animate-in fade-in">
                                     {/* Large Preview of Active File */}
                                     <div className="w-full aspect-video bg-black rounded-[5px] border border-white/10 relative overflow-hidden flex items-center justify-center group">
                                         <div className="w-full h-full relative cursor-move">
                                             <img 
                                                src={files[activeFileIndex].preview} 
                                                className="w-full h-full object-contain pointer-events-none" 
                                                alt="Preview" 
                                             />
                                         </div>
                                         <div className="absolute top-2 right-2 flex gap-2 z-10">
                                             <button 
                                                onClick={() => {
                                                    const newFiles = files.filter((_, i) => i !== activeFileIndex);
                                                    setFiles(newFiles);
                                                    if(activeFileIndex >= newFiles.length) setActiveFileIndex(Math.max(0, newFiles.length - 1));
                                                }}
                                                className="p-2 bg-black/60 rounded-full text-red-500 hover:bg-white transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                         </div>
                                     </div>

                                     {/* Thumbnails Row */}
                                     <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                                         {files.map((file, idx) => (
                                             <div 
                                                key={file.id} 
                                                onClick={() => setActiveFileIndex(idx)}
                                                className={`w-16 h-16 shrink-0 rounded-[5px] overflow-hidden border-2 cursor-pointer transition-all ${idx === activeFileIndex ? 'border-brand-500 opacity-100' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                                             >
                                                 <img src={file.preview} className="w-full h-full object-cover" alt="thumb" />
                                             </div>
                                         ))}
                                         {/* Add More Button */}
                                         {isMultiFile && (
                                             <div 
                                                onClick={() => fileInputRef.current?.click()}
                                                className="w-16 h-16 shrink-0 rounded-[5px] border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:border-brand-500 hover:text-white text-gray-600 transition-colors"
                                             >
                                                 <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                                                 <PlusCircle size={20} />
                                             </div>
                                         )}
                                     </div>
                                 </div>
                             )}
                        </div>
                        )}

                        {/* 2. Metadata Inputs */}
                        <div className="space-y-6">
                            {/* Title field removed per request */}

                            <div>
                                <label className="text-[10px] font-bold text-gray-500 tracking-widest mb-3 block">Caption</label>
                                <textarea 
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    placeholder="Write something..." 
                                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-[5px] p-4 text-white text-sm font-medium focus:border-brand-500 outline-none transition-all placeholder:text-gray-700 resize-none h-32"
                                />
                            </div>

                            {/* Tags Section */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[10px] font-bold text-gray-500 tracking-widest">
                                        Auto AI Tags {files.length > 1 ? `(Image ${activeFileIndex + 1})` : ''}
                                    </label>
                                    
                                    <div className="flex gap-2">
                                        {files.length > 0 && (
                                            <button onClick={() => handleAiTags('single')} disabled={isGeneratingAi} className="text-[9px] font-bold text-brand-500 tracking-widest flex items-center gap-1 hover:text-white px-2 py-1 rounded bg-brand-500/10 border border-brand-500/20">
                                                {isGeneratingAi ? <Loader2 size={10} className="animate-spin"/> : <Sparkles size={10}/>} AI Tag
                                            </button>
                                        )}
                                        {files.length > 1 && (
                                            <button onClick={() => handleAiTags('all')} disabled={isGeneratingAi} className="text-[9px] font-bold text-purple-500 tracking-widest flex items-center gap-1 hover:text-white px-2 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                                                {isGeneratingAi ? <Loader2 size={10} className="animate-spin"/> : <Layers size={10}/>} Tag All
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 p-2 bg-[#1a1a1a] border border-white/5 rounded-[5px] min-h-[50px]">
                                    {activeFile && activeFile.tags.map(t => (
                                        <span key={t} className="bg-brand-500/10 text-brand-500 border border-brand-500/20 px-3 py-1.5 rounded-[5px] text-[9px] font-bold flex items-center gap-2">
                                            {t} <button onClick={() => removeTag(t)}><X size={10}/></button>
                                        </span>
                                    ))}
                                    {activeFile && activeFile.tags.length === 0 && (
                                        <div className="flex-1 flex items-center justify-center min-h-[30px]">
                                            <button onClick={() => handleAiTags('single')} disabled={isGeneratingAi} className="text-[10px] font-bold text-gray-500 hover:text-brand-500 flex items-center gap-2 transition-colors tracking-widest">
                                                <Sparkles size={12} /> Generate AI Tags
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Ticket / Poll Config */}
                        {showTicketConfig && (
                             <div className="bg-[#1a1a1a] border border-white/5 rounded-[5px] p-6 space-y-6 relative overflow-hidden animate-in slide-in-from-top-2">
                                 <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                                 <div className="flex justify-between items-center">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-[5px] bg-emerald-500/20 flex items-center justify-center">
                                             <Ticket className="w-5 h-5 text-emerald-400" />
                                         </div>
                                         <div>
                                             <h3 className="text-sm font-bold text-white tracking-tighter">Ticket Pool Configuration</h3>
                                             <p className="text-[9px] text-white/40 tracking-widest">Set up your revenue outcome</p>
                                         </div>
                                     </div>
                                     <button onClick={() => setShowTicketConfig(false)} className="text-gray-500 hover:text-white p-2 hover:bg-white/5 rounded-[5px] transition-all">
                                         <X size={16}/>
                                     </button>
                                 </div>
                                 
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-bold text-white/40 tracking-widest">Ticket Price (LSC)</label>
                                         <div className="relative">
                                             <input 
                                                type="number" 
                                                value={ticketPrice}
                                                onChange={(e) => setTicketPrice(e.target.value)}
                                                className="w-full bg-black border border-white/10 rounded-[5px] p-3 text-white text-sm font-bold outline-none focus:border-emerald-500"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-emerald-500">LSC</div>
                                         </div>
                                     </div>
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-bold text-white/40 tracking-widest">Est. Pool Revenue</label>
                                         <div className="w-full bg-emerald-500/5 border border-emerald-500/10 rounded-[5px] p-3">
                                             <div className="text-sm font-bold text-emerald-400">
                                                 {(Number(ticketPrice) * 100).toLocaleString()} <span className="text-[9px] opacity-60">LSC</span>
                                             </div>
                                             <div className="text-[8px] text-emerald-400/40 tracking-widest">Based on 100 participants</div>
                                         </div>
                                     </div>
                                 </div>

                                 <div className="space-y-4">
                                     <div className="space-y-2">
                                         <label className="text-[9px] font-bold text-white/40 tracking-widest">Poll Question</label>
                                         <input 
                                            type="text" 
                                            value={ticketQuestion}
                                            onChange={(e) => setTicketQuestion(e.target.value)}
                                            placeholder="What are you asking?" 
                                            className="w-full bg-black border border-white/10 rounded-[5px] p-3 text-white text-sm font-bold outline-none focus:border-emerald-500"
                                        />
                                     </div>

                                     <div className="space-y-3">
                                         <label className="text-[9px] font-bold text-white/40 tracking-widest">Options (Min 2)</label>
                                         <div className="space-y-2">
                                             {ticketOptions.map((opt, i) => (
                                                 <div key={opt.id} className="flex gap-2 items-center">
                                                     <input 
                                                         type="text" 
                                                         value={opt.text}
                                                         onChange={(e) => {
                                                             const newOpts = [...ticketOptions];
                                                             newOpts[i].text = e.target.value;
                                                             setTicketOptions(newOpts);
                                                         }}
                                                         placeholder={`Option ${i+1}`}
                                                         className="flex-1 bg-black border border-white/10 rounded-[5px] p-3 text-xs text-white focus:border-emerald-500 outline-none"
                                                     />
                                                     {ticketOptions.length > 2 && (
                                                         <button 
                                                             onClick={() => setTicketOptions(ticketOptions.filter((_, idx) => idx !== i))}
                                                             className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-[5px] transition-colors"
                                                         >
                                                             <Trash2 size={14} />
                                                         </button>
                                                     )}
                                                 </div>
                                             ))}
                                         </div>
                                         <button 
                                            onClick={() => setTicketOptions([...ticketOptions, { id: Date.now().toString(), text: '' }])} 
                                            className="w-full py-3 border border-dashed border-white/10 rounded-[5px] text-[9px] font-bold text-white/40 tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                                        >
                                            <PlusCircle size={12}/> Add Option
                                         </button>
                                     </div>
                                 </div>
                             </div>
                        ) }

                        {/* Attach Ticket Button */}
                        {!showTicketConfig && (
                            <button 
                                onClick={() => setShowTicketConfig(true)}
                                className="w-full py-4 border-2 border-dashed border-white/10 rounded-[5px] text-gray-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-[10px] tracking-widest"
                            >
                                <BarChart2 size={16} /> Attach Ticket / Poll
                            </button>
                        )}

                        {/* Access Control - Hidden if Intimacy Context */}
                        {context !== 'intimacy' && (
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 tracking-widest mb-3 block">Access Control</label>
                                <div className="flex bg-[#1a1a1a] p-1 rounded-[5px] border border-white/5">
                                    <button onClick={() => setPrivacy('public')} className={`flex-1 py-3 rounded-[5px] text-[10px] font-bold tracking-widest transition-all ${privacy === 'public' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Public</button>
                                    <button onClick={() => setPrivacy('subscribers')} className={`flex-1 py-3 rounded-[5px] text-[10px] font-bold tracking-widest transition-all ${privacy === 'subscribers' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}>Subscribers</button>
                                    <button onClick={() => setPrivacy('unlock')} className={`flex-1 py-3 rounded-[5px] text-[10px] font-bold tracking-widest transition-all ${privacy === 'unlock' ? 'bg-yellow-500 text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>Unlock</button>
                                </div>
                                {privacy === 'unlock' && (
                                    <div className="mt-4 relative">
                                        <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input 
                                            type="number" 
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            placeholder="Set Price (LSC)" 
                                            className="w-full bg-[#1a1a1a] border border-white/5 rounded-[5px] py-3 pl-12 pr-4 text-white text-sm font-bold focus:border-yellow-500 outline-none transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    {/* Footer Actions */}
                    <div className="h-24 bg-[#0f0f11] border-t border-white/5 px-8 flex items-center justify-between shrink-0 sticky bottom-0 z-20">
                         <button className="text-gray-500 text-[10px] font-bold tracking-widest hover:text-white transition-colors flex items-center gap-2">
                             <Save size={14} /> Save Draft
                         </button>
                         <button 
                            onClick={handlePublish}
                            disabled={isPublishing || (!ticketQuestion && files.length === 0 && !caption)}
                            className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-4 rounded-[5px] font-bold text-xs tracking-widest shadow-xl shadow-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            {context === 'intimacy' ? 'Share to Circle' : 'Publish Content'}
                        </button>
                    </div>
                </div>
                </div>
        </div>
    );
};
