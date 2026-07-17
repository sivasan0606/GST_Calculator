/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Percent, Clipboard, Check, RotateCcw, HelpCircle, FileText, Download, ShieldAlert, Sparkles, Printer, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function TdsCalculator() {
  // Inputs
  const [baseAmountInput, setBaseAmountInput] = useState<string>('50000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [customGstRate, setCustomGstRate] = useState<string>('15');
  const [tdsType, setTdsType] = useState<'professional' | 'technical' | 'nopan'>('professional');
  const [isThresholdExceeded, setIsThresholdExceeded] = useState<boolean>(true);
  const [isDirectorsRemuneration, setIsDirectorsRemuneration] = useState<boolean>(false);

  // Outputs
  const [copied, setCopied] = useState<boolean>(false);
  const [calculation, setCalculation] = useState<any>(null);

  useEffect(() => {
    calculateTds();
  }, [baseAmountInput, gstRate, customGstRate, tdsType, isThresholdExceeded, isDirectorsRemuneration]);

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateTds = () => {
    const baseAmount = parseFloat(baseAmountInput) || 0;
    const activeGstRate = gstRate === -1 ? parseFloat(customGstRate) || 0 : gstRate;
    const gstAmount = baseAmount * (activeGstRate / 100);
    const totalInvoiceValue = baseAmount + gstAmount;

    // Determine TDS rate
    let activeTdsRate = 10;
    let categoryName = 'Professional Fees / Royalty (Sec 194J)';

    if (isDirectorsRemuneration) {
      activeTdsRate = 10;
      categoryName = "Director's Remuneration";
    } else {
      switch (tdsType) {
        case 'technical':
          activeTdsRate = 2;
          categoryName = 'Technical Services / Call Center (Sec 194J)';
          break;
        case 'nopan':
          activeTdsRate = 20;
          categoryName = 'No PAN Card Provided (Sec 206AA)';
          break;
        case 'professional':
        default:
          activeTdsRate = 10;
          categoryName = 'Professional Fees / Royalty (Sec 194J)';
          break;
      }
    }

    // Apply thresholds
    // Under Sec 194J, threshold limit is ₹30,000 per financial year
    // For Director's remuneration, there is NO threshold limit (TDS applies on any amount)
    const isTdsApplicable = isDirectorsRemuneration || isThresholdExceeded;
    const tdsRateApplied = isTdsApplicable ? activeTdsRate : 0;
    const tdsAmount = baseAmount * (tdsRateApplied / 100); // CBDT: Calculate on base amount excluding GST
    const netPayable = totalInvoiceValue - tdsAmount;

    setCalculation({
      baseAmount,
      gstRate: activeGstRate,
      gstAmount,
      totalInvoiceValue,
      categoryName,
      tdsRateApplied,
      tdsAmount,
      netPayable,
      isTdsApplicable
    });
  };

  const copyBreakdown = () => {
    if (!calculation) return;
    const text = `--- TDS SEC 194J COMPLIANCE REPORT ---
Service Category: ${calculation.categoryName}
Base Invoice Amount (Excl. GST): ${formatCurrency(calculation.baseAmount)}
GST Rate Applied: ${calculation.gstRate}%
GST Component Value: ${formatCurrency(calculation.gstAmount)}
Total Gross Invoice Value: ${formatCurrency(calculation.totalInvoiceValue)}

TDS Rate Applied: ${calculation.tdsRateApplied}%
TDS Tax Deducted: ${formatCurrency(calculation.tdsAmount)}
Net Amount Payable to Vendor: ${formatCurrency(calculation.netPayable)}

*CBDT Circular 23/2017 Note: TDS is strictly calculated on the base service amount excluding GST as the GST component has been shown separately.
---------------------------------------`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReport = () => {
    window.print();
  };

  const resetInputs = () => {
    setBaseAmountInput('50000');
    setGstRate(18);
    setCustomGstRate('15');
    setTdsType('professional');
    setIsThresholdExceeded(true);
    setIsDirectorsRemuneration(false);
  };

  if (!calculation) return null;

  return (
    <div id="tds-calculator" className="bg-white rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-xs max-w-4xl mx-auto font-sans">
      {/* Header tool bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div className="flex items-center gap-2">
          <Calculator className="text-indigo-600" size={22} />
          <h3 className="font-display font-bold text-slate-800 text-lg">TDS Calculator for Professional Fees (Sec 194J)</h3>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Inputs (Left) */}
        <div className="space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
          <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Percent size={14} className="text-slate-500" />
            Invoice Parameters
          </h4>

          {/* Invoice Value */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5 flex justify-between">
              <span>Base Value / professional Fees (Excl. GST)</span>
              <span className="text-indigo-600 font-bold">{formatCurrency(calculation.baseAmount)}</span>
            </label>
            <div className="relative rounded-lg shadow-2xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-slate-400 text-sm">₹</span>
              </div>
              <input
                type="number"
                value={baseAmountInput}
                onChange={(e) => setBaseAmountInput(e.target.value)}
                className="block w-full rounded-lg border-slate-200 border pl-8 pr-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                placeholder="e.g. 50000"
              />
            </div>
          </div>

          {/* GST Slabs */}
          <div>
            <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5">
              GST Rate on Service
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 18, 40].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setGstRate(rate)}
                  className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    gstRate === rate
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rate}%
                </button>
              ))}
              <button
                onClick={() => setGstRate(-1)}
                className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  gstRate === -1
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom GST rate input field */}
            <AnimatePresence>
              {gstRate === -1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="relative rounded-lg shadow-2xs">
                    <input
                      id="tds-gst-custom-rate-input"
                      type="number"
                      value={customGstRate}
                      onChange={(e) => setCustomGstRate(e.target.value)}
                      placeholder="Enter custom GST rate e.g. 15"
                      aria-label="Custom GST Rate Percentage"
                      className="block w-full pr-10 pl-3 py-2 border border-slate-200 rounded-lg font-mono text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Percent size={14} className="text-slate-400" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Service Category */}
          {!isDirectorsRemuneration && (
            <div>
              <label className="block text-slate-700 text-xs sm:text-sm font-semibold mb-1.5">
                Service Category / Payee Status
              </label>
              <select
                value={tdsType}
                onChange={(e: any) => setTdsType(e.target.value)}
                className="block w-full rounded-lg border-slate-200 border bg-white px-3 py-2 text-slate-900 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="professional">Professional Services / Royalty (10% TDS)</option>
                <option value="technical">Technical Services / Call Center (2% TDS)</option>
                <option value="nopan">Payee has NOT provided valid PAN card (20% TDS)</option>
              </select>
            </div>
          )}

          {/* Threshold switch */}
          {!isDirectorsRemuneration && (
            <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
              <div>
                <span className="block text-xs sm:text-sm font-semibold text-slate-700">FY Payments exceeds ₹30,000?</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">Under 194J, TDS applies only if cumulative annual payment is &gt; ₹30K</span>
              </div>
              <button
                type="button"
                onClick={() => setIsThresholdExceeded(!isThresholdExceeded)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isThresholdExceeded ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isThresholdExceeded ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}

          {/* Directors Remuneration switch */}
          <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl">
            <div>
              <span className="block text-xs sm:text-sm font-semibold text-slate-700">Is Director's Remuneration?</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">TDS on Directors has no threshold (TDS applies from ₹1 onwards at 10%)</span>
            </div>
            <button
              type="button"
              onClick={() => setIsDirectorsRemuneration(!isDirectorsRemuneration)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                isDirectorsRemuneration ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  isDirectorsRemuneration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Calculation Outputs (Right) */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 shadow-md">
            <span className="text-[10px] text-indigo-300 font-bold tracking-wider uppercase bg-indigo-900/40 px-2 py-0.5 rounded-md">COMPLIANCE BREAKDOWN</span>
            
            <div className="space-y-1.5 border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 block">Base Professional Fee:</span>
              <span className="text-xl font-bold tracking-tight block">{formatCurrency(calculation.baseAmount)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block mb-0.5">GST Rate Applied:</span>
                <span className="font-semibold">{calculation.gstRate}%</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">GST Component:</span>
                <span className="font-semibold text-slate-100">{formatCurrency(calculation.gstAmount)}</span>
              </div>
            </div>

            <div className="space-y-1.5 border-b border-slate-800 pb-3">
              <span className="text-xs text-slate-400 block">Total Invoice Value (incl. GST):</span>
              <span className="text-md font-semibold text-slate-200">{formatCurrency(calculation.totalInvoiceValue)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">TDS Rate Applied:</span>
                <span className="font-semibold text-amber-400">{calculation.tdsRateApplied}%</span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">TDS Deducted:</span>
                <span className="font-bold text-amber-400">-{formatCurrency(calculation.tdsAmount)}</span>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <span className="text-xs text-slate-400 block">Net Amount Payable to Vendor:</span>
              <span className="text-2xl font-black text-emerald-400 tracking-tight">{formatCurrency(calculation.netPayable)}</span>
            </div>
          </div>

          {/* CBDT compliance tip */}
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 flex gap-2">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-indigo-600" />
            <div>
              <p className="font-bold">CBDT Circular No. 23/2017 Rule:</p>
              <p className="mt-0.5">As per the Central Board of Direct Taxes (CBDT), when the GST component on an invoice is shown separately, tax should be deducted on the basic value excluding GST. Our calculator strictly complies with this standard.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
