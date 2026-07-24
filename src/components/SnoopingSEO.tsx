/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, Percent, FileSpreadsheet, ChevronDown, ChevronUp, Coins, CreditCard, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  question: string;
  answer: string;
  keywords: string[];
}

const gstFaqData: FaqItem[] = [
  {
    question: "What is the formula to calculate GST?",
    answer: "To add GST to an amount: GST Amount = Original Cost x (GST Rate / 100). Total Cost = Original Cost + GST Amount. To remove GST from an amount: GST Amount = Total Cost - [Total Cost / {1 + (GST Rate / 100)}]. Net Cost = Total Cost - GST Amount.",
    keywords: ["GST formula", "how to calculate gst", "formula for gst", "gst calculation formula", "calculate gst online", "add gst online", "remove gst formula"]
  },
  {
    question: "What is the difference between CGST, SGST, and IGST?",
    answer: "CGST (Central Goods and Services Tax) and SGST (State Goods and Services Tax) are levied on intra-state supply (within the same state), split equally (50-50) between Central and State governments. IGST (Integrated Goods and Services Tax) is levied on inter-state supply (between different states) and goes entirely to the Central government before being distributed based on consumption.",
    keywords: ["cgst vs sgst", "difference cgst sgst igst", "integrated gst", "cgst sgst igst split", "place of supply gst", "interstate tax rule"]
  },
  {
    question: "Who needs to register for GST in India?",
    answer: "Any business with an annual turnover exceeding ₹40 Lakhs for goods suppliers (₹20 Lakhs for hilly/northeastern states) or ₹20 Lakhs for service providers must register. In addition, e-commerce sellers, inter-state traders, and casual taxable persons must register regardless of turnover.",
    keywords: ["gst registration limit", "who needs gst", "turnover threshold", "gst exemption limit", "gst mandate criteria", "gst tax registration threshold"]
  },
  {
    question: "What are the active GST Slabs in India?",
    answer: "The current major GST slabs are: Exempt/0% (essential items like milk, grains), 5% (tea, spices, life-saving drugs), 18% (smartphones, capital goods, financial services), and 40% (luxury cars, cement, tobacco, high-end electronics).",
    keywords: ["gst rates india", "gst slabs list", "18 percent gst", "gst tax bracket", "latest active gst slabs", "five percent gst goods"]
  },
  {
    question: "How do I claim a GST Input Tax Credit (ITC)?",
    answer: "To claim ITC, you must possess a valid tax invoice or debit note, have received the goods/services, filed your GSTR-3B return, and the tax charged must have been paid to the government by your supplier. The invoice details must match GSTR-2B automatically in your portal.",
    keywords: ["input tax credit", "how to claim itc", "gstr-2b compliance", "claim itc refund", "gst input offset", "supplier gstr filing"]
  },
  {
    question: "Which GST billing software is best for Indian small businesses (MSMEs)?",
    answer: "For offline-first mobile and desktop billing, Vyapar App is highly popular (you can use referral partner code 6VDQKQM during sign-up). For fully featured cloud-based ledger management, Zoho Books and Giddh are excellent solutions for modern teams, while Tally Prime remains the gold standard for chartered accountants who prefer offline keyboard shortcuts and robust audit trails.",
    keywords: ["best gst billing software", "vyapar app vs tally", "zoho books vs giddh", "msme accounting india", "top billing app in india", "small business invoice software"]
  }
];

const costPlusFaqData: FaqItem[] = [
  {
    question: "What is the difference between markup and profit margin?",
    answer: "Markup is the percentage added to the cost price to determine the selling price. Margin (or Gross Margin) is the percentage of the selling price that is profit. For example, if an item costs ₹100 and sells for ₹150, the markup is 50% (₹50 profit / ₹100 cost), but the margin is 33.3% (₹50 profit / ₹150 selling price).",
    keywords: ["markup vs margin", "calculate profit margin", "difference markup margin", "markup to margin formula", "profit margin calculator", "markup percentage equation", "gross margin calculation"]
  },
  {
    question: "How do I calculate standard overhead costs for unit pricing?",
    answer: "To calculate unit overhead cost, sum up all fixed indirect expenses (such as rent, utilities, insurance, software, and administrative salaries) for a specific period (e.g., monthly). Then, divide this total fixed overhead by the estimated number of units you expect to produce or sell during that same period.",
    keywords: ["overhead calculation", "unit cost overhead", "fixed overhead expenses", "overhead cost per unit", "how to calculate overhead rate", "operating cost allocation"]
  },
  {
    question: "What is a healthy markup rate for retail products?",
    answer: "While it varies widely by industry, a standard retail markup is often 50% to 100% (known as keystone pricing). High-volume sectors like grocery operate on thin markups (10% to 15%), services and software often have markups of 200% to 500%, and specialty luxury goods can range from 100% to over 300%.",
    keywords: ["retail markup rate", "typical markup percentage", "keystone pricing standard", "average retail markup", "markup industry standards", "e-commerce product markup"]
  },
  {
    question: "How do bulk order volume discounts affect my unit profit margins?",
    answer: "Offering volume discounts lowers your per-unit markup, which reduces the gross margin on those specific sales. However, bulk orders often reduce indirect costs (like packaging, shipping, and processing overhead) and increase your total overall profit volume (net profit in currency) while boosting production efficiency.",
    keywords: ["bulk discount margin", "volume pricing markup", "wholesale pricing tiers", "quantity discount formula", "bulk order pricing strategy", "volume discount profitability"]
  }
];

const incomeTaxFaqData: FaqItem[] = [
  {
    question: "What are the major changes in the New Tax Regime for FY 2024-25 / FY 2025-26?",
    answer: "In the New Tax Regime, the Standard Deduction is increased to ₹75,000 (up from ₹50,000). The tax slabs are also optimized, offering higher tax-free limits up to ₹3 Lakhs and reduced tax rates for middle-income groups.",
    keywords: ["new tax regime slabs", "standard deduction FY 2024-25", "income tax budget updates", "regime comparisons"]
  },
  {
    question: "Which regime is better: Old or New?",
    answer: "The New Regime has lower tax rates but does not allow major deductions (like 80C, 80D, HRA, Home Loan Interest). The Old Regime is better if you have high investments and deductions exceeding ₹3.75 Lakhs annually. Otherwise, the New Regime is generally more beneficial and easier to file.",
    keywords: ["old vs new regime", "tax regime comparison", "regime calculator", "deductions old regime"]
  },
  {
    question: "Is Standard Deduction available in both Old and New Tax Regimes?",
    answer: "Yes, standard deduction is available in both regimes for salaried individuals. In the Old Regime, it is ₹50,000, while in the New Regime, it has been enhanced to ₹75,000 to encourage taxpayers to migrate to the simplified regime.",
    keywords: ["standard deduction limits", "salaried tax deductions", "flat deduction india"]
  }
];

const tdsFaqData: FaqItem[] = [
  {
    question: "Do we show or include GST in TDS (Tax Deducted at Source) calculations?",
    answer: "No! As per CBDT Circular No. 23/2017, where the GST component on services has been indicated separately on the invoice, TDS must be deducted ONLY on the base value/amount of the services. No TDS is to be deducted on the GST component. This prevents double taxation.",
    keywords: ["gst in tds", "tds on gst component", "cbdt circular 23/2017", "tds base amount", "does tds include gst", "exclude gst from tds"]
  },
  {
    question: "What are the TDS rates on professional and technical services under Section 194J?",
    answer: "Under Section 194J, professional services (like CAs, legal consultants, doctors) are subject to a 10% TDS rate if the annual transaction exceeds ₹30,000. For technical services, call center operations, and royalty fees, a lower TDS rate of 2% is applicable. If the deductee has no PAN card, a maximum rate of 20% applies.",
    keywords: ["section 194j rates", "tds professional services", "tds technical fees", "194j threshold", "tds limit india"]
  },
  {
    question: "What is the threshold limit for professional services TDS?",
    answer: "The single or cumulative transaction threshold for TDS under Section 194J is ₹30,000 per financial year. Once payments to a single professional or consultant exceed ₹30,000, TDS must be deducted. Note: Directors' remuneration is subject to TDS regardless of threshold (no limit applies).",
    keywords: ["tds threshold 194j", "professional fees limit", "directors remuneration tds limit"]
  }
];

const hraFaqData: FaqItem[] = [
  {
    question: "How is HRA (House Rent Allowance) tax exemption calculated?",
    answer: "HRA exemption is calculated as the minimum of three amounts: (1) Actual HRA received from the employer, (2) Actual rent paid minus 10% of basic salary, (3) 50% of basic salary for metro cities (Delhi, Mumbai, Kolkata, Chennai) or 40% for non-metro cities.",
    keywords: ["hra calculator formula", "section 10(13a) rules", "rent deduction limit", "metro vs non-metro basic"]
  },
  {
    question: "Is landlord PAN card mandatory for claiming HRA tax exemption?",
    answer: "Yes, if the total rent paid to the landlord exceeds ₹1,00,000 in a financial year, you must submit the landlord's Permanent Account Number (PAN) to your employer to claim HRA tax exemption. If they don't have a PAN, a written declaration must be submitted.",
    keywords: ["landlord pan for rent", "hra documents needed", "one lakh rent rule"]
  },
  {
    question: "Can I claim HRA if I pay rent to my parents?",
    answer: "Yes, you can legally claim HRA exemption by paying rent to your parents. However, you must have a formal rent agreement, make banking transfers, and your parents must declare this rent as 'Income from House Property' in their personal income tax returns.",
    keywords: ["pay rent to parents tax", "hra parental exemption", "legal rent transfer parents"]
  }
];

const runwayFaqData: FaqItem[] = [
  {
    question: "How is a startup's Cash Runway calculated?",
    answer: "Cash Runway is calculated using the formula: Cash Runway (Months) = Current Cash Balance ÷ Net Monthly Burn Rate. Net monthly burn is your total monthly expenses minus your total monthly revenues.",
    keywords: ["cash runway formula", "startup runway months", "net burn rate calculator", "financial runway definition"]
  },
  {
    question: "What is the difference between Gross Burn Rate and Net Burn Rate?",
    answer: "Gross Burn Rate is the total amount of cash your startup spends each month on operations (rent, salaries, server costs, marketing). Net Burn Rate is the actual cash lost each month, which is: Total Expenses (Gross Burn) minus Total Cash Receipts/Revenues.",
    keywords: ["gross burn vs net burn", "startup burn rate calculations", "revenue offset burn"]
  },
  {
    question: "What is a healthy startup runway length?",
    answer: "A standard healthy startup cash runway is typically between 18 to 24 months. This gives founders sufficient time to scale product-market fit, reach profitability, or execute a new fundraising cycle, which usually takes 6 to 9 months to complete.",
    keywords: ["safe cash runway", "fundraising cycle duration", "vc runway expectations"]
  }
];

const workingCapitalFaqData: FaqItem[] = [
  {
    question: "What is the Working Capital Gap?",
    answer: "The Working Capital Gap represents the total amount of current assets (Receivables + Inventory) minus current liabilities (Payables). It shows the net funding required to sustain day-to-day operations before external bank borrowings or lines of credit are introduced.",
    keywords: ["working capital gap", "net operating assets", "wc gap definition", "funding operational deficits"]
  },
  {
    question: "How does the Cash Conversion Cycle (CCC) affect working capital?",
    answer: "The Cash Conversion Cycle (CCC) measures the days it takes to turn raw inventory purchases into cash receipts from sales. Formula: CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO). A shorter CCC reduces the working capital gap.",
    keywords: ["cash conversion cycle formula", "inventory days debtor days", "creditor payable days cycle"]
  },
  {
    question: "How do you optimize or reduce a Working Capital Gap?",
    answer: "You can optimize your gap by: (1) Accelerating collections from debtors (decreasing DSO), (2) Managing inventory turnover efficiently (decreasing DIO), and (3) Renegotiating credit terms with suppliers to pay later (increasing DPO).",
    keywords: ["reduce debtor days", "optimize inventory cycle", "extend supplier credit terms"]
  }
];

const razorpayFaqData: FaqItem[] = [
  {
    question: "How is the Razorpay payment gateway transaction fee calculated?",
    answer: "Razorpay charges a percentage-based processing fee per transaction. The standard rate is 2% for domestic credit/debit cards, net banking, and wallets, and 3% for international cards, corporate cards, and Amex. To obtain the total fee deduction, you must also add 18% GST on top of the processing fee.",
    keywords: ["razorpay fees", "gateway transaction cost", "processing commission India"]
  },
  {
    question: "Do payment gateways in India charge GST on transaction fees?",
    answer: "Yes, under Indian tax regulations, payment gateways must levy 18% Goods and Services Tax (GST) on the commission they charge. For example, if the gateway fee is 2% on a ₹10,000 payment (₹200), the GST on the fee will be 18% of ₹200 (₹36), resulting in a total deduction of ₹236.",
    keywords: ["gst on payment gateway", "18% gst payment processing", "withholding tax gateway"]
  },
  {
    question: "How does the 'Pass Fee to Client' (Reverse) calculator work?",
    answer: "If you want to receive exactly your project's target amount (e.g., ₹10,000) in your bank, you must bill your client a higher invoice amount to offset the processor's cut. The reverse formula is: Invoice Amount = Target Net Payout ÷ [1 - (Fee Rate × (1 + GST Rate))]. For standard 2% cards with 18% GST, you would bill ₹10,241.71.",
    keywords: ["pass fee to client formula", "invoice surcharge", "payment gateway calculator india"]
  }
];

const gstInvoiceFaqData: FaqItem[] = [
  {
    question: "What are the mandatory fields for a valid GST Tax Invoice in India?",
    answer: "A valid GST tax invoice must include: (1) Seller's name, address, and GSTIN, (2) Buyer's name, address, and GSTIN (if registered), (3) Unique sequential Invoice Number, (4) Date of issue, (5) Description, quantity, unit, and value of goods/services, (6) Separate breakdown of CGST, SGST, and IGST rates and amounts, and (7) Place of Supply declaration.",
    keywords: ["mandatory gst invoice fields", "gstin formatting rules", "cgst sgst igst split rules"]
  },
  {
    question: "How do you determine whether to apply CGST + SGST vs IGST?",
    answer: "This is determined by comparing the Location of the Supplier (the seller's state) and the Place of Supply (the client's billing state). If they are in the same state, it is an intra-state transaction, and you must charge equal parts CGST and SGST (e.g., 9% + 9% for an 18% total). If they are in different states, it is an inter-state transaction, and you must charge full IGST (18%).",
    keywords: ["place of supply rules", "cgst sgst vs igst state rules", "intra state tax billing"]
  },
  {
    question: "Why should freelancers and small businesses link invoices with Razorpay?",
    answer: "Manually tracking client transfers is slow and error-prone. Linking digital invoices directly with a unique Razorpay payment link allows clients to settle dues via UPI, credit cards, net banking, or wallets instantly. Razorpay also triggers automated settlement reports matching payments with invoice IDs.",
    keywords: ["razorpay invoice automation", "freelancer payment collection india", "digital payment links in pdf"]
  }
];

interface SnoopingSEOProps {
  type?: 'gst' | 'costplus' | 'income-tax' | 'tds' | 'hra' | 'runway' | 'working-capital' | 'razorpay-fee' | 'gst-invoice';
}

export default function SnoopingSEO({ type = 'gst' }: SnoopingSEOProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Auto-reset open FAQ when type changes
  useEffect(() => {
    setOpenFaq(0);
  }, [type]);

  // Map type to FAQ data
  const getFaqData = (): FaqItem[] => {
    switch (type) {
      case 'costplus': return costPlusFaqData;
      case 'income-tax': return incomeTaxFaqData;
      case 'tds': return tdsFaqData;
      case 'hra': return hraFaqData;
      case 'runway': return runwayFaqData;
      case 'working-capital': return workingCapitalFaqData;
      case 'razorpay-fee': return razorpayFaqData;
      case 'gst-invoice': return gstInvoiceFaqData;
      default: return gstFaqData;
    }
  };

  const faqData = getFaqData();

  // Rendering Cost-Plus
  if (type === 'costplus') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-indigo-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Pricing Strategy Hub
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• 6,200+ Monthly Business Planning Potential</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Comprehensive Cost-Plus Pricing & Profit Margin Calculation Guide
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          Establishing a viable pricing strategy is the cornerstone of business longevity. This educational handbook provides small business owners, manufacturers, e-commerce sellers, and freelancers with the formulas and insights needed to project unit costs, apply markups, and calculate accurate profit margins.
        </p>

        {/* Grid with visual sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Markup vs Margin Conversion Table */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-indigo-600" />
              Markup vs. Resulting Gross Margin Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="pb-2">Cost Markup</th>
                    <th className="pb-2">Gross Profit Margin</th>
                    <th className="pb-2">Typical Industry Sectors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900 font-mono">15% Markup</td>
                    <td className="py-2.5 font-semibold text-slate-650 font-mono">13.04% Margin</td>
                    <td className="py-2.5">Supermarkets, bulk wholesalers, commodity trading</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-indigo-600 font-mono">30% Markup</td>
                    <td className="py-2.5 font-semibold text-indigo-600 font-mono">23.08% Margin</td>
                    <td className="py-2.5">Electronics, hardware distribution, consumer appliances</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-indigo-600 font-mono">50% Markup</td>
                    <td className="py-2.5 font-semibold text-indigo-600 font-mono">33.33% Margin</td>
                    <td className="py-2.5">Standard retail, custom fabrications, restaurants</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-rose-600 font-mono">100% (Keystone)</td>
                    <td className="py-2.5 font-semibold text-rose-650 font-mono">50.00% Margin</td>
                    <td className="py-2.5">Apparel, jewelry, high-end furniture, software/SaaS</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200/60 mt-4 text-[11px] text-slate-500 leading-relaxed">
              <strong>Key Principle:</strong> Never confuse markup with margin! If you add a 30% markup to your cost, your final profit margin is actually only 23.08% of the final selling price.
            </div>
          </div>

          {/* Mathematical Formulas */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-indigo-600" />
              Standard Cost-Plus Pricing Formulas
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 block mb-1">
                  Step 1: Determine Total Unit Cost
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  Combine direct materials, direct labor, and proportional overhead allocated per single unit:
                </p>
                <code className="block bg-slate-900 text-indigo-400 font-mono text-xs p-2 rounded text-center">
                  Unit Cost = Material Cost + Labor + Overhead
                </code>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block mb-1">
                  Step 2: Calculate Selling Price with Markup
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  Apply your target markup rate percentage to the total accumulated unit cost:
                </p>
                <code className="block bg-slate-900 text-emerald-400 font-mono text-xs p-2 rounded text-center">
                  Price = Unit Cost × [1 + (Markup Rate ÷ 100)]
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* The Markup vs Margin Paradox explanation box */}
        <div className="bg-indigo-950 text-slate-200 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-display font-bold text-white text-base mb-2 flex items-center gap-2">
            The Markup vs. Gross Profit Margin Paradox
          </h3>
          <p className="text-xs text-indigo-200 max-w-2xl leading-relaxed mb-4">
            Unsure why your business margins are consistently lower than your markup rate? Let's clarify the mathematics of unit economics once and for all:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-indigo-500/20 mb-1 inline-block">
                Cost Markup (Add-On)
              </span>
              <h4 className="text-white text-xs font-semibold mb-1">Based on Cost Price</h4>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                If your base unit cost is <strong>₹100</strong> and you want a <strong>50% Markup</strong>, you add ₹50. The customer pays <strong>₹150</strong>. The calculation is relative to what the item cost you to produce.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-emerald-500/20 mb-1 inline-block">
                Gross Profit Margin (Revenue Take)
              </span>
              <h4 className="text-white text-xs font-semibold mb-1">Based on Selling Price</h4>
              <p className="text-[11px] text-slate-200 leading-relaxed">
                Using that same selling price of <strong>₹150</strong>, your ₹50 profit constitutes exactly <strong>33.33%</strong> of the total revenue. Margin is relative to the transaction price paid by the customer.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-indigo-600" size={20} />
            Frequently Asked Questions — Cost-Plus Unit Pricing Strategy
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

  // Rendering TDS (Tax Deducted at Source)
  if (type === 'tds') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-amber-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Compliance & Tax Handbook
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• CBDT Compliant TDS Calculator</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Comprehensive Guide to TDS on Professional & Technical Services
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          Tax Deducted at Source (TDS) under Section 194J is a major operational compliance for Indian businesses, SMEs, and startups. This ultimate guide explains the mathematical splits, threshold rules, and clarifies the relationship between GST invoices and TDS.
        </p>

        {/* Grid with visual sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* TDS Rate Matrix */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-amber-600" />
              Section 194J TDS Slab Rates & Thresholds
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="pb-2">Service Type</th>
                    <th className="pb-2">TDS Rate</th>
                    <th className="pb-2">PAN Absent</th>
                    <th className="pb-2">Threshold Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">Professional Fees</td>
                    <td className="py-2.5 font-bold text-emerald-600 font-mono">10%</td>
                    <td className="py-2.5 font-mono">20%</td>
                    <td className="py-2.5">₹30,000 / year</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">Technical / FTS</td>
                    <td className="py-2.5 font-bold text-indigo-600 font-mono">2%</td>
                    <td className="py-2.5 font-mono">20%</td>
                    <td className="py-2.5">₹30,000 / year</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">Call Center Ops</td>
                    <td className="py-2.5 font-bold text-indigo-600 font-mono">2%</td>
                    <td className="py-2.5 font-mono">20%</td>
                    <td className="py-2.5">₹30,000 / year</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-slate-900">Director's Fees</td>
                    <td className="py-2.5 font-bold text-rose-600 font-mono">10%</td>
                    <td className="py-2.5 font-mono">20%</td>
                    <td className="py-2.5 font-semibold">No Threshold</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200/60 mt-4 text-[11px] text-slate-500 leading-relaxed">
              <strong>Important Rule:</strong> TDS is strictly computed on the <strong>base amount</strong> excluding the GST component. If GST is indicated separately, do not apply TDS on the GST tax component!
            </div>
          </div>

          {/* Mathematical Formulas */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-amber-600" />
              The GST on TDS CBDT Rule
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-600 block mb-1">
                  CBDT Circular No. 23/2017 Guidance
                </span>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  To prevent circular taxation, the Central Board of Direct Taxes issued a definitive mandate:
                </p>
                <div className="bg-slate-900 text-slate-200 font-mono text-[11px] p-3 rounded leading-normal">
                  <div className="text-amber-400 font-bold mb-1">// Base calculation rules:</div>
                  TDS Amount = Base Amount × (TDS Rate ÷ 100)<br />
                  Gross Invoice = Base Amount + GST Amount<br />
                  Final Net Payable = Gross Invoice - TDS Amount
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The GST on TDS rule banner */}
        <div className="bg-amber-950 text-slate-200 rounded-xl p-5 my-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="font-display font-bold text-white text-base mb-2 flex items-center gap-2">
            Do we calculate TDS on the GST component?
          </h3>
          <p className="text-xs text-amber-200 leading-relaxed">
            <strong>No!</strong> Tax Deducted at Source must be computed solely on the base service cost. If an invoice lists a ₹50,000 base fee and 18% GST (₹9,000), your professional TDS (10%) is calculated strictly on <strong>₹50,000</strong> (which equals ₹5,000), NOT on the gross ₹59,000.
          </p>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-amber-600" size={20} />
            Frequently Asked Questions — TDS on GST & Professional Fees
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

  // Rendering Income Tax
  if (type === 'income-tax') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-emerald-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Tax Slabs Guide
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• Budget FY 2024-25 / FY 2025-26</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Indian Income Tax Slabs: Old vs. New Tax Regime Comparison
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          Choosing between the Old and New Tax Regimes requires a detailed calculation of deductions vs. tax slab differentials. This guide breaks down the standard deduction enhancements and tax rates under Section 115BAC.
        </p>

        {/* Slabs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* New Regime Slabs */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-emerald-600" />
              New Tax Regime Slabs (FY 2024-25 / 2025-26)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="pb-2">Income Slab</th>
                    <th className="pb-2">Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr>
                    <td className="py-2">Up to ₹3,000,000</td>
                    <td className="py-2 text-emerald-600 font-bold">0%</td>
                  </tr>
                  <tr>
                    <td className="py-2">₹300,001 to ₹700,000</td>
                    <td className="py-2 font-bold text-slate-800">5%</td>
                  </tr>
                  <tr>
                    <td className="py-2">₹700,001 to ₹1,000,000</td>
                    <td className="py-2 font-bold text-slate-800">10%</td>
                  </tr>
                  <tr>
                    <td className="py-2">₹1,000,001 to ₹1,200,000</td>
                    <td className="py-2 font-bold text-slate-800">15%</td>
                  </tr>
                  <tr>
                    <td className="py-2">₹1,200,001 to ₹1,500,000</td>
                    <td className="py-2 font-bold text-slate-800">20%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Above ₹1,500,000</td>
                    <td className="py-2 font-bold text-rose-600">30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Old Regime Slabs */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-indigo-600" />
              Old Tax Regime Slabs (With Deductions)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="pb-2">Income Slab</th>
                    <th className="pb-2">Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                  <tr>
                    <td className="py-2">Up to ₹250,000</td>
                    <td className="py-2 text-indigo-600 font-bold">0%</td>
                  </tr>
                  <tr>
                    <td className="py-2">₹250,001 to ₹500,000</td>
                    <td className="py-2 font-bold text-slate-800">5%</td>
                  </tr>
                  <tr>
                    <td className="py-2">₹500,001 to ₹1,000,000</td>
                    <td className="py-2 font-bold text-slate-800">20%</td>
                  </tr>
                  <tr>
                    <td className="py-2">Above ₹1,000,000</td>
                    <td className="py-2 font-bold text-rose-600">30%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-emerald-600" size={20} />
            Frequently Asked Questions — Old vs New Tax Regime Slabs
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

  // Rendering HRA (House Rent Allowance)
  if (type === 'hra') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-blue-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Exemption Calculator
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• Section 10(13A) Compliance</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          How to Calculate HRA Tax Exemption & Rent Allowances
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          For salaried employees in India, House Rent Allowance (HRA) is one of the most effective tax exemptions. Understand the 3-step mathematical minimum logic and metro city classification requirements.
        </p>

        {/* HRA 3 Rules Grid */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mt-8">
          <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-blue-600" />
            The Three-Step HRA Exemption Formula (Section 10(13A))
          </h3>
          <p className="text-xs text-slate-600 mb-4 leading-relaxed">
            Your final tax exempt HRA is strictly the **minimum (lowest)** of the following three calculated components:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white p-4 rounded-lg border border-slate-200/60">
              <span className="block font-bold text-blue-600 uppercase text-[10px] tracking-wider mb-1">Condition 1</span>
              <p className="text-slate-800 font-semibold mb-1">Actual HRA Received</p>
              <p className="text-slate-500 text-[11px]">The total House Rent Allowance component provided in your monthly salary package.</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200/60">
              <span className="block font-bold text-emerald-600 uppercase text-[10px] tracking-wider mb-1">Condition 2</span>
              <p className="text-slate-800 font-semibold mb-1">Rent Paid minus 10% of Basic</p>
              <p className="text-slate-500 text-[11px]">Actual annual rent paid to landlord minus 10% of your (Basic Salary + Dearness Allowance).</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200/60">
              <span className="block font-bold text-indigo-600 uppercase text-[10px] tracking-wider mb-1">Condition 3</span>
              <p className="text-slate-800 font-semibold mb-1">40% or 50% of Basic</p>
              <p className="text-slate-500 text-[11px]">50% of basic salary if residing in Metro cities (Mumbai, Delhi, Kolkata, Chennai), 40% elsewhere.</p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-blue-600" size={20} />
            Frequently Asked Questions — Claiming HRA Exemption legally
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

  // Rendering Startup Cash Runway
  if (type === 'runway') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-violet-50 text-violet-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-violet-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Startup Operations
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• Multi-Currency Cash runway</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Startup Cash Runway & Monthly Burn Rate Projection Guide
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          For tech startups, MSMEs, and early-stage companies, cash runway is the ultimate metric of survival. This educational reference explains how to accurately define net burn rate, forecast growth impacts, and extend operational lifespans.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-violet-600" />
              Startup Runway Key Formulas
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-slate-200/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 block mb-1">
                  1. Monthly Net Burn Rate
                </span>
                <code className="block bg-slate-900 text-violet-400 font-mono text-xs p-2 rounded text-center">
                  Net Burn = Monthly Expenses - Monthly Revenue
                </code>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200/50">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 block mb-1">
                  2. Cash Runway (Months)
                </span>
                <code className="block bg-slate-900 text-emerald-400 font-mono text-xs p-2 rounded text-center">
                  Runway = Cash Balance ÷ Monthly Net Burn
                </code>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-violet-600" />
              Strategic Runway Extension Methods
            </h3>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
              <li><strong>Expense Cut Strategy:</strong> Reducing discretionary marketing budgets and slowing administrative hires immediately reduces gross burn rate.</li>
              <li><strong>Revenue Expansion:</strong> Driving growth in recurring contracts (MRR) offsets operational costs directly, leading to a much lower net burn.</li>
              <li><strong>Funding / Capital Infusion:</strong> Securing venture capital or founder debt extends cash balance reserves.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-violet-600" size={20} />
            Frequently Asked Questions — Cash Runway & Startup Survival
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

  // Rendering Working Capital
  if (type === 'working-capital') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-rose-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Cash flow planning
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• Working Capital cycle analysis</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Guide to Working Capital Gap, DIO, DSO, & Cash conversion cycles
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          Understanding the operating cash cycle is vital for manufacturers and retailers. This guide clarifies how Days Inventory Outstanding (DIO), Days Sales Outstanding (DSO), and Days Payable Outstanding (DPO) shape your business working capital gap.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-rose-600" />
              Cash Conversion Cycle (CCC) Structure
            </h3>
            <div className="space-y-3 font-sans text-xs text-slate-600">
              <p>
                The <strong>Cash Conversion Cycle</strong> measures the net time (in days) your money is locked up in raw materials and inventory before turning back into cash from sales receipts:
              </p>
              <code className="block bg-slate-900 text-rose-400 font-mono text-xs p-2.5 rounded text-center">
                CCC = Inventory Days + Receivable Days - Payable Days
              </code>
              <p className="text-[11px] bg-white p-2 rounded border border-slate-200/60 leading-relaxed">
                A lower or negative CCC is highly favorable because it indicates the business is funded organically by supplier credit instead of expensive operational loans.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-rose-600" />
              Slab Definitions & Industry Benchmarks
            </h3>
            <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2">
              <li><strong>Debtor Days (DSO):</strong> Target below 30 to 45 days. High debtor days show clients are slow to pay bills.</li>
              <li><strong>Inventory Days (DIO):</strong> Varies widely. Tech products target below 15 days; luxury or heavy machinery can exceed 90 days.</li>
              <li><strong>Creditor Days (DPO):</strong> Target 45 to 60 days. Safely extending payables with suppliers preserves valuable operating liquidity.</li>
            </ul>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-rose-600" size={20} />
            Frequently Asked Questions — Working Capital Gap & Liquidity
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

  // Rendering Razorpay Payouts
  if (type === 'razorpay-fee') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-indigo-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Merchant settlements
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• Payment Gateway fee mechanics</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Guide to Payment Gateway Rates, GST, & Net Settlement Calculations
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          For freelancers, independent creators, agency owners, and MSMEs in India, understanding merchant fee structures is critical to protecting margins. This reference guide explains how payment processor commissions and GST shape your actual cash payouts.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-indigo-600" />
              Standard Razorpay Fee Structure
            </h3>
            <div className="space-y-3 font-sans text-xs text-slate-600">
              <p>
                Under standard Indian merchant guidelines, processing fees are applied differently based on the client's funding method:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>UPI:</strong> Usually 0.0% fee on standard transactions.</li>
                <li><strong>RuPay Debit Cards:</strong> Zero MDR mandated by Govt guidelines.</li>
                <li><strong>Credit Cards / Netbanking:</strong> Flat 2.0% processing fee.</li>
                <li><strong>International Credit Cards:</strong> Flat 3.0% processing commission.</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-indigo-600" />
              GST on Commission Fees & Surcharges
            </h3>
            <div className="space-y-3 font-sans text-xs text-slate-600">
              <p>
                In addition to standard processing commissions, Indian tax law mandates an <strong>18% GST rate</strong> on top of the gateway's service charges.
              </p>
              <code className="block bg-slate-900 text-indigo-300 font-mono text-xs p-2.5 rounded text-center">
                Effective Fee Rate = Standard Rate × 1.18
              </code>
              <p className="text-[11px] leading-normal bg-white p-2 rounded border border-slate-200/60">
                This means a standard 2.0% credit card transaction has an actual effective deduction of <strong>2.36%</strong> on your invoice amount.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-indigo-600" size={20} />
            Frequently Asked Questions — Razorpay Fees & Net Surcharges
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

  // Rendering GST Invoice Generator
  if (type === 'gst-invoice') {
    return (
      <article className="my-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs">
        {/* Dynamic SEO Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 text-[10px] sm:text-xs px-2.5 py-1 rounded-full border border-indigo-200/50 font-semibold font-display uppercase tracking-wider">
            <BookOpen size={12} /> Billing compliance
          </span>
          <span className="text-slate-600 text-xs font-mono font-medium">• Professional invoice formatting</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Guide to GST Invoicing Rules, Tax Split Calculations, & Instant Client Surcharges
        </h2>
        <p className="text-slate-600 text-sm mt-3 leading-relaxed max-w-3xl">
          For agencies, freelancers, and independent developers in India, issuing precise tax invoices is not just legally mandatory—it protects cash flows. This guide outlines how to handle tax splits and payment gateways easily.
        </p>

        {/* Formulas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Percent size={16} className="text-indigo-600" />
              Tax Split Mechanics (CGST/SGST vs IGST)
            </h3>
            <div className="space-y-3 font-sans text-xs text-slate-600">
              <p>
                The tax splits apply automatically depending on where you and your client are located:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Local Supply:</strong> When both states match, split the GST evenly between CGST (Central Tax) and SGST (State Tax).</li>
                <li><strong>Interstate Supply:</strong> When states differ, apply the full percentage to IGST (Integrated Tax).</li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
            <h3 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Coins size={16} className="text-indigo-600" />
              Embedded Payment Link Surcharges
            </h3>
            <div className="space-y-3 font-sans text-xs text-slate-600">
              <p>
                To avoid losing credit/debit card processing percentages on large client transfers, many digital freelancers add a surcharge or use Razorpay's auto-generated links to specify exact payable settlements.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-100 pt-8 mt-8">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
            <HelpCircle className="text-indigo-600" size={20} />
            Frequently Asked Questions — GST Invoicing & Payment Links
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

  // Fallback to GST Content
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
              If your retail store is in Delhi and the buyer is in Delhi, an 18% GST item charges <strong>9% CGST</strong> (goes to Delhi central government account) and <strong>9% SGST</strong> (goes to Delhi state chest).
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

      {/* FAQ Accordion Section */}
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
