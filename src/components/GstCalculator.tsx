/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Percent, Clipboard, Check, RotateCcw, HelpCircle, FileText, Download, Plus, Trash2, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GSTCalculation } from '../types';

interface GstCalculatorProps {
  onHistoryChange: (calc: GSTCalculation) => void;
  savedCalculations: GSTCalculation[];
  onClearHistory: () => void;
}

export default function GstCalculator({
  onHistoryChange,
  savedCalculations,
  onClearHistory
}: GstCalculatorProps) {
  // Input States
  const [amountInput, setAmountInput] = useState<string>('10000');
  const [gstRate, setGstRate] = useState<number>(18);
  const [customRate, setCustomRate] = useState<string>('15');
  const [isAddGst, setIsAddGst] = useState<boolean>(true);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const [labelInput, setLabelInput] = useState<string>('');

  // Helper function to format currency value nicely
  const formatCurrency = (val: number, _unused?: string) => {
    return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Invoice generator States
  const [showInvoiceBuilder, setShowInvoiceBuilder] = useState(false);
  const [clientName, setClientName] = useState('Acme Corp');
  const [itemName, setItemName] = useState('Premium Tax Consultancy');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');

  // Outputs
  const [calculation, setCalculation] = useState<GSTCalculation | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick select GST Slabs (India / general)
  const rateSlabs = [5, 18, 40];

  useEffect(() => {
    calculateGST();
  }, [amountInput, gstRate, customRate, isAddGst, isInterState]);

  const calculateGST = () => {
    const rawAmount = parseFloat(amountInput);
    if (isNaN(rawAmount) || rawAmount <= 0) {
      setCalculation(null);
      return;
    }

    const activeRate = gstRate === -1 ? parseFloat(customRate) || 0 : gstRate;
    
    let originalAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (isAddGst) {
      // Net Amount (exclusive) -> Gross Amount (inclusive)
      originalAmount = rawAmount;
      gstAmount = originalAmount * (activeRate / 100);
      totalAmount = originalAmount + gstAmount;
    } else {
      // Gross Amount (inclusive) -> Net Amount (exclusive)
      totalAmount = rawAmount;
      originalAmount = totalAmount / (1 + (activeRate / 100));
      gstAmount = totalAmount - originalAmount;
    }

    // Split CGST and SGST if Intra-State (50/50)
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstAmount = gstAmount;
    } else {
      cgstAmount = gstAmount / 2;
      sgstAmount = gstAmount / 2;
    }

    setCalculation({
      amount: rawAmount,
      gstRate: activeRate,
      isAddGst,
      isInterState,
      originalAmount: Math.round(originalAmount * 100) / 100,
      gstAmount: Math.round(gstAmount * 100) / 100,
      cgstAmount: Math.round(cgstAmount * 100) / 100,
      sgstAmount: Math.round(sgstAmount * 100) / 100,
      igstAmount: Math.round(igstAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      timestamp: Date.now(),
      label: labelInput.trim() || undefined
    });
  };

  const handleSaveToHistory = () => {
    if (!calculation) return;
    onHistoryChange({
      ...calculation,
      timestamp: Date.now(),
      label: labelInput.trim() || `Calc - ₹${calculation.amount}`
    });
    setLabelInput('');
  };

  const handleCopyToClipboard = () => {
    if (!calculation) return;
    const rateText = `${calculation.gstRate}%`;
    const gstType = calculation.isAddGst ? 'Exclusive (Add GST)' : 'Inclusive (Remove GST)';
    const routeText = calculation.isInterState ? 'Inter-State (IGST)' : 'Intra-State (CGST + SGST)';

    const text = `--- GST Calculation Breakdown ---
Base Amount: ₹${calculation.amount} (${gstType})
GST Rate: ${rateText} (${routeText})
---------------------------------
Net Amount (Pre-Tax): ₹${calculation.originalAmount.toFixed(2)}
Total GST Component: ₹${calculation.gstAmount.toFixed(2)}
${calculation.isInterState ? `IGST (Integrated): ₹${calculation.igstAmount.toFixed(2)}` : `CGST (Central 50%): ₹${calculation.cgstAmount.toFixed(2)}\nSGST (State 50%): ₹${calculation.sgstAmount.toFixed(2)}`}
---------------------------------
Total Amount (Post-Tax): ₹${calculation.totalAmount.toFixed(2)}
Calculated on Free GST Calculator Hub`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistoryItem = (item: GSTCalculation) => {
    setAmountInput(item.amount.toString());
    setGstRate(rateSlabs.includes(item.gstRate) ? item.gstRate : -1);
    if (!rateSlabs.includes(item.gstRate)) {
      setCustomRate(item.gstRate.toString());
    }
    setIsAddGst(item.isAddGst);
    setIsInterState(item.isInterState);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
      {/* Left Column: Calculator Inputs & Interactive Knobs */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        {/* Header Toggle tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setIsAddGst(true)}
            className={`flex-1 text-center font-display text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-all ${
              isAddGst
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Add GST (Exclusive)
          </button>
          <button
            onClick={() => setIsAddGst(false)}
            className={`flex-1 text-center font-display text-xs sm:text-sm font-semibold py-2.5 rounded-lg transition-all ${
              !isAddGst
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            Remove GST (Inclusive)
          </button>
        </div>

        {/* Inputs Form */}
        <div className="space-y-5">
          {/* Amount input */}
          <div>
            <label htmlFor="gst-amount-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              {isAddGst ? 'Net Amount (Pre-Tax Price)' : 'Total Amount (Inclusive Price)'}
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-display font-medium text-base">₹</span>
              </div>
              <input
                id="gst-amount-input"
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="E.g. 50,000"
                className="block w-full pl-9 pr-4 py-3 border border-slate-200 rounded-xl font-display font-semibold text-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* GST Slabs selectors */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              GST Tax Rate (Standard slabs)
            </label>
            <div className="grid grid-cols-5 gap-2">
              {rateSlabs.map((slab) => (
                <button
                  key={slab}
                  onClick={() => setGstRate(slab)}
                  className={`py-3 rounded-xl border font-mono text-xs sm:text-sm font-bold transition-all ${
                    gstRate === slab
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {slab}%
                </button>
              ))}
              <button
                onClick={() => setGstRate(-1)}
                className={`py-3 rounded-xl border font-display text-xs sm:text-sm font-medium transition-all ${
                  gstRate === -1
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom Rate input field */}
            <AnimatePresence>
              {gstRate === -1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="relative rounded-lg shadow-xs">
                    <input
                      id="gst-custom-rate-input"
                      type="number"
                      value={customRate}
                      onChange={(e) => setCustomRate(e.target.value)}
                      placeholder="Enter custom rate e.g. 15"
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

          {/* Place of Supply selector */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Supply Route Designation</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Toggle inter-state to calculate integrated tax (IGST) instead of state taxes.</p>
            </div>
            <div className="flex bg-slate-200/60 p-1 rounded-lg self-start sm:self-center shrink-0">
              <button
                onClick={() => setIsInterState(false)}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-md transition-all ${
                  !isInterState ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Intra-State (CGST + SGST)
              </button>
              <button
                onClick={() => setIsInterState(true)}
                className={`text-[11px] font-medium px-3 py-1.5 rounded-md transition-all ${
                  isInterState ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inter-State (IGST)
              </button>
            </div>
          </div>

          {/* Save calculation parameters */}
          <div className="pt-2">
            <label htmlFor="gst-history-label-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Save To History Label (Optional)
            </label>
            <div className="flex gap-2">
              <input
                id="gst-history-label-input"
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="E.g. Steel Purchase, Client Bill"
                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleSaveToHistory}
                disabled={!calculation}
                className="bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 text-indigo-700 font-display text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1 transition-all border border-indigo-100 shrink-0"
              >
                <Plus size={14} />
                <span>Save Log</span>
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Generator Switch */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setShowInvoiceBuilder(!showInvoiceBuilder)}
            className="w-full flex items-center justify-between bg-slate-900 text-white rounded-xl p-3 text-xs font-semibold font-display hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" />
              <span>{showInvoiceBuilder ? "Collapse Invoice Builder" : "Generate Compliance GST Invoice"}</span>
            </span>
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">FREE TOOL</span>
          </button>

          {showInvoiceBuilder && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="gst-invoice-number-input" className="block text-[10px] font-semibold text-slate-500 uppercase">Invoice Number</label>
                  <input
                    id="gst-invoice-number-input"
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="gst-client-name-input" className="block text-[10px] font-semibold text-slate-500 uppercase">Client Business Name</label>
                  <input
                    id="gst-client-name-input"
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label htmlFor="gst-item-name-input" className="block text-[10px] font-semibold text-slate-500 uppercase">Description of Goods</label>
                  <input
                    id="gst-item-name-input"
                    type="text"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-400">
                Type details above and view the live tax receipt invoice directly in the receipt ledger box on your right! Click print to export PDF.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Column: Calculations Receipt & Live Invoice Ledger */}
      <div className="lg:col-span-5 space-y-6">
        {/* Main Calculation Receipt Card */}
        {calculation ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 text-slate-100 rounded-2xl p-6 shadow-lg border border-slate-800 relative overflow-hidden"
            id="gst-receipt-display"
          >
            {/* Stamp effect */}
            <div className="absolute top-2 right-2 border-2 border-dashed border-emerald-500/20 text-emerald-500/20 text-[10px] font-bold tracking-widest uppercase rotate-12 px-2 py-1 select-none pointer-events-none rounded">
              GST COMPLIANT
            </div>

            <div className="border-b border-slate-800 pb-4 mb-4 text-center">
              <h3 className="font-display font-bold text-slate-300 text-xs uppercase tracking-widest">
                TAX COMPONENT LEDGER
              </h3>
              <div className="text-3xl font-display font-bold text-white mt-1">
                {formatCurrency(calculation.totalAmount, calculation.currency)}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {calculation.isAddGst ? 'Exclusive Base Price + GST' : 'Inclusive Total Amount'}
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Base Amount (Tax Exclusive):</span>
                <span className="font-mono text-slate-200 font-medium">{formatCurrency(calculation.originalAmount, calculation.currency)}</span>
              </div>

              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">GST Percentage Slab:</span>
                <span className="font-mono text-slate-200 font-medium">{calculation.gstRate}%</span>
              </div>

              {/* CGST, SGST vs IGST Breakdown */}
              {calculation.isInterState ? (
                <div className="flex justify-between bg-slate-800/40 px-2.5 py-1.5 rounded">
                  <span className="text-sky-300">IGST (Integrated 100%):</span>
                  <span className="font-mono text-sky-200 font-bold">{formatCurrency(calculation.igstAmount, calculation.currency)}</span>
                </div>
              ) : (
                <div className="space-y-1.5 bg-slate-800/20 px-2.5 py-2 rounded">
                  <div className="flex justify-between">
                    <span className="text-indigo-300">CGST (Central Tax 50%):</span>
                    <span className="font-mono text-indigo-200">{formatCurrency(calculation.cgstAmount, calculation.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-300">SGST (State Tax 50%):</span>
                    <span className="font-mono text-indigo-200">{formatCurrency(calculation.sgstAmount, calculation.currency)}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-800 pt-3 text-sm">
                <span className="text-white font-bold">Total GST Tax:</span>
                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(calculation.gstAmount, calculation.currency)}</span>
              </div>

              <div className="flex justify-between border-t border-b border-slate-800 py-3 text-base">
                <span className="text-white font-display font-semibold">Post-Tax Total:</span>
                <span className="font-mono text-white font-bold">{formatCurrency(calculation.totalAmount, calculation.currency)}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCopyToClipboard}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-display text-xs font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Clipboard size={14} />}
                <span>{copied ? 'Copied Ledger' : 'Copy Breakdown'}</span>
              </button>
              {showInvoiceBuilder && (
                <button
                  onClick={handlePrint}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-display text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  title="Print GST Compliant Invoice"
                >
                  <Printer size={14} />
                  <span className="hidden sm:inline">Print / PDF</span>
                </button>
              )}
            </div>

            {/* Micro Invoice Live view */}
            {showInvoiceBuilder && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-white text-slate-950 rounded-xl p-4 mt-6 border border-slate-300 shadow-sm print:block print:fixed print:inset-0 print:z-50 print:bg-white text-left font-sans"
              >
                <div className="flex justify-between items-start border-b border-slate-200 pb-3 mb-3">
                  <div>
                    <h4 className="font-bold text-sm tracking-tight">TAX COMPLIANT INVOICE</h4>
                    <span className="text-[10px] text-slate-400 font-mono block">{invoiceNumber}</span>
                  </div>
                  <span className="bg-slate-100 text-slate-800 border border-slate-200 text-[8px] font-bold px-1.5 py-0.5 rounded">ORIGINAL FOR RECIPIENT</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-[10px] mb-4">
                  <div>
                    <strong className="text-slate-500 block">Billed To:</strong>
                    <span className="font-semibold block">{clientName}</span>
                    <span className="text-slate-400 block">GSTIN: 27AAAAA0000A1Z2 (Simulated)</span>
                  </div>
                  <div className="text-right">
                    <strong className="text-slate-500 block">Place of Supply:</strong>
                    <span>{calculation.isInterState ? 'Inter-State Transaction (IGST)' : 'Intra-State (CGST + SGST)'}</span>
                    <span className="text-slate-400 block">Date: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="border border-slate-200 rounded overflow-hidden text-[9px] mb-4">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                        <th className="p-1.5 text-left">Description</th>
                        <th className="p-1.5 text-right">Taxable Val</th>
                        <th className="p-1.5 text-right">GST Rate</th>
                        <th className="p-1.5 text-right">GST Amt</th>
                        <th className="p-1.5 text-right font-bold text-slate-900">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1.5 font-medium">{itemName}</td>
                        <td className="p-1.5 text-right font-mono">{formatCurrency(calculation.originalAmount, calculation.currency)}</td>
                        <td className="p-1.5 text-right font-mono">{calculation.gstRate}%</td>
                        <td className="p-1.5 text-right font-mono">{formatCurrency(calculation.gstAmount, calculation.currency)}</td>
                        <td className="p-1.5 text-right font-bold font-mono">{formatCurrency(calculation.totalAmount, calculation.currency)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="space-y-1 text-right text-[10px] border-t border-slate-100 pt-2">
                  <p><span className="text-slate-500">Taxable Value:</span> <strong className="font-mono">{formatCurrency(calculation.originalAmount, calculation.currency)}</strong></p>
                  
                  {calculation.isInterState ? (
                    <p><span className="text-sky-600">IGST Output:</span> <strong className="font-mono">{formatCurrency(calculation.igstAmount, calculation.currency)}</strong></p>
                  ) : (
                    <>
                      <p><span className="text-indigo-600">CGST Output (50%):</span> <strong className="font-mono">{formatCurrency(calculation.cgstAmount, calculation.currency)}</strong></p>
                      <p><span className="text-indigo-600">SGST Output (50%):</span> <strong className="font-mono">{formatCurrency(calculation.sgstAmount, calculation.currency)}</strong></p>
                    </>
                  )}
                  
                  <p className="text-xs pt-1 border-t border-slate-200 font-bold text-slate-900">Total Invoice Amount: <span className="font-mono">{formatCurrency(calculation.totalAmount, calculation.currency)}</span></p>
                </div>
                <div className="text-[7px] text-slate-400 mt-3 text-center border-t border-slate-100 pt-2 leading-tight">
                  This compliant e-invoice is simulated inside our free tools app. To print or download this layout, click the "Print / PDF" button above.
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <div className="bg-slate-100 border border-slate-200 text-slate-500 rounded-2xl p-10 text-center text-sm font-display flex flex-col items-center justify-center min-h-[300px]">
            <RotateCcw className="animate-spin-slow text-slate-400 mb-3" size={24} />
            <span>Please enter a valid amount to start instant calculations.</span>
          </div>
        )}
 
        {/* Saved Logs History list */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-display font-bold text-slate-800 text-sm flex items-center gap-2">
              Recent Calculations History
            </h3>
            {savedCalculations.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-slate-400 hover:text-rose-600 text-[10px] font-semibold flex items-center gap-0.5 transition-colors"
                title="Clear saved logs"
              >
                <Trash2 size={12} /> Clear All
              </button>
            )}
          </div>
 
          {savedCalculations.length > 0 ? (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {savedCalculations.map((item) => (
                <button
                  key={item.timestamp}
                  onClick={() => loadHistoryItem(item)}
                  className="w-full text-left bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0">
                    <span className="font-display text-xs font-semibold text-slate-800 block truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                      {item.isAddGst ? 'Exclusive' : 'Inclusive'} • {item.gstRate}% • {item.isInterState ? 'IGST' : 'CGST/SGST'}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <strong className="text-xs font-semibold text-indigo-600 block">
                      {formatCurrency(item.totalAmount)}
                    </strong>
                    <span className="text-[9px] text-slate-400 block mt-0.5">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              Your calculation logs will appear here so you can easily toggle and re-calculate later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
