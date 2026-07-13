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
  customConsultationLink: string;
  consultantSponsorFee: string;
  adminPasscode?: string;
}
