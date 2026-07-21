/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clipboard, Check, RotateCcw, HelpCircle, FileText, Sparkles, Printer, Calculator, DollarSign, TrendingUp, AlertTriangle, Calendar, RefreshCcw, ArrowUpRight } from 'lucide-react';

interface WorkingCapitalCalculatorProps {
  razorpayLink?: string;
  zohoLink?: string;
}

export default function WorkingCapitalCalculator({ razorpayLink, zohoLink }: WorkingCapitalCalculatorProps) {
  // Currency options
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  const currencySymbols: Record<'INR' | 'USD' | 'EUR', string> = {
    INR: '₹',
    USD: '$',
    EUR: '€'
  };

  // Inputs
  const [annualRevenueInput, setAnnualRevenueInput] = useState<string>('12000000'); // Annual Sales (1.2 Cr)
  const [cogsInput, setCogsInput] = useState<string>('8000000'); // Cost of Goods Sold (80 Lakhs)
  
  const [receivableDaysInput, setReceivableDaysInput] = useState<string>('60'); // Customers pay in 60 days
  const [inventoryDaysInput, setInventoryDaysInput] = useState<string>('45'); // Inventory stays in stock for 45 days
  const [payableDaysInput, setPayableDaysInput] = useState<string>('30'); // We pay suppliers in 30 days

  // Outputs
  const [calculation, setCalculation] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    calculateWorkingCapital();
  }, [annualRevenueInput, cogsInput, receivableDaysInput, inventoryDaysInput, payableDaysInput, currency]);

  const formatCurrency = (val: number, cur: 'INR' | 'USD' | 'EUR' = currency) => {
    const symbol = currencySymbols[cur];
    const locale = cur === 'INR' ? 'en-IN' : 'en-US';
    return `${symbol}${val.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
  };

  const calculateWorkingCapital = () => {
    const revenue = parseFloat(annualRevenueInput) || 0;
    const cogs = parseFloat(cogsInput) || 0;
    
    const recDays = parseFloat(receivableDaysInput) || 0;
    const invDays = parseFloat(inventoryDaysInput) || 0;
    const payDays = parseFloat(payableDaysInput) || 0;

    // Accounts Receivable Value = (Receivable Days / 365) * Revenue
    const receivableValue = (recDays / 365) * revenue;

    // Inventory Carrying Value = (Inventory Days / 365) * COGS
    const inventoryValue = (invDays / 365) * cogs;

    // Accounts Payable Value = (Payable Days / 365) * COGS
    const payableValue = (payDays / 365) * cogs;

    // Cash Conversion Cycle / Working Capital Gap (Days)
    const cashConversionCycle = recDays + invDays - payDays;

    // Working Capital Gap (Funds Needed) = Receivable Value + Inventory Value - Payable Value
    // This is the direct funding gap the startup needs to finance via cash reserves, credit line, or OD.
    const fundingGap = Math.max(0, receivableValue + inventoryValue - payableValue);

    setCalculation({
      revenue,
      cogs,
      recDays,
      invDays,
      payDays,
      receivableValue,
      inventoryValue,
      payableValue,
      cashConversionCycle,
      fundingGap
    });
  };

  const copyReport = () => {
    if (!calculation) return;

    const text = `--- WORKING CAPITAL GAP & CASH CONVERSION CYCLE REPORT ---
Annual Revenue: ${formatCurrency(calculation.revenue)}
Annual Cost of Goods Sold: ${formatCurrency(calculation.cogs)}

--- THE METRICS (DAYS) ---
Accounts Receivable Days: ${calculation.recDays} Days
Inventory Outstanding Days: ${calculation.invDays} Days
Accounts Payable Days: ${calculation.payDays} Days
Cash Conversion Cycle (Gap Days): ${calculation.cashConversionCycle} Days

--- FINANCIAL EXPOSURE (FUNDS SQUEEZED) ---
Accounts Receivable Value (Customers Owe): ${formatCurrency(calculation.receivableValue)}
Inventory Carrying Cost (Tied up in Stock): ${formatCurrency(calculation.inventoryValue)}
Accounts Payable Value (Owed to Suppliers): ${formatCurrency(calculation.payableValue)}

Estimated Working Capital Bridge Funding Required: ${formatCurrency(calculation.fundingGap)}
---------------------------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  const resetInputs = () => {
    setAnnualRevenueInput('12000000');
    setCogsInput('8000000');
    setReceivableDaysInput('60');
    setInventoryDaysInput('45');
    setPayableDaysInput('30');
  };

  if (!calculation) return null;

  return (
    <div id="working-capital-calculator" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-xs max-w-4xl mx-auto font-sans">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-600" size={22} />
          <h3 className="font-display font-bold text-slate-800 text-lg">Working Capital Gap & Credit Line Calculator</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyReport}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Copy Report"
          >
            {copied ? <Check size={18} className="text-emerald-500" /> : <Clipboard size={18} />}
          </button>
          <button
            onClick={printReport}
            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
            title="Print Report"
          >
            <Printer size={18} />
          </button>
          <button
            onClick={resetInputs}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Reset Calculator"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Parameters Column (Left) */}
        <div className="space-y-6">
          {/* Base Currency Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Base Currency</span>
              <span className="text-[10px] text-slate-400">Select currency for working capital calculations.</span>
            </div>
            <select
              id="wc-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD' | 'EUR')}
              className="px-3 py-2 border border-slate-200 rounded-lg font-display font-semibold text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer min-w-[120px]"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          {/* Section 1: Business Operations Size */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-slate-500" />
              Annual Operations Scale
            </h4>

            {/* Annual Sales / Revenue */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>Annual Revenue / Sales</span>
                <span className="text-indigo-600 font-bold">{formatCurrency(parseFloat(annualRevenueInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  type="number"
                  value={annualRevenueInput}
                  onChange={(e) => setAnnualRevenueInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-1.5 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Annual Cost of Goods Sold (COGS) */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>Annual Cost of Goods Sold / Materials</span>
                <span className="text-slate-500 font-bold">{formatCurrency(parseFloat(cogsInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  type="number"
                  value={cogsInput}
                  onChange={(e) => setCogsInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-1.5 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Time Duration Cycle (Days) */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-slate-500" />
              Operational Cycle Days
            </h4>

            {/* Accounts Receivable Days */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1">
                Accounts Receivable Days <span className="text-slate-400 font-normal">(Days taken for clients to pay you)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={receivableDaysInput}
                  onChange={(e) => setReceivableDaysInput(e.target.value)}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={receivableDaysInput}
                  onChange={(e) => setReceivableDaysInput(e.target.value)}
                  className="w-16 text-center text-xs font-bold rounded-lg border-slate-200 border py-1"
                />
              </div>
            </div>

            {/* Inventory Outstanding Days */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1">
                Inventory Outstanding Days <span className="text-slate-400 font-normal">(Days inventory sits on shelf before sale)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={inventoryDaysInput}
                  onChange={(e) => setInventoryDaysInput(e.target.value)}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={inventoryDaysInput}
                  onChange={(e) => setInventoryDaysInput(e.target.value)}
                  className="w-16 text-center text-xs font-bold rounded-lg border-slate-200 border py-1"
                />
              </div>
            </div>

            {/* Accounts Payable Days */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1">
                Accounts Payable Days <span className="text-slate-400 font-normal">(Days you take to pay raw material suppliers)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="5"
                  value={payableDaysInput}
                  onChange={(e) => setPayableDaysInput(e.target.value)}
                  className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <input
                  type="number"
                  value={payableDaysInput}
                  onChange={(e) => setPayableDaysInput(e.target.value)}
                  className="w-16 text-center text-xs font-bold rounded-lg border-slate-200 border py-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Output Metrics Column (Right) */}
        <div className="space-y-6">
          {/* Main big working capital gap metric */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase bg-indigo-950/80 px-2.5 py-1 rounded-md inline-block">
              WORKING CAPITAL BRIDGE FUNDING NEEDED
            </span>

            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 block">Total Capital Gap:</span>
                <span className="text-[10px] text-rose-400 font-semibold bg-rose-950 px-2 py-0.5 rounded-md mt-0.5 inline-block">Squeezed Assets & Cash</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-rose-400 tracking-tight">
                {formatCurrency(calculation.fundingGap)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block">Net Cash Conversion Cycle (CCC):</span>
                <span className="text-[10px] text-indigo-300 font-semibold bg-indigo-950 px-2 py-0.5 rounded-md mt-0.5 inline-block">Days of capital tied up</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-indigo-300 tracking-tight">
                {calculation.cashConversionCycle} Days
              </span>
            </div>
          </div>

          {/* Breakdown items as progress indicators */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">Where is your money tied up?</h4>
            
            <div className="space-y-4 text-xs">
              {/* Accounts Receivables tied value */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Accounts Receivable (Customer dues):</span>
                  <span className="font-bold text-slate-800">{formatCurrency(calculation.receivableValue)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${Math.min(100, (calculation.receivableValue / (calculation.revenue / 4)) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Calculated based on {calculation.recDays} Receivable Days</span>
              </div>

              {/* Inventory tied value */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Inventory Carrying Cost (Stock value):</span>
                  <span className="font-bold text-slate-800">{formatCurrency(calculation.inventoryValue)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${Math.min(100, (calculation.inventoryValue / (calculation.cogs / 4)) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Calculated based on {calculation.invDays} Stock Days</span>
              </div>

              {/* Accounts Payable deferred value */}
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Accounts Payable (Owed to suppliers):</span>
                  <span className="font-bold text-emerald-600">-{formatCurrency(calculation.payableValue)}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min(100, (calculation.payableValue / (calculation.cogs / 4)) * 100)}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">Provides positive cash leverage up to {calculation.payDays} Days</span>
              </div>
            </div>
          </div>

          {/* Recommended Financial & Banking Tools Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600 animate-pulse" />
              Empower Your Business Treasury
            </h4>
            
            <div className="space-y-3">
              {/* RazorpayX Promotion */}
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-2xs hover:border-slate-200 transition-colors">
                <p className="text-xs font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>Smart Payouts via RazorpayX</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider scale-95">Recommended</span>
                </p>
                <p className="text-[11px] text-slate-500 leading-relaxed mb-3 font-medium">
                  Need better control over your cash flow and payouts? Explore RazorpayX to automate commercial bank accounts, pay vendors in bulk, and schedule salaries with one tap.
                </p>
                <a
                  href={razorpayLink || "https://rzp.io/rzp/LDcj8IDc"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  <span>Explore RazorpayX</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>

              {/* Zoho Books Advertisement */}
              <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-xl p-3.5 shadow-2xs">
                <p className="text-xs font-bold text-blue-900 mb-1 flex items-center justify-between">
                  <span>Zoho Books Accounting</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider scale-95">Ad</span>
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3 font-medium">
                  Automate your bookkeeping, client invoicing, tax filings, and margins effortlessly. Try Zoho Books to stay 100% compliant with real-time financial tracking.
                </p>
                <a
                  href={zohoLink || "https://go.zoho.com/2ysQ"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                >
                  <span>Try Zoho Books Today</span>
                  <ArrowUpRight size={12} />
                </a>
              </div>
            </div>
          </div>

          {/* Compliance & Educational Info Alert */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-900 flex gap-2">
            <HelpCircle size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">Understanding Working Capital Gap:</p>
              <p className="mt-0.5">Your cash conversion cycle is <strong>{calculation.cashConversionCycle} Days</strong>. This means you must cover business expenses out of your own cash or credit lines for {calculation.cashConversionCycle} days before receiving any earnings back from customer invoices. Increasing supplier credit terms (Payable Days) or speeding up collections (Receivable Days) will reduce this gap dramatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
