
import React from 'react';
import { LucideIcon, Search, Plus, LayoutGrid, LayoutList, Filter, Sparkles, Zap, RotateCcw } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ExploreStickyNav, StickyContainer } from './ExploreStickyNav';

interface Tag {
  id: string;
  label: string;
  count: string;
}

interface Stat {
  label: string;
  value: string;
  color?: string;
}

interface ContentHeaderProps {
  title: string;
  icon: LucideIcon;
  stats: Stat[];
  userStats?: Stat[];
  tags: Tag[];
  activeTag: string;
  onTagClick: (tagId: string) => void;
  onAddTag: (tagLabel: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCreateClick: () => void;
  onFindInterest?: () => void;
  createLabel: string;
  bgImage: string;
  rightContent?: React.ReactNode;
  heroContent?: React.ReactNode;
  searchRightElement?: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  heroHeight?: string;
}

export const ContentHeader: React.FC<ContentHeaderProps> = ({
  title,
  icon: Icon,
  stats,
  userStats,
  tags,
  activeTag,
  onTagClick,
  onAddTag,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onCreateClick,
  onFindInterest,
  createLabel,
  bgImage,
  rightContent,
  heroContent,
  searchRightElement,
  onRefresh,
  loading,
  heroHeight = 'h-[300px]'
}) => {
  const location = useLocation();

  return (
    <>
      {/* Hero Section */}
      {heroContent ? (
        heroContent
      ) : (
        <div className={`relative ${heroHeight} overflow-hidden border-b border-white/5`}>
          <div className="absolute inset-0">
            <img 
              src={bgImage} 
              className="w-full h-full object-cover opacity-30"
              alt="Hero Background"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/80 to-[#0a0a0a]" />
          </div>

          <div className="relative h-full max-w-7xl mx-auto px-8 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-700">
              <div className="flex items-center gap-4">
                <button 
                  onClick={onCreateClick}
                  className="bg-brand-mixed hover:opacity-90 text-white px-6 py-2.5 rounded-[5px] font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-brand-600/20"
                >
                  <Icon size={16} /> <Plus size={16} /> {title}
                </button>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <div className="flex items-center justify-between gap-4 w-[300px]">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col">
                      <span className="text-white font-black text-lg tracking-tighter">{stat.value}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                  <div className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-yellow-500 font-black text-lg tracking-tighter">1.2M</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Total LSC</span>
                  </div>
                </div>
              </div>

              {rightContent ? (
                <div className="hidden md:block z-10 w-[300px]">
                  {rightContent}
                </div>
              ) : userStats ? (
                <div className="hidden md:flex items-center justify-between gap-4 bg-black/40 backdrop-blur-md border border-white/5 p-4 rounded-[5px] w-[300px]">
                  {userStats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                      <div className={`text-lg font-black tracking-tighter ${stat.color || 'text-white'}`}>{stat.value}</div>
                      <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</div>
                    </div>
                  ))}
                  <div className="text-center border-l border-white/10 pl-8">
                    <div className="text-lg font-black tracking-tighter text-yellow-500">25K</div>
                    <div className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">My LSC</div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search - Sticky bar */}
      <StickyContainer className="max-w-7xl mx-auto px-8">
            {/* Search Bar Line */}
            <div className="flex flex-col md:flex-row items-center gap-4 w-full">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder={`Search ${title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-black border border-white/5 rounded-[5px] py-2.5 pl-12 pr-40 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all"
                />
                <button 
                  onClick={onFindInterest}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-mixed text-white px-4 py-1.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-colors whitespace-nowrap"
                >
                  Find your interest
                </button>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                {searchRightElement}
                <div className="flex bg-black p-1 rounded-[5px] border border-white/5">
                  <button 
                    onClick={() => onViewModeChange('grid')}
                    className={`p-2 rounded-[5px] transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => onViewModeChange('list')}
                    className={`p-2 rounded-[5px] transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'}`}
                  >
                    <LayoutList size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full opacity-20" />
            
            {/* Filters (Tags) */}
            <div className="flex items-start gap-4 w-full">
              <div className="flex flex-wrap items-center gap-2 py-1 flex-1">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mr-2 shrink-0">Filters:</span>
                {tags.map(tag => {
                  const isTagActive = activeTag === tag.id;
                  return (
                    <div key={tag.id} className="flex items-center gap-px shrink-0">
                      <button
                        onClick={() => onTagClick(tag.id)}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                          isTagActive
                            ? 'bg-white text-black border-white'
                            : 'bg-black text-gray-500 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {tag.label} <span className="ml-1 opacity-40">({tag.count})</span>
                      </button>
                    </div>
                  );
                })}
                <button 
                  onClick={() => onAddTag('')}
                  className="w-8 h-8 rounded-full bg-black border border-white/5 text-gray-500 hover:text-brand-500 flex items-center justify-center transition-all"
                  title="Add New Tag"
                >
                  <Plus size={14} />
                </button>
              </div>

              {onRefresh && (
                <button 
                  onClick={onRefresh}
                  className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-[5px] text-gray-400 hover:text-white transition-all shadow-lg shrink-0"
                  title="Refresh Content"
                >
                  <RotateCcw size={16} className={loading ? "animate-spin" : ""} />
                </button>
              )}
            </div>
      </StickyContainer>
    </>
  );
};

