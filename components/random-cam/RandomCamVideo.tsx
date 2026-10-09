import React, { useState, useEffect } from 'react';
import { Loader2, Star, User, Settings, Plus, Coins, Heart, Compass, Smile, Users } from 'lucide-react';

interface RandomCamVideoProps {
  isSearching: boolean;
  isConnected: boolean;
  partner: any;
  onStartSearch: () => void;
  onStop: () => void;
  onNext: () => void;
  showPreferences: boolean;
  onShowPreferences: () => void;
}

export const RandomCamVideo: React.FC<RandomCamVideoProps> = ({
  isSearching,
  isConnected,
  partner,
  onStartSearch,
  onStop,
  onNext,
  showPreferences
}) => {
  const [prefs, setPrefs] = useState({ Gender: 'Any', Orientation: 'Any', Mood: 'Any' });
  const [isChatSticky, setIsChatSticky] = useState(false);
  const [messageText, setMessageText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cam-prefs');
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  const updatePref = (key: string, val: string) => {
    const newPrefs = { ...prefs, [key]: val };
    setPrefs(newPrefs);
    localStorage.setItem('cam-prefs', JSON.stringify(newPrefs));
  };

  return (
    <div className="w-full h-full relative overflow-hidden" onClick={() => isChatSticky && setIsChatSticky(false)}>
      {/* Partner Video */}
      <div className="w-full h-full bg-black flex items-center justify-center">
        {showPreferences ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-md overflow-hidden">
            {/* Backdrop Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-pattern"></div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[500px] h-[500px] bg-brand-main/20 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="text-center p-6 md:p-8 bg-[#1a1a1a] rounded-[5px] border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] max-w-md w-full mx-4 relative z-10 overflow-auto max-h-[85vh] no-scrollbar group/settings-modal" onClick={(e) => e.stopPropagation()}>
                {/* Resizer Handles */}
                <div className="absolute inset-0 pointer-events-none z-50">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/settings-modal:opacity-100 transition-opacity"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/settings-modal:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/settings-modal:opacity-100 transition-opacity"></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/settings-modal:opacity-100 transition-opacity"></div>
                </div>
                <div className="flex justify-center mb-3">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-[5px]">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">12.4k Real Users Online</span>
                    </div>
                </div>
                <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter text-white">Discovery Settings</h2>
                <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-6">Refine your matching criteria</p>
                
                <div className="mb-6 text-left flex flex-col gap-4">
                    {[
                        { label: 'Gender', icon: <Users size={11} />, options: ['Male', 'Female', 'Any'] },
                        { label: 'Orientation', icon: <Compass size={11} />, options: ['Straight', 'LGBTQ+', 'Any'] },
                        { label: 'Mood', icon: <Smile size={11} />, options: ['Chill', 'Wild', 'Any'] }
                    ].map((item) => (
                        <div key={item.label}>
                          <div className="flex items-center gap-2 mb-2">
                             <div className="p-1 bg-brand-main/20 text-brand-main rounded-md">{item.icon}</div>
                             <label className="text-[9px] text-brand-main font-black uppercase tracking-widest">{item.label}</label>
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                             {item.options.map((opt) => (
                                 <button 
                                    key={opt} 
                                    onClick={() => updatePref(item.label, opt)}
                                    className={`relative py-2.5 rounded-[5px] text-[10px] font-black transition-all border ${prefs[item.label as keyof typeof prefs] === opt ? 'bg-[#fc8347] text-black border-[#fc8347] shadow-[0_4px_12px_rgba(252,131,71,0.25)]' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'}`}
                                >
                                    {opt}
                                </button>
                             ))}
                          </div>
                      </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={onStartSearch} 
                        className="group relative px-8 py-4 w-full bg-[#fc8347] text-black font-black uppercase tracking-widest rounded-[5px] shadow-[0_8px_30px_rgba(252,131,71,0.3)] transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                        <span className="relative flex items-center justify-center gap-2 text-[11px]">
                            Launch Cam <Plus size={16} />
                        </span>
                    </button>
                    
                    <div className="bg-white/5 p-3 rounded-[5px] border border-white/5 group/membership transition-all hover:border-brand-main/30">
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[9px] font-black text-brand-main uppercase tracking-widest">Nitro Benefits</span>
                            <div className="px-1.5 py-0.5 bg-brand-main text-black text-[7px] font-black uppercase rounded">Plus</div>
                        </div>
                        <p className="text-[8px] text-gray-500 font-bold leading-tight mb-2">Priority Matching • HD Quality • No Ads</p>
                        <a href="#/subscriptions" className="text-[9px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-1 group-hover/membership:text-brand-main transition-colors">
                            Level Up <Star size={10} className="fill-brand-main" />
                        </a>
                    </div>
                </div>
            </div>
          </div>
        ) : isSearching ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <img src="https://picsum.photos/1920/1080?random=search" className="w-full h-full object-cover blur-3xl opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-brand-main" />
            </div>
          </div>
        ) : isConnected && partner ? (
            <div className="w-full h-full relative overflow-hidden group">
              <img 
                src={`https://picsum.photos/1920/1080?random=${partner.id}`} 
                className="w-full h-full object-cover sm:object-contain bg-black/90 transition-all duration-700" 
                alt="Partner stream"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        ) : null}
      </div>

      {/* Left Sidebar Stack */}
      <div className="absolute bottom-4 left-4 z-[110] flex flex-col gap-4 pointer-events-none items-start">
        {/* User Cam Sidebar with Settings */}
        <div className="w-48 bg-[#1a1a1a] rounded-[5px] border border-white/10 overflow-hidden group shadow-2xl pointer-events-auto" onClick={(e) => e.stopPropagation()}>
          {/* Resizer Handles */}
          <div className="absolute inset-0 pointer-events-none z-50">
              <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="relative h-32">
            <img src="https://picsum.photos/400/300?random=user" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-2 right-2 flex gap-1">
              <button className="p-1 bg-black/50 rounded-[3px] hover:bg-brand-main text-white transition-colors"><Settings size={12}/></button>
            </div>
          </div>
          <div className="p-2 border-t border-white/5 flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-tighter flex items-center gap-1 text-white"><User size={10} className="text-brand-main"/> You</div>
              <div className="text-[10px] font-black text-brand-main uppercase">4.9 ⭐</div>
          </div>
        </div>

        {/* Partner Info and Rating */}
        {isConnected && partner && (
          <div className="bg-[#1a1a1a] p-5 rounded-[5px] border border-white/10 w-[450px] text-white shadow-2xl group/partner-card pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            {/* Resizer Handles */}
            <div className="absolute inset-0 pointer-events-none z-50">
                <div className="absolute top-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/partner-card:opacity-100 transition-opacity"></div>
                <div className="absolute top-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/partner-card:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/partner-card:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-1 right-1 w-1 h-1 bg-white/20 rounded-full opacity-0 group-hover/partner-card:opacity-100 transition-opacity"></div>
            </div>


            <div className="flex gap-4">
                {/* Rectangular Avatar & Rating */}
                <div className="flex flex-col items-center">
                    <img src={partner.avatar} className="w-14 h-14 object-cover rounded-[5px] border border-white/10 mb-1"/>
                        <span className="text-xs text-yellow-500 font-bold flex items-center">{partner.rating || '0.0'} <Star size={12} className="ml-0.5 fill-yellow-500" /></span>
                </div>
                
                {/* Info Container */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-lg">{partner.username}</span>
                            <button className="text-gray-400 hover:text-brand-main transition-colors" title="Add Friend">
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-300 mb-4 leading-relaxed">Description: {partner.description || 'User loves meeting new people and sharing stories.'}</div>
                </div>
            </div>
            
             {/* Action Buttons Container */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-white/10">
                <button onClick={onStop} className="flex-1 py-3 bg-red-600 text-white rounded-[5px] font-bold text-xs uppercase hover:bg-red-700">Stop</button>
                <button onClick={onNext} className="flex-1 py-3 bg-yellow-500 text-black rounded-[5px] font-bold text-xs uppercase hover:bg-yellow-600">Next</button>
            </div>


            

        </div>
      )}
    </div>

      {/* Bottom Right Message Bar */}
      {isConnected && partner && (
        <div id="message-bar-container" className="absolute bottom-4 right-4 z-[100] w-[400px] group" onClick={(e) => { e.stopPropagation(); setIsChatSticky(!isChatSticky); }}>
            
            {/* Input & Send Bar - Integrated design */}
            <div className="bg-[#1a1a1a] p-3 rounded-[5px] border border-white/10 shadow-2xl relative">
              <div className="relative flex items-center gap-2">
                  <div className="relative flex-1">
                    <input 
                      id="message-input"
                      type="text" 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..." 
                      className="w-full bg-white/5 text-sm pl-4 pr-20 py-2.5 rounded-[5px] border border-white/5 text-white focus:border-brand-main outline-none transition-all placeholder:text-gray-500"
                      onClick={(e) => { e.stopPropagation(); setIsChatSticky(true); }}
                    />
                    <button 
                      id="send-message-button"
                      className={`absolute right-1 top-1 bottom-1 px-4 rounded-[5px] font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${messageText.trim() ? 'bg-[#fc8347] text-[#2d2d2d] shadow-[0_0_15px_rgba(252,131,71,0.3)]' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                      onClick={(e) => { e.stopPropagation(); if(messageText.trim()) setMessageText(''); }}
                    >
                      Send
                    </button>
                  </div>
                  <button 
                    className="p-2.5 bg-brand-main/10 hover:bg-brand-main text-brand-main hover:text-black rounded-[5px] border border-brand-main/20 hover:border-brand-main transition-all group/tip"
                    title="Send a Tip"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Coins size={18} className="transition-transform group-hover/tip:scale-110" />
                  </button>
              </div>
            </div>
            
            {/* Chat popup container */}
            <div 
              id="message-history-popup"
              className={`absolute bottom-[calc(100%+12px)] right-0 w-full bg-[#1a1a1a] p-6 rounded-[5px] border border-white/10 transition-all duration-500 z-[101] shadow-2xl ${isChatSticky ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0'}`}
              onClick={(e) => { e.stopPropagation(); setIsChatSticky(true); }}
            >
                 <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                     <h4 className="text-xs font-black uppercase tracking-widest text-brand-main">Live Chat</h4>
                 </div>
                 <div className="text-[12px] text-gray-200 space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-1">
                     <div className="bg-white/5 p-4 rounded-[10px] border border-white/5">
                        <span className="text-[10px] font-black text-brand-main block mb-1.5 uppercase tracking-wider">Partner</span>
                        Hey! I'm glad we connected. You look cool!
                     </div>
                     <div className="bg-[#fc8347] text-black p-4 rounded-[10px] shadow-[0_4px_20px_rgba(252,131,71,0.15)]">
                        <span className="text-[10px] font-black block mb-1.5 uppercase tracking-wider opacity-70">You</span>
                        Thanks! I was just exploring. How's your day?
                     </div>
                 </div>
            </div>
        </div>
      )}
    </div>
  );
};
