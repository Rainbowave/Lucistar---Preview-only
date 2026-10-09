import React from 'react';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export const ProfitCharts = ({ isAdult }: { isAdult: boolean }) => {
    const data = [
        { name: 'Mon', profit: 400, users: 2 },
        { name: 'Tue', profit: 300, users: 1 },
        { name: 'Wed', profit: 550, users: 4 },
        { name: 'Thu', profit: 450, users: 3 },
        { name: 'Fri', profit: 700, users: 6 },
        { name: 'Sat', profit: 600, users: 5 },
        { name: 'Sun', profit: 800, users: 8 },
    ];

    return (
        <div className="bg-dark-800 border border-white/5 rounded-[5px] p-4 md:p-8 relative overflow-hidden shadow-xl h-full flex flex-col">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-6 drag-handle cursor-move">
                <TrendingUp size={20} className="text-brand-500" /> Profit & User Growth
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                <div className="flex flex-col h-full">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 text-center">Weekly Profit (LSC)</h4>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#e11d48" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '4px' }}
                                    itemStyle={{ color: '#e11d48', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="profit" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="flex flex-col h-full">
                    <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 text-center">New {isAdult ? 'Affiliates' : 'Referrals'}</h4>
                    <div className="flex-1 min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#ffffff50" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#ffffff10', borderRadius: '4px' }}
                                    itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};
