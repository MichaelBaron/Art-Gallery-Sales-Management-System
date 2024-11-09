import { create } from 'zustand';
import { Artist, Sale, Setting } from '../types';

interface StoreState {
  artists: Artist[];
  sales: Sale[];
  settings: Setting[];
  setArtists: (artists: Artist[]) => void;
  setSales: (sales: Sale[]) => void;
  appendSales: (newSales: Sale[]) => void;
  setSettings: (settings: Setting[]) => void;
  addArtist: (artist: Artist) => void;
  updateArtist: (artistCode: string, artist: Artist) => void;
  deleteArtist: (artistCode: string) => void;
  addSale: (sale: Sale) => void;
  updateSale: (saleId: number, sale: Sale) => void;
  deleteSale: (saleId: number) => void;
}

// Sample data for testing
const sampleArtists: Artist[] = [
  {
    artistCode: 'JD001',
    fullName: 'John Doe',
    lastName: 'Doe',
    firstName: 'John',
    commissionRate: 0.7,
    email: 'john@example.com',
    classification: 'Member'
  }
];

const sampleSales: Sale[] = [
  {
    salesId: 1,
    date: '2024-03-15',
    artistCode: 'JD001',
    qty: 1,
    pricePointName: 'Standard',
    sku: 'SKU123',
    grossSales: 100.00,
    notes: 'Sample sale'
  }
];

const sampleSettings: Setting[] = [
  {
    parameterName: 'DefaultCommissionRate',
    parameterValue: '0.7',
    notes: 'Default commission rate for new artists'
  }
];

export const useStore = create<StoreState>((set) => ({
  artists: sampleArtists,
  sales: sampleSales,
  settings: sampleSettings,
  setArtists: (artists) => set({ artists }),
  setSales: (sales) => set({ sales }),
  appendSales: (newSales) => set((state) => {
    // Get the highest existing salesId
    const maxId = Math.max(0, ...state.sales.map(s => s.salesId || 0));
    
    // Add new salesIds to the new sales
    const salesWithIds = newSales.map((sale, index) => ({
      ...sale,
      salesId: maxId + index + 1
    }));

    // Combine existing and new sales
    return { sales: [...state.sales, ...salesWithIds] };
  }),
  setSettings: (settings) => set({ settings }),
  addArtist: (artist) =>
    set((state) => ({ artists: [...state.artists, artist] })),
  updateArtist: (artistCode, artist) =>
    set((state) => ({
      artists: state.artists.map((a) =>
        a.artistCode === artistCode ? artist : a
      ),
    })),
  deleteArtist: (artistCode) =>
    set((state) => ({
      artists: state.artists.filter((a) => a.artistCode !== artistCode),
    })),
  addSale: (sale) => set((state) => ({ 
    sales: [...state.sales, { ...sale, salesId: Math.max(0, ...state.sales.map(s => s.salesId || 0)) + 1 }] 
  })),
  updateSale: (saleId, sale) =>
    set((state) => ({
      sales: state.sales.map((s) => (s.salesId === saleId ? { ...sale, salesId } : s)),
    })),
  deleteSale: (saleId) =>
    set((state) => ({
      sales: state.sales.filter((s) => s.salesId !== saleId),
    })),
}));