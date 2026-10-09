
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, UserPlus, LogIn, ArrowRight, Globe, Radio, Flame, Crown, X, Users, Loader2 } from 'lucide-react';
import { AgeGate } from '../../components/auth/AgeGate';
import { authService } from '../../services/authService';

export default function AuthEntry() {
    const navigate = useNavigate();
    const [isAgeVerified, setIsAgeVerified] = useState(false);
    const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
    const [stats, setStats] = useState({ stars: 5241, viewers: 124502 });

    const handleGoogleAuth = async () => {
        setIsLoadingGoogle(true);
        try {
            await authService.loginWithGoogle();
            navigate('/home');
        } catch (e) {
            console.error("Google sign in failed:", e);
            setIsLoadingGoogle(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => ({
                stars: prev.stars + Math.floor(Math.random() * 5) - 2,
                viewers: prev.viewers + Math.floor(Math.random() * 50) - 20
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleAgeVerify = (verified: boolean) => {
        if (verified) setIsAgeVerified(true);
    };

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Pattern Background */}
            <div className="absolute top-[-150px] left-[-200px] right-[-200px] bottom-[-150px] z-0 pointer-events-none opacity-20 animate-scroll-bg" style={{ 
                backgroundImage: 'url(https://picsum.photos/200/150?grayscale&blur=2)', 
                backgroundSize: '200px 150px' 
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/90 to-dark-900 pointer-events-none z-10"></div>

            <div className="w-full max-w-xl relative z-30">
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-4 mb-4 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-16 h-16 bg-white text-black rounded flex items-center justify-center text-4xl font-black shadow-2xl shadow-brand-900/50">L</div>
                        <div className="text-left">
                            <span className="text-5xl font-black text-white tracking-tighter uppercase leading-none block drop-shadow-lg">LuciSin</span>
                            <span className="text-[10px] text-gray-600 font-black uppercase tracking-[0.5em] ml-1">The Network</span>
                        </div>
                    </div>
                </div>

                <div className="bg-dark-800/80 backdrop-blur-md border border-white/5 rounded p-8 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    {!isAgeVerified ? (
                        <div className="animate-in fade-in duration-500">
                            <AgeGate onVerify={handleAgeVerify} />
                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
                                <div className="flex gap-12">
                                    <div className="text-center">
                                        <div className="text-white font-black text-xl tracking-tighter uppercase">{stats.stars.toLocaleString()}</div>
                                        <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">Stars Live</div>
                                    </div>
                                    <div className="w-px h-8 bg-white/5"></div>
                                    <div className="text-center">
                                        <div className="text-white font-black text-xl tracking-tighter  uppercase">{(stats.viewers / 1000).toFixed(1)}K</div>
                                        <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-1">Watching</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-[9px] text-gray-600 uppercase font-black tracking-widest">
                                    <Shield size={14} className="text-brand-500" />
                                    <span>Encrypted Entry System</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-500">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black text-white mb-2 uppercase  tracking-tighter">Sign In</h2>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Select your authentication path</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={handleGoogleAuth}
                                    disabled={isLoadingGoogle}
                                    className="group w-full bg-[#1e232d] hover:bg-[#282f3c] border border-white/10 text-white p-4.5 rounded-xl flex items-center justify-between active:scale-[0.98] transition-all shadow-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 bg-white/5 rounded-lg flex items-center justify-center">
                                            {isLoadingGoogle ? (
                                                <Loader2 size={20} className="animate-spin text-white" />
                                            ) : (
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                                                    <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                                                    <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.5 1.9 7.8l3.7-2.9z"/>
                                                    <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
                                                </svg>
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black text-lg uppercase tracking-tight leading-none mb-1 text-white">Google Account</div>
                                            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Instant Firebase Access</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={18} className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </button>

                                <button 
                                    onClick={() => navigate('/auth/login')}
                                    className="group w-full bg-white text-black p-5 rounded flex items-center justify-between active:scale-[0.98] transition-all hover:bg-gray-100 shadow-lg"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-black/5 rounded flex items-center justify-center">
                                            <LogIn size={24} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black text-xl uppercase tracking-tighter leading-none mb-1 ">Sign In</div>
                                            <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Existing Identity</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-gray-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                </button>

                                <button 
                                    onClick={() => navigate('/auth/register')}
                                    className="group w-full bg-brand-600 text-white p-5 rounded flex items-center justify-between active:scale-[0.98] transition-all hover:bg-brand-500 shadow-xl shadow-brand-900/30"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                                            <UserPlus size={24} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-black text-xl uppercase tracking-tighter leading-none mb-1 ">Sign Up</div>
                                            <div className="text-[9px] text-brand-200 font-black uppercase tracking-widest">New Star Identity</div>
                                        </div>
                                    </div>
                                    <ArrowRight size={20} className="text-brand-300 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </button>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="space-y-1">
                                        <div className="text-white font-black text-[10px] uppercase  flex items-center justify-center gap-1">
                                            <Users size={12} className="text-blue-500" /> Global
                                        </div>
                                        <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Reach</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-white font-black text-[10px] uppercase  flex items-center justify-center gap-1">
                                            <Crown size={12} className="text-yellow-500" /> 100%
                                        </div>
                                        <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Share</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-white font-black text-[10px] uppercase  flex items-center justify-center gap-1">
                                            <Flame size={12} className="text-red-500" /> Secure
                                        </div>
                                        <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Platform</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
