/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, DollarSign, CheckCircle2, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { AffiliateSoftware } from '../types';

interface AffiliateSectionProps {
  zohoLink: string;
  vyaparLink: string;
  giddhLink: string;
  tallyLink: string;
  onTrackClick: (softwareId: string, estPayout: number) => void;
}

export default function AffiliateSection({
  zohoLink,
  vyaparLink,
  giddhLink,
  tallyLink,
  onTrackClick
}: AffiliateSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getVyaparLink = (link: string) => {
    const defaultLink = 'https://www.vyaparapp.in/?referrer_code=6VDQKQM';
    if (!link || link.trim() === '') return defaultLink;
    if (link.includes('vyaparapp.in') && !link.includes('referrer_code')) {
      const separator = link.includes('?') ? '&' : '?';
      return `${link}${separator}referrer_code=6VDQKQM`;
    }
    return link;
  };

  const getGiddhLink = (link: string) => {
    const defaultLink = 'https://giddh.com?ref=kpe65SV';
    if (!link || link.trim() === '') return defaultLink;
    if (link.includes('giddh.com') && !link.includes('ref=')) {
      const separator = link.includes('?') ? '&' : '?';
      return `${link}${separator}ref=kpe65SV`;
    }
    return link;
  };

  const softs: AffiliateSoftware[] = [
    {
      id: 'zoho',
      name: 'Zoho Books',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=96&auto=format&fit=crop&q=40&fm=webp&ixlib=rb-4.0.3', // abstract colorful placeholder
      rating: 4.8,
      description: 'The absolute best GST-compliant accounting system for Indian enterprises. Fully automated e-invoicing, digital e-way bills, direct return filing to GST Portal, and elegant mobile apps.',
      pros: ['100% GST compliant out-of-the-box', 'Direct GST API filing connection', 'Generous free tier for startups & micro-biz'],
      pricing: 'Free or from ₹749/month',
      affiliateUrl: zohoLink || 'https://go.zoho.com/J82J',
      defaultUrl: 'https://go.zoho.com/J82J',
      exclusiveOffer: {
        badge: 'Exclusive Deal',
        text: '$100 wallet credits will be provided to end customers who sign up using this affiliate link.',
        conditions: [
          'Wallet credit is valid for a period of 60 days.',
          'Exclusive benefit given to the end users under the affiliate program.',
          'Only for New customers.'
        ]
      }
    },
    {
      id: 'vyapar',
      name: 'Vyapar App',
      logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=96&auto=format&fit=crop&q=40&fm=webp&ixlib=rb-4.0.3',
      rating: 4.7,
      description: 'Still making paper bills? Switch to Vyapar App, trusted by over 1 Crore+ happy customers. 91% of businesses who use Vyapar report 5X more profits and streamlined accounting.',
      pros: ['GST-Ready Billing & Secure SSL Protection', 'Trusted by ICAI Professional Accountants', 'Inventory tracking with WhatsApp payment reminders'],
      pricing: '7-Day Free Trial, then starts from ₹1,999/year',
      affiliateUrl: getVyaparLink(vyaparLink),
      defaultUrl: 'https://www.vyaparapp.in/?referrer_code=6VDQKQM',
      promoCode: '6VDQKQM'
    },
    {
      id: 'giddh',
      name: 'Giddh Accounting',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=96&auto=format&fit=crop&q=40&fm=webp&ixlib=rb-4.0.3',
      rating: 4.6,
      description: 'An elegant, modern, cloud-first double-entry accounting software designed specifically for Indian businesses. Offers secure automated invoicing, bank reconciliation, and real-time GST reports.',
      pros: ['Automated GST filing & ledger reconciliations', 'Multi-currency cloud dashboard tracking', 'Direct API integrations & developer-friendly hooks'],
      pricing: 'Free Trial available, then ₹800/year onwards',
      affiliateUrl: getGiddhLink(giddhLink),
      defaultUrl: 'https://giddh.com?ref=kpe65SV'
    },
    {
      id: 'tally',
      name: 'TallyPrime 5.0',
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=96&auto=format&fit=crop&q=40&fm=webp&ixlib=rb-4.0.3',
      rating: 4.5,
      description: 'The offline heavyweight standard in South Asia, now with Cloud Prime access. Unmatched inventory management speeds, complete voucher controls, and strong regional CA preference.',
      pros: ['Ultra-fast keyboard shortcut navigation', 'Strong local accountant system integration', 'Comprehensive inventory voucher features'],
      pricing: 'One-time ₹18,000 + GST or ₹600/mo rental',
      affiliateUrl: tallyLink,
      defaultUrl: 'https://tallysolutions.com/'
    }
  ];

  const handleCtaClick = (id: string, name: string) => {
    // Simulated affiliate tracking payouts
    let estPayout = 15.00; // Giddh / generic standard
    if (id === 'vyapar') estPayout = 12.00;
    if (id === 'zoho') estPayout = 20.00;
    if (id === 'tally') estPayout = 35.00;
    if (id === 'giddh') estPayout = 16.00;

    onTrackClick(id, estPayout);
    
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <section id="accounting-software" className="my-12">
      <div className="text-center mb-8">
        <span className="text-indigo-800 bg-indigo-50 font-display text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Partner Offers
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-2">
          Top GST & Accounting Software for 2026
        </h2>
        <p className="text-slate-700 text-sm max-w-xl mx-auto mt-2">
          Automate your business filing, stay compliant, and avoid heavy GST penalties. Compare the highest-rated tools below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {softs.map((soft) => {
          const finalUrl = soft.affiliateUrl || soft.defaultUrl;
          return (
            <motion.div
              key={soft.id}
              whileHover={{ y: -4 }}
              className="bg-white border border-slate-200 hover:border-indigo-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              id={`software-card-${soft.id}`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={soft.logo}
                    alt={`${soft.name} Logo`}
                    className="w-12 h-12 rounded-lg object-cover bg-slate-100 border border-slate-100 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-lg text-slate-900 truncate">
                        {soft.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-900 text-xs px-2 py-0.5 rounded-md font-semibold shrink-0">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>{soft.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-indigo-700 mt-0.5 flex items-center gap-1">
                      <ShieldCheck size={12} /> GST Certified System
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-700 leading-relaxed mb-4">
                  {soft.description}
                </p>

                {/* Pros checklist */}
                <div className="space-y-2 mb-5">
                  {soft.pros.map((pro, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>

                {/* Exclusive Offer Banner */}
                {soft.exclusiveOffer && (
                  <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3.5 mb-5 shadow-2xs">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                        {soft.exclusiveOffer.badge}
                      </span>
                      <span className="text-emerald-900 font-bold text-xs">
                        $100 Wallet Credit Included!
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs font-semibold leading-relaxed">
                      {soft.exclusiveOffer.text}
                    </p>
                    <ul className="mt-2 space-y-1 pl-1 border-t border-emerald-200/50 pt-2">
                      {soft.exclusiveOffer.conditions.map((cond, cIdx) => (
                        <li key={cIdx} className="text-[10px] text-slate-600 flex items-start gap-1.5 leading-normal">
                          <span className="text-emerald-600 font-bold shrink-0">•</span>
                          <span>{cond}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Promo/Referral Code Banner */}
                {soft.promoCode && (
                  <div className="bg-indigo-50/60 border border-indigo-100/80 rounded-xl p-3 mb-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                        Partner Referral Code
                      </span>
                      <p className="text-slate-700 text-xs mt-0.5 font-medium">
                        Use <strong className="text-indigo-800 font-bold">{soft.promoCode}</strong> during register to link your account.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(soft.promoCode || '');
                        setCopiedCode(soft.id);
                        setTimeout(() => setCopiedCode(null), 2500);
                      }}
                      className="bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200/50 px-3 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 active:scale-95 transition-all shrink-0 shadow-xs min-h-[40px] justify-center"
                      title="Copy code to clipboard"
                    >
                      <Copy size={12} />
                      <span>{copiedCode === soft.id ? 'Copied!' : soft.promoCode}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                <div className="font-mono text-xs text-slate-600">
                  <span className="block text-[10px] text-slate-500 font-sans uppercase">Starting Price</span>
                  <strong className="text-slate-900 font-semibold">{soft.pricing}</strong>
                </div>
                <div>
                  <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCtaClick(soft.id, soft.name)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-display text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-95 group/btn min-h-[40px]"
                  >
                    <span>Claim Offer</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Affiliate Click Toast Simulation */}
              {copiedId === soft.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-emerald-900 text-white rounded-lg p-2 mt-3 text-center text-[11px] font-medium flex items-center justify-center gap-1 shadow"
                >
                  <DollarSign size={12} className="text-emerald-400" />
                  <span>Affiliate Click Tracked! simulated payout added to Dashboard</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
