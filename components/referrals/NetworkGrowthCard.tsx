import React from 'react';
import { Crown, Zap } from 'lucide-react';

export const NetworkGrowthCard = ({ isAdult }: { isAdult: boolean }) => {
    return (
        <div className="bg-dark-800 rounded-[5px] p-4 md:p-8 relative overflow-hidden border border-white/5 hover:border-brand-500/30 transition-all group shadow-xl h-full flex flex-col">
            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2 drag-handle cursor-move">
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter">{isAdult ? 'Network Growth' : 'Growth Bonus'}</h3>
                </div>
                <p className="text-gray-400 mb-8 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    {isAdult 
                        ? <>Reach 50 affiliates this month to unlock the exclusive <span className="text-brand-500 font-black">"Top Affiliate"</span> rank and a 100 LSC bonus.</>
                        : <>Reach 50 referred users this month to unlock the exclusive <span className="text-brand-500 font-black">"Community Leader"</span> rank and a 100 LSC reward bonus.</>
                    }
                </p>
                
                <div className="mb-2 flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-white">
                    <span>Progress</span>
                    <span className="text-brand-500">24%</span>
                </div>
                <div className="w-full bg-dark-900 rounded-[5px] h-2 mb-6 overflow-hidden border border-white/5">
                    <div className="bg-gradient-to-r from-brand-600 to-brand-400 h-full w-[24%] shadow-[0_0_10px_rgba(144,9,51,0.5)]"></div>
                </div>
                
                <div className="flex gap-4 mb-8">
                    <div className="bg-dark-900/50 px-4 py-2 rounded-[5px] border border-white/5">
                        <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest">Current</span>
                        <span className="text-white font-black text-lg">12</span>
                    </div>
                    <div className="bg-dark-900/50 px-4 py-2 rounded-[5px] border border-white/5">
                        <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest">Goal</span>
                        <span className="text-gray-400 font-black text-lg">50</span>
                    </div>
                </div>

                {isAdult && (
                    <div className="p-4 md:p-5 bg-gradient-to-br from-brand-900/20 to-brand-900/10 border border-brand-500/30 rounded-[5px] relative overflow-hidden group/sub hover:border-brand-500/50 transition-all shadow-lg shadow-brand-900/5 mt-auto">
                        <div className="absolute top-0 right-0 p-12 bg-brand-500/10 rounded-[5px] blur-2xl group-hover/sub:bg-brand-500/20 transition-colors pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-center mb-3">
                                <div className="text-[10px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-2">
                                    <Crown size={14} fill="currentColor" /> Premium Subscription
                                </div>
                                <span className="px-2 py-1 bg-brand-500/10 border border-brand-500/20 rounded-[5px] text-[9px] font-black text-brand-400">29.99 LSC/mo</span>
                            </div>
                            <p className="text-[9px] text-gray-400 mb-4 leading-relaxed font-bold">
                                Unlock the <span className="text-brand-500">Premium Tier</span>. Boost profit share to <span className="text-white">30%</span> and slash site fees by <span className="text-white">50%</span>.
                            </p>
                            <button className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-[9px] font-black uppercase tracking-widest rounded-[5px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-900/20 active:scale-[0.98]">
                                <Zap size={12} fill="currentColor" /> Upgrade Status
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Decorative BG elements */}
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-brand-500/5 rounded-[5px] blur-3xl group-hover:bg-brand-500/10 transition-colors pointer-events-none"></div>
        </div>
    );
};
