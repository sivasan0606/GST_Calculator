/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Percent, Clipboard, Check, RotateCcw, HelpCircle, FileText, Download, TrendingUp, Info, Printer, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function IncomeTaxCalculator() {
  // Inputs
  const [grossIncomeInput, setGrossIncomeInput] = useState<string>('1200000');
  const [isSalaried, setIsSalaried] = useState<boolean>(true);
  const [otherIncomeInput, setOtherIncomeInput] = useState<string>('0');
  
  // Deductions (Old Regime)
  const [sec80CInput, setSec80CInput] = useState<string>('150000');
  const [sec80DInput, setSec80DInput] = useState<string>('25000');
  const [sec24bInput, setSec24bInput] = useState<string>('0');
  const [hraExemptionInput, setHraExemptionInput] = useState<string>('0');
  const [sec80CCDInput, setSec80CCDInput] = useState<string>('0');
  const [otherDeductionsInput, setOtherDeductionsInput] = useState<string>('0');

  // Outputs
  const [oldCalculations, setOldCalculations] = useState<any>(null);
  const [newCalculations, setNewCalculations] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    calculateTaxes();
  }, [
    grossIncomeInput,
    isSalaried,
    otherIncomeInput,
    sec80CInput,
    sec80DInput,
    sec24bInput,
    hraExemptionInput,
    sec80CCDInput,
    otherDeductionsInput
  ]);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const calculateTaxes = () => {
    const grossIncome = parseFloat(grossIncomeInput) || 0;
    const otherIncome = parseFloat(otherIncomeInput) || 0;
    const totalGross = grossIncome + otherIncome;

    // Deductions inputs
    const sec80C = Math.min(150000, parseFloat(sec80CInput) || 0); // Capped at 1.5L
    const sec80D = Math.min(50000, parseFloat(sec80DInput) || 0);  // Capped at 50k (usually 25k for self, 50k for senior)
    const sec24b = Math.min(200000, parseFloat(sec24bInput) || 0); // Capped at 2L for self-occupied
    const hraExemption = parseFloat(hraExemptionInput) || 0;
    const sec80CCD = Math.min(50000, parseFloat(sec80CCDInput) || 0); // Capped at 50k under 80CCD(1B)
    const otherDeductions = parseFloat(otherDeductionsInput) || 0;

    // 1. OLD REGIME CALCULATION
    const oldStandardDeduction = isSalaried ? 50000 : 0;
    const totalOldDeductions = oldStandardDeduction + sec80C + sec80D + sec24b + hraExemption + sec80CCD + otherDeductions;
    const netTaxableIncomeOld = Math.max(0, totalGross - totalOldDeductions);

    let oldTaxBase = 0;
    const oldSlabsBreakdown: any[] = [];

    // Old Regime slabs (for general individuals):
    // 0 to 2.5L: Nil
    // 2.5L to 5L: 5%
    // 5L to 10L: 20%
    // Above 10L: 30%
    if (netTaxableIncomeOld > 250000) {
      const slab1 = Math.min(250000, netTaxableIncomeOld - 250000);
      const tax1 = slab1 * 0.05;
      oldTaxBase += tax1;
      oldSlabsBreakdown.push({ range: '₹2.5L - ₹5L', rate: '5%', slabIncome: slab1, tax: tax1 });
    }
    if (netTaxableIncomeOld > 500000) {
      const slab2 = Math.min(500000, netTaxableIncomeOld - 500000);
      const tax2 = slab2 * 0.20;
      oldTaxBase += tax2;
      oldSlabsBreakdown.push({ range: '₹5L - ₹10L', rate: '20%', slabIncome: slab2, tax: tax2 });
    }
    if (netTaxableIncomeOld > 1000000) {
      const slab3 = netTaxableIncomeOld - 1000000;
      const tax3 = slab3 * 0.30;
      oldTaxBase += tax3;
      oldSlabsBreakdown.push({ range: 'Above ₹10L', rate: '30%', slabIncome: slab3, tax: tax3 });
    }

    // Section 87A rebate for Old Regime: Up to 100% of tax if taxable income is <= 5,00,000 (Max rebate ₹12,500)
    let oldRebate = 0;
    if (netTaxableIncomeOld <= 500000) {
      oldRebate = oldTaxBase;
    }
    
    const oldTaxAfterRebate = Math.max(0, oldTaxBase - oldRebate);
    const oldCess = oldTaxAfterRebate * 0.04;
    const totalOldTax = oldTaxAfterRebate + oldCess;


    // 2. NEW REGIME CALCULATION (FY 2025-26 / Budget 2024 slabs)
    // Slabs:
    // 0 to 3L: Nil
    // 3L to 7L: 5%
    // 7L to 10L: 10%
    // 10L to 12L: 15%
    // 12L to 15L: 20%
    // Above 15L: 30%
    const newStandardDeduction = isSalaried ? 75000 : 0;
    const totalNewDeductions = newStandardDeduction;
    const netTaxableIncomeNew = Math.max(0, totalGross - totalNewDeductions);

    let newTaxBase = 0;
    const newSlabsBreakdown: any[] = [];

    if (netTaxableIncomeNew > 300000) {
      const slab1 = Math.min(400000, netTaxableIncomeNew - 300000); // 3L to 7L
      const tax1 = slab1 * 0.05;
      newTaxBase += tax1;
      newSlabsBreakdown.push({ range: '₹3L - ₹7L', rate: '5%', slabIncome: slab1, tax: tax1 });
    }
    if (netTaxableIncomeNew > 700000) {
      const slab2 = Math.min(300000, netTaxableIncomeNew - 700000); // 7L to 10L
      const tax2 = slab2 * 0.10;
      newTaxBase += tax2;
      newSlabsBreakdown.push({ range: '₹7L - ₹10L', rate: '10%', slabIncome: slab2, tax: tax2 });
    }
    if (netTaxableIncomeNew > 1000000) {
      const slab3 = Math.min(200000, netTaxableIncomeNew - 1000000); // 10L to 12L
      const tax3 = slab3 * 0.15;
      newTaxBase += tax3;
      newSlabsBreakdown.push({ range: '₹10L - ₹12L', rate: '15%', slabIncome: slab3, tax: tax3 });
    }
    if (netTaxableIncomeNew > 1200000) {
      const slab4 = Math.min(300000, netTaxableIncomeNew - 1200000); // 12L to 15L
      const tax4 = slab4 * 0.20;
      newTaxBase += tax4;
      newSlabsBreakdown.push({ range: '₹12L - ₹15L', rate: '20%', slabIncome: slab4, tax: tax4 });
    }
    if (netTaxableIncomeNew > 1500000) {
      const slab5 = netTaxableIncomeNew - 1500000; // Above 15L
      const tax5 = slab5 * 0.30;
      newTaxBase += tax5;
      newSlabsBreakdown.push({ range: 'Above ₹15L', rate: '30%', slabIncome: slab5, tax: tax5 });
    }

    // Section 87A rebate for New Regime:
    // Taxable income <= ₹7,00,000 gets 100% tax rebate (Max rebate ₹20,000).
    // Note: Standard deduction is ₹75,000, meaning a salaried professional with a Gross of ₹7.75L pays zero tax!
    let newRebate = 0;
    if (netTaxableIncomeNew <= 700000) {
      newRebate = newTaxBase;
    }

    const newTaxAfterRebate = Math.max(0, newTaxBase - newRebate);
    const newCess = newTaxAfterRebate * 0.04;
    const totalNewTax = newTaxAfterRebate + newCess;

    setOldCalculations({
      grossIncome: totalGross,
      standardDeduction: oldStandardDeduction,
      otherDeductions: totalOldDeductions - oldStandardDeduction,
      totalDeductions: totalOldDeductions,
      taxableIncome: netTaxableIncomeOld,
      baseTax: oldTaxBase,
      rebate: oldRebate,
      cess: oldCess,
      totalTax: Math.round(totalOldTax),
      slabs: oldSlabsBreakdown
    });

    setNewCalculations({
      grossIncome: totalGross,
      standardDeduction: newStandardDeduction,
      otherDeductions: 0,
      totalDeductions: totalNewDeductions,
      taxableIncome: netTaxableIncomeNew,
      baseTax: newTaxBase,
      rebate: newRebate,
      cess: newCess,
      totalTax: Math.round(totalNewTax),
      slabs: newSlabsBreakdown
    });
  };

  const copyBreakdown = () => {
    if (!oldCalculations || !newCalculations) return;
    
    const oldTax = oldCalculations.totalTax;
    const newTax = newCalculations.totalTax;
    const recommended = oldTax < newTax ? 'Old Regime' : 'New Regime';
    const difference = Math.abs(oldTax - newTax);

    const text = `--- INCOME TAX COMPARISON REPORT ---
Gross Annual Income: ${formatCurrency(oldCalculations.grossIncome)}
Salaried Employee: ${isSalaried ? 'Yes' : 'No'}

[OLD TAX REGIME]
Total Deductions Claimed: ${formatCurrency(oldCalculations.totalDeductions)}
Net Taxable Income: ${formatCurrency(oldCalculations.taxableIncome)}
Estimated Income Tax: ${formatCurrency(oldCalculations.totalTax)}

[NEW TAX REGIME]
Total Deductions Claimed: ${formatCurrency(newCalculations.totalDeductions)}
Net Taxable Income: ${formatCurrency(newCalculations.taxableIncome)}
Estimated Income Tax: ${formatCurrency(newCalculations.totalTax)}

[RECOMMENDATION]
Recommended choice: ${recommended}
Tax Savings: ${formatCurrency(difference)}
-------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  const resetInputs = () => {
    setGrossIncomeInput('1200000');
    setIsSalaried(true);
    setOtherIncomeInput('0');
    setSec80CInput('150000');
    setSec80DInput('25000');
    setSec24bInput('0');
    setHraExemptionInput('0');
    setSec80CCDInput('0');
    setOtherDeductionsInput('0');
  };

  if (!oldCalculations || !newCalculations) return null;

  const taxDiff = oldCalculations.totalTax - newCalculations.totalTax;
  const isNewBetter = taxDiff > 0;
  const recommendedRegime = taxDiff === 0 ? 'Equally Beneficial' : (isNewBetter ? 'New Regime' : 'Old Regime');
  const savings = Math.abs(taxDiff);

  return (
    <div id="income-tax-calculator" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-xs max-w-5xl mx-auto font-sans">
      {/* Upper header action toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-600" size={22} />
          <h3 className="font-display font-bold text-slate-800 text-lg">New vs. Old Income Tax Regime Calculator</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyBreakdown}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input parameters panel (Left) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-5">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp size={14} className="text-slate-500" />
              Primary Income Details
            </h4>
            
            {/* Gross Salary */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5 flex justify-between">
                <span>Gross Annual Salary / Income</span>
                <span className="text-indigo-600 font-bold">{formatCurrency(parseFloat(grossIncomeInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  value={grossIncomeInput}
                  onChange={(e) => setGrossIncomeInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 1200000"
                />
              </div>
            </div>

            {/* Other Source Income */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5 flex justify-between">
                <span>Income from Other Sources (Interest, Dividends)</span>
                <span className="text-slate-500 font-bold">{formatCurrency(parseFloat(otherIncomeInput) || 0)}</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-sm">₹</span>
                </div>
                <input
                  type="number"
                  value={otherIncomeInput}
                  onChange={(e) => setOtherIncomeInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 50000"
                />
              </div>
            </div>

            {/* Salaried Checkbox Toggle */}
            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
              <div>
                <span className="block text-xs sm:text-sm font-semibold text-slate-700">Are you a Salaried Employee?</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Applies standard deduction automatically (₹75K New vs ₹50K Old)</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSalaried(!isSalaried)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isSalaried ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isSalaried ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Deductions panel for Old Regime */}
          <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} className="text-slate-500" />
              Old Regime Deductions (Section 80)
            </h4>

            {/* Sec 80C */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>Section 80C (EPF, LIC, PPF, ELSS)</span>
                <span className="text-slate-500 text-xs">Max ₹1.5 Lakhs</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={sec80CInput}
                  onChange={(e) => setSec80CInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-7 pr-3 py-1.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Sec 80D */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>Section 80D (Health Insurance Premium)</span>
                <span className="text-slate-500 text-xs">Max ₹50,000</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={sec80DInput}
                  onChange={(e) => setSec80DInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-7 pr-3 py-1.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Sec 24b */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>Home Loan Interest (Section 24b)</span>
                <span className="text-slate-500 text-xs">Max ₹2 Lakhs</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={sec24bInput}
                  onChange={(e) => setSec24bInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-7 pr-3 py-1.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* HRA Exemption */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>HRA Tax Exemption Amount</span>
                <span className="text-indigo-600 text-[10px] hover:underline cursor-pointer font-medium" onClick={() => {
                  const el = document.getElementById('hra-calculator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>Go to HRA Calculator</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={hraExemptionInput}
                  onChange={(e) => setHraExemptionInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-7 pr-3 py-1.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 150000"
                />
              </div>
            </div>

            {/* Sec 80CCD */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
                <span>National Pension Scheme (80CCD(1B))</span>
                <span className="text-slate-500 text-xs">Max ₹50,000</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={sec80CCDInput}
                  onChange={(e) => setSec80CCDInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-7 pr-3 py-1.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Other Deductions */}
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1">
                <span>Other Deductions (80G, 80E, 80TTA, etc.)</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-slate-400 text-xs">₹</span>
                </div>
                <input
                  type="number"
                  value={otherDeductionsInput}
                  onChange={(e) => setOtherDeductionsInput(e.target.value)}
                  className="block w-full rounded-lg border-slate-200 border pl-7 pr-3 py-1.5 text-slate-900 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Dashboard (Right) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick recommendations panel */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/5 border border-indigo-100 rounded-2xl p-5 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">REGIME RECOMMENDATION</span>
              <h4 className="text-slate-800 font-bold text-lg">
                Choose the <span className="text-indigo-600">{recommendedRegime}</span>
              </h4>
              <p className="text-slate-600 text-xs">
                {savings > 0 
                  ? `You will save approximately ${formatCurrency(savings)} per year in income tax by choosing the ${recommendedRegime}.`
                  : 'Both regimes result in the exact same tax liability.'}
              </p>
            </div>
            {savings > 0 && (
              <div className="bg-white px-4 py-3 rounded-xl border border-indigo-50 shadow-xs flex flex-col items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">YOU SAVE</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{formatCurrency(savings)}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Old Regime Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              !isNewBetter && savings > 0 
                ? 'border-indigo-500 bg-indigo-500/[0.02] shadow-sm ring-1 ring-indigo-500' 
                : 'border-slate-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-slate-800 text-md">Old Tax Regime</h4>
                {!isNewBetter && savings > 0 && (
                  <span className="bg-indigo-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                )}
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Gross Income:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(oldCalculations.grossIncome)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Standard Deduction:</span>
                  <span className="font-semibold text-slate-800">-{formatCurrency(oldCalculations.standardDeduction)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Other Deductions:</span>
                  <span className="font-semibold text-slate-800">-{formatCurrency(oldCalculations.otherDeductions)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-700">Net Taxable Income:</span>
                  <span className="text-slate-900">{formatCurrency(oldCalculations.taxableIncome)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Calculated Slab Tax:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(oldCalculations.baseTax)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tax Rebate (87A):</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(oldCalculations.rebate)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Health/Edu Cess (4%):</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(oldCalculations.cess)}</span>
                </div>
                <div className="flex justify-between pt-3 font-display font-black text-md">
                  <span className="text-slate-800">Total Tax Payable:</span>
                  <span className="text-slate-900">{formatCurrency(oldCalculations.totalTax)}</span>
                </div>
              </div>

              {/* Slabs breakdown details */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tax Slab Details</span>
                {oldCalculations.slabs.length === 0 ? (
                  <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md block text-center">No Slab Taxes Due (Fully Exempt)</span>
                ) : (
                  oldCalculations.slabs.map((slab: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                      <span>{slab.range} ({slab.rate} of {formatCurrency(slab.slabIncome)})</span>
                      <span className="font-semibold">{formatCurrency(slab.tax)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* New Regime Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              isNewBetter && savings > 0 
                ? 'border-indigo-500 bg-indigo-500/[0.02] shadow-sm ring-1 ring-indigo-500' 
                : 'border-slate-200 bg-white'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-display font-bold text-slate-800 text-md">New Tax Regime</h4>
                {isNewBetter && savings > 0 && (
                  <span className="bg-indigo-600 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                )}
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Gross Income:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(newCalculations.grossIncome)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Standard Deduction:</span>
                  <span className="font-semibold text-slate-800">-{formatCurrency(newCalculations.standardDeduction)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Other Deductions:</span>
                  <span className="font-semibold text-slate-800">-{formatCurrency(newCalculations.otherDeductions)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                  <span className="text-slate-700">Net Taxable Income:</span>
                  <span className="text-slate-900">{formatCurrency(newCalculations.taxableIncome)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Calculated Slab Tax:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(newCalculations.baseTax)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Tax Rebate (87A):</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(newCalculations.rebate)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Health/Edu Cess (4%):</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(newCalculations.cess)}</span>
                </div>
                <div className="flex justify-between pt-3 font-display font-black text-md">
                  <span className="text-slate-800">Total Tax Payable:</span>
                  <span className="text-slate-900">{formatCurrency(newCalculations.totalTax)}</span>
                </div>
              </div>

              {/* Slabs breakdown details */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tax Slab Details</span>
                {newCalculations.slabs.length === 0 ? (
                  <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md block text-center">No Slab Taxes Due (Fully Exempt)</span>
                ) : (
                  newCalculations.slabs.map((slab: any, idx: number) => (
                    <div key={idx} className="flex justify-between text-[11px] text-slate-600">
                      <span>{slab.range} ({slab.rate} of {formatCurrency(slab.slabIncome)})</span>
                      <span className="font-semibold">{formatCurrency(slab.tax)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-900 flex gap-2">
            <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-semibold">Important Tax Note (FY 2025-26):</p>
              <p className="mt-0.5">The New regime standard deduction is now ₹75,000 for salaried employees. Under Section 87A, individual tax rebate is complete for taxable income up to ₹7 Lakhs, which means salaried employees with up to ₹7.75 Lakhs taxable income pay zero tax.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
