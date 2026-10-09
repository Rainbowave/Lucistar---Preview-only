import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

import { ReferralCard } from '../components/referrals/ReferralCard';
import { NetworkGrowthCard } from '../components/referrals/NetworkGrowthCard';
import { InviteForm } from '../components/referrals/InviteForm';
import { AffiliateSubscription } from '../components/referrals/AffiliateSubscription';
import { RegisteredUsersList } from '../components/referrals/RegisteredUsersList';
import { ProfitCharts } from '../components/referrals/ProfitCharts';
import { BonusHistory } from '../components/referrals/BonusHistory';
import { LayoutGrid } from 'lucide-react';

export default function Referrals() {
    const [user, setUser] = useState<any>(null);
    const [profitPercent, setProfitPercent] = useState(10);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        if (currentUser?.pimpSettings) {
            setProfitPercent(currentUser.pimpSettings.profitPercent);
        }
    }, []);

    const handleSaveProfit = () => {
        authService.updatePimpSettings({ profitPercent });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const handleSaveSubscription = (subData: any) => {
        authService.updatePimpSettings({ mandatorySubscription: subData });
    };

    if (!user) return null;

    const isAdult = user.contentPreference === 'adult';
    const isPremium = user.isPremium || false;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen bg-dark-850">
            {showToast && (
                <div className="fixed top-24 right-8 z-[100] bg-brand-600 text-white px-6 py-3 rounded-[5px] shadow-2xl font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-right-4">
                    Settings Updated Successfully
                </div>
            )}
            
            <div className="flex-1 min-w-0 flex flex-col relative border-r border-white/[0.02]">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-xl border-b border-white/5 py-4 px-4 md:px-8">
                    <h1 className="text-lg md:text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
                        <LayoutGrid size={24} className="text-brand-500" /> 
                        {isAdult ? 'Affiliate Dashboard' : 'Referral Program'}
                    </h1>
                </div>

                <div className="p-4 md:p-8 pb-20">
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-2">
                            {isAdult ? 'Build Your Network' : 'Grow the Community'}
                        </h2>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
                            {isAdult 
                                ? "Register affiliates through your link. Control your profit percentage and set mandatory subscriptions."
                                : "Monetize your social circle. Introduce new creators and receive recurring rewards."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ReferralCard 
                            code={isAdult ? "AFFILIATE-PRO" : "LUCISIN25"} 
                            reward="5.00 LSC" 
                            claims={12} 
                            isAdult={isAdult} 
                            profitPercent={profitPercent} 
                            setProfitPercent={setProfitPercent}
                            onSave={handleSaveProfit}
                            isPremium={isPremium}
                        />
                        <NetworkGrowthCard isAdult={isAdult} />
                        <InviteForm isAdult={isAdult} code={isAdult ? "AFFILIATE-PRO" : "LUCISIN25"} profitPercent={profitPercent} />
                        {isAdult && (
                            <AffiliateSubscription onSave={handleSaveSubscription} initialData={user.pimpSettings?.mandatorySubscription} profitPercent={profitPercent} />
                        )}
                        <div className="md:col-span-2 lg:col-span-3">
                            <ProfitCharts isAdult={isAdult} />
                        </div>
                        <div className="md:col-span-2">
                            <RegisteredUsersList isAdult={isAdult} />
                        </div>
                        <div className="md:col-span-1">
                            <BonusHistory isAdult={isAdult} />
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 text-center opacity-30 mt-8">
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-[1.5em]">
                            {isAdult ? 'Affiliate Program Active' : 'Referral Program Active'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
