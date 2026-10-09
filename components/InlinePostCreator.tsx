import React, { useState, useRef } from 'react';
import { 
    Image as ImageIcon, Video, BookOpen, 
    BarChart2, Smile, Send, Loader2,
    Film, Grid, Layout, X, ChevronDown, CircleDot, Vote, Ticket
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../services/api';
import { PostType } from './CreatePostModal';

interface InlinePostCreatorProps {
    userAvatar: string;
    userId: string;
    onPostCreated: () => void;
}

const POST_TYPES = [
    { id: 'POST', label: 'Post', icon: Layout },
    { id: 'PHOTO', label: 'Photo', icon: ImageIcon },
    { id: 'VIDEO', label: 'Video', icon: Video },
    { id: 'SHORT', label: 'Short', icon: Film },
    { id: 'COMIC', label: 'Comic', icon: Grid },
    { id: 'COLLECTION', label: 'Collection', icon: BookOpen },
    { id: 'POLL', label: 'Poll', icon: BarChart2 },
    { id: 'TICKET', label: 'Ticket', icon: Ticket },
];

export const InlinePostCreator: React.FC<InlinePostCreatorProps> = ({ userAvatar, userId, onPostCreated }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [postType, setPostType] = useState<PostType>('POST');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTypeSelector, setShowTypeSelector] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleInput = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    };

    const handleSubmit = async () => {
        if (!content.trim()) return;
        
        setIsSubmitting(true);
        try {
            await api.post('/posts', {
                userId,
                type: postType,
                content: content,
                title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                timestamp: Date.now(),
                privacy: 'public',
                isAdult: false
            });
            
            setContent('');
            setIsExpanded(false);
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
            onPostCreated();
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeTypeObj = POST_TYPES.find(t => t.id === postType) || POST_TYPES[0];
    const ActiveIcon = activeTypeObj.icon;

    return (
        <div className="mb-8 bg-dark-900 border border-white/10 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 relative group">
            {/* Resize Handles */}
            <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize z-50 hover:bg-brand-500/20"></div>
            <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize z-50 hover:bg-brand-500/20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize z-50 hover:bg-brand-500/20"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize z-50 hover:bg-brand-500/20"></div>
            
            <div className="p-4 flex items-start gap-4">
                <img src={userAvatar} alt="User" className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0 mt-1" />
                
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <button 
                            onClick={() => setShowTypeSelector(!showTypeSelector)}
                            className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors ${showTypeSelector ? 'bg-brand-500 text-white' : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-white/5'}`}
                            title="Select Content Type"
                        >
                            <Layout size={16} />
                        </button>
                        
                        <AnimatePresence>
                            {showTypeSelector && (
                                <motion.div 
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex items-center gap-2 overflow-x-auto no-scrollbar"
                                >
                                    {POST_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            onClick={() => {
                                                setPostType(type.id as PostType);
                                                setIsExpanded(true);
                                            }}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${postType === type.id ? 'bg-brand-500/20 text-brand-500 border-brand-500/50' : 'bg-dark-800 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            <type.icon size={14} />
                                            {type.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onInput={handleInput}
                        onFocus={() => setIsExpanded(true)}
                        placeholder={`What's on your mind? Create a ${activeTypeObj.label.toLowerCase()}...`}
                        className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none text-lg min-h-[44px] py-2"
                        rows={1}
                    />

                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex flex-col pt-4 mt-2 border-t border-white/5 overflow-hidden"
                            >
                                {/* In-page post settings based on type */}
                                {postType === 'PHOTO' && (
                                    <div className="mb-4 p-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-brand-500 transition-colors cursor-pointer bg-dark-950/50">
                                        <ImageIcon size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Click to upload photo</span>
                                    </div>
                                )}
                                {postType === 'VIDEO' && (
                                    <div className="mb-4 p-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-brand-500 transition-colors cursor-pointer bg-dark-950/50">
                                        <Video size={24} className="mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-widest">Click to upload video</span>
                                    </div>
                                )}
                                {postType === 'POLL' && (
                                    <div className="mb-4 space-y-2">
                                        <input type="text" placeholder="Option 1" className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none" />
                                        <input type="text" placeholder="Option 2" className="w-full bg-dark-950 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-500 outline-none" />
                                        <button className="text-xs font-bold text-brand-500 hover:text-brand-400 uppercase tracking-widest">+ Add Option</button>
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center gap-1">
                                        <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-full transition-colors">
                                            <ImageIcon size={20} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-full transition-colors">
                                            <Video size={20} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-full transition-colors">
                                            <BarChart2 size={20} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-500/10 rounded-full transition-colors">
                                            <Smile size={20} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => {
                                                setIsExpanded(false);
                                                setContent('');
                                                if (textareaRef.current) textareaRef.current.style.height = 'auto';
                                            }}
                                            className="text-sm text-gray-400 hover:text-white px-3 py-1.5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSubmit}
                                            disabled={!content.trim() || isSubmitting}
                                            className="flex items-center gap-2 bg-brand-500 hover:bg-brand-400 disabled:opacity-50 disabled:hover:bg-brand-500 text-white px-6 py-2 rounded-full font-bold transition-all"
                                        >
                                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                            Post
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
