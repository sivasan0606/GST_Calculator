/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Settings, ShieldCheck, Star, Sparkles, DollarSign, ExternalLink, RefreshCw, Layers, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Components
import GstCalculator from './components/GstCalculator';
import AdSenseUnit from './components/AdSenseUnit';
import AffiliateSection from './components/AffiliateSection';
import ConsultationSection from './components/ConsultationSection';
import SnoopingSEO from './components/SnoopingSEO';
import AdminPanel from './components/AdminPanel';

// Types
import { GSTCalculation, ConsultLead, SiteSettings } from './types';

export default function App() {
  // Config Settings State
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('gst_site_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return {
      adsenseClientId: '',
      zohoLink: '',
      quickbooksLink: '',
      xeroLink: '',
      tallyLink: '',
      customConsultationLink: '',
      consultantSponsorFee: '250'
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
    return { zoho: 4, quickbooks: 2, xero: 1, tally: 3 };
  });

  const [simulatedViews, setSimulatedViews] = useState(() => {
    const saved = localStorage.getItem('gst_simulated_views');
    return saved ? parseInt(saved, 10) : 4850;
  });

  // Admin Console View State
  const [showAdmin, setShowAdmin] = useState(false);

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
      <div className="w-full bg-slate-100 border-b border-slate-200 py-1 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <AdSenseUnit 
            slotId="top-leaderboard" 
            format="leaderboard" 
            adsenseClientId={settings.adsenseClientId} 
          />
        </div>
      </div>

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
          <div>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
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
              />
            </motion.div>
          )}
        </AnimatePresence>

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
        <AdSenseUnit 
          slotId="in-content-native" 
          format="banner" 
          adsenseClientId={settings.adsenseClientId} 
        />

        {/* Affiliate comparison section */}
        <AffiliateSection
          zohoLink={settings.zohoLink}
          quickbooksLink={settings.quickbooksLink}
          xeroLink={settings.xeroLink}
          tallyLink={settings.tallyLink}
          onTrackClick={handleTrackAffiliateClick}
        />

        {/* Consultation list and lead capture form */}
        <ConsultationSection
          customConsultationLink={settings.customConsultationLink}
          onLeadSubmit={handleLeadSubmit}
          onTrackBooking={handleTrackSponsorBooking}
        />

        {/* Sidebar-style Square Ad Banner in a neat grid (Placed dynamically here for monetization density) */}
        <div className="max-w-2xl mx-auto">
          <AdSenseUnit 
            slotId="sidebar-square" 
            format="square" 
            adsenseClientId={settings.adsenseClientId} 
          />
        </div>

        {/* Extensive SEO FAQ & Compliance Guides */}
        <SnoopingSEO />

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
                <li><a href="#accounting-software" className="hover:text-white transition-colors">E-Invoice PDF Generator</a></li>
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
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4">
            <span className="text-[11px] text-slate-500 font-mono">
              © 2026 GST Calculator Hub • Built for Maximum SEO & Multi-channel Monetization.
            </span>
            <div className="flex gap-4 text-[11px] font-medium">
              <span className="text-slate-500">Developer Cloud Sandbox • Ready for Netlify & Vercel</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
