import React, { useState, useEffect } from 'react';
import { Save, ThumbsUp, Image, Link as LinkIcon, Loader2, CheckCircle } from 'lucide-react';
import { db } from '../../services/db';

const SettingCard = ({ title, icon: Icon, children, color = "text-brand-500", bgColor = "bg-brand-500/10", borderColor = "border-brand-500/20" }: any) => (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 shadow-xl h-full flex flex-col group hover:border-brand-500/30 transition-all">
        <div className="flex items-center gap-3 mb-6 border-b border-dark-700 pb-4">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} />
            </div>
            <h3 className="font-black text-white text-sm uppercase tracking-wide">{title}</h3>
        </div>
        <div className="space-y-5 flex-1">
            {children}
        </div>
    </div>
);

const InputGroup = ({ label, value, onChange, suffix, help, icon: Icon }: { label: string, value: string | number, onChange: (val: string) => void, suffix?: string, help?: string, icon?: any }) => (
    <div className="mb-4">
        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
            {Icon && <Icon size={12} className="text-gray-400" />}
            {label}
        </label>
        <div className="relative">
            <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-dark-900 border border-white/5 rounded-lg px-4 py-3 text-white font-bold text-sm focus:border-brand-500 outline-none transition-all"
            />
            {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-500 uppercase tracking-widest">{suffix}</span>}
        </div>
        {help && <p className="text-[9px] text-gray-600 mt-1.5 ml-1 font-medium">{help}</p>}
    </div>
);

export default function CommunitySettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const load = async () => {
            await new Promise(r => setTimeout(r, 600));
            setSettings(await db.getCommunitySettings());
            setLoading(false);
        };
        load();
    }, []);

    const handleChange = (key: string, value: any) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        await db.saveCommunitySettings(settings);
        setSuccess(true);
        setSaving(false);
        setTimeout(() => setSuccess(false), 3000);
    };

    if (loading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-brand-500" /></div>;

    return (
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <ThumbsUp className="text-brand-500" size={32} />
                        Community Settings
                    </h1>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                        Manage community interaction and content settings.
                    </p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-black py-3 px-8 rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Config
                </button>
            </div>

            {success && (
                <div className="bg-green-900/20 border border-green-500/50 rounded-xl p-4 mb-8 flex items-center gap-3 text-green-400 animate-in fade-in">
                    <CheckCircle size={20} />
                    <span className="font-bold">Community settings updated successfully.</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingCard title="SEO Performance" icon={Image} color="text-green-500" bgColor="bg-green-500/10" borderColor="border-green-500/20">
                    <InputGroup 
                        label="Image Compressor API" 
                        value={settings.squooshLink}
                        onChange={(v) => handleChange('squooshLink', v)}
                        help="Link to squoosh.app API for image compression."
                        icon={LinkIcon}
                    />
                </SettingCard>
                <SettingCard title="Community Suggestions" icon={ThumbsUp} color="text-blue-500" bgColor="bg-blue-500/10" borderColor="border-blue-500/20">
                    <p className="text-sm text-gray-400">This section is under development.</p>
                </SettingCard>
            </div>
        </div>
    );
}
