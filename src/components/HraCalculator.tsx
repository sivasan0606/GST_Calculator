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
    const basic = parseFloat(basicSalaryInput) || 0;
    const da = parseFloat(daInput) || 0;
    const hraReceived = parseFloat(hraInput) || 0;
    const rentPaid = parseFloat(rentInput) || 0;

    // We can define monthly and annual variables
    let basicM = 0, daM = 0, hraM = 0, rentM = 0;
    let basicA = 0, daA = 0, hraA = 0, rentA = 0;

    if (frequency === 'monthly') {
      basicM = basic; daM = da; hraM = hraReceived; rentM = rentPaid;
      basicA = basic * 12; daA = da * 12; hraA = hraReceived * 12; rentA = rentPaid * 12;
    } else {
      basicA = basic; daA = da; hraA = hraReceived; rentA = rentPaid;
      basicM = basic / 12; daM = da / 12; hraM = hraReceived / 12; rentM = rentPaid / 12;
    }

    // Calculations for Monthly
    const salaryForHraM = basicM + daM;
    const rule1_M = hraM;
    const tenPercentSalaryM = salaryForHraM * 0.10;
    const rule2_M = Math.max(0, rentM - tenPercentSalaryM);
    const metroPercent = isMetro ? 0.50 : 0.40;
    const rule3_M = salaryForHraM * metroPercent;
    const exemptHraM = Math.min(rule1_M, rule2_M, rule3_M);
    const taxableHraM = Math.max(0, hraM - exemptHraM);

    // Calculations for Annually
    const salaryForHraA = basicA + daA;
    const rule1_A = hraA;
    const tenPercentSalaryA = salaryForHraA * 0.10;
    const rule2_A = Math.max(0, rentA - tenPercentSalaryA);
    const rule3_A = salaryForHraA * metroPercent;
    const exemptHraA = Math.min(rule1_A, rule2_A, rule3_A);
    const taxableHraA = Math.max(0, hraA - exemptHraA);

    // Identify which rule is the bottleneck
    let bottleneckRule = 1;
    if (exemptHraM === rule2_M) bottleneckRule = 2;
    else if (exemptHraM === rule3_M) bottleneckRule = 3;

    setCalculation({
      basic,
      da,
      hraReceived,
      rentPaid,
      frequency,
      isMetro,
      monthly: {
        basic: basicM,
        da: daM,
        hraReceived: hraM,
        rentPaid: rentM,
        salaryForHra: salaryForHraM,
        tenPercentSalary: tenPercentSalaryM,
        rule1: rule1_M,
        rule2: rule2_M,
        rule3: rule3_M,
        exemptHra: exemptHraM,
        taxableHra: taxableHraM,
      },
      annually: {
        basic: basicA,
        da: daA,
        hraReceived: hraA,
        rentPaid: rentA,
        salaryForHra: salaryForHraA,
        tenPercentSalary: tenPercentSalaryA,
        rule1: rule1_A,
        rule2: rule2_A,
        rule3: rule3_A,
        exemptHra: exemptHraA,
        taxableHra: taxableHraA,
      },
      bottleneckRule
    });
  };

  const copyBreakdown = () => {
    if (!calculation) return;
    const text = `--- HRA TAX EXEMPTION REPORT (Section 10(13A)) ---
Living in Metro City: ${calculation.isMetro ? 'Yes' : 'No'}

--- MONTHLY BREAKDOWN ---
Basic Salary: ${formatCurrency(calculation.monthly.basic)}
Dearness Allowance (DA): ${formatCurrency(calculation.monthly.da)}
HRA Received: ${formatCurrency(calculation.monthly.hraReceived)}
Actual Rent Paid: ${formatCurrency(calculation.monthly.rentPaid)}
- Exempt House Rent Allowance: ${formatCurrency(calculation.monthly.exemptHra)} (Fully Tax-Exempt)
- Taxable House Rent Allowance: ${formatCurrency(calculation.monthly.taxableHra)} (Added to Taxable Income)

--- ANNUAL BREAKDOWN ---
Basic Salary: ${formatCurrency(calculation.annually.basic)}
Dearness Allowance (DA): ${formatCurrency(calculation.annually.da)}
HRA Received: ${formatCurrency(calculation.annually.hraReceived)}
Actual Rent Paid: ${formatCurrency(calculation.annually.rentPaid)}
- Exempt House Rent Allowance: ${formatCurrency(calculation.annually.exemptHra)} (Fully Tax-Exempt)
- Taxable House Rent Allowance: ${formatCurrency(calculation.annually.taxableHra)} (Added to Taxable Income)

--- THE THREE TAX CLAUSES (Comparison) ---
1. Actual HRA Received:
   Monthly: ${formatCurrency(calculation.monthly.rule1)} | Annual: ${formatCurrency(calculation.annually.rule1)}
2. Rent Paid minus 10% of Salary:
   Monthly: ${formatCurrency(calculation.monthly.rule2)} | Annual: ${formatCurrency(calculation.annually.rule2)}
3. ${calculation.isMetro ? '50%' : '40%'} of Salary (Metro limit):
   Monthly: ${formatCurrency(calculation.monthly.rule3)} | Annual: ${formatCurrency(calculation.annually.rule3)}

* Bottleneck rule active: Clause #${calculation.bottleneckRule}
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
          <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-5 shadow-sm">
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase bg-indigo-950/80 px-2.5 py-1 rounded-md">TAX EXEMPTION SUMMARY</span>
            
            {/* Side-by-Side Monthly and Annually Cards */}
            <div className="grid grid-cols-2 gap-4 border-b border-slate-900 pb-5">
              {/* Monthly Column */}
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 text-center border-b border-slate-800 pb-1">Monthly Summary</span>
                
                <div className="mb-3 text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 block">Exempt HRA:</span>
                  <span className="text-md sm:text-lg font-black text-emerald-400">{formatCurrency(calculation.monthly.exemptHra)}</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 block">Taxable HRA:</span>
                  <span className="text-sm sm:text-md font-bold text-rose-400">{formatCurrency(calculation.monthly.taxableHra)}</span>
                </div>
              </div>

              {/* Annual Column */}
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-900/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2 text-center border-b border-slate-800 pb-1">Annual Summary</span>
                
                <div className="mb-3 text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 block">Exempt HRA:</span>
                  <span className="text-md sm:text-lg font-black text-emerald-400">{formatCurrency(calculation.annually.exemptHra)}</span>
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] text-slate-400 block">Taxable HRA:</span>
                  <span className="text-sm sm:text-md font-bold text-rose-400">{formatCurrency(calculation.annually.taxableHra)}</span>
                </div>
              </div>
            </div>

            {/* Visual clause meter with side-by-side Monthly/Annual values */}
            <div className="space-y-3.5 pt-1">
              <div className="flex justify-between items-center">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">The Three Clauses (Lowest is Exempt):</span>
                <span className="text-[9px] text-indigo-300 font-medium">Monthly / [Annual]</span>
              </div>
              
              <div className={`p-3 rounded-xl border text-xs flex justify-between items-center gap-2 ${
                calculation.bottleneckRule === 1 
                  ? 'border-emerald-600 bg-emerald-950/20 text-slate-100 font-medium' 
                  : 'border-slate-800 text-slate-400'
              }`}>
                <span>1. Actual HRA Received</span>
                <span className="font-semibold text-right">
                  <span className="text-slate-100">{formatCurrency(calculation.monthly.rule1)}</span>
                  <span className="text-[10px] text-slate-500 ml-1.5 font-normal">[{formatCurrency(calculation.annually.rule1)}]</span>
                </span>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex justify-between items-center gap-2 ${
                calculation.bottleneckRule === 2 
                  ? 'border-emerald-600 bg-emerald-950/20 text-slate-100 font-medium' 
                  : 'border-slate-800 text-slate-400'
              }`}>
                <div>
                  <span className="block">2. Rent Paid minus 10% of Salary</span>
                  <span className="block text-[10px] opacity-75 mt-0.5">
                    (Salary 10% is {formatCurrency(calculation.monthly.tenPercentSalary)} / {formatCurrency(calculation.annually.tenPercentSalary)})
                  </span>
                </div>
                <span className="font-semibold text-right">
                  <span className="text-slate-100">{formatCurrency(calculation.monthly.rule2)}</span>
                  <span className="text-[10px] text-slate-500 ml-1.5 font-normal">[{formatCurrency(calculation.annually.rule2)}]</span>
                </span>
              </div>

              <div className={`p-3 rounded-xl border text-xs flex justify-between items-center gap-2 ${
                calculation.bottleneckRule === 3 
                  ? 'border-emerald-600 bg-emerald-950/20 text-slate-100 font-medium' 
                  : 'border-slate-800 text-slate-400'
              }`}>
                <span>3. {isMetro ? '50%' : '40%'} of Salary ({isMetro ? 'Metro' : 'Non-metro'} limit)</span>
                <span className="font-semibold text-right">
                  <span className="text-slate-100">{formatCurrency(calculation.monthly.rule3)}</span>
                  <span className="text-[10px] text-slate-500 ml-1.5 font-normal">[{formatCurrency(calculation.annually.rule3)}]</span>
                </span>
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
