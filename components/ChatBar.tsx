
import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, X, Send, MessageSquare, Settings, UserPlus, Search } from 'lucide-react';

// Mock data for the bar
const mockUsers = [
  { id: '1', name: 'Sarah Noir', avatar: 'https://picsum.photos/100/100?random=m1', type: 'message' },
  { id: '2', name: 'Neon Rider', avatar: 'https://picsum.photos/100/100?random=m2', type: 'message' },
  { id: '3', name: 'Velvet Circle', avatar: 'https://picsum.photos/100/100?random=i1', type: 'intimacy' },
  { id: '4', name: 'Gamer Pro', avatar: 'https://picsum.photos/100/100?random=m3', type: 'message' },
  { id: '5', name: 'Cosplay Hub', avatar: 'https://picsum.photos/100/100?random=i2', type: 'intimacy' },
  { id: '6', name: 'Jessica', avatar: 'https://picsum.photos/100/100?random=m4', type: 'message' },
  { id: '7', name: 'Night Owl', avatar: 'https://picsum.photos/100/100?random=i3', type: 'intimacy' },
];

export const ChatBar = () => {
  const [activeTab, setActiveTab] = useState<'messages' | 'intimacy'>('messages');
  const [activeChats, setActiveChats] = useState<any[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');

  const toggleChat = (user: any) => {
    if (activeChats.find(c => c.id === user.id)) {
      closeChat(user.id);
    } else {
      setActiveChats([user]);
    }
  };

  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.user) {
        const user = customEvent.detail.user;
        // Format user to match ChatBar's expected structure
        const formattedUser = {
          id: user.id,
          name: user.displayName || user.username || 'User',
          avatar: user.avatar || 'https://picsum.photos/100/100',
          type: 'message'
        };
        setActiveTab('messages');
        setActiveChats([formattedUser]);
      }
    };

    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  const closeChat = (userId: string) => {
    setActiveChats(activeChats.filter(c => c.id !== userId));
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchUsername.trim()) return;
    
    const newUser = {
        id: Date.now().toString(),
        name: searchUsername,
        avatar: `https://picsum.photos/100/100?random=${Date.now()}`,
        type: 'message'
    };
    
    setActiveChats([newUser]);
    setSearchUsername('');
    setShowAddUser(false);
  };

  const filteredUsers = mockUsers.filter(u => 
    activeTab === 'messages' ? u.type === 'message' : u.type === 'intimacy'
  );

  return (
    <div className="fixed right-4 bottom-4 flex flex-col items-end gap-4 z-[60] pointer-events-none">
      {/* Active Chat Windows - Docked on top of the bar */}
      <div className="flex flex-col items-end gap-4 pointer-events-auto">
        {activeChats.map(chat => (
          <ChatWindow key={chat.id} user={chat} onClose={() => closeChat(chat.id)} />
        ))}
      </div>

      {/* Add User Search Bar */}
      {showAddUser && (
          <div className="bg-dark-950/95 backdrop-blur-2xl border border-white/10 rounded-[5px] px-4 py-2 pointer-events-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
              <form onSubmit={handleAddUser} className="flex items-center gap-2">
                  <span className="text-brand-500 font-black text-sm">@</span>
                  <input 
                    autoFocus
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value.replace(/^@/, ''))}
                    placeholder="username"
                    className="bg-transparent border-none text-white text-sm focus:outline-none w-32 font-bold"
                  />
                  <button type="submit" className="p-1.5 bg-brand-500 text-white rounded-[5px] hover:bg-brand-600 transition-colors">
                      <Search size={14} />
                  </button>
                  <button type="button" onClick={() => setShowAddUser(false)} className="p-1.5 text-gray-500 hover:text-white transition-colors">
                      <X size={14} />
                  </button>
              </form>
          </div>
      )}

      {/* The Horizontal Message Bar at bottom right */}
      <div className="flex flex-row items-center border border-white/10 rounded-[5px] pointer-events-auto px-4 py-2 gap-4 h-14 w-fit min-w-[380px]">
        {/* Flip Toggle - Icons Only */}
        <div className="flex bg-dark-900 rounded-[5px] p-1 border border-white/5 shrink-0 shadow-inner">
          <button 
            onClick={() => setActiveTab('messages')}
            className={`p-2 rounded-[5px] transition-all flex items-center justify-center ${activeTab === 'messages' ? 'bg-brand-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]' : 'text-gray-500 hover:text-white'}`}
            title="Messages"
          >
            <MessageSquare size={14} />
          </button>
          <button 
            onClick={() => setActiveTab('intimacy')}
            className={`p-2 rounded-[5px] transition-all flex items-center justify-center ${activeTab === 'intimacy' ? 'bg-brand-500 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]' : 'text-gray-500 hover:text-white'}`}
            title="Intimacy"
          >
            <Heart size={14} fill={activeTab === 'intimacy' ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Separated Users List - Horizontal */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[300px]">
          {filteredUsers.map(user => (
            <button 
              key={user.id}
              onClick={() => toggleChat(user)}
              className={`relative shrink-0 group transition-all active:scale-90 ${activeChats.find(c => c.id === user.id) ? 'scale-110' : 'hover:scale-105'}`}
            >
              <div className={`p-0.5 rounded-[5px] transition-all ${activeChats.find(c => c.id === user.id) ? 'bg-brand-500' : 'bg-transparent group-hover:bg-white/20'}`}>
                <img src={user.avatar} className="w-8 h-8 rounded-[5px] object-cover border-2 border-dark-950" alt={user.name} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-dark-950 rounded-[5px] shadow-lg"></div>
            </button>
          ))}
        </div>

        {/* Message Button from Header */}
        <div className="h-8 w-px bg-white/10 mx-1" />
        <button 
            onClick={() => setShowAddUser(!showAddUser)}
            className={`p-2.5 ${showAddUser ? 'bg-brand-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'} rounded-[5px] transition-all relative group`}
            title="Add User"
        >
            <UserPlus size={20} />
        </button>
        <button 
            onClick={() => window.location.hash = '#/chat'}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-[5px] transition-all relative group"
            title="Full Messenger"
        >
            <MessageCircle size={20} />
            <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-dark-800 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl translate-y-2 group-hover:translate-y-0">
                Open Messenger
            </div>
        </button>
      </div>
    </div>
  );
};

const ChatWindow = ({ user, onClose }: { user: any, onClose: () => void }) => {
  const [message, setMessage] = useState('');
  const [isGlowing, setIsGlowing] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey! I saw your latest post, it's amazing! 🔥", time: "10:42 AM", isMine: false },
    { id: 2, text: "Thank you so much! Really appreciate the support. ❤️", time: "10:45 AM", isMine: true }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    }]);
    
    setMessage('');
    
    // Trigger glow effect
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 1000);
  };

  return (
    <div className={`w-72 h-fit max-h-[60vh] bg-card border border-white/10 rounded-[5px] shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-in slide-in-from-left-8 duration-500 ease-out pointer-events-auto mb-0 transition-all ${isGlowing ? 'shadow-[0_0_30px_rgba(239,68,68,0.4)] border-brand-500/50' : ''}`}>
      {/* Header - Reversed Buttons and User Info */}
      <div 
        className="p-3 border-b border-white/10 flex items-center justify-end bg-dark-900/50 backdrop-blur-md cursor-pointer select-none"
        onClick={onClose}
        title="Click to close"
      >
        <div className="flex items-center gap-2 text-right">
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest leading-none mb-1">{user.name}</h4>
            <div className="flex items-center justify-end gap-1">
              <p className="text-[8px] text-emerald-500 font-black uppercase tracking-tighter">Online</p>
              <div className="w-1 h-1 rounded-[5px] bg-emerald-500 animate-pulse"></div>
            </div>
          </div>
          <div className="relative">
            <img src={user.avatar} className="w-8 h-8 rounded-[5px] object-cover border border-white/10" alt="" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-dark-900 rounded-[5px] shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-dark-950/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-dark-900/30 [&::-webkit-scrollbar-thumb]:bg-brand-500/30 [&::-webkit-scrollbar-thumb]:rounded-[5px] hover:[&::-webkit-scrollbar-thumb]:bg-brand-500/80 transition-all">
        <div className="flex flex-col items-center justify-center py-4 opacity-10">
          <MessageSquare size={16} />
        </div>
        
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] rounded-[5px] p-3 shadow-lg ${msg.isMine ? 'bg-brand-500/20 border border-brand-500/30 rounded-tr-none' : 'bg-dark-800 border border-white/5 rounded-tl-none'}`}>
              <p className={`text-[11px] leading-relaxed font-medium ${msg.isMine ? 'text-white' : 'text-gray-200'}`}>{msg.text}</p>
              <div className={`flex mt-1 ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-[7px] font-black uppercase tracking-tighter ${msg.isMine ? 'text-brand-500/50' : 'text-gray-600'}`}>{msg.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-dark-900/80 backdrop-blur-md border-t border-white/10">
        <form 
          onSubmit={handleSend}
          className="flex items-center gap-2 bg-dark-950 border border-white/10 rounded-[5px] pl-4 pr-1.5 py-1.5 focus-within:border-brand-500/50 focus-within:ring-1 focus-within:ring-brand-500/50 transition-all shadow-inner"
        >
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none text-[12px] text-white focus:outline-none placeholder:text-gray-600 font-medium"
          />
          <button 
            type="submit"
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-brand-400 to-brand-600 text-white rounded-[5px] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
            disabled={!message.trim()}
          >
            <Send size={14} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
