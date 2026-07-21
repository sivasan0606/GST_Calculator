/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GSTCalculation {
  amount: number;
  gstRate: number;
  isAddGst: boolean; // true = Add GST, false = Remove GST
  isInterState: boolean; // true = IGST, false = CGST + SGST
  originalAmount: number;
  gstAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalAmount: number;
  timestamp: number;
  label?: string;
  currency?: 'INR' | 'USD' | 'EUR';
}

export interface AffiliateSoftware {
  id: string;
  name: string;
  logo: string;
  rating: number;
  description: string;
  pros: string[];
  pricing: string;
  affiliateUrl: string;
  defaultUrl: string;
  promoCode?: string;
  exclusiveOffer?: {
    badge: string;
    text: string;
    conditions: string[];
  };
}

export interface TaxConsultant {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: number;
  reviewsCount: number;
  image: string;
  specialty: string[];
  location: string;
  consultationFee: string;
  bookingUrl: string;
}

export interface ConsultLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessType: string;
  consultantId?: string;
  message: string;
  timestamp: number;
  status: 'new' | 'contacted' | 'completed';
}

export interface SiteSettings {
  adsenseClientId: string;
  zohoLink: string;
  vyaparLink: string;
  giddhLink: string;
  tallyLink: string;
  razorpayLink?: string;
  customConsultationLink: string;
  consultantSponsorFee: string;
  adminPasscode?: string;
  showSponsorSection?: boolean;
  showAffiliateSection?: boolean;
  showAdSense?: boolean;
  showBlogSection?: boolean;
  siteName?: string;
  siteSubtitle?: string;
  gstTitle?: string;
  gstSubtitle?: string;
  costPlusTitle?: string;
  costPlusSubtitle?: string;
  calculatorsTabName?: string;
  blogTabName?: string;
  footerText?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  publishedAt: string;
  readTime: string;
}

export interface CostPlusCalculation {
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  unitCost: number;
  markupRate: number;
  markupAmount: number;
  sellingPrice: number;
  profitMargin: number;
  timestamp: number;
  label?: string;
  currency?: 'INR' | 'USD' | 'EUR';
}

