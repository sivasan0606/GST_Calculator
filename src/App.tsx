/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Settings, ShieldCheck, Star, Sparkles, DollarSign, ExternalLink, RefreshCw, Layers, CheckCircle2, Lock, Unlock, ShieldAlert, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import GstCalculator from './components/GstCalculator';
import AdSenseUnit from './components/AdSenseUnit';
import AffiliateSection from './components/AffiliateSection';
import ConsultationSection from './components/ConsultationSection';
import SnoopingSEO from './components/SnoopingSEO';
import AdminPanel from './components/AdminPanel';
import LegalModal from './components/LegalModal';
import BlogPage from './components/BlogPage';

// Types
import { GSTCalculation, ConsultLead, SiteSettings, BlogPost } from './types';

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Vyapar vs. Zoho Books: Which is Better for Indian Freelancers and SMBs?',
    slug: 'vyapar-vs-zoho-books',
    excerpt: 'If you are a freelancer or a small business owner in India, you already know that managing invoices, tracking expenses, and staying GST-compliant can easily consume your entire weekend. We compare features, pricing, and usability.',
    content: `If you are a freelancer or a small business owner in India, you already know that managing invoices, tracking expenses, and staying GST-compliant can easily consume your entire weekend.

Choosing the right accounting software is the fastest way to automate these headaches. Right now, two of the most popular solutions on the market are Vyapar and Zoho Books. But which one actually fits your specific business model?

In this breakdown, we compare their features, pricing, and usability to help you decide which tool deserves a spot in your tech stack.

📊 Quick Comparison Breakdown

| Feature | Vyapar | Zoho Books |
| --- | --- | --- |
| **Best For** | Retailers, Distributors, Local Shops | Freelancers, Service Agencies, Startups |
| **Offline Mode** | Yes (Works completely offline) | No (Cloud-based only) |
| **Mobile App** | Excellent (Android/iOS) | Excellent (Android/iOS) |
| **GST Billing** | Very Simple | Comprehensive & Automated |
| **Ecosystem** | Standalone tool | Integrates with 40+ Zoho Apps |
| **Learning Curve** | Extremely Low | Moderate |

## 1. Vyapar: The Best for Local SMBs and Inventory Management
Vyapar is built specifically for the Indian market, and its absolute biggest advantage is simplicity. You do not need to be an accountant to use it.

Why You Should Choose Vyapar:
Works Offline: Unlike most modern SaaS tools, Vyapar has a robust desktop app that works entirely without the internet. This is a lifesaver for retail shops or businesses in areas with spotty connections.

WhatsApp Integration: You can send invoices and payment reminders to your clients directly through WhatsApp in a single click, which dramatically speeds up payment collection.

Exceptional Inventory Tracking: If you sell physical products, Vyapar tracks your stock, alerts you when inventory is low, and manages barcode scanning effortlessly.

The Verdict: If you run a local retail business, a distribution network, or deal primarily in physical goods, Vyapar is the undisputed champion of easy billing.

👉 Vyapar Affiliate Link

## 2. Zoho Books: The Best for Freelancers and Scaling Startups
Zoho Books is a globally recognized powerhouse. While Vyapar excels in local retail, Zoho Books is built for service-based businesses, digital freelancers, and startups that plan to scale.

Why You Should Choose Zoho Books:
Professional Automation: You can set up recurring invoices for retainer clients, automatically chase down unpaid bills with email reminders, and connect directly to your bank account for real-time reconciliation.

The Zoho Ecosystem: As your business grows, Zoho Books seamlessly connects with Zoho CRM, Zoho Projects, and Zoho Desk. You will never have to worry about outgrowing the software.

Advanced Tax Handling: For agencies handling complex GST filings, TDS, and international multi-currency invoicing, Zoho Books offers a much more robust, auditor-friendly dashboard.

The Verdict: If you provide digital services, work with international clients, or plan to scale a large team, Zoho Books offers the professional automation you need.

👉 Zoho Affiliate Link

## 3. Bonus Alternative: Giddh
If you are a modern startup looking for a fresh, highly analytical approach to accounting, Giddh is a fantastic third option. It acts more like a financial dashboard than a traditional ledger, giving founders incredible real-time insights into their cash flow and runway.

👉 Giddh Affiliate Link

## Final Thoughts: Which should you pick?
The choice comes down to what you sell.

If you sell physical products and need quick, simple, offline-capable GST billing from your phone or shop counter, go with Vyapar.

If you sell services, deal with retainer contracts, and want a highly automated, cloud-based system that can scale into a massive enterprise, go with Zoho Books.`,
    author: 'CA Aarav Mehta',
    category: 'Comparisons',
    publishedAt: 'Jul 14, 2026',
    readTime: '6 min read'
  },
  {
    id: 'post-2',
    title: 'Understanding SGST, CGST, & IGST: Place of Supply Decision Matrix',
    slug: 'understanding-sgst-cgst-igst',
    excerpt: 'Selecting the wrong tax head can trigger auditing flags, delay Input Tax Credit (ITC) claims, and result in correction fees. Learn the place of supply rules and common pitfalls with our decision matrix.',
    content: `If you are running a business or freelancing in India, one of the quickest ways to attract a GST audit or delay your Input Tax Credit (ITC) is selecting the wrong tax head. Choosing CGST + SGST instead of IGST (or vice-versa) is an incredibly common mistake, but it can be easily avoided.

The entire GST structure is based on consumption. Tax revenue belongs to the state where the goods or services are actually consumed. Selecting the right tax head comes down to one core concept: **Place of Supply (POS)**.

In this guide, we break down SGST, CGST, and IGST with a clear decision matrix and show you how to automate your invoice tax splits.

📊 Quick Tax Head Decision Matrix
| Tax Head | Full Name | Transaction Type | Split Ratio | Beneficiary |
| --- | --- | --- | --- | --- |
| **CGST** | Central Goods & Services Tax | Intra-State (Same State) | 50% | Central Government |
| **SGST** | State Goods & Services Tax | Intra-State (Same State) | 50% | State Government |
| **IGST** | Integrated Goods & Services Tax | Inter-State (Different States) | 100% | Central & Destination State |

## 1. Intra-State Transactions (Same State Sales)
If the **Location of the Supplier** (your registered business state) and the **Place of Supply (POS)** (the state where the client receives the goods/services) are in the *same state*, it is an intra-state transaction.

Why You Must Apply CGST & SGST:
- **Perfect 50/50 Split**: On an 18% tax slab, 9% is calculated as CGST and 9% is calculated as SGST.
- **Local Collections**: The CGST portion goes to the Central Government, and the SGST portion goes directly to your home State Government.

👉 Vyapar Affiliate Link

## 2. Inter-State Transactions (Out-of-State Sales)
If your business is registered in Karnataka, but you sell services or ship physical products to a buyer in Maharashtra, this is an inter-state transaction.

Why You Must Apply IGST:
- **No Split on Invoice**: You apply the entire 18% tax under a single head called IGST.
- **Destination Principle**: The central government receives the tax and distributes the state share to the consuming state.
- **Exporting Services**: Sales to clients outside India are technically inter-state, but can be filed at 0% tax if you have a Letter of Undertaking (LUT).

👉 Zoho Affiliate Link

## 3. How to Automate Your Place of Supply Math
Manually calculating tax heads for hundreds of invoices across different states is a recipe for disaster. Using modern billing tools solves this instantly.

How Software Prevents Audit Flags:
- **Automatic POS Detection**: Just select your customer's state, and the system automatically decides whether to split CGST/SGST or apply IGST.
- **Unified Ledger Sync**: Your tax filings are generated automatically, keeping your GSTR-1 and GSTR-3B matching your accounting records perfectly.

👉 Giddh Affiliate Link

## Final Thoughts: Getting it right the first time
If you accidentally charge CGST + SGST on an interstate deal, you cannot simply adjust the entry. You must pay the correct IGST first and then file a refund claim for the wrongly paid local tax. Save yourself the stress by automating your business ledger today!`,
    author: 'CA Shreya Rao',
    category: 'Tax Compliance',
    publishedAt: 'Jul 07, 2026',
    readTime: '4 min read'
  },
  {
    id: 'post-3',
    title: 'GST Invoice Rules 2026: Mandatory Formatting for Small Businesses',
    slug: 'gst-invoice-rules-2026',
    excerpt: 'Failing to include required formatting elements like HSN codes, consecutive sequence serial numbers, and correct GSTIN tags on your sales bills can invalidate your customers’ Input Tax Credit.',
    content: `Invoicing is not just a receipt; it is a legally binding tax document under Indian Law. A non-compliant tax invoice can cause your clients to lose their Input Tax Credit (ITC), result in interest penalties during GST audits, and slow down your payment cycles.

As a freelancer or SMB in India, keeping up with the latest invoice regulations can be overwhelming. Knowing what is mandatory on B2B versus B2C bills is crucial.

In this guide, we break down the mandatory formatting guidelines for GST invoices and how to ensure your business remains 100% audit-proof.

📊 GST Invoice Compliance Checklist
| Mandatory Field | For B2B Transactions | For B2C Transactions |
| --- | --- | --- |
| **Supplier GSTIN & Name** | Mandatory (Your details) | Mandatory (Your details) |
| **Recipient GSTIN & Name** | Mandatory (Buyer's details) | Not Required (State name if > ₹50k) |
| **Invoice Date & Number** | Consecutive series, consecutive dates | Consecutive series, consecutive dates |
| **HSN / SAC Code** | 4-6 digits (Based on turnover) | Optional (Required for B2C if > ₹5Cr) |
| **Place of Supply (POS)** | Mandatory | Mandatory (If invoice value is > ₹50,000) |
| **Tax Rate Split** | Explicit CGST/SGST or IGST | Explicit CGST/SGST or IGST |

## 1. Sequential Numbering and Unique Sequences
Your invoice numbers must follow a strictly consecutive sequence, containing only alphanumeric characters and approved special characters (hyphens/slashes).

Why Unique Sequences Matter:
- **No Gaps in Ledger**: Gaps in invoice sequences trigger tax evasion flags during GST audits.
- **Financial Year Separation**: You should start a fresh, clearly structured invoice prefix at the beginning of every financial year (e.g., FY26-27/001).

👉 Vyapar Affiliate Link

## 2. Capturing Correct Supplier & Recipient GSTINs
The single biggest reason B2B buyers delay payments is because they cannot see their purchase on their GSTR-2B. This happens when the supplier uploads a typo-ridden GSTIN or fails to collect it altogether.

Why accurate data is critical:
- **Real-Time Match**: Your customer cannot claim their tax refund unless your invoice details exactly match their legal entity data.
- **B2B Growth**: Service agencies and freelancers who handle client GSTINs with professional accuracy secure long-term retainer clients much faster.

👉 Zoho Affiliate Link

## 3. Mandatory HSN and SAC Code Regulations
HSN (Harmonized System of Nomenclature) for goods and SAC (Services Accounting Code) for services are required on invoices depending on your annual aggregate turnover (AATO).

Current Turnover Rules:
- **Turnover up to ₹5 Crores**: 4-digit HSN/SAC codes are mandatory for all B2B transactions.
- **Turnover above ₹5 Crores**: 6-digit HSN/SAC codes are mandatory for both B2B and B2C transactions.

👉 Giddh Affiliate Link

## Final Thoughts: Stop creating manual invoices
Drafting invoices in Word or Excel is an accident waiting to happen. Missing a single mandatory field or typing a 14-digit GSTIN instead of 15 will render your invoice invalid. Using specialized GST accounting software guarantees compliance out-of-the-box and lets you focus on growing your business.`,
    author: 'CA Rajesh Kumar',
    category: 'Tutorials',
    publishedAt: 'Jun 28, 2026',
    readTime: '5 min read'
  }
];

export default function App() {
  // Config Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('gst_site_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.adminPasscode) {
          parsed.adminPasscode = 'admin123';
        }
        if (parsed.quickbooksLink && !parsed.vyaparLink) {
          parsed.vyaparLink = parsed.quickbooksLink;
        }
        if (!parsed.vyaparLink) {
          parsed.vyaparLink = '';
        }
        if (parsed.xeroLink && !parsed.giddhLink) {
          parsed.giddhLink = parsed.xeroLink;
        }
        if (!parsed.giddhLink) {
          parsed.giddhLink = '';
        }
        if (parsed.showSponsorSection === undefined) {
          parsed.showSponsorSection = false;
        }
        if (parsed.showAffiliateSection === undefined) {
          parsed.showAffiliateSection = false;
        }
        if (parsed.showAdSense === undefined) {
          parsed.showAdSense = true;
        }
        // Force enable blog section per user request
        parsed.showBlogSection = true;
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return {
      adsenseClientId: '',
      zohoLink: '',
      vyaparLink: 'https://www.vyaparapp.in/?referrer_code=6VDQKQM',
      giddhLink: '',
      tallyLink: '',
      customConsultationLink: '',
      consultantSponsorFee: '250',
      adminPasscode: 'admin123',
      showSponsorSection: false,
      showAffiliateSection: false,
      showAdSense: true,
      showBlogSection: true
    };
  });

  // Leads State
  const [leads, setLeads] = useState<ConsultLead[]>(() => {
    const saved = localStorage.getItem('gst_consult_leads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Pre-populate with 2 realistic default leads to show off the Admin Hub features instantly
    return [
      {
        id: 'lead-1',
        name: 'Suresh Singhania',
        email: 'suresh@singhaniatex.com',
        phone: '+91 94440 23190',
        businessType: 'SME / Retailer',
        message: 'Looking for continuous quarterly GST return filing (GSTR-1 and GSTR-3B) for our textile retail shop. Currently using manual spreadsheets and want to transition to cloud software too.',
        timestamp: Date.now() - 3600000 * 24, // 1 day ago
        status: 'new'
      },
      {
        id: 'lead-2',
        name: 'Preeti Deshmukh',
        email: 'preeti@webdevlabs.io',
        phone: '+91 98200 45678',
        businessType: 'Freelancer / Contractor',
        message: 'Need help with exporting services. I work as an independent software consultant for US clients and require a Letter of Undertaking (LUT) setup to file at zero-rated GST.',
        timestamp: Date.now() - 3600000 * 5, // 5 hours ago
        status: 'contacted'
      }
    ];
  });

  // History State
  const [history, setHistory] = useState<GSTCalculation[]>(() => {
    const saved = localStorage.getItem('gst_calc_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return [];
  });

  // Click Metrics & View Simulations (For monetization visualizer)
  const [affiliateClicks, setAffiliateClicks] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem('gst_affiliate_clicks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return { zoho: 4, vyapar: 2, giddh: 1, tally: 3 };
  });

  const [simulatedViews, setSimulatedViews] = useState(() => {
    const saved = localStorage.getItem('gst_simulated_views');
    return saved ? parseInt(saved, 10) : 4850;
  });

  // Admin Console View State
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Navigation & weekly blog state
  const [currentView, setCurrentView] = useState<'calculator' | 'blog'>('calculator');
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('gst_site_blog_posts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force update any of the posts if they do not match our premium layouts
        const hasOldPost = parsed.some((p: any) => 
          (p.id === 'post-1' && !p.content.includes('👉 Vyapar Affiliate Link')) ||
          (p.id === 'post-2' && !p.content.includes('👉 Vyapar Affiliate Link')) ||
          (p.id === 'post-3' && !p.content.includes('👉 Vyapar Affiliate Link'))
        );
        if (hasOldPost) {
          localStorage.setItem('gst_site_blog_posts', JSON.stringify(DEFAULT_POSTS));
          return DEFAULT_POSTS;
        }
        return parsed;
      } catch (e) { /* ignore */ }
    }
    return DEFAULT_POSTS;
  });
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return localStorage.getItem('gst_owner_authorized') === 'true';
  });
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<boolean>(() => {
    return localStorage.getItem('gst_cookie_consent') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Hidden owner mode toggle (completely hides any reference to the panel for regular users)
  const [isOwnerModeEnabled, setIsOwnerModeEnabled] = useState<boolean>(() => {
    return localStorage.getItem('gst_owner_mode_enabled') === 'true' || localStorage.getItem('gst_owner_authorized') === 'true';
  });

  // Check URL query parameters for special activation keys
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('owner') === 'true' || params.get('admin') === 'true') {
      setIsOwnerModeEnabled(true);
      localStorage.setItem('gst_owner_mode_enabled', 'true');
      
      // Polish: automatically clean up the secret query parameter from the browser address bar
      const url = new URL(window.location.href);
      url.searchParams.delete('owner');
      url.searchParams.delete('admin');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  }, []);

  const handleOpenAdminConsole = () => {
    if (showAdmin) {
      setShowAdmin(false);
    } else {
      if (isAuthorized) {
        setShowAdmin(true);
      } else {
        setPasscodeModalOpen(true);
        setPasscodeInput('');
        setPasscodeError('');
      }
    }
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPasscode = settings.adminPasscode || 'admin123';
    if (passcodeInput === correctPasscode) {
      setIsAuthorized(true);
      localStorage.setItem('gst_owner_authorized', 'true');
      setPasscodeModalOpen(false);
      setShowAdmin(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode. Please try again.');
    }
  };

  const handleLogoutAdmin = () => {
    setIsAuthorized(false);
    setIsOwnerModeEnabled(false);
    localStorage.setItem('gst_owner_authorized', 'false');
    localStorage.removeItem('gst_owner_mode_enabled');
    setShowAdmin(false);
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('gst_site_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('gst_consult_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('gst_calc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('gst_affiliate_clicks', JSON.stringify(affiliateClicks));
  }, [affiliateClicks]);

  useEffect(() => {
    localStorage.setItem('gst_simulated_views', simulatedViews.toString());
  }, [simulatedViews]);

  useEffect(() => {
    localStorage.setItem('gst_site_blog_posts', JSON.stringify(posts));
  }, [posts]);

  const handleAddPost = (newPost: BlogPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  // Dynamically load Google AdSense script only after hydration and when allowed
  useEffect(() => {
    if (settings.showAdSense === false || showAdmin || passcodeModalOpen || legalModalOpen) {
      // If ads are disabled, in admin mode, or any modal is open, remove any existing adsbygoogle script
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (existingScript) {
        existingScript.remove();
      }
      return;
    }

    const clientId = settings.adsenseClientId || 'ca-pub-9724813909212689';
    const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
    
    // Check if the script with this client ID is already in the document
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (!existingScript) {
      // Remove any other adsbygoogle scripts with different client IDs to avoid conflicts
      const otherScripts = document.querySelectorAll('script[src*="adsbygoogle.js"]');
      otherScripts.forEach(s => s.remove());

      // Create and append the new script tag
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [settings.showAdSense, settings.adsenseClientId, showAdmin, passcodeModalOpen, legalModalOpen]);

  // Simulate passive SEO organic search views over time
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedViews(prev => {
        const increment = Math.floor(Math.random() * 3) + 1;
        return prev + increment;
      });
    }, 15000); // add views every 15s to simulate traffic
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleAddCalculation = (calc: GSTCalculation) => {
    setHistory(prev => [calc, ...prev.slice(0, 19)]); // limit logs to last 20
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleLeadSubmit = (newLeadData: Omit<ConsultLead, 'id' | 'timestamp' | 'status'>) => {
    const newLead: ConsultLead = {
      ...newLeadData,
      id: `lead-${Date.now()}`,
      timestamp: Date.now(),
      status: 'new'
    };
    setLeads(prev => [newLead, ...prev]);
  };

  const handleUpdateLeadStatus = (leadId: string, status: ConsultLead['status']) => {
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status } : lead));
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
  };

  const handleTrackAffiliateClick = (id: string, estPayout: number) => {
    setAffiliateClicks(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
    // Bump views slightly on click for engagement simulation
    setSimulatedViews(prev => prev + 1);
  };

  const handleTrackSponsorBooking = (consultantName: string, fee: number) => {
    // Increment an affiliate "booking" under tally/partner
    setAffiliateClicks(prev => ({
      ...prev,
      tally: (prev['tally'] || 0) + 1
    }));
  };

  const handleSaveSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Top Banner Leaderboard Advertisement Slot */}
      {settings.showAdSense !== false && !showAdmin && !passcodeModalOpen && !legalModalOpen && (
        <div className="w-full bg-slate-100 border-b border-slate-200 py-1 px-4 text-center">
          <div className="max-w-7xl mx-auto">
            <AdSenseUnit 
              slotId="top-leaderboard" 
              format="leaderboard" 
              adsenseClientId={settings.adsenseClientId} 
            />
          </div>
        </div>
      )}

      {/* Main Premium Navbar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-indigo-600/20">
              <Calculator size={20} />
            </div>
            <div>
              <h1 className="font-display font-bold text-slate-900 text-base sm:text-lg tracking-tight leading-none">
                GST Calculator
              </h1>
              <span className="text-[10px] text-slate-500 font-medium block mt-1 tracking-wider uppercase font-mono">
                Official Tax compliance Hub
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200/50">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>FY 2026-27 Portal Active</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Monthly Traffic:</span>
              <strong className="text-slate-800 font-semibold">{simulatedViews.toLocaleString()} searches</strong>
            </div>
          </div>

          {/* Settings Admin Toggle */}
          {isOwnerModeEnabled && (
            <div className="flex items-center gap-2">
              {isAuthorized && (
                <button
                  onClick={handleLogoutAdmin}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200/60 text-slate-500 hover:text-rose-600 transition-colors"
                  title="Log out of Admin session and hide console"
                >
                  <Lock size={12} />
                  <span className="hidden sm:inline">Lock Panel</span>
                </button>
              )}
              <button
                onClick={handleOpenAdminConsole}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold font-display transition-all ${
                  showAdmin 
                    ? 'bg-rose-500 text-white shadow-sm hover:bg-rose-600' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                <Settings size={14} className={showAdmin ? 'animate-spin' : ''} />
                <span>{showAdmin ? 'Exit Owner Console' : 'Owner Control Panel'}</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Stage */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        
        {/* Dynamic Warning/Instructions on Admin Toggle */}
        <AnimatePresence>
          {showAdmin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <AdminPanel
                settings={settings}
                onSaveSettings={handleSaveSettings}
                leads={leads}
                onUpdateLeadStatus={handleUpdateLeadStatus}
                onDeleteLead={handleDeleteLead}
                affiliateClicks={affiliateClicks}
                simulatedViews={simulatedViews}
                posts={posts}
                onAddPost={handleAddPost}
                onDeletePost={handleDeletePost}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tab Switcher */}
        {(settings.showBlogSection || isOwnerModeEnabled) && (
          <div className="flex justify-center border-b border-slate-200 mb-8 font-sans">
            <div className="flex gap-8">
              <button
                onClick={() => setCurrentView('calculator')}
                className={`pb-4 px-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentView === 'calculator'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Calculator size={16} />
                <span>GST Calculator</span>
              </button>
              <button
                onClick={() => setCurrentView('blog')}
                className={`pb-4 px-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
                  currentView === 'blog'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen size={16} />
                <span>Weekly Resource Hub</span>
                <span className="bg-indigo-100 text-indigo-700 text-[9px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                  New
                </span>
              </button>
            </div>
          </div>
        )}

        {currentView === 'calculator' ? (
          <>
            {/* SEO Intro Title Pitch */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 font-display text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <Sparkles size={12} className="text-indigo-600" />
                Instant SGST, CGST, and IGST breakdowns
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 tracking-tight leading-none sm:leading-tight">
                Accurate Online GST Calculator Tool
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                Toggle between additive or subtractive rates, select custom brackets, and generate tax-compliant invoice receipts instantly. 100% compliant with the latest government slabs.
              </p>
            </div>

            {/* GST Calculator component block */}
            <GstCalculator
              onHistoryChange={handleAddCalculation}
              savedCalculations={history}
              onClearHistory={handleClearHistory}
            />

            {/* In-Content Native Banner Ad slot */}
            {settings.showAdSense !== false && !showAdmin && !passcodeModalOpen && !legalModalOpen && (
              <AdSenseUnit 
                slotId="in-content-native" 
                format="banner" 
                adsenseClientId={settings.adsenseClientId} 
              />
            )}

            {/* Affiliate comparison section */}
            {settings.showAffiliateSection !== false && (
              <AffiliateSection
                zohoLink={settings.zohoLink}
                vyaparLink={settings.vyaparLink}
                giddhLink={settings.giddhLink}
                tallyLink={settings.tallyLink}
                onTrackClick={handleTrackAffiliateClick}
              />
            )}

            {/* Consultation list and lead capture form */}
            {settings.showSponsorSection === true && (
              <ConsultationSection
                customConsultationLink={settings.customConsultationLink}
                onLeadSubmit={handleLeadSubmit}
                onTrackBooking={handleTrackSponsorBooking}
              />
            )}

            {/* Sidebar-style Square Ad Banner in a neat grid (Placed dynamically here for monetization density) */}
            {settings.showAdSense !== false && !showAdmin && !passcodeModalOpen && !legalModalOpen && (
              <div className="max-w-2xl mx-auto">
                <AdSenseUnit 
                  slotId="sidebar-square" 
                  format="square" 
                  adsenseClientId={settings.adsenseClientId} 
                />
              </div>
            )}

            {/* Extensive SEO FAQ & Compliance Guides */}
            <SnoopingSEO />
          </>
        ) : (settings.showBlogSection || isOwnerModeEnabled) ? (
          <BlogPage posts={posts} settings={settings} />
        ) : (
          <>
            {/* Fallback to calculator if someone tries to reach blog when disabled */}
            <GstCalculator
              onHistoryChange={handleAddCalculation}
              savedCalculations={history}
              onClearHistory={handleClearHistory}
            />
            {settings.showAffiliateSection !== false && (
              <AffiliateSection
                zohoLink={settings.zohoLink}
                vyaparLink={settings.vyaparLink}
                giddhLink={settings.giddhLink}
                tallyLink={settings.tallyLink}
                onTrackClick={handleTrackAffiliateClick}
              />
            )}
            <SnoopingSEO />
          </>
        )}

      </main>

      {/* Elegant informative Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
            
            {/* Branding Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                  <Calculator size={16} />
                </div>
                <strong className="font-display font-bold text-white text-sm tracking-tight">GST Tax Hub</strong>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed max-w-xs">
                A high-performance compliance calculator engineered for speed and visual clarity. Drive free organic search traffic and monetize easily through built-in partner links.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
                Calculator Slabs
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li><a href="#accounting-software" className="hover:text-white transition-colors">Compare Accounting Platforms</a></li>
                <li><a href="#tax-consultants" className="hover:text-white transition-colors">Book CA Consultations</a></li>
                <li><a href="#gst-receipt-display" className="hover:text-white transition-colors">Calculate CGST & SGST</a></li>
                <li>
                  <button 
                    onClick={() => setLegalModalOpen(true)} 
                    className="hover:text-white text-indigo-400 font-semibold transition-colors flex items-center gap-1"
                  >
                    <ShieldCheck size={12} /> Disclaimer & Legal Waiver
                  </button>
                </li>
              </ul>
            </div>

            {/* Disclaimer & SEO declaration */}
            <div>
              <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wider mb-3">
                Compliance Disclaimer
              </h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Calculations provided on this portal are for educational, informational, and general estimation purposes. Consult with a registered Chartered Accountant before submitting final tax liabilities or compliance forms.
              </p>
              <button 
                onClick={() => setLegalModalOpen(true)} 
                className="text-indigo-400 hover:text-indigo-300 transition-colors text-[11px] font-semibold underline flex items-center gap-1 mt-2"
              >
                View Complete Liability Waivers & Terms
              </button>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
            <span className="text-[11px] text-slate-500 font-mono">
              © 2026 GST Calculator Hub • Built for Maximum SEO & Multi-channel Monetization.
            </span>
            <div className="flex gap-3 text-[11px] font-medium items-center">
              <button 
                onClick={() => setLegalModalOpen(true)}
                className="text-slate-500 hover:text-indigo-400 transition-colors underline"
              >
                Disclaimer
              </button>
              <span className="text-slate-700">•</span>
              <button 
                onClick={() => setLegalModalOpen(true)}
                className="text-slate-500 hover:text-indigo-400 transition-colors underline"
              >
                Terms of Service
              </button>
              <span className="text-slate-700">•</span>
              <button 
                onClick={() => setLegalModalOpen(true)}
                className="text-slate-500 hover:text-indigo-400 transition-colors underline"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Passcode Entry Modal for Admin Protection */}
      <AnimatePresence>
        {passcodeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setPasscodeModalOpen(false)}
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 z-10 overflow-hidden"
            >
              <button
                onClick={() => setPasscodeModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex flex-col items-center text-center mt-2">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4 border border-indigo-100">
                  <Lock size={22} className="animate-pulse" />
                </div>
                
                <h3 className="font-display font-bold text-slate-900 text-lg">
                  Owner Passcode Required
                </h3>
                <p className="text-slate-500 text-xs mt-1.5 max-w-xs leading-relaxed">
                  The Owner Control Panel contains private customer leads, conversion stats, and ad settings. Please verify ownership.
                </p>

                <form onSubmit={handleVerifyPasscode} className="w-full mt-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 text-left uppercase tracking-wider mb-1.5">
                      Enter Admin Passcode
                    </label>
                    <input
                      type="password"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-center font-mono tracking-widest text-slate-800 text-sm"
                      autoFocus
                    />
                    {passcodeError && (
                      <span className="block text-rose-500 text-[11px] font-medium mt-1.5 text-left">
                        {passcodeError}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Unlock size={14} />
                    Unlock Console
                  </button>
                </form>

                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-5 w-full text-left">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Demo Passcode Hint
                  </span>
                  <p className="text-slate-600 text-xs mt-0.5 font-medium">
                    The default passcode is <code className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100/50 font-mono font-bold text-[11px]">admin123</code>. You can customize this passcode anytime inside the "Settings" tab of the panel once unlocked.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {legalModalOpen && (
          <LegalModal isOpen={legalModalOpen} onClose={() => setLegalModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Cookie Consent Banner */}
      <AnimatePresence>
        {!cookieConsent && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl z-40"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shrink-0 mt-0.5">
                <ShieldCheck size={16} />
              </div>
              <div className="flex-1">
                <h4 className="font-display font-bold text-white text-xs">Cookie Consent & Ad Privacy</h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  We partner with Google AdSense to show personalized or non-personalized ads on this site. Please review and accept our cookie usage and privacy guidelines. Learn more in our{' '}
                  <button
                    onClick={() => {
                      setLegalModalOpen(true);
                    }}
                    className="text-indigo-400 hover:underline inline font-semibold"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setCookieConsent(true);
                      localStorage.setItem('gst_cookie_consent', 'true');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors active:scale-95"
                  >
                    Accept Cookies
                  </button>
                  <button
                    onClick={() => {
                      setCookieConsent(true);
                      localStorage.setItem('gst_cookie_consent', 'true');
                    }}
                    className="text-slate-400 hover:text-slate-200 text-[11px] font-medium px-2 py-1.5 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
