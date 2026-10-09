
import React, { useState, useEffect } from 'react';
import { 
    Coins, Activity, 
    Crown, TrendingUp, ImageIcon,
    Smartphone, BookOpen, ShoppingBag, Heart, Flame,
    BarChart2, Video, Radio, Eye
} from 'lucide-react';
import { IconDice } from '../../components/GamifiedIcons';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db } from '../../services/db';
import { ResizableContainer } from '../../components/ResizableContainer';

import { useLanguage } from '../../hooks/LanguageContext';

import { StatCard } from '../../components/admin/StatCard';

export default function AdminDashboard() {
    const { t, setLanguage, language } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'traffic'|'revenue'>('revenue');
    const [realTrafficData, setRealTrafficData] = useState<any[]>([]);
    
    // Interactive State
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');
    const [isCustomizing, setIsCustomizing] = useState(false);

    // Layout State
    const [layout, setLayout] = useState<Record<string, { size: any, position: any }>>(() => {
        const saved = localStorage.getItem('admin_dashboard_layout');
        return saved ? JSON.parse(saved) : {};
    });

    const handleLayoutChange = (id: string, size: any, position: any) => {
        const newLayout = {
            ...layout,
            [id]: { size, position }
        };
        setLayout(newLayout);
        localStorage.setItem('admin_dashboard_layout', JSON.stringify(newLayout));
    };

    const resetLayout = () => {
        setLayout({});
        localStorage.removeItem('admin_dashboard_layout');
    };

    useEffect(() => {
        // Listen to global context change from Sidebar
        const handleModeChange = () => {
            const mode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
            setAdminMode(mode);
            setRealTrafficData(generateTraffic(mode)); 
        };
        
        window.addEventListener('admin-mode-change', handleModeChange);
        
        // Initial Load
        setRealTrafficData(generateTraffic(adminMode));
        
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, [adminMode]);

    // Generate realistic traffic data curve (24h) based on mode
    const generateTraffic = (mode: string) => {
        const data = [];
        const base = mode === 'naughty' ? 8000 : 5000; 
        for (let i = 0; i < 24; i++) {
            const amplitude = 3000;
            const noise = Math.random() * 500 - 250;
            const hourValue = Math.sin(((i - 8) / 24) * 2 * Math.PI) * amplitude + base + noise;
            
            data.push({
                name: `${i.toString().padStart(2, '0')}:00`,
                uv: Math.max(1000, Math.floor(hourValue)), 
                pv: Math.max(2000, Math.floor(hourValue * 1.5 + (Math.random() * 500))), 
            });
        }
        return data;
    };
    
    // Dynamic Section Visitors based on Mode
    const getSectionVisitors = () => {
        const base = adminMode === 'naughty' ? 1.5 : 1;
        return [
            { name: 'Live', value: 450000 * base, color: '#ef4444' },
            { name: 'Videos', value: 380000 * base, color: '#db2777' },
            { name: 'Shorts', value: 340000 * base, color: '#ec4899' },
            { name: 'Photos', value: 210000 * base, color: '#3b82f6' },
            { name: 'Polls', value: 180000 * base, color: '#eab308' },
            { name: 'Comics', value: 125000 * base, color: '#8b5cf6' },
            { name: 'Collections', value: 42000 * base, color: '#10b981' },
        ];
    };

    const defaultLayout = [
        { i: 'stat1', x: 0, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
        { i: 'stat2', x: 2, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
        { i: 'stat3', x: 4, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
        { i: 'stat4', x: 6, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
        { i: 'stat5', x: 8, y: 0, w: 2, h: 1, minW: 2, minH: 1 },
        { i: 'chart1', x: 0, y: 1, w: 10, h: 4, minW: 4, minH: 3 },
        { i: 'chart2', x: 0, y: 5, w: 5, h: 3, minW: 3, minH: 2 },
        { i: 'chart3', x: 5, y: 5, w: 5, h: 3, minW: 3, minH: 2 }
    ];

    return (
        <div className="p-4 sm:p-6 max-w-[1800px] mx-auto min-h-screen flex flex-col gap-6 sm:gap-8 animate-in fade-in">
            
            {/* 1. Header / KPI Section */}
            <div>
                 <div className="flex items-center gap-4 mb-6 justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{t('dashboard')}</h1>
                        <div className="flex items-center gap-2">
                            <select value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-card text-white text-xs p-1 rounded-[5px] border border-border">
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="ar">العربية</option>
                            </select>
                            <span className={`px-3 py-1 rounded-[5px] text-[10px] font-black uppercase tracking-widest border ${adminMode === 'dating' ? 'bg-brand-second/10 text-brand-second border-brand-second/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                {adminMode} Context
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsCustomizing(!isCustomizing)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${isCustomizing ? 'bg-primary text-black shadow-[0_0_15px_rgba(252,131,71,0.4)]' : 'bg-card text-gray-400 border border-border hover:text-white'}`}
                        >
                            {isCustomizing ? 'Finish Customizing' : 'Customize Layout'}
                        </button>
                        {isCustomizing && (
                            <button 
                                onClick={resetLayout}
                                className="px-4 py-2 rounded-[5px] text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                            >
                                Reset Layout
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <ResizableContainer 
                            id="stat-revenue"
                            canInteract={isCustomizing}
                            initialSize={layout['stat-revenue']?.size}
                            initialPosition={layout['stat-revenue']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('stat-revenue', s, p)}
                        >
                            <StatCard 
                                title="Total Revenue" 
                                value={adminMode === 'dating' ? "4.5M LSC" : "12.8M LSC"} 
                                icon={Coins} 
                                color="bg-green-600" 
                                trend="up" 
                                trendValue={adminMode === 'dating' ? "8.4%" : "14.2%"} 
                            />
                        </ResizableContainer>
                        <ResizableContainer 
                            id="stat-daily"
                            canInteract={isCustomizing}
                            initialSize={layout['stat-daily']?.size}
                            initialPosition={layout['stat-daily']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('stat-daily', s, p)}
                        >
                            <StatCard 
                                title="Daily Earnings" 
                                value={adminMode === 'dating' ? "124K LSC" : "315K LSC"} 
                                icon={TrendingUp} 
                                color="bg-yellow-500" 
                                trend="up" 
                                trendValue={adminMode === 'dating' ? "15%" : "22%"} 
                            />
                        </ResizableContainer>
                        <ResizableContainer 
                            id="stat-signups"
                            canInteract={isCustomizing}
                            initialSize={layout['stat-signups']?.size}
                            initialPosition={layout['stat-signups']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('stat-signups', s, p)}
                        >
                            <StatCard 
                                title="New Signups" 
                                value={adminMode === 'dating' ? "1,292" : "2,450"} 
                                icon={IconDice} 
                                color="bg-blue-600" 
                                trend="up" 
                                trendValue="5%" 
                            />
                        </ResizableContainer>
                        <ResizableContainer 
                            id="stat-subs"
                            canInteract={isCustomizing}
                            initialSize={layout['stat-subs']?.size}
                            initialPosition={layout['stat-subs']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('stat-subs', s, p)}
                        >
                            <StatCard 
                                title="Active Subs" 
                                value={adminMode === 'dating' ? "8,904" : "15,200"} 
                                icon={Crown} 
                                color="bg-purple-600" 
                                trend={adminMode === 'dating' ? "up" : "flat"} 
                                trendValue="Stable" 
                            />
                        </ResizableContainer>
                        <ResizableContainer 
                            id="stat-engagement"
                            canInteract={isCustomizing}
                            initialSize={layout['stat-engagement']?.size}
                            initialPosition={layout['stat-engagement']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('stat-engagement', s, p)}
                        >
                            <StatCard 
                                title="Poll Engagement" 
                                value={adminMode === 'dating' ? "45.2K" : "89.5K"} 
                                icon={BarChart2} 
                                color="bg-orange-500" 
                                trend="up" 
                                trendValue="12%" 
                            />
                        </ResizableContainer>

                    <div className={`lg:col-span-5`}>
                        <ResizableContainer 
                            id="chart-performance"
                            canInteract={isCustomizing}
                            initialSize={layout['chart-performance']?.size}
                            initialPosition={layout['chart-performance']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('chart-performance', s, p)}
                        >
                            <div className="bg-card border border-border p-6 rounded-[5px] flex flex-col h-full shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-white text-lg uppercase tracking-tight">Platform Performance (24h)</h3>
                                    <div className="flex bg-background p-1 rounded-[5px] border border-border">
                                        {['revenue', 'traffic'].map(tab => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab as any)}
                                                className={`px-4 py-1.5 rounded-[5px] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={realTrafficData}>
                                            <defs>
                                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={activeTab === 'revenue' ? '#10b981' : '#fc8347'} stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor={activeTab === 'revenue' ? '#10b981' : '#fc8347'} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                            <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '5px' }} itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} />
                                            <Area type="monotone" dataKey={activeTab === 'revenue' ? 'pv' : 'uv'} stroke={activeTab === 'revenue' ? '#10b981' : '#fc8347'} fill="url(#colorUv)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </ResizableContainer>
                    </div>
                    
                    <div className={`lg:col-span-2`}>
                        <ResizableContainer 
                            id="card-economics"
                            canInteract={isCustomizing}
                            initialSize={layout['card-economics']?.size}
                            initialPosition={layout['card-economics']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('card-economics', s, p)}
                        >
                            <div className="bg-card border border-border p-6 rounded-[5px] shadow-xl h-full">
                                <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                        <BarChart2 size={20} className="text-primary" /> Poll Economics
                                    </h3>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-[5px] ${adminMode === 'dating' ? 'bg-brand-second/10 text-brand-second' : 'bg-primary/10 text-primary'}`}>
                                        {adminMode.toUpperCase()} ACTIVITY
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="bg-background/50 p-4 rounded-[5px] border border-white/5">
                                         <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Win Pool Volume</div>
                                         <div className="text-2xl text-white font-black">{adminMode === 'dating' ? '450K' : '820K'} LSC</div>
                                     </div>
                                     <div className="bg-background/50 p-4 rounded-[5px] border border-white/5">
                                         <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Fee Revenue (Site)</div>
                                         <div className="text-2xl text-green-500 font-black">{adminMode === 'dating' ? '45K' : '90K'} LSC</div>
                                     </div>
                                     <div className="bg-background/50 p-4 rounded-[5px] border border-white/5">
                                         <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Engagement Share</div>
                                         <div className="text-2xl text-blue-400 font-black">{adminMode === 'dating' ? '22.5K' : '45K'} LSC</div>
                                     </div>
                                     <div className="bg-background/50 p-4 rounded-[5px] border border-white/5">
                                         <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Active Tickets</div>
                                         <div className="text-2xl text-white font-black">{adminMode === 'dating' ? '8,500' : '15,200'}</div>
                                     </div>
                                </div>
                            </div>
                        </ResizableContainer>
                    </div>

                    <div className={`lg:col-span-3`}>
                        <ResizableContainer 
                            id="chart-visitors"
                            canInteract={isCustomizing}
                            initialSize={layout['chart-visitors']?.size}
                            initialPosition={layout['chart-visitors']?.position}
                            onLayoutChange={(s, p) => handleLayoutChange('chart-visitors', s, p)}
                        >
                            <div className="bg-card border border-border rounded-[5px] p-6 shadow-xl h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-black text-white text-sm uppercase  tracking-wider flex items-center gap-2">
                                        <Eye size={16} className="text-blue-500" /> Section Visitors
                                    </h3>
                                </div>
                                <div className="flex-1 w-full min-h-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={getSectionVisitors()} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                                            <XAxis type="number" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                            <YAxis dataKey="name" type="category" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={70} />
                                            <Tooltip cursor={{fill: '#27272a'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '5px' }} itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }} formatter={(value) => `${Number(value).toLocaleString()} Visits`} />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                                {getSectionVisitors().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </ResizableContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
