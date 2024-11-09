import { useStore } from '../store';

export const useSales = () => {
  const store = useStore();

  return {
    sales: store.sales,
    addSales: async (sales: any[]) => {
      store.appendSales(sales.map(sale => ({
        date: sale.date,
        artistCode: sale.artistcode,
        qty: Number(sale.qty),
        pricePointName: sale.pricepointname || null,
        sku: sale.sku || null,
        grossSales: Number(sale.grosssales),
        notes: sale.notes
      })));
    },
    clearSales: async () => {
      store.setSales([]);
    }
  };
};