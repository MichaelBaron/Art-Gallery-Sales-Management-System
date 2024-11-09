import React from 'react';
import Papa from 'papaparse';
import { useArtists } from '../hooks/useArtists';
import { useSales } from '../hooks/useSales';
import { useSettings } from '../hooks/useSettings';

interface ImportDataProps {
  onImportComplete?: () => void;
}

export function ImportData({ onImportComplete }: ImportDataProps) {
  const { addArtists, clearArtists } = useArtists();
  const { addSales, clearSales } = useSales();
  const { addSettings, clearSettings } = useSettings();
  const [artistsError, setArtistsError] = React.useState<string>('');
  const [salesError, setSalesError] = React.useState<string>('');
  const [settingsError, setSettingsError] = React.useState<string>('');

  const validateArtist = (artist: any): boolean => {
    if (!artist.artistcode) {
      throw new Error('Artist Code is required');
    }
    if (!artist.firstname || !artist.lastname) {
      throw new Error('First name and last name are required');
    }
    if (!artist.commissionrate || isNaN(Number(artist.commissionrate))) {
      throw new Error('Commission rate must be a valid number');
    }
    if (!artist.classification || !['Member', 'Gift Shop', 'Community Gallery', 'Guest Gallery', 'Former Member', 'Self'].includes(artist.classification)) {
      throw new Error('Invalid classification');
    }
    return true;
  };

  const validateSale = (sale: any): boolean => {
    const requiredFields = {
      date: 'Date',
      artistcode: 'Artist Code',
      qty: 'Quantity',
      grosssales: 'Gross Sales'
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!sale[field] && sale[field] !== 0) {
        throw new Error(`${label} is required`);
      }
    }

    if (isNaN(Number(sale.qty))) {
      throw new Error('Quantity must be a number');
    }

    if (isNaN(Number(sale.grosssales))) {
      throw new Error('Gross Sales must be a number');
    }

    let dateStr = sale.date;
    let parsedDate: Date | null = null;

    const formats = [
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (format === formats[0]) {
          const [_, year, month, day] = match;
          parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
          const [_, month, day, year] = match;
          parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        }
        break;
      }
    }

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD or MM/DD/YYYY');
    }

    return true;
  };

  const validateSetting = (setting: any): boolean => {
    if (!setting.parametername || !setting.parametervalue) {
      throw new Error('Parameter name and value are required');
    }
    return true;
  };

  const handleArtistsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      transformHeader: (header: string) => header.toLowerCase().replace(/\s+/g, ''),
      complete: async (results) => {
        try {
          const artists = results.data;
          if (!Array.isArray(artists) || artists.length === 0) {
            throw new Error('No valid data found in file');
          }

          artists.forEach(validateArtist);
          await clearArtists();
          await addArtists(artists);
          setArtistsError('');
          if (onImportComplete) onImportComplete();
        } catch (error) {
          setArtistsError(`Error processing artists file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      error: (error) => {
        setArtistsError(`Error reading artists file: ${error.message}`);
      }
    });
  };

  const handleSalesFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      transformHeader: (header: string) => header.toLowerCase().replace(/\s+/g, ''),
      complete: async (results) => {
        try {
          const sales = results.data;
          if (!Array.isArray(sales) || sales.length === 0) {
            throw new Error('No valid data found in file');
          }

          sales.forEach(validateSale);
          await addSales(sales);
          setSalesError('');
          if (onImportComplete) onImportComplete();
        } catch (error) {
          setSalesError(`Error processing sales file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      error: (error) => {
        setSalesError(`Error reading sales file: ${error.message}`);
      }
    });
  };

  const handleSettingsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      transformHeader: (header: string) => header.toLowerCase().replace(/\s+/g, ''),
      complete: async (results) => {
        try {
          const settings = results.data;
          if (!Array.isArray(settings) || settings.length === 0) {
            throw new Error('No valid data found in file');
          }

          settings.forEach(validateSetting);
          await clearSettings();
          await addSettings(settings);
          setSettingsError('');
          if (onImportComplete) onImportComplete();
        } catch (error) {
          setSettingsError(`Error processing settings file: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      error: (error) => {
        setSettingsError(`Error reading settings file: ${error.message}`);
      }
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Import Artists</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleArtistsFile}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {artistsError && <p className="text-red-500 mt-2">{artistsError}</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Import Sales</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleSalesFile}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {salesError && <p className="text-red-500 mt-2">{salesError}</p>}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Import Settings</h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleSettingsFile}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {settingsError && <p className="text-red-500 mt-2">{settingsError}</p>}
        </div>
      </div>
    </div>
  );
}

export default ImportData;