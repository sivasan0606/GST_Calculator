import React, { useState } from 'react';
import { CreditCard, ArrowUpRight, Check, Zap, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface RazorpayPromoProps {
  affiliateUrl?: string;
  onTrackClick?: (id: string, estPayout: number) => void;
}

export default function RazorpayPromo({ affiliateUrl, onTrackClick }: RazorpayPromoProps) {
  const [clicked, setClicked] = useState(false);
  
  const defaultUrl = 'https://rzp.io/rzp/LDcj8IDc';
  const finalUrl = affiliateUrl && affiliateUrl.trim() !== '' ? affiliateUrl : defaultUrl;

  const handleCtaClick = () => {
    if (onTrackClick) {
      // Simulate a premium $25.00 CPA payout tracking for Razorpay merchant activations
      onTrackClick('razorpay', 25.00);
    }
    setClicked(true);
    setTimeout(() => setClicked(false), 4000);
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative mt-12 max-w-4xl mx-auto font-sans">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Custom grid layout for copy and action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Pitch Copy Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 font-display text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">
              <Sparkles size={11} className="animate-pulse" />
              Recommended Payment Partner
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 font-display text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">
              <Shield size={10} /> Fast Setup
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight leading-none sm:leading-tight">
              Collect Payments Instantly with <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Razorpay</span>
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Ready to monetize your pricing, billing, or sales calculations? Set up Razorpay to collect one-time payments, launch subscription models, or share custom payment links in under 5 minutes.
            </p>
          </div>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-blue-400" />
              </div>
              <span className="text-slate-300 text-xs font-semibold leading-snug">
                UPI, Cards, and 100+ Indian payment modes supported
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-blue-400" />
              </div>
              <span className="text-slate-300 text-xs font-semibold leading-snug">
                No-code payment links & beautiful custom checkout pages
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-blue-400" />
              </div>
              <span className="text-slate-300 text-xs font-semibold leading-snug">
                Fully automated settlement cycles directly to your bank
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={12} className="text-blue-400" />
              </div>
              <span className="text-slate-300 text-xs font-semibold leading-snug">
                Industry-standard end-to-end security & SSL protocols
              </span>
            </div>
          </div>
        </div>

        {/* Action / CTA Block Column */}
        <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 p-5 sm:p-6 rounded-2xl flex flex-col justify-between h-full min-h-[220px]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              {/* Custom SVG logo icon mimicking Razorpay look */}
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/30">
                <CreditCard size={16} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-white">Razorpay Ecosystem</span>
            </div>
            
            <p className="text-slate-400 text-xs leading-normal font-medium mb-4">
              Get premium rates and start accepting zero-failure transactions today. Click below to proceed to the official Razorpay platform.
            </p>
          </div>

          <div className="space-y-4">
            <a
              href={finalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick}
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-display text-xs font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/25 transition-all active:scale-[0.98] group cursor-pointer min-h-[44px]"
            >
              <span>Connect with Razorpay</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Click feedback animation */}
            {clicked && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-[10px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-900/60 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1"
              >
                <Zap size={10} className="animate-bounce" />
                <span>Affiliate Click Registered! Simulated Commission Added</span>
              </motion.div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
