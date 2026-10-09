import React, { useState } from 'react';
import { Download, Package, ShoppingBag, Palette, Search, Filter, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const Downloads = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'commissions' | 'collections'>('all');

  const downloads = [
    {
      id: '1',
      title: 'Cyberpunk Character Commission',
      type: 'commission',
      artist: 'LuciStar',
      date: '2024-03-20',
      size: '45.2 MB',
      format: 'ZIP (PSD, PNG)',
      status: 'ready',
      thumbnail: 'https://picsum.photos/seed/cyber/200/200'
    },
    {
      id: '2',
      title: 'Neon Nights Collection Pack',
      type: 'collection',
      artist: 'NeonArtist',
      date: '2024-03-18',
      size: '128.5 MB',
      format: 'ZIP (JPG, PNG)',
      status: 'ready',
      thumbnail: 'https://picsum.photos/seed/neon/200/200'
    },
    {
      id: '3',
      title: 'Fantasy Landscape #4',
      type: 'commission',
      artist: 'DreamWeaver',
      date: '2024-03-15',
      size: '12.8 MB',
      format: 'PNG',
      status: 'ready',
      thumbnail: 'https://picsum.photos/seed/fantasy/200/200'
    }
  ];

  const filteredDownloads = downloads.filter(d => {
    if (activeTab === 'all') return true;
    if (activeTab === 'commissions') return d.type === 'commission';
    if (activeTab === 'collections') return d.type === 'collection';
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-12 px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">Your Downloads</h1>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Manage your digital assets and commissions</p>
        </div>

        {/* Search Bar */}
        <div className="bg-dark-800 border border-white/5 rounded-[5px] p-4 mb-12">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search your downloads..."
              className="w-full bg-black border border-white/5 rounded-[5px] py-3 pl-12 pr-4 text-white text-sm font-bold focus:border-brand-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Commissions Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-yellow-500/10 rounded-[5px]">
              <Palette className="text-yellow-500" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Commissions</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {downloads.filter(d => d.type === 'commission').map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-white/5 rounded-[5px] p-4 flex flex-col md:flex-row items-center gap-6 hover:border-yellow-500/30 transition-all group"
              >
                <div className="w-24 h-24 rounded-[5px] overflow-hidden bg-dark-900 border border-white/10 shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight truncate mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Artist: <span className="text-brand-second">{item.artist}</span></p>
                </div>
                <div className="flex items-center gap-8 px-8 border-x border-white/5 hidden lg:flex">
                  <div className="text-center">
                    <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Size</span>
                    <span className="text-xs font-bold text-white uppercase">{item.size}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Format</span>
                    <span className="text-xs font-bold text-white uppercase">{item.format}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="bg-brand-500 text-white px-6 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-widest hover:bg-brand-400 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20">
                    <Download size={16} /> Download Pack
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Collections Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-brand-500/10 rounded-[5px]">
              <ShoppingBag className="text-brand-500" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Your Collections</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {downloads.filter(d => d.type === 'collection').map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-dark-800 border border-white/5 rounded-[5px] p-4 flex flex-col md:flex-row items-center gap-6 hover:border-brand-500/30 transition-all group"
              >
                <div className="w-24 h-24 rounded-[5px] overflow-hidden bg-dark-900 border border-white/10 shrink-0">
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight truncate mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Artist: <span className="text-brand-second">{item.artist}</span></p>
                </div>
                <div className="flex items-center gap-8 px-8 border-x border-white/5 hidden lg:flex">
                  <div className="text-center">
                    <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Size</span>
                    <span className="text-xs font-bold text-white uppercase">{item.size}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">Format</span>
                    <span className="text-xs font-bold text-white uppercase">{item.format}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button className="bg-brand-500 text-white px-6 py-3 rounded-[5px] text-[10px] font-black uppercase tracking-widest hover:bg-brand-400 transition-all flex items-center gap-2 shadow-lg shadow-brand-500/20">
                    <Download size={16} /> Download Pack
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Storage Info */}
        <div className="mt-12 p-6 bg-brand-mixed rounded-[5px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-tighter text-lg">Lifetime Access</h4>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest">All your purchases are stored forever in your vault.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Clock size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Last synced: Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
