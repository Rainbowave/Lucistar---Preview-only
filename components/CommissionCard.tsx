
import React from 'react';
import { Palette, Clock, RefreshCw, MessageSquare, Heart, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommissionCardProps {
  commission: {
    id: string | number;
    title: string;
    content: string;
    thumbnailUrl: string;
    author: {
      username: string;
      displayName: string;
      avatar: string;
    };
    commissionData: {
      type: string;
      turnaround: string;
      revisions: string;
      basePrice: string;
    };
    heat: number;
    isInterestMatch?: boolean;
  };
}

export const CommissionCard: React.FC<CommissionCardProps> = ({ commission }) => {
  const navigate = useNavigate();

  return (
      <div className="bg-dark-850 border border-white/5 rounded-[5px] overflow-hidden group hover:border-brand-500/50 transition-all cursor-pointer flex flex-col h-full relative"
        onClick={() => navigate(`/commission/${commission.id}`)}
      >
        {/* Image Preview */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {commission.isInterestMatch && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 bg-brand-500/20 border border-brand-500/50 rounded-full backdrop-blur-md shadow-[0_0_10px_rgba(247,191,41,0.3)]">
              <Sparkles size={10} className="text-brand-500 fill-brand-500" />
              <span className="text-[8px] font-black text-brand-500 uppercase tracking-widest">Match</span>
            </div>
          )}
          <img 
            src={commission.thumbnailUrl} 
            alt={commission.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-[5px] border border-white/10">
            <span className="text-yellow-500 font-black text-xs">{commission.commissionData.basePrice} LSC</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <img 
              src={commission.author.avatar} 
              alt={commission.author.username}
              className="w-6 h-6 rounded-[5px] object-cover"
            />
            <span className="text-[10px] font-black text-white uppercase tracking-tighter">
              {commission.author.displayName}
            </span>
          </div>

          <h3 className="text-sm font-bold text-white mb-2 line-clamp-1">{commission.title}</h3>
          <p className="text-[11px] text-gray-500 line-clamp-2 mb-4 flex-1">{commission.content}</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-black/40 p-2 rounded-[5px] border border-white/5 flex items-center gap-2">
              <Clock size={12} className="text-gray-500" />
              <span className="text-[9px] font-bold text-gray-400 uppercase">{commission.commissionData.turnaround}</span>
            </div>
            <div className="bg-black/40 p-2 rounded-[5px] border border-white/5 flex items-center gap-2">
              <RefreshCw size={12} className="text-gray-500" />
              <span className="text-[9px] font-bold text-gray-400 uppercase">{commission.commissionData.revisions} Revisions</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-3">
              <button className="text-gray-500 hover:text-brand-500 transition-colors flex items-center gap-1">
                <Heart size={14} />
                <span className="text-[10px] font-bold">{commission.heat}</span>
              </button>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MessageSquare size={14} />
              </button>
            </div>
            <button className="bg-white/5 hover:bg-brand-500 text-gray-400 hover:text-white p-2 rounded-[5px] transition-all">
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
  );
};
