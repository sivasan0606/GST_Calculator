/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Percent, Clipboard, Check, RotateCcw, HelpCircle, FileText, Sparkles, Printer, Home, Info, Calculator } from 'lucide-react';

export default function HraCalculator() {
  // Frequency Toggle
  const [frequency, setFrequency] = useState<'monthly' | 'annually'>('monthly');

  // Inputs (based on current frequency)
  const [basicSalaryInput, setBasicSalaryInput] = useState<string>('50000');
  const [daInput, setDaInput] = useState<string>('0');
  const [hraInput, setHraInput] = useState<string>('20000');
  const [rentInput, setRentInput] = useState<string>('18000');
  const [isMetro, setIsMetro] = useState<boolean>(true);

  // Outputs
  const [copied, setCopied] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    calculateHra();
  }, [frequency, basicSalaryInput, daInput, hraInput, rentInput, isMetro]);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const calculateHra = () => {
    const scale = 1; // All calculations will be presented in the selected frequency, but let's calculate both
    const basic = parseFloat(basicSalaryInput) || 0;
    const da = parseFloat(daInput) || 0;
    const hraReceived = parseFloat(hraInput) || 0;
    const rentPaid = parseFloat(rentInput) || 0;

    const salaryForHra = basic + da;

    // Rule 1: Actual HRA Received
    const rule1 = hraReceived;

    // Rule 2: Rent Paid - 10% of Salary
    const tenPercentSalary = salaryForHra * 0.10;
    const rule2 = Math.max(0, rentPaid - tenPercentSalary);

    // Rule 3: 50% of Salary (Metro) or 40% (Non-metro)
    const metroPercent = isMetro ? 0.50 : 0.40;
    const rule3 = salaryForHra * metroPercent;

    // Exemption is the minimum of the three rules
    const exemptHra = Math.min(rule1, rule2, rule3);
    const taxableHra = Math.max(0, hraReceived - exemptHra);

    // Identify which rule is the bottleneck
    let bottleneckRule = 1;
    if (exemptHra === rule2) bottleneckRule = 2;
    else if (exemptHra === rule3) bottleneckRule = 3;

    setCalculation({
      basic,
      da,
      hraReceived,
      rentPaid,
      salaryForHra,
      tenPercentSalary,
      rule1,
      rule2,
      rule3,
      exemptHra,
      taxableHra,
      bottleneckRule,
      isMetro,
      frequency
    });
  };

  const copyBreakdown = () => {
    if (!calculation) return;
    const freqLabel = calculation.frequency === 'monthly' ? 'Monthly' : 'Annual';
    const text = `--- HRA TAX EXEMPTION REPORT (Section 10(13A)) ---
Calculation Frequency: ${freqLabel}
Basic Salary: ${formatCurrency(calculation.basic)}
Dearness Allowance (DA): ${formatCurrency(calculation.da)}
HRA Received: ${formatCurrency(calculation.hraReceived)}
Actual Rent Paid: ${formatCurrency(calculation.rentPaid)}
Living in Metro City: ${calculation.isMetro ? 'Yes' : 'No'}

--- THE THREE TAX CLAUSES ---
1. Actual HRA Received: ${formatCurrency(calculation.rule1)}
2. Rent Paid minus 10% of Salary: ${formatCurrency(calculation.rule2)} (Salary 10%: ${formatCurrency(calculation.tenPercentSalary)})
3. ${calculation.isMetro ? '50%' : '40%'} of Salary (Metro limit): ${formatCurrency(calculation.rule3)}

--- FINAL DETERMINATION ---
Exempt House Rent Allowance: ${formatCurrency(calculation.exemptHra)} (Fully Tax-Exempt)
Taxable House Rent Allowance: ${formatCurrency(calculation.taxableHra)} (Added to Taxable Income)
---------------------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  const handleFrequencyChange = (newFreq: 'monthly' | 'annually') => {
    if (newFreq === frequency) return;
    setFrequency(newFreq);

    // Convert values to avoid frustrating reset
    if (newFreq === 'annually') {
      setBasicSalaryInput((parseFloat(basicSalaryInput) * 12).toString());
      setDaInput((parseFloat(daInput) * 12).toString());
      setHraInput((parseFloat(hraInput) * 12).toString());
      setRentInput((parseFloat(rentInput) * 12).toString());
    } else {
      setBasicSalaryInput((parseFloat(basicSalaryInput) / 12).toFixed(0));
      setDaInput((parseFloat(daInput) / 12).toFixed(0));
      setHraInput((parseFloat(hraInput) / 12).toFixed(0));
      setRentInput((parseFloat(rentInput) / 12).toFixed(0));
    }
  };

  const resetInputs = () => {
    if (frequency === 'monthly') {
      setBasicSalaryInput('50000');
      setDaInput('0');
      setHraInput('20000');
      setRentInput('18000');
    } else {
      setBasicSalaryInput('600000');
      setDaInput('0');
      setHraInput('240000');
      setRentInput('216000');
    }
    setIsMetro(true);
  };

  if (!calculation) return null;

  const freqSuffix = frequency === 'monthly' ? '/month' : '/year';

  return (
    <div id="hra-calculator" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-xs max-w-4xl mx-auto font-sans">
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-600" size={22} />
          <h3 className="font-display font-bold text-slate-800 text-lg">HRA Exemption Calculator (Sec 10(13A))</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Monthly / Annual Toggle */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg mr-2">
            <button
              onClick={() => handleFrequencyChange('monthly')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                frequency === 'monthly'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleFrequencyChange('annually')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                frequency === 'annually'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Annual
            </button>
          </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Parameters (Left) */}
        <div className="space-y-4 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Home size={14} className="text-slate-500" />
            Salary & Rental Details
          </h4>

          {/* Basic Salary */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
              <span>Basic Salary</span>
              <span className="text-indigo-600 font-bold">{formatCurrency(calculation.basic)}{freqSuffix}</span>
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 text-sm">₹</span>
              </div>
              <input
                type="number"
                value={basicSalaryInput}
                onChange={(e) => setBasicSalaryInput(e.target.value)}
                className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-1.5 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Dearness Allowance (DA) */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
              <span>Dearness Allowance (DA) - if any</span>
              <span className="text-slate-500 font-bold">{formatCurrency(calculation.da)}{freqSuffix}</span>
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 text-sm">₹</span>
              </div>
              <input
                type="number"
                value={daInput}
                onChange={(e) => setDaInput(e.target.value)}
                className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-1.5 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* HRA Received */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
              <span>HRA Received from Employer</span>
              <span className="text-indigo-600 font-bold">{formatCurrency(calculation.hraReceived)}{freqSuffix}</span>
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 text-sm">₹</span>
              </div>
              <input
                type="number"
                value={hraInput}
                onChange={(e) => setHraInput(e.target.value)}
                className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-1.5 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Rent Paid */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1 flex justify-between">
              <span>Actual Rent Paid to Landlord</span>
              <span className="text-indigo-600 font-bold">{formatCurrency(calculation.rentPaid)}{freqSuffix}</span>
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 text-sm">₹</span>
              </div>
              <input
                type="number"
                value={rentInput}
                onChange={(e) => setRentInput(e.target.value)}
                className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-1.5 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Metro Toggle */}
          <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
            <div>
              <span className="block text-xs sm:text-sm font-semibold text-slate-700">Resident of Metro City?</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Delhi, Mumbai, Kolkata, Chennai (50% salary slab vs 40% non-metro)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsMetro(!isMetro)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isMetro ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isMetro ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Exemption Output Details (Right) */}
        <div className="space-y-6">
          <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-sm">
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase bg-indigo-950/80 px-2 py-0.5 rounded-md">TAX EXEMPTION SUMMARY</span>
            
            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Exempt HRA Amount:</span>
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-md mt-0.5 inline-block">100% Tax-Free Exemption</span>
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">{formatCurrency(calculation.exemptHra)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-slate-900 pb-3">
              <div>
                <span className="text-xs text-slate-400 block">Taxable HRA Amount:</span>
                <span className="text-[10px] text-rose-400 font-semibold bg-rose-950 px-2 py-0.5 rounded-md mt-0.5 inline-block">Added to Gross Income</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-rose-400 tracking-tight">{formatCurrency(calculation.taxableHra)}</span>
            </div>

            {/* Visual clause meter */}
            <div className="space-y-3.5 pt-2">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Three Exemption Clauses (Lowest is Exempt):</span>
              
              <div className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                calculation.bottleneckRule === 1 
                  ? 'border-emerald-600 bg-emerald-950/20 text-slate-100 font-medium' 
                  : 'border-slate-800 text-slate-400'
              }`}>
                <span>1. Actual HRA Received</span>
                <span className="font-semibold">{formatCurrency(calculation.rule1)}</span>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                calculation.bottleneckRule === 2 
                  ? 'border-emerald-600 bg-emerald-950/20 text-slate-100 font-medium' 
                  : 'border-slate-800 text-slate-400'
              }`}>
                <div>
                  <span className="block">2. Rent Paid minus 10% of Salary</span>
                  <span className="block text-[10px] opacity-75 mt-0.5">(Salary 10% was {formatCurrency(calculation.tenPercentSalary)})</span>
                </div>
                <span className="font-semibold">{formatCurrency(calculation.rule2)}</span>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex justify-between items-center ${
                calculation.bottleneckRule === 3 
                  ? 'border-emerald-600 bg-emerald-950/20 text-slate-100 font-medium' 
                  : 'border-slate-800 text-slate-400'
              }`}>
                <span>3. {isMetro ? '50%' : '40%'} of Salary ({isMetro ? 'Metro' : 'Non-metro'} cap)</span>
                <span className="font-semibold">{formatCurrency(calculation.rule3)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs text-amber-900 flex gap-2">
            <Info size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="font-bold">Important HRA Exemption Note:</p>
              <p className="mt-0.5">Under Section 10(13A), HRA is tax-exempt based on the basic salary + DA (Dearness Allowance). If rent paid is less than 10% of your salary, no HRA is tax-exempt, resulting in the entire HRA allowance being fully taxable.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
