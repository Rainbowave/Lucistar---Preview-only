
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Zap, Image as ImageIcon, Video, BookOpen, Palette, 
  ShoppingBag, FileText, Camera as CameraIcon, Gamepad2 
} from 'lucide-react';

export const EXPLORE_SECTIONS = [
  { label: 'Feed', path: '/home', icon: Zap },
  { label: 'Photos', path: '/photos', icon: ImageIcon },
  { label: 'Videos', path: '/videos', icon: Video },
  { label: 'Comics', path: '/comics', icon: BookOpen },
  { label: 'Commission', path: '/commissions', icon: Palette },
  { label: 'Collection', path: '/collection', icon: ShoppingBag },
  { label: 'Knowledge', path: '/knowledge-book', icon: FileText },
  { label: 'Live', path: '/live', icon: CameraIcon },
  { label: 'Arcade', path: '/arcade', icon: Gamepad2 }
];

export const ExploreStickyNav: React.FC = () => {
    const location = useLocation();
    
    return (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {EXPLORE_SECTIONS.map((section) => {
                const isActive = location.pathname === section.path || (section.path === '/home' && (location.pathname === '/' || location.pathname === '/home'));
                const SectionIcon = section.icon;
                return (
                    <Link
                        key={section.path}
                        to={section.path}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                            isActive 
                                ? 'bg-[#fc8347] text-white border-[#fc8347] shadow-lg shadow-[#fc8347]/20' 
                                : 'bg-black text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                    >
                        <SectionIcon size={12} />
                        {section.label}
                    </Link>
                );
            })}
        </div>
    );
};

export const StickyContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
    return (
        <div className={`sticky top-0 z-30 pt-0 pb-4 scale-95 md:scale-100 origin-top ${className}`}>
            <div className="bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/5 border-t-0 rounded-b-[5px] rounded-t-none p-4 shadow-2xl flex flex-col gap-4 relative overflow-hidden group">
                {/* Resize Handles (Decorative) */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 resizer-handle-bottom" />
                <div className="absolute top-0 left-0 w-0.5 h-full resizer-handle-left" />
                <div className="absolute top-0 right-0 w-0.5 h-full resizer-handle-right" />
                
                {/* Corner handles */}
                <div className="absolute -bottom-1 -left-1 resizer-handle-corner" />
                <div className="absolute -bottom-1 -right-1 resizer-handle-corner" />
                
                {children}
            </div>
        </div>
    );
};
