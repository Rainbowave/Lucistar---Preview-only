
import React, { useState, useEffect } from 'react';
import { 
    Shield, Plus, Edit2, Trash2, Check, X, Users, Video, 
    Image as ImageIcon, Smartphone, BookOpen, Radio, ShoppingBag, 
    FileText, Megaphone, Wallet, Settings, Activity, Lock, Heart, LayoutGrid, Gamepad2
} from 'lucide-react';
import { db } from '../../services/db';

// Define the structure for permissions based on services/db.ts
interface Permission {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
}

interface RolePermissions {
    users: Permission;
    content: Permission;
    photos: Permission;
    videos: Permission;
    shorts: Permission;
    comics: Permission;
    live: Permission;
    collection: Permission;
    resources: Permission;
    arcade: Permission;
    ads: Permission;
    finance: Permission;
    settings: Permission;
    engagement: Permission;
    board: Permission;
}

interface Role {
    id: string;
    title: string;
    description: string;
    type: 'system' | 'custom';
    color: string;
    permissions: RolePermissions;
}

const SECTIONS = [
    { key: 'users', label: 'Users', icon: Users },
    { key: 'content', label: 'Content Manager', icon: Activity },
    { key: 'board', label: 'Board Manager', icon: LayoutGrid },
    { key: 'photos', label: 'Photos', icon: ImageIcon },
    { key: 'videos', label: 'Videos', icon: Video },
    { key: 'shorts', label: 'Shorts', icon: Smartphone },
    { key: 'comics', label: 'Comics', icon: BookOpen },
    { key: 'live', label: 'Live Streams', icon: Radio },
    { key: 'collection', label: 'Collection', icon: ShoppingBag },
    { key: 'resources', label: 'Knowledge', icon: FileText },
    { key: 'arcade', label: 'Arcade', icon: Gamepad2 },
    { key: 'ads', label: 'Ads Manager', icon: Megaphone },
    { key: 'finance', label: 'Finance', icon: Wallet },
    { key: 'engagement', label: 'Engagement', icon: Heart }, 
    { key: 'settings', label: 'Global Settings', icon: Settings },
];

export default function AdminRoles() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newRole, setNewRole] = useState({ title: '', description: '', color: '#6b7280' });

    useEffect(() => {
        // Load roles from DB
        const loadRoles = async () => {
             await new Promise(r => setTimeout(r, 600));
             setRoles(await db.getRoles() as Role[]);
             setLoading(false);
        };
        loadRoles();
    }, []);

    const handleDelete = (id: string) => {
        if (confirm('Delete this role?')) {
            // In a real app, call delete API
            setRoles(roles.filter(r => r.id !== id));
        }
    };

    const handleCreate = () => {
        if (!newRole.title) return;
        const role: Role = {
            id: `role_${Date.now()}`,
            title: newRole.title,
            description: newRole.description,
            type: 'custom',
            color: `text-[${newRole.color}]`, // Store as custom class or just hex if handling differently
            // For now, let's store the hex and handle display logic
            permissions: {
                users: { view: false, create: false, edit: false, delete: false },
                content: { view: false, create: false, edit: false, delete: false },
                photos: { view: false, create: false, edit: false, delete: false },
                videos: { view: false, create: false, edit: false, delete: false },
                shorts: { view: false, create: false, edit: false, delete: false },
                comics: { view: false, create: false, edit: false, delete: false },
                live: { view: false, create: false, edit: false, delete: false },
                collection: { view: false, create: false, edit: false, delete: false },
                resources: { view: false, create: false, edit: false, delete: false },
                arcade: { view: false, create: false, edit: false, delete: false },
                ads: { view: false, create: false, edit: false, delete: false },
                finance: { view: false, create: false, edit: false, delete: false },
                settings: { view: false, create: false, edit: false, delete: false },
                engagement: { view: false, create: false, edit: false, delete: false },
                board: { view: false, create: false, edit: false, delete: false }
            }
        };
        // Adjust color storage to match existing pattern if possible, or adapt display
        // The existing pattern uses Tailwind classes like 'text-red-500'. 
        // If we want hex, we should probably store the hex and apply it via style or arbitrary value.
        // Let's store the hex directly in the 'color' field, and update the display component to handle it.
        role.color = newRole.color; 

        setRoles([...roles, role]);
        setShowCreateModal(false);
        setNewRole({ title: '', description: '', color: '#6b7280' });
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 flex items-center gap-3">
                        <Shield className="text-brand-500" size={32} />
                        Role & Permissions
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Define access levels for Engagement Pride and Staff.
                    </p>
                </div>
                <button onClick={() => setShowCreateModal(true)} className="bg-white text-black px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-200 transition-colors">
                    <Plus size={14} /> Create Role
                </button>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-4">Create New Role</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Role Title</label>
                                <input 
                                    type="text" 
                                    value={newRole.title}
                                    onChange={e => setNewRole({...newRole, title: e.target.value})}
                                    className="w-full bg-dark-800 border border-white/5 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none"
                                    placeholder="e.g. Senior Moderator"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                                <input 
                                    type="text" 
                                    value={newRole.description}
                                    onChange={e => setNewRole({...newRole, description: e.target.value})}
                                    className="w-full bg-dark-800 border border-white/5 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none"
                                    placeholder="Role purpose..."
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Color Theme (Hex)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={newRole.color}
                                        onChange={e => setNewRole({...newRole, color: e.target.value})}
                                        className="h-10 w-10 rounded bg-transparent border-0 cursor-pointer"
                                    />
                                    <input 
                                        type="text" 
                                        value={newRole.color}
                                        onChange={e => setNewRole({...newRole, color: e.target.value})}
                                        className="flex-1 bg-dark-800 border border-white/5 rounded-lg p-3 text-sm text-white focus:border-brand-500 outline-none font-mono"
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-lg border border-white/10 text-gray-400 font-bold text-xs hover:bg-white/5">Cancel</button>
                                <button onClick={handleCreate} className="flex-1 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-black text-xs uppercase tracking-widest">Create Role</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {roles.map(role => (
                    <div key={role.id} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl flex flex-col group hover:border-brand-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/5"
                                    style={{ 
                                        backgroundColor: String(role.color).startsWith('text-') ? undefined : `${String(role.color)}20`,
                                        color: String(role.color).startsWith('text-') ? undefined : String(role.color)
                                    }}
                                >
                                    <Shield 
                                        size={20} 
                                        className={String(role.color).startsWith('text-') ? String(role.color).replace('bg-', 'text-').split(' ')[0] : ''} 
                                        style={{ color: String(role.color).startsWith('text-') ? undefined : String(role.color) }}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-base">{role.title}</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{role.type}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-dark-900 rounded-lg text-gray-400 hover:text-white transition-colors">
                                    <Edit2 size={14} />
                                </button>
                                {role.type !== 'system' && (
                                    <button onClick={() => handleDelete(role.id)} className="p-2 hover:bg-red-900/20 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 mb-6 min-h-[40px]">{role.description}</p>

                        <div className="flex-1 space-y-1 bg-dark-900/30 rounded-xl p-2 border border-white/5 overflow-y-auto max-h-[300px] custom-scrollbar">
                             {SECTIONS.map(section => {
                                 // Safely access permission
                                 const p = (role.permissions as any)[section.key];
                                 if (!p?.view) return null; // Only show active sections
                                 
                                 return (
                                     <div key={section.key} className="flex items-center justify-between p-2 bg-dark-900/50 rounded border border-white/5">
                                         <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                                             <section.icon size={12} className="text-gray-500" /> {section.label}
                                         </div>
                                         <div className="flex gap-1">
                                             {p.create && <span className="text-[9px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-black">ADD</span>}
                                             {p.edit && <span className="text-[9px] bg-blue-500/20 text-blue-500 px-1.5 py-0.5 rounded font-black">EDIT</span>}
                                             {p.delete && <span className="text-[9px] bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded font-black">DEL</span>}
                                             {!p.create && !p.edit && !p.delete && <span className="text-[9px] bg-gray-500/20 text-gray-500 px-1.5 py-0.5 rounded font-black">VIEW</span>}
                                         </div>
                                     </div>
                                 )
                             })}
                             {Object.values(role.permissions || {}).every((p: any) => !p.view) && (
                                 <div className="text-center py-4 text-gray-500 text-xs font-bold uppercase tracking-widest">No active permissions.</div>
                             )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
