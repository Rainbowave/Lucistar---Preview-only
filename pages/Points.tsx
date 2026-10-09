
import React, { useState, useEffect } from 'react';
import { 
    Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, 
    CreditCard, Settings, RefreshCw, Shield, Lock, 
    Users, MapPin, Activity, Calendar, Download, 
    ChevronDown, ChevronUp, Plus, Send, Zap,
    Play, Image, MessageCircle, Gift, LayoutGrid,
    CheckCircle, X, Search, Globe, Smartphone,
    PieChart, DollarSign, Database, Loader2, Coins,
    Crown, ShoppingBag, BarChart2, Save, FileText,
    Target, Award, Terminal, Video, ChevronLeft, ChevronRight, Star,
    Medal, Flame, Heart, Radio, Sparkles, Gamepad2, Palette
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// --- Types ---

type Tab = 'STATISTICS' | 'VAULT';
type HistoryFilter = 'ALL' | 'POINTS IN' | 'POINTS OUT';

interface Transaction {
    id: string;
    type: string;
    source: string;
    amount: number;
    status: 'Completed' | 'Pending' | 'Failed';
    date: string;
    refId: string;
}

// --- Mock Data ---

const performanceData = [
    { date: 'Mon', revenue: 12500 },
    { date: 'Tue', revenue: 18200 },
    { date: 'Wed', revenue: 15400 },
    { date: 'Thu', revenue: 22100 },
    { date: 'Fri', revenue: 28500 },
    { date: 'Sat', revenue: 35200 },
    { date: 'Sun', revenue: 31800 },
];

const audienceData = [
    { name: '18-24', value: 35 },
    { name: '25-34', value: 45 },
    { name: '35-44', value: 15 },
    { name: '45+', value: 5 },
];

const mockTransactions: (Transaction & { image?: string })[] = [];

// --- Sub-Components ---

const VaultDashboard = () => (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-800 to-dark-900 border border-white/10 shadow-2xl mb-8 group">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 p-8 space-y-8">
            
            {/* Header: Rank & Global Progress */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
                <div className="flex items-center gap-6">
                     <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-brand-900/20 transform group-hover:scale-105 transition-transform duration-500">
                        <Crown size={40} fill="currentColor" />
                     </div>
                     <div>
                         <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-1">Diamond Hands</h2>
                         <div className="flex items-center gap-3">
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Top 5%</span>
                         </div>
                     </div>
                </div>

                <div className="w-full md:max-w-md">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Activity size={12}/> Level</span>
                        <span className="text-sm font-black text-white tabular-nums">3,450 <span className="text-gray-600">/</span> 5,000 XP</span>
                    </div>
                    <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                        <div className="h-full bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 w-[69%] shadow-[0_0_20px_rgba(161,10,57,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Unified Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* 1. Skill Levels (XP Breakdown) */}
                <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Star size={12} /> Skills
                    </h4>
                    
                    {/* Create */}
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Image size={16} /></div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-white uppercase">Create</span>
                                <span className="text-[9px] font-bold text-blue-400 tabular-nums">1,500 / 2,500</span>
                            </div>
                            <div className="h-1.5 bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[60%]"></div></div>
                        </div>
                    </div>

                    {/* Social */}
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><MessageCircle size={16} /></div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-white uppercase">Social</span>
                                <span className="text-[9px] font-bold text-purple-400 tabular-nums">1,250 / 1,500</span>
                            </div>
                            <div className="h-1.5 bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[83%]"></div></div>
                        </div>
                    </div>

                    {/* Play */}
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Gamepad2 size={16} /></div>
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-[10px] font-black text-white uppercase">Play</span>
                                <span className="text-[9px] font-bold text-yellow-400 tabular-nums">700 / 1,000</span>
                            </div>
                            <div className="h-1.5 bg-dark-950 rounded-full overflow-hidden"><div className="h-full bg-yellow-500 w-[70%]"></div></div>
                        </div>
                    </div>
                </div>

                {/* 2. Impact Metrics */}
                <div className="space-y-4">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Heart size={12} /> Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-dark-900/40 rounded-xl border border-white/5 text-center">
                            <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Heat</span>
                            <div className="flex items-center justify-center gap-1 text-xl font-black text-white">
                                24.5K <Flame size={14} className="text-orange-500" fill="currentColor" />
                            </div>
                        </div>
                        <div className="p-3 bg-dark-900/40 rounded-xl border border-white/5 text-center">
                            <span className="block text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Comments</span>
                            <div className="flex items-center justify-center gap-1 text-xl font-black text-white">
                                8.2K <MessageCircle size={14} className="text-blue-500" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block mb-2">Content</span>
                        <div className="flex justify-between items-center gap-2">
                             <div className="flex flex-col items-center gap-1"><Video size={14} className="text-pink-400"/><span className="text-[9px] font-bold text-white">85</span></div>
                             <div className="w-px h-6 bg-white/5"></div>
                             <div className="flex flex-col items-center gap-1"><Image size={14} className="text-blue-400"/><span className="text-[9px] font-bold text-white">142</span></div>
                             <div className="w-px h-6 bg-white/5"></div>
                             <div className="flex flex-col items-center gap-1"><ShoppingBag size={14} className="text-green-400"/><span className="text-[9px] font-bold text-white">12</span></div>
                             <div className="w-px h-6 bg-white/5"></div>
                             <div className="flex flex-col items-center gap-1"><FileText size={14} className="text-yellow-400"/><span className="text-[9px] font-bold text-white">40</span></div>
                        </div>
                    </div>
                </div>

                {/* 3. Economy & Arcade */}
                <div className="space-y-4">
                     <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <Coins size={12} /> Arcade
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                         <div className="p-3 bg-green-900/10 border border-green-500/20 rounded-xl flex flex-col justify-between h-20">
                             <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Winnings</span>
                             <span className="text-xl font-black text-white">+13.1K</span>
                         </div>
                         <div className="p-3 bg-red-900/10 border border-red-500/20 rounded-xl flex flex-col justify-between h-20">
                             <span className="text-[8px] font-black text-red-400 uppercase tracking-widest">Losses</span>
                             <span className="text-xl font-black text-white">-2.1K</span>
                         </div>
                    </div>
                    <div className="bg-dark-900/40 rounded-xl p-3 border border-white/5 flex justify-between items-center">
                        <div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Net PnL</span>
                            <span className="text-lg font-black text-brand-400">+11,000 LSC</span>
                        </div>
                        <div className="text-right">
                             <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block">Played</span>
                             <span className="text-sm font-bold text-white">1,240 Rounds</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

const MetricCard = ({ label, value, subValue, icon: Icon, active = false, colorClass = "text-brand-500" }: any) => (
    <div className={`p-6 rounded-2xl border transition-all group hover:bg-dark-700 hover:border-white/10 ${active ? 'bg-brand-900/10 border-brand-500/50' : 'bg-dark-800 border-white/5'}`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`flex items-center justify-center transition-all duration-300 ${colorClass}`}>
                <Icon size={24} />
            </div>
            {subValue && (
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border ${subValue.startsWith('+') ? 'text-green-400 border-green-500/20 bg-green-500/10' : 'text-gray-500 border-white/10'}`}>
                    {subValue}
                </span>
            )}
        </div>
        <div className="space-y-1">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] block">{label}</span>
            <span className="text-2xl font-black text-white tabular-nums tracking-tight">{value}</span>
        </div>
    </div>
);

const SourceCard = ({ title, amount, growth, icon: Icon, colorClass, onClick, isSelected }: any) => {
    const baseColorClass = colorClass.replace('group-hover:', '');
    return (
    <div onClick={onClick} className={`bg-dark-800 border rounded-xl p-5 hover:bg-dark-700 transition-all group cursor-pointer ${isSelected ? 'border-brand-500' : 'border-white/5 hover:border-white/10'}`}>
        <div className="flex items-center gap-4 mb-4">
            <div className={`flex items-center justify-center ${baseColorClass} transition-all duration-300`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-tight">{title}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-[10px] font-black text-green-500">{growth}</span>
                </div>
            </div>
        </div>
        <div className="flex justify-between items-end border-t border-white/5 pt-4">
            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Revenue</span>
            <span className="text-lg font-black text-white tabular-nums">{amount}</span>
        </div>
    </div>
    );
};

const EarningCard = ({ title, amount, icon: Icon, colorClass }: any) => {
    const baseColorClass = colorClass.replace('group-hover:', '');
    return (
    <div className="bg-dark-800 border border-white/5 rounded-xl p-6 flex items-center justify-between hover:bg-dark-700 transition-all cursor-pointer group hover:border-white/10">
        <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center transition-all duration-300 ${baseColorClass}`}>
                <Icon size={24} />
            </div>
            <div>
                <h4 className="font-bold text-white text-sm uppercase tracking-wider">{title}</h4>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Selectable card</span>
            </div>
        </div>
        <div className="text-right">
            <span className="text-yellow-500 font-black text-base tabular-nums">+{amount} LSC</span>
        </div>
    </div>
    );
};

const CashOutConfig = ({ name, icon: Icon, fee, time, enabled, defaultDetails }: any) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isEnabled, setIsEnabled] = useState(enabled);
    const [details, setDetails] = useState(defaultDetails || '');

    return (
        <div className={`rounded-xl border transition-all duration-300 ${isExpanded ? 'bg-dark-900 border-brand-500/30' : 'bg-dark-800 border-white/10'}`}>
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEnabled ? 'bg-brand-900/20 text-brand-500' : 'bg-dark-700 text-gray-600'}`}>
                        <Icon size={18} />
                    </div>
                    <div>
                        <h4 className="font-bold text-white text-sm">{name}</h4>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-gray-500">
                            <span>Fee: {fee}</span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                            <span>{time}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {isEnabled && !isExpanded && <span className="text-[9px] font-black text-green-500 uppercase tracking-widest px-2 py-1 bg-green-900/20 rounded border border-green-500/20">Active</span>}
                    <button className="text-gray-400 hover:text-white transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                        <ChevronDown size={16} />
                    </button>
                </div>
            </div>
            
            {isExpanded && (
                <div className="px-4 pb-4 pt-0 space-y-4 border-t border-white/5 mt-2 animate-in slide-in-from-top-2">
                    <div className="pt-4">
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Configuration Details</label>
                        <input 
                            type="text" 
                            value={details} 
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder={name === 'Crypto (USDT)' ? 'Wallet Address (TRC20)' : name === 'PayPal' ? 'PayPal Email' : 'Account Number'}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:border-brand-500 outline-none" 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEnabled(!isEnabled)}>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${isEnabled ? 'bg-brand-500' : 'bg-dark-600'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isEnabled ? 'left-4.5' : 'left-0.5'}`}></div>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Enable Method</span>
                        </div>
                        <button className="bg-white text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <Save size={12} /> Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const AcquireCreditsModal = ({ isOpen, onClose }: any) => {
    const [selectedPack, setSelectedPack] = useState(2);
    const [processing, setProcessing] = useState(false);

    if (!isOpen) return null;

    const packs = [
        { id: 1, amount: 500, bonus: 0, price: 4.99 },
        { id: 2, amount: 1200, bonus: 200, price: 9.99, popular: true },
        { id: 3, amount: 3500, bonus: 1000, price: 24.99 },
        { id: 4, amount: 8000, bonus: 3000, price: 49.99 },
    ];

    const handlePurchase = () => {
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            onClose();
            alert("Credits acquired successfully!");
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-black text-white uppercase tracking-tighter text-xl">Buy Credits</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-500 hover:text-white" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {packs.map(pack => (
                            <div 
                                key={pack.id} 
                                onClick={() => setSelectedPack(pack.id)}
                                className={`p-4 rounded-xl border-2 cursor-pointer relative transition-all ${selectedPack === pack.id ? 'bg-brand-900/20 border-brand-500' : 'bg-dark-800 border-white/5 hover:border-white/20'}`}
                            >
                                {pack.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Creator Choice</div>}
                                <div className="text-center">
                                    <div className="text-2xl font-black text-white mb-1">{pack.amount.toLocaleString()}</div>
                                    {pack.bonus > 0 && <div className="text-[10px] font-bold text-brand-400 uppercase mb-2">+{pack.bonus} Bonus</div>}
                                    <div className={`text-sm font-bold py-1 px-3 rounded-lg inline-block ${selectedPack === pack.id ? 'bg-brand-500 text-white' : 'bg-dark-700 text-gray-400'}`}>${pack.price}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="bg-dark-800 rounded-xl p-4 border border-white/5 mt-6">
                        <div className="flex justify-between items-center text-sm mb-2">
                            <span className="text-gray-400 font-bold">Payment Method</span>
                            <span className="text-white font-bold flex items-center gap-2"><CreditCard size={14}/> Visa •••• 4242</span>
                        </div>
                        <div className="h-px bg-white/5 my-3"></div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="text-white font-black uppercase ">Total</span>
                            <span className="text-brand-500 font-black">${packs.find(p => p.id === selectedPack)?.price}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handlePurchase}
                        disabled={processing}
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} fill="currentColor" />}
                        {processing ? 'Processing...' : 'Confirm Transaction'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PerformanceDashboard = ({ sourceName, onBack }: { sourceName: string, onBack: () => void }) => {
    const [selectedStatIndex, setSelectedStatIndex] = useState(0);
    const [timeframe, setTimeframe] = useState<'Week' | 'Month'>('Week');
    const [comparePastMonth, setComparePastMonth] = useState(false);

    const getPerformanceStats = (source: string) => {
        if (source === 'Subscription') {
            return [
                { label: 'Active Subscribers', value: '1,250', trend: '+12%' },
                { label: 'New Subs vs. Expired', value: '45 / 12', trend: '+5%' },
                { label: 'Churn Rate', value: '2.4%', trend: '-0.5%' },
                { label: 'Renewal Rate', value: '85%', trend: '+2%' },
                { label: 'Conversion Rate', value: '12.5%', trend: '+1.2%' },
                { label: 'MRR', value: '$12,450', trend: '+15%' },
                { label: 'ARPU', value: '$9.96', trend: '+0.5%' },
                { label: 'Refund Rate', value: '0.5%', trend: '-0.1%' },
            ];
        }
        
        return [
            { label: 'Total Views', value: '45.2K', trend: '+15%' },
            { label: 'Unique Visitors', value: '12.4K', trend: '+8%' },
            { label: 'Engagement Rate', value: '8.4%', trend: '+1.2%' },
            { label: 'Click-Through Rate', value: '4.2%', trend: '+0.5%' },
            { label: 'Conversion Rate', value: '2.1%', trend: '+0.3%' },
            { label: 'Avg. Time on Content', value: '2m 15s', trend: '+12s' },
            { label: 'Bounce Rate', value: '32%', trend: '-2%' },
            { label: 'Revenue per View', value: '$0.05', trend: '+0.01' },
        ];
    };

    const stats = getPerformanceStats(sourceName);
    const selectedStat = stats[selectedStatIndex];

    const generateChartData = () => {
        const data = [];
        const points = timeframe === 'Week' 
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] 
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        
        const numericValue = parseFloat(selectedStat.value.replace(/[^0-9.]/g, '')) || 100;
        const baseValue = numericValue > 1000 ? numericValue / 10 : numericValue;

        for (let i = 0; i < points.length; i++) {
            data.push({
                name: points[i],
                current: Math.floor(baseValue + Math.random() * baseValue * 0.5),
                past: comparePastMonth ? Math.floor(baseValue * 0.8 + Math.random() * baseValue * 0.4) : undefined
            });
        }
        return data;
    };

    const chartData = generateChartData();

    return (
        <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-brand-500/30 pb-20 animate-in fade-in">
            <div className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-10 h-10 rounded-xl flex items-center justify-center bg-dark-800 border border-white/5 hover:bg-dark-700 transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-xl font-black uppercase  tracking-tighter leading-none text-white">{sourceName} Performance</h1>
                            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">Analytics & Preferences</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 rounded-lg bg-dark-800 border border-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-dark-700 transition-all flex items-center gap-2">
                            <Calendar size={14} /> Last 7 Days
                        </button>
                        <button className="px-4 py-2 rounded-lg bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand-500 transition-all flex items-center gap-2">
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => setSelectedStatIndex(idx)}
                            className={`p-6 rounded-2xl border cursor-pointer transition-all ${selectedStatIndex === idx ? 'bg-brand-900/20 border-brand-500' : 'bg-dark-800 border-white/5 hover:border-white/10'}`}
                        >
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">{stat.label}</span>
                            <div className="flex items-end justify-between">
                                <span className="text-2xl font-black text-white">{stat.value}</span>
                                <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chart Section */}
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <BarChart2 size={16} className="text-brand-500" /> {selectedStat.label} Trend
                        </h3>
                        <div className="flex bg-dark-900 p-1 rounded-lg border border-white/5">
                            <button 
                                onClick={() => setTimeframe('Week')} 
                                className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === 'Week' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Week
                            </button>
                            <button 
                                onClick={() => setTimeframe('Month')} 
                                className={`px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === 'Month' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                Month
                            </button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a10a39" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#a10a39" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorPast" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                                <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                                <Tooltip 
                                    contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px'}}
                                    itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                                />
                                <Area type="monotone" dataKey="current" name={timeframe === 'Week' ? 'This Week' : 'This Month'} stroke="#a10a39" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
                                {comparePastMonth && (
                                    <Area type="monotone" dataKey="past" name={timeframe === 'Week' ? 'Past Week' : 'Past Month'} stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorPast)" strokeDasharray="5 5" />
                                )}
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-dark-800 border border-white/5 rounded-2xl p-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <LayoutGrid size={16} className="text-brand-500" /> Top Performing Content
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="relative group">
                                    <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/5 bg-dark-900 relative">
                                        <img 
                                            src={`https://picsum.photos/seed/perf_${i}/400/600`} 
                                            className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" 
                                            alt="" 
                                            referrerPolicy="no-referrer"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <p className="text-[10px] font-black text-white uppercase truncate mb-1">Viral Moment #{i+1}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[8px] font-bold text-gray-400 uppercase">12.4K Views</span>
                                                <span className="text-[8px] font-black text-green-500 uppercase">+15%</span>
                                            </div>
                                        </div>
                                        
                                        {/* Monetize Button Overlay */}
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 bg-black/80 backdrop-blur rounded-full text-yellow-500 hover:bg-brand-500 hover:text-white transition-colors shadow-lg border border-white/10" title="Monetize">
                                                <Coins size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Demographics moved here */}
                    <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Users size={16} className="text-purple-500" /> Audience Demographics
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={audienceData}>
                                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{fill: '#27272a'}} contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', fontSize: '10px'}} />
                                    <Bar dataKey="value" fill="#a10a39" radius={[4, 4, 0, 0]}>
                                        {audienceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 1 ? '#a10a39' : '#3f3f46'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Primary Audience: 25-34 Years</p>
                        </div>
                    </div>
                </div>

                {/* Preferences Section */}
                <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Settings size={16} className="text-gray-400" /> Performance Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-white/5">
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Auto-Generate Reports</h4>
                                <p className="text-[10px] text-gray-500">Receive weekly performance summaries</p>
                            </div>
                            <div className="w-10 h-5 bg-brand-500 rounded-full relative cursor-pointer">
                                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                            </div>
                        </div>
                        <div 
                            className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-white/5 cursor-pointer"
                            onClick={() => setComparePastMonth(!comparePastMonth)}
                        >
                            <div>
                                <h4 className="text-sm font-bold text-white mb-1">Compare to Past Month</h4>
                                <p className="text-[10px] text-gray-500">Overlay previous month data on charts</p>
                            </div>
                            <div className={`w-10 h-5 rounded-full relative transition-colors ${comparePastMonth ? 'bg-brand-500' : 'bg-dark-700'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${comparePastMonth ? 'right-0.5' : 'left-0.5'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SourceStatsInline = ({ sourceName, onViewPerformance }: { sourceName: string, onViewPerformance: () => void }) => {

    // Mock weekly data for the selected source
    const weeklyData = [
        { day: 'Mon', income: Math.floor(Math.random() * 5000) + 1000 },
        { day: 'Tue', income: Math.floor(Math.random() * 5000) + 1000 },
        { day: 'Wed', income: Math.floor(Math.random() * 5000) + 1000 },
        { day: 'Thu', income: Math.floor(Math.random() * 5000) + 1000 },
        { day: 'Fri', income: Math.floor(Math.random() * 5000) + 1000 },
        { day: 'Sat', income: Math.floor(Math.random() * 5000) + 1000 },
        { day: 'Sun', income: Math.floor(Math.random() * 5000) + 1000 },
    ];

    const totalIncome = weeklyData.reduce((acc, curr) => acc + curr.income, 0);
    
    const getCustomStats = (source: string, total: number) => {
        switch(source) {
            case 'Direct Tips':
                return [
                    { label: 'Profile', value: (total * 0.3).toFixed(0) },
                    { label: 'Posts', value: (total * 0.7).toFixed(0) },
                    { label: 'Top Section', value: 'Photos' },
                    { label: 'Avg Tip', value: '500 LSC' }
                ];
            case 'Referrals':
                return [
                    { label: 'Avg Referral', value: '2,500' },
                    { label: 'Avg Reward', value: '1,500' },
                    { label: 'Active Refs', value: '340' },
                    { label: 'Conversion', value: '12%' }
                ];
            case 'Collection':
                return [
                    { label: 'Bought', value: '142' },
                    { label: 'Saved For Later', value: '850' },
                    { label: 'Avg Reward', value: '1,200 LSC' },
                    { label: 'Avg Price', value: '1,500 LSC' }
                ];
            case 'Live':
                return [
                    { label: 'Peak Viewers', value: '4.2K' },
                    { label: 'Avg Duration', value: '2h 15m' },
                    { label: 'Tips', value: (total * 0.8).toFixed(0) },
                    { label: 'New Subs', value: '124' }
                ];
            case 'Shorts':
            case 'Photos':
            case 'Comics':
                return [
                    { label: 'Top Post Sale', value: '12,000' },
                    { label: 'Search Views', value: '45.2K' },
                    { label: 'Heat', value: '8.5K' },
                    { label: 'Comments', value: '1.2K' }
                ];
            case 'Engagement':
                return [
                    { label: 'Heat', value: '24.5K' },
                    { label: 'Comments', value: '8.2K' },
                    { label: 'Avg Reward', value: '3.4K' },
                    { label: 'Saves', value: '12.1K' }
                ];
            case 'Arcade':
                return [
                    { label: 'Games Played', value: '1,240' },
                    { label: 'Win Rate', value: '48%' },
                    { label: 'Avg Bet', value: '250 LSC' },
                    { label: 'Avg Reward', value: '1,500 LSC' }
                ];
            case 'Subscription':
                return [
                    { label: 'Active Subs', value: '1,250' },
                    { label: 'New This Week', value: '45' },
                    { label: 'Churn Rate', value: '2.4%' },
                    { label: 'Avg Duration', value: '4.5 Mo' }
                ];
            default:
                return [
                    { label: 'Daily Avg', value: Math.round(total / 7).toLocaleString() },
                    { label: 'From Tags', value: (total * 0.4).toFixed(0) },
                    { label: 'From Posts', value: (total * 0.35).toFixed(0) },
                    { label: 'Direct', value: (total * 0.25).toFixed(0) }
                ];
        }
    };

    const customStats = getCustomStats(sourceName, totalIncome);

    return (
        <div className="bg-dark-800 border border-white/5 rounded-2xl p-6 mt-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-white uppercase  tracking-tighter text-lg">{sourceName} - Weekly Income</h3>
                <div className="text-right">
                    <p className="text-lg font-black text-green-500 flex items-center gap-1 justify-end"><TrendingUp size={16}/> +12.5%</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={weeklyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                            <XAxis dataKey="day" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                            <Tooltip 
                                cursor={{fill: '#27272a'}} 
                                contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', color: '#fff'}} 
                            />
                            <Bar dataKey="income" fill="#a10a39" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="space-y-4 flex flex-col justify-center">
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total This Week</p>
                        <p className="text-2xl font-black text-brand-500 tabular-nums">{totalIncome.toLocaleString()} LSC</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {customStats.map((stat, idx) => (
                            <div key={idx} className="bg-dark-900/50 p-3 rounded-lg border border-white/5">
                                <span className="text-[9px] font-bold text-gray-500 uppercase block mb-1">{stat.label}</span>
                                <span className="text-sm font-bold text-white">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
                <button 
                    onClick={onViewPerformance}
                    className="w-full bg-dark-900 hover:bg-dark-700 text-white font-black py-3 rounded-xl uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                    <BarChart2 size={16} /> Content Performance
                </button>
            </div>
        </div>
    );
};

export default function Points() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('STATISTICS');
    const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('ALL');
    const [isAcquireOpen, setIsAcquireOpen] = useState(false);
    const [selectedSourceStats, setSelectedSourceStats] = useState<string | null>(null);
    const [performanceSource, setPerformanceSource] = useState<string | null>(null);
    
    const [wallet, setWallet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const data = await api.get<any>('/wallet');
                setWallet(data);
            } catch (error) {
                console.error("Failed to fetch wallet", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    const MIN_CASHOUT = wallet?.minCashout || 50;
    const MAX_CASHOUT = wallet?.maxCashout || 10000;
    
    // Pagination States
    const [earnPage, setEarnPage] = useState(0);
    const itemsPerPage = 4;

    // Mock Values
    const metrics = {
        generated: 1245000,
        available: 482900,
        locked: 32400,
        cashed: 729700
    };

    // Extended Mock Data for Pagination
    const earnItems = [
        { title: "Ad Views", amount: "150", icon: Play, colorClass: "group-hover:text-blue-500" },
        { title: "Stream View", amount: "500", icon: Video, colorClass: "group-hover:text-red-500" },
        { title: "New Followers", amount: "1,200", icon: Users, colorClass: "group-hover:text-purple-500" },
        { title: "Checkpoint", amount: "50", icon: Target, colorClass: "group-hover:text-green-500" },
        { title: "Daily Login", amount: "100", icon: Calendar, colorClass: "group-hover:text-yellow-500" },
        { title: "Share Post", amount: "250", icon: Send, colorClass: "group-hover:text-cyan-500" },
        { title: "Referral", amount: "2,000", icon: Users, colorClass: "group-hover:text-brand-500" },
        { title: "Game Win", amount: "5,000", icon: Gamepad2, colorClass: "group-hover:text-orange-500" },
    ];

    // Pagination Logic
    // Mock Downloads Data
    const mockDownloads = [
        { id: '1', title: 'Cyberpunk Cityscape', type: 'Collection', date: '2024-03-20', size: '1.2 GB', image: 'https://picsum.photos/seed/coll1/400/400' },
        { id: '2', title: 'Personal Portrait', type: 'Commission', date: '2024-03-18', size: '450 MB', image: 'https://picsum.photos/seed/comm1/400/400' },
        { id: '3', title: 'Neon Nights Pack', type: 'Collection', date: '2024-03-15', size: '2.5 GB', image: 'https://picsum.photos/seed/coll2/400/400' },
        { id: '4', title: 'Fantasy Character', type: 'Commission', date: '2024-03-10', size: '320 MB', image: 'https://picsum.photos/seed/comm2/400/400' },
    ];

    const totalEarnPages = Math.ceil(earnItems.length / itemsPerPage);
    const visibleEarnItems = earnItems.slice(earnPage * itemsPerPage, (earnPage + 1) * itemsPerPage);

    if (performanceSource) {
        return <PerformanceDashboard sourceName={performanceSource} onBack={() => setPerformanceSource(null)} />;
    }

    return (
        <div className="min-h-screen bg-dark-900 text-white font-sans selection:bg-brand-500/30 pb-20">
            <AcquireCreditsModal isOpen={isAcquireOpen} onClose={() => setIsAcquireOpen(false)} />

            {/* Header - Transparent Background per user request */}
            <div className="sticky top-0 z-40 bg-transparent">
                <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Glossy Icon for Vault */}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-500 bg-white/5 backdrop-blur-md border border-white/10 shadow-lg">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase  tracking-tighter leading-none text-white">My Wallet</h1>
                        </div>
                    </div>
                    <div className="flex bg-dark-800 p-1 rounded-lg border border-white/5">
                        <button 
                            onClick={() => setActiveTab('STATISTICS')}
                            className={`px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'STATISTICS' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Statistics
                        </button>
                        <button 
                            onClick={() => setActiveTab('VAULT')}
                            className={`px-6 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'VAULT' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                        >
                            Vault
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
                
                {/* --- STATISTICS SECTION --- */}
                {activeTab === 'STATISTICS' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Top Metrics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard label="Total" value={`${metrics.generated.toLocaleString()} LSC`} subValue="+12%" icon={Database} active={true} colorClass="text-brand-500" />
                            <MetricCard label="Available Balance" value={`${metrics.available.toLocaleString()} LSC`} subValue="+5%" icon={Wallet} colorClass="text-green-500" />
                            <MetricCard label="Locked / Suspended" value={`${metrics.locked.toLocaleString()} LSC`} subValue="-2%" icon={Lock} colorClass="text-red-500" />
                            <MetricCard label="Total Cashed Out" value={`${metrics.cashed.toLocaleString()} LSC`} subValue="+18%" icon={ArrowUpRight} colorClass="text-blue-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Performance Chart - Left 2/3 */}
                            <div className="lg:col-span-2 bg-dark-800 border border-white/5 rounded-2xl p-8 shadow-xl">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase  tracking-tighter flex items-center gap-3">
                                            <Activity className="text-brand-500" /> Activity Trend
                                        </h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Growth trends over last 7 days</p>
                                    </div>
                                    <select className="bg-dark-900 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white px-4 py-2 rounded-lg outline-none focus:border-brand-500">
                                        <option>Last 7 Days</option>
                                        <option>Last 30 Days</option>
                                    </select>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={performanceData}>
                                            <defs>
                                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#a10a39" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#a10a39" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f22" vertical={false} />
                                            <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} dx={-10} />
                                            <Tooltip 
                                                contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px'}}
                                                itemStyle={{color: '#fff', fontSize: '12px', fontWeight: 'bold'}}
                                                cursor={{stroke: '#3f3f46', strokeWidth: 1}}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#a10a39" strokeWidth={3} fillOpacity={1} fill="url(#revenueGradient)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Redesigned Top Locations */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 flex flex-col h-full overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2 relative z-10">
                                    <Globe size={16} className="text-blue-500" /> Global Reach
                                </h3>
                                <div className="space-y-6 flex-1 relative z-10">
                                    {[
                                        { country: 'United States', amount: '240,000', pct: 45, code: 'US' },
                                        { country: 'United Kingdom', amount: '120,000', pct: 25, code: 'GB' },
                                        { country: 'Germany', amount: '85,000', pct: 15, code: 'DE' },
                                        { country: 'Brazil', amount: '35,000', pct: 8, code: 'BR' }
                                    ].map((loc, i) => (
                                        <div key={i} className="group">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded bg-dark-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-gray-500">{loc.code}</div>
                                                    <div className="font-bold text-white text-sm">{loc.country}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs font-black text-white">{loc.amount} <span className="text-[10px] text-gray-500">LSC</span></div>
                                                </div>
                                            </div>
                                            <div className="w-full h-1.5 bg-dark-900 rounded-full overflow-hidden border border-white/5">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 group-hover:from-brand-600 group-hover:to-brand-400" 
                                                    style={{ width: `${loc.pct}%` }}
                                                ></div>
                                            </div>
                                            <div className="flex justify-between mt-1">
                                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Rank #{i+1}</span>
                                                <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{loc.pct}% of total</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className="mt-8 w-full py-3 bg-dark-900 border border-white/5 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white hover:bg-dark-700 transition-all">
                                    View Detailed Map
                                </button>
                            </div>
                        </div>

                        {/* Source Grid (All 10 Channels) */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            <SourceCard title="Subscription" amount="125,000" growth="+5%" icon={Crown} colorClass="group-hover:text-yellow-500 text-yellow-500" onClick={() => setSelectedSourceStats('Subscription')} isSelected={selectedSourceStats === 'Subscription'} />
                            <SourceCard title="Direct Tips" amount="85,000" growth="+22%" icon={Gift} colorClass="group-hover:text-pink-500 text-pink-500" onClick={() => setSelectedSourceStats('Direct Tips')} isSelected={selectedSourceStats === 'Direct Tips'} />
                            <SourceCard title="Referrals" amount="5,000" growth="+8%" icon={Users} colorClass="group-hover:text-green-500 text-green-500" onClick={() => setSelectedSourceStats('Referrals')} isSelected={selectedSourceStats === 'Referrals'} />
                            <SourceCard title="Engagement" amount="12,400" growth="+10%" icon={BarChart2} colorClass="group-hover:text-blue-500 text-blue-500" onClick={() => setSelectedSourceStats('Engagement')} isSelected={selectedSourceStats === 'Engagement'} />
                            <SourceCard title="Live" amount="420,500" growth="+15%" icon={Play} colorClass="group-hover:text-red-500 text-red-500" onClick={() => setSelectedSourceStats('Live')} isSelected={selectedSourceStats === 'Live'} />
                            <SourceCard title="Shorts" amount="150,200" growth="+5%" icon={Smartphone} colorClass="group-hover:text-purple-500 text-purple-500" onClick={() => setSelectedSourceStats('Shorts')} isSelected={selectedSourceStats === 'Shorts'} />
                            <SourceCard title="Photos" amount="45,200" growth="+3%" icon={Image} colorClass="group-hover:text-cyan-500 text-cyan-500" onClick={() => setSelectedSourceStats('Photos')} isSelected={selectedSourceStats === 'Photos'} />
                            <SourceCard title="Comics" amount="38,100" growth="+12%" icon={FileText} colorClass="group-hover:text-orange-500 text-orange-500" onClick={() => setSelectedSourceStats('Comics')} isSelected={selectedSourceStats === 'Comics'} />
                            <SourceCard title="Collection" amount="45,200" growth="+18%" icon={ShoppingBag} colorClass="group-hover:text-emerald-500 text-emerald-500" onClick={() => setSelectedSourceStats('Collection')} isSelected={selectedSourceStats === 'Collection'} />
                            <SourceCard title="Arcade" amount="12,500" growth="-2%" icon={Gamepad2} colorClass="group-hover:text-indigo-500 text-indigo-500" onClick={() => setSelectedSourceStats('Arcade')} isSelected={selectedSourceStats === 'Arcade'} />
                        </div>

                        {/* Inline Source Stats */}
                        {selectedSourceStats && (
                            <SourceStatsInline sourceName={selectedSourceStats} onViewPerformance={() => setPerformanceSource(selectedSourceStats)} />
                        )}

                        {/* Analytics Grid: Wallet */}
                        <div className="grid grid-cols-1 gap-8">
                            {/* Financial System - Full Width */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white uppercase  tracking-tighter flex items-center gap-3">
                                        <Wallet className="text-green-500" /> Wallet
                                    </h3>
                                    <button 
                                        onClick={() => setIsAcquireOpen(true)}
                                        className="text-[9px] font-black uppercase bg-brand-600 text-white px-3 py-1.5 rounded hover:bg-brand-500 transition-all flex items-center gap-1"
                                    >
                                        <Plus size={10} /> Buy Points
                                    </button>
                                </div>
                                <div className="space-y-4 mt-4 flex-1">
                                    <div className="bg-dark-900/50 border border-white/5 rounded-xl p-4">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Withdraw Amount</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                placeholder="0.00"
                                                min={MIN_CASHOUT}
                                                max={MAX_CASHOUT}
                                                className="w-full bg-dark-950 border border-white/10 rounded-lg py-3 px-4 text-white text-lg font-bold focus:border-brand-500 outline-none transition-all"
                                            />
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">LSC</div>
                                        </div>
                                        <div className="mt-3 flex justify-between text-[9px] font-black uppercase tracking-widest px-1">
                                            <span className="text-gray-500">Min: <span className="text-white">{MIN_CASHOUT}</span></span>
                                            <span className="text-gray-500">Max: <span className="text-white">{MAX_CASHOUT}</span></span>
                                        </div>
                                    </div>
                                    
                                    <button className="w-full bg-dark-900 border border-white/10 hover:border-brand-500/50 text-white font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-between px-4 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                                <CreditCard size={14} className="text-brand-500 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <span className="uppercase tracking-wider">Select Payment Method</span>
                                        </div>
                                        <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                                    </button>
                                </div>
                                <div className="pt-6 mt-6 border-t border-white/5">
                                    <button 
                                        onClick={() => navigate('/earnings')}
                                        className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-xl uppercase tracking-[0.2em] text-xs shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <ArrowUpRight size={16} /> Withdraw Funds
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VAULT SECTION --- */}
                {activeTab === 'VAULT' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Unified Vault Dashboard - NEW */}
                        <VaultDashboard />

                        {/* Downloads Section - Separated Commission and Collection */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Commissions Downloads */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-6">
                                    <Palette className="text-brand-500" /> Commission Vault
                                </h3>
                                <div className="space-y-4">
                                    {mockDownloads.filter(d => d.type === 'Commission').map(item => (
                                        <div key={item.id} className="bg-dark-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-brand-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.date} • {item.size}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 bg-dark-800 rounded-lg text-gray-400 hover:text-white hover:bg-brand-600 transition-all">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Collections Downloads */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-6">
                                    <ShoppingBag className="text-blue-500" /> Collection Vault
                                </h3>
                                <div className="space-y-4">
                                    {mockDownloads.filter(d => d.type === 'Collection').map(item => (
                                        <div key={item.id} className="bg-dark-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-all">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} className="w-12 h-12 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                                                <div>
                                                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{item.date} • {item.size}</p>
                                                </div>
                                            </div>
                                            <button className="p-2 bg-dark-800 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all">
                                                <Download size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            {/* Earn Points */}
                            <div className="bg-dark-800 border border-white/5 rounded-2xl p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-black text-white uppercase  tracking-tighter flex items-center gap-3">
                                        <Zap className="text-yellow-500" /> Earn Points
                                    </h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEarnPage(Math.max(0, earnPage - 1))}
                                            disabled={earnPage === 0}
                                            className="p-2 bg-dark-900 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700 transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setEarnPage(Math.min(totalEarnPages - 1, earnPage + 1))}
                                            disabled={earnPage >= totalEarnPages - 1}
                                            className="p-2 bg-dark-900 border border-white/10 rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-dark-700 transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[220px]">
                                    {visibleEarnItems.map((item, idx) => (
                                        <EarningCard key={idx} {...item} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden min-h-[500px] flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dark-900/50 backdrop-blur-md">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                                        <Activity size={18} className="text-brand-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-white uppercase tracking-tighter">Recent Activity</h3>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Your latest transactions</p>
                                    </div>
                                </div>
                                <div className="flex bg-dark-950 p-1.5 rounded-xl border border-white/5 overflow-x-auto no-scrollbar w-full sm:w-auto gap-1">
                                    {['ALL', 'POINTS IN', 'POINTS OUT'].map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => setHistoryFilter(f as HistoryFilter)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex-1 sm:flex-none text-center ${historyFilter === f ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="divide-y divide-white/[0.03] p-2">
                                {mockTransactions.filter(t => {
                                    if (historyFilter === 'ALL') return true;
                                    if (historyFilter === 'POINTS IN') return t.amount > 0;
                                    if (historyFilter === 'POINTS OUT') return t.amount < 0;
                                    return true;
                                }).map((tx) => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-dark-700/50 rounded-xl transition-all cursor-pointer group mb-1">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                                                tx.type === 'BUY' ? 'text-blue-500' :
                                                tx.type === 'SUB' ? 'text-purple-500' :
                                                tx.type === 'POST' ? 'text-pink-500' :
                                                tx.type === 'TIP' ? 'text-yellow-500' :
                                                tx.type === 'REF' ? 'text-green-500' :
                                                tx.type === 'COLL' ? 'text-orange-500' :
                                                tx.type === 'GAME' ? 'text-cyan-500' :
                                                tx.type === 'LIVE' ? 'text-red-500' :
                                                'text-gray-400'
                                            }`}>
                                                {tx.type === 'BUY' ? <Plus size={18} /> : 
                                                 tx.type === 'SUB' ? <Crown size={18} /> : 
                                                 tx.type === 'POST' ? <Image size={18} /> :
                                                 tx.type === 'TIP' ? <Gift size={18} /> :
                                                 tx.type === 'REF' ? <Users size={18} /> :
                                                 tx.type === 'COLL' ? <ShoppingBag size={18} /> :
                                                 tx.type === 'GAME' ? <Gamepad2 size={18} /> :
                                                 tx.type === 'LIVE' ? <Video size={18} /> :
                                                 tx.type === 'SHORT' ? <Smartphone size={18} /> :
                                                 tx.type === 'PHOTO' ? <Image size={18} /> :
                                                 tx.type === 'COMIC' ? <FileText size={18} /> :
                                                 <ArrowUpRight size={18} />}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white mb-0.5">{tx.source}</div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                    <span className={tx.amount > 0 ? 'text-green-500' : 'text-red-500'}>{tx.amount > 0 ? 'Points In' : 'Points Out'}</span>
                                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                    <span>{tx.date}</span>
                                                    <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                                                    <span className="font-mono">{tx.refId}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className={`text-sm font-black tabular-nums ${tx.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                                                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} LSC
                                                </div>
                                                <div className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${
                                                    tx.status === 'Completed' ? 'text-green-500' :
                                                    tx.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'
                                                }`}>
                                                    {tx.status}
                                                </div>
                                            </div>
                                            {(tx as any).image && (
                                                <img src={(tx as any).image} className="w-10 h-10 rounded-lg object-cover border border-white/10" alt="" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
