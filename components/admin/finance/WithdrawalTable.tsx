
import React from 'react';
import { Loader2, Check, X } from 'lucide-react';

interface WithdrawalRequest {
    id: string;
    user: string;
    method: string;
    amount: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

interface WithdrawalTableProps {
    withdrawals: WithdrawalRequest[];
    processingId: string | null;
    onAction: (id: string, action: 'Approved' | 'Rejected') => void;
    title: string;
}

export default function WithdrawalTable({ withdrawals, processingId, onAction, title }: WithdrawalTableProps) {
    return (
        <div className="bg-card border border-border rounded-[5px] overflow-hidden shadow-2xl animate-in fade-in duration-500">
            <div className="p-5 bg-background/50 border-b border-border flex justify-between items-center">
                <h3 className="text-xs font-black text-white uppercase tracking-widest">
                    {title}
                </h3>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    {withdrawals.length} Records
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-background/20 text-[10px] text-gray-500 uppercase font-black tracking-widest border-b border-border">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Method</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                        {withdrawals.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-gray-500 font-bold uppercase text-xs tracking-widest">No withdrawal records.</td>
                            </tr>
                        ) : (
                            withdrawals.map(w => (
                                <tr key={w.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs tracking-tighter">{w.id}</td>
                                    <td className="px-6 py-4 font-bold text-white">@{w.user}</td>
                                    <td className="px-6 py-4 text-gray-300 font-medium">{w.method}</td>
                                    <td className="px-6 py-4 font-black text-yellow-500">{w.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-[5px] text-[9px] font-black uppercase tracking-widest border ${
                                            w.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 animate-pulse' : 
                                            w.status === 'Approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                            'bg-red-500/10 text-red-400 border-red-500/20'
                                        }`}>
                                            {w.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {w.status === 'Pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => onAction(w.id, 'Approved')}
                                                    disabled={processingId === w.id}
                                                    className="p-2 bg-green-600 rounded-[5px] hover:bg-green-500 text-white disabled:opacity-50 transition-all shadow-lg border border-green-500/20"
                                                    title="Approve"
                                                >
                                                    {processingId === w.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14}/>}
                                                </button>
                                                <button 
                                                    onClick={() => onAction(w.id, 'Rejected')}
                                                    disabled={processingId === w.id}
                                                    className="p-2 bg-red-600 rounded-[5px] hover:bg-red-500 text-white disabled:opacity-50 transition-all shadow-lg border border-red-500/20"
                                                    title="Reject"
                                                >
                                                    <X size={14}/>
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{w.date}</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
