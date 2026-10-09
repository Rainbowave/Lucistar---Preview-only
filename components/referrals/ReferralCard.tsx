import React, { useState } from 'react';
import { Gift, Copy, Check, Link as LinkIcon, Percent, Shield, Loader2, Save, Crown, Zap } from 'lucide-react';

export const ReferralCard = ({ code, reward, claims, isAdult, profitPercent, setProfitPercent, onSave, isPremium }: { code: string, reward: string, claims: number, isAdult: boolean, profitPercent: number, setProfitPercent: (val: number) => void, onSave: () => void, isPremium: boolean }) => {
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const maxProfit = isPremium ? 20 : 10;

    const handleCopy = () => {
        navigator.clipboard.writeText(isAdult ? `https://lucisin.com/affiliate/${code}?profit=${profitPercent}` : code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 800));
        onSave();
        setIsSaving(false);
    };

    return (
        <div className="bg-dark-800 border border-white/5 hover:border-brand-500/50 rounded-[5px] p-4 md:p-8 relative overflow-hidden transition-all group shadow-xl h-full flex flex-col">
            <div className="absolute top-0 right-0 p-20 bg-brand-500/5 rounded-[5px] blur-3xl group-hover:bg-brand-500/10 transition-colors pointer-events-none"></div>
            
            <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-8 drag-handle cursor-move">
                    <div>
                        <h3 className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                            <Zap size={10} className="text-brand-500" /> {isAdult ? 'Affiliate Link' : 'Referral Code'}
                        </h3>
                        <div className="flex items-center gap-4">
                            <span className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase drop-shadow-lg">{code}</span>
                            <button 
                                onClick={handleCopy} 
                                className="w-8 h-8 md:w-10 md:h-10 rounded-[5px] bg-dark-900 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-brand-500 hover:bg-brand-500 transition-all shadow-lg active:scale-95"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-dark-900 border border-white/10 rounded-[5px] flex items-center justify-center text-brand-500 shadow-lg">
                        {isAdult ? <LinkIcon size={24} /> : <Gift size={24} />}
                    </div>
                </div>
                
                {isAdult && (
                    <div className="mb-8 bg-dark-900/50 p-4 md:p-5 rounded-[5px] border border-white/5 flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Percent size={12} className="text-brand-500" /> Profit Percentage
                            </label>
                            <span className="text-lg font-black text-white">{profitPercent}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max={maxProfit} 
                            value={profitPercent} 
                            onChange={(e) => setProfitPercent(Number(e.target.value))}
                            className="w-full accent-brand-500 h-1 bg-dark-700 rounded-[5px] appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-[8px] text-gray-500 mt-2 font-bold">
                            <span>1% Min</span>
                            <span className={isPremium ? 'text-brand-500' : 'text-gray-500'}>{maxProfit}% Max {isPremium ? '(Premium)' : '(Standard)'}</span>
                        </div>

                        {!isPremium && (
                            <div className="mt-4 p-3 bg-brand-900/20 border border-brand-500/30 rounded-[5px] flex items-center justify-between">
                                <div>
                                    <div className="text-[9px] font-black text-brand-500 uppercase tracking-widest flex items-center gap-1">
                                        <Crown size={10} /> Upgrade Account
                                    </div>
                                    <div className="text-[9px] text-gray-400">Unlock up to 20% share & lower fees</div>
                                </div>
                                <button className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-[8px] font-black uppercase tracking-widest rounded-[5px] transition-colors">
                                    Upgrade
                                </button>
                            </div>
                        )}

                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="mt-4 w-full py-2 bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-[9px] font-black uppercase tracking-widest rounded-[5px] border border-brand-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                            Update Profit Share
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4 mb-8 mt-auto">
                    <div className="bg-dark-900/50 rounded-[5px] p-4 md:p-5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{isAdult ? 'Profit Share' : 'Reward / Invite'}</div>
                        <div className="font-black text-lg md:text-xl text-brand-500 tracking-tight">{isAdult ? `${profitPercent}%` : reward}</div>
                    </div>
                    <div className="bg-dark-900/50 rounded-[5px] p-4 md:p-5 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{isAdult ? 'Total Affiliates' : 'Total Referrals'}</div>
                        <div className="font-black text-white text-lg md:text-xl tracking-tight">{claims}</div>
                    </div>
                </div>

                <button className="w-full bg-white text-black hover:bg-brand-500 hover:text-white font-black py-3 md:py-4 rounded-[5px] transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]">
                    <LinkIcon size={16} /> {isAdult ? 'Share Affiliate Link' : 'Share Referral'}
                </button>
            </div>
        </div>
    );
};
