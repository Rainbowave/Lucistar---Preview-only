import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus, Image as ImageIcon, Film, BookOpen, Gamepad2, Palette, BarChart2 } from 'lucide-react';

export default function CollectionGallery() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('commission');
  const [savedItems, setSavedItems] = useState<any[]>([]);

  useEffect(() => {
    // Mock fetching saved items
    setSavedItems([
      { id: 'c1', type: 'commission', title: 'Custom Anime Character', author: 'art_wizard', image: 'https://picsum.photos/seed/anime/400/300' },
      { id: 'c2', type: 'commission', title: 'VTuber Model Rigging', author: 'rigger_pro', image: 'https://picsum.photos/seed/vtuber/400/300' },
      { id: 'p1', type: 'photo', title: 'Cyberpunk Cityscape', author: 'neon_dreams', image: 'https://picsum.photos/seed/cyber/400/300' },
      { id: 'v1', type: 'video', title: 'Animation Reel 2024', author: 'animator_x', image: 'https://picsum.photos/seed/reel/400/300' }
    ]);
  }, []);

  const filteredItems = savedItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-sm font-black text-white uppercase tracking-widest">My Collection Gallery</h2>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {[
            { id: 'all', label: 'All Saved', icon: FolderPlus },
            { id: 'commission', label: 'Commissions', icon: Palette },
            { id: 'photo', label: 'Photos', icon: ImageIcon },
            { id: 'video', label: 'Videos', icon: Film },
            { id: 'comic', label: 'Comics', icon: BookOpen },
            { id: 'game', label: 'Games', icon: Gamepad2 },
            { id: 'static', label: 'Statics', icon: BarChart2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-black px-4 py-2.5 rounded-[5px] text-[10px] uppercase tracking-widest shadow-xl transition-all flex items-center gap-2 border ${
                activeTab === tab.id 
                ? 'bg-white text-black border-white' 
                : 'bg-dark-800 text-gray-400 border-white/10 hover:bg-dark-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-[#1a1a1a] border border-white/5 rounded-[5px] overflow-hidden group cursor-pointer hover:border-brand-500/50 transition-all"
              onClick={() => {
                if (item.type === 'commission') navigate(`/commission/${item.id}`);
                // Add other navigations here
              }}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-[3px] text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                  {item.type}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-xs font-black text-white uppercase tracking-tighter truncate">{item.title}</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 truncate">@{item.author}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <FolderPlus size={48} className="text-gray-600 mb-4" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">No Items Found</h3>
            <p className="text-xs text-gray-500">You haven't saved any {activeTab === 'all' ? 'items' : activeTab + 's'} yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
