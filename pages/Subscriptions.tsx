
import React, { useState, useEffect } from 'react';
import { 
    Star, Zap, Crown, Check, Info, Coins, Shield, 
    Smartphone, X, CreditCard, Loader2, CheckCircle, 
    Bitcoin, RefreshCw, Layers, ShoppingBag, ArrowRight, 
    Flame, Sparkles, Database, UserCheck, Heart, Layout, Activity,
    Video, Image as ImageIcon, Ghost, BarChart, Monitor, Ban, Shuffle, Percent, Users, Gift, TrendingUp, Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { db } from '../services/db';

const PLANS = [
    {
        id: 'lucistar',
        title: 'Lusciou Star',
        price: '14.99',
        type: 'silver',
        icon: Star,
        features: [
            'Colored Name',
            'Wider Content Reach (1.5x)',
            '740p Video Quality',
            'Unlimited Random Cam',
            'Arcade Loss Recovery (2.5%)',
            'Download Content',
            'Poll Ticket Revenue',
            'Revenue Fees',
            'Profile Muse Priority',
            'No Watermark Downloads',
            'Auto AI Tags'
        ]
    },
    {
        id: 'lucistar_premium',
        title: 'Luci Star',
        price: '19.99',
        type: 'gold',
        icon: Crown,
        features: [
            'Gradient Name',
            'Double Reach Wider (2x Algo)',
            '1080p Resolution',
            'No Watermark Downloads',
            'Unlimited Random Cam',
            'Arcade Loss Recovery (5%)',
            'Create Intimacy Circles',
            'Custom Tip Icons',
            'Auto AI Tags',
            'LuciStar Interest Search Priority',
            'Download Content',
            'Poll Ticket Revenue',
            'Revenue Fees',
            'Profile Muse Priority',
            'Double Engagement Points',
            'Reduced Naughty Mode Fee'
        ]
    }
];

const PACKAGES = [
    { id: 1, amount: 500, price: 4.99, bonus: 0, icon: Zap, color: 'bg-blue-500' },
    { id: 3, amount: 3500, price: 24.99, bonus: 500, icon: Zap, color: 'bg-blue-500' },
    { id: 4, amount: 8000, price: 49.99, bonus: 1500, icon: Flame, color: 'bg-orange-500' }
];

const BOOSTS = [
    { 
        id: 1, 
        title: 'Profile Boost', 
        price: '9.99', 
        duration: '24 Hours', 
        description: 'Priority in search & discovery. Get seen by more potential fans.', 
        estimation: 'Est. 5k - 10k Views',
        icon: UserCheck, 
        color: 'bg-purple-500' 
    },
    { 
        id: 2, 
        title: 'Intimacy Circle Boost', 
        price: '14.99', 
        duration: '48 Hours', 
        description: 'Boost your circle visibility. Attract more members to your private space.', 
        estimation: 'Est. 50 - 200 Joins',
        icon: Heart, 
        color: 'bg-pink-500' 
    },
    { 
        id: 3, 
        title: 'Timeline Boost', 
        price: '19.99', 
        duration: '72 Hours', 
        description: 'Push your posts, polls, photos, comics, and articles to the top of the feed.', 
        estimation: 'Est. 10k - 20k Impressions',
        icon: TrendingUp, 
        color: 'bg-emerald-500' 
    },
    { 
        id: 4, 
        title: 'Video Boost', 
        price: '24.99', 
        duration: '72 Hours', 
        description: 'Amplify your videos and shorts reach across the platform.', 
        estimation: 'Est. 15k - 30k Views',
        icon: Video, 
        color: 'bg-blue-500' 
    },
    { 
        id: 5, 
        title: 'Collection Boost', 
        price: '29.99', 
        duration: '72 Hours', 
        description: 'Feature your digital products and assets in the marketplace.', 
        estimation: 'Est. 100 - 500 Buys',
        icon: ShoppingBag, 
        color: 'bg-orange-500' 
    },
    { 
        id: 6, 
        title: 'Stream Boost', 
        price: '14.99', 
        duration: '24 Hours', 
        description: 'Get featured on the live streams page and attract more viewers.', 
        estimation: 'Est. 1k - 5k Viewers',
        icon: Activity, 
        color: 'bg-red-500' 
    }
];

// Helper to check for active season
const checkSeasonalSync = (settings: any) => {
    if (!settings?.monetization?.seasonalDiscountActive) return false;
    const today = new Date();
    const currentM = today.getMonth(); 
    const currentD = today.getDate();
    const cal = settings.appearance?.calendar;
    if (!cal) return false;
    
    const inRange = (cfg: any) => {
        if (!cfg) return false;
        const { startMonth: sm, startDay: sd, endMonth: em, endDay: ed } = cfg;
        if (sm === em) return currentM === sm && currentD >= sd && currentD <= ed;
        return (currentM === sm && currentD >= sd) || (currentM === em && currentD <= ed) || (currentM > sm && currentM < em);
    };

    return inRange(cal.prideDay) || inRange(cal.comingOut) || inRange(cal.halloween) || inRange(cal.christmas) || inRange(cal.newYear);
};

const PlanCard = ({ title, price, features, icon: Icon, isGold, onSelect, discountActive, type }: any) => {
    const finalPrice = discountActive ? (parseFloat(price) * 0.85).toFixed(2) : price;
    const isSilver = type === 'silver';

    // Feature Icons Mapping
    const getFeatureIcon = (feature: string) => {
        if (feature.includes('1080p') || feature.includes('740p')) return <Monitor size={14} />;
        if (feature.includes('Ad-Free') || feature.includes('Zero Ads')) return <Ban size={14} />;
        if (feature.includes('Random Cam')) return <Shuffle size={14} />;
        if (feature.includes('Arcade')) return <RefreshCw size={14} />;
        if (feature.includes('Circles')) return <Users size={14} />;
        if (feature.includes('Points')) return <Zap size={14} />;
        if (feature.includes('Reach')) return <TrendingUp size={14} />;
        if (feature.includes('Name') || feature.includes('Profile')) return <UserCheck size={14} />;
        if (feature.includes('Download')) return <Download size={14} />;
        if (feature.includes('Revenue') || feature.includes('Fees')) return <Coins size={14} />;
        if (feature.includes('AI Tags')) return <Sparkles size={14} />;
        return <Check size={14} strokeWidth={3} />;
    };

    // Style logic for Gold vs Silver
    const borderClass = isGold ? 'border-yellow-500/50' : 'border-slate-300/30';
    const bgClass = isGold 
        ? 'bg-gradient-to-br from-yellow-900/40 to-dark-900' 
        : 'bg-gradient-to-br from-slate-800/40 to-dark-900';
    const textAccent = isGold ? 'text-yellow-500' : 'text-slate-300';
    const iconBg = isGold ? 'bg-yellow-500 text-black border-yellow-400' : 'bg-slate-300 text-black border-slate-200';
    const buttonClass = isGold ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-slate-300 text-black hover:bg-slate-200';
    const glowColor = isGold ? 'bg-yellow-500/10' : 'bg-slate-400/10';

    return (
        <div className={`group relative rounded-3xl transition-all duration-500 overflow-hidden border ${borderClass} ${bgClass} shadow-2xl ${isGold ? 'scale-[1.02]' : ''}`}>
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-64 h-64 ${glowColor} rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>

            <div className={`h-full w-full p-8 flex flex-col relative z-10`}>
                {isGold && (
                    <div className="absolute top-6 right-6 bg-yellow-500 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <Crown size={12} fill="currentColor" /> Creator Choice
                    </div>
                )}
                {isSilver && (
                    <div className="absolute top-6 right-6 bg-slate-300 text-black px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1">
                        <Star size={12} fill="currentColor" /> Luscious choice
                    </div>
                )}
                
                <div className="mb-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border shadow-lg ${iconBg}`}>
                        <Icon size={32} strokeWidth={2} fill={isGold ? "currentColor" : "none"} />
                    </div>
                    <h3 className={`text-2xl font-black uppercase tracking-tighter ${isGold ? 'text-white' : 'text-gray-200'}`}>{title}</h3>
                    <div className="mt-4 flex items-baseline gap-1">
                        <span className={`text-5xl font-black tracking-tighter tabular-nums ${textAccent}`}>{finalPrice} LSC</span>
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">/ Month</span>
                    </div>
                    {discountActive && <div className="text-[10px] font-bold text-green-400 uppercase tracking-widest mt-2 animate-pulse">Seasonal Offer Applied</div>}
                </div>

                <div className="space-y-4 mb-10 flex-1">
                    {features.map((feature: any, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isGold ? 'bg-yellow-500/20 text-yellow-500' : 'bg-slate-500/20 text-slate-300'}`}>
                                {getFeatureIcon(feature)}
                            </div>
                            <span className={`text-xs font-bold ${isGold ? 'text-white' : 'text-gray-400'}`}>
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                <button 
                    onClick={() => onSelect(title, finalPrice)}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.15em] text-xs transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${buttonClass}`}
                >
                    {isGold ? <Crown size={16} fill="currentColor"/> : <Star size={16} />}
                    Select {title}
                </button>
            </div>
        </div>
    );
};

const CoinPackage = ({ amount, price, bonus, icon: Icon, color, onSelect }: any) => (
    <div 
        onClick={() => onSelect(amount, price)}
        className="group bg-dark-800 border border-white/5 p-6 rounded-2xl hover:border-brand-500/40 transition-all cursor-pointer shadow-none relative overflow-hidden flex flex-col items-center text-center h-full"
    >
        <div className={`absolute -top-12 -right-12 w-24 h-24 ${color} opacity-0 group-hover:opacity-5 blur-[30px] transition-opacity`}></div>
        
        <div className={`w-12 h-12 rounded-xl bg-dark-900 border border-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 ${color.replace('bg-', 'text-')}`}>
            <Icon size={24} />
        </div>

        <div className="mb-4">
            <h4 className="text-2xl font-black text-white tracking-tighter mb-1">{amount.toLocaleString()} <span className="text-yellow-500 text-xs">LSC</span></h4>
            {bonus > 0 && (
                <div className="inline-block bg-yellow-500/10 text-yellow-500 text-[9px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/20 uppercase tracking-wide">
                    +{bonus} Bonus
                </div>
            )}
        </div>

        <div className="mt-auto w-full pt-4 border-t border-white/5">
            <div className="text-xl font-black text-white tabular-nums mb-3">{price} LSC</div>
            <button className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 font-black text-[9px] uppercase tracking-widest group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all rounded-lg">
                Purchase
            </button>
        </div>
    </div>
);

const BoostCard = ({ id, title, price, duration, description, estimation, icon: Icon, color, onSelect, isPurchased, isActive, timeLeft, onUse }: any) => {
    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <div 
            className="group bg-dark-800/30 border border-white/5 p-6 rounded-3xl hover:border-brand-500/40 transition-all shadow-none relative overflow-hidden flex flex-col h-full"
        >
            <div className={`absolute -top-12 -right-12 w-24 h-24 ${color} opacity-0 group-hover:opacity-10 blur-[40px] transition-opacity`}></div>
            
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex items-center justify-between">
                    <div className={`group-hover:scale-110 transition-transform duration-500 ${color.replace('bg-', 'text-')}`}>
                        <Icon size={32} strokeWidth={1.5} />
                    </div>
                    <div className="text-[10px] font-black text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-yellow-500/20">{duration}</div>
                </div>
                <h4 className="text-xl font-black text-white tracking-tight leading-tight">{title}</h4>
            </div>

            <div className="mb-8 flex-1 flex flex-col">
                <p className="text-gray-500 text-xs font-medium leading-relaxed mb-4">
                    {description}
                </p>
                <div className="mt-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 self-start">
                    <Activity size={12} className={color.replace('bg-', 'text-')} />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{estimation}</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Price</span>
                    <div className="text-2xl font-black text-white tabular-nums">{price} LSC</div>
                </div>
                
                <div className="flex gap-2">
                    {isActive ? (
                        <>
                            <button 
                                onClick={() => onSelect(title, price, id)}
                                className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 font-black text-[8px] uppercase tracking-widest hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all rounded-xl"
                            >
                                Buy More
                            </button>
                            <div className="flex-1 py-3 bg-brand-500/10 border border-brand-500/20 text-brand-500 font-black text-[8px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1">
                                <RefreshCw size={12} className="animate-spin" />
                                {formatTime(timeLeft)}
                            </div>
                        </>
                    ) : isPurchased ? (
                        <>
                            <button 
                                onClick={() => onSelect(title, price, id)}
                                className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 font-black text-[8px] uppercase tracking-widest hover:bg-brand-500 hover:text-white hover:border-brand-500 transition-all rounded-xl"
                            >
                                Buy More
                            </button>
                            <button 
                                onClick={() => onUse(id)}
                                className="flex-1 py-3 bg-brand-500 text-white font-black text-[8px] uppercase tracking-widest hover:bg-brand-400 transition-all rounded-xl shadow-lg shadow-brand-500/20"
                            >
                                Use Boost
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => onSelect(title, price, id)}
                            className="w-full py-3 bg-white/5 border border-white/10 text-gray-300 font-black text-[10px] uppercase tracking-widest group-hover:bg-brand-500 group-hover:text-white group-hover:border-brand-500 transition-all rounded-xl"
                        >
                            Activate Boost
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const TopUpIndicator = ({ onSelect }: { onSelect: (amount: number, price: string) => void }) => {
    const [amount, setAmount] = useState(500);
    const pointsPerDollar = 100;
    const price = (amount / pointsPerDollar).toFixed(2);
    
    // Calculate bonus based on amount
    const bonus = amount >= 5000 ? Math.floor(amount * 0.15) : amount >= 2000 ? Math.floor(amount * 0.05) : 0;

    return (
        <div className="bg-dark-800 border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-1">Amount Selection</div>
                        <h4 className="text-4xl font-black text-white tracking-tighter flex items-baseline gap-2">
                            {amount.toLocaleString()} <span className="text-yellow-500 text-sm">LSC</span>
                        </h4>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Total Price</div>
                        <div className="text-3xl font-black text-white tracking-tighter tabular-nums">{price} LSC</div>
                    </div>
                </div>

                {/* The Indicator / Slider */}
                <div className="relative h-12 flex items-center mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
                                style={{ width: `${((amount - 500) / (10000 - 500)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                    <input 
                        type="range" 
                        min="500" 
                        max="10000" 
                        step="100"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    {/* Ticks */}
                    <div className="absolute inset-0 flex justify-between items-center pointer-events-none px-1">
                        {[...Array(11)].map((_, i) => (
                            <div key={i} className={`w-0.5 h-2 rounded-full ${amount >= (500 + i * 950) ? 'bg-yellow-500' : 'bg-white/10'}`}></div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                        {bonus > 0 ? (
                            <div className="flex items-center gap-2 text-green-400 animate-pulse">
                                <Zap size={14} fill="currentColor" />
                                <span className="text-[10px] font-black uppercase tracking-widest">+{bonus.toLocaleString()} Bonus Included</span>
                            </div>
                        ) : (
                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">No bonus for this amount</div>
                        )}
                    </div>
                    <button 
                        onClick={() => onSelect(amount, price)}
                        className="px-10 py-3 bg-yellow-500 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/10"
                    >
                        Purchase Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Subscriptions() {
    const navigate = useNavigate();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentDetails, setPaymentDetails] = useState<{item: string, price: string, type: 'plan' | 'coins', rawPrice: number} | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto'>('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [hasDiscount, setHasDiscount] = useState(false);
    
    // Boost State
    const [purchasedBoosts, setPurchasedBoosts] = useState<number[]>([]);
    const [activeBoosts, setActiveBoosts] = useState<Record<number, number>>({}); // id -> seconds left

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveBoosts(prev => {
                const next = { ...prev };
                let changed = false;
                Object.keys(next).forEach(id => {
                    const numId = parseInt(id);
                    if (next[numId] > 0) {
                        next[numId] -= 1;
                        changed = true;
                    } else {
                        delete next[numId];
                        changed = true;
                    }
                });
                return changed ? next : prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleUseBoost = (id: number) => {
        // Simulate 24h timer (86400 seconds)
        setActiveBoosts(prev => ({ ...prev, [id]: 86400 }));
        setPurchasedBoosts(prev => prev.filter(bid => bid !== id));
    };

    useEffect(() => {
        // Just check for seasonal discount, plans are hardcoded now for "old settings" request
        const data = db.getSiteSettings();
        setHasDiscount(checkSeasonalSync(data));
    }, []);

    const openPayment = (item: string, price: string, type: 'plan' | 'coins', rawPrice: number, boostId?: number) => {
        setPaymentDetails({ item, price, type, rawPrice, boostId } as any);
        setIsPaymentModalOpen(true);
    };

    const handleSelectPlan = (plan: string, price: string) => {
        openPayment(plan + ' Membership', price + ' LSC', 'plan', Number(price));
    };

    const handleBuyCoins = (amount: number, price: string) => {
        openPayment(amount.toLocaleString() + ' LSC Coins', price + ' LSC', 'coins', Number(price));
    };

    const processPayment = async () => {
        if (!paymentDetails) return;
        setIsProcessing(true);
        try {
            await new Promise(r => setTimeout(r, 2000));
            
            // If it was a boost purchase, add to purchased
            const details = paymentDetails as any;
            if (details.boostId) {
                setPurchasedBoosts(prev => [...prev, details.boostId]);
            }
            
            setPaymentSuccess(true);
        } catch (e) {
            alert("Payment failure. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const closePayment = () => {
        setIsPaymentModalOpen(false);
        setPaymentSuccess(false);
        setPaymentDetails(null);
        if (paymentSuccess) navigate('/home');
    };

    return (
        <div className="w-full min-h-screen bg-dark-900 animate-in fade-in duration-700 pb-40">
            {isPaymentModalOpen && paymentDetails && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                    <div className="bg-dark-800 border border-white/10 rounded-3xl w-full max-w-md p-8 relative shadow-none">
                        <button onClick={closePayment} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"><X size={24}/></button>
                        
                        {!paymentSuccess ? (
                            <div className="animate-in zoom-in-95 duration-300">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-500 border border-brand-500/20">
                                        <CreditCard size={40} />
                                    </div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-1">{paymentDetails.item}</h2>
                                    <p className="text-yellow-500 font-black text-xl tabular-nums">{paymentDetails.price}</p>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <button 
                                        onClick={() => setPaymentMethod('card')}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === 'card' ? 'border-brand-500 bg-brand-500/5 shadow-none' : 'border-white/5 bg-dark-900 hover:border-white/10'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${paymentMethod === 'card' ? 'bg-brand-500 text-white' : 'bg-dark-800 text-gray-500'}`}>
                                            <CreditCard size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">Fiat Gateway</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">Secure via Stripe</div>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setPaymentMethod('crypto')}
                                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === 'crypto' ? 'border-orange-500 bg-orange-500/5 shadow-none' : 'border-white/5 bg-dark-900 hover:border-white/10'}`}
                                    >
                                        <div className={`p-2 rounded-lg ${paymentMethod === 'crypto' ? 'bg-orange-500 text-white' : 'bg-dark-800 text-gray-500'}`}>
                                            <Bitcoin size={24} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-white">Crypto Pulse</div>
                                            <div className="text-[10px] text-gray-500 font-bold uppercase">Via NowPayments</div>
                                        </div>
                                    </button>
                                </div>

                                <button 
                                    onClick={processPayment}
                                    disabled={isProcessing}
                                    className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-brand-second hover:text-white transition-all shadow-none active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Activation'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-10 animate-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                                    <CheckCircle size={64} />
                                </div>
                                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Activation Successful</h3>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Account assets successfully updated in your vault.</p>
                                <button onClick={closePayment} className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-none">Go to Home Feed</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto px-6 pt-16">
                <div className="text-center mb-16 relative">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                        Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">LuciStar</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-widest max-w-xl mx-auto text-xs">
                        Unlock elite creator tools, boost your earnings, and experience the platform without limits.
                    </p>
                    {hasDiscount && (
                        <div className="mt-6 animate-bounce bg-green-500 text-black inline-block px-4 py-1 rounded font-black uppercase text-xs shadow-lg">
                             Seasonal Offer Active!
                        </div>
                    )}
                </div>

                {/* Membership Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
                    {PLANS.map(plan => (
                        <PlanCard 
                            key={plan.id}
                            title={plan.title}
                            price={plan.price}
                            icon={plan.icon}
                            isGold={plan.type === 'gold'}
                            type={plan.type}
                            features={plan.features}
                            onSelect={handleSelectPlan}
                            discountActive={hasDiscount}
                        />
                    ))}
                </div>

                {/* Coin Packages & Boosts */}
                <div className="border-t border-white/5 pt-20">
                    <div className="flex flex-col gap-16">
                        {/* Coins */}
                        <div>
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 flex items-center justify-center gap-3">
                                    <Coins className="text-yellow-500" /> Instant Top-up
                                </h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Select your desired amount of LSC points</p>
                            </div>
                            
                            <TopUpIndicator onSelect={handleBuyCoins} />
                        </div>

                        {/* Boosts */}
                        <div className="pt-10 border-t border-white/5">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 flex items-center justify-center gap-3">
                                    <Zap className="text-brand-500" /> Additionals
                                </h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Amplify your presence and reach</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {BOOSTS.map((boost: any) => (
                                    <BoostCard 
                                        key={boost.id}
                                        id={boost.id}
                                        title={boost.title}
                                        price={boost.price}
                                        duration={boost.duration}
                                        description={boost.description}
                                        estimation={boost.estimation}
                                        icon={boost.icon}
                                        color={boost.color}
                                        isPurchased={purchasedBoosts.includes(boost.id)}
                                        isActive={!!activeBoosts[boost.id]}
                                        timeLeft={activeBoosts[boost.id] || 0}
                                        onUse={handleUseBoost}
                                        onSelect={(title: string, price: string, id: number) => openPayment(title, price + ' LSC', 'coins', Number(price), id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-32 pt-20 border-t border-white/5 flex flex-col items-center opacity-10">
                    <span className="text-[7px] font-black text-white uppercase tracking-[2em]">Premium Security System v4.2.1 Active</span>
                </div>
            </div>
        </div>
    );
}
