
import React from 'react';
import { Users, AlertTriangle, Check, Coins, Smartphone, Server, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl flex items-center justify-between shadow-lg">
        <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${String(color)} bg-opacity-20`}>
            <Icon size={24} className={String(color).replace('bg-', 'text-')} />
        </div>
    </div>
);

const trafficData = [
    { name: 'Mon', uv: 0, pv: 0 },
    { name: 'Tue', uv: 0, pv: 0 },
    { name: 'Wed', uv: 0, pv: 0 },
    { name: 'Thu', uv: 0, pv: 0 },
    { name: 'Fri', uv: 0, pv: 0 },
    { name: 'Sat', uv: 0, pv: 0 },
    { name: 'Sun', uv: 0, pv: 0 },
];

export default function AdminDashboard() {
    const navigate = useNavigate();

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-white mb-8">Platform Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value="0" icon={Users} color="bg-blue-600" />
                <StatCard title="Revenue (Mo)" value="0 LSC" icon={Coins} color="bg-green-600" />
                <StatCard title="Active Issues" value="0" icon={AlertTriangle} color="bg-red-600" />
                <StatCard title="New Creators" value="0" icon={Check} color="bg-purple-600" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-dark-800 border border-dark-700 p-6 rounded-2xl h-96 flex flex-col">
                    <h3 className="font-bold text-white mb-4">Traffic Analytics</h3>
                    <div className="flex-1 w-full h-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trafficData}>
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', borderRadius: '12px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="uv" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorUv)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <div className="bg-dark-800 border border-dark-700 p-6 rounded-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                <Server size={18} className="text-green-500" /> System Health
                            </h3>
                            <button onClick={() => navigate('/admin/performance')} className="text-xs text-brand-400 hover:underline">View All</button>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm items-center p-2 bg-dark-900 rounded-lg border border-dark-600">
                                <span className="text-gray-400">CPU Load</span> 
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[0%]"></div>
                                    </div>
                                    <span className="text-white font-mono text-xs">0%</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm items-center p-2 bg-dark-900 rounded-lg border border-dark-600">
                                <span className="text-gray-400">Memory</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[0%]"></div>
                                    </div>
                                    <span className="text-white font-mono text-xs">0%</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm items-center p-2 bg-dark-900 rounded-lg border border-dark-600">
                                <span className="text-gray-400">Storage</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-[0%]"></div>
                                    </div>
                                    <span className="text-white font-mono text-xs">0%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
