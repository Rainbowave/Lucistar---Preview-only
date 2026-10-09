
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        // Simulate API verification
        const timer = setTimeout(() => {
            setStatus('success');
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Animated Pattern Background */}
            <div className="absolute top-[-150px] left-[-200px] right-[-200px] bottom-[-150px] z-0 pointer-events-none opacity-20 animate-scroll-bg" style={{ 
                backgroundImage: 'url(https://picsum.photos/200/150?grayscale&blur=2)', 
                backgroundSize: '200px 150px' 
            }}></div>
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/60 via-dark-900/90 to-dark-900 pointer-events-none z-10"></div>
            
            <div className="bg-dark-800 p-8 rounded-2xl shadow-2xl border border-dark-700 w-full max-w-md text-center relative z-30">
                {status === 'loading' && (
                    <div className="py-8">
                        <Loader2 className="w-16 h-16 text-brand-500 animate-spin mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
                        <p className="text-gray-400">Please wait while we verify your account.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-green-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-gray-400 mb-8">Your account has been successfully verified.</p>
                        <button 
                            onClick={() => navigate('/auth/login')}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 rounded-xl transition-all"
                        >
                            Continue to Login
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="py-8">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="text-red-500" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-gray-400 mb-8">The verification link is invalid or has expired.</p>
                        <button 
                            onClick={() => navigate('/auth/login')}
                            className="text-gray-400 hover:text-white font-bold"
                        >
                            Back to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
