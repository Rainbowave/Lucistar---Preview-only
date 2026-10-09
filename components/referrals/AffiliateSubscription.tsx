import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';

export const AffiliateSubscription = ({ onSave, initialData, profitPercent }: { onSave: (data: any) => void, initialData?: any, profitPercent: number }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [fee, setFee] = useState(initialData?.fee || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSet = async () => {
        if (!name || !fee) return;
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        onSave({ name, fee: Number(fee), active: true });
        setIsSaving(false);
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
    };

    const calculatedProfit = fee ? (Number(fee) * (profitPercent / 100)).toFixed(2) : '0.00';

    return (
        <div className="bg-dark-800 border border-white/5 rounded-[5px] p-4 md:p-8 relative overflow-hidden h-full shadow-xl">
            <div className="absolute top-0 right-0 p-20 bg-brand-500/5 rounded-[5px] blur-3xl pointer-events-none"></div>
            <div className="relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-center mb-2 drag-handle cursor-move">
                    <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Shield size={24} className="text-brand-500" /> Mandatory Subscription
                    </h3>
                    {isSuccess && <span className="text-emerald-500 text-[10px] font-black uppercase animate-bounce">Saved!</span>}
                </div>
                <p className="text-gray-400 mb-6 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Create a subscription that affiliates must pay. This subscription <span className="text-red-500 font-black">cannot be removed</span>.
                </p>
                
                <div className="space-y-4 flex-1 flex flex-col">
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Subscription Name</label>
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. VIP Access" 
                                className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Monthly Fee (LSC)</label>
                            <input 
                                type="number" 
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                placeholder="100" 
                                className="w-full bg-dark-900 border border-white/10 rounded-[5px] px-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors" 
                            />
                        </div>
                    </div>
                    
                    <div className="bg-dark-900/50 rounded-[5px] p-4 border border-white/5 mt-auto">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Your Share ({profitPercent}%):</span>
                            <span className="text-sm font-black text-brand-500">+{calculatedProfit} LSC</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleSet}
                        disabled={isSaving || !name || !fee}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-[5px] transition-all uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-[0.98] disabled:opacity-50 mt-4"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'Set Subscription'}
                    </button>
                </div>
            </div>
        </div>
    );
};
