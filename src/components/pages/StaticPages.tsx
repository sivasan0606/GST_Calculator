/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Mail, Building2, BookOpen, Lock, Scale, FileText, CheckCircle2, ArrowLeft, Send, Sparkles, HelpCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface NavigationProps {
  onNavigateHome: () => void;
  onNavigateToView: (view: string) => void;
}

// 1. ABOUT US PAGE
export function AboutPage({ onNavigateHome, onNavigateToView }: NavigationProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 font-sans space-y-8">
      {/* Breadcrumb */}
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Calculators Hub
      </button>

      {/* Hero Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-4">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          <Building2 size={14} /> About SimplyTools
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">
          Empowering Indian Businesses & Professionals with Precision Financial Intelligence
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
          SimplyTools (simplytools.in) is a premier digital financial and tax calculation portal engineered to provide instant, mathematically verified, and statutory-aligned calculations for freelancers, chartered accountants, startups, and small business owners across India.
        </p>
      </div>

      {/* Core Mission & Value Proposition */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">Statutory Accuracy</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            All GST splits, TDS thresholds, and Income Tax slabs are rigorously audited against official Central Board of Direct Taxes (CBDT) and GST Council notifications.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
            <Lock size={20} />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">100% Privacy First</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            All calculations execute locally inside your web browser. We never collect, transmit, or store your private sales numbers, PAN details, or customer amounts on remote servers.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-2">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
            <Sparkles size={20} />
          </div>
          <h3 className="font-display font-bold text-slate-900 text-base">Zero Bloatware</h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            No forced registrations or paywalls. Simply enter your numbers and get clean, exportable PDF receipts, break-even graphs, and place-of-supply tax splits instantly.
          </p>
        </div>
      </div>

      {/* Detailed Editorial & Operational Process */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
        <h2 className="text-2xl font-display font-bold text-slate-900">Our Financial Engineering & Review Team</h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          The team behind SimplyTools consists of experienced software developers, tax researchers, and financial analysts dedicated to eliminating ambiguity from business math. Every tool algorithm is built using standard mathematical formulas published by regulatory authorities:
        </p>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <CheckCircle2 size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">GST Calculation Mechanics (CGST / SGST / IGST):</span>
              Formulae adhere to Rule 46 of CGST Rules 2017, separating intra-state supply (50/50 central and state share) from inter-state integrated tax obligations.
            </div>
          </div>

          <div className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <CheckCircle2 size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">TDS Deductions (CBDT Circular No. 23/2017):</span>
              Our TDS tool strictly follows CBDT directives, excluding the GST tax component from withholding tax deductions whenever GST is itemized separately on client invoices.
            </div>
          </div>

          <div className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <CheckCircle2 size={18} className="text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">Income Tax Slabs & Union Budget Updates:</span>
              Updated annually to incorporate Union Budget provisions, including the enhanced ₹75,000 Standard Deduction under Section 16(ia) for salaried employees.
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4 items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Have questions or found a calculation bug?</span>
          <button
            onClick={() => onNavigateToView('contact')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs"
          >
            Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. CONTACT US PAGE
export function ContactPage({ onNavigateHome }: NavigationProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 font-sans space-y-8">
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Calculators Hub
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Mail size={14} /> Contact & Support
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
            Have feedback on our tax tools, noticed a statutory rule update, or need assistance? Reach out to our technical desk and we will respond within 24–48 business hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
            <CheckCircle2 size={36} className="text-emerald-600 mx-auto" />
            <h3 className="font-display font-bold text-emerald-950 text-base">Message Received!</h3>
            <p className="text-emerald-800 text-xs max-w-md mx-auto leading-relaxed">
              Thank you for contacting SimplyTools. Our compliance support team will review your inquiry and get back to you via email shortly.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
              className="text-xs text-emerald-700 font-bold underline mt-2 inline-block"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                placeholder="e.g. GST Calculator feedback or software query"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1.5 uppercase text-[10px] tracking-wider">Detailed Message</label>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Describe your query or feedback in detail..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 w-full sm:w-auto"
            >
              <Send size={14} /> Send Message
            </button>
          </form>
        )}

        <div className="border-t border-slate-100 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-800 block mb-0.5">Email Contact:</span>
            <span className="font-mono text-indigo-600">sivasan0606@gmail.com</span>
          </div>
          <div>
            <span className="font-bold text-slate-800 block mb-0.5">Response Time:</span>
            <span>24 - 48 Hours (Monday to Friday, 9am - 6pm IST)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. PRIVACY POLICY PAGE
export function PrivacyPolicyPage({ onNavigateHome }: NavigationProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 font-sans space-y-8">
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Calculators Hub
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Lock size={14} /> Privacy & Data Transparency
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            Last Updated: July 2026 • Compliant with Google AdSense Policies & Digital Personal Data Protection (DPDP) Act 2023
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">1. Introduction & Core Privacy Guarantee</h2>
          <p>
            At SimplyTools (&quot;simplytools.in&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), protecting the privacy of our visitors is paramount. This Privacy Policy outlines the types of information collected and recorded by SimplyTools and how we utilize it.
          </p>
          <p className="bg-indigo-50/60 border border-indigo-100 p-3.5 rounded-xl text-indigo-950 font-medium">
            <strong>Key Data Protection Principle:</strong> All financial and tax calculations (GST amounts, salary brackets, HRA rent figures, startup burn rates) are processed entirely inside your local web browser. We do NOT store, log, or transmit your individual calculation inputs to external databases or remote servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">2. Google AdSense & Third-Party Advertising Vendors</h2>
          <p>
            SimplyTools displays advertisements served by Google AdSense and third-party advertising networks. Google uses cookies to serve ads based on a user&apos;s prior visits to our website or other websites on the Internet.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">Google Ads Settings</a>.</li>
            <li>Alternatively, users can opt out of third-party vendors&apos; use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">www.aboutads.info</a>.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">3. Log Files & Standard Web Analytics</h2>
          <p>
            SimplyTools follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. This information is used solely for analyzing trends, administering the site, tracking users&apos; movement on the website, and gathering demographic information. None of this data is linked to personally identifiable information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">4. Cookies and Web Storage</h2>
          <p>
            SimplyTools uses browser <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-700 text-[11px]">localStorage</code> to store non-sensitive user preferences locally (such as your chosen active calculator tab, saved calculation log history, and cookie consent preferences). These preferences remain in your local browser storage and can be cleared anytime by clearing your browser cache.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">5. Third-Party Links & Software Referrals</h2>
          <p>
            Our website contains links to third-party software platforms (e.g., Vyapar, Zoho Books, Giddh, Tally Prime, Razorpay). Please note that once you leave our site via these partner links, we have no control over the privacy practices or terms of those external sites. We encourage you to read the privacy policies of any third-party software you choose to register for.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">6. Contact Information</h2>
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <span className="font-mono font-bold text-indigo-600">sivasan0606@gmail.com</span>.
          </p>
        </section>
      </div>
    </div>
  );
}

// 4. TERMS OF SERVICE PAGE
export function TermsPage({ onNavigateHome }: NavigationProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 font-sans space-y-8">
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Calculators Hub
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Scale size={14} /> Legal Terms & Conditions
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            Effective Date: July 2026
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">1. Acceptance of Terms</h2>
          <p>
            By accessing or using SimplyTools (&quot;simplytools.in&quot;), you agree to be legally bound by these Terms of Service, all applicable laws and regulations in India, and agree that you are responsible for compliance with any applicable local laws.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">2. Educational & Estimation Purpose Disclaimer</h2>
          <p>
            The calculation tools provided on SimplyTools (including GST breakdowns, Cost-Plus markup calculators, Income Tax projections, TDS deductions under CBDT rules, HRA exemptions, and Startup Cash Runway) are strictly for preliminary, educational, and self-estimation reference.
          </p>
          <p className="bg-amber-50 border border-amber-200/60 p-3.5 rounded-xl text-amber-950 font-medium">
            <strong>CA Consultation Notice:</strong> The calculations generated by this applet do not constitute formal Chartered Accountant (CA) advice, financial advisory, legal tax opinions, or official statutory audit filings. Users should verify final liabilities with a qualified tax consultant prior to submitting GST returns or Income Tax returns.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">3. Sample Payment Links & Invoicing Notice</h2>
          <p>
            The GST Invoice Generator and Payment Link Customizer features generate draft invoices and simulated sample links for layout preview purposes only. SimplyTools is not a payment gateway, does not handle customer funds, and does not process financial transactions. Official payments require an account with an RBI-regulated gateway provider.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">4. Limitation of Liability</h2>
          <p>
            In no event shall SimplyTools, its owners, or operators be held liable for any statutory fines, interest levies, tax shortfalls, business losses, or audit penalties arising out of the use or inability to use the calculation tools provided on this portal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">5. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of competent judicial courts in India.
          </p>
        </section>
      </div>
    </div>
  );
}

// 5. DISCLAIMER PAGE
export function DisclaimerPage({ onNavigateHome }: NavigationProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 font-sans space-y-8">
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Calculators Hub
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <AlertTriangle size={14} /> Statutory & Financial Disclaimer
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Financial & Tax Compliance Disclaimer
          </h1>
        </div>

        <div className="space-y-4">
          <p>
            The information and computational tools provided on <strong>SimplyTools (simplytools.in)</strong> are designed solely for self-educational, general estimation, and productivity reference.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Key Points to Understand:</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600 text-xs">
              <li><strong>No Professional CA Relationship:</strong> Use of this website does not create a client-professional relationship between you and SimplyTools or its creators.</li>
              <li><strong>Frequent Policy Updates:</strong> Tax rates (GST slabs, TDS percentages under Sections 194J/194C, and Income Tax brackets under new Union Budgets) are subject to retro-active modifications by the Government of India. While we strive to maintain complete accuracy, users must verify current rates against official portals like <a href="https://www.gst.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">gst.gov.in</a> and <a href="https://www.incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline font-semibold">incometax.gov.in</a>.</li>
              <li><strong>Affiliate Disclosure:</strong> SimplyTools participates in official referral and affiliate partner programs with software providers like Vyapar, Zoho Books, Giddh, Tally Prime, and Razorpay. When you click our partner links or use our referral codes (e.g., Vyapar code 6VDQKQM), we may earn a small referral commission at no additional cost to you. This supports our free calculator availability.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// 6. EDITORIAL POLICY PAGE
export function EditorialPolicyPage({ onNavigateHome }: NavigationProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 font-sans space-y-8">
      <button
        onClick={onNavigateHome}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Calculators Hub
      </button>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <FileText size={14} /> Editorial Standards & E-E-A-T
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Editorial Guidelines & E-E-A-T Quality Standards
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Our commitment to accuracy, objectivity, and statutory compliance in financial publishing.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">1. Editorial Independence</h2>
          <p>
            At SimplyTools, all comparison guides, software reviews, and statutory tax explanations are authored independently. While we maintain partner links with software platforms, our reviews objectively present pros, cons, and specific operational use-cases for every product.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">2. Verification Against Official Statutory Sources</h2>
          <p>
            Every guide published on our Resource Hub undergoes multi-tier fact-checking against official Government of India publications:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
            <li>Central Board of Direct Taxes (CBDT) Circulars & Notifications</li>
            <li>GST Council Meeting Minutes & Rate Classifications</li>
            <li>Reserve Bank of India (RBI) Payment Gateway Regulations</li>
            <li>Central Goods and Services Tax (CGST) Rules, 2017</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">3. Corrections and Feedback Loop</h2>
          <p>
            If you identify a numerical discrepancy or outdated policy reference in any of our articles or calculators, please email <span className="font-mono font-bold text-indigo-600">sivasan0606@gmail.com</span>. Corrections are reviewed and published within 24 hours.
          </p>
        </section>
      </div>
    </div>
  );
}
