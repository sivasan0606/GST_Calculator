import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Download, 
  Share2, 
  ExternalLink, 
  Coins, 
  ArrowUpRight, 
  Sparkles, 
  Check, 
  FileText, 
  Clipboard, 
  User, 
  Building, 
  Calendar, 
  ListOrdered, 
  Percent, 
  ChevronRight,
  Printer
} from 'lucide-react';
import { jsPDF } from 'jspdf';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  gstRate: number; // e.g. 18 for 18%
}

interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  state: string;
}

interface SellerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  state: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", 
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", 
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export default function GstInvoiceGenerator({ razorpayLink = 'https://rzp.io/rzp/LDcj8IDc', onTrackClick }: { razorpayLink?: string; onTrackClick?: (id: string, fee: number) => void }) {
  // Persistence key
  const LOCAL_STORAGE_KEY = 'simply_tools_gst_invoice_data';

  // State initialization
  const [seller, setSeller] = useState<SellerDetails>({
    name: 'Aura Digital Solutions',
    email: 'billing@auradigital.in',
    phone: '+91 98765 43210',
    address: '4th Floor, Tech Hub, Sector 62, Noida, UP - 201301',
    gstin: '09AAAAA1111A1Z1',
    state: 'Uttar Pradesh'
  });

  const [client, setClient] = useState<ClientDetails>({
    name: 'Acme Enterprises Private Limited',
    email: 'accounts@acmecorp.com',
    phone: '+91 80123 45678',
    address: '12, MG Road, Landmark Plaza, Bengaluru, KA - 560001',
    gstin: '29BBBBB2222B2Z2',
    state: 'Karnataka'
  });

  const [meta, setMeta] = useState({
    invoiceNumber: 'ST/2026/049',
    invoiceDate: new Date().toISOString().substring(0, 10),
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    currency: 'INR'
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 'item-1', description: 'Web Application Development Services', quantity: 1, rate: 85000, gstRate: 18 },
    { id: 'item-2', description: 'AWS Cloud Architecture Consultation', quantity: 4, rate: 7500, gstRate: 18 }
  ]);

  // Payment Link configuration
  const [linkPrefix, setLinkPrefix] = useState<string>('https://rzp.io/l/pay_');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedInvoice, setCopiedInvoice] = useState<boolean>(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.seller) setSeller(parsed.seller);
        if (parsed.client) setClient(parsed.client);
        if (parsed.meta) setMeta(parsed.meta);
        if (parsed.items) setItems(parsed.items);
      }
    } catch (e) {
      console.warn("Could not load invoice configuration from localStorage:", e);
    }
  }, []);

  // Save to local storage
  const saveInvoiceToLocalStorage = (updatedSeller = seller, updatedClient = client, updatedMeta = meta, updatedItems = items) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        seller: updatedSeller,
        client: updatedClient,
        meta: updatedMeta,
        items: updatedItems
      }));
    } catch (e) {
      console.warn("Could not save invoice configuration:", e);
    }
  };

  // State updates wrapper with persistence
  const updateSeller = (key: keyof SellerDetails, val: string) => {
    const next = { ...seller, [key]: val };
    setSeller(next);
    saveInvoiceToLocalStorage(next, client, meta, items);
  };

  const updateClient = (key: keyof ClientDetails, val: string) => {
    const next = { ...client, [key]: val };
    setClient(next);
    saveInvoiceToLocalStorage(seller, next, meta, items);
  };

  const updateMeta = (key: string, val: string) => {
    const next = { ...meta, [key]: val };
    setMeta(next);
    saveInvoiceToLocalStorage(seller, client, next, items);
  };

  const updateItem = (id: string, key: keyof InvoiceItem, val: string | number) => {
    const next = items.map(item => {
      if (item.id === id) {
        return { ...item, [key]: val };
      }
      return item;
    });
    setItems(next);
    saveInvoiceToLocalStorage(seller, client, meta, next);
  };

  const addItem = () => {
    const next = [
      ...items, 
      { id: `item-${Date.now()}`, description: 'New consultancy service/goods item', quantity: 1, rate: 5000, gstRate: 18 }
    ];
    setItems(next);
    saveInvoiceToLocalStorage(seller, client, meta, next);
  };

  const removeItem = (id: string) => {
    const next = items.filter(item => item.id !== id);
    setItems(next);
    saveInvoiceToLocalStorage(seller, client, meta, next);
  };

  // Mathematical logic
  const isInterstate = seller.state !== client.state;

  const totalAmountExcludingTax = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const totalTaxCollected = items.reduce((sum, item) => {
    const subtotal = item.quantity * item.rate;
    const itemTax = subtotal * (item.gstRate / 100);
    return sum + itemTax;
  }, 0);

  const totalInvoiceValue = totalAmountExcludingTax + totalTaxCollected;

  // Breakdown CGST, SGST, IGST
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;

  if (isInterstate) {
    igstTotal = totalTaxCollected;
  } else {
    cgstTotal = totalTaxCollected / 2;
    sgstTotal = totalTaxCollected / 2;
  }

  // Generative Payment Link string
  const sanitizedInvoiceNo = meta.invoiceNumber.replace(/[^a-zA-Z0-9]/g, '_');
  const customPaymentLink = `${linkPrefix}simplytools_${sanitizedInvoiceNo}_${Math.round(totalInvoiceValue)}`;

  const handleCopyPaymentLink = () => {
    navigator.clipboard.writeText(customPaymentLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Generate and Download PDF using jsPDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const padding = 15;
    let y = 20;

    // Title / Brand
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(90, 57, 208); // Indigo #5A39D0
    doc.text("TAX INVOICE", padding, y);

    // Invoice details right aligned
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont("Helvetica", "normal");
    doc.text(`Invoice No: ${meta.invoiceNumber}`, 140, y);
    doc.text(`Date: ${meta.invoiceDate}`, 140, y + 5);
    doc.text(`Due Date: ${meta.dueDate}`, 140, y + 10);

    y += 15;

    // Divider
    doc.setDrawColor(220, 225, 230);
    doc.line(padding, y, 210 - padding, y);
    y += 10;

    // Seller & Client columns
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text("FROM (Seller):", padding, y);
    doc.text("TO (Bill To):", 110, y);
    y += 6;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80);
    
    // Seller Box content
    doc.text(seller.name, padding, y);
    doc.text(seller.address, padding, y + 5, { maxWidth: 80 });
    doc.text(`Email: ${seller.email}`, padding, y + 15);
    doc.text(`Phone: ${seller.phone}`, padding, y + 20);
    doc.setFont("Helvetica", "bold");
    doc.text(`GSTIN: ${seller.gstin || "N/A"}`, padding, y + 25);
    doc.text(`State of Supply: ${seller.state}`, padding, y + 30);

    // Client Box content
    doc.setFont("Helvetica", "normal");
    doc.text(client.name, 110, y);
    doc.text(client.address, 110, y + 5, { maxWidth: 80 });
    doc.text(`Email: ${client.email}`, 110, y + 15);
    doc.text(`Phone: ${client.phone}`, 110, y + 20);
    doc.setFont("Helvetica", "bold");
    doc.text(`GSTIN: ${client.gstin || "N/A"}`, 110, y + 25);
    doc.text(`Place of Supply: ${client.state}`, 110, y + 30);

    y += 40;

    // Divider
    doc.setDrawColor(220, 225, 230);
    doc.line(padding, y, 210 - padding, y);
    y += 8;

    // Table Header
    doc.setFillColor(245, 247, 250);
    doc.rect(padding, y, 180, 8, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(50);
    doc.text("Description", padding + 2, y + 5);
    doc.text("Qty", padding + 95, y + 5);
    doc.text("Rate (INR)", padding + 110, y + 5);
    doc.text("GST %", padding + 135, y + 5);
    doc.text("Subtotal", padding + 155, y + 5);

    y += 13;

    // Table Rows
    doc.setFont("Helvetica", "normal");
    doc.setTextColor(80);
    items.forEach((item) => {
      const sub = item.quantity * item.rate;
      doc.text(item.description, padding + 2, y, { maxWidth: 90 });
      doc.text(item.quantity.toString(), padding + 95, y);
      doc.text(item.rate.toLocaleString('en-IN'), padding + 110, y);
      doc.text(`${item.gstRate}%`, padding + 135, y);
      doc.text(sub.toLocaleString('en-IN'), padding + 155, y);
      y += 10;
    });

    // Divider
    doc.line(padding, y, 210 - padding, y);
    y += 8;

    // Summary calculations on the right
    const summaryX = 130;
    const summaryValueX = 210 - padding;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Taxable Subtotal:`, summaryX, y);
    doc.text(totalAmountExcludingTax.toLocaleString('en-IN'), summaryValueX, y, { align: "right" });
    y += 6;

    if (!isInterstate) {
      doc.text(`CGST (Central Tax):`, summaryX, y);
      doc.text(cgstTotal.toLocaleString('en-IN'), summaryValueX, y, { align: "right" });
      y += 6;
      doc.text(`SGST (State Tax):`, summaryX, y);
      doc.text(sgstTotal.toLocaleString('en-IN'), summaryValueX, y, { align: "right" });
      y += 6;
    } else {
      doc.text(`IGST (Integrated Tax):`, summaryX, y);
      doc.text(igstTotal.toLocaleString('en-IN'), summaryValueX, y, { align: "right" });
      y += 6;
    }

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text(`Total Invoice Value:`, summaryX, y + 2);
    doc.text(`INR ${Math.round(totalInvoiceValue).toLocaleString('en-IN')}`, summaryValueX, y + 2, { align: "right" });
    y += 15;

    // Print Payment link
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text("Secure Online Payment Link (Sample / Draft Link):", padding, y);
    doc.setFont("Helvetica", "bold");
    doc.setTextColor(90, 57, 208);
    doc.text(customPaymentLink, padding, y + 5);

    y += 18;

    // Footer compliance and declaration
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text("Declaration: This is a system-generated tax invoice issued in accordance with Sec 31 of the CGST Act 2017.", padding, y);
    doc.text("Powered by SimplyTools Invoicing & Razorpay Settlements Hub.", padding, y + 4);

    doc.save(`Invoice_${meta.invoiceNumber.replace('/', '_')}.pdf`);

    if (onTrackClick) {
      onTrackClick('download-pdf-invoice', 10.00);
    }
  };

  // Helper formatting currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 sm:p-8 font-sans max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 border border-indigo-100">
            <FileSpreadsheet size={11} /> Small Business Utilities
          </span>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            GST Invoice & Payment Link Generator
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Quickly fill in client deliverables, compute CGST/SGST/IGST automatically based on locations, and generate a printable PDF alongside customized Razorpay payment collection links.
          </p>
        </div>
        
        {/* Fast download block */}
        <button
          onClick={handleDownloadPDF}
          className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
        >
          <Download size={13} /> Export PDF Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Form Fields Builder */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Metadata Section */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar size={13} className="text-indigo-600" /> Invoice Metadata
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Invoice Number</label>
                <input
                  type="text"
                  value={meta.invoiceNumber}
                  onChange={(e) => updateMeta('invoiceNumber', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Issue Date</label>
                <input
                  type="date"
                  value={meta.invoiceDate}
                  onChange={(e) => updateMeta('invoiceDate', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Due Date</label>
                <input
                  type="date"
                  value={meta.dueDate}
                  onChange={(e) => updateMeta('dueDate', e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Seller vs Client Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* From Seller */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building size={13} className="text-indigo-600" /> From (Seller)
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Your Business Name"
                  value={seller.name}
                  onChange={(e) => updateSeller('name', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Address Line"
                  value={seller.address}
                  onChange={(e) => updateSeller('address', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    placeholder="Email Address"
                    value={seller.email}
                    onChange={(e) => updateSeller('email', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-700 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={seller.phone}
                    onChange={(e) => updateSeller('phone', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <input
                    type="text"
                    placeholder="Your GSTIN (15 Alphanumeric)"
                    value={seller.gstin}
                    onChange={(e) => updateSeller('gstin', e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-indigo-700 placeholder-slate-400 focus:outline-none"
                  />
                  <select
                    value={seller.state}
                    onChange={(e) => updateSeller('state', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                  >
                    {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* To Client */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User size={13} className="text-indigo-600" /> To (Client)
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Client Business Name"
                  value={client.name}
                  onChange={(e) => updateClient('name', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Billing Address"
                  value={client.address}
                  onChange={(e) => updateClient('address', e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    placeholder="Email Address"
                    value={client.email}
                    onChange={(e) => updateClient('email', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-700 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={client.phone}
                    onChange={(e) => updateClient('phone', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-700 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <input
                    type="text"
                    placeholder="Client GSTIN (Optional)"
                    value={client.gstin}
                    onChange={(e) => updateClient('gstin', e.target.value.toUpperCase())}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-700 placeholder-slate-400 focus:outline-none"
                  />
                  <select
                    value={client.state}
                    onChange={(e) => updateClient('state', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
                  >
                    {INDIAN_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ListOrdered size={13} className="text-indigo-600" /> Invoice Line Items
              </h4>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={11} /> Add Item Line
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="grid grid-cols-12 gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-xl items-center relative group"
                >
                  <div className="col-span-12 sm:col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Item Description"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 font-medium focus:outline-none"
                    />
                  </div>
                  
                  <div className="col-span-3 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      placeholder="Qty"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center text-slate-800 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="col-span-4 sm:col-span-2">
                    <input
                      type="number"
                      min="1"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      placeholder="Rate"
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-right text-slate-800 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="col-span-3 sm:col-span-2">
                    <select
                      value={item.gstRate}
                      onChange={(e) => updateItem(item.id, 'gstRate', parseInt(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-center text-slate-700 font-semibold focus:outline-none"
                    >
                      <option value="0">0% GST</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={items.length <= 1}
                      className="p-1 text-slate-400 hover:text-rose-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom payment link formatter input */}
          <div className="p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                <Sparkles size={13} className="text-indigo-600" /> Shareable Payment Link Customizer
              </h4>
              <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                Sample Link Only
              </span>
            </div>
            
            <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-3 text-[11px] text-amber-800 leading-normal">
              <span className="font-extrabold block mb-0.5">⚠️ Sample payment link note:</span>
              This link is a simulated sample preview. To collect actual client settlements, you must create a free merchant account with Razorpay and generate real links via your dashboard.
            </div>

            <p className="text-[11px] text-slate-500">
              Configure a sample payment link prefix below to format the draft links generated on your client invoices and emails.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkPrefix}
                onChange={(e) => setLinkPrefix(e.target.value)}
                placeholder="https://rzp.io/l/pay_"
                className="w-48 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none"
              />
              <div className="flex-1 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono select-all truncate border border-slate-200 flex items-center">
                {customPaymentLink}
              </div>
              <button
                onClick={handleCopyPaymentLink}
                className="px-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Clipboard size={12} />}
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: High Fidelity Live Invoice Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5 sm:p-6 space-y-5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1">
                <FileText size={10} /> Tax Invoice Preview
              </span>
              
              {/* Status Badge */}
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                isInterstate ? 'bg-amber-100 text-amber-800 border border-amber-200/50' : 'bg-teal-100 text-teal-800 border border-teal-200/50'
              }`}>
                {isInterstate ? 'IGST (Interstate)' : 'CGST + SGST (Local)'}
              </span>
            </div>

            {/* Visual Header Block */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-2xs">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h5 className="font-bold text-xs text-slate-900">{seller.name || 'Your Business'}</h5>
                  <span className="text-[10px] text-slate-400 font-mono block mt-1">GSTIN: {seller.gstin || 'Add Seller GSTIN'}</span>
                  <span className="text-[9px] text-slate-500 font-medium block mt-0.5">State: {seller.state}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Invoice No</span>
                  <span className="text-xs font-extrabold text-indigo-700">{meta.invoiceNumber}</span>
                </div>
              </div>

              <div className="border-t border-slate-100/80 my-2" />

              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Bill To:</span>
                <h6 className="font-bold text-xs text-slate-800 mt-0.5">{client.name || 'Client Business'}</h6>
                <span className="text-[9px] text-slate-500 line-clamp-2 mt-0.5">{client.address}</span>
                <span className="text-[9px] text-slate-400 font-mono block mt-1">GSTIN: {client.gstin || 'None'}</span>
                <span className="text-[9px] text-slate-400 font-mono block mt-0.5">Place of Supply: {client.state}</span>
              </div>
            </div>

            {/* Subtotal table layout */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-2.5 shadow-2xs">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-tight">Line Items:</span>
              
              <div className="space-y-2 divide-y divide-slate-50 max-h-[140px] overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const subTotal = item.quantity * item.rate;
                  return (
                    <div key={item.id} className="flex justify-between items-start gap-2 pt-2 first:pt-0">
                      <div className="flex-1">
                        <span className="text-[11px] font-bold text-slate-800 block leading-tight">{item.description}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5 block">{item.quantity} × {formatCurrency(item.rate)} ({item.gstRate}% GST)</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 font-mono">{formatCurrency(subTotal)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-slate-100/80 pt-2.5 space-y-1.5 text-xs">
                {/* Taxable Value */}
                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Taxable Subtotal:</span>
                  <span className="font-mono">{formatCurrency(totalAmountExcludingTax)}</span>
                </div>

                {/* Local vs Interstate splits */}
                {!isInterstate ? (
                  <>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Central GST (CGST - 50%):</span>
                      <span className="font-mono">{formatCurrency(cgstTotal)}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>State GST (SGST - 50%):</span>
                      <span className="font-mono">{formatCurrency(sgstTotal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Integrated GST (IGST - 100%):</span>
                    <span className="font-mono">{formatCurrency(igstTotal)}</span>
                  </div>
                )}

                <div className="border-t border-slate-100/80 my-1 pt-1" />

                {/* Final invoice sum */}
                <div className="flex justify-between text-xs font-bold text-slate-900 pt-0.5">
                  <span className="text-slate-800">Total Invoice Value:</span>
                  <span className="text-sm text-indigo-700 font-black font-mono">
                    {formatCurrency(Math.round(totalInvoiceValue))}
                  </span>
                </div>
              </div>
            </div>

            {/* Fast copy report button */}
            <button
              onClick={() => {
                const text = `Tax Invoice: ${meta.invoiceNumber}\nDate: ${meta.invoiceDate}\nTotal Value: ${formatCurrency(Math.round(totalInvoiceValue))}\nSecure Pay: ${customPaymentLink}`;
                navigator.clipboard.writeText(text);
                setCopiedInvoice(true);
                setTimeout(() => setCopiedInvoice(false), 2000);
              }}
              className="w-full flex items-center justify-center gap-1 bg-slate-950 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copiedInvoice ? (
                <>
                  <Check size={12} className="text-emerald-400" /> Invoice Copied!
                </>
              ) : (
                <>
                  <Share2 size={12} /> Share Invoice Summary
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Razorpay Affiliate Monetization Box */}
      <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-lg mt-8 relative overflow-hidden">
        {/* Background glow design */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-indigo-500/20">
              <Sparkles size={10} className="animate-pulse" /> Speed Up Customer Settlements
            </span>
            <h4 className="text-base font-bold tracking-tight">
              Want to automate these payment links & collect money globally?
            </h4>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Create a free merchant account with Razorpay to send automatic recurring invoices, enable 1-click WhatsApp payment reminders, and settle client transactions instantly.
            </p>
          </div>
          
          <a
            href={razorpayLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTrackClick && onTrackClick('invoice-razorpay-cta', 35.00)}
            className="inline-flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-xs cursor-pointer hover:translate-x-0.5 duration-200 shrink-0"
          >
            Create Free Account <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
