import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  Clipboard, 
  Zap, 
  Sparkles, 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Coins
} from 'lucide-react';

interface RazorpayFeeCalculatorProps {
  razorpayLink?: string;
  onTrackClick?: (id: string, estPayout: number) => void;
}

interface PaymentModeConfig {
  id: string;
  name: string;
  description: string;
  rate: number; // as percentage, e.g. 2 for 2%
}

const PAYMENT_MODES: PaymentModeConfig[] = [
  { id: 'upi', name: 'UPI (GPay, PhonePe, BHIM)', description: 'Industry standard 0% fee rate', rate: 0.0 },
  { id: 'rupay_debit', name: 'RuPay Debit Cards', description: 'Zero-merchant discount rate (MDR)', rate: 0.0 },
  { id: 'debit_domestic', name: 'Other Domestic Debit Cards', description: 'Standard Visa, Mastercard, Maestro', rate: 2.0 },
  { id: 'credit_domestic', name: 'Domestic Credit Cards', description: 'Visa, Mastercard, Diner\'s club', rate: 2.0 },
  { id: 'netbanking', name: 'Netbanking (58+ Indian Banks)', description: 'Direct bank account transfer', rate: 2.0 },
  { id: 'wallet', name: 'Mobile Wallets (Paytm, Mobikwik)', description: 'Digital e-wallet payouts', rate: 2.0 },
  { id: 'international', name: 'International Cards & Wallets', description: 'Cards issued outside of India', rate: 3.0 },
  { id: 'amex_corporate', name: 'Amex, Diners & Corporate Cards', description: 'Premium business card accounts', rate: 3.0 }
];

export default function RazorpayFeeCalculator({ razorpayLink, onTrackClick }: RazorpayFeeCalculatorProps) {
  // Mode: 'normal' (client pays invoice, you pay fee) vs 'reverse' (pass fee to client to ensure target net payout)
  const [calcMode, setCalcMode] = useState<'normal' | 'reverse'>('normal');
  
  // Inputs
  const [amountInput, setAmountInput] = useState<string>('10000');
  const [selectedModeId, setSelectedModeId] = useState<string>('credit_domestic');
  const [customRateInput, setCustomRateInput] = useState<string>('2.5');
  const [includeGst, setIncludeGst] = useState<boolean>(true);
  
  // UI states
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Constants
  const GST_RATE_ON_FEE = 18; // 18% GST on payment gateway fee
  const affiliateUrl = razorpayLink || 'https://rzp.io/rzp/LDcj8IDc';

  // Parse values
  const amount = parseFloat(amountInput) || 0;
  const isCustomMode = selectedModeId === 'custom';
  
  const currentModeConfig = PAYMENT_MODES.find(m => m.id === selectedModeId);
  const baseRate = isCustomMode 
    ? (parseFloat(customRateInput) || 0) 
    : (currentModeConfig ? currentModeConfig.rate : 2.0);

  // Calculation variables
  let calculatedInvoiceAmount = amount;
  let calculatedTargetPayout = amount;
  let gatewayFee = 0;
  let gstOnFee = 0;
  let totalDeductions = 0;
  let netPayout = 0;
  let effectiveFeePercentage = 0;

  if (calcMode === 'normal') {
    // Standard Payout Calculation
    calculatedInvoiceAmount = amount;
    gatewayFee = amount * (baseRate / 100);
    gstOnFee = includeGst ? (gatewayFee * (GST_RATE_ON_FEE / 100)) : 0;
    totalDeductions = gatewayFee + gstOnFee;
    netPayout = Math.max(0, amount - totalDeductions);
    effectiveFeePercentage = amount > 0 ? (totalDeductions / amount) * 100 : 0;
  } else {
    // Reverse "Pass Fee to Client" Calculation
    // We want the final Net Payout to be exactly the amount entered
    calculatedTargetPayout = amount;
    const decimalRate = baseRate / 100;
    const gstMultiplier = includeGst ? (1 + GST_RATE_ON_FEE / 100) : 1;
    const divisor = 1 - (decimalRate * gstMultiplier);

    if (divisor > 0) {
      calculatedInvoiceAmount = amount / divisor;
      gatewayFee = calculatedInvoiceAmount * decimalRate;
      gstOnFee = includeGst ? (gatewayFee * (GST_RATE_ON_FEE / 100)) : 0;
      totalDeductions = gatewayFee + gstOnFee;
      netPayout = amount; // which is exactly target payout
      effectiveFeePercentage = calculatedInvoiceAmount > 0 ? (totalDeductions / calculatedInvoiceAmount) * 100 : 0;
    } else {
      // Avoid division by zero/negative
      calculatedInvoiceAmount = 0;
      gatewayFee = 0;
      gstOnFee = 0;
      totalDeductions = 0;
      netPayout = 0;
      effectiveFeePercentage = 0;
    }
  }

  // Pre-calculate alternate rates for comparison grid
  const comparisonResults = PAYMENT_MODES.map(mode => {
    const rate = mode.rate;
    let invAmt = amount;
    let fee = 0;
    let gst = 0;
    let deduct = 0;
    let payout = 0;

    if (calcMode === 'normal') {
      invAmt = amount;
      fee = amount * (rate / 100);
      gst = includeGst ? (fee * (GST_RATE_ON_FEE / 100)) : 0;
      deduct = fee + gst;
      payout = Math.max(0, amount - deduct);
    } else {
      const decimalRate = rate / 100;
      const gstMultiplier = includeGst ? (1 + GST_RATE_ON_FEE / 100) : 1;
      const divisor = 1 - (decimalRate * gstMultiplier);
      if (divisor > 0) {
        invAmt = amount / divisor;
        fee = invAmt * decimalRate;
        gst = includeGst ? (fee * (GST_RATE_ON_FEE / 100)) : 0;
        deduct = fee + gst;
        payout = amount;
      }
    }

    return {
      ...mode,
      calculatedInvoice: invAmt,
      fee,
      gst,
      deductions: deduct,
      payout
    };
  });

  // Preset button action
  const handleAddPreset = (val: number) => {
    const current = parseFloat(amountInput) || 0;
    setAmountInput((current + val).toString());
  };

  const handleReset = () => {
    setAmountInput('10000');
    setSelectedModeId('credit_domestic');
    setCustomRateInput('2.5');
    setIncludeGst(true);
    setCalcMode('normal');
  };

  const handleCopyReport = () => {
    const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
    const formattedAmount = formatter.format(calculatedInvoiceAmount);
    const formattedPayout = formatter.format(netPayout);
    const formattedFee = formatter.format(gatewayFee);
    const formattedGst = formatter.format(gstOnFee);
    const formattedDeductions = formatter.format(totalDeductions);
    const modeName = isCustomMode ? `Custom Rate (${baseRate}%)` : (currentModeConfig?.name || '');

    const text = `--- SimplyTools Razorpay Payout Breakdown ---\n` +
      `Calculation Mode: ${calcMode === 'normal' ? 'Normal (Client Pays Invoice)' : 'Reverse (Pass Fee to Client)'}\n` +
      `Payment Mode: ${modeName}\n` +
      `Invoice Amount billed to Client: ${formattedAmount}\n` +
      `Razorpay Gateway Fee (${baseRate}%): ${formattedFee}\n` +
      `GST on Gateway Fee (${GST_RATE_ON_FEE}%): ${formattedGst}\n` +
      `Total Gateway Deductions: ${formattedDeductions}\n` +
      `Net Cash Payout in your Bank: ${formattedPayout}\n` +
      `Effective Retained Rate: ${(100 - effectiveFeePercentage).toFixed(2)}%\n` +
      `Calculate online at: https://simplytools.in`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAffiliateClick = () => {
    if (onTrackClick) {
      onTrackClick('razorpay-fee-cta', 25.00);
    }
  };

  // Helper formatting
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 font-sans max-w-4xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-indigo-100">
            <Coins size={11} /> Merchant Payments Toolkit
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Razorpay Fee & Net Payout Calculator
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Sellers, service providers, and agencies: estimate your exact payment processing costs and bank settlements, or pass fees to clients to guarantee your profit margin.
          </p>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-semibold border border-slate-100 transition-colors shrink-0 self-start sm:self-center"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      {/* Mode Switches: Normal vs Reverse */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-100/80 rounded-2xl gap-1 mb-6">
        <button
          onClick={() => setCalcMode('normal')}
          className={`py-3 px-4 text-center rounded-xl text-xs font-bold transition-all ${
            calcMode === 'normal'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <CreditCard size={14} />
            <div>
              <span>Client Pays Invoice</span>
              <span className="block text-[9px] font-medium opacity-70 mt-0.5">Deduct fee from total</span>
            </div>
          </div>
        </button>
        <button
          onClick={() => setCalcMode('reverse')}
          className={`py-3 px-4 text-center rounded-xl text-xs font-bold transition-all ${
            calcMode === 'reverse'
              ? 'bg-white text-slate-950 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5">
            <Calculator size={14} />
            <div>
              <span>Pass Fee to Client</span>
              <span className="block text-[9px] font-medium opacity-70 mt-0.5">Calculate bill to keep full target net</span>
            </div>
          </div>
        </button>
      </div>

      {/* Calculator Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Inputs Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Amount Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 tracking-tight">
              {calcMode === 'normal' ? 'Invoice Amount billed to Client (₹)' : 'Target Net Payout to land in your Bank (₹)'}
            </label>
            <div className="relative rounded-2xl shadow-2xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold text-sm">₹</span>
              </div>
              <input
                type="number"
                min="100"
                max="10000000"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                className="block w-full pl-8 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                placeholder="10,000"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <span className="text-slate-400 text-xs font-bold">INR</span>
              </div>
            </div>

            {/* Fast Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => handleAddPreset(1000)}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors"
              >
                +₹1,000
              </button>
              <button
                onClick={() => handleAddPreset(5000)}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors"
              >
                +₹5,000
              </button>
              <button
                onClick={() => handleAddPreset(10000)}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors"
              >
                +₹10,000
              </button>
              <button
                onClick={() => handleAddPreset(50000)}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors"
              >
                +₹50,000
              </button>
              <button
                onClick={() => handleAddPreset(100000)}
                className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 transition-colors"
              >
                +₹1,00,000
              </button>
              <button
                onClick={() => setAmountInput('10000')}
                className="px-2.5 py-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100/50 transition-colors ml-auto"
              >
                Set Default (10k)
              </button>
            </div>
          </div>

          {/* Payment Mode Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 tracking-tight">
                Payment Collection Method
              </label>
              <span className="text-[10px] text-slate-400 font-semibold font-mono">Standard rates applied</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PAYMENT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedModeId(mode.id)}
                  className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    selectedModeId === mode.id
                      ? 'bg-indigo-50/50 border-indigo-500/30 ring-1 ring-indigo-500/20'
                      : 'bg-slate-50/50 border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-slate-900 leading-tight">{mode.name}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                      mode.rate === 0 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-slate-200 text-slate-800'
                    }`}>
                      {mode.rate.toFixed(1)}%
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium mt-1 leading-none">{mode.description}</span>
                </button>
              ))}
              
              {/* Custom Override Option */}
              <button
                onClick={() => setSelectedModeId('custom')}
                className={`text-left p-3 rounded-xl border transition-all flex flex-col justify-between sm:col-span-2 ${
                  selectedModeId === 'custom'
                    ? 'bg-indigo-50/50 border-indigo-500/30 ring-1 ring-indigo-500/20'
                    : 'bg-slate-50/50 border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <span className="text-xs font-bold text-slate-900 leading-tight block">Custom Override Rate</span>
                    <span className="text-[9px] text-slate-400 font-medium leading-none">For custom negotiated enterprise plans</span>
                  </div>
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                    {baseRate.toFixed(2)}%
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Custom rate slider if active */}
          {isCustomMode && (
            <div className="p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950">Enter Custom Payment Gateway rate (%)</span>
                <span className="text-xs font-bold text-indigo-700">{baseRate}%</span>
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.05"
                  value={customRateInput}
                  onChange={(e) => setCustomRateInput(e.target.value)}
                  className="w-full accent-indigo-600"
                />
                <input
                  type="number"
                  min="0.1"
                  max="10"
                  step="0.01"
                  value={customRateInput}
                  onChange={(e) => setCustomRateInput(e.target.value)}
                  className="w-20 px-2 py-1 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-lg text-center focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Include 18% GST Toggle */}
          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex items-start gap-2.5">
              <input
                id="include-gst"
                type="checkbox"
                checked={includeGst}
                onChange={(e) => setIncludeGst(e.target.checked)}
                className="w-4.5 h-4.5 text-indigo-600 bg-white border-slate-200 rounded-sm focus:ring-indigo-500 shrink-0 mt-0.5"
              />
              <div className="flex flex-col">
                <label htmlFor="include-gst" className="text-xs font-bold text-slate-900 cursor-pointer">
                  Apply 18% GST on Gateway Fee
                </label>
                <span className="text-[10px] text-slate-400 font-medium">
                  Indian law applies 18% GST to standard processing commission fees.
                </span>
              </div>
            </div>
            
            {/* Tooltip trigger */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip('gst')}
                onMouseLeave={() => setShowTooltip(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <HelpCircle size={14} />
              </button>
              {showTooltip === 'gst' && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900 text-white text-[10px] p-2.5 rounded-lg shadow-md z-20 font-medium leading-relaxed">
                  The Indian Govt charges 18% GST on top of the gateway's processing cut. e.g. A 2.0% fee effectively costs 2.36% of the transaction amount.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5 sm:p-6 space-y-5">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block font-mono">
              Settlement Calculation Breakdown
            </span>

            {/* Billed Invoice amount */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">
                {calcMode === 'normal' ? 'Billed Invoice Value' : 'Billed Invoice Amount'}
              </span>
              <div className="text-2xl font-black text-slate-900">
                {formatCurrency(calculatedInvoiceAmount)}
              </div>
              <span className="text-[10px] text-slate-400 block">
                {calcMode === 'normal' 
                  ? 'The total amount paid by your client.' 
                  : 'Total you must bill your client to retain your target payout.'
                }
              </span>
            </div>

            <div className="border-t border-slate-200/60 my-4" />

            {/* Payout Details Math List */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  Gateway Processing Fee ({baseRate}%)
                </span>
                <span className="font-semibold text-slate-900">{formatCurrency(gatewayFee)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1">
                  GST on Fee ({includeGst ? '18' : '0'}%)
                </span>
                <span className="font-semibold text-slate-900">{formatCurrency(gstOnFee)}</span>
              </div>

              <div className="flex justify-between items-center text-xs font-bold text-rose-600 bg-rose-500/5 p-2 rounded-lg">
                <span>Total Deductions</span>
                <span>-{formatCurrency(totalDeductions)}</span>
              </div>
            </div>

            <div className="border-t border-slate-200/60 my-4" />

            {/* Big Net Payout */}
            <div className="space-y-1 bg-white p-4 rounded-xl border border-slate-100 shadow-3xs">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-tight">
                {calcMode === 'normal' ? 'Net Payout to Bank Account' : 'Net Retained (Target Met)'}
              </span>
              <div className="text-3xl font-black text-emerald-600">
                {formatCurrency(netPayout)}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 leading-normal">
                {calcMode === 'normal' 
                  ? 'The actual cash that settles into your linked bank account.'
                  : 'This matches your targeted net earnings perfectly!'
                }
              </span>
            </div>

            {/* Visual Retention Bar */}
            {amount > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Cash Retained: {(100 - effectiveFeePercentage).toFixed(2)}%</span>
                  <span>Fee Take: {effectiveFeePercentage.toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.max(0, 100 - effectiveFeePercentage)}%` }} 
                    className="h-full bg-emerald-500 transition-all duration-350"
                  />
                  <div 
                    style={{ width: `${effectiveFeePercentage}%` }} 
                    className="h-full bg-rose-500 transition-all duration-350"
                  />
                </div>
              </div>
            )}

            {/* Copy & Share Button */}
            <div className="pt-2">
              <button
                onClick={handleCopyReport}
                className="w-full flex items-center justify-center gap-2 bg-slate-950 text-white font-bold text-xs py-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-emerald-400" /> Report Copied!
                  </>
                ) : (
                  <>
                    <Clipboard size={14} /> Copy Breakdown Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Comparison Table */}
      <div className="mt-8 border-t border-slate-100 pt-8 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">How payment modes compare for ₹{amount.toLocaleString('en-IN')}</h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Review side-by-side processing commissions to negotiate better payment channels with your regular clients.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-center">Rate</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-right">Total Deductions</th>
                <th className="py-3 px-4 text-right">Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {comparisonResults.map((res) => (
                <tr 
                  key={res.id}
                  className={`hover:bg-slate-50/50 transition-colors ${
                    selectedModeId === res.id ? 'bg-indigo-50/15 font-semibold' : ''
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-slate-900 font-medium">{res.name}</span>
                      <span className="text-[9px] text-slate-400 font-normal">{res.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.rate === 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {res.rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-600 font-mono">
                    {formatCurrency(res.calculatedInvoice)}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-500 font-mono">
                    -{formatCurrency(res.deductions)}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600 font-bold font-mono">
                    {formatCurrency(res.payout)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monetization Integration Call to Action */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-lg mt-8 relative overflow-hidden">
        {/* Background Decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/20">
              <Sparkles size={10} className="animate-pulse" /> Official Partner Recommendation
            </span>
            <h4 className="text-base font-bold tracking-tight">
              Tired of high transaction fees?
            </h4>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Set up your merchant account with Razorpay for transparent pricing, instant settlements, and a robust payment gateway trusted by millions of Indian freelancers and startups.
            </p>
          </div>
          
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleAffiliateClick}
            className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer hover:translate-x-0.5 duration-200 shrink-0"
          >
            Launch Razorpay Account <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
