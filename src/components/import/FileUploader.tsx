import React from 'react';

interface FileUploaderProps {
  title: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export function FileUploader({ title, onFileSelect, error }: FileUploaderProps) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <input
        type="file"
        accept=".csv"
        onChange={onFileSelect}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}