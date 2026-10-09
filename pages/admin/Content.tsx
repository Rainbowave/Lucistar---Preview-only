
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Video, Image as ImageIcon, FileText, BookOpen, ShoppingBag,
    Smartphone, TrendingUp, Filter, Eye, DollarSign, Activity, LayoutGrid, Heart, Flame,
    HardDrive, Layers, BarChart2, Hash, Calendar, ArrowUpRight, Search, X,
    Radio, MonitorPlay, Clock, Trophy, MousePointerClick, Zap, Upload, Gamepad2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, Legend } from 'recharts';
import { db } from '../../services/db';
import { useNavigate } from 'react-router-dom';

const TagAnalyticsWidget = ({ allTags, onSelectTag, selectedTag }: { allTags: any[], onSelectTag: (tag: any) => void, selectedTag: any }) => {
    const [section, setSection] = useState('All');
    const [search, setSearch] = useState('');

    const filteredTags = useMemo(() => {
        let tags = allTags;
        if (section !== 'All') {
             tags = tags.filter(t => t.section === section || (section === 'Posts' && t.section === 'Posts'));
        }
        if (search) {
            tags = tags.filter(t => t.tag.toLowerCase().includes(search.toLowerCase()));
        }
        return tags;
    }, [allTags, section, search]);

    const SECTIONS = ['All', 'Posts', 'Photos', 'Shorts', 'Videos', 'Live'];

    return (
        <div className="xl:col-span-1 bg-card border border-border rounded-[5px] p-0 shadow-xl overflow-hidden h-[600px] flex flex-col">
            <div className="p-6 border-b border-border bg-background/50">
                <div className="flex items-center justify-between mb-4">
                     <h3 className="font-black text-white text-sm uppercase tracking-widest flex items-center gap-2">
                        <Hash size={16} className="text-gray-400" /> Tag Insights
                    </h3>
                </div>
                
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tags..." 
                        className="w-full bg-background border border-border rounded-[5px] py-2 pl-9 pr-4 text-xs text-white focus:border-primary outline-none"
                    />
                </div>
                
                {/* Section Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {SECTIONS.map(s => (
                        <button 
                            key={s} 
                            onClick={() => setSection(s)}
                            className={`px-3 py-1.5 rounded-[5px] text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${section === s ? 'bg-primary text-white border-primary' : 'bg-card text-gray-500 border-border hover:text-white'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead className="text-[9px] font-black text-gray-500 uppercase tracking-widest sticky top-0 z-10 bg-card/90 backdrop-blur-md">
                        <tr>
                            <th className="px-4 py-2">Tag Name</th>
                            <th className="px-4 py-2 text-right">Posts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTags.map((tag, i) => (
                            <tr 
                                key={i} 
                                onClick={() => onSelectTag(tag)}
                                className="group cursor-pointer"
                            >
                                <td className={`px-4 py-3 rounded-l-[5px] border-y border-l transition-all ${selectedTag?.tag === tag.tag ? 'bg-primary/20 border-primary/30' : 'bg-background/40 border-border group-hover:bg-background/80 group-hover:border-white/10'}`}>
                                    <div className="flex flex-col">
                                        <span className={`font-bold text-xs transition-colors ${selectedTag?.tag === tag.tag ? 'text-primary' : 'text-white'}`}>{tag.tag}</span>
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">{tag.section || 'General'}</span>
                                    </div>
                                </td>
                                <td className={`px-4 py-3 rounded-r-[5px] border-y border-r text-right transition-all relative overflow-hidden ${selectedTag?.tag === tag.tag ? 'bg-primary/20 border-primary/30' : 'bg-background/40 border-border group-hover:bg-background/80 group-hover:border-white/10'}`}>
                                    <div className="relative z-10">
                                        <span className="font-black text-white text-xs tabular-nums block">{(tag.posts).toLocaleString()}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-0.5 bg-primary/50" style={{ width: `${Math.min(100, (tag.posts / 5000) * 100)}%` }}></div>
                                </td>
                            </tr>
                        ))}
                        {filteredTags.length === 0 && (
                            <tr>
                                <td colSpan={2} className="px-6 py-8 text-center text-xs text-gray-500 font-bold uppercase tracking-widest">No tags found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const TagDetailPanel = ({ tag }: { tag: any }) => {
    const [timeRange, setTimeRange] = useState<'Day' | 'Week'>('Week');

    // Generate Chart Data based on Time Range - MOVED ABOVE CONDITIONAL RETURN
    const chartData = useMemo(() => {
        if (!tag) return [];

        if (timeRange === 'Week') {
            return [
                { name: 'Mon', heat: Math.floor(tag.heat * 0.4), posts: Math.floor(tag.posts * 0.1), views: Math.floor(tag.views * 0.2) },
                { name: 'Tue', heat: Math.floor(tag.heat * 0.5), posts: Math.floor(tag.posts * 0.2), views: Math.floor(tag.views * 0.3) },
                { name: 'Wed', heat: Math.floor(tag.heat * 0.45), posts: Math.floor(tag.posts * 0.15), views: Math.floor(tag.views * 0.25) },
                { name: 'Thu', heat: Math.floor(tag.heat * 0.7), posts: Math.floor(tag.posts * 0.3), views: Math.floor(tag.views * 0.5) },
                { name: 'Fri', heat: Math.floor(tag.heat * 0.9), posts: Math.floor(tag.posts * 0.4), views: Math.floor(tag.views * 0.7) },
                { name: 'Sat', heat: Math.floor(tag.heat * 1.0), posts: Math.floor(tag.posts * 0.5), views: Math.floor(tag.views * 0.9) },
                { name: 'Sun', heat: Math.floor(tag.heat * 0.8), posts: Math.floor(tag.posts * 0.25), views: Math.floor(tag.views * 0.6) },
            ];
        } else {
            // Day View (Hourly)
            return Array.from({ length: 12 }).map((_, i) => ({
                name: `${(i * 2).toString().padStart(2, '0')}:00`,
                heat: Math.floor(tag.heat * (0.05 + Math.random() * 0.1)),
                posts: Math.floor(tag.posts * (0.02 + Math.random() * 0.05)),
                views: Math.floor(tag.views * (0.05 + Math.random() * 0.1))
            }));
        }
    }, [tag, timeRange]);

    if (!tag) return (
        <div className="xl:col-span-2 bg-card border border-border rounded-[5px] p-6 shadow-xl h-[600px] flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-background rounded-full mb-4 text-gray-600 border border-border shadow-inner">
                <Hash size={48} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Select a Tag</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Choose from the left to inspect performance.</p>
        </div>
    );

    // Consolidated stats for the tag
    const stats = {
        posts: tag.posts,
        reach: tag.views,
        heat: tag.heat,
        prideUsers: Math.floor(tag.heat * 0.15) // Replaced string CTR with number
    };

    return (
        <div className="xl:col-span-2 bg-card border border-border rounded-[5px] p-8 shadow-xl h-[600px] flex flex-col relative overflow-hidden">
             {/* Header */}
             <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-2">{tag.tag}</h2>
                    <div className="flex items-center gap-3">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-[5px]">{tag.section} Context</span>
                         <div className="flex items-center gap-1.5 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Live Tracking
                         </div>
                    </div>
                </div>
            </div>

            {/* Single Container for Stats & Chart */}
            <div className="flex-1 bg-background/50 rounded-[5px] border border-border p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
                
                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-8 relative z-10">
                    <div className="bg-card/80 p-4 rounded-[5px] border border-border">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Posts</p>
                        <p className="text-2xl font-black text-white">{stats.posts.toLocaleString()}</p>
                    </div>
                    <div className="bg-card/80 p-4 rounded-[5px] border border-border">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Heat</p>
                        <p className="text-2xl font-black text-red-500">{stats.heat.toLocaleString()}</p>
                    </div>
                    <div className="bg-card/80 p-4 rounded-[5px] border border-border">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Total Reach</p>
                        <p className="text-2xl font-black text-blue-500">{(stats.reach / 1000).toFixed(1)}k</p>
                    </div>
                    <div className="bg-card/80 p-4 rounded-[5px] border border-border">
                        <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">Follow Users</p>
                        <p className="text-2xl font-black text-yellow-500">{stats.prideUsers.toLocaleString()}</p>
                    </div>
                </div>

                {/* Running Chart */}
                <div className="flex-1 w-full min-h-0 relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Running Statistics</h4>
                             <div className="flex bg-card rounded-[5px] p-0.5 border border-border">
                                 <button 
                                    onClick={() => setTimeRange('Day')} 
                                    className={`px-2 py-0.5 rounded-[5px] text-[8px] font-black uppercase tracking-widest transition-all ${timeRange === 'Day' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                 >
                                     1 Day
                                 </button>
                                 <button 
                                    onClick={() => setTimeRange('Week')} 
                                    className={`px-2 py-0.5 rounded-[5px] text-[8px] font-black uppercase tracking-widest transition-all ${timeRange === 'Week' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                                 >
                                     1 Week
                                 </button>
                             </div>
                        </div>
                        <div className="flex gap-4">
                            <span className="flex items-center gap-1 text-[9px] font-bold text-red-500"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Heat</span>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-orange-500"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Posts</span>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-blue-500"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> Views</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorHeat" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                            <Area type="monotone" dataKey="heat" stroke="#ef4444" fillOpacity={1} fill="url(#colorHeat)" strokeWidth={2} />
                            <Area type="monotone" dataKey="views" stroke="#3b82f6" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
                            <Area type="monotone" dataKey="posts" stroke="#f97316" fillOpacity={1} fill="url(#colorPosts)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

const SectionStatCard = ({ title, count, storage, views, icon: Icon, color }: any) => (
    <div className="bg-card border border-border p-5 rounded-[5px] flex flex-col justify-between h-full group hover:border-white/10 transition-all shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-[5px]`}>
                <Icon size={20} className={String(color).replace('bg-', 'text-')} />
            </div>
            <span className="text-2xl font-black text-white">{count}</span>
        </div>
        <div>
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{title}</h4>
            <div className="flex items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1"><HardDrive size={10} /> {storage}</span>
                <span className="flex items-center gap-1"><Eye size={10} /> {views}</span>
            </div>
        </div>
    </div>
);

export default function AdminContent() {
    const navigate = useNavigate();
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');
    const [uploadData, setUploadData] = useState<any[]>([]);
    const [tagData, setTagData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedTag, setSelectedTag] = useState<any>(null);

    useEffect(() => {
        const handleModeChange = () => {
             const mode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
             setAdminMode(mode);
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await new Promise(r => setTimeout(r, 600));

            // Generate Graph Data
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const mockUploads = days.map(day => ({
                name: day,
                Posts: 0,
                Photos: 0,
                Videos: 0,
                Shorts: 0,
                Live: 0,
                Comics: 0,
                Collection: 0
            }));
            setUploadData(mockUploads);

            // Generate Top Tags (Replaced random names with real-ish tags)
            const topTags: any[] = [];
            setTagData(topTags);
            
            // Auto select first tag
            if (topTags.length > 0) setSelectedTag(topTags[0]);

            setLoading(false);
        };
        loadData();
    }, [adminMode]);
    
    // Stats Array including Arcade
    const sectionStats = [
        { title: "Posts & Polls", count: "0", storage: "0B", views: "0", icon: FileText, color: "bg-gray-500" },
        { title: "Photos", count: "0", storage: "0B", views: "0", icon: ImageIcon, color: "bg-blue-500" },
        { title: "Videos", count: "0", storage: "0B", views: "0", icon: Video, color: "bg-red-500" },
        { title: "Shorts", count: "0", storage: "0B", views: "0", icon: Smartphone, color: "bg-purple-500" },
        { title: "Live Streams", count: "0", storage: "N/A", views: "0", icon: Radio, color: "bg-green-500" },
        { title: "Comics", count: "0", storage: "0B", views: "0", icon: BookOpen, color: "bg-yellow-500" },
        { title: "Collection", count: "0", storage: "0B", views: "0", icon: ShoppingBag, color: "bg-orange-500" },
        { title: "Knowledge", count: "0", storage: "0B", views: "0", icon: MonitorPlay, color: "bg-cyan-500" },
        { title: "Arcade", count: "0", storage: "N/A", views: "0", icon: Gamepad2, color: "bg-pink-500" },
    ];

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-32">
            
            {/* Header */}
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <LayoutGrid className="text-brand-500" size={32} />
                        Manager Overview
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Asset distribution and performance for <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span>.
                    </p>
                </div>
            </div>

            {/* 1. Section Stats (Grid of all manager sections) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
                {sectionStats.map((stat, i) => (
                    <SectionStatCard key={i} {...stat} />
                ))}
            </div>

            {/* 2. Upload Velocity Graph (Expanded) */}
            <div className="bg-card border border-border rounded-[5px] p-6 shadow-xl h-[400px] flex flex-col mb-10">
                <h3 className="font-black text-white text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Layers size={16} className="text-primary" /> Content Upload Velocity
                </h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={uploadData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                            <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '5px' }} 
                                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                cursor={{ fill: '#ffffff10' }}
                            />
                            <Legend wrapperStyle={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', paddingTop: '10px'}} />
                            <Bar dataKey="Posts" stackId="a" fill="#6b7280" radius={[0,0,0,0]} />
                            <Bar dataKey="Photos" stackId="a" fill="#3b82f6" />
                            <Bar dataKey="Shorts" stackId="a" fill="#a855f7" />
                            <Bar dataKey="Videos" stackId="a" fill="#ef4444" />
                            <Bar dataKey="Live" stackId="a" fill="#22c55e" />
                            <Bar dataKey="Comics" stackId="a" fill="#eab308" />
                            <Bar dataKey="Collection" stackId="a" fill="#f97316" radius={[4,4,0,0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* 3. Linked Tag Analytics */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left: Tag Selection List */}
                <TagAnalyticsWidget allTags={tagData} onSelectTag={setSelectedTag} selectedTag={selectedTag} />

                {/* Right: Detailed Analysis for Selected Tag */}
                <TagDetailPanel tag={selectedTag} />

            </div>
        </div>
    );
}
