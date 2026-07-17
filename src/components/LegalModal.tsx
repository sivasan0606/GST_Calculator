import React, { useState } from 'react';
import { ShieldAlert, X, Scale, FileText, Check, AlertTriangle, ShieldCheck, Printer, HeartHandshake } from 'lucide-react';
import { motion } from 'motion/react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type LegalTab = 'terms' | 'disclaimer' | 'affiliates' | 'privacy';

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<LegalTab>('disclaimer');
  const [agreed, setAgreed] = useState(() => {
    return localStorage.getItem('simplytools_legal_consent') === 'true';
  });

  if (!isOpen) return null;

  const handleAgree = () => {
    setAgreed(true);
    localStorage.setItem('simplytools_legal_consent', 'true');
  };

  const handlePrint = () => {
    window.print();
  };

  const tabs: { id: LegalTab; label: string; icon: React.ReactNode }[] = [
    { id: 'disclaimer', label: 'Disclaimer', icon: <AlertTriangle size={14} /> },
    { id: 'terms', label: 'Terms of Service', icon: <Scale size={14} /> },
    { id: 'affiliates', label: 'Affiliates', icon: <HeartHandshake size={14} /> },
    { id: 'privacy', label: 'Privacy Policy', icon: <FileText size={14} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Scale size={18} />
            </div>
            <div>
              <h2 className="text-white font-display font-bold text-sm sm:text-base tracking-tight leading-tight">
                Disclaimer, Liability Protections & Legal Terms
              </h2>
              <p className="text-slate-400 text-[10px] sm:text-xs">
                Last updated & verified: July 13, 2026 • Version 1.1.0-Compliance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors hidden sm:block"
              title="Print Documentation"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Risk Warning Alert bar */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-6 py-3 flex items-start gap-2.5 shrink-0 text-amber-900">
          <ShieldAlert size={16} className="text-amber-700 mt-0.5 shrink-0" />
          <p className="text-[11px] leading-relaxed font-medium">
            <strong>CRITICAL LEGAL NOTICE:</strong> All calculations, rates, and information provided on <span className="underline">simplytools.in</span> (SimplyTools) are automated estimates. Tax laws and Goods and Services Tax (GST) slab rates in India are subject to continuous amendment. Do not file taxes or submit final accounts based solely on these numbers.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 overflow-x-auto scrollbar-none shrink-0 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 border-b-2 font-display text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-700 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 text-xs space-y-6 leading-relaxed">
          {activeTab === 'disclaimer' && (
            <div className="space-y-4">
              <h3 className="text-slate-900 font-display font-bold text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <AlertTriangle size={16} className="text-indigo-600" />
                1. Tax, Financial & Operational Accuracy Disclaimer (The &quot;Waiver&quot;)
              </h3>
              <p>
                <strong>1.1 No Professional Advice:</strong> SimplyTools provides digital calculation and estimation software tools including: Goods and Services Tax (GST) computation, Cost-Plus pricing models, Income Tax (Old vs. New regimes) projections, TDS (Tax Deducted at Source) splits, House Rent Allowance (HRA) exemptions, Startup Cash Runway / Burn rates, and Working Capital cycles. This application is designed solely for preliminary, self-educational reference. It does not contain, constitute, represent, or substitute for professional Chartered Accountant (CA) services, registered financial advisory, audit consultations, or legal planning.
              </p>
              <p>
                <strong>1.2 Estimation & Policy Amendments:</strong> While we employ rigorous mathematical validations and align our tools with statutory rules (such as the enhanced ₹75,000 Standard Deduction under the New Tax Regime, CBDT Circular No. 23/2017 guidelines regarding TDS on GST invoices, and standard HRA Metro/Non-Metro thresholds), we provide absolutely no warranty or representation regarding the accuracy, completeness, mathematical validity, or current relevance of the tax percentages, formulas, or outputs shown. Indian tax policies, corporate guidelines, and financial regulations are subject to rapid and retroactive revisions by the GST Council, Central Board of Direct Taxes (CBDT), and Parliament.
              </p>
              <p className="bg-slate-50 p-3 rounded-lg border border-slate-100 font-medium">
                <strong>1.3 ASSUMPTION OF FINANCIAL & COMPLIANCE RISK:</strong> By utilizing our calculators, you explicitly acknowledge that any final decisions, tax returns, payroll calculations, sales invoice pricing, inventory budgeting, or corporate fundraising strategies are executed at your own sole risk. SimplyTools, its founders, and operators shall not be held liable, under any scenario, for tax shortfalls, business losses, missed runway projections, audit failures, interest levies, or compliance penalties.
              </p>
              <p>
                <strong>1.4 No Liability for System Downtime or Logic Bugs:</strong> SimplyTools shall have no liability for system errors, decimal rounding mismatches, browser cache issues, server latency, or temporary service interruptions experienced during planning runs.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-slate-900 font-display font-bold text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <Scale size={16} className="text-indigo-600" />
                2. Terms of Service & Absolute Limitation of Liability
              </h3>
              <p>
                By accessing <span className="font-semibold text-slate-900">simplytools.in</span>, you agree to comply with and be bound by the following comprehensive statutory terms:
              </p>
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                  Section 2.1 — ABSOLUTE EXCLUSION OF LIABILITY
                </h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  IN NO EVENT AND UNDER NO LEGAL THEORY (WHETHER IN CONTRACT, TORT, OR OTHERWISE) SHALL SIMPLYTOOLS, ITS DEVELOPERS, OWNER-OPERATORS, OR CO-AFFILIATED LEGAL REPRESENTATIVES BE LIABLE TO ANY USER FOR ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES OF ANY CHARACTER, INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF GOODWILL, WORK STOPPAGE, SYSTEM CRASH OR MALFUNCTION, COMPUTER FAILURE, BUSINESS INTERRUPTION, LOSS OF REVENUE, LOSS OF COMMERCIAL DATA, TAX AUDIT ISSUES, OR PENALTIES ASSESSED BY THE GOODS AND SERVICES TAX NETWORK (GSTN) OF INDIA, ARISING OUT OF OR IN CONNECTION WITH THE USE, INABILITY TO USE, OR PERFORMANCE OF THIS WEB UTILITY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
                </p>
              </div>
              <p>
                <strong>2.2 Indemnification Covenant:</strong> You agree to defend, indemnify, and hold completely harmless SimplyTools, its owners, operators, developers, and partners from and against any and all claims, liabilities, damages, judgments, losses, costs, expenses, statutory fines, or professional fees (including reasonable legal expenses) arising out of your violation of these legal guidelines or your reliance upon information generated by the applet.
              </p>
              <p>
                <strong>2.3 External Consultations:</strong> Any lead form submissions or connections made with Chartered Accountants (CAs) through our portal are completely separate engagements. We do not inspect, certify, guarantee, or take responsibility for the qualifications, advice, or services offered by these third-party CA professionals. You must execute your own dual diligence.
              </p>
              <p>
                <strong>2.4 Legal Jurisdiction:</strong> These Terms and your access to SimplyTools are governed by the applicable laws of India. Any legal dispute, action, or claim arising from these terms must be brought exclusively in competent judicial courts.
              </p>
            </div>
          )}

          {activeTab === 'affiliates' && (
            <div className="space-y-4">
              <h3 className="text-slate-900 font-display font-bold text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <HeartHandshake size={16} className="text-indigo-600" />
                3. Affiliate Links, Referral Disclosures & Third-Party Partner Programs
              </h3>
              <p>
                SimplyTools is a digital utility directory and informational platform. To sustain our operations and remain free for Indian MSMEs, freelancers, and accountants, we participate in strategic affiliate networks, referral schemes, and official partner marketing collaborations.
              </p>
              
              <div className="space-y-3 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 text-indigo-950">
                <p className="font-bold text-xs text-indigo-900">
                  3.1 Transparent Referral & Partner Program Disclosures
                </p>
                <p className="text-[11px] leading-relaxed">
                  We display curated comparison directories, exclusive coupons, and click-through redirect buttons for leading third-party accounting and billing applications (including, but not limited to, platforms like Vyapar App, Zoho Books, Giddh, and Tally Prime). 
                </p>
                <p className="text-[11px] leading-relaxed">
                  When you click on our featured &quot;Claim Offer&quot; links, follow embedded redirects, or apply our specific discount coupon codes during registration, Sivasan (the owner-operator of SimplyTools) may receive affiliate referral credits, financial commissions, or strategic bonuses directly from the corresponding software vendors.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert size={14} className="text-rose-600" />
                  3.2 ABSOLUTE EXCLUSION OF LIABILITY REGARDING ALL REFERRED SOFTWARE & SERVICES
                </h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  BY CHOOSING TO REGISTER FOR, DOWNLOAD, SUBSCRIBE TO, TRANSACT WITH, OR USE ANY SOFTWARE AND SERVICES REFERRED OR LINKED ON THIS WEBSITE, YOU EXPLICITLY ACKNOWLEDGE AND AGREE THAT SIVASAN AND SIMPLYTOOLS PROVIDE DIRECTORY SUGGESTIONS FOR REFERENCE ONLY. SIVASAN AND SIMPLYTOOLS REPRESENT AN INDEPENDENT COMPILER AND SHALL HAVE ABSOLUTELY ZERO LIABILITY, RESPONSIBILITY, OR OBLIGATION REGARDING:
                </p>
                <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1.5">
                  <li><strong>Data Migration, Onboarding & Setup:</strong> Any mechanical errors, data corruption, system downtime, transaction delays, or accounting ledger mismatch arising during data migration, CSV file importing, or live customer onboarding services conducted by external partner support teams.</li>
                  <li><strong>Third-Party Application Security & Storage:</strong> Any cloud server outages, database crashes, software bugs, unauthorized hacks, privacy intrusions, or ransomware attacks affecting your sensitive commercial logs, client invoices, or financial accounts hosted on any third-party platform.</li>
                  <li><strong>Invoicing, Calculations & Tax Violations:</strong> Any errors in GST filing forms, e-invoice generation, e-way bill dispatches, automated accounting ledgers, or local legal/compliance fines assessed by Indian tax departments arising from calculations produced by any recommended systems.</li>
                  <li><strong>Financial Disputes:</strong> Any claims, billing disputes, recurring subscription issues, or refund denials arising between you and any third-party platform recommended, linked, or reviewed on our portal.</li>
                </ul>
              </div>

              <p>
                <strong>3.3 Full Operational Independence:</strong> SimplyTools maintains absolute corporate, legal, and operational separation from all listed software platforms. We hold no administrative control, API source code access, internal database authority, or operational ownership over our referred partners. We make no representations, endorsements, or guarantees regarding their safety protocols, messaging systems, or payment integrations.
              </p>
              <p>
                <strong>3.4 Safe External Domain Redirection:</strong> Clicking any external call-to-action redirect exits our secure domain. We advise you to review the specific Privacy Policies, Cookie Disclosures, and End-User License Agreements (EULAs) of those external destinations before entering tax credentials or business details.
              </p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h3 className="text-slate-900 font-display font-bold text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText size={16} className="text-indigo-600" />
                4. Comprehensive Privacy Policy & Google AdSense Compliance Disclosures
              </h3>
              <p>
                <strong>4.1 Introduction & Consent:</strong> At SimplyTools (simplytools.in), accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by SimplyTools and how we utilize it. By continuing to use our website, you hereby consent to our Privacy Policy and agree to its terms.
              </p>
              
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-indigo-700">
                  <ShieldCheck size={14} />
                  4.2 MANDATORY GOOGLE ADSENSE & COOKIES POLICY
                </h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  SimplyTools displays third-party advertisement banners supplied by the Google AdSense network. To ensure full compliance with Google AdSense program policies, we declare the following:
                </p>
                <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1.5">
                  <li><strong>Third-Party Vendors & Cookies:</strong> Google and other third-party advertisement vendors use proprietary tracking cookies (including the DoubleClick DART cookie) to serve personalized, contextual ads based on your prior visits to this website and other portals on the internet.</li>
                  <li><strong>Personalized Advertising:</strong> Google’s use of advertising cookies enables it and its partners to serve targeted ads to our users based on their navigation patterns on SimplyTools and other domains across the World Wide Web.</li>
                  <li><strong>How to Opt-Out:</strong> You may choose to opt-out of personalized, cookie-based advertising at any time. You can disable custom ads by visiting the official <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Google Ads Settings</a> page. Alternatively, you may choose to opt-out of third-party vendors' customized advertising cookies by visiting the <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Network Advertising Initiative (NAI) / AboutAds</a> opt-out directory.</li>
                  <li><strong>Browser Controls:</strong> Most web browsers allow you to block, manage, or delete cookies altogether. You can inspect your browser's help guidelines to manage these preferences.</li>
                </ul>
              </div>

              <p>
                <strong>4.3 Local Browser Storage Storage Memory (localStorage):</strong> To deliver a superior user experience without storing personal accounting logs on external databases, your local business profiles, tax percentage settings, active calculator states, and recent transaction lists are stored locally within your browser's sandbox (<code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">localStorage</code>). This data is completely private, remains under your exclusive device control, and is never transmitted, shared, synced, or sold by SimplyTools.
              </p>

              <p>
                <strong>4.4 Lead Forms & CA Booking Information:</strong> When you voluntarily submit a request through our CA Consultation & Sponsorship forms, we collect the necessary business contact details (such as Name, Email, Phone Number, City, and Turnover details). This information is solely utilized to process your advisory connection request or booking request with a qualified professional. We enforce strict internal safeguards and never sell, lease, rent, or distribute this data to third-party marketing brokers or cold-calling agencies.
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-slate-800">
                  4.5 INDIAN DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT, 2023 COMPLIANCE
                </h4>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Since our core digital audience consists of Indian MSMEs, tax practitioners, and independent freelancers, we respect and align our operations with the **Digital Personal Data Protection Act (DPDP Act) of India, 2023**:
                </p>
                <ul className="list-disc pl-5 text-[11px] text-slate-600 space-y-1.5">
                  <li><strong>Consent-Based Processing:</strong> We collect contact or consultation details strictly through active, affirmative opt-in consent.</li>
                  <li><strong>Right to Erasure & Correction:</strong> Users hold the absolute right to correct, update, or request the complete deletion of their personal consultation lead histories or contacts submitted through our forms. To execute these rights, please contact our support desk or request a wipe through the site's local tools.</li>
                  <li><strong>Minimal Collection:</strong> We collect only the minimum required data necessary to establish a direct connection with your matched CA professional or affiliate software partner.</li>
                </ul>
              </div>

              <p>
                <strong>4.6 California Consumer Privacy Act (CCPA) & GDPR Rights:</strong> Users from the EU (under General Data Protection Regulation) and California (under CCPA) hold statutory rights including the Right to Access, Right to Rectification, Right to Erasure, and Right to Object to data processing. Since we do not track or persist individual user navigation logs on our servers, these protections are naturally maintained. If you believe any of your contact form data was stored inaccurately, you are free to reach out to us directly for an immediate purge.
              </p>

              <p>
                <strong>4.7 Contact & Data Controller Information:</strong> If you have any remaining questions, compliance inquiries, or data removal requests regarding our Privacy Policy and Google AdSense guidelines, please feel free to reach out to our team at <span className="font-semibold text-indigo-700">sivasan0606@gmail.com</span>.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions inside Modal */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            {agreed ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
                <ShieldCheck size={16} className="text-emerald-600 animate-bounce" />
                You have consented to these protective terms.
              </span>
            ) : (
              <span className="text-slate-500 text-[11px] text-center sm:text-left">
                Please review carefully to understand your legal rights & absolute waivers.
              </span>
            )}
          </div>
          <div className="flex gap-2.5 w-full sm:w-auto">
            {!agreed && (
              <button
                onClick={handleAgree}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors active:scale-95"
              >
                <Check size={14} />
                I Understand & Agree
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs px-5 py-2.5 rounded-xl transition-colors active:scale-95"
            >
              Close Document
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
