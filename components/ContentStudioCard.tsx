import React from 'react';
import { 
    Trash2, Edit2, Image as ImageIcon, Video, BookOpen, ShoppingBag, 
    Eye, Flame, Smartphone, Film, Megaphone, Coins, BarChart2
} from 'lucide-react';

interface ContentStudioCardProps {
    post: any;
    accentColor: string;
    onEdit: (post: any) => void;
    onDelete: (id: string | number) => void;
    onPromote: (id: string | number) => void;
}

export function ContentStudioCard({ post, accentColor, onEdit, onDelete, onPromote }: ContentStudioCardProps) {
    return (
            <div className="bg-dark-850 rounded-[5px] border border-white/10 shadow-lg flex flex-col overflow-hidden transition-all hover:border-brand-500/30 group h-full relative">
                <div className="flex flex-col h-full">
                    {/* Thumbnail Area */}
                    <div className="relative h-48 w-full bg-dark-900 shrink-0">
                        <img 
                            src={post.thumbnailUrl || post.url || `https://picsum.photos/400/300?random=${post.id}`} 
                            alt={post.title || 'Content'} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-850 via-transparent to-transparent pointer-events-none"></div>
                        
                        {/* Quick Actions */}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(post); }} className="w-8 h-8 bg-black/80 backdrop-blur rounded-[5px] flex items-center justify-center text-white hover:bg-brand-500 transition-colors shadow-lg border border-white/10" title="Edit">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(post.id); }} className="w-8 h-8 bg-black/80 backdrop-blur rounded-[5px] flex items-center justify-center text-white hover:bg-red-500 transition-colors shadow-lg border border-white/10" title="Delete">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-4 flex-1 flex flex-col bg-dark-850">
                        <h4 className="text-sm font-medium text-white line-clamp-2 mb-2 leading-tight">
                            {post.title || post.content || 'Untitled Content'}
                        </h4>
                        
                        {/* Stats Row */}
                        <div className="flex items-center gap-4 mb-4 mt-auto">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Eye size={14} />
                                <span className="text-xs font-medium">{(post.views || Math.floor(Math.random() * 5000)).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <Flame size={14} className={accentColor} />
                                <span className="text-xs font-medium">{(post.heat || Math.floor(Math.random() * 1000)).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-white/5">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onPromote(post.id); }} 
                                className="flex items-center justify-center gap-2 py-2 bg-dark-700 hover:bg-white/10 text-white rounded-[5px] transition-colors text-[11px] font-medium uppercase tracking-wider"
                            >
                                <Megaphone size={14} /> Promote
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); alert(`Monetize settings for: ${post.title || 'Content'}`); }} 
                                className="flex items-center justify-center gap-2 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded-[5px] transition-colors text-[11px] font-medium uppercase tracking-wider"
                            >
                                <Coins size={14} /> Monetize
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); alert(`Performance analytics for: ${post.title || 'Content'}`); }} 
                                className="col-span-2 flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-[5px] transition-colors text-[11px] font-medium uppercase tracking-wider mt-1 shadow-lg shadow-brand-900/20"
                            >
                                <BarChart2 size={14} /> Content Performance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
