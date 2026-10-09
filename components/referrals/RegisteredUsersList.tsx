import React from 'react';
import { Users, User } from 'lucide-react';

export const RegisteredUsersList = ({ isAdult }: { isAdult: boolean }) => {
    const mockUsers = [
        { id: 1, email: 'user1@test.com', username: 'NeonRider', signed: true, share: '15%', revenue: '1,250 LSC', date: '2023-10-01' },
        { id: 2, email: 'user2@test.com', username: '', signed: false, share: '15%', revenue: '0 LSC', date: '2023-10-05' },
        { id: 3, email: 'user3@test.com', username: 'CyberPunk', signed: true, share: '10%', revenue: '450 LSC', date: '2023-10-10' },
    ];

    return (
        <div className="bg-dark-800 border border-white/5 rounded-[5px] p-4 md:p-8 relative overflow-hidden shadow-xl h-full">
            <h3 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3 mb-6 drag-handle cursor-move">
                <Users size={20} className="text-brand-500" /> {isAdult ? 'Registered Affiliates' : 'Referred Users'}
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">User</th>
                            <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                            <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Share</th>
                            <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Revenue</th>
                            <th className="py-3 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {mockUsers.map(u => (
                            <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-[5px] bg-dark-900 border border-white/10 flex items-center justify-center text-gray-500">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-white">{u.signed ? u.username : <span className="text-gray-600 opacity-50">Pending Registration</span>}</div>
                                            <div className="text-[10px] text-gray-500">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    {u.signed 
                                        ? <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase rounded-[5px] border border-emerald-500/20">Signed</span>
                                        : <span className="px-2 py-1 bg-brand-500/10 text-brand-500 text-[9px] font-black uppercase rounded-[5px] border border-brand-500/20">Invited</span>
                                    }
                                </td>
                                <td className="py-4 px-4 text-sm font-bold text-gray-300">{u.share}</td>
                                <td className="py-4 px-4 text-sm font-black text-brand-500">{u.revenue}</td>
                                <td className="py-4 px-4 text-xs text-gray-500">{u.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
