import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { Coins, TrendingUp, Zap, Star, Trophy, Target, Crown, Gem } from 'lucide-react';

interface SlotMachineProps {
    type?: 'crypto' | 'terminal';
    onWin?: (amount: number) => void;
    minBet?: number;
    maxBet?: number;
}

const CRYPTO_SYMBOLS = [
    { id: 1, icon: Coins, color: 'text-yellow-500', value: 10, label: 'BTC' },
    { id: 2, icon: Zap, color: 'text-blue-400', value: 5, label: 'ETH' },
    { id: 3, icon: TrendingUp, color: 'text-green-400', value: 3, label: 'SOL' },
    { id: 4, icon: Star, color: 'text-purple-400', value: 2, label: 'ADA' },
    { id: 5, icon: Trophy, color: 'text-orange-400', value: 20, label: 'JACKPOT' },
    { id: 6, icon: Target, color: 'text-red-400', value: 1, label: 'DOT' },
    { id: 7, icon: Crown, color: 'text-yellow-600', value: 15, label: 'KING' },
    { id: 8, icon: Gem, color: 'text-cyan-400', value: 8, label: 'GEM' },
];

const TERMINAL_SYMBOLS = [
    { id: 1, icon: Target, color: 'text-green-500', value: 10, label: 'CMD' },
    { id: 2, icon: Zap, color: 'text-yellow-400', value: 5, label: 'PWR' },
    { id: 3, icon: TrendingUp, color: 'text-blue-400', value: 3, label: 'RUN' },
    { id: 4, icon: Star, color: 'text-white', value: 2, label: 'SYS' },
    { id: 5, icon: Trophy, color: 'text-brand-500', value: 20, label: 'ROOT' },
    { id: 6, icon: Coins, color: 'text-gray-400', value: 1, label: 'LOG' },
    { id: 7, icon: Crown, color: 'text-purple-500', value: 15, label: 'SUDO' },
    { id: 8, icon: Gem, color: 'text-emerald-400', value: 8, label: 'DATA' },
];

const REEL_COUNT = 3;
const SYMBOL_HEIGHT = 100; // px
const VISIBLE_SYMBOLS = 1;
const SPIN_DURATION = 3; // seconds

export const SlotMachine: React.FC<SlotMachineProps> = ({ type = 'crypto', onWin, minBet = 10, maxBet = 1000 }) => {
    const SYMBOLS = type === 'crypto' ? CRYPTO_SYMBOLS : TERMINAL_SYMBOLS;
    const [bet, setBet] = useState(minBet);
    const [spinning, setSpinning] = useState(false);
    const [reels, setReels] = useState<number[][]>([]);
    const [result, setResult] = useState<number[] | null>(null);
    const [winAmount, setWinAmount] = useState(0);
    const [balance, setBalance] = useState(10000);

    const controls0 = useAnimation();
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls = [controls0, controls1, controls2];

    useEffect(() => {
        // Initialize reels with random symbols
        const initialReels = Array(REEL_COUNT).fill(0).map(() => 
            Array(20).fill(0).map(() => Math.floor(Math.random() * SYMBOLS.length))
        );
        setReels(initialReels);
    }, []);

    const spin = async () => {
        if (spinning || balance < bet) return;

        setSpinning(true);
        setWinAmount(0);
        setResult(null);
        setBalance(prev => prev - bet);

        // Generate final results
        const finalResults = Array(REEL_COUNT).fill(0).map(() => Math.floor(Math.random() * SYMBOLS.length));
        
        // Create new reels with final results at the end
        const newReels = reels.map((reel, i) => {
            const newReel = [...reel];
            // Ensure the last few items include the final result for smooth transition
            newReel[newReel.length - 1] = finalResults[i];
            return newReel;
        });
        setReels(newReels);

        // Animate each reel
        const animations = controls.map((control, i) => {
            return control.start({
                y: -(SYMBOL_HEIGHT * (reels[i].length - 1)),
                transition: {
                    duration: SPIN_DURATION + (i * 0.5),
                    ease: [0.45, 0.05, 0.55, 0.95],
                }
            });
        });

        await Promise.all(animations);

        // Reset positions instantly and set result
        controls.forEach(control => control.set({ y: 0 }));
        
        // Update reels for next spin
        const nextReels = Array(REEL_COUNT).fill(0).map((_, i) => {
            const currentResult = finalResults[i];
            return Array(20).fill(0).map(() => Math.floor(Math.random() * SYMBOLS.length))
                .map((val, idx) => idx === 0 ? currentResult : val);
        });
        setReels(nextReels);
        setResult(finalResults);
        setSpinning(false);

        // Check for win
        if (finalResults[0] === finalResults[1] && finalResults[1] === finalResults[2]) {
            const winVal = SYMBOLS[finalResults[0]].value * bet;
            setWinAmount(winVal);
            setBalance(prev => prev + winVal);
            onWin?.(winVal);
        } else if (finalResults[0] === finalResults[1] || finalResults[1] === finalResults[2] || finalResults[0] === finalResults[2]) {
            const winVal = Math.floor(bet * 1.5);
            setWinAmount(winVal);
            setBalance(prev => prev + winVal);
            onWin?.(winVal);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto p-8 bg-dark-900/50 rounded-3xl border border-white/5 backdrop-blur-xl">
            {/* Header */}
            <div className="flex justify-between w-full items-center">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Available Balance</span>
                    <span className="text-2xl font-black text-white">{balance.toLocaleString()} LSC</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Current Bet</span>
                    <span className="text-2xl font-black text-brand-500">{bet.toLocaleString()} LSC</span>
                </div>
            </div>

            {/* Slot Machine Display */}
            <div className="relative flex gap-4 p-6 bg-dark-800 rounded-2xl border-4 border-dark-700 shadow-2xl overflow-hidden">
                {/* Glass Overlay */}
                <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-black/40 via-transparent to-black/40"></div>
                <div className="absolute inset-0 pointer-events-none z-10 border-[12px] border-dark-800/50 rounded-xl"></div>
                
                {reels.map((reel, i) => (
                    <div key={i} className="relative w-32 h-[100px] bg-dark-900 rounded-lg overflow-hidden border border-white/5">
                        <motion.div
                            animate={controls[i]}
                            className="flex flex-col"
                        >
                            {reel.map((symbolIdx, idx) => {
                                const SymbolIcon = SYMBOLS[symbolIdx].icon;
                                return (
                                    <div 
                                        key={idx} 
                                        className="flex items-center justify-center w-full h-[100px] shrink-0"
                                    >
                                        <SymbolIcon className={`w-12 h-12 ${SYMBOLS[symbolIdx].color} drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`} />
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                ))}

                {/* Win Indicator */}
                <AnimatePresence>
                    {winAmount > 0 && !spinning && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.5, y: -20 }}
                            className="absolute inset-0 z-20 flex items-center justify-center bg-brand-500/20 backdrop-blur-sm"
                        >
                            <div className="bg-brand-500 text-white px-8 py-4 rounded-full shadow-[0_0_30px_rgba(161,10,57,0.5)] flex flex-col items-center">
                                <span className="text-[10px] font-black uppercase tracking-widest">Big Win!</span>
                                <span className="text-3xl font-black">+{winAmount.toLocaleString()}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 w-full">
                <div className="flex gap-4 items-center justify-center">
                    {[10, 50, 100, 500, 1000].map(amount => (
                        <button
                            key={amount}
                            onClick={() => setBet(amount)}
                            disabled={spinning}
                            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${bet === amount ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20' : 'bg-dark-800 text-gray-400 hover:text-white border border-white/5'}`}
                        >
                            {amount}
                        </button>
                    ))}
                </div>

                <button
                    onClick={spin}
                    disabled={spinning || balance < bet}
                    className={`w-full py-6 rounded-2xl font-black text-xl uppercase tracking-[0.3em] transition-all relative overflow-hidden group ${spinning ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-brand-600 text-white hover:bg-brand-500 shadow-[0_0_20px_rgba(161,10,57,0.3)] hover:shadow-[0_0_40px_rgba(161,10,57,0.5)]'}`}
                >
                    <span className="relative z-10">{spinning ? 'Spinning...' : 'Spin Now'}</span>
                    {!spinning && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                    )}
                </button>
            </div>

            {/* Paytable Preview */}
            <div className="grid grid-cols-4 gap-4 w-full pt-8 border-t border-white/5">
                {SYMBOLS.slice(0, 4).map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <s.icon size={16} className={s.color} />
                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">3x = {s.value}x</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
