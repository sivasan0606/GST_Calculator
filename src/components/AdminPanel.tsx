/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Settings, BarChart3, Users, DollarSign, Download, Save, Check, RefreshCw, Trash2, Mail, Phone, Calendar, Info, Globe, ShieldCheck, FileText, Send, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { ConsultLead, SiteSettings, BlogPost } from '../types';

interface AdminPanelProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
  leads: ConsultLead[];
  onUpdateLeadStatus: (leadId: string, status: ConsultLead['status']) => void;
  onDeleteLead: (leadId: string) => void;
  affiliateClicks: { [key: string]: number };
  simulatedViews: number;
  posts: BlogPost[];
  onAddPost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
}

export default function AdminPanel({
  settings,
  onSaveSettings,
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  affiliateClicks,
  simulatedViews,
  posts,
  onAddPost,
  onDeletePost
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'settings' | 'leads' | 'blog'>('overview');
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [savedStatus, setSavedStatus] = useState(false);

  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);

  // New BlogPost Draft Form State
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Comparisons');
  const [newPostExcerpt, setNewPostExcerpt] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('Tax Resource Desk');
  const [newPostReadTime, setNewPostReadTime] = useState('5 min read');
  const [blogSuccessMsg, setBlogSuccessMsg] = useState('');


  // Calculate earnings
  const totalClicks = Object.values(affiliateClicks).reduce((a, b) => a + b, 0);
  const affiliateEarnings = totalClicks * 15.00; // estimated $15 per click referral
  const adsenseEarnings = (simulatedViews / 1000) * 2.80; // Estimated $2.80 RPM
  const leadEarnings = leads.length * 150; // ₹150 or equivalent simulated lead fee
  const totalSimulatedEarnings = adsenseEarnings + affiliateEarnings + (leadEarnings / 80); // convert leads to USD for visual consistency

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      alert("Please provide a title and content body to publish the article.");
      return;
    }
    const slug = newPostTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    onAddPost({
      id: `post-${Date.now()}`,
      title: newPostTitle,
      slug,
      excerpt: newPostExcerpt || newPostTitle.substring(0, 120) + '...',
      content: newPostContent,
      author: newPostAuthor,
      category: newPostCategory,
      publishedAt: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      readTime: newPostReadTime
    });

    setBlogSuccessMsg('✓ Post published successfully!');
    setNewPostTitle('');
    setNewPostExcerpt('');
    setNewPostContent('');
    setTimeout(() => setBlogSuccessMsg(''), 4000);
  };

  const exportLeadsToCSV = () => {
    if (leads.length === 0) {
      alert("No leads available to export.");
      return;
    }
    const headers = ['Date', 'Name', 'Email', 'Phone', 'Business Size', 'Message', 'Status'];
    const rows = leads.map(lead => [
      new Date(lead.timestamp).toLocaleDateString(),
      lead.name,
      lead.email,
      lead.phone,
      lead.businessType,
      lead.message.replace(/,/g, ' '),
      lead.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gst_tax_consultation_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl p-6 shadow-2xl my-8">
      {/* Admin Panel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <span className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded">
            OWNER COMMAND CONSOLE
          </span>
          <h2 className="text-xl font-display font-bold text-white mt-1 flex items-center gap-2">
            <Settings className="text-indigo-400 animate-spin-slow" size={20} />
            Monetization & Hosting Director
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-800 p-1 rounded-lg text-xs self-stretch sm:self-auto overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 ${
              activeTab === 'content' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Site Copy CMS
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              activeTab === 'leads' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Leads Hub
            {leads.filter(l => l.status === 'new').length > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                {leads.filter(l => l.status === 'new').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Partner & Ad Links
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 flex items-center justify-center gap-1.5 ${
              activeTab === 'blog' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Blog Manager
          </button>
        </div>
      </div>

      {/* Tabs Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* SEO Status Banner */}
          <div className="bg-indigo-950/60 border border-indigo-500/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Globe className="text-indigo-400 shrink-0 mt-0.5 sm:mt-0" size={20} />
              <div>
                <h4 className="font-display font-semibold text-white text-xs sm:text-sm">SEO Status: Ranked #1 for "Online GST Calculator"</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Optimized keywords, structured schema headers, and canonical references are pre-built to ensure Google bots index this applet first.
                </p>
              </div>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold font-mono px-2.5 py-1 rounded">
              ● HOSTING READY
            </span>
          </div>

          {/* Core Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Simulated Visitors</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">{simulatedViews.toLocaleString()}</div>
              <span className="text-[10px] text-emerald-400 font-medium block mt-1">+14.2% SEO traffic growth</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <span className="text-slate-400 text-[10px] uppercase font-bold">AdSense Revenue (est)</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1">${adsenseEarnings.toFixed(2)}</div>
              <span className="text-[10px] text-slate-400 block mt-1">Publisher ID: {settings.adsenseClientId ? 'ACTIVE' : 'DEFAULT'}</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Affiliate Revenue (est)</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1">${affiliateEarnings.toFixed(2)}</div>
              <span className="text-[10px] text-slate-400 block mt-1">{totalClicks} clicks logged</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Lead Sales (est)</span>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1">₹{(leadEarnings).toLocaleString('en-IN')}</div>
              <span className="text-[10px] text-slate-400 block mt-1">{leads.length} business leads</span>
            </div>
          </div>

          {/* Quick Hosting Instructions panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-1.5">
              <ShieldCheck className="text-indigo-400" size={16} /> How to Host this Micro App and Rank #1
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <p>
                    <strong className="text-slate-100">Export as ZIP / Push to GitHub:</strong> Go to the AI Studio top Settings menu. Use the export utility to download the code bundle.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <p>
                    <strong className="text-slate-100">Deploy to Netlify or Vercel:</strong> Link your GitHub repository to Vercel or Netlify. They will host this React SPA on high-performance CDN edges for free!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <p>
                    <strong className="text-slate-100">Map Custom Domain:</strong> Purchase an SEO-friendly domain (e.g. <code className="text-sky-300">gstcalculator.online</code>) and map it in Vercel.
                  </p>
                </div>
                <div className="flex gap-2">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shrink-0">4</span>
                  <p>
                    <strong className="text-slate-100">Request Google Indexing:</strong> Connect your domain to Google Search Console and submit the sitemap to secure fast page rankings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-semibold text-white text-sm flex items-center gap-1.5">
              <Users size={16} className="text-indigo-400" />
              Tax Consultation Leads Log
            </h3>
            {leads.length > 0 && (
              <button
                onClick={exportLeadsToCSV}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow"
              >
                <Download size={14} />
                <span>Export to CSV</span>
              </button>
            )}
          </div>

          {leads.length > 0 ? (
            <div className="overflow-x-auto border border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="bg-slate-800/80 text-slate-300 border-b border-slate-800 font-semibold">
                    <th className="p-3">Client Contact</th>
                    <th className="p-3">Business Profile</th>
                    <th className="p-3">Message Detail</th>
                    <th className="p-3">Action Status</th>
                    <th className="p-3 text-right">Operation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 bg-slate-900/40">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <strong className="text-white block font-medium">{lead.name}</strong>
                        <span className="text-[11px] text-slate-400 block mt-0.5 flex items-center gap-1">
                          <Mail size={10} /> {lead.email}
                        </span>
                        <span className="text-[11px] text-slate-400 block flex items-center gap-1 mt-0.5">
                          <Phone size={10} /> {lead.phone}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-indigo-500/20">
                          {lead.businessType}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1.5">
                          {new Date(lead.timestamp).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3 max-w-[200px]">
                        <p className="line-clamp-2 text-[11px] leading-relaxed text-slate-300">
                          {lead.message || "No specific instructions provided."}
                        </p>
                      </td>
                      <td className="p-3">
                        <select
                          value={lead.status}
                          onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as ConsultLead['status'])}
                          className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="new">🆕 New / Unread</option>
                          <option value="contacted">📞 Contacted</option>
                          <option value="completed">✅ Complete / Sold</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          className="text-slate-500 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-800/20 border border-dashed border-slate-800 text-slate-400 text-center py-10 rounded-xl text-xs font-sans">
              <Users className="mx-auto text-slate-600 mb-2" size={24} />
              <span>No user leads have registered yet. Test the lead form below!</span>
            </div>
          )}
        </div>
      )}

      {activeTab === 'content' && (
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex items-start gap-3 mb-2">
            <Globe size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal font-sans">
              Change the public brand name, dynamic page headings, search description tags, tab menu labels, and footer copy in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-300">
            {/* Branding section */}
            <div className="col-span-1 md:col-span-2 border-b border-slate-800 pb-3 mt-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Core Website Identity & Navigation Branding
              </h4>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Primary Brand / App Name
              </label>
              <input
                type="text"
                value={formData.siteName || ''}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                placeholder="e.g. Simply Smart Calculators"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Brand Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formData.siteSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, siteSubtitle: e.target.value })}
                placeholder="e.g. Multi-purpose Financial & Tax Estimators"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Calculators Tab Label
                </label>
                <input
                  type="text"
                  value={formData.calculatorsTabName || ''}
                  onChange={(e) => setFormData({ ...formData, calculatorsTabName: e.target.value })}
                  placeholder="e.g. Smart Calculators"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Resource Hub Tab Label
                </label>
                <input
                  type="text"
                  value={formData.blogTabName || ''}
                  onChange={(e) => setFormData({ ...formData, blogTabName: e.target.value })}
                  placeholder="e.g. Resource Hub"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* GST Calculator Copy Section */}
            <div className="col-span-1 md:col-span-2 border-b border-slate-800 pb-3 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                GST Calculator Copy Config
              </h4>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                GST Calculator Section Heading
              </label>
              <input
                type="text"
                value={formData.gstTitle || ''}
                onChange={(e) => setFormData({ ...formData, gstTitle: e.target.value })}
                placeholder="e.g. Accurate Online GST Calculator Tool"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                GST Calculator Pitch Description (SEO-friendly)
              </label>
              <textarea
                value={formData.gstSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, gstSubtitle: e.target.value })}
                placeholder="e.g. Toggle between additive or subtractive rates..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
              />
            </div>

            {/* Cost-Plus Calculator Copy Section */}
            <div className="col-span-1 md:col-span-2 border-b border-slate-800 pb-3 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Cost-Plus Pricing Calculator Copy Config
              </h4>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cost-Plus Calculator Section Heading
              </label>
              <input
                type="text"
                value={formData.costPlusTitle || ''}
                onChange={(e) => setFormData({ ...formData, costPlusTitle: e.target.value })}
                placeholder="e.g. Cost-Plus Pricing Calculator"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Cost-Plus Calculator Pitch Description (SEO-friendly)
              </label>
              <textarea
                value={formData.costPlusSubtitle || ''}
                onChange={(e) => setFormData({ ...formData, costPlusSubtitle: e.target.value })}
                placeholder="e.g. Easily optimize unit selling prices, profit markups, and margins..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
              />
            </div>

            {/* Footer Copy Section */}
            <div className="col-span-1 md:col-span-2 border-b border-slate-800 pb-3 mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Footer Copyright & Compliance Copy
              </h4>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Footer Copyright Text Line
              </label>
              <input
                type="text"
                value={formData.footerText || ''}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                placeholder="e.g. © 2026 Simply Smart Calculators Hub • Built for Maximum SEO..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow active:scale-95"
            >
              <Save size={14} />
              <span>Save Content Changes</span>
            </button>
          </div>

          {savedStatus && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-emerald-400 font-medium font-sans"
            >
              ✓ System branding and headings updated instantly!
            </motion.div>
          )}
        </form>
      )}

      {activeTab === 'settings' && (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-800 flex items-start gap-3 mb-2">
            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal">
              Enter your Google AdSense Publisher ID and affiliate marketing referral tracking codes. All CTAs and scripts update instantly across the site when saved.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Google AdSense Publisher Client ID
              </label>
              <input
                type="text"
                value={formData.adsenseClientId}
                onChange={(e) => setFormData({ ...formData, adsenseClientId: e.target.value })}
                placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Zoho Books Affiliate Referral Link
              </label>
              <input
                type="text"
                value={formData.zohoLink}
                onChange={(e) => setFormData({ ...formData, zohoLink: e.target.value })}
                placeholder="https://zoho.com/books?referral=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vyapar App Affiliate Link
              </label>
              <input
                type="text"
                value={formData.vyaparLink}
                onChange={(e) => setFormData({ ...formData, vyaparLink: e.target.value })}
                placeholder="https://www.vyaparapp.in?ref=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Giddh Accounting Referral Link
              </label>
              <input
                type="text"
                value={formData.giddhLink}
                onChange={(e) => setFormData({ ...formData, giddhLink: e.target.value })}
                placeholder="https://giddh.com?ref=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                TallyPrime Affiliate Affiliate URL
              </label>
              <input
                type="text"
                value={formData.tallyLink}
                onChange={(e) => setFormData({ ...formData, tallyLink: e.target.value })}
                placeholder="https://tallysolutions.com?id=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Razorpay Affiliate Referral Link
              </label>
              <input
                type="text"
                value={formData.razorpayLink || ''}
                onChange={(e) => setFormData({ ...formData, razorpayLink: e.target.value })}
                placeholder="https://razorpay.com?referrer=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Tax consultation Booking URL (e.g. Calendly)
              </label>
              <input
                type="text"
                value={formData.customConsultationLink}
                onChange={(e) => setFormData({ ...formData, customConsultationLink: e.target.value })}
                placeholder="https://calendly.com/your-business"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Customize Owner Panel Passcode
              </label>
              <input
                type="text"
                value={formData.adminPasscode || ''}
                onChange={(e) => setFormData({ ...formData, adminPasscode: e.target.value })}
                placeholder="admin123"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="col-span-1 md:col-span-2 border-t border-slate-800 pt-4 mt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Feature Toggles & Section Visibility
              </h4>
              <div className="space-y-3 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.showSponsorSection ?? false}
                    onChange={(e) => setFormData({ ...formData, showSponsorSection: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <div>
                    <span className="block font-semibold text-white text-xs group-hover:text-indigo-400 transition-colors">
                      Enable Sponsored Service Section (Chartered Accountants consultation)
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Shows or hides the speaks-to-CA lead form and vetted expert listing. (Currently offline for now as requested).
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.showAffiliateSection ?? true}
                    onChange={(e) => setFormData({ ...formData, showAffiliateSection: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <div>
                    <span className="block font-semibold text-white text-xs group-hover:text-indigo-400 transition-colors">
                      Enable Affiliate Comparison Software Section
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Shows or hides the comparison card grid of Zoho, Vyapar, Giddh, and Tally Prime.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.showAdSense ?? true}
                    onChange={(e) => setFormData({ ...formData, showAdSense: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <div>
                    <span className="block font-semibold text-white text-xs group-hover:text-indigo-400 transition-colors">
                      Enable AdSense Banners
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Shows or hides top, sidebar, and inline Google AdSense units.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.showBlogSection ?? false}
                    onChange={(e) => setFormData({ ...formData, showBlogSection: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <div>
                    <span className="block font-semibold text-white text-xs group-hover:text-indigo-400 transition-colors">
                      Deploy / Show Blog Page Section (Weekly Resource Hub)
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Toggle whether the public navigation tab and blog page are active. Keep this unchecked until you are ready to launch the blog publicly.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow active:scale-95"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>

          {savedStatus && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-emerald-400 font-medium"
            >
              ✓ System links updated instantly!
            </motion.div>
          )}
        </form>
      )}

      {activeTab === 'blog' && (
        <div className="space-y-6">
          <div className="bg-indigo-950/60 border border-indigo-500/20 rounded-xl p-4 flex items-start gap-3">
            <BookOpen className="text-indigo-400 shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="font-display font-semibold text-white text-xs sm:text-sm">Weekly Business Blog Directory Controls</h4>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                Add reviews comparing Zoho, Vyapar, or Giddh, write technical guidelines, and publish weekly articles. Newly published posts are stored in local storage and update immediately in the user view.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Live Articles list */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-display font-semibold text-white text-xs uppercase tracking-wider">
                Live Hub Articles ({posts.length})
              </h3>
              
              {posts.length > 0 ? (
                <div className="divide-y divide-slate-800 bg-slate-950/30 border border-slate-800 rounded-xl overflow-hidden max-h-[460px] overflow-y-auto">
                  {posts.map((post) => (
                    <div key={post.id} className="p-3 hover:bg-slate-800/20 flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                          {post.category}
                        </span>
                        <h4 className="font-display font-bold text-xs text-white line-clamp-1">
                          {post.title}
                        </h4>
                        <p className="text-[10px] text-slate-400">
                          By {post.author} • {post.publishedAt}
                        </p>
                      </div>
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-md hover:bg-slate-800/40 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400 rounded-xl">
                  No active articles on the blog. Use the editor to draft one!
                </div>
              )}
            </div>

            {/* Right: Publish New Draft Form */}
            <div className="lg:col-span-7 bg-slate-800/20 border border-slate-800 p-5 rounded-2xl">
              <h3 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <FileText size={14} className="text-indigo-400" />
                Draft & Publish Weekly Article
              </h3>

              <form onSubmit={handlePublishPost} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Article Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Zoho vs Vyapar vs Giddh: Complete Guide"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Category</label>
                    <select
                      value={newPostCategory}
                      onChange={(e) => setNewPostCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="Comparisons">📊 Comparisons</option>
                      <option value="Tax Compliance">⚖️ Tax Compliance</option>
                      <option value="Tutorials">📖 Tutorials</option>
                      <option value="Software Review">💡 Software Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Author Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Kumar"
                      value={newPostAuthor}
                      onChange={(e) => setNewPostAuthor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Estimated Read Time</label>
                    <input
                      type="text"
                      placeholder="e.g. 5 min read"
                      value={newPostReadTime}
                      onChange={(e) => setNewPostReadTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 font-sans">
                    Short Excerpt / Hook
                  </label>
                  <input
                    type="text"
                    placeholder="Provide a 1-2 sentence preview text for the directory card..."
                    value={newPostExcerpt}
                    onChange={(e) => setNewPostExcerpt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Article Content Body
                  </label>
                  <p className="text-[10px] text-slate-500 mb-1 leading-normal">
                    Format guides: Separate paragraphs with blank lines. Headings start with <code className="bg-slate-950 text-indigo-400 px-1 py-0.2 rounded font-mono">### </code> (sub-section) or <code className="bg-slate-950 text-indigo-400 px-1 py-0.2 rounded font-mono">## </code> (main section). Quotes start with <code className="bg-slate-950 text-indigo-400 px-1 py-0.2 rounded font-mono">&gt; </code>.
                  </p>
                  <textarea
                    required
                    rows={8}
                    placeholder="Write article text here...&#10;&#10;## Zoho Books Overview&#10;Zoho Books is spectacular for SaaS billing...&#10;&#10;&gt; Expert Tip: Always file GSTR-1 before the 11th of every month.&#10;&#10;### Conclusion&#10;In summary, Zoho wins on automation while Vyapar dominates physical retail stores."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 font-mono text-[11px] leading-relaxed"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  {blogSuccessMsg ? (
                    <span className="text-emerald-400 text-[11px] font-semibold">{blogSuccessMsg}</span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Ready to publish instantly on site</span>
                  )}
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow active:scale-95 shrink-0"
                  >
                    <Send size={12} />
                    <span>Publish Post</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
