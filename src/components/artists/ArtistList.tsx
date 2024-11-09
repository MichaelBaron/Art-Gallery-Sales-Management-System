import React, { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Artist } from '../../types';
import { DataTable } from '../DataTable';
import { ArtistForm } from './ArtistForm';
import { useStore } from '../../store';

export function ArtistList() {
  const { artists, addArtist, updateArtist, deleteArtist } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editingArtist, setEditingArtist] = useState<Artist | undefined>();

  const columns = useMemo<ColumnDef<Artist>[]>(
    () => [
      {
        accessorKey: 'artistCode',
        header: 'Artist Code',
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'classification',
        header: 'Classification',
      },
      {
        accessorKey: 'commissionRate',
        header: 'Commission Rate',
        cell: ({ getValue }) => {
          const value = getValue() as number;
          return `${(value * 100).toFixed(1)}%`;
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
              onClick={() => handleDelete(row.original.artistCode)}
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

  const handleSubmit = (data: Artist) => {
    if (editingArtist) {
      updateArtist(editingArtist.artistCode, data);
    } else {
      addArtist(data);
    }
    handleCancel();
  };

  const handleEdit = (artist: Artist) => {
    setEditingArtist(artist);
    setShowForm(true);
  };

  const handleDelete = (artistCode: string) => {
    if (confirm('Are you sure you want to delete this artist?')) {
      deleteArtist(artistCode);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingArtist(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Artists</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Artist
        </button>
      </div>

      {showForm ? (
        <div className="bg-white p-6 rounded-lg shadow">
          <ArtistForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={editingArtist}
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow">
          <DataTable data={artists} columns={columns} />
        </div>
      )}
    </div>
  );
}