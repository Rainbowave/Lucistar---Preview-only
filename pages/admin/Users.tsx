
import React, { useState, useEffect } from 'react';
import { 
    Search, Shield, RefreshCw, ChevronLeft, 
    Users, Briefcase, Crown, 
    Image as ImageIcon, Video, Smartphone,
    BarChart2, BookOpen, Radio, ShoppingBag, FileText, Gamepad2
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db } from '../../services/db';
import { UserRole } from '../../types';
import { authService } from '../../services/authService';
import { UserCard } from '../../components/admin/UserCard';
import { PimpUserCard } from '../../components/admin/PimpUserCard';

interface AdminUser {
    id: string;
    username: string;
    email: string;
    displayName: string;
    role: UserRole;
    status: 'active' | 'banned' | 'suspended';
    joinedAt: string;
    avatarUrl: string;
    reportsCount?: number;
    verificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
    walletBalance: number;
    isLuciStar?: boolean;
    isLuciStarPremium?: boolean;
    isPremium?: boolean;
    contentPreference?: 'dating' | 'adult';
    moderatorSquad?: string; // e.g., 'PHOTO', 'VIDEO'
}

import { ModeratorSquadCard } from '../../components/admin/ModeratorSquadCard';

export default function AdminUsers() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlFilter = searchParams.get('filter');
    const squadFilter = searchParams.get('squad');
    
    const currentUser = authService.getCurrentUser();
    const isAdmin = currentUser?.role === 'admin'; 
    
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12; // Adjusted for grid
    
    // Global Context
    const [adminMode, setAdminMode] = useState<'dating' | 'naughty'>((localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating');

    useEffect(() => {
        const handleModeChange = () => {
             const mode = (localStorage.getItem('admin_view_mode') as 'dating' | 'naughty') || 'dating';
             setAdminMode(mode);
        };
        window.addEventListener('admin-mode-change', handleModeChange);
        return () => window.removeEventListener('admin-mode-change', handleModeChange);
    }, []);

    useEffect(() => {
        if (urlFilter === 'subscribed') {
            setRoleFilter('premium'); 
        } else if (urlFilter === 'moderators') {
            setRoleFilter('moderator');
        } else if (urlFilter === 'roles') {
            setRoleFilter('all');
        } else if (urlFilter === 'pimp') {
            setRoleFilter('all'); // Pimp is a property, not a role
        } else {
            setRoleFilter('all');
        }
    }, [urlFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); 
            
            // STRICT FILTERING: Use DB Service with context
            const context = adminMode === 'naughty' ? 'adult' : 'dating';
            const data = await db.getUsers(context);
            
            // Mock assigning squads for demo purposes if not present
            const enhancedData = data.map((u: any, i: number) => {
                if (u.role === 'moderator' && !u.moderatorSquad) {
                    const squads = ['PHOTO', 'VIDEO', 'SHORT', 'POST', 'COMIC', 'LIVE', 'COLLECTION', 'RESOURCE', 'ARCADE'];
                    return { ...u, moderatorSquad: squads[i % squads.length] };
                }
                return u;
            });

            setUsers(enhancedData as AdminUser[]);
        } finally {
            setLoading(false);
        }
    };

    const [roles, setRoles] = useState<any[]>([]);

    useEffect(() => {
        fetchUsers();
        db.getRoles().then(setRoles);
    }, [adminMode]);

    const handleRoleChange = (userId: string, newRole: string) => {
        if (window.confirm(`Change user role to ${newRole}?`)) {
            db.updateUser(userId, { role: newRole });
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as any } : u));
        }
    };

    const filteredUsers = users.filter(user => {
        // Search Filter
        const matchesSearch = user.username.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
        
        // Role Filter
        let matchesRole = true;
        if (roleFilter === 'premium') matchesRole = !!user.isPremium;
        else if (roleFilter === 'moderator') matchesRole = user.role === 'moderator' || user.role === 'admin';
        else if (roleFilter !== 'all') matchesRole = user.role === roleFilter;

        // Squad Filter (If in Moderator View)
        let matchesSquad = true;
        if (roleFilter === 'moderator' && squadFilter) {
            matchesSquad = user.moderatorSquad === squadFilter;
        }

        // Pimp Filter
        let matchesPimp = true;
        if (urlFilter === 'pimp') {
            matchesPimp = !!(user as any).pimpSettings?.active;
        }

        // Status Filter
        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        
        return matchesSearch && matchesRole && matchesStatus && matchesSquad && matchesPimp;
    });

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const handleSquadClick = (squadName: string) => {
        setSearchParams({ filter: 'moderators', squad: squadName });
    };

    const handleBackToSquads = () => {
        setSearchParams({ filter: 'moderators' }); // Removes squad param
    };

    // If Viewing Moderators AND No Squad Selected -> Show Squad Grid
    const showSquadGrid = roleFilter === 'moderator' && !squadFilter;

    // Counts for Grid
    const getSquadCount = (squad: string) => users.filter(u => u.role === 'moderator' && u.moderatorSquad === squad).length;

    const handleAction = (userId: string, type: 'warn' | 'suspend' | 'ban' | 'activate') => {
        if (type === 'warn') {
            const reason = prompt("Enter warning reason:", "Community guidelines violation");
            if (reason) {
                db.warnUser(userId, reason);
                alert(`Warning sent to @${userId}`);
            }
            return;
        }

        const newStatus = type === 'activate' ? 'active' : type === 'suspend' ? 'suspended' : 'banned';
        const confirmMsg = `${type.toUpperCase()} user @${userId}?`;

        if (window.confirm(confirmMsg)) {
            const updated = db.updateUser(userId, { status: newStatus });
            if (updated) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
                db.logAction({ userId: 'admin', action: `${newStatus}_user`, targetType: 'user', targetId: userId, details: `Admin ${type} action` });
            }
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-1 flex items-center gap-3">
                        {squadFilter && <button onClick={handleBackToSquads} className="p-1 hover:bg-white/10 rounded-full mr-2"><ChevronLeft /></button>}
                        {roleFilter === 'premium' ? <Crown className="text-yellow-500" /> : 
                         roleFilter === 'moderator' ? <Shield className="text-blue-500" /> :
                         urlFilter === 'pimp' ? <Crown className="text-purple-500" /> :
                         urlFilter === 'roles' ? <Briefcase className="text-brand-500" /> : null}
                        {squadFilter ? `${squadFilter} Squad` : 
                         roleFilter === 'premium' ? 'Subscribed Users' : 
                         roleFilter === 'moderator' ? 'Engagement Pride Teams' :
                         urlFilter === 'pimp' ? 'Pimp Users' :
                         urlFilter === 'roles' ? 'Role Management' : 'User Management'}
                    </h1>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Database: <span className={adminMode === 'naughty' ? 'text-brand-500' : 'text-brand-second'}>{adminMode.toUpperCase()}</span> Only
                    </p>
                </div>
                <button onClick={fetchUsers} className="p-3 bg-card rounded-[5px] border border-border text-gray-400 hover:text-white transition-all">
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Render Squad Grid View */}
            {showSquadGrid ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    <ModeratorSquadCard title="Photo" icon={ImageIcon} color="bg-blue-500" count={getSquadCount('PHOTO')} onClick={() => handleSquadClick('PHOTO')} />
                    <ModeratorSquadCard title="Video" icon={Video} color="bg-red-500" count={getSquadCount('VIDEO')} onClick={() => handleSquadClick('VIDEO')} />
                    <ModeratorSquadCard title="Shorts" icon={Smartphone} color="bg-purple-500" count={getSquadCount('SHORT')} onClick={() => handleSquadClick('SHORT')} />
                    <ModeratorSquadCard title="Posts & Polls" icon={BarChart2} color="bg-gray-500" count={getSquadCount('POST')} onClick={() => handleSquadClick('POST')} />
                    <ModeratorSquadCard title="Comics" icon={BookOpen} color="bg-yellow-500" count={getSquadCount('COMIC')} onClick={() => handleSquadClick('COMIC')} />
                    <ModeratorSquadCard title="Live" icon={Radio} color="bg-green-500" count={getSquadCount('LIVE')} onClick={() => handleSquadClick('LIVE')} />
                    <ModeratorSquadCard title="Collection" icon={ShoppingBag} color="bg-orange-500" count={getSquadCount('COLLECTION')} onClick={() => handleSquadClick('COLLECTION')} />
                    <ModeratorSquadCard title="Knowledge" icon={FileText} color="bg-cyan-500" count={getSquadCount('RESOURCE')} onClick={() => handleSquadClick('RESOURCE')} />
                    <ModeratorSquadCard title="Arcade" icon={Gamepad2} color="bg-pink-500" count={getSquadCount('ARCADE')} onClick={() => handleSquadClick('ARCADE')} />
                </div>
            ) : (
                /* Render User Grid View */
                <>
                    <div className="bg-card border border-border rounded-[5px] p-4 mb-8 flex flex-col md:flex-row gap-4 shadow-xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search by name or email..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-background border border-border rounded-[5px] py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-primary" 
                            />
                        </div>
                        <div className="flex gap-2">
                             {/* Only show role dropdown if NOT in moderator view specifically */}
                             {roleFilter !== 'moderator' && urlFilter !== 'pimp' && (
                                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-background border border-border text-xs font-bold text-white rounded-[5px] px-4 py-3 outline-none">
                                    <option value="all">All Roles</option>
                                    <option value="premium">Premium</option>
                                    <option value="user">Member</option>
                                    <option value="creator">Creator</option>
                                    <option value="moderator">Engagement Pride</option>
                                    <option value="admin">Admin</option>
                                </select>
                             )}
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-background border border-border text-xs font-bold text-white rounded-[5px] px-4 py-3 outline-none">
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="banned">Banned</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {paginatedUsers.map(u => (
                            urlFilter === 'pimp' ? (
                                <PimpUserCard key={u.id} user={u} onAction={handleAction} onNavigate={navigate} />
                            ) : (
                                <UserCard key={u.id} user={u} onRoleChange={handleRoleChange} onAction={handleAction} onNavigate={navigate} />
                            )
                        ))}
                    </div>
                    
                    {paginatedUsers.length === 0 && (
                        <div className="py-12 text-center text-gray-500 font-bold uppercase tracking-widest text-xs bg-card rounded-[5px] border border-border">
                            No users found.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
