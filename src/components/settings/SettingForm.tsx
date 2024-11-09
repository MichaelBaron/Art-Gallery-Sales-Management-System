import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Setting } from '../../types';

interface SettingFormProps {
  onSubmit: (data: Setting) => void;
  onCancel: () => void;
  initialData?: Setting;
}

export function SettingForm({ onSubmit, onCancel, initialData }: SettingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Setting>({
    defaultValues: initialData || {
      parameterName: '',
      parameterValue: '',
      notes: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {initialData ? 'Edit Setting' : 'New Setting'}
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
            Parameter Name
          </label>
          <input
            {...register('parameterName', { required: 'Parameter name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!!initialData}
          />
          {errors.parameterName && (
            <p className="mt-1 text-sm text-red-600">{errors.parameterName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parameter Value
          </label>
          <input
            {...register('parameterValue', { required: 'Parameter value is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.parameterValue && (
            <p className="mt-1 text-sm text-red-600">{errors.parameterValue.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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