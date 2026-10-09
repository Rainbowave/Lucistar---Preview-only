
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ModeratorSquadCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  count: number;
  onClick: () => void;
}

export const ModeratorSquadCard: React.FC<ModeratorSquadCardProps> = ({ title, icon: Icon, color, count, onClick }) => (
    <button 
        onClick={onClick}
        className="bg-card border border-border rounded-[5px] p-5 shadow-lg hover:border-primary/30 transition-all group flex flex-col items-center justify-center gap-4 relative overflow-hidden h-40 w-full"
    >
        <div className={`absolute inset-0 ${color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
        <div className={`p-4 rounded-full ${color.replace('bg-', 'bg-opacity-10 text-')} group-hover:scale-110 transition-transform`}>
            <Icon size={32} />
        </div>
        <div className="text-center">
            <h3 className="font-black text-white uppercase tracking-tight text-sm mb-1">{title}</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{count} Members</p>
        </div>
    </button>
);
