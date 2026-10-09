import React, { useState } from 'react';
import { MessageCircle, Heart, X, Send, MessageSquare, Search, User } from 'lucide-react';

// Mock data
const mockUsers = [
  { id: '1', name: 'Sarah Noir', avatar: 'https://picsum.photos/100/100?random=m1', type: 'message', lastMessage: 'Hey! How are you?' },
  { id: '2', name: 'Neon Rider', avatar: 'https://picsum.photos/100/100?random=m2', type: 'message', lastMessage: 'See you later!' },
  { id: '3', name: 'Velvet Circle', avatar: 'https://picsum.photos/100/100?random=i1', type: 'intimacy', lastMessage: 'Thinking of you...' },
  { id: '4', name: 'Gamer Pro', avatar: 'https://picsum.photos/100/100?random=m3', type: 'message', lastMessage: 'GG!' },
  { id: '5', name: 'Cosplay Hub', avatar: 'https://picsum.photos/100/100?random=i2', type: 'intimacy', lastMessage: 'Ready for the show?' },
];

export const ChatSidebar = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'intimacy'>('messages');
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);

  const filteredUsers = mockUsers.filter(u => 
    activeTab === 'messages' ? u.type === 'message' : u.type === 'intimacy'
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    
    setMessages([...messages, {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    }]);
    
    setMessage('');
  };

  return (
    <div className="w-80 h-full bg-card border-l border-white/10 flex flex-col relative">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === 'messages' ? 'text-white border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Direct Messages
        </button>
        <button 
          onClick={() => setActiveTab('intimacy')}
          className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest ${activeTab === 'intimacy' ? 'text-white border-b-2 border-brand-500' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Intimacy
        </button>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredUsers.map(user => (
          <button 
            key={user.id}
            onClick={() => { setActiveChat(user); setMessages([]); }}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all"
          >
            <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt={user.name} />
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold text-white">{user.name}</h4>
              <p className="text-[10px] text-gray-500 truncate">{user.lastMessage}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Active Chat Window (if any) */}
      {activeChat && (
        <div className="absolute inset-0 bg-card z-20 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <button onClick={() => setActiveChat(null)} className="text-gray-400 hover:text-white">Back</button>
            <h3 className="text-sm font-bold text-white">{activeChat.name}</h3>
            <div className="w-8 h-8 rounded-full bg-gray-700"></div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map(msg => (
                <div key={msg.id} className={`p-2 rounded-lg ${msg.isMine ? 'bg-brand-500 text-white self-end' : 'bg-dark-800 text-gray-200 self-start'}`}>
                    {msg.text}
                </div>
            ))}
          </div>
          <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2">
            <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..." 
                className="flex-1 bg-dark-800 p-2 rounded-lg text-white focus:outline-none" 
            />
            <button type="submit" className="p-2 bg-brand-500 text-white rounded-lg"><Send size={16} /></button>
          </form>
        </div>
      )}
    </div>
  );
};
