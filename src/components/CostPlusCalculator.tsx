/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Percent, Clipboard, Check, RotateCcw, HelpCircle, FileText, Plus, Printer, DollarSign, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CostPlusCalculation } from '../types';

interface CostPlusCalculatorProps {
  onHistoryChange: (calc: CostPlusCalculation) => void;
  savedCalculations: CostPlusCalculation[];
  onClearHistory: () => void;
}

export default function CostPlusCalculator({
  onHistoryChange,
  savedCalculations,
  onClearHistory
}: CostPlusCalculatorProps) {
  // Input States
  const [materialCostInput, setMaterialCostInput] = useState<string>('500');
  const [laborCostInput, setLaborCostInput] = useState<string>('300');
  const [overheadCostInput, setOverheadCostInput] = useState<string>('200');
  const [markupRate, setMarkupRate] = useState<number>(30); // Default 30% markup
  const [customMarkup, setCustomMarkup] = useState<string>('25');
  const [labelInput, setLabelInput] = useState<string>('');
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>('INR');

  // Currency symbols map
  const currencySymbols: Record<'INR' | 'USD' | 'EUR', string> = {
    INR: '₹',
    USD: '$',
    EUR: '€'
  };

  // Helper function to format currency value nicely
  const formatCurrency = (val: number, cur: 'INR' | 'USD' | 'EUR' = currency) => {
    const symbol = currencySymbols[cur];
    const locale = cur === 'INR' ? 'en-IN' : 'en-US';
    return `${symbol}${val.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Tier Generator States
  const [showTierBuilder, setShowTierBuilder] = useState(false);
  const [productName, setProductName] = useState('Standard Unit Widget');
  const [targetQuantity, setTargetQuantity] = useState<number>(100);

  // Outputs
  const [calculation, setCalculation] = useState<CostPlusCalculation | null>(null);
  const [copied, setCopied] = useState(false);

  // Quick select Markup Slabs
  const rateSlabs = [15, 30, 50];

  useEffect(() => {
    calculateCostPlus();
  }, [materialCostInput, laborCostInput, overheadCostInput, markupRate, customMarkup, currency]);

  const calculateCostPlus = () => {
    const materials = parseFloat(materialCostInput) || 0;
    const labor = parseFloat(laborCostInput) || 0;
    const overhead = parseFloat(overheadCostInput) || 0;

    const unitCost = materials + labor + overhead;
    if (unitCost <= 0) {
      setCalculation(null);
      return;
    }

    const activeMarkup = markupRate === -1 ? parseFloat(customMarkup) || 0 : markupRate;
    
    // Formula: Markup Amount = Unit Cost * (Markup Rate / 100)
    // Formula: Selling Price = Unit Cost + Markup Amount
    // Formula: Profit Margin = (Markup Amount / Selling Price) * 100
    const markupAmount = unitCost * (activeMarkup / 100);
    const sellingPrice = unitCost + markupAmount;
    const profitMargin = sellingPrice > 0 ? (markupAmount / sellingPrice) * 100 : 0;

    setCalculation({
      materialCost: materials,
      laborCost: labor,
      overheadCost: overhead,
      unitCost: Math.round(unitCost * 100) / 100,
      markupRate: activeMarkup,
      markupAmount: Math.round(markupAmount * 100) / 100,
      sellingPrice: Math.round(sellingPrice * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
      timestamp: Date.now(),
      label: labelInput.trim() || undefined,
      currency: currency
    });
  };

  const handleSaveToHistory = () => {
    if (!calculation) return;
    const cur = calculation.currency || 'INR';
    const sym = currencySymbols[cur];
    onHistoryChange({
      ...calculation,
      timestamp: Date.now(),
      label: labelInput.trim() || `Markup Calc - ${sym}${calculation.sellingPrice}`
    });
    setLabelInput('');
  };

  const handleCopyToClipboard = () => {
    if (!calculation) return;
    const markupText = `${calculation.markupRate}%`;
    const cur = calculation.currency || 'INR';
    const sym = currencySymbols[cur];

    const text = `--- COST-PLUS PRICING BREAKDOWN ---
Product / Service Unit Costs:
- Material Cost: ${sym}${calculation.materialCost.toFixed(2)}
- Labor Cost: ${sym}${calculation.laborCost.toFixed(2)}
- Overhead Cost: ${sym}${calculation.overheadCost.toFixed(2)}
---------------------------------
Total Base Unit Cost: ${sym}${calculation.unitCost.toFixed(2)}
Markup applied: ${markupText} (${sym}${calculation.markupAmount.toFixed(2)})
---------------------------------
Target Selling Price: ${sym}${calculation.sellingPrice.toFixed(2)}
Resulting Gross Margin: ${calculation.profitMargin.toFixed(2)}%
Calculated on SimplyTools Cost-Plus Pricing Hub`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadHistoryItem = (item: CostPlusCalculation) => {
    setMaterialCostInput(item.materialCost.toString());
    setLaborCostInput(item.laborCost.toString());
    setOverheadCostInput(item.overheadCost.toString());
    setMarkupRate(rateSlabs.includes(item.markupRate) ? item.markupRate : -1);
    if (!rateSlabs.includes(item.markupRate)) {
      setCustomMarkup(item.markupRate.toString());
    }
    if (item.currency) {
      setCurrency(item.currency);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Tier breakdown calculation
  const getVolumeDiscount = (qty: number) => {
    if (qty >= 1000) return 15; // 15% off markup rate for huge bulk orders
    if (qty >= 500) return 10;
    if (qty >= 100) return 5;
    return 0;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start my-8">
      {/* Left Column: Calculator Inputs & Interactive Knobs */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        
        {/* Cost Type Header Title */}
        <div className="border-b border-slate-100 pb-4 mb-5">
          <h3 className="font-display font-bold text-slate-800 text-base">Cost-Plus Pricing Setup</h3>
          <p className="text-xs text-slate-500 mt-1">
            Input your base production costs and define your profit markup to calculate an optimized, sustainable selling price.
          </p>
        </div>

        {/* Base Currency Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-xl mb-5">
          <div>
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Base Currency</span>
            <span className="text-[10px] text-slate-400">Select currency for production costs and selling price.</span>
          </div>
          <select
            id="costplus-currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'INR' | 'USD' | 'EUR')}
            className="px-3 py-2 border border-slate-200 rounded-lg font-display font-semibold text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer min-w-[120px]"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
          </select>
        </div>

        {/* Inputs Form */}
        <div className="space-y-5">
          {/* Base Costs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Material Cost input */}
            <div>
              <label htmlFor="material-cost-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Material Cost
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-display font-medium text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  id="material-cost-input"
                  type="number"
                  value={materialCostInput}
                  onChange={(e) => setMaterialCostInput(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl font-display font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Labor Cost input */}
            <div>
              <label htmlFor="labor-cost-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Labor Cost
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-display font-medium text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  id="labor-cost-input"
                  type="number"
                  value={laborCostInput}
                  onChange={(e) => setLaborCostInput(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl font-display font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Overhead Cost input */}
            <div>
              <label htmlFor="overhead-cost-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Overhead Cost
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-slate-400 font-display font-medium text-sm">{currencySymbols[currency]}</span>
                </div>
                <input
                  id="overhead-cost-input"
                  type="number"
                  value={overheadCostInput}
                  onChange={(e) => setOverheadCostInput(e.target.value)}
                  placeholder="0.00"
                  className="block w-full pl-7 pr-3 py-2.5 border border-slate-200 rounded-xl font-display font-semibold text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Markup Slabs selectors */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex justify-between">
              <span>Markup Percentage</span>
              <span className="text-indigo-600 font-mono font-bold">
                {markupRate === -1 ? `${customMarkup}%` : `${markupRate}%`}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {rateSlabs.map((slab) => (
                <button
                  key={slab}
                  onClick={() => setMarkupRate(slab)}
                  className={`py-2.5 rounded-xl border font-mono text-xs font-bold transition-all ${
                    markupRate === slab
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {slab}%
                </button>
              ))}
              <button
                onClick={() => setMarkupRate(-1)}
                className={`py-2.5 rounded-xl border font-display text-xs font-medium transition-all ${
                  markupRate === -1
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Custom
              </button>
            </div>

            {/* Custom Rate input slider/field */}
            <AnimatePresence>
              {markupRate === -1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-150">
                    <div className="relative rounded-lg shadow-xs">
                      <input
                        id="costplus-custom-markup-input"
                        type="number"
                        value={customMarkup}
                        onChange={(e) => setCustomMarkup(e.target.value)}
                        placeholder="Enter custom markup percentage e.g. 25"
                        aria-label="Custom Markup Percentage"
                        className="block w-full pr-10 pl-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-xs text-slate-700 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Percent size={14} className="text-slate-400" />
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={parseFloat(customMarkup) || 1}
                      onChange={(e) => setCustomMarkup(e.target.value)}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>1%</span>
                      <span>100%</span>
                      <span>200%</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick formula breakdown badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
            <Info size={16} className="text-indigo-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Formula Definition</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                <strong>Cost-Plus Formula:</strong> Selling Price = Unit Cost × (1 + Markup% / 100).
                Unlike competitive pricing, cost-plus guarantees profit margins by accounting for all variable and fixed costs first.
              </p>
            </div>
          </div>

          {/* Save calculation parameters */}
          <div className="pt-2">
            <label htmlFor="costplus-history-label-input" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Save To History Label (Optional)
            </label>
            <div className="flex gap-2">
              <input
                id="costplus-history-label-input"
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="E.g. Widget Production, Software Project"
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

        {/* Volume Tier Generator Switch */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <button
            onClick={() => setShowTierBuilder(!showTierBuilder)}
            className="w-full flex items-center justify-between bg-slate-900 text-white rounded-xl p-3 text-xs font-semibold font-display hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText size={16} className="text-indigo-400" />
              <span>{showTierBuilder ? "Collapse Tier Discount Builder" : "Generate Volume Tier Price List"}</span>
            </span>
            <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">FREE TOOL</span>
          </button>

          {showTierBuilder && calculation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="costplus-product-name" className="block text-[10px] font-semibold text-slate-500 uppercase">Product/Service Name</label>
                  <input
                    id="costplus-product-name"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label htmlFor="costplus-target-qty" className="block text-[10px] font-semibold text-slate-500 uppercase">Target Client Qty</label>
                  <input
                    id="costplus-target-qty"
                    type="number"
                    value={targetQuantity}
                    onChange={(e) => setTargetQuantity(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-md p-2 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-hidden font-mono font-bold"
                  />
                </div>
              </div>

              {/* Dynamic Target Quantity Quote Card */}
              {targetQuantity > 0 && (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-950">
                  <span className="font-semibold block text-indigo-800 uppercase tracking-wider text-[9px] mb-1">
                    Live Deal Calculator for {targetQuantity.toLocaleString()} Units
                  </span>
                  {(() => {
                    const disc = getVolumeDiscount(targetQuantity);
                    const localMarkup = Math.max(0, calculation.markupRate * (1 - disc / 100));
                    const pricePerUnit = calculation.unitCost * (1 + localMarkup / 100);
                    const totalOrderValue = pricePerUnit * targetQuantity;
                    const totalOrderCost = calculation.unitCost * targetQuantity;
                    const totalProfit = totalOrderValue - totalOrderCost;
                    return (
                      <div className="space-y-1.5 leading-relaxed font-sans">
                        <p className="text-slate-700">
                          Estimated pricing for <strong className="text-indigo-950 font-bold">{targetQuantity.toLocaleString()} unit{targetQuantity > 1 ? 's' : ''}</strong> of <span className="text-indigo-950 font-medium italic">"{productName}"</span>:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2.5 border-t border-indigo-100/50 mt-2 font-mono text-[11px]">
                          <div>
                            <span className="text-indigo-600 block font-sans text-[8px] uppercase font-bold tracking-wider">Unit Quote</span>
                            <span className="font-bold text-indigo-950">{formatCurrency(pricePerUnit, calculation.currency)}</span>
                          </div>
                          <div>
                            <span className="text-indigo-600 block font-sans text-[8px] uppercase font-bold tracking-wider">Discount Rec.</span>
                            <span className="font-bold text-emerald-600 font-sans">-{disc}% ({localMarkup.toFixed(1)}% Markup)</span>
                          </div>
                          <div>
                            <span className="text-indigo-600 block font-sans text-[8px] uppercase font-bold tracking-wider">Total Value</span>
                            <span className="font-bold text-indigo-950">{formatCurrency(totalOrderValue, calculation.currency)}</span>
                          </div>
                          <div>
                            <span className="text-indigo-600 block font-sans text-[8px] uppercase font-bold tracking-wider">Est. Net Profit</span>
                            <span className="font-bold text-emerald-700">{formatCurrency(totalProfit, calculation.currency)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Volume Discount Output Table */}
              <div className="bg-white border border-slate-150 rounded-lg overflow-hidden text-xs">
                <div className="bg-slate-100 px-3 py-2 font-semibold text-slate-700 grid grid-cols-4 gap-2 border-b border-slate-150">
                  <span>Volume Tier</span>
                  <span className="text-right">Markup Discount</span>
                  <span className="text-right">Markup Rate</span>
                  <span className="text-right font-display font-bold text-slate-900">Selling Price</span>
                </div>
                <div className="divide-y divide-slate-100 font-mono">
                  {(() => {
                    const baseTiers = [1, 50, 100, 500, 1000];
                    const tiers = (targetQuantity > 0 && !baseTiers.includes(targetQuantity))
                      ? [...baseTiers, targetQuantity].sort((a, b) => a - b)
                      : baseTiers;
                    
                    return tiers.map((qty) => {
                      const disc = getVolumeDiscount(qty);
                      const localMarkup = Math.max(0, calculation.markupRate * (1 - disc / 100));
                      const price = calculation.unitCost * (1 + localMarkup / 100);
                      const isTarget = targetQuantity === qty;
                      
                      return (
                        <div 
                          key={qty} 
                          className={`px-3 py-2 grid grid-cols-4 gap-2 text-slate-600 items-center transition-colors ${
                            isTarget 
                              ? 'bg-indigo-50 font-bold border-y border-indigo-100/50 text-indigo-950' 
                              : ''
                          }`}
                        >
                          <span className={`font-sans ${isTarget ? 'font-bold text-indigo-900' : 'font-medium'}`}>
                            {qty} unit{qty > 1 ? 's' : ''}
                            {isTarget && <span className="ml-1.5 text-[9px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Target</span>}
                          </span>
                          <span className={`text-right ${disc > 0 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                            {disc > 0 ? `${disc}% off` : 'No discount'}
                          </span>
                          <span className="text-right">{localMarkup.toFixed(1)}%</span>
                          <span className={`text-right font-bold ${isTarget ? 'text-indigo-950' : 'text-slate-900'}`}>
                            {formatCurrency(price, calculation.currency)}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right Column: Calculations Result Dashboard */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-indigo-950 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
          
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md border border-indigo-500/10">
                Unit Pricing Summary
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handleCopyToClipboard}
                  disabled={!calculation}
                  className="bg-indigo-900/40 hover:bg-indigo-900/60 disabled:opacity-40 text-indigo-200 border border-indigo-700/30 p-2 rounded-lg transition-all active:scale-95"
                  title="Copy Pricing Details"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Clipboard size={14} />}
                </button>
                <button
                  onClick={handlePrint}
                  disabled={!calculation}
                  className="bg-indigo-900/40 hover:bg-indigo-900/60 disabled:opacity-40 text-indigo-200 border border-indigo-700/30 p-2 rounded-lg transition-all active:scale-95"
                  title="Print Pricing Sheet"
                >
                  <Printer size={14} />
                </button>
              </div>
            </div>

            {calculation ? (
              <div className="space-y-6">
                <div>
                  <span className="text-indigo-300/80 text-[11px] font-semibold uppercase tracking-wider block">Target Selling Price</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-white font-display text-4xl font-extrabold">{formatCurrency(calculation.sellingPrice, calculation.currency)}</span>
                    <span className="text-indigo-300 text-xs font-medium">/ unit</span>
                  </div>
                </div>

                <div className="border-t border-indigo-900/60 pt-5 space-y-3.5 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-200/70 font-sans">Material unit cost:</span>
                    <span className="text-white font-medium">{formatCurrency(calculation.materialCost, calculation.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-200/70 font-sans">Labor unit cost:</span>
                    <span className="text-white font-medium">{formatCurrency(calculation.laborCost, calculation.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-indigo-200/70 font-sans">Overhead unit cost:</span>
                    <span className="text-white font-medium">{formatCurrency(calculation.overheadCost, calculation.currency)}</span>
                  </div>
                  
                  <div className="border-t border-indigo-900/40 pt-3.5 flex justify-between items-center font-sans font-semibold text-sm">
                    <span className="text-indigo-300">Total Base Cost:</span>
                    <span className="text-white">{formatCurrency(calculation.unitCost, calculation.currency)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-indigo-200/70 font-sans">Markup ({calculation.markupRate}%):</span>
                    <span className="text-indigo-300 font-bold">+{formatCurrency(calculation.markupAmount, calculation.currency)}</span>
                  </div>
                </div>

                {/* Profit Margin indicator */}
                <div className="bg-indigo-900/40 border border-indigo-800/30 rounded-xl p-4">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-indigo-200 font-sans font-medium">Resulting Profit Margin:</span>
                    <span className="text-emerald-400 font-bold font-mono text-sm">{calculation.profitMargin.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-indigo-950 rounded-full h-2 overflow-hidden border border-indigo-900">
                    <div 
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, calculation.profitMargin)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-indigo-300/60 mt-2 font-sans">
                    With cost-plus markup, a {calculation.markupRate}% markup provides a gross profit margin of {calculation.profitMargin.toFixed(1)}% on sales revenue.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <DollarSign size={36} className="text-indigo-400 mx-auto opacity-30 mb-3" />
                <p className="text-xs text-indigo-200/50">Enter variable costs to calculate unit selling prices.</p>
              </div>
            )}
          </div>
        </div>

        {/* Calculation History Logs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-display font-bold text-slate-800 text-xs uppercase tracking-wider">Calculation History</h4>
            {savedCalculations.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-slate-400 hover:text-rose-500 text-[10px] font-semibold uppercase tracking-wider transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {savedCalculations.length === 0 ? (
            <div className="py-6 text-center border-2 border-dashed border-slate-100 rounded-xl">
              <RotateCcw size={20} className="text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400 text-[11px]">No saved pricing records found.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {savedCalculations.map((item, index) => {
                const itemCur = item.currency || 'INR';
                const itemSym = currencySymbols[itemCur];
                return (
                  <button
                    key={index}
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left bg-slate-50 hover:bg-indigo-50/50 hover:border-indigo-200/60 p-2.5 rounded-xl border border-slate-150 transition-all flex justify-between items-center group cursor-pointer"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-indigo-900 transition-colors">
                        {item.label || `Log Entry - ${itemSym}${item.sellingPrice}`}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        Base: {formatCurrency(item.unitCost, itemCur)} | Markup: {item.markupRate}% | {itemCur}
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-900 shrink-0">
                      {formatCurrency(item.sellingPrice, itemCur)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
