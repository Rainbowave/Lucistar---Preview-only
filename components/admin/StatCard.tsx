
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
  color: string;
  trend?: 'up' | 'down' | 'flat' | { value: string; isPositive: boolean; label?: string };
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, trend, trendValue }) => {
    const isObjectTrend = typeof trend === 'object';
    const trendType = isObjectTrend ? (trend.isPositive ? 'up' : 'down') : trend;
    const displayTrendValue = isObjectTrend ? trend.value : trendValue;
    const trendLabel = isObjectTrend ? (trend.label || 'vs last month') : 'vs last 24h';

    return (
        <div className="bg-card border border-border p-6 rounded-[5px] flex items-center justify-between shadow-lg relative overflow-hidden group hover:border-white/10 transition-all h-full w-full">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${String(color)} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
            <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                {trend && (
                    <div className={`flex items-center gap-1 mt-2 text-[10px] font-bold ${trendType === 'up' ? 'text-green-500' : trendType === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                        <span>{trendType === 'up' ? '▲' : trendType === 'down' ? '▼' : '●'} {displayTrendValue}</span>
                        <span className="text-gray-600">{trendLabel}</span>
                    </div>
                )}
            </div>
            <div className={`p-3.5 rounded-[5px] ${String(color)} bg-opacity-10 border border-white/5 relative z-10`}>
                <Icon size={24} className={String(color).replace('bg-', 'text-')} />
            </div>
        </div>
    );
};
