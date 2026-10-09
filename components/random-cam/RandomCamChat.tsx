import React from 'react';
import { MessageSquare } from 'lucide-react';

interface RandomCamChatProps {
  isConnected: boolean;
}

export const RandomCamChat: React.FC<RandomCamChatProps> = ({ isConnected }) => {
  return (
    <div className="w-full h-full flex items-center gap-4 bg-[#111111] px-4">
      <MessageSquare size={20} className="text-gray-400" />
      <input 
        type="text" 
        placeholder={isConnected ? "Type a message..." : "Connect to start chatting..."} 
        disabled={!isConnected}
        className="flex-1 bg-white/5 border border-white/10 rounded-[5px] px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-500 disabled:opacity-50"
      />
    </div>
  );
};
