
import React from 'react';
import { Download, TrendingUp, Users, Shield } from 'lucide-react';
import { StatCard } from '../StatCard';

export default function PimpProfitView() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Pimp Revenue"
                    value="0.00 LSC"
                    icon={TrendingUp}
                    trend={{ value: "+0% from last week", isPositive: true }}
                    color="blue"
                />
                <StatCard
                    title="Active Pimps"
                    value="0"
                    icon={Users}
                    trend={{ value: "Managing 0 users", isPositive: true }}
                    color="purple"
                />
                <StatCard
                    title="Platform Share (Pimp Tax)"
                    value="0.00 LSC"
                    icon={Shield}
                    trend={{ value: "Fixed 10% platform fee", isPositive: true }}
                    color="brand"
                />
            </div>

            <div className="bg-card border border-border rounded-[5px] overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
                    <h3 className="font-black text-white text-xs uppercase tracking-widest">Pimp Financial Performance</h3>
                    <div className="flex gap-2">
                        <button className="p-2 bg-background rounded-[5px] border border-border text-gray-400 hover:text-white transition-all shadow-lg">
                            <Download size={16}/>
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-background/20 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-border">
                            <tr>
                                <th className="px-6 py-5">Pimp User</th>
                                <th className="px-6 py-5">Managed Users</th>
                                <th className="px-6 py-5">Gross Revenue</th>
                                <th className="px-6 py-5">Pimp Commission</th>
                                <th className="px-6 py-5 text-right">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border text-sm">
                            {[].map((p: any, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">@{p.name}</td>
                                    <td className="px-6 py-4 text-gray-400 font-medium">{p.users} Users</td>
                                    <td className="px-6 py-4 text-white font-mono text-xs">{p.gross.toLocaleString()} LSC</td>
                                    <td className="px-6 py-4 text-brand-400 font-black">{p.comm}</td>
                                    <td className="px-6 py-4 text-right font-black text-green-500">{p.net.toLocaleString()} LSC</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={5} className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No pimp data available.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
