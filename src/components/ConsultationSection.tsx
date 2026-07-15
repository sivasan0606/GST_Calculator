/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Calendar, User, Briefcase, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TaxConsultant, ConsultLead } from '../types';

interface ConsultationSectionProps {
  customConsultationLink: string;
  onLeadSubmit: (lead: Omit<ConsultLead, 'id' | 'timestamp' | 'status'>) => void;
  onTrackBooking: (consultantName: string, fee: number) => void;
}

const mockConsultants: TaxConsultant[] = [
  {
    id: 'c1',
    name: 'CA Rajesh Sharma',
    role: 'GST & Corporate Tax Specialist',
    experience: '14+ Years Experience',
    rating: 4.9,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    specialty: ['GST Registration & Appeals', 'Audit Representation', 'Startup Taxation'],
    location: 'Delhi NCR (Available Online)',
    consultationFee: '₹1,500 / 30 mins',
    bookingUrl: '#book-rajesh'
  },
  {
    id: 'c2',
    name: 'CA Ananya Patel',
    role: 'Business Compliance Consultant',
    experience: '9+ Years Experience',
    rating: 4.8,
    reviewsCount: 92,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialty: ['E-Commerce GST Filing', 'Export & LUT Filing', 'Corporate Tax Structuring'],
    location: 'Mumbai (Available Online)',
    consultationFee: '₹1,200 / 30 mins',
    bookingUrl: '#book-ananya'
  },
  {
    id: 'c3',
    name: 'CA Vikram Singhal',
    role: 'SME Tax & Advisory Expert',
    experience: '11+ Years Experience',
    rating: 4.8,
    reviewsCount: 121,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    specialty: ['GST Refund Claims', 'Internal Compliance Audits', 'MSME Tax Subsidies'],
    location: 'Bengaluru (Available Online)',
    consultationFee: '₹1,800 / 30 mins',
    bookingUrl: '#book-vikram'
  }
];

export default function ConsultationSection({
  customConsultationLink,
  onLeadSubmit,
  onTrackBooking
}: ConsultationSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'SME / Retailer',
    consultantId: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [bookedConsultant, setBookedConsultant] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields (Name, Email, Phone).");
      return;
    }

    onLeadSubmit({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      businessType: formData.businessType,
      consultantId: formData.consultantId || undefined,
      message: formData.message
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        businessType: 'SME / Retailer',
        consultantId: '',
        message: ''
      });
    }, 5000);
  };

  const handleBooking = (consultant: TaxConsultant) => {
    // track standard booking sponsor commission (e.g. ₹200 commission per booking slot click)
    onTrackBooking(consultant.name, 250);
    setBookedConsultant(consultant.name);
    
    // If customized sponsor booking link exists, direct them there, else open simulated modal
    if (customConsultationLink) {
      window.open(customConsultationLink, '_blank');
    }

    setTimeout(() => {
      setBookedConsultant(null);
    }, 4000);
  };

  return (
    <section id="tax-consultants" className="my-16 bg-slate-900 text-slate-100 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Pitch & Expert listings */}
        <div className="lg:col-span-7">
          <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-display text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Sponsored Service
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mt-3">
            Speak to a Verified Chartered Accountant
          </h2>
          <p className="text-slate-300 text-sm mt-2 mb-8 leading-relaxed">
            Need custom advice for your business? Connect directly with pre-vetted GST consultants to set up registrations, handle scrutiny notices, or optimize tax savings.
          </p>

          <div className="space-y-4">
            {mockConsultants.map((consultant) => (
              <div 
                key={consultant.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:border-indigo-500/40 transition-colors"
              >
                <img
                  src={consultant.image}
                  alt={consultant.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border border-slate-700 mx-auto sm:mx-0 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="font-display font-semibold text-white text-base">
                      {consultant.name}
                    </h3>
                    <span className="text-emerald-400 text-xs font-mono">
                      {consultant.consultationFee}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">{consultant.role} • <span className="text-slate-400">{consultant.experience}</span></p>
                  
                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5 mt-3 justify-center sm:justify-start">
                    {consultant.specialty.map((spec, i) => (
                      <span key={i} className="bg-slate-700/50 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-600/40">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Booking Button */}
                <div className="shrink-0 flex items-center justify-center pt-2 sm:pt-0">
                  <button
                    onClick={() => handleBooking(consultant)}
                    className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-slate-950 font-display font-semibold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Instant Book</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Lead capture form */}
        <div className="lg:col-span-5 bg-slate-800/50 border border-slate-700/60 rounded-xl p-6 relative">
          <h3 className="font-display font-bold text-white text-lg mb-2">
            Get a Free Custom Tax Quote
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Tell us your business needs. We will route your inquiry to matching tax consultants to bid on your tax filings.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-12 text-center flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mb-4 shadow-sm shadow-emerald-500/10">
                  <CheckCircle size={30} />
                </div>
                <h4 className="font-display font-bold text-white text-base">Inquiry Submitted Successfully!</h4>
                <p className="text-xs text-slate-300 mt-2 max-w-xs mx-auto">
                  We have cataloged your tax request. Our partnered CAs will call or email you within 2 business hours.
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded border border-slate-700/50">
                  <Clock size={12} className="text-emerald-400" />
                  <span>Lead Commission logged in your Admin Dashboard</span>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="consult-name-input" className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                    <User size={12} className="text-indigo-400" /> Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="consult-name-input"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="consult-email-input" className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                      <Mail size={12} className="text-indigo-400" /> Email Address <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="consult-email-input"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="you@company.com"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="consult-phone-input" className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                      <Phone size={12} className="text-indigo-400" /> Phone Number <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="consult-phone-input"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="consult-bizsize-select" className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                      <Briefcase size={12} className="text-indigo-400" /> Business Size
                    </label>
                    <select
                      id="consult-bizsize-select"
                      value={formData.businessType}
                      onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="SME / Retailer">SME / Retailer</option>
                      <option value="Large Private Corp">Large Corp</option>
                      <option value="Freelancer / Contractor">Freelancer / Individual</option>
                      <option value="Startup / Export Firm">Startup / Exporter</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="consult-agent-select" className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1">
                      <Calendar size={12} className="text-indigo-400" /> Preferred Agent
                    </label>
                    <select
                      id="consult-agent-select"
                      value={formData.consultantId}
                      onChange={(e) => setFormData({...formData, consultantId: e.target.value})}
                      className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">Any Available Specialist</option>
                      {mockConsultants.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="consult-message-textarea" className="block text-xs font-medium text-slate-300 mb-1">
                    What can we help you with?
                  </label>
                  <textarea
                    id="consult-message-textarea"
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="E.g., I need to register a new LLP and get GSTIN. Also looking for quarterly filings assistance."
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-500 hover:bg-indigo-600 active:scale-[0.98] text-white font-display font-semibold text-xs py-2.5 rounded-lg transition-all shadow-md shadow-indigo-500/20"
                >
                  Submit & Get Free Advice
                </button>
              </form>
            )}
          </AnimatePresence>

          {/* Booked Notification Tracker Toast */}
          <AnimatePresence>
            {bookedConsultant && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-6 bottom-4 bg-emerald-500 text-slate-950 font-display text-xs font-semibold p-2 rounded-lg flex items-center justify-center gap-1 shadow-md"
              >
                <span>Lead Booking track complete (₹250.00 earned)!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
