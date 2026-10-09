
import React, { useEffect, useState } from 'react';
import { 
    Search, Shield, CreditCard, Video, FileText, ChevronDown, 
    Users, BookOpen, Crown, AlertTriangle, MessageCircle, 
    HelpCircle, ArrowLeft, CheckCircle, ShieldCheck, Clock, Smile 
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { useNavigate, useSearchParams } from 'react-router-dom';

const CategoryCard = ({ icon: Icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick: () => void }) => (
    <div onClick={onClick} className="bg-dark-800 hover:bg-dark-700 p-6 rounded-2xl border border-dark-700 hover:border-brand-500/50 transition-all cursor-pointer group flex flex-col items-center text-center">
        <div className="w-14 h-14 bg-dark-900 rounded-full flex items-center justify-center text-brand-500 mb-4 group-hover:scale-110 transition-transform">
             <Icon size={28} />
        </div>
        <h3 className="font-black text-white text-sm uppercase tracking-wide mb-2">{title}</h3>
        <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-dark-700 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:text-brand-400 transition-colors group"
            >
                <span className="font-bold text-sm text-gray-200 group-hover:text-white uppercase tracking-tight">{question}</span>
                <ChevronDown size={16} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs text-gray-400 leading-relaxed pl-2 border-l-2 border-brand-500/50">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default function Support() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeView, setActiveView] = useState<'home' | 'apply' | 'squads' | 'faq' | 'suggestion'>('home');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [modRoles, setModRoles] = useState<any[]>([]);
    
    // Application Form State
    const [appReason, setAppReason] = useState('');
    const [appExperience, setAppExperience] = useState('');

    // Suggestion Form State
    const [suggestionText, setSuggestionText] = useState('');

    useEffect(() => {
        const load = async () => {
            window.scrollTo(0, 0);
            const roles = await db.getRoles();
            setModRoles(roles.filter((r: any) => !['admin', 'creator', 'user'].includes(r.id)));
            
            const viewParam = searchParams.get('view');
            if (viewParam === 'suggestion') {
                setActiveView('suggestion');
            }
        };
        load();
    }, [searchParams]);

    const handleSubmitSuggestion = async () => {
        if (!suggestionText) return;
        await db.addSuggestion({
            user: authService.getCurrentUser()?.username || 'Anonymous',
            text: suggestionText,
            date: new Date().toISOString()
        });
        alert("Suggestion Sent! Thank you for your feedback.");
        setSuggestionText('');
        setActiveView('home');
    };

    const handleSubmitApplication = async () => {
        if (!appReason || !appExperience) {
            alert("Please fill out all fields.");
            return;
        }
        
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            alert("Please login to apply.");
            return;
        }

        await db.addPendingApproval({
            user: currentUser.username,
            type: 'Engagement Pride',
            notes: `Reason: ${appReason} | Exp: ${appExperience}`,
            context: currentUser.contentPreference || 'dating'
        });

        alert("Application Sent! It is now pending moderator approval.");
        setAppReason('');
        setAppExperience('');
        setActiveView('home');
    };

    // Content Views
    const renderHome = () => (
        <>
            <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                    Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-500">Center</span>
                </h1>
                <div className="flex justify-center gap-4">
                     <button onClick={() => setActiveView('apply')} className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest shadow-lg transition-all">
                         Apply for Pride
                     </button>
                     <button onClick={() => setActiveView('squads')} className="bg-dark-800 hover:bg-dark-700 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest border border-white/5 transition-all">
                         Meet the Squads
                     </button>
                     <button onClick={() => setActiveView('suggestion')} className="bg-dark-800 hover:bg-dark-700 text-white px-6 py-2.5 rounded-lg font-black text-xs uppercase tracking-widest border border-white/5 transition-all flex items-center gap-2">
                         <MessageCircle size={14} /> Send Suggestion
                     </button>
                </div>
            </div>

            <div className="bg-yellow-900/10 border border-yellow-500/20 p-6 rounded-2xl mb-16 flex items-start gap-4">
                <AlertTriangle className="text-yellow-500 shrink-0" size={24} />
                <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-2">Important Notice</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        LuciSin is a decentralized, community-first platform. Assistance is provided through our extensive Knowledge Book and community engagement pride.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                <CategoryCard 
                    icon={Users} 
                    title="Getting Started" 
                    desc="Account creation & setup."
                    onClick={() => { setSelectedCategory('Getting Started'); setActiveView('faq'); }}
                />
                <CategoryCard 
                    icon={Video} 
                    title="Content & Live" 
                    desc="Streaming guides & tools." 
                    onClick={() => { setSelectedCategory('Content'); setActiveView('faq'); }}
                />
                <CategoryCard 
                    icon={Crown} 
                    title="Subscriptions" 
                    desc="Tiers & premium benefits." 
                    onClick={() => { setSelectedCategory('Subscriptions'); setActiveView('faq'); }}
                />
                <CategoryCard 
                    icon={Shield} 
                    title="Safety & Rules" 
                    desc="Community guidelines." 
                    onClick={() => { setSelectedCategory('Safety'); setActiveView('faq'); }}
                />
            </div>
        </>
    );

    const renderSuggestion = () => (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest"><ArrowLeft size={16} /> Back</button>
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
                 <div className="text-center mb-8">
                     <MessageCircle size={48} className="mx-auto text-brand-500 mb-4" />
                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Community Suggestion</h2>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Help us improve the platform.</p>
                 </div>
                 <div className="space-y-6">
                     <div>
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Your Suggestion</label>
                         <textarea 
                            value={suggestionText}
                            onChange={(e) => setSuggestionText(e.target.value)}
                            className="w-full bg-dark-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 outline-none h-32 resize-none" 
                            placeholder="What's on your mind?"
                        />
                     </div>
                     <button 
                        type="button" 
                        onClick={handleSubmitSuggestion} 
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg transition-all"
                    >
                        Send Suggestion
                    </button>
                 </div>
            </div>
        </div>
    );

    const renderApply = () => (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest"><ArrowLeft size={16} /> Back</button>
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
                 <div className="text-center mb-8">
                     <ShieldCheck size={48} className="mx-auto text-brand-500 mb-4" />
                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Engagement Pride Application</h2>
                     <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Join the Guardians of the Pride</p>
                 </div>
                 <div className="space-y-6">
                     <div>
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Why do you want to join?</label>
                         <textarea 
                            value={appReason}
                            onChange={(e) => setAppReason(e.target.value)}
                            className="w-full bg-dark-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 outline-none h-32 resize-none" 
                            placeholder="Tell us about yourself..."
                        />
                     </div>
                     <div>
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">Experience</label>
                         <input 
                            type="text" 
                            value={appExperience}
                            onChange={(e) => setAppExperience(e.target.value)}
                            className="w-full bg-dark-900 border border-white/5 rounded-xl p-4 text-sm text-white focus:border-brand-500 outline-none" 
                            placeholder="Any prior Engagement Pride experience?" 
                        />
                     </div>
                     <button 
                        type="button" 
                        onClick={handleSubmitApplication} 
                        className="w-full bg-brand-600 hover:bg-brand-500 text-white font-black py-4 rounded-xl uppercase tracking-widest text-xs shadow-lg transition-all"
                    >
                        Submit Application
                    </button>
                 </div>
            </div>
        </div>
    );

    const renderSquads = () => (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest"><ArrowLeft size={16} /> Back</button>
            <h2 className="text-3xl font-black text-white uppercase  tracking-tighter mb-8 flex items-center gap-3"><Users size={32} className="text-blue-500" /> Active Squads</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modRoles.map(role => (
                    <div key={role.id} className="bg-dark-800 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-20 h-20 ${role.color.replace('text-', 'bg-').replace('500', '500/10')} rounded-full blur-2xl -mr-10 -mt-10 transition-opacity`}></div>
                        <div className="relative z-10">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border mb-4 ${role.color}`}>
                                <Shield size={12} /> {role.title}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                            <p className="text-gray-400 text-xs leading-relaxed">{role.description}</p>
                        </div>
                    </div>
                ))}
                {modRoles.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-500 text-xs font-bold uppercase tracking-widest border-2 border-dashed border-dark-700 rounded-xl">
                        No custom squads active.
                    </div>
                )}
            </div>
        </div>
    );

    const renderFaq = () => (
        <div className="max-w-3xl mx-auto">
             <button onClick={() => setActiveView('home')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 text-xs font-bold uppercase tracking-widest"><ArrowLeft size={16} /> Back to Hub</button>
             <h2 className="text-2xl font-black text-white uppercase  tracking-tighter mb-2">{selectedCategory} FAQs</h2>
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Common questions and solutions.</p>
             
             <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-xl">
                <FaqItem question="How do I verify my account?" answer="Go to Settings > Verification Center. Generate a code and upload a selfie." />
                <FaqItem question="Difference between memberships?" answer="LuciStar (Silver) is basic ad-free. LuciStar Premium (Gold) includes premium creator tools and priority search." />
                <FaqItem question="Payout schedule?" answer="Withdrawals processed within 24-48 hours via Stripe or Crypto." />
                <FaqItem question="Changing username?" answer="Allowed once every 30 days in Profile Settings." />
             </div>

             <div className="mt-12 pt-8 border-t border-white/5">
                 <h3 className="text-lg font-black text-white uppercase  tracking-tighter mb-6">Community Pulse</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-dark-800 border border-white/5 p-5 rounded-2xl text-center group hover:bg-dark-750 transition-colors">
                        <div className="text-brand-500 mb-3 flex justify-center group-hover:scale-110 transition-transform"><Clock size={24} /></div>
                        <div className="text-2xl font-black text-white tabular-nums">2h</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Avg Response</div>
                    </div>
                    <div className="bg-dark-800 border border-white/5 p-5 rounded-2xl text-center group hover:bg-dark-750 transition-colors">
                        <div className="text-green-500 mb-3 flex justify-center group-hover:scale-110 transition-transform"><Smile size={24} /></div>
                        <div className="text-2xl font-black text-white tabular-nums">98%</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Satisfaction</div>
                    </div>
                     <div className="bg-dark-800 border border-white/5 p-5 rounded-2xl text-center group hover:bg-dark-750 transition-colors">
                        <div className="text-blue-500 mb-3 flex justify-center group-hover:scale-110 transition-transform"><ShieldCheck size={24} /></div>
                        <div className="text-2xl font-black text-white tabular-nums">24</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Engagement Pride</div>
                    </div>
                     <div className="bg-dark-800 border border-white/5 p-5 rounded-2xl text-center group hover:bg-dark-750 transition-colors">
                        <div className="text-yellow-500 mb-3 flex justify-center group-hover:scale-110 transition-transform"><CheckCircle size={24} /></div>
                        <div className="text-2xl font-black text-white tabular-nums">1.2k</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-1">Resolved</div>
                    </div>
                </div>
             </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto py-12 px-6">
            {activeView === 'home' && renderHome()}
            {activeView === 'suggestion' && renderSuggestion()}
            {activeView === 'apply' && renderApply()}
            {activeView === 'squads' && renderSquads()}
            {activeView === 'faq' && renderFaq()}
        </div>
    )
}
