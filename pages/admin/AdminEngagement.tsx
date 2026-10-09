
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    Trophy, BarChart2, Coins, Crown, Users, TrendingUp,
    Gift, AlertCircle, Save, Loader2, CheckCircle,
    Calendar, Flag, Heart, Eye, Activity,
    Image as ImageIcon, Video, Smartphone, BookOpen, ShoppingBag, Radio,
    Plus, Trash2, X, Settings, Hash, Search, Filter, Zap, CheckSquare,
    Medal, Star, Award
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { db } from '../../services/db';
import { ResizableContainer } from '../../components/ResizableContainer';

const TagStatCard = ({ label, value, icon: Icon, color }: any) => (
    <ResizableContainer>
        <div className="bg-card border border-border rounded-[5px] p-4 flex items-center justify-between h-full w-full">
            <div>
                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                <h4 className="text-xl font-black text-white">{value}</h4>
            </div>
            <div className={`p-2 rounded-[5px] ${String(color)} bg-opacity-10 border border-border/10`}>
                <Icon size={16} className={String(color).replace('bg-', 'text-')} />
            </div>
        </div>
    </ResizableContainer>
);

const ContestCard = ({ contest, onDelete }: any) => (
    <ResizableContainer>
        <div className="bg-card border border-border rounded-[5px] p-4 flex flex-col justify-between group hover:border-primary/30 transition-all h-full w-full">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[5px] bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-yellow-500 border border-yellow-500/30">
                        <Trophy size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">{contest.title}</h4>
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{contest.hashtag}</span>
                    </div>
                </div>
                <button onClick={() => onDelete(contest.id)} className="text-gray-500 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide border-b border-border pb-1">
                    <span>Reward Pool</span>
                    <span className="text-white">{contest.rewardPool} LSC</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                    <span>Ends</span>
                    <span className="text-white">{new Date(contest.endDate).toLocaleDateString()}</span>
                </div>
                 {contest.requirements && contest.requirements.length > 0 && (
                    <div className="pt-2">
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Requirements</p>
                        <div className="flex flex-wrap gap-1">
                            {contest.requirements.slice(0, 2).map((r: string, i: number) => (
                                <span key={i} className="text-[8px] bg-background px-1.5 py-0.5 rounded-[3px] text-gray-300 border border-border">{r}</span>
                            ))}
                            {contest.requirements.length > 2 && <span className="text-[8px] text-gray-500">+{contest.requirements.length - 2} more</span>}
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-[3px] ${contest.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-700/20 text-gray-500'}`}>
                    {contest.status}
                </span>
                <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-[8px] text-gray-500">
                            <Users size={10} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </ResizableContainer>
);

export default function AdminEngagement() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
    const [settings, setSettings] = useState<any>(null);
    const [pointsSettings, setPointsSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [adminMode, setAdminMode] = useState<string>(localStorage.getItem('admin_view_mode') || 'dating');

    // Empire Growth & Shares
    const [monthlyFee, setMonthlyFee] = useState(10);
    const [userSharePercent, setUserSharePercent] = useState(5);
    const [isAlpha, setIsAlpha] = useState(false);
    const [regEmail, setRegEmail] = useState('');
    const [regPhone, setRegPhone] = useState('');
    const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
    const [profitHistory, setProfitHistory] = useState<any[]>([]);

    // Contests State
    const [contests, setContests] = useState<any[]>([]);
    const [isCreateContestOpen, setIsCreateContestOpen] = useState(false);
    const [newContest, setNewContest] = useState({ 
        title: '', 
        hashtag: '#', 
        rewardPool: '', 
        days: 7, 
        description: '',
        requirements: [] as string[]
    });
    const [reqInput, setReqInput] = useState('');

    useEffect(() => {
        const handleModeChange = () => {
            setAdminMode(localStorage.getItem('admin_view_mode') || 'dating');
        };
        window.addEventListener('admin-mode-change', handleModeChange);

        const load = async () => {
            await new Promise(r => setTimeout(r, 600));
            setSettings(db.getSiteSettings());
            setPointsSettings(db.getPointsSettings());
            setContests(db.getChallenges());
            
            // Remove Mock Registered Users
            setRegisteredUsers([]);

            // Remove Mock Profit History
            setProfitHistory([]);

            setLoading(false);
        };
        load();
        
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        db.saveSiteSettings(settings);
        db.savePointsSettings(pointsSettings);
        setSuccess(true);
        setSaving(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleAddRequirement = () => {
        if (!reqInput.trim()) return;
        setNewContest(prev => ({ ...prev, requirements: [...prev.requirements, reqInput.trim()] }));
        setReqInput('');
    };

    const handleRemoveRequirement = (index: number) => {
        setNewContest(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }));
    };

    const handleCreateContest = () => {
        if (!newContest.title || !newContest.rewardPool) return;
        
        // Reward Pool Cap Check
        let pool = parseInt(newContest.rewardPool);
        if (pool > 5000) pool = 5000;

        const contestData = {
            title: newContest.title,
            hashtag: newContest.hashtag.startsWith('#') ? newContest.hashtag : `#${newContest.hashtag}`,
            rewardPool: pool,
            description: newContest.description,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + newContest.days * 86400000).toISOString(),
            requirements: newContest.requirements.length > 0 ? newContest.requirements : ['Must include tag', 'Original content'],
            participants: []
        };
        
        db.createChallenge(contestData);
        setContests(prev => [...prev, { ...contestData, id: Date.now(), status: 'active' }]);
        setIsCreateContestOpen(false);
        setNewContest({ title: '', hashtag: '#', rewardPool: '', days: 7, description: '', requirements: [] });
    };

    const handleDeleteContest = (id: number) => {
        if(confirm('Delete this contest?')) {
            setContests(prev => prev.filter(c => c.id !== id));
            // In real app, call db.deleteChallenge(id)
        }
    };

    // Helper to update Leaderboard Prizes
    const updateLeaderboardPrize = (place: 'first'|'second'|'third', value: string) => {
        const modeKey = adminMode === 'adult' ? 'naughty' : 'dating';
        const newSettings = { ...settings };
        if (!newSettings.leaderboard) newSettings.leaderboard = { dating: {}, naughty: {} };
        if (!newSettings.leaderboard[modeKey]) newSettings.leaderboard[modeKey] = {};
        
        newSettings.leaderboard[modeKey][place] = parseInt(value) || 0;
        setSettings(newSettings);
    };

    // Helper to update Points
    const updatePoints = (key: string, val: string) => {
        setPointsSettings({ ...pointsSettings, [key]: parseInt(val) || 0 });
    };

    if (loading || !settings) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

    // --- Dynamic Monetization Logic for Chart ---
    const AD_RATES = { banner: 0.40, popup: 1.50, video: 3.50, native: 0.80 };
    const getSectionMetrics = () => {
        const base = adminMode === 'adult' ? 1.5 : 1; 
        const isNaughty = adminMode === 'adult';
        const sections = [
            { name: 'Live', traffic: 450000 * base, color: '#ef4444', ads: ['video', 'banner'] },
            { name: 'Videos', traffic: 380000 * base, color: '#db2777', ads: ['video', 'banner', 'native'] },
            { name: 'Shorts', traffic: 340000 * base, color: '#ec4899', ads: ['popup', 'native'] },
            { name: 'Photos', traffic: 210000 * base, color: '#3b82f6', ads: ['banner', 'popup'] },
            { name: 'Polls', traffic: 180000 * base, color: '#eab308', ads: ['native'] },
            { name: 'Comics', traffic: 125000 * base, color: '#8b5cf6', ads: ['banner'] },
            { name: 'Collections', traffic: 42000 * base, color: '#10b981', ads: ['native'] },
        ];
        return sections.map(sec => {
            let blendedCPM = 0;
            sec.ads.forEach((adType: any) => blendedCPM += (AD_RATES as any)[adType] || 0);
            if (isNaughty) blendedCPM *= 1.2;
            return { ...sec, revenue: (sec.traffic / 1000) * blendedCPM, cpm: blendedCPM };
        });
    };
    const sectionMetrics = getSectionMetrics();
    const totalRevenue = sectionMetrics.reduce((acc, curr) => acc + curr.revenue, 0);

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-32">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <Heart className="text-brand-500" size={32} />
                        Engagement Manager
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Gamification, Contests, and Community Economics ({adminMode.toUpperCase()}).
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-dark-800 p-1 rounded-xl border border-dark-700">
                        {['overview', 'leaderboard', 'contests', 'empire'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                            >
                                {tab === 'empire' ? 'Empire Growth' : tab}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="bg-brand-600 hover:bg-brand-500 text-white font-black py-2 px-6 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-[10px]"
                    >
                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Save Config
                    </button>
                </div>
            </div>

            {success && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 mb-8 flex items-center gap-3 text-green-400 animate-in fade-in">
                    <CheckCircle size={20} />
                    <span className="font-bold">Engagement configuration updated successfully.</span>
                </div>
            )}
            
            {/* --- OVERVIEW --- */}
            {activeTab === 'overview' && (
                 <div className="space-y-8 animate-in slide-in-from-bottom-4">
                     {/* System Activity */}
                     <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                                                  <h3 className="font-black text-white text-lg uppercase mb-4 flex items-center gap-2"><Trophy size={20} className="text-blue-500"/> Contest Analytics</h3>
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <TagStatCard label="Active Contests" value={contests.filter(c=>c.status==='active').length} icon={Flag} color="bg-orange-500" />
                             <TagStatCard label="Total Votes" value="0" icon={BarChart2} color="bg-purple-500" />
                             <TagStatCard label="Ad Revenue (Est)" value={`${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} LSC`} icon={Coins} color="bg-green-500" />
                             <TagStatCard label="Ad Impressions" value={`${(sectionMetrics.reduce((a,c)=>a+c.traffic,0)/1000000).toFixed(1)}M`} icon={Eye} color="bg-blue-500" />
                         </div>
                     </div>

                     {/* Traffic & Contest Charts */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col h-[500px]">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                                    <Eye size={16} className="text-blue-500" /> Traffic Distribution
                                </h3>
                            </div>
                            <div className="flex-1 w-full min-h-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sectionMetrics} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                        <XAxis type="number" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                        <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={70} />
                                        <Tooltip 
                                            cursor={{fill: '#27272a'}} 
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }} 
                                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} 
                                            formatter={(value) => `${Number(value).toLocaleString()} Visits`} 
                                        />
                                        <Bar dataKey="traffic" radius={[0, 4, 4, 0]} barSize={20}>
                                            {sectionMetrics.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-[500px] flex flex-col">
                            <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2 mb-6">
                                <BarChart2 size={16} className="text-brand-500" /> Contest Participation
                            </h3>
                            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm font-bold bg-dark-900/30 rounded-lg border border-dashed border-dark-700">
                                [Dynamic Contest Diagram Placeholder]
                            </div>
                        </div>
                     </div>

                     {/* Leaderboard History */}
                     <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                        <h3 className="font-black text-white text-lg uppercase mb-4 flex items-center gap-2">
                            <Crown size={20} className="text-yellow-500"/> Leaderboard History
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Previous Leaderboard */}
                            <div>
                                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Previous Week</h4>
                                <div className="overflow-hidden rounded-xl border border-white/5 bg-dark-900/30">
                                    <table className="w-full text-left">
                                        <thead className="bg-dark-900 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <tr>
                                                <th className="p-3">Rank</th>
                                                <th className="p-3">User</th>
                                                <th className="p-3 text-right">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm font-bold text-gray-300">
                                            {/* Removed mock previous leaderboard data */}
                                            {[]}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/* Current Leaderboard */}
                            <div>
                                <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Current Week</h4>
                                <div className="overflow-hidden rounded-xl border border-white/5 bg-dark-900/30">
                                    <table className="w-full text-left">
                                        <thead className="bg-dark-900 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                            <tr>
                                                <th className="p-3">Rank</th>
                                                <th className="p-3">User</th>
                                                <th className="p-3 text-right">Score</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5 text-sm font-bold text-gray-300">
                                            {/* Removed mock current leaderboard data */}
                                            {[]}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
            )}

            {/* --- LEADERBOARD --- */}
            {activeTab === 'leaderboard' && (
                <div className="space-y-10 animate-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <ResizableContainer>
                            <div className="bg-card border border-border rounded-[5px] p-8 shadow-xl h-full flex flex-col items-center text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500"></div>
                                <div className="w-20 h-20 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 border border-yellow-500/20 group-hover:scale-110 transition-transform">
                                    <Trophy size={40} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Gold Tier</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Ranks 1 - 3</p>
                                
                                <div className="w-full space-y-4 mt-auto">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={settings.leaderboard?.[adminMode === 'adult' ? 'naughty' : 'dating']?.first || 0}
                                            onChange={(e) => updateLeaderboardPrize('first', e.target.value)}
                                            className="w-full bg-background border border-border rounded-[5px] px-4 py-3 text-white font-black text-2xl outline-none focus:border-primary text-center"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase">LSC</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Weekly Reward Pool</p>
                                </div>
                            </div>
                        </ResizableContainer>

                        <ResizableContainer>
                            <div className="bg-card border border-border rounded-[5px] p-8 shadow-xl h-full flex flex-col items-center text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gray-400"></div>
                                <div className="w-20 h-20 rounded-full bg-gray-400/10 flex items-center justify-center text-gray-400 mb-4 border border-gray-400/20 group-hover:scale-110 transition-transform">
                                    <Medal size={40} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Silver Tier</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Ranks 4 - 20</p>
                                
                                <div className="w-full space-y-4 mt-auto">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={settings.leaderboard?.[adminMode === 'adult' ? 'naughty' : 'dating']?.second || 0}
                                            onChange={(e) => updateLeaderboardPrize('second', e.target.value)}
                                            className="w-full bg-background border border-border rounded-[5px] px-4 py-3 text-white font-black text-2xl outline-none focus:border-primary text-center"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase">LSC</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Weekly Reward Pool</p>
                                </div>
                            </div>
                        </ResizableContainer>

                        <ResizableContainer>
                            <div className="bg-card border border-border rounded-[5px] p-8 shadow-xl h-full flex flex-col items-center text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-orange-500"></div>
                                <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 border border-orange-500/20 group-hover:scale-110 transition-transform">
                                    <Award size={40} />
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1">Bronze Tier</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Ranks 21 - 50</p>
                                
                                <div className="w-full space-y-4 mt-auto">
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={settings.leaderboard?.[adminMode === 'adult' ? 'naughty' : 'dating']?.third || 0}
                                            onChange={(e) => updateLeaderboardPrize('third', e.target.value)}
                                            className="w-full bg-background border border-border rounded-[5px] px-4 py-3 text-white font-black text-2xl outline-none focus:border-primary text-center"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase">LSC</span>
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Weekly Reward Pool</p>
                                </div>
                            </div>
                        </ResizableContainer>
                    </div>

                    <ResizableContainer>
                        <div className="bg-card border border-border rounded-[5px] p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-black text-white text-lg uppercase tracking-tighter flex items-center gap-2">
                                    <Star className="text-primary" size={20}/> Current Leaders Preview
                                </h3>
                                <div className="flex gap-2">
                                    <div className="px-3 py-1 rounded-[5px] bg-background border border-border text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        {adminMode.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-hidden rounded-[5px] border border-border">
                                <table className="w-full text-left">
                                    <thead className="bg-background text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-border">
                                        <tr>
                                            <th className="p-4">Rank</th>
                                            <th className="p-4">User</th>
                                            <th className="p-4 text-right">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border text-sm font-bold text-gray-300">
                                        {/* Removed mock current leaders preview */}
                                        {[]}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ResizableContainer>
                </div>
            )}

            {/* --- CONTESTS --- */}
            {activeTab === 'contests' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-black text-white text-lg uppercase  tracking-tight flex items-center gap-2">
                            <Flag className="text-orange-500" size={20}/> Active Campaigns
                        </h3>
                        <button 
                            onClick={() => setIsCreateContestOpen(!isCreateContestOpen)}
                            className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-brand-500 hover:text-white transition-all flex items-center gap-2"
                        >
                            <Plus size={14} /> Create Contest
                        </button>
                    </div>

                    {isCreateContestOpen && (
                        <div className="bg-dark-800 border border-brand-500/50 rounded-2xl p-6 shadow-2xl mb-8 animate-in fade-in slide-in-from-top-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Title</label>
                                    <input type="text" value={newContest.title} onChange={e => setNewContest({...newContest, title: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" placeholder="e.g. Summer Vibes" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Hashtag</label>
                                    <input type="text" value={newContest.hashtag} onChange={e => setNewContest({...newContest, hashtag: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" placeholder="#summer" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Reward Pool (LSC)</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            max="5000"
                                            value={newContest.rewardPool} 
                                            onChange={e => setNewContest({...newContest, rewardPool: e.target.value})} 
                                            className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" 
                                            placeholder="5000" 
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-500 uppercase">Max 5000</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Duration (Days)</label>
                                    <input type="number" value={newContest.days} onChange={e => setNewContest({...newContest, days: parseInt(e.target.value)})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500" placeholder="7" />
                                </div>

                                {/* Dynamic Requirements */}
                                <div className="md:col-span-2">
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Requirements</label>
                                     <div className="flex gap-2 mb-3">
                                         <input 
                                             type="text" 
                                             value={reqInput}
                                             onChange={(e) => setReqInput(e.target.value)}
                                             placeholder="e.g. Must include video..." 
                                             className="flex-1 bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-bold outline-none focus:border-brand-500"
                                             onKeyDown={(e) => e.key === 'Enter' && handleAddRequirement()}
                                         />
                                         <button onClick={handleAddRequirement} className="bg-dark-700 hover:bg-dark-600 text-white px-4 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                                             <Plus size={14} /> Add
                                         </button>
                                     </div>
                                     <div className="flex flex-wrap gap-2">
                                         {newContest.requirements.map((req, idx) => (
                                             <div key={idx} className="flex items-center gap-2 bg-dark-900 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300">
                                                 <CheckSquare size={12} className="text-brand-500" />
                                                 {req}
                                                 <button onClick={() => handleRemoveRequirement(idx)} className="text-gray-500 hover:text-red-500 ml-1"><X size={12}/></button>
                                             </div>
                                         ))}
                                         {newContest.requirements.length === 0 && <span className="text-[10px] text-gray-500  px-1">No requirements added yet.</span>}
                                     </div>
                                </div>

                                <div className="md:col-span-2">
                                     <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Description</label>
                                     <textarea value={newContest.description} onChange={e => setNewContest({...newContest, description: e.target.value})} className="w-full bg-dark-900 border border-white/10 rounded-lg p-3 text-white text-sm font-medium outline-none focus:border-brand-500 h-24 resize-none" placeholder="Contest rules and details..."></textarea>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsCreateContestOpen(false)} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white">Cancel</button>
                                <button onClick={handleCreateContest} className="px-6 py-2 bg-brand-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-brand-500">Launch</button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {contests.map(contest => (
                            <ContestCard key={contest.id} contest={contest} onDelete={handleDeleteContest} />
                        ))}
                        {contests.length === 0 && <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest border-2 border-dashed border-dark-700 rounded-xl">No active contests.</div>}
                    </div>
                </div>
            )}

            {/* --- EMPIRE GROWTH --- */}
            {activeTab === 'empire' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4">
                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Daily Profit</p>
                            <h3 className="text-2xl font-black text-white">0.00 LSC</h3>
                            <p className="text-[10px] text-green-500 font-bold mt-2">+0.0% from yesterday</p>
                        </div>
                        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Weekly Profit</p>
                            <h3 className="text-2xl font-black text-white">0.00 LSC</h3>
                            <p className="text-[10px] text-green-500 font-bold mt-2">+0.0% from last week</p>
                        </div>
                        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Shareholders</p>
                            <h3 className="text-2xl font-black text-white">{registeredUsers.length}</h3>
                            <p className="text-[10px] text-gray-500 font-bold mt-2">{registeredUsers.filter(u => u.isAlpha).length} Alpha Members</p>
                        </div>
                        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Avg. Share %</p>
                            <h3 className="text-2xl font-black text-brand-500">
                                {(registeredUsers.reduce((acc, u) => acc + u.share, 0) / registeredUsers.length).toFixed(1)}%
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold mt-2">Across all active users</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left: Charts & Lists */}
                        <div className="xl:col-span-2 space-y-8">
                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-[400px]">
                                <h3 className="font-black text-white text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-green-500" /> Profit Growth History
                                </h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={profitHistory}>
                                        <defs>
                                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                        <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-[300px]">
                                    <h3 className="font-black text-white text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <Users size={16} className="text-blue-500" /> Users & Profit Share
                                    </h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={registeredUsers.filter(u => u.username)}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                            <XAxis dataKey="username" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                            <Bar dataKey="share" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-[300px]">
                                    <h3 className="font-black text-white text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                        <Coins size={16} className="text-yellow-500" /> Revenue Distribution
                                    </h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={registeredUsers.filter(u => u.username).map(u => ({ name: u.username, value: u.revenue }))}
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {registeredUsers.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden shadow-xl">
                                <div className="p-6 border-b border-dark-700 flex justify-between items-center">
                                    <h3 className="font-black text-white text-sm uppercase tracking-wider">Registered Shareholders</h3>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{registeredUsers.length} Active</span>
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-dark-900 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-dark-700">
                                        <tr>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Share %</th>
                                            <th className="px-6 py-4">Revenue</th>
                                            <th className="px-6 py-4">Profit</th>
                                            <th className="px-6 py-4 text-right">Registration Link</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-dark-700">
                                        {registeredUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-dark-900 border border-dark-700 flex items-center justify-center text-gray-500">
                                                            <Users size={14} />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-white flex items-center gap-2">
                                                                {u.username || <span className="text-gray-600">Pending...</span>}
                                                                {u.isAlpha && <Crown size={12} className="text-yellow-500" />}
                                                            </div>
                                                            <div className="text-[10px] text-gray-500">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-white">{u.share}%</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-white">{u.revenue.toLocaleString()} LSC</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-black text-green-500">{(u.revenue * (u.share/100)).toLocaleString()} LSC</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => {
                                                            const link = `${window.location.origin}/register?token=${u.id}&ref=admin`;
                                                            navigator.clipboard.writeText(link);
                                                            alert('Registration link copied to clipboard!');
                                                        }}
                                                        className="text-[10px] font-black text-brand-500 uppercase tracking-widest hover:underline"
                                                    >
                                                        Copy Link
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right: Registration & Config */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                                <h3 className="font-black text-white text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Plus size={16} className="text-brand-500" /> New Shareholder
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={regEmail}
                                            onChange={(e) => setRegEmail(e.target.value)}
                                            placeholder="user@example.com"
                                            className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-brand-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 block">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={regPhone}
                                            onChange={(e) => setRegPhone(e.target.value)}
                                            placeholder="+1 234 567 890"
                                            className="w-full bg-dark-900 border border-dark-700 rounded-xl py-3 px-4 text-sm text-white outline-none focus:border-brand-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-dark-900 rounded-xl border border-dark-700">
                                        <input 
                                            type="checkbox" 
                                            checked={isAlpha}
                                            onChange={(e) => setIsAlpha(e.target.checked)}
                                            className="w-4 h-4 accent-brand-500"
                                        />
                                        <span className="text-xs font-bold text-white uppercase tracking-tight">Alpha Tier (Up to 20%)</span>
                                    </div>
                                    <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-3 rounded-xl uppercase tracking-widest text-xs transition-all">
                                        Send Registration Link
                                    </button>
                                </div>
                            </div>

                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl">
                                <h3 className="font-black text-white text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                    <Coins size={16} className="text-yellow-500" /> Monthly Fee (LSC)
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Base Fee</label>
                                            <span className="text-xs font-black text-white">{monthlyFee} LSC</span>
                                        </div>
                                        <input 
                                            type="range" min="1" max="100" 
                                            value={monthlyFee}
                                            onChange={(e) => setMonthlyFee(parseInt(e.target.value))}
                                            className="w-full accent-brand-500" 
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Profit Share</label>
                                            <span className="text-xs font-black text-white">{userSharePercent}%</span>
                                        </div>
                                        <input 
                                            type="range" min="1" max={isAlpha ? 20 : 10} 
                                            value={userSharePercent}
                                            onChange={(e) => setUserSharePercent(parseInt(e.target.value))}
                                            className="w-full accent-brand-500" 
                                        />
                                        {!isAlpha && userSharePercent >= 10 && (
                                            <p className="text-[9px] text-yellow-500 mt-1 font-bold">Max 10% for standard users. Upgrade to Alpha for 20%.</p>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-dark-700">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Total Price</span>
                                            <span className="text-xl font-black text-white">{(monthlyFee * (1 + userSharePercent/100)).toFixed(2)} LSC</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">User Share</span>
                                            <span className="text-sm font-black text-brand-500">{(monthlyFee * (userSharePercent/100)).toFixed(2)} LSC</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
