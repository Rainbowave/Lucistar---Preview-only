import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, Eye, MessageCircle, Flame, Gift } from 'lucide-react';

export default function ContentPerformance() {
  const { postId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6 md:p-12">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
        <BarChart3 className="text-brand-500" /> Content Performance: {postId}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Views', value: '12,405', icon: Eye, color: 'text-blue-500' },
          { label: 'Engagement', value: '842', icon: MessageCircle, color: 'text-green-500' },
          { label: 'Heat', value: '3,120', icon: Flame, color: 'text-red-500' },
          { label: 'Tips', value: '45', icon: Gift, color: 'text-yellow-500' },
        ].map((stat) => (
          <div key={stat.label} className="bg-dark-800 border border-white/5 p-6 rounded-2xl">
            <div className={`mb-4 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div className="text-3xl font-black">{stat.value}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
