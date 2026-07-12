/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, DollarSign, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { AffiliateSoftware } from '../types';

interface AffiliateSectionProps {
  zohoLink: string;
  quickbooksLink: string;
  xeroLink: string;
  tallyLink: string;
  onTrackClick: (softwareId: string, estPayout: number) => void;
}

export default function AffiliateSection({
  zohoLink,
  quickbooksLink,
  xeroLink,
  tallyLink,
  onTrackClick
}: AffiliateSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const softs: AffiliateSoftware[] = [
    {
      id: 'zoho',
      name: 'Zoho Books',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', // abstract colorful placeholder
      rating: 4.8,
      description: 'The absolute best GST-compliant accounting system for Indian enterprises. Fully automated e-invoicing, digital e-way bills, direct return filing to GST Portal, and elegant mobile apps.',
      pros: ['100% GST compliant out-of-the-box', 'Direct GST API filing connection', 'Generous free tier for startups & micro-biz'],
      pricing: 'Free or from ₹749/month',
      affiliateUrl: zohoLink,
      defaultUrl: 'https://www.zoho.com/books/'
    },
    {
      id: 'quickbooks',
      name: 'QuickBooks Online',
      logo: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?w=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.7,
      description: 'Ideal global standard software for multi-currency tracking, complex cash flows, and advanced tax ledger reconciliations. Highly scalable with clean dashboard visual reports.',
      pros: ['Excellent multi-currency capabilities', 'Flawless accountant ledger sharing', 'Powerful bank auto-reconciliation feeds'],
      pricing: 'Free trial, then $30/month',
      affiliateUrl: quickbooksLink,
      defaultUrl: 'https://quickbooks.intuit.com/'
    },
    {
      id: 'xero',
      name: 'Xero Accounting',
      logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
      rating: 4.6,
      description: 'A beautiful cloud accounting software designed specifically for creative firms, consultants, and ecommerce sellers. Highly customizable with over 1000+ app integrations.',
      pros: ['Modern and highly clean dashboard design', 'Seamless Shopify & Stripe sync integrations', 'Bulk bank transaction reconciliations'],
      pricing: 'From $15/month',
      affiliateUrl: xeroLink,
      defaultUrl: 'https://www.xero.com/'
    },
    {
      id: 'tally',
      name: 'TallyPrime 5.0',
      logo: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=80&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
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
    let estPayout = 15.00; // QuickBooks / Xero standard
    if (id === 'zoho') estPayout = 20.00;
    if (id === 'tally') estPayout = 35.00;

    onTrackClick(id, estPayout);
    
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <section id="accounting-software" className="my-12">
      <div className="text-center mb-8">
        <span className="text-indigo-600 bg-indigo-50 font-display text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
          Partner Offers
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mt-2">
          Top GST & Accounting Software for 2026
        </h2>
        <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
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
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-800 text-xs px-2 py-0.5 rounded-md font-semibold shrink-0">
                        <Star size={12} className="fill-amber-500 text-amber-500" />
                        <span>{soft.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-indigo-600 mt-0.5 flex items-center gap-1">
                      <ShieldCheck size={12} /> GST Certified System
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {soft.description}
                </p>

                {/* Pros checklist */}
                <div className="space-y-2 mb-5">
                  {soft.pros.map((pro, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 mt-auto">
                <div className="font-mono text-xs text-slate-500">
                  <span className="block text-[10px] text-slate-400 font-sans uppercase">Starting Price</span>
                  <strong className="text-slate-800 font-semibold">{soft.pricing}</strong>
                </div>
                <div>
                  <a
                    href={finalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleCtaClick(soft.id, soft.name)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-display text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-xs hover:shadow-md transition-all active:scale-95 group/btn"
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
