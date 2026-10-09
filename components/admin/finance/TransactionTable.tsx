
import React from 'react';
import { Building, Megaphone } from 'lucide-react';

interface Transaction {
    id: string;
    type: string;
    user: string;
    amount: string;
    status: 'Completed' | 'Processing' | 'Failed' | 'Refunded';
    date: string;
    isPositive: boolean;
}

interface TransactionTableProps {
    transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
    return (
        <div className="bg-card border border-border rounded-[5px] overflow-hidden shadow-2xl animate-in fade-in duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background/50 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-border">
                        <tr>
                            <th className="px-6 py-5">Transaction ID</th>
                            <th className="px-6 py-5">Type</th>
                            <th className="px-6 py-5">User / Source</th>
                            <th className="px-6 py-5">Amount</th>
                            <th className="px-6 py-5">Status</th>
                            <th className="px-6 py-5 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No transactions found.</td>
                            </tr>
                        ) : (
                            transactions.map(tx => (
                                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-tighter">{tx.id}</td>
                                    <td className="px-6 py-4 font-bold text-white">
                                        <span className={`flex items-center gap-2 ${['Site Fee', 'Ad Revenue'].includes(tx.type) ? 'text-brand-400' : 'text-white'}`}>
                                            {tx.type === 'Site Fee' && <Building size={14} />}
                                            {tx.type === 'Ad Revenue' && <Megaphone size={14} />}
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 font-medium">@{tx.user}</td>
                                    <td className={`px-6 py-4 font-black ${tx.isPositive ? 'text-green-400' : 'text-white'}`}>
                                        {tx.amount}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-[5px] text-[9px] font-black uppercase tracking-widest border ${
                                            tx.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                            tx.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500 text-[10px] font-bold uppercase tracking-wider">{tx.date}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
