
import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Gift, Star, MoreVertical, Heart, AlertCircle } from 'lucide-react';

interface ChatMessage {
    id: number;
    user: string;
    avatar: string;
    text: string;
    isVip?: boolean;
    isMod?: boolean;
    color: string;
}

const COLORS = ['text-red-400', 'text-blue-400', 'text-green-400', 'text-purple-400', 'text-yellow-400', 'text-pink-400'];

export const LiveChat = ({ isLive = true, streamId, onGiftClick, onLikeClick }: { isLive?: boolean, streamId?: number, onGiftClick?: () => void, onLikeClick?: () => void }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [isGlowing, setIsGlowing] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [likes, setLikes] = useState(0);
    const [likeAnim, setLikeAnim] = useState(false);

    const handleLike = () => {
        setLikes(prev => prev + 1);
        setLikeAnim(true);
        setTimeout(() => setLikeAnim(false), 300);
        if (onLikeClick) {
            onLikeClick();
        }
    };
    
    // Reset Chat on Stream Change
    useEffect(() => {
        setMessages([]);
        setIsConnected(false);
        setLikes(0);
    }, [streamId]);

    // Simulating WebSocket Connection
    useEffect(() => {
        if (!isLive) {
            setIsConnected(false);
            return;
        }

        // Fake connection time
        const connectTimeout = setTimeout(() => {
            setIsConnected(true);
            setMessages(prev => [...prev, {
                id: Date.now(),
                user: 'System',
                avatar: '',
                text: 'Welcome to the chat! Be respectful.',
                color: 'text-gray-400',
                isMod: true
            }]);
        }, 1000);

        // Simulate incoming messages via WS
        const mockInterval = setInterval(() => {
            if (!isConnected) return; // Wait until "connected"

            const randomUser = `User${Math.floor(Math.random() * 1000)}`;
            const msgs = ['OMG!', 'Insane play!', 'LOL 😂', 'Hello from Brazil 🇧🇷', 'Can you play Minecraft?', 'GG', 'Wow', 'Love this stream ❤️', 'PogChamp', 'Hype!', 'Streamer noticed me!', 'Nice strategy'];
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            
            const newMsg: ChatMessage = {
                id: Date.now(),
                user: randomUser,
                avatar: `https://picsum.photos/50/50?random=${Math.random()}`,
                text: randomMsg,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                isVip: Math.random() > 0.9,
                isMod: Math.random() > 0.98
            };

            setMessages(prev => {
                const updated = [...prev, newMsg];
                if (updated.length > 50) updated.shift(); 
                return updated;
            });
        }, 2000);

        return () => {
            clearTimeout(connectTimeout);
            clearInterval(mockInterval);
        };
    }, [isLive, isConnected, streamId]);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim()) return;

        const msg = {
            id: Date.now(),
            user: 'You',
            avatar: 'https://picsum.photos/50/50?random=me',
            text: input,
            color: 'text-brand-400',
            isMod: false
        };

        setMessages(prev => [...prev, msg]);
        // Simulate WS send
        setInput('');
        
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 1000);
    };

    return (
        <div className={`flex flex-col h-full bg-dark-800 border-l border-dark-700 transition-all duration-500 ${isGlowing ? 'shadow-[inset_0_0_50px_rgba(239,68,68,0.15)]' : ''}`}>
            {/* Header */}
            <div className="p-4 border-b border-dark-700 flex justify-between items-center bg-dark-900/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm uppercase tracking-wider">Stream Chat</h3>
                    {isConnected ? (
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Connected"></span>
                    ) : (
                        <span className="w-2 h-2 rounded-full bg-red-500" title="Disconnected"></span>
                    )}
                </div>
                <button className="text-gray-400 hover:text-white"><MoreVertical size={16} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-medium text-sm scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-dark-900/30 [&::-webkit-scrollbar-thumb]:bg-brand-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-brand-500/80 transition-all" ref={scrollRef}>
                {!isConnected && (
                    <div className="flex items-center justify-center text-yellow-500 text-xs gap-2 my-2 h-full">
                        <div className="flex flex-col items-center gap-2">
                            <AlertCircle size={18} /> 
                            <span>Connecting to chat...</span>
                        </div>
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className="relative group/msg break-words leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-100 hover:bg-white/5 p-1 -mx-1 rounded transition-colors">
                        <span className="inline-flex items-center gap-1 mr-2 align-middle">
                            {msg.isMod && <span className="bg-green-600 p-0.5 rounded flex items-center justify-center"><img src="https://api.iconify.design/mdi:sword.svg?color=white" className="w-3 h-3" alt="mod" /></span>}
                            {msg.isVip && <span className="bg-brand-600 p-0.5 rounded flex items-center justify-center"><Star size={10} className="text-white fill-white" /></span>}
                            <span className={`font-bold ${msg.color} cursor-pointer hover:underline text-xs`}>{msg.user}:</span>
                        </span>
                        <span className="text-gray-200 align-middle text-sm">{msg.text}</span>
                        
                        {/* Inline Chat Interactions */}
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover/msg:opacity-100 transition-opacity bg-dark-800/90 backdrop-blur-sm p-1 rounded-md border border-white/10 shadow-lg">
                            <button onClick={(e) => { e.stopPropagation(); handleLike(); }} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-red-400 transition-colors" title="Like">
                                <Heart size={12} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); if(onGiftClick) onGiftClick(); }} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-yellow-400 transition-colors" title="Gift">
                                <Gift size={12} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-dark-900 border-t border-dark-700">
                <div className="flex gap-2 mb-3">
                     <button onClick={handleLike} className={`flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-2 rounded-lg transition-transform border border-red-500/20 flex items-center justify-center gap-1 ${likeAnim ? 'scale-110' : ''}`}>
                         <Heart size={12} fill="currentColor" className={likeAnim ? 'animate-bounce' : ''} /> {likes > 0 ? `Like (${likes})` : 'Like'}
                     </button>
                     <button onClick={onGiftClick} className="flex-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 text-xs font-bold py-2 rounded-lg transition-transform hover:scale-105 border border-yellow-500/20 flex items-center justify-center gap-1">
                         <Gift size={12} /> Gift
                     </button>
                     <button className="flex-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 text-xs font-bold py-2 rounded-lg transition-colors border border-purple-500/20 flex items-center justify-center gap-1">
                         <Star size={12} /> Pride
                     </button>
                </div>
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <div className="relative flex-1">
                        <input 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Say something..." 
                            className="w-full bg-dark-800 border border-dark-600 rounded-full py-2.5 pl-4 pr-10 text-white text-sm focus:outline-none focus:border-brand-500 transition-all placeholder-gray-500"
                            disabled={!isConnected}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                            <button type="button" className="p-1.5 text-gray-400 hover:text-brand-400 transition-colors"><Smile size={18} /></button>
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={!input.trim() || !isConnected} 
                        className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full transition-all shadow-lg ${input.trim() && isConnected ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-dark-700 text-gray-500 disabled:opacity-50 disabled:hover:scale-100'}`}
                    >
                        <Send size={16} className="ml-0.5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
