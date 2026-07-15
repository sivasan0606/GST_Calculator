/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ExternalLink, Info, Check, Copy, Settings2 } from 'lucide-react';
import { motion } from 'motion/react';

interface AdSenseUnitProps {
  slotId: string;
  format: 'banner' | 'square' | 'leaderboard';
  adsenseClientId?: string;
}

interface MockAd {
  title: string;
  description: string;
  displayUrl: string;
  ctaText: string;
  destinationUrl: string;
  badge?: string;
}

const mockAds: Record<string, MockAd[]> = {
  leaderboard: [
    {
      title: "File GST Returns in 5 Minutes - Guaranteed Accuracy",
      description: "Auto-sync invoices, generate e-way bills & file error-free GST returns instantly. Rated 4.9/5 by 10k+ businesses.",
      displayUrl: "www.cleartax.in/gst-filing",
      ctaText: "Start Free Filing",
      destinationUrl: "https://www.cleartax.in",
      badge: "Sponsor"
    },
    {
      title: "Need GST Registration? Get it Online in 3 Days",
      description: "Professional CAs handle your application. 100% online process, minimum documentation, instant receipt.",
      displayUrl: "www.indiafilings.com/gst-reg",
      ctaText: "Apply Now",
      destinationUrl: "https://www.indiafilings.com",
      badge: "Partner Ad"
    }
  ],
  square: [
    {
      title: "Zoho Books: GST Filing Made Easy",
      description: "Generate e-invoices, track tax liabilities, and push returns directly to the GST portal with Zoho Books.",
      displayUrl: "www.zoho.com/books",
      ctaText: "Try 14 Days Free",
      destinationUrl: "https://www.zoho.com/books",
      badge: "Recommended"
    },
    {
      title: "TallyPrime 5.0 - Ready for E-Invoicing",
      description: "The trusted accounting software for small and medium enterprises. Manage inventory, pay, and GST compliance seamlessly.",
      displayUrl: "tallysolutions.com/tallyprime",
      ctaText: "Download Free Trial",
      destinationUrl: "https://tallysolutions.com",
      badge: "Sponsor"
    }
  ],
  banner: [
    {
      title: "Hire a Virtual Accountant for $99/Mo",
      description: "Expert tax preparation, monthly bookkeeping, and unlimited GST consultancy. Save up to 60% on in-house costs.",
      displayUrl: "www.taxexpertonline.com/hire",
      ctaText: "Get Free Quote",
      destinationUrl: "#tax-consultants",
      badge: "Sponsored"
    },
    {
      title: "Free GST Invoice Generator Template",
      description: "Create, customize, and print GST-compliant invoices in under 1 minute. No registration required.",
      displayUrl: "www.gstcalculator.online/invoice-gen",
      ctaText: "Create Invoice",
      destinationUrl: "#invoice-generator",
      badge: "Internal Ad"
    }
  ]
};

export default function AdSenseUnit({ slotId, format, adsenseClientId }: AdSenseUnitProps) {
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  // Get a random ad from the category or default to the first
  const adList = mockAds[format] || mockAds.banner;
  // Use simple hash to pick consistent ad based on slotId
  const adIndex = Math.abs(slotId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % adList.length;
  const currentAd = adList[adIndex];

  const adsenseCode = `<!-- AdSense Slot: ${slotId} -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="${adsenseClientId || 'ca-pub-XXXXXXXXXXXXX'}"
     data-ad-slot="${slotId}"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(adsenseCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getContainerStyles = () => {
    switch (format) {
      case 'leaderboard':
        return 'w-full min-h-[90px] border border-dashed border-emerald-200 bg-emerald-50/40 rounded-xl p-4 sm:flex items-center justify-between gap-4';
      case 'square':
        return 'w-full min-h-[250px] border border-dashed border-amber-200 bg-amber-50/30 rounded-xl p-5 flex flex-col justify-between';
      case 'banner':
      default:
        return 'w-full min-h-[110px] border border-dashed border-sky-200 bg-sky-50/30 rounded-xl p-4 flex flex-col justify-between sm:flex-row sm:items-center gap-4';
    }
  };

  return (
    <div className="relative group/ad my-6">
      {/* Ad Tag Label */}
      <div className="absolute top-[-10px] right-4 bg-slate-100 text-slate-500 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-slate-200 shadow-xs z-10 flex items-center gap-1">
        <span>ADVERTISEMENT</span>
        <button 
          onClick={() => setShowCode(!showCode)} 
          className="hover:text-indigo-600 transition-colors ml-1"
          title="AdSense Code Integration Setup"
          aria-label="Toggle AdSense Code Integration Setup"
        >
          <Settings2 size={10} />
        </button>
      </div>

      {showCode ? (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-left font-mono text-xs text-emerald-400 overflow-x-auto shadow-md"
        >
          <div className="flex justify-between items-center mb-2 border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-sans text-xs font-semibold flex items-center gap-1">
              <Info size={12} /> Google AdSense Integrator
            </span>
            <div className="flex gap-2">
              <button
                onClick={copyCode}
                className="bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded flex items-center gap-1 transition-all text-[11px] font-sans"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
              <button
                onClick={() => setShowCode(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded font-sans text-[11px]"
              >
                Hide
              </button>
            </div>
          </div>
          <pre className="text-[10px] leading-relaxed select-all whitespace-pre-wrap">{adsenseCode}</pre>
          <div className="mt-3 text-slate-400 font-sans text-[11px] bg-slate-800/50 p-2 rounded leading-relaxed border border-slate-800">
            <strong className="text-slate-200">SEO Integration Guide:</strong> When you host this site, replace the client ID with your actual <code className="text-amber-300">ca-pub-xxxx</code>. Place the global script block in your <code className="text-sky-300">&lt;head&gt;</code> to start serving live revenue-generating Google Ads.
          </div>
        </motion.div>
      ) : (
        <div className={getContainerStyles()}>
          {format === 'leaderboard' ? (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                    {currentAd.badge}
                  </span>
                  <a 
                    href={currentAd.destinationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-display font-medium text-slate-800 hover:text-indigo-600 transition-colors text-sm sm:text-base truncate block"
                  >
                    {currentAd.title}
                  </a>
                  <span className="text-slate-400 text-xs truncate hidden sm:inline">{currentAd.displayUrl}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-1">{currentAd.description}</p>
              </div>
              <div className="mt-3 sm:mt-0 shrink-0">
                <a
                  href={currentAd.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  {currentAd.ctaText}
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </>
          ) : format === 'square' ? (
            <>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                    {currentAd.badge}
                  </span>
                  <span className="text-slate-400 text-xs font-mono truncate">{currentAd.displayUrl}</span>
                </div>
                <a 
                  href={currentAd.destinationUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-display font-semibold text-slate-800 hover:text-indigo-600 transition-colors text-base leading-snug block mb-2"
                >
                  {currentAd.title}
                </a>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{currentAd.description}</p>
              </div>
              <div>
                <a
                  href={currentAd.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  {currentAd.ctaText}
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="bg-sky-100 text-sky-800 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                    {currentAd.badge}
                  </span>
                  <a 
                    href={currentAd.destinationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-display font-medium text-slate-800 hover:text-indigo-600 transition-colors text-sm sm:text-base truncate block"
                  >
                    {currentAd.title}
                  </a>
                  <span className="text-slate-400 text-xs font-mono truncate hidden md:inline">{currentAd.displayUrl}</span>
                </div>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{currentAd.description}</p>
              </div>
              <div className="mt-3 sm:mt-0 shrink-0">
                <a
                  href={currentAd.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-display text-xs font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm hover:shadow-md transition-all active:scale-95 group"
                >
                  {currentAd.ctaText}
                  <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
