/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Percent, Clipboard, Check, RotateCcw, HelpCircle, FileText, Download, ShieldAlert, Sparkles, Printer, Calculator, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

export default function RunwayCalculator() {
  // Currency options
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  const currencySymbols: Record<'INR' | 'USD' | 'EUR', string> = {
    INR: '₹',
    USD: '$',
    EUR: '€'
  };

  // Inputs
  const [currentCashInput, setCurrentCashInput] = useState<string>('2500000');
  const [monthlyRevenueInput, setMonthlyRevenueInput] = useState<string>('150000');
  const [monthlyExpensesInput, setMonthlyExpensesInput] = useState<string>('350000');
  
  // Custom optimization sliders
  const [expenseCutPercent, setExpenseCutPercent] = useState<number>(0);
  const [revenueGrowthPercent, setRevenueGrowthPercent] = useState<number>(0);

  // Outputs
  const [calculation, setCalculation] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    calculateRunway();
  }, [currentCashInput, monthlyRevenueInput, monthlyExpensesInput, expenseCutPercent, revenueGrowthPercent, currency]);

  const formatCurrency = (val: number, cur: 'INR' | 'USD' | 'EUR' = currency) => {
    const symbol = currencySymbols[cur];
    const locale = cur === 'INR' ? 'en-IN' : 'en-US';
    return `${symbol}${val.toLocaleString(locale, { maximumFractionDigits: 0 })}`;
  };

  const calculateRunway = () => {
    const cash = parseFloat(currentCashInput) || 0;
    const baseRevenue = parseFloat(monthlyRevenueInput) || 0;
    const baseExpenses = parseFloat(monthlyExpensesInput) || 0;

    // Apply optimization scenario values
    const expenses = baseExpenses * (1 - expenseCutPercent / 100);
    const revenue = baseRevenue * (1 + revenueGrowthPercent / 100);

    // Calculations
    const monthlyBurnRate = Math.max(0, expenses - revenue);
    
    let runwayMonths = 0;
    if (monthlyBurnRate <= 0) {
      runwayMonths = Infinity; // Infinite runway (cash flow positive or break even)
    } else {
      runwayMonths = cash / monthlyBurnRate;
    }

    // Default calculations (unoptimized)
    const defaultMonthlyBurnRate = Math.max(0, baseExpenses - baseRevenue);
    let defaultRunwayMonths = 0;
    if (defaultMonthlyBurnRate <= 0) {
      defaultRunwayMonths = Infinity;
    } else {
      defaultRunwayMonths = cash / defaultMonthlyBurnRate;
    }

    setCalculation({
      cash,
      baseRevenue,
      baseExpenses,
      expenses,
      revenue,
      monthlyBurnRate,
      runwayMonths,
      defaultMonthlyBurnRate,
      defaultRunwayMonths
    });
  };

  const copyReport = () => {
    if (!calculation) return;

    const runwayText = calculation.runwayMonths === Infinity 
      ? 'Infinite (Cash Flow Positive / Net Income is positive)' 
      : `${calculation.runwayMonths.toFixed(1)} Months`;

    const text = `--- CASH RUNWAY & BURN RATE REPORT ---
Current Cash Reserves: ${formatCurrency(calculation.cash)}
Monthly Revenue: ${formatCurrency(calculation.baseRevenue)}
Monthly Operating Expenses: ${formatCurrency(calculation.baseExpenses)}

Monthly Burn Rate (Net Deficit): ${formatCurrency(calculation.defaultMonthlyBurnRate)}
Cash Runway: ${calculation.defaultRunwayMonths === Infinity ? 'Infinite' : calculation.defaultRunwayMonths.toFixed(1)} Months

[SCENARIO ANALYSIS]
Expense Reduction: ${expenseCutPercent}% (New Expenses: ${formatCurrency(calculation.expenses)})
Revenue Growth: ${revenueGrowthPercent}% (New Revenue: ${formatCurrency(calculation.revenue)})
New Monthly Burn Rate: ${formatCurrency(calculation.monthlyBurnRate)}
New Runway: ${runwayText}
--------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  const resetInputs = () => {
    setCurrentCashInput('2500000');
    setMonthlyRevenueInput('150000');
    setMonthlyExpensesInput('350000');
    setExpenseCutPercent(0);
    setRevenueGrowthPercent(0);
  };

  if (!calculation) return null;

  // Visual helper for runway duration
  const getRunwayColor = (months: number) => {
    if (months === Infinity) return 'text-emerald-500';
    if (months >= 12) return 'text-emerald-600';
    if (months >= 6) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getRunwayProgressColor = (months: number) => {
    if (months === Infinity || months >= 12) return 'bg-emerald-500';
    if (months >= 6) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div id="runway-calculator" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-xs max-w-4xl mx-auto font-sans">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-600" size={22} />
          <h3 className="font-display font-bold text-slate-800 text-lg">Startup Cash Runway & Burn Rate Calculator</h3>
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
        {/* Left Inputs column */}
        <div className="space-y-6">
          {/* Base Currency Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
            <div>
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Base Currency</span>
              <span className="text-[10px] text-slate-400">Select currency for runway & burn calculations.</span>
            </div>
            <select
              id="runway-currency-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD' | 'EUR')}
              className="px-3 py-2 border border-slate-200 rounded-lg font-display font-semibold text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer min-w-[120px]"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>

          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign size={14} className="text-slate-500" />
              Financial Reserves
            </h4>

            {/* Current Cash */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5 flex justify-between">
                <span>Current Liquid Cash / Bank Balance</span>
                <span className="text-indigo-600 font-bold">{formatCurrency(parseFloat(currentCashInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  type="number"
                  value={currentCashInput}
                  onChange={(e) => setCurrentCashInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 2500000"
                />
              </div>
            </div>

            {/* Monthly Operating Expenses */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5 flex justify-between">
                <span>Monthly Cash Outflow (Rent, Salaries, Software, Ops)</span>
                <span className="text-slate-500 font-bold">{formatCurrency(parseFloat(monthlyExpensesInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  type="number"
                  value={monthlyExpensesInput}
                  onChange={(e) => setMonthlyExpensesInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 350000"
                />
              </div>
            </div>

            {/* Monthly Revenue */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5 flex justify-between">
                <span>Monthly Cash Inflow (Product Sales, Client Retainers)</span>
                <span className="text-indigo-600 font-bold">{formatCurrency(parseFloat(monthlyRevenueInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  type="number"
                  value={monthlyRevenueInput}
                  onChange={(e) => setMonthlyRevenueInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 150000"
                />
              </div>
            </div>
          </div>

          {/* Interactive Runway Scenario Optimization Sliders */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-500" />
              Scenario Optimizer (Runway Extender)
            </h4>

            {/* Expense Cut Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Reduce Monthly Expenses:</span>
                <span className="text-rose-600 font-bold">-{expenseCutPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={expenseCutPercent}
                onChange={(e) => setExpenseCutPercent(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (As-Is)</span>
                <span>Cut 25% (Moderate)</span>
                <span>Cut 50% (Sparsely aggressive)</span>
              </div>
            </div>

            {/* Revenue Growth Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Grow Monthly Inflows:</span>
                <span className="text-emerald-600 font-bold">+{revenueGrowthPercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={revenueGrowthPercent}
                onChange={(e) => setRevenueGrowthPercent(parseInt(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Stable)</span>
                <span>+50% Growth</span>
                <span>+100% Growth (2x)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output columns */}
        <div className="space-y-6">
          {/* Main calculated runway big hero stat */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm text-center">
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase bg-indigo-950/80 px-2.5 py-1 rounded-md inline-block">
              ESTIMATED CASH RUNWAY
            </span>

            <div className="py-2">
              <span className={`text-5xl sm:text-6xl font-black tracking-tight ${getRunwayColor(calculation.runwayMonths)}`}>
                {calculation.runwayMonths === Infinity 
                  ? 'Infinite' 
                  : `${calculation.runwayMonths.toFixed(1)}`}
              </span>
              {calculation.runwayMonths !== Infinity && (
                <span className="text-xl font-bold block mt-1 text-slate-400">Months of Survival</span>
              )}
              {calculation.runwayMonths === Infinity && (
                <span className="text-xs font-semibold block mt-1 text-emerald-400">Your monthly cash inflow exceeds monthly expenses!</span>
              )}
            </div>

            {/* Progress visual representation of runway */}
            {calculation.runwayMonths !== Infinity && (
              <div className="space-y-1.5">
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getRunwayProgressColor(calculation.runwayMonths)}`}
                    style={{ width: `${Math.min(100, (calculation.runwayMonths / 24) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Critical (&lt;6 Months)</span>
                  <span>1 Year Stable</span>
                  <span>Comfortable (24+ Months)</span>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown parameters */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm">Monthly Burn Rate Detail</h4>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current Monthly Revenue:</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(calculation.revenue)}
                  {revenueGrowthPercent > 0 && (
                    <span className="text-emerald-600 text-[10px] ml-1.5 font-bold">({revenueGrowthPercent}% Growth applied)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current Monthly Expenses:</span>
                <span className="font-semibold text-slate-800">
                  {formatCurrency(calculation.expenses)}
                  {expenseCutPercent > 0 && (
                    <span className="text-rose-600 text-[10px] ml-1.5 font-bold">(-{expenseCutPercent}% Cost Cuts applied)</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between py-1.5 font-bold bg-slate-50 px-2.5 py-2 rounded-xl">
                <span className="text-slate-700">Net Monthly Cash Deficit (Burn):</span>
                <span className={`font-mono ${calculation.monthlyBurnRate > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {calculation.monthlyBurnRate > 0 
                    ? formatCurrency(calculation.monthlyBurnRate) 
                    : `${currencySymbols[currency]}0 (Profitable / Break-Even)`}
                </span>
              </div>
            </div>

            {/* Compare vs Baseline (No-slider state) */}
            {(revenueGrowthPercent > 0 || expenseCutPercent > 0) && (
              <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50 text-xs text-indigo-950 flex flex-col gap-1">
                <p className="font-semibold flex items-center gap-1.5 text-indigo-800">
                  <TrendingUp size={14} />
                  Impact of Scenario Optimization:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1.5 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Baseline Runway:</span>
                    <span className="font-bold text-slate-700">
                      {calculation.defaultRunwayMonths === Infinity ? 'Infinite' : `${calculation.defaultRunwayMonths.toFixed(1)} Months`}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Optimized Runway:</span>
                    <span className="font-bold text-emerald-600">
                      {calculation.runwayMonths === Infinity ? 'Infinite' : `${calculation.runwayMonths.toFixed(1)} Months`}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actionable tip or warning */}
          {calculation.runwayMonths !== Infinity && calculation.runwayMonths < 6 && (
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-950 flex gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-bold">Urgent Runway Warning (&lt;6 Months):</p>
                <p className="mt-0.5">Your cash runway is critical. Consider initiating cost-reductions immediately, bootstrapping operational bills, or raising bridges/interim rounds to avoid sudden insolvency.</p>
              </div>
            </div>
          )}
          
          {calculation.runwayMonths !== Infinity && calculation.runwayMonths >= 6 && calculation.runwayMonths < 12 && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-950 flex gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-bold">Intermediate Runway Notice (6-12 Months):</p>
                <p className="mt-0.5">You have a healthy cushion, but you should monitor accounts receivables to prevent working capital squeezes. Start identifying additional organic growth hacks.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
