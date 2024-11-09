import React from 'react';
import { useForm } from 'react-hook-form';
import { Artist } from '../../types/Artist';

interface SaleFormProps {
  artists: Artist[];
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const SaleForm: React.FC<SaleFormProps> = ({ artists, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date
        </label>
        <input
          type="date"
          {...register('date', { required: 'Date is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Artist
        </label>
        <select
          {...register('artistCode', { required: 'Artist is required' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select an artist</option>
          {artists.map((artist) => (
            <option key={artist.artistCode} value={artist.artistCode}>
              {artist.fullName}
            </option>
          ))}
        </select>
        {errors.artistCode && (
          <p className="mt-1 text-sm text-red-600">{errors.artistCode.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <input
          type="number"
          {...register('qty', {
            required: 'Quantity is required',
            validate: (value) => Number.isInteger(value) || 'Quantity must be a whole number'
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.qty && (
          <p className="mt-1 text-sm text-red-600">{errors.qty.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Price Point Name
        </label>
        <input
          type="text"
          {...register('pricePointName')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.pricePointName && (
          <p className="mt-1 text-sm text-red-600">{errors.pricePointName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          SKU
        </label>
        <input
          type="text"
          {...register('sku')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.sku && (
          <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Gross Sales
        </label>
        <input
          type="number"
          step="0.01"
          {...register('grossSales', {
            required: 'Gross sales is required',
            min: { value: 0, message: 'Gross sales must be non-negative' }
          })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.grossSales && (
          <p className="mt-1 text-sm text-red-600">{errors.grossSales.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default SaleForm;