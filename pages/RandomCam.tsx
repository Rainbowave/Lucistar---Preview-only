import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Settings, Star, Heart, Zap, MessageSquare, DollarSign } from 'lucide-react';
import { RandomCamVideo } from '../components/random-cam/RandomCamVideo';
import { RandomCamChat } from '../components/random-cam/RandomCamChat';

export default function RandomCam() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [partner, setPartner] = useState<any>(null);
  const [showPreferences, setShowPreferences] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStartSearch = () => {
    setShowPreferences(false);
    setIsSearching(true);
    setIsConnected(false);
    setPartner(null);
    setTimeout(() => {
      setIsSearching(false);
      setIsConnected(true);
      setPartner({
        id: 'user_123',
        username: 'Partner',
        avatar: 'https://picsum.photos/100/100?random=1',
        rating: 4.8
      });
    }, 2000);
  };

  const handleNext = () => handleStartSearch();
  const handleStop = () => {
    setIsConnected(false);
    setShowPreferences(true);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      <main className="flex-1 relative w-full h-full">
        <RandomCamVideo 
            isSearching={isSearching}
            isConnected={isConnected}
            partner={partner}
            onStartSearch={handleStartSearch}
            onStop={handleStop}
            onNext={handleNext}
            showPreferences={showPreferences}
            onShowPreferences={() => setShowPreferences(true)}
        />
        
        {/* Chat UI Panel - Removed as per request */}
        {isChatOpen && (
            <div className="absolute right-0 top-0 h-full w-80 bg-black/80 border-l border-white/10 p-4 flex flex-col z-20">
                <h3 className="font-bold mb-4">Messages API</h3>
                <div className="flex-1 overflow-y-auto mb-4 text-sm text-gray-400">
                    <p>Partner: Hello!</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-green-600 rounded-[5px]"><DollarSign size={16}/></button>
                    <RandomCamChat isConnected={isConnected} />
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
