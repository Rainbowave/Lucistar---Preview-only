import React from 'react';
import { Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Commission } from '../../services/commissionsService';

interface CommissionCardProps {
  commission: Commission;
}

export const CommissionCard: React.FC<CommissionCardProps> = ({ commission }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/commission/${commission.id}`)}
      className="bg-[#151515] border border-[#2d2d2d] rounded-[5px] overflow-hidden group cursor-pointer hover:border-brand-500 transition-colors relative"
    >
       {/* Resize Handles (Decorative) */}
       <div className="absolute top-0 left-0 w-full h-0.5 resizer-handle-top z-10" />
       <div className="absolute bottom-0 left-0 w-full h-0.5 resizer-handle-bottom z-10" />
       <div className="absolute top-0 left-0 w-0.5 h-full resizer-handle-left z-10" />
       <div className="absolute top-0 right-0 w-0.5 h-full resizer-handle-right z-10" />
       
       {/* Corner handles */}
       <div className="absolute -top-1 -left-1 resizer-handle-corner z-20" />
       <div className="absolute -top-1 -right-1 resizer-handle-corner z-20" />
       <div className="absolute -bottom-1 -left-1 resizer-handle-corner z-20" />
       <div className="absolute -bottom-1 -right-1 resizer-handle-corner z-20" />

      <div className="relative h-48 overflow-hidden">
        <img src={commission.image} alt={commission.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-[5px] flex items-center gap-1 text-xs font-bold text-white">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          {commission.rating} ({commission.reviews})
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <img src={commission.artist.avatar} alt={commission.artist.username} className="w-6 h-6 rounded-[5px]" />
          <span className="text-xs text-gray-400">{commission.artist.username}</span>
        </div>
        <h3 className="text-sm font-bold text-white mb-2 line-clamp-2">{commission.title}</h3>
        <div className="flex items-center gap-2 mb-4">
          {commission.tags.map(tag => (
            <span key={tag} className="text-[10px] bg-white/5 text-gray-400 px-2 py-1 rounded-[5px] uppercase tracking-widest">{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={14} /> {commission.deliveryTime}
          </div>
          <div className="text-lg font-black text-white">
            ${commission.price}
          </div>
        </div>
      </div>
    </div>
  );
};
