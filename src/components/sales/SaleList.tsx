import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Sale } from '../../types';
import { DataTable } from '../DataTable';
import { SaleForm } from './SaleForm';
import { useStore } from '../../store';

export function SaleList() {
  const { sales, artists, addSale, updateSale, deleteSale } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | undefined>();

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
      },
      {
        accessorKey: 'artistCode',
        header: 'Artist',
        cell: ({ getValue }) => {
          const artistCode = getValue() as string;
          const artist = artists.find((a) => a.artistCode === artistCode);
          return artist?.fullName || artistCode;
        },
      },
      {
        accessorKey: 'qty',
        header: 'Quantity',
      },
      {
        accessorKey: 'pricePointName',
        header: 'Price Point',
      },
      {
        accessorKey: 'sku',
        header: 'SKU',
      },
      {
        accessorKey: 'grossSales',
        header: 'Gross Sales',
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(value);
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row.original.salesId!)}
              className="p-1 hover:bg-gray-100 rounded text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [artists]
  );

  const handleSubmit = (data: Sale) => {
    if (editingSale) {
      updateSale(editingSale.salesId!, data);
    } else {
      addSale(data);
    }
    handleCancel();
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleDelete = (saleId: number) => {
    if (confirm('Are you sure you want to delete this sale?')) {
      deleteSale(saleId);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSale(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Sale
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <SaleForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingSale}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable data={sales} columns={columns} />
        </div>
      )}
    </div>
  );
}