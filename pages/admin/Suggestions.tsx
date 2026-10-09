import React, { useState, useEffect } from 'react';
import { MessageCircle, Check, X, ArrowLeft, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/db';

export default function Suggestions() {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSuggestions = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setSuggestions(await db.getSuggestions());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, []);

    const handleAction = async (id: string, action: 'acknowledge' | 'dismiss') => {
        // In a real app, update DB
        console.log(`Suggestion ${id} ${action}d`);
        await db.logAction({ userId: 'admin', action: `${action}_suggestion`, targetType: 'suggestion', targetId: id, details: `Admin ${action}ed suggestion` });
        // For now just refresh
        fetchSuggestions();
    };

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button onClick={() => navigate('/admin/community')} className="p-3 bg-dark-800 rounded-2xl text-gray-400 border border-white/5 hover:text-white transition-colors shrink-0">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-1 flex items-center gap-3">
                            <MessageCircle className="text-purple-500" size={24} />
                            Community Suggestions
                        </h1>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                             Reviewing user feedback and ideas
                        </p>
                    </div>
                </div>
                <button onClick={fetchSuggestions} className="p-3 bg-dark-800 rounded-xl border border-white/5 text-gray-400 hover:text-white transition-all w-full md:w-auto flex justify-center">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {suggestions.map((s: any, i: number) => (
                    <div key={i} className="bg-dark-800 border border-dark-700 rounded-xl p-6 shadow-lg hover:border-purple-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-900/20 text-purple-500 flex items-center justify-center border border-purple-500/20">
                                    <MessageCircle size={20} />
                                </div>
                                <div>
                                    <div className="font-black text-white text-sm">@{s.user}</div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase">{new Date(s.date).toLocaleDateString()}</div>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            "{s.text}"
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => handleAction(s.id, 'acknowledge')} className="flex-1 py-2 bg-dark-700 hover:bg-green-900/20 text-gray-400 hover:text-green-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                <Check size={14} /> Acknowledge
                            </button>
                            <button onClick={() => handleAction(s.id, 'dismiss')} className="flex-1 py-2 bg-dark-700 hover:bg-red-900/20 text-gray-400 hover:text-red-500 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                <X size={14} /> Dismiss
                            </button>
                        </div>
                    </div>
                ))}
                {suggestions.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest text-xs border-2 border-dashed border-white/5 rounded-2xl">
                        No suggestions found.
                    </div>
                )}
            </div>
        </div>
    );
}
