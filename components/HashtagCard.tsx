
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HashtagCardProps {
    tag: {
        id: string | number;
        tag: string;
        count: string;
        trend: 'up' | 'down' | 'stable';
        contestCount?: number;
        contesterCount?: number;
    };
}

export const HashtagCard: React.FC<HashtagCardProps> = ({ tag }) => {
    const navigate = useNavigate();

    return (
            <div 
                onClick={() => navigate(`/tags/${encodeURIComponent(tag.tag.replace('#', ''))}`)}
                className="bg-dark-850 border border-white/5 rounded-2xl p-6 group hover:border-brand-500/50 hover:bg-dark-850/80 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between h-full shadow-lg"
            >
                
                <div className="absolute top-0 right-0 p-16 bg-brand-500/5 rounded-full blur-2xl group-hover:bg-brand-500/10 transition-colors pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider ${
                        tag.trend === 'up' ? 'text-green-500' : 
                        tag.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                        {tag.trend === 'up' ? <TrendingUp size={14} /> : 
                         tag.trend === 'down' ? <TrendingDown size={14} /> : <Minus size={14} />}
                        {tag.trend === 'up' ? 'Rising' : tag.trend === 'down' ? 'Falling' : 'Stable'}
                    </div>
                </div>

                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-3 mb-6">
                        <h3 className="text-2xl font-black text-white uppercase tracking-tight truncate group-hover:text-brand-500 transition-colors">
                            {tag.tag}
                        </h3>
                    </div>
                    
                    {/* Stats Row */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            {tag.count} Posts
                        </span>
                        
                        <div className="flex gap-4">
                            {(tag.contesterCount || 0) > 0 && (
                                <div className="flex items-center gap-1.5 text-blue-400" title="Active Contesters">
                                    <Users size={14} />
                                    <span className="text-xs font-black">{tag.contesterCount?.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
};
