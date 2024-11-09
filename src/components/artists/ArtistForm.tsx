import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Artist } from '../../types';

interface ArtistFormProps {
  onSubmit: (data: Artist) => void;
  onCancel: () => void;
  initialData?: Artist;
}

export function ArtistForm({ onSubmit, onCancel, initialData }: ArtistFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Artist>({
    defaultValues: initialData || {
      artistCode: '',
      fullName: '',
      lastName: '',
      firstName: '',
      commissionRate: 0,
      email: '',
      classification: 'Member',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Edit Artist' : 'New Artist'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Artist Code
          </label>
          <input
            {...register('artistCode', { required: 'Artist Code is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!!initialData}
          />
          {errors.artistCode && (
            <p className="mt-1 text-sm text-red-600">{errors.artistCode.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            {...register('fullName', { required: 'Full Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register('lastName', { required: 'Last Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register('firstName', { required: 'First Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Commission Rate
          </label>
          <input
            type="number"
            step="0.01"
            {...register('commissionRate', {
              required: 'Commission Rate is required',
              min: { value: 0, message: 'Must be between 0 and 1' },
              max: { value: 1, message: 'Must be between 0 and 1' },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.commissionRate && (
            <p className="mt-1 text-sm text-red-600">{errors.commissionRate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Classification
          </label>
          <select
            {...register('classification', { required: 'Classification is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="Member">Member</option>
            <option value="Gift Shop">Gift Shop</option>
            <option value="Community Gallery">Community Gallery</option>
            <option value="Former Member">Former Member</option>
            <option value="Self">Self</option>
            <option value="Guest Gallery">Guest Gallery</option>
          </select>
          {errors.classification && (
            <p className="mt-1 text-sm text-red-600">{errors.classification.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
}