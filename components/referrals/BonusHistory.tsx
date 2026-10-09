import React from 'react';
import { TrendingUp, Coins } from 'lucide-react';

export const BonusHistory = ({ isAdult }: { isAdult: boolean }) => (
    <div className="bg-dark-800 border border-white/5 rounded-[5px] overflow-hidden shadow-2xl h-full flex flex-col">
        <div className="p-6 border-b border-white/5 bg-dark-900/80 backdrop-blur-md flex justify-between items-center drag-handle cursor-move">
            <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-3">
                <TrendingUp size={16} className="text-brand-500" /> {isAdult ? 'Profit History' : 'Bonus History'}
            </h3>
            <div className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Recent Activity</div>
        </div>
        <div className="divide-y divide-white/[0.03] overflow-y-auto flex-1">
            {[
                { id: 1, user: 'NeonRider', amount: 45.50, time: '2h ago' },
                { id: 2, user: 'CyberPunk', amount: 12.00, time: '5h ago' },
                { id: 3, user: 'SynthWave', amount: 150.00, time: '1d ago' },
                { id: 4, user: 'NightCity', amount: 8.50, time: '2d ago' },
            ].map(item => (
                <div key={item.id} className="p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-default group">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-[5px] bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                            <Coins size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="font-black text-white text-xs uppercase tracking-tight mb-0.5">{isAdult ? 'Profit Share' : 'Referral Multiplier'}</div>
                            <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">From {item.user}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-black text-brand-500 tabular-nums text-sm">+{item.amount.toFixed(2)} LSC</div>
                        <div className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">{item.time}</div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
