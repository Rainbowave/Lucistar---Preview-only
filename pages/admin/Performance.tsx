
import React, { useState } from 'react';
import { Activity, Server, Database, HardDrive, Cpu, Cloud, RefreshCw, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatusCard = ({ title, value, subValue, status, icon: Icon }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl relative overflow-hidden">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-white">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${status === 'good' ? 'bg-green-500/20 text-green-500' : status === 'warning' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-red-500/20 text-red-500'}`}>
                <Icon size={24} />
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <p className="text-sm text-gray-400">{subValue}</p>
        </div>
    </div>
);

const ServiceRow = ({ name, uptime, latency, status }: any) => (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-xl border border-dark-600">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status === 'operational' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-bold text-white">{name}</span>
        </div>
        <div className="flex items-center gap-8">
            <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-bold">Uptime</p>
                <p className="text-sm font-mono text-gray-300">{uptime}</p>
            </div>
            <div className="text-right w-20">
                <p className="text-xs text-gray-500 uppercase font-bold">Latency</p>
                <p className={`text-sm font-mono font-bold ${latency < 100 ? 'text-green-400' : 'text-yellow-400'}`}>{latency}ms</p>
            </div>
        </div>
    </div>
);

export default function AdminPerformance() {
    const [viewMode, setViewMode] = useState<'system' | 'business'>('business');
    const [timeRange, setTimeRange] = useState<'year' | 'month'>('year');

    // Mock Data for Business Analytics
    const generateBusinessData = (range: 'year' | 'month') => {
        const data = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if (range === 'year') {
            for (let i = 0; i < 12; i++) {
                const base = 50000 + (i * 2000);
                const noise = Math.random() * 10000 - 5000;
                data.push({
                    name: months[i],
                    revenue: Math.floor(base + noise),
                    prevRevenue: Math.floor(base * 0.8 + noise) // Compare to past year/period logic
                });
            }
        } else {
            // Month view (30 days)
            for (let i = 1; i <= 30; i++) {
                const base = 2000;
                const noise = Math.random() * 500 - 250;
                data.push({
                    name: `Day ${i}`,
                    revenue: Math.floor(base + noise),
                    prevRevenue: Math.floor(base * 0.9 + noise)
                });
            }
        }
        return data;
    };

    const businessData = generateBusinessData(timeRange);
    const currentTotal = businessData.reduce((acc, curr) => acc + curr.revenue, 0);
    const prevTotal = businessData.reduce((acc, curr) => acc + curr.prevRevenue, 0);
    const growth = ((currentTotal - prevTotal) / prevTotal) * 100;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Activity className="text-brand-500" /> Performance Analytics
                    </h1>
                    <p className="text-gray-400 mt-1">Real-time system & business intelligence</p>
                </div>
                <div className="flex gap-3">
                    <div className="flex bg-dark-800 p-1 rounded-xl border border-dark-600">
                        <button 
                            onClick={() => setViewMode('business')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'business' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Business
                        </button>
                        <button 
                            onClick={() => setViewMode('system')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'system' ? 'bg-brand-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            System
                        </button>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-dark-800 border border-dark-600 rounded-xl text-white hover:bg-dark-700 transition-colors">
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {viewMode === 'business' ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                    {/* Business KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl">
                            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue ({timeRange === 'year' ? 'YTD' : 'This Month'})</p>
                            <h3 className="text-3xl font-black text-white mb-2">{currentTotal.toLocaleString()} LSC</h3>
                            <div className={`flex items-center gap-2 text-xs font-bold ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                <TrendingUp size={14} />
                                <span>{growth.toFixed(1)}% vs previous period</span>
                            </div>
                        </div>
                        {/* Add more KPIs as needed */}
                    </div>

                    {/* Main Chart */}
                    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl shadow-xl h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white text-lg uppercase tracking-tight flex items-center gap-2">
                                <Calendar className="text-brand-500" size={20} /> Revenue Performance
                            </h3>
                            <div className="flex bg-dark-900 p-1 rounded-lg border border-dark-600">
                                <button 
                                    onClick={() => setTimeRange('month')}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === 'month' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Month
                                </button>
                                <button 
                                    onClick={() => setTimeRange('year')}
                                    className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${timeRange === 'year' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    Year
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={businessData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '8px' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                                    <Area type="monotone" dataKey="revenue" name="Current Period" stroke="#10b981" fill="url(#colorRev)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="prevRevenue" name="Previous Period" stroke="#6366f1" fill="url(#colorPrev)" strokeWidth={2} strokeDasharray="5 5" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                    {/* Existing System Health Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatusCard 
                            title="CPU Usage" 
                            value="42%" 
                            subValue="12 Cores Active" 
                            status="good" 
                            icon={Cpu} 
                        />
                        <StatusCard 
                            title="Memory" 
                            value="12.4 GB" 
                            subValue="64GB Total" 
                            status="good" 
                            icon={Server} 
                        />
                        <StatusCard 
                            title="Database" 
                            value="890 QPS" 
                            subValue="No slow queries" 
                            status="good" 
                            icon={Database} 
                        />
                        <StatusCard 
                            title="Storage" 
                            value="85%" 
                            subValue="1.2TB / 1.5TB" 
                            status="warning" 
                            icon={HardDrive} 
                        />
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2">
                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-6">Node Status</h3>
                                <div className="space-y-4">
                                    <ServiceRow name="API Gateway (US-East)" uptime="99.99%" latency={45} status="operational" />
                                    <ServiceRow name="API Gateway (EU-West)" uptime="99.95%" latency={82} status="operational" />
                                    <ServiceRow name="Auth Service" uptime="100%" latency={24} status="operational" />
                                    <ServiceRow name="Media Processing" uptime="99.90%" latency={120} status="operational" />
                                    <ServiceRow name="Realtime Socket Cluster" uptime="99.98%" latency={15} status="operational" />
                                    <ServiceRow name="Payment Processor" uptime="99.99%" latency={210} status="operational" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Incidents</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-600">
                                        <div className="flex items-center gap-2 text-green-400 mb-1">
                                            <CheckCircle size={16} />
                                            <span className="text-xs font-bold uppercase">Resolved</span>
                                        </div>
                                        <p className="text-sm font-bold text-white">High latency in EU region</p>
                                        <p className="text-xs text-gray-500 mt-1">2 hours ago • Duration: 15m</p>
                                    </div>
                                    <div className="p-4 bg-dark-900/50 rounded-xl border border-dark-600">
                                        <div className="flex items-center gap-2 text-green-400 mb-1">
                                            <CheckCircle size={16} />
                                            <span className="text-xs font-bold uppercase">Resolved</span>
                                        </div>
                                        <p className="text-sm font-bold text-white">Database backup delay</p>
                                        <p className="text-xs text-gray-500 mt-1">Yesterday • Duration: 45m</p>
                                    </div>
                                </div>
                                <button className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-white transition-colors">View Incident History</button>
                            </div>

                            <div className="bg-gradient-to-br from-brand-900/50 to-dark-800 border border-brand-500/30 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <Cloud className="text-brand-400" size={24} />
                                    <h3 className="font-bold text-white">Cloud Costs</h3>
                                </div>
                                <p className="text-3xl font-black text-white mb-1">2,450.00 LSC</p>
                                <p className="text-xs text-brand-200">Current month-to-date</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
