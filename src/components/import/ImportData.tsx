import React from 'react';
import Papa from 'papaparse';
import { useArtists } from '../../hooks/useArtists';
import { useSales } from '../../hooks/useSales';
import { useSettings } from '../../hooks/useSettings';
import { FileUploader } from './FileUploader';
import { validateArtist, validateSale, validateSetting } from './validators';

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

  const handleArtistsFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().replace(/\s+/g, ''),
      complete: async (results) => {
        try {
          const artists = results.data;
          if (!Array.isArray(artists) || artists.length === 0) {
            throw new Error('No valid data found in file');
          }

          const validArtists = artists.map((artist, index) => {
            const validationResult = validateArtist(artist);
            if (!validationResult.isValid) {
              throw new Error(`Row ${index + 1}: ${validationResult.error}`);
            }
            return validationResult.data;
          });

          await clearArtists();
          await addArtists(validArtists);
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
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().replace(/\s+/g, ''),
      complete: async (results) => {
        try {
          const sales = results.data;
          if (!Array.isArray(sales) || sales.length === 0) {
            throw new Error('No valid data found in file');
          }

          const validSales = sales.map((sale, index) => {
            const validationResult = validateSale(sale);
            if (!validationResult.isValid) {
              throw new Error(`Row ${index + 1}: ${validationResult.error}`);
            }
            return validationResult.data;
          });

          await clearSales();
          await addSales(validSales);
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
      skipEmptyLines: true,
      transformHeader: (header: string) => header.toLowerCase().replace(/\s+/g, ''),
      complete: async (results) => {
        try {
          const settings = results.data;
          if (!Array.isArray(settings) || settings.length === 0) {
            throw new Error('No valid data found in file');
          }

          const validSettings = settings.map((setting, index) => {
            const validationResult = validateSetting(setting);
            if (!validationResult.isValid) {
              throw new Error(`Row ${index + 1}: ${validationResult.error}`);
            }
            return validationResult.data;
          });

          await clearSettings();
          await addSettings(validSettings);
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
        <FileUploader
          title="Import Artists"
          onFileSelect={handleArtistsFile}
          error={artistsError}
        />
        <FileUploader
          title="Import Sales"
          onFileSelect={handleSalesFile}
          error={salesError}
        />
        <FileUploader
          title="Import Settings"
          onFileSelect={handleSettingsFile}
          error={settingsError}
        />
      </div>
    </div>
  );
}