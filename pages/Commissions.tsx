import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Palette, Search, Filter, Loader2, Plus } from 'lucide-react';
import { authService } from '../services/authService';
import { commissionsService, Commission } from '../services/commissionsService';
import { CommissionCard } from '../components/commissions/CommissionCard';
import { ContentHeader } from '../components/ContentHeader';
import { UserCard } from '../components/UserCard';

const COMMISSION_CATEGORIES = ['All', 'Digital Art', '3D Modeling', 'Video Editing', 'Writing', 'Music', 'Voice Acting', 'Programming'];

const MOCK_NAMES = [
  { display: 'Alex Rivera', username: 'arivera' },
  { display: 'Sarah Chen', username: 'schen_art' },
  { display: 'Marcus Thorne', username: 'mthorne' },
  { display: 'Elena Vance', username: 'evance' },
  { display: 'David Miller', username: 'dmiller' }
];

export default function Commissions() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const activeTab = tab || 'explore';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const user = authService.getCurrentUser();

  const getMockUser = (index: number) => {
    const nameData = MOCK_NAMES[index % MOCK_NAMES.length];
    return {
      id: `mock-usr-${index}`,
      displayName: nameData.display,
      username: nameData.username,
      avatarUrl: `https://picsum.photos/100/100?random=${index + 100}`,
      followers: 4200 + index * 10,
      following: 120,
      isVerified: true,
      isCreator: true,
      bio: "Open for professional requests!",
      isLuciStarPremium: index % 2 === 0
    };
  };

  useEffect(() => {
    const loadCommissions = async () => {
      setLoading(true);
      try {
        if (searchQuery) {
          const results = await commissionsService.searchCommissions(searchQuery);
          setCommissions(results);
        } else {
          const results = await commissionsService.getCommissions();
          setCommissions(results);
        }
      } catch (error) {
        console.error('Failed to load commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      loadCommissions();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleTabChange = (newTab: string) => {
    navigate(`/commissions/${newTab}`);
  };

  const filteredCommissions = useMemo(() => {
    let filtered = commissions;
    if (activeFilter !== 'All') {
      filtered = filtered.filter(c => c.category === activeFilter);
    }
    return filtered;
  }, [commissions, activeFilter]);

  return (
    <div className="flex flex-col min-h-screen bg-dark-850">
      <div className="flex-1 min-w-0 flex flex-col relative">
        <ContentHeader 
          title="Commissions"
          icon={Palette}
          stats={[
            { label: 'Active Services', value: '1.2K' },
            { label: 'Completed', value: '45.8K' }
          ]}
          userStats={[
            { label: 'My Orders', value: '12' },
            { label: 'Earnings', value: '$2.4K', color: 'text-brand-500' }
          ]}
          tags={COMMISSION_CATEGORIES.map(f => ({ id: f, label: f, count: Math.floor(Math.random() * 200).toString() }))}
          activeTag={activeFilter}
          onTagClick={setActiveFilter}
          onAddTag={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onCreateClick={() => {}}
          createLabel="Post Service"
          bgImage="https://picsum.photos/seed/commissions/1920/1080?blur=10"
        />

        <div className="p-4 md:p-10 pb-24 grid grid-cols-1 gap-8">
          {/* Tabs */}
          <nav className="flex items-center gap-6 border-b border-white/5">
            <button 
              onClick={() => handleTabChange('explore')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'explore' ? 'text-brand-500' : 'text-gray-500 hover:text-white'}`}
            >
              Explore Services
              {activeTab === 'explore' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 shadow-[0_0_10px_rgba(243,202,11,0.5)]"></span>}
            </button>
            <button 
              onClick={() => handleTabChange('my-orders')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === 'my-orders' ? 'text-brand-500' : 'text-gray-500 hover:text-white'}`}
            >
              My Active Orders
              {activeTab === 'my-orders' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-500 shadow-[0_0_10px_rgba(243,202,11,0.5)]"></span>}
            </button>
          </nav>

          {/* Content Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 size={48} className="text-brand-500 animate-spin" />
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-[repeat(auto-fill,minmax(300px,1fr))]' : 'grid-cols-1'}`}>
              {filteredCommissions.map((commission, index) => {
                return (
                  <CommissionCard key={commission.id} commission={commission} />
                );
              })}
            </div>
          )}

          {filteredCommissions.length === 0 && !loading && (
            <div className="py-20 text-center opacity-40">
              <Palette className="mx-auto mb-4 text-gray-500" size={48} />
              <p className="text-xs font-black uppercase tracking-widest text-gray-500">No commissions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
