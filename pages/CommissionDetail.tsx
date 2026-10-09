
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Palette, ArrowLeft, Star, Clock, ShieldCheck, MessageSquare, Share2, Heart, ExternalLink, Zap, Upload, Image as ImageIcon } from 'lucide-react';
import { commissionsService, Commission } from '../services/commissionsService';
import { CommissionCard } from '../components/commissions/CommissionCard';

export default function CommissionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [commission, setCommission] = useState<Commission | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('Standard');
  const [related, setRelated] = useState<Commission[]>([]);

  useEffect(() => {
    const loadDetail = async () => {
      setLoading(true);
      try {
        const results = await commissionsService.getCommissions();
        const found = results.find(c => c.id.toString() === id);
        setCommission(found || null);
        setRelated(results.filter(c => c.id.toString() !== id).slice(0, 4));
      } catch (error) {
        console.error('Failed to load commission detail:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-900">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!commission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-dark-900 text-white">
        <Palette size={64} className="text-gray-500 mb-4" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Commission Not Found</h2>
        <button 
          onClick={() => navigate('/commissions')}
          className="mt-6 px-6 py-2 bg-brand-mixed rounded-[5px] font-black text-xs uppercase tracking-widest"
        >
          Back to Commissions
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 pb-24">
      {/* Detail Header */}
      <div className="relative h-[400px] overflow-hidden">
        <img src={commission.image} className="w-full h-full object-cover" alt={commission.title} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent" />
        
        <div className="absolute top-8 left-8">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-[5px] flex items-center justify-center text-white hover:bg-white/10 transition-all border border-white/5"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[5px] p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-brand-500/10 text-brand-500 rounded-[5px] text-[10px] font-black uppercase tracking-widest border border-brand-500/20">
                      {commission.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                    {commission.title}
                  </h1>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 bg-white/5 rounded-[5px] text-gray-400 hover:text-white transition-all border border-white/5">
                    <Share2 size={18} />
                  </button>
                  <button className="p-2.5 bg-white/5 rounded-[5px] text-gray-400 hover:text-white transition-all border border-white/5">
                    <Heart size={18} />
                  </button>
                </div>
              </div>

              {/* Package Selectors */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {['Basic', 'Standard', 'Premium'].map((pkg) => (
                    <button
                        key={pkg}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-[5px] transition-all border text-left flex flex-col gap-1 ${
                            selectedPackage === pkg 
                                ? 'bg-brand-500/10 border-brand-500 shadow-[0_0_15px_rgba(138,180,248,0.15)] text-white' 
                                : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20'
                        }`}
                    >
                        <span className="text-[10px] uppercase font-black tracking-widest">{pkg}</span>
                        <span className="text-sm font-bold">
                            ${pkg === 'Basic' ? Math.floor(commission.price * 0.6) : pkg === 'Premium' ? Math.floor(commission.price * 1.5) : commission.price}
                        </span>
                    </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-black/40 border border-white/5 p-4 rounded-[5px] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-yellow-500 mb-1">
                    <Star size={16} fill="currentColor" />
                    <span className="text-sm font-black">{commission.rating}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{commission.reviews} Reviews</div>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-[5px] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-white mb-1">
                    <Clock size={16} />
                    <span className="text-sm font-black">{commission.deliveryTime}</span>
                  </div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Est. Delivery</div>
                </div>
                <div className="bg-black/40 border border-white/5 p-4 rounded-[5px] text-center">
                  <div className="flex items-center justify-center gap-1.5 text-brand-500 mb-1">
                    <ShieldCheck size={16} />
                    <span className="text-sm font-black">Secure</span>
                  </div>
                  <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Transaction</div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Description</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {selectedPackage === 'Basic' && `A streamlined version of ${commission.title.toLowerCase()} focused on core ideas and fast delivery. Ideal for personal use and quick sketches. Includes 1 round of initial revision to ensure accuracy.`}
                    {selectedPackage === 'Standard' && `Professional ${commission.title.toLowerCase()} tailored to your specific needs. I provide high-quality results with attention to detail and up to 3 revision rounds to ensure your complete satisfaction. Deliverables include high-resolution files.`}
                    {selectedPackage === 'Premium' && `The ultimate package for ${commission.title.toLowerCase()}. Includes ultra-high resolution, priority delivery, source files, full commercial rights, and up to 5 revision rounds for absolute perfection.`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {commission.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black text-gray-500 border border-white/5 rounded-[5px] text-[10px] font-bold uppercase tracking-widest">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Artist Work Section in Main Content */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[5px] p-8">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2">Artist Work ({selectedPackage})</h3>
              <p className="text-xs text-gray-500 mb-6">Examples of the quality, style, and finish you can expect from the {selectedPackage} package.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(selectedPackage === 'Basic' ? [
                    `https://picsum.photos/seed/${commission.id}basic1/400/300`,
                    `https://picsum.photos/seed/${commission.id}basic2/400/300`,
                    `https://picsum.photos/seed/${commission.id}basic3/400/300`
                ] : selectedPackage === 'Premium' ? [
                    `https://picsum.photos/seed/${commission.id}prem1/400/300`,
                    `https://picsum.photos/seed/${commission.id}prem2/400/300`,
                    `https://picsum.photos/seed/${commission.id}prem3/400/300`,
                    `https://picsum.photos/seed/${commission.id}prem4/400/300`
                ] : [
                    `https://picsum.photos/seed/${commission.id}std1/400/300`,
                    `https://picsum.photos/seed/${commission.id}std2/400/300`,
                    `https://picsum.photos/seed/${commission.id}std3/400/300`
                ]).map((imgSrc, idx) => (
                    <div key={idx} className="relative aspect-video rounded-[5px] overflow-hidden border border-white/5 group">
                        <img src={imgSrc} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={`${selectedPackage} Example ${idx + 1}`} referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                    </div>
                ))}
              </div>
            </div>

            {/* Reviews Section Placeholder */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[5px] p-8">
              <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6">Client Reviews</h3>
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="flex gap-4 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <img src={`https://picsum.photos/100/100?random=usr_${i}`} className="w-10 h-10 rounded-[5px] object-cover" alt="" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Client {i}</span>
                        <div className="flex text-yellow-500">
                          {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-normal italic">"Amazing work! Exceeded my expectations in every way. Highly recommended for any professional project."</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[5px] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{selectedPackage} Price</span>
                <span className="text-3xl font-black text-white tabular-nums">
                    ${selectedPackage === 'Basic' ? Math.floor(commission.price * 0.6) : selectedPackage === 'Premium' ? Math.floor(commission.price * 1.5) : commission.price}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs text-brand-500 font-bold">
                  <Zap size={14} fill="currentColor" />
                  <span>{selectedPackage} Package Included</span>
                </div>
                <div className="text-[10px] text-gray-500 font-medium space-y-1">
                  <p>• High-resolution source files</p>
                  <p>• {selectedPackage === 'Basic' ? '1' : selectedPackage === 'Premium' ? '5' : '3'} Initial revisions included</p>
                  <p>• Commercial use rights license</p>
                </div>
              </div>

              <button className="w-full py-4 bg-brand-mixed rounded-[5px] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20 hover:opacity-90 transition-all mb-4">
                Continue Booking
              </button>
              
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-[5px] text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <MessageSquare size={16} /> Contact Artist
              </button>
            </div>

            {/* Artist Detail Card */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-[5px] p-6">
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-4">About the Artist</h3>
              <div className="flex items-center gap-4 mb-4">
                <img src={commission.artist.avatar} className="w-14 h-14 rounded-[5px] object-cover" alt="" />
                <div>
                  <p className="text-sm font-black text-white uppercase tracking-tighter">{commission.artist.username}</p>
                  <p className="text-[9px] text-brand-500 font-bold uppercase tracking-widest">Elite Creator</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Professional creative with 8+ years of experience in {commission.category.toLowerCase()}. 
                Passionate about bringing unique visions to life.
              </p>
              <button 
                onClick={() => navigate(`/profile/${commission.artist.username}`)}
                className="w-full py-3 border border-white/5 hover:border-white/20 rounded-[5px] text-gray-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
            <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Related Commissions</h2>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">More works like this</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {related.map((relComm) => (
                        <CommissionCard key={relComm.id} commission={relComm} />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
