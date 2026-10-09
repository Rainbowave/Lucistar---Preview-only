import React, { useState } from 'react';
import { Mail, Phone, Loader2, Share2 } from 'lucide-react';

export const InviteForm = ({ isAdult, code, profitPercent }: { isAdult: boolean, code: string, profitPercent: number }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email && !phone) return;
        setIsSending(true);
        await new Promise(r => setTimeout(r, 1000));
        setIsSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
        setEmail('');
        setPhone('');
    };

    const dynamicLink = isAdult ? `https://lucisin.com/register?affiliate=${code}&profit=${profitPercent}` : `https://lucisin.com/register?ref=${code}`;

    return (
        <div className="bg-dark-800 border border-white/5 rounded-[5px] p-4 md:p-8 relative overflow-hidden h-full shadow-xl">
            <div className="flex justify-between items-center mb-6 drag-handle cursor-move">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                    <Mail size={20} className="text-brand-500" /> Invite Directly
                </h3>
                {sent && <span className="text-emerald-500 text-[10px] font-black uppercase animate-bounce">Invite Sent!</span>}
            </div>
            <form onSubmit={handleSend} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
                        <div className="relative">
                            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="affiliate@example.com" 
                                className="w-full bg-dark-900 border border-white/10 rounded-[5px] pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
                        <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input 
                                type="tel" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 234 567 8900" 
                                className="w-full bg-dark-900 border border-white/10 rounded-[5px] pl-9 pr-4 py-3 text-white text-sm focus:border-brand-500 focus:outline-none transition-colors" 
                            />
                        </div>
                    </div>
                </div>
                <div className="bg-dark-900/50 p-4 rounded-[5px] border border-white/5 text-xs text-gray-400 break-all">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Dynamic Link to be sent:</span>
                    {dynamicLink}
                </div>
                <button 
                    type="submit"
                    disabled={isSending || (!email && !phone)}
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-[5px] transition-all uppercase tracking-[0.2em] text-[10px] shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSending ? <Loader2 size={16} className="animate-spin" /> : <><Share2 size={14} /> Send Invite</>}
                </button>
            </form>
        </div>
    );
};
