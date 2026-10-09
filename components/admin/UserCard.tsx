import React from 'react';
import { 
    CheckCircle, Crown, Star, Flame, Heart, MessageCircle, Ban, Unlock, Eye, MoreHorizontal 
} from 'lucide-react';

interface UserCardProps {
    user: any;
    onRoleChange?: (userId: string, newRole: string) => void;
    onAction: (userId: string, type: 'warn' | 'suspend' | 'ban' | 'activate') => void;
    onNavigate: (path: string) => void;
    compact?: boolean; 
}

export const UserCard: React.FC<UserCardProps> = ({ user, onRoleChange, onAction, onNavigate, compact = false }) => {
    return (
        <div className={`bg-card border border-primary/30 rounded-[5px] ${compact ? 'p-4' : 'p-5'} shadow-sm hover:border-primary transition-all flex flex-col gap-4`}>
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative cursor-pointer" onClick={() => onNavigate(`/admin/users/${user.id}`)}>
                        <img 
                            src={user.avatarUrl} 
                            className="w-12 h-12 rounded-full object-cover border border-white/10" 
                            alt={user.username} 
                        />
                        {user.verificationStatus === 'verified' && (
                            <div className="absolute -bottom-0.5 -right-0.5 bg-primary text-white rounded-full p-0.5 border-2 border-background">
                                <CheckCircle size={8} />
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white cursor-pointer hover:text-primary" onClick={() => onNavigate(`/admin/users/${user.id}`)}>
                            @{user.username}
                        </h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${user.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {user.status}
                </div>
            </div>

            {/* Stats */}
            {!compact && (
                <div className="flex gap-4 text-[10px] text-gray-400">
                    <div><span className="font-bold text-white">{(user.walletBalance || 0).toLocaleString()}</span> LSC</div>
                    <div>Joined <span className="font-bold text-white">{new Date(user.joinedAt).toLocaleDateString()}</span></div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
                <button onClick={() => onNavigate(`/admin/users/${user.id}`)} className="text-xs font-bold text-primary hover:text-white">View Profile</button>
                <div className="flex gap-2">
                    <button onClick={() => onAction(user.id, 'warn')} className="text-gray-500 hover:text-yellow-500"><MessageCircle size={16} /></button>
                    <button onClick={() => onAction(user.id, user.status === 'active' ? 'ban' : 'activate')} className={`text-gray-500 hover:${user.status === 'active' ? 'text-red-500' : 'text-green-500'}`}>
                        {user.status === 'active' ? <Ban size={16} /> : <Unlock size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
};
