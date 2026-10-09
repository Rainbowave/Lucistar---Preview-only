
import React from 'react';
import { Coins, Clock, Building, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '../StatCard';

interface FinanceOverviewProps {
    trendData: any[];
    pendingRequestsCount: number;
}

export default function FinanceOverview({ trendData, pendingRequestsCount }: FinanceOverviewProps) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="0.00 LSC"
                    icon={Coins}
                    trend={{ value: "+12.5%", isPositive: true, label: "vs last month" }}
                    color="green"
                />
                
                <StatCard
                    title="Pending Withdrawals"
                    value="0.00 LSC"
                    icon={Clock}
                    trend={{ value: `${pendingRequestsCount} Requests Waiting`, isPositive: true }}
                    color="yellow"
                />

                <StatCard
                    title="Platform Fees (Net)"
                    value="0.00 LSC"
                    icon={Building}
                    color="purple"
                />
            </div>

            <div className="bg-card border border-border rounded-[5px] p-6 h-96 shadow-xl">
                <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-tighter">Revenue Trend</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="name" stroke="#71717a" tick={{fontSize: 10, fontWeight: 'bold'}} axisLine={false} tickLine={false} dy={10} />
                        <YAxis stroke="#71717a" tick={{fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => `${val/1000}k`} axisLine={false} tickLine={false} dx={-10} />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#101010', borderColor: '#27272a', borderRadius: '5px', color: '#fff', fontSize: '12px', fontWeight: 'bold'}} 
                            itemStyle={{color: '#10b981'}}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
