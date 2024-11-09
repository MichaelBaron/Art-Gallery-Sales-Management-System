import { useStore } from '../store';

export const useSettings = () => {
  const store = useStore();

  return {
    settings: store.settings,
    addSettings: async (settings: any[]) => {
      store.setSettings(settings.map(setting => ({
        parameterName: setting.parametername,
        parameterValue: setting.parametervalue,
        notes: setting.notes
      })));
    },
    clearSettings: async () => {
      store.setSettings([]);
    }
  };
};