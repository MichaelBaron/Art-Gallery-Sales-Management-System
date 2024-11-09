import React, { useMemo, useState } from 'react';
import { useStore } from '../../store';
import { DataTable } from '../DataTable';
import { ColumnDef } from '@tanstack/react-table';

export function FinancialSummary() {
  const { artists, sales } = useStore();
  
  // Get current date
  const today = new Date();
  // Get previous month (if January, go to December of previous year)
  const defaultMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
  const defaultYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
  
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  // Array of month names
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate array of years (current year and 4 years back)
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const summaryData = useMemo(() => {
    // Filter sales for selected month and year
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === selectedMonth && 
             saleDate.getFullYear() === selectedYear;
    });

    const artistSummary = artists.map(artist => {
      const artistSales = filteredSales.filter(sale => sale.artistCode === artist.artistCode);
      const grossSales = artistSales.reduce((sum, sale) => sum + sale.grossSales, 0);
      const commission = grossSales * artist.commissionRate;

      return {
        artistCode: artist.artistCode,
        artistName: artist.fullName,
        commissionRate: artist.commissionRate,
        grossSales: grossSales,
        commission: commission,
      };
    });

    // Only include artists with sales in the selected period
    return artistSummary
      .filter(summary => summary.grossSales > 0)
      .sort((a, b) => a.artistCode.localeCompare(b.artistCode));
  }, [artists, sales, selectedMonth, selectedYear]);

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'artistCode',
      header: 'Artist Code',
      size: 100,
    },
    {
      accessorKey: 'artistName',
      header: 'Artist Name',
      size: 200,
    },
    {
      accessorKey: 'commissionRate',
      header: 'Commission Rate',
      size: 150,
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return `${(value * 100).toFixed(0)}%`;
      },
    },
    {
      accessorKey: 'grossSales',
      header: 'Gross Sales',
      size: 150,
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      },
    },
    {
      accessorKey: 'commission',
      header: 'Commission',
      size: 150,
      cell: ({ getValue }) => {
        const value = getValue() as number;
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(value);
      },
    },
  ], []);

  const totals = useMemo(() => {
    return summaryData.reduce((acc, row) => ({
      grossSales: acc.grossSales + row.grossSales,
      commission: acc.commission + row.commission,
    }), { grossSales: 0, commission: 0 });
  }, [summaryData]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Summary</h1>
        
        <div className="flex space-x-4">
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month
            </label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year
            </label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {months[selectedMonth]} {selectedYear}
          </h2>
        </div>
        
        <DataTable data={summaryData} columns={columns} />
        
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-8 text-sm font-medium">
            <div>
              <span className="text-gray-500 mr-2">Total Gross Sales:</span>
              <span className="text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totals.grossSales)}
              </span>
            </div>
            <div>
              <span className="text-gray-500 mr-2">Total Commission:</span>
              <span className="text-gray-900">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(totals.commission)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}