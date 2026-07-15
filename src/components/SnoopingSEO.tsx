/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, HelpCircle, Check, Percent, FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
  keywords: string[];
}

const faqData: FaqItem[] = [
  {
    question: "What is the formula to calculate GST?",
    answer: "To add GST to an amount: GST Amount = Original Cost x (GST Rate / 100). Total Cost = Original Cost + GST Amount. To remove GST from an amount: GST Amount = Total Cost - [Total Cost / {1 + (GST Rate / 100)}]. Net Cost = Total Cost - GST Amount.",
    keywords: ["GST formula", "how to calculate gst", "formula for gst"]
  },
  {
    question: "What is the difference between CGST, SGST, and IGST?",
    answer: "CGST (Central Goods and Services Tax) and SGST (State Goods and Services Tax) are levied on intra-state supply (within the same state), split equally (50-50) between Central and State governments. IGST (Integrated Goods and Services Tax) is levied on inter-state supply (between different states) and goes entirely to the Central government before being distributed based on consumption.",
    keywords: ["cgst vs sgst", "difference cgst sgst igst", "integrated gst"]
  },
  {
    question: "Who needs to register for GST in India?",
    answer: "Any business with an annual turnover exceeding ₹40 Lakhs for goods suppliers (₹20 Lakhs for hilly/northeastern states) or ₹20 Lakhs for service providers must register. In addition, e-commerce sellers, inter-state traders, and casual taxable persons must register regardless of turnover.",
    keywords: ["gst registration limit", "who needs gst", "turnover threshold"]
  },
  {
    question: "What are the active GST Slabs in India?",
    answer: "The current major GST slabs are: Exempt/0% (essential items like milk, grains), 5% (tea, spices, life-saving drugs), 18% (smartphones, capital goods, financial services), and 40% (luxury cars, cement, tobacco, high-end electronics).",
    keywords: ["gst rates india", "gst slabs list", "18 percent gst"]
  },
  {
    question: "How do I claim a GST Input Tax Credit (ITC)?",
    answer: "To claim ITC, you must possess a valid tax invoice or debit note, have received the goods/services, filed your GSTR-3B return, and the tax charged must have been paid to the government by your supplier. The invoice details must match GSTR-2B automatically in your portal.",
    keywords: ["input tax credit", "how to claim itc", "gstr-2b compliance"]
  },
  {
    question: "Which GST billing software is best for Indian small businesses (MSMEs)?",
    answer: "For offline-first mobile and desktop billing, Vyapar App is highly popular (you can use referral partner code 6VDQKQM during sign-up). For fully featured cloud-based ledger management, Zoho Books and Giddh are excellent solutions for modern teams, while Tally Prime remains the gold standard for chartered accountants who prefer offline keyboard shortcuts and robust audit trails.",
    keywords: ["best gst billing software", "vyapar app vs tally", "zoho books vs giddh", "msme accounting india"]
  },
  {
    question: "Does Vyapar App have a referral promo code for new accounts?",
    answer: "Yes, you can register with the official partner referral promo code 6VDQKQM. This connects your account to special MSME packages and guarantees a premium trial. It allows you to unlock GST billing, offline inventory control, automated WhatsApp estimates, and purchase vouchers.",
    keywords: ["vyapar referral code", "vyapar coupon code 6VDQKQM", "vyapar discount code", "vyapar desktop key free"]
  },
  {
    question: "What is Giddh accounting software and its top features?",
    answer: "Giddh is an Indian cloud accounting tool focusing on double-entry bookkeeping, automated GST calculations, and developer-friendly REST APIs. It is highly suited for startups who want direct database sync, beautiful financial dashboards, and multi-currency reporting.",
    keywords: ["giddh accounting software", "giddh coupon code", "indian double-entry cloud accounting"]
  }
];

export default function SnoopingSEO() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
      {/* Dynamic SEO Badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-sky-200/50 font-semibold font-display uppercase tracking-wider">
          <BookOpen size={12} /> Rich SEO Content Hub
        </span>
        <span className="text-slate-600 text-xs font-mono font-medium">• 8,500+ Monthly Organic Search Potential</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
        Comprehensive Goods & Services Tax (GST) Complete Calculation Guide
      </h2>
      <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
        Welcome to the ultimate online tax repository. This interactive portal is designed to provide retail shop owners, SMEs, freelancers, and accounting professionals with simple tools and educational resources to navigate modern compliance rules without errors.
      </p>

      {/* Grid with visual sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
        {/* GST Slab Table */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
          <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
            <Percent size={16} className="text-indigo-600" />
            Active GST Slabs & Common Examples
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="pb-2">Rate Slab</th>
                  <th className="pb-2">Type of Category</th>
                  <th className="pb-2">Example Goods / Services</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 font-bold text-slate-900 font-mono">0% (Exempt)</td>
                  <td className="py-2.5">Basic Essentials</td>
                  <td className="py-2.5">Fresh milk, unbranded grains, salt, newspapers</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-indigo-600 font-mono">5%</td>
                  <td className="py-2.5">Mass Consumption</td>
                  <td className="py-2.5">Spices, sugar, life-saving medicines, tea, domestic LPG</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-indigo-600 font-mono">18% (Standard)</td>
                  <td className="py-2.5">Most Services & Capital</td>
                  <td className="py-2.5">IT services, restaurants, capital hardware, software</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-rose-600 font-mono">40%</td>
                  <td className="py-2.5">Luxury & Sin Goods</td>
                  <td className="py-2.5">Luxury SUVs, air conditioners, tobacco, online gaming</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200/60 mt-4 text-[11px] text-slate-500 leading-relaxed">
            <strong>Pro Tip:</strong> Businesses are eligible to claim an <strong>Input Tax Credit (ITC)</strong> on almost all standard-rate services if the supplier registers their transactions correctly.
          </div>
        </div>

        {/* GST Mathematical Formulas */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
          <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-indigo-600" />
            The Mathematical Formulas Behind GST
          </h3>
          <div className="space-y-4">
            <div className="bg-white p-3 rounded-lg border border-slate-200/50">
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block mb-1">
                Case A: Adding GST (Exclusive Cost)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Use this formula when you know the raw cost and want to find how much to charge with tax:
              </p>
              <code className="block bg-slate-900 text-emerald-400 font-mono text-xs p-2 rounded text-center">
                GST Amount = Original Cost × (Rate ÷ 100)
              </code>
            </div>

            <div className="bg-white p-3 rounded-lg border border-slate-200/50">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 block mb-1">
                Case B: Removing GST (Inclusive Cost)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                Use this formula when a customer paid an inclusive total and you need to separate tax for booking:
              </p>
              <code className="block bg-slate-900 text-amber-400 font-mono text-xs p-2 rounded text-center">
                Net Cost = Total Price ÷ [1 + (Rate ÷ 100)]
              </code>
            </div>
          </div>
        </div>
      </div>

      {/* CGST, SGST, IGST Rules diagram */}
      <div className="bg-indigo-950 text-slate-200 rounded-xl p-5 my-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="font-display font-bold text-white text-base mb-2 flex items-center gap-2">
          CGST vs SGST vs IGST: Levy Decision Flowchart
        </h3>
        <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed mb-4">
          Unsure whether to split the tax or apply one integrated percentage? GST relies strictly on the <strong>Place of Supply</strong> versus the <strong>Location of the Supplier</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-500/20 mb-1 inline-block">
              Intra-State (Within Same State)
            </span>
            <h4 className="text-white text-xs font-semibold mb-1">Levy: CGST + SGST (50/50 Split)</h4>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              If your retail store is in Delhi and the buyer is in Delhi, a 18% GST item charges <strong>9% CGST</strong> (goes to Delhi central government account) and <strong>9% SGST</strong> (goes to Delhi state chest).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/20 mb-1 inline-block">
              Inter-State (To Different State)
            </span>
            <h4 className="text-white text-xs font-semibold mb-1">Levy: IGST (100% Integrated)</h4>
            <p className="text-[11px] text-slate-200 leading-relaxed">
              If your ecommerce hub is in Maharashtra and you ship to Karnataka, you charge <strong>18% IGST</strong>. The tax is processed centrally first before distribution, saving administrative hurdles.
            </p>
          </div>
        </div>
      </div>

      {/* SEO Accordion FAQ */}
      <div className="border-t border-slate-100 pt-8 mt-8">
        <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
          <HelpCircle className="text-indigo-600" size={20} />
          Frequently Asked Questions (FAQ) — Highly Answered SEO Queries
        </h3>

        <div className="space-y-3">
          {faqData.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index}
                className="border border-slate-200/80 rounded-xl overflow-hidden transition-all duration-200 bg-slate-50/20 hover:bg-slate-50/50"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-display font-semibold text-sm sm:text-base text-slate-800"
                >
                  <span>{item.question}</span>
                  {isOpen ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                        <p>{item.answer}</p>
                        {/* SEO tag hints */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {item.keywords.map((kw, i) => (
                            <span key={i} className="bg-slate-100 text-slate-500 text-[10px] font-mono px-2 py-0.5 rounded">
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </article>
  );
}
