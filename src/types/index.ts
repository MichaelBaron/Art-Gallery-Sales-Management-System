export type Artist = {
  artistCode: string;
  fullName: string;
  lastName: string;
  firstName: string;
  commissionRate: number;
  email: string | null;
  classification: 'Member' | 'Gift Shop' | 'Community Gallery' | 'Former Member' | 'Self' | 'Guest Gallery';
};

export type Sale = {
  salesId?: number;
  date: string;
  artistCode: string;
  qty: number;
  pricePointName: string | null;
  sku: string | null;
  grossSales: number;
  notes?: string;
};

export type Setting = {
  parameterName: string;
  parameterValue: string;
  notes?: string;
};