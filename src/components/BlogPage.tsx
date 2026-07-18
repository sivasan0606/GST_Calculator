/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, User, Clock, ArrowLeft, ChevronRight, BookOpen, Star, Sparkles, Filter, CheckCircle, Mail, Send, Share2, Wrench, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { BlogPost, SiteSettings } from '../types';

const TROUBLESHOOTING_DATA = {
  zoho: [
    {
      id: 'zoho-1',
      title: '🔴 Fix: E-Invoices stuck in "Pending" status (IRP Portal Sync Failure)',
      issue: 'Your e-invoices are stuck in "Pending" status and Zoho Books is not automatically generating the mandatory Government IRN or QR codes.',
      rootCause: 'Your E-Invoicing API credentials (GSP credentials) are either expired, missing, or you accidentally entered your everyday GST portal login instead of your dedicated API portal credentials.',
      steps: [
        'Open Zoho Books and click the Settings (Gear Icon) in the top right corner, then go to Preferences > E-Invoicing.',
        'Scroll to your active portal username and click the "Edit Credentials" button.',
        'Enter your GSP API Username and Password. (⚠️ Warning: This must be the custom API credentials generated on the Govt E-Invoice system, NOT your standard daily GST Portal login!).',
        'Click "Save & Validate" to refresh the link. Finally, open the pending invoice and click "Sync E-Invoice" to push it through instantly!'
      ]
    },
    {
      id: 'zoho-2',
      title: '🔴 Fix: Bank feeds matching wrong amounts by skipping TDS (Sec 194J)',
      issue: 'Imported automatic bank feeds match incoming payments exactly but ignore the 10% or 2% TDS tax deduction on your client invoices.',
      rootCause: 'Zoho\'s automated reconciliation rule maps the absolute received amount directly, bypassing the necessary split-booking for tax receivables.',
      steps: [
        'Go to the Banking module on the left side menu and click your active bank account.',
        'Find the transaction displaying the green "Match Found" banner, click on it, and select "Categorize Manually" at the bottom instead.',
        'Set the primary ledger Category to your Professional Services Expense or Sales Income account.',
        'Check the "TDS Applicable" checkbox, choose Sec 194J (2% or 10%), and enter the original pre-tax invoice amount. Zoho will automatically record the missing amount into your TDS Receivable ledger.'
      ]
    },
    {
      id: 'zoho-3',
      title: '🔴 Fix: Zoho Books charging local CGST/SGST instead of Interstate IGST',
      issue: 'The system incorrectly calculates local CGST and SGST on customers who live in a completely different state.',
      rootCause: 'The customer\'s record is either missing a state configuration, or the "Place of Supply" field is misconfigured in their contact file.',
      steps: [
        'Open the Contacts module and select the affected client.',
        'Click the Edit button in the top right, then navigate to the Address tab.',
        'Locate the "Place of Supply" dropdown menu and double-check that it matches the customer\'s registered GSTIN state precisely.',
        'Click Save. Now, recreate your invoice draft—Zoho will instantly apply the unified IGST tax instead of splitting local taxes!'
      ]
    }
  ],
  vyapar: [
    {
      id: 'vyapar-1',
      title: 'Offline PDF invoices not printing CGST/SGST tax split',
      issue: 'Printed invoice PDFs show a flat tax column with a lumped tax sum instead of detailed CGST & SGST splits.',
      rootCause: 'Your active invoice theme has detailed tax columns turned off by default to conserve space.',
      steps: [
        'Launch the Vyapar desktop or mobile application and open the left navigation drawer.',
        'Go to Settings > Invoice Settings > Invoice Templates.',
        'Select your current active print theme (e.g., Stylish, Premium, etc.) and click "Customize Layout".',
        'Enable the toggle for "Show CGST/SGST Split Columns" and click Save. Old and new invoices will now render compliant itemized splits.'
      ]
    },
    {
      id: 'vyapar-2',
      title: 'Google Drive automatic cloud backup failing continuously',
      issue: 'Vyapar displays a yellow warning icon saying backup failed or could not connect to your cloud storage.',
      rootCause: 'Android operating system storage/file permissions have been revoked, or the Google OAuth session token expired.',
      steps: [
        'Close the app, go to your phone\'s Settings > Apps > Vyapar.',
        'Tap on Permissions and ensure "Files and Media" or "Storage" is set to "Allow Always".',
        'Re-open Vyapar, navigate to Settings > Backup & Restore.',
        'Tap "Disconnect Google Account" to clear stale cached logins, then tap "Link Google Account" again.',
        'Complete the secure Google authentication in your browser and press "Backup Now" to verify immediately.'
      ]
    },
    {
      id: 'vyapar-3',
      title: 'Party balances showing discrepancies after bulk Excel importing',
      issue: 'Receivables and payables shown in the dashboard do not reconcile with your actual ledger book after spreadsheet import.',
      rootCause: 'Excel templates contained trailing whitespace characters, custom formula rows, or blank columns in the Opening Balance column.',
      steps: [
        'Go to Parties menu, search for any imported party, and export their ledger to inspect the row logs.',
        'If blank names exist, use the "Bulk Delete Parties" utility under Utilities > Excel Import Tools.',
        'Sanitize your Excel spreadsheet: ensure the "Opening Balance" column has clean numeric characters (no commas, currency symbols, or blank cells).',
        'Re-import your spreadsheet and verify the trial ledger matches.'
      ]
    }
  ],
  giddh: [
    {
      id: 'giddh-1',
      title: 'Analytical Ledger discrepancy between Trial Balance and General Ledger',
      issue: 'Real-time dashboard charts show un-synchronized figures compared to generated financial summaries.',
      rootCause: 'Analytical background database is unsynced due to unmapped opening balances in a newly imported branch.',
      steps: [
        'Log in to Giddh and navigate to the Ledger dashboard.',
        'Select the active branch from the upper right dropdown, then open Settings > Taxes & Discounts.',
        'Verify that all Opening Balances match the previous year\'s closing statement.',
        'Go to Company Settings > Utilities, click "Regenerate Analytical Ledger", and refresh your browser window to trigger full synchronization.'
      ]
    },
    {
      id: 'giddh-2',
      title: 'REST API webhook triggers failing for real-time sales invoices',
      issue: 'External customer management systems fail to trigger invoice creation in Giddh on webhook requests.',
      rootCause: 'Payload is missing mandatory two-digit regional state codes or the auth token is invalid.',
      steps: [
        'Open your Giddh Developer Console and review the failing Webhook Delivery logs.',
        'Ensure the webhook payload strictly includes the mandatory two-digit state code (e.g., "27" for Maharashtra, "29" for Karnataka) inside the client billing address object.',
        'Check that the "Authorization" request header contains your active company token, and is not using an expired developer token.',
        'Send a test cURL request to verify that the return response payload says "Invoice Created Successfully".'
      ]
    },
    {
      id: 'giddh-3',
      title: 'Multi-branch GST returns failing with validation schema errors',
      issue: 'GSTR-1 or GSTR-3B JSON exports are rejected by the GST portal with a format schema mismatch error.',
      rootCause: 'Branch tax profiles contain incomplete field records, such as missing HSN codes or incorrect tax rates.',
      steps: [
        'Go to the GST Return module in Giddh and select the target filing period.',
        'Click on "Validate Return Data" to run the built-in Giddh error scanner.',
        'Locate flagged transactions under the "Error Logs" tab—common fixes include adding missing HSN/SAC codes or correcting customer GSTIN formats.',
        'Once all errors are zeroed out, download the GSTR JSON and upload it to the government portal.'
      ]
    }
  ]
};

interface BlogPageProps {
  posts: BlogPost[];
  settings: SiteSettings;
  onNavigateToCalculator?: () => void;
}

export default function BlogPage({ posts, settings, onNavigateToCalculator }: BlogPageProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [troubleSoftware, setTroubleSoftware] = useState<'zoho' | 'vyapar' | 'giddh'>('zoho');
  const [expandedTroubleId, setExpandedTroubleId] = useState<string | null>(null);

  // Get unique categories
  const categories = useMemo(() => {
    const list = new Set(posts.map(p => p.category));
    return ['All', ...Array.from(list)];
  }, [posts]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            post.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Find currently selected post
  const activePost = useMemo(() => {
    return posts.find(p => p.id === selectedPostId || p.slug === selectedPostId) || null;
  }, [posts, selectedPostId]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => setSubscribed(false), 3500);
  };

  const shareArticle = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Copied article link to clipboard: "${title}"`);
    }
  };

  // If a post is active, show the rich editorial view
  if (activePost) {
    return (
      <div className="max-w-4xl mx-auto py-6 font-sans">
        {/* Back navigation */}
        <button
          onClick={() => setSelectedPostId(null)}
          className="group inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-xs font-semibold mb-6"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Weekly Resource Hub</span>
        </button>

        {/* Article Container */}
        <article className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-indigo-600 uppercase tracking-wider mb-4">
            <span className="bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              {activePost.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Calendar size={12} /> {activePost.publishedAt}
            </span>
            <span className="text-slate-400">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-medium">
              <Clock size={12} /> {activePost.readTime}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight mb-4">
            {activePost.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center gap-3 pb-6 mb-8 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
              {activePost.author.charAt(0) || 'T'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{activePost.author}</p>
              <p className="text-[10px] text-slate-400">Resource Editorial Team</p>
            </div>
            <button
              onClick={() => shareArticle(activePost.title)}
              className="ml-auto flex items-center gap-1 text-slate-400 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 px-3 py-1.5 rounded-xl text-xs transition-all"
            >
              <Share2 size={12} />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Render article contents with pretty paragraph formatting */}
          <div className="prose prose-slate max-w-none text-slate-700 text-sm leading-relaxed space-y-6">
            {activePost.content.split('\n\n').map((paragraph, idx) => {
              // Format major headings starting with ###
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-lg font-bold font-display text-slate-900 mt-8 mb-2 flex items-center gap-2 border-l-4 border-indigo-600 pl-3">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              // Format subheadings starting with ##
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={idx} className="text-xl font-bold font-display text-slate-900 mt-10 mb-3 border-b border-slate-100 pb-2">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              // Format quotes or callouts starting with >
              if (paragraph.startsWith('> ')) {
                return (
                  <div key={idx} className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl my-6 text-indigo-900 font-medium italic">
                    {paragraph.replace('> ', '')}
                  </div>
                );
              }
              // Render standard table if it detects a table structure
              if (paragraph.includes('|')) {
                const lines = paragraph.split('\n').filter(line => line.includes('|'));
                const rows = lines.map(line => line.split('|').map(cell => cell.trim()).filter(Boolean));
                if (rows.length > 0) {
                  return (
                    <div key={idx} className="overflow-x-auto my-6 border border-slate-200 rounded-2xl">
                      <table className="w-full text-xs text-left">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-800">
                            {rows[0].map((cell, cidx) => (
                              <th key={cidx} className="p-3">{cell}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {rows.slice(2).map((row, ridx) => (
                            <tr key={ridx} className="hover:bg-slate-50/50">
                              {row.map((cell, cidx) => (
                                <td key={cidx} className="p-3 text-slate-600 font-medium">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }
              // Render affiliate links with custom premium CTA cards
              if (paragraph.includes('Vyapar Affiliate Link')) {
                const getVyaparLink = (link: string) => {
                  const defaultLink = 'https://www.vyaparapp.in/?referrer_code=6VDQKQM';
                  if (!link || link.trim() === '') return defaultLink;
                  if (link.includes('vyaparapp.in') && !link.includes('referrer_code')) {
                    const separator = link.includes('?') ? '&' : '?';
                    return `${link}${separator}referrer_code=6VDQKQM`;
                  }
                  return link;
                };
                const finalVyaparLink = getVyaparLink(settings.vyaparLink);
                return (
                  <div key={idx} className="my-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Get Started with Vyapar App</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Simple, offline billing & stock tracking tailored for Indian retail shops.</p>
                    </div>
                    <a
                      href={finalVyaparLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      <span>Try Vyapar for Free Today</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                );
              }

              if (paragraph.includes('Zoho Affiliate Link')) {
                const finalLink = settings.zohoLink || 'https://go.zoho.com/J82J';
                return (
                  <div key={idx} className="my-6 border border-blue-200 rounded-2xl bg-gradient-to-br from-blue-50/50 to-indigo-50/30 overflow-hidden shadow-xs">
                    <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-blue-100">
                      <div className="text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <h4 className="font-display font-bold text-slate-900 text-sm">Automate with Zoho Books</h4>
                          <span className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">EXCLUSIVE DEAL</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Automated accounting, recurring invoices, and 40+ Zoho app integrations.</p>
                      </div>
                      <a
                        href={finalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
                      >
                        <span>Claim Your $100 Zoho Credit</span>
                        <ChevronRight size={14} />
                      </a>
                    </div>
                    <div className="bg-emerald-50/40 px-5 py-3 text-left">
                      <p className="text-slate-800 text-[11px] font-semibold flex items-center gap-1">
                        <span className="text-emerald-600 text-sm">🎁</span> Exclusive Offer: Get $100 in Wallet Credits when you sign up using our partner link!
                      </p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                        <span>• Valid for 60 days from registration</span>
                        <span>• Strictly for new customers</span>
                        <span>• Partner program exclusive benefit</span>
                      </div>
                    </div>
                  </div>
                );
              }

              if (paragraph.includes('Giddh Unique Sign-Up Link') || paragraph.includes('Giddh Affiliate Link')) {
                const getGiddhLink = (link: string) => {
                  const defaultLink = 'https://giddh.com?ref=kpe65SV';
                  if (!link || link.trim() === '') return defaultLink;
                  if (link.includes('giddh.com') && !link.includes('ref=')) {
                    const separator = link.includes('?') ? '&' : '?';
                    return `${link}${separator}ref=kpe65SV`;
                  }
                  return link;
                };
                const finalGiddhLink = getGiddhLink(settings.giddhLink);
                return (
                  <div key={idx} className="my-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Explore Giddh Analytical Ledger</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Real-time analytical insights, multi-branch reports, and developer-first REST APIs.</p>
                    </div>
                    <a
                      href={finalGiddhLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      <span>Explore Giddh for Startups</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                );
              }

              // Standard paragraph
              return (
                <p key={idx} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Back reference */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => setSelectedPostId(null)}
              className="text-indigo-600 hover:text-indigo-700 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <ArrowLeft size={14} /> Back to Directory
            </button>
            <span className="text-[10px] text-slate-400 font-mono">
              Published under Official GST Tax Hub Compliance Guidelines
            </span>
          </div>
        </article>

        {/* Post-reading Weekly newsletter hook */}
        <div className="mt-8 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl" />
          <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded uppercase">
            Stay Compliant
          </span>
          <h3 className="font-display font-bold text-lg sm:text-xl mt-3 text-white">
            Receive the Next Weekly Comparison Guide
          </h3>
          <p className="text-slate-400 text-xs mt-1.5 max-w-lg mx-auto">
            Get instant breakdowns of new GST notifications, software feature updates, and digital compliance hacks sent straight to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 mt-6 max-w-md mx-auto">
            <input
              id="blog-newsletter-email-input"
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your professional email"
              aria-label="Professional Email for weekly comparative newsletter"
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow active:scale-95 shrink-0"
            >
              {subscribed ? <CheckCircle size={14} className="text-emerald-400" /> : <Send size={14} />}
              <span>{subscribed ? 'Subscribed!' : 'Join Free'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Blog Directory view
  return (
    <div className="space-y-8 font-sans">
      
      {/* Blog Hub Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 font-display text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          <BookOpen size={12} className="text-indigo-600" />
          WEEKLY GST COMPLIANCE & BUSINESS DICTIONARY
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-none sm:leading-tight">
          Smarter Accounting Insights
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
          Deep-dive comparative reviews of India's leading GST utilities like Zoho, Vyapar, and Giddh. Master local tax guidelines, e-way bills, and return filing schedules.
        </p>
      </div>

      {/* Filter and Search Bar controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            id="blog-search-query-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reviews, comparisons, or GST guides..."
            aria-label="Search reviews, comparisons, or GST guides"
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 scrollbar-thin overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] text-slate-400 font-semibold mr-1 flex items-center gap-1 uppercase">
            <Filter size={12} /> Filter:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <motion.article
              key={post.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedPostId(post.slug || post.id)}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="p-5">
                {/* Header info */}
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-600 uppercase mb-3">
                  <span className="bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100/30">
                    {post.category}
                  </span>
                  <span className="text-slate-400 flex items-center gap-0.5 font-medium">
                    <Clock size={10} /> {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-500 text-xs line-clamp-3 leading-relaxed mb-4">
                  {post.excerpt}
                </p>
              </div>

              {/* Footer info card */}
              <div className="border-t border-slate-100 bg-slate-50/50 p-4 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold flex items-center gap-1">
                  <User size={12} className="text-slate-400" /> {post.author}
                </span>
                <span className="text-indigo-600 font-bold inline-flex items-center gap-0.5 hover:underline">
                  Read Guide <ChevronRight size={12} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 text-slate-400 text-center py-16 rounded-3xl max-w-md mx-auto">
          <BookOpen className="mx-auto text-slate-300 mb-2" size={32} />
          <h4 className="font-display font-semibold text-slate-800 text-sm">No matching guides found</h4>
          <p className="text-xs mt-1 text-slate-500">Try checking a different category or simplifying your search terms.</p>
        </div>
      )}

      {/* Dynamic Software Troubleshooting & Problem Solver */}
      <div id="troubleshooting-guide" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 font-display text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2.5">
            <Wrench size={12} className="text-indigo-600" />
            Software Problem Solver
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Common Software Glitches & Step-by-Step Fixes
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
            Struggling with a configuration error or syncing issue? Select a software provider below to find step-by-step, vetted solutions for Zoho Books, Vyapar, and Giddh.
          </p>
        </div>

        {/* Software Selector Tabs */}
        <div className="flex border-b border-slate-100 pb-px gap-2 overflow-x-auto scrollbar-none">
          {(['zoho', 'vyapar', 'giddh'] as const).map((soft) => (
            <button
              key={soft}
              onClick={() => {
                setTroubleSoftware(soft);
                setExpandedTroubleId(null);
              }}
              className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all capitalize whitespace-nowrap ${
                troubleSoftware === soft
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-900'
              }`}
            >
              {soft === 'zoho' ? 'Zoho Books' : soft === 'giddh' ? 'Giddh Accounting' : 'Vyapar Billing'}
            </button>
          ))}
        </div>

        {/* Problems List Accordion */}
        <div className="space-y-4">
          {TROUBLESHOOTING_DATA[troubleSoftware].map((prob) => {
            const isExpanded = expandedTroubleId === prob.id;
            return (
              <div 
                key={prob.id} 
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isExpanded ? 'border-indigo-200 bg-slate-50/40' : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                {/* Header / Click Trigger */}
                <button
                  onClick={() => setExpandedTroubleId(isExpanded ? null : prob.id)}
                  className="w-full text-left p-4 sm:p-5 flex justify-between items-start gap-4 focus:outline-none cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {troubleSoftware === 'zoho' ? 'Zoho' : troubleSoftware === 'giddh' ? 'Giddh' : 'Vyapar'} Issue
                    </span>
                    <h4 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {prob.title}
                    </h4>
                  </div>
                  <span className="mt-1 bg-slate-50 hover:bg-slate-100 p-1 rounded-lg border border-slate-100 text-slate-500 shrink-0">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>

                {/* Animated Body content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100/80 space-y-4 text-xs sm:text-sm">
                    {/* Problem Description */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">What you are seeing:</span>
                        <p className="text-slate-600 font-medium leading-relaxed">{prob.issue}</p>
                      </div>
                      <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                        <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <AlertCircle size={10} /> Root Cause:
                        </span>
                        <p className="text-slate-600 font-medium leading-relaxed">{prob.rootCause}</p>
                      </div>
                    </div>

                    {/* Step-by-Step Solution */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">Step-by-Step Resolution:</span>
                      <ol className="space-y-2.5">
                        {prob.steps.map((step, idx) => (
                          <li key={idx} className="flex gap-3 items-start">
                            <span className="w-5 h-5 bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-slate-700 leading-relaxed font-medium">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Featured Zoho, Vyapar, and Giddh Quick-Monetization Showcase */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded">
            PARTNER COMPLIANCE DEALS
          </span>
          <h3 className="font-display font-bold text-lg text-white">Need professional billing tools?</h3>
          <p className="text-xs text-slate-300 max-w-lg leading-relaxed">
            We partner directly with leading Indian providers like Zoho Books, Vyapar, and Giddh to offer discount codes and exclusive onboarding guidance.
          </p>
        </div>
        <button
          onClick={(e) => {
            if (onNavigateToCalculator) {
              e.preventDefault();
              onNavigateToCalculator();
            }
          }}
          className="bg-white hover:bg-slate-100 text-indigo-950 font-semibold px-4.5 py-2 rounded-xl text-xs flex items-center gap-1 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <span>Compare Partner Perks</span>
          <ChevronRight size={14} />
        </button>
      </div>

    </div>
  );
}
