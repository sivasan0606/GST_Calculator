/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, User, Clock, ArrowLeft, ChevronRight, BookOpen, Star, Sparkles, Filter, CheckCircle, Mail, Send, Share2 } from 'lucide-react';
import { BlogPost, SiteSettings } from '../types';

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
              {activePost.author.charAt(3) || 'CA'}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{activePost.author}</p>
              <p className="text-[10px] text-slate-400">Certified GST Advisory Specialist</p>
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
                return (
                  <div key={idx} className="my-6 p-5 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Get Started with Vyapar App</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Simple, offline billing & stock tracking tailored for Indian retail shops.</p>
                    </div>
                    <a
                      href={settings.vyaparLink || '#'}
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
                return (
                  <div key={idx} className="my-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Automate with Zoho Books</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Automated accounting, recurring invoices, and 40+ Zoho app integrations.</p>
                    </div>
                    <a
                      href={settings.zohoLink || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap"
                    >
                      <span>Start Your Free Trial of Zoho Books</span>
                      <ChevronRight size={14} />
                    </a>
                  </div>
                );
              }

              if (paragraph.includes('Giddh Unique Sign-Up Link') || paragraph.includes('Giddh Affiliate Link')) {
                return (
                  <div key={idx} className="my-6 p-5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <h4 className="font-display font-bold text-slate-900 text-sm">Explore Giddh Analytical Ledger</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">Real-time analytical insights, multi-branch reports, and developer-first REST APIs.</p>
                    </div>
                    <a
                      href={settings.giddhLink || '#'}
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
