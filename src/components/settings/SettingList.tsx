import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Setting } from '../../types';
import { DataTable } from '../DataTable';
import { SettingForm } from './SettingForm';
import { useStore } from '../../store';

export function SettingList() {
  const { settings, setSettings } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | undefined>();

  const columns = useMemo<ColumnDef<Setting>[]>(
    () => [
      {
        accessorKey: 'parameterName',
        header: 'Parameter Name',
      },
      {
        accessorKey: 'parameterValue',
        header: 'Value',
      },
      {
        accessorKey: 'notes',
        header: 'Notes',
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
              onClick={() => handleDelete(row.original.parameterName)}
              className="p-1 hover:bg-gray-100 rounded text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const handleSubmit = (data: Setting) => {
    if (editingSetting) {
      const updatedSettings = settings.map((s) =>
        s.parameterName === editingSetting.parameterName ? data : s
      );
      setSettings(updatedSettings);
    } else {
      setSettings([...settings, data]);
    }
    handleCancel();
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setShowForm(true);
  };

  const handleDelete = (parameterName: string) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      const updatedSettings = settings.filter(
        (s) => s.parameterName !== parameterName
      );
      setSettings(updatedSettings);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSetting(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Setting
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <SettingForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingSetting}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable data={settings} columns={columns} />
        </div>
      )}
    </div>
  );
}