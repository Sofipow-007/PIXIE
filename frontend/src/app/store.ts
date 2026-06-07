import { useState, useCallback, useEffect } from 'react';
import type { PixieStore, PixieMode, ModuleId, ModuleConfig, WiFiConfig, PixieModule } from './types';

const STORE_KEY = 'pixie_store_v1';

const defaultModules: Record<ModuleId, PixieModule> = {
  standby: {
    id: 'standby',
    enabled: true,
    config: { expression: 'blink', speed: 'normal' },
  },
  clock: {
    id: 'clock',
    enabled: true,
    config: { ntpServer: 'pool.ntp.org', timezone: 'America/Argentina/Buenos_Aires', format24h: true },
  },
  weather: {
    id: 'weather',
    enabled: true,
    config: { city: 'Buenos Aires', unit: 'celsius' },
  },
  timer: {
    id: 'timer',
    enabled: false,
    config: { defaultMinutes: 25, buzzerOnEnd: true },
  },
  translator: {
    id: 'translator',
    enabled: false,
    config: { sourceLang: 'es', targetLang: 'it', micEnabled: false },
  },
};

interface PersistableState {
  deviceName: string;
  city: string;
  language: 'es' | 'en' | 'it';
  timezone: string;
  pixieMode: PixieMode;
  onboardingComplete: boolean;
  hasPhysicalDevice: boolean;
  wifi: WiFiConfig | null;
  oledBrightness: number;
  buzzerVolume: number;
  firmwareVersion: string;
  apiToken: string;
  modules: Record<ModuleId, PixieModule>;
}

const defaultState: PersistableState = {
  deviceName: 'PIXIE',
  city: 'Buenos Aires',
  language: 'es',
  timezone: 'America/Argentina/Buenos_Aires',
  pixieMode: 'digital',
  onboardingComplete: false,
  hasPhysicalDevice: false,
  wifi: null,
  oledBrightness: 80,
  buzzerVolume: 60,
  firmwareVersion: '1.0.0',
  apiToken: '',
  modules: defaultModules,
};

function loadState(): PersistableState {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { ...defaultState };
    const saved = JSON.parse(raw);
    return {
      ...defaultState,
      ...saved,
      modules: { ...defaultModules, ...(saved.modules ?? {}) },
    };
  } catch {
    return { ...defaultState };
  }
}

function persist(state: PersistableState) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {}
}

let globalState = loadState();
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

function set(partial: Partial<PersistableState>) {
  globalState = { ...globalState, ...partial };
  persist(globalState);
  notify();
}

export function usePixieStore(): PixieStore {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const update = () => setTick(n => n + 1);
    listeners.add(update);
    return () => { listeners.delete(update); };
  }, []);

  void tick;

  const setDeviceName = useCallback((deviceName: string) => set({ deviceName }), []);
  const setCity = useCallback((city: string) => set({ city }), []);
  const setLanguage = useCallback((language: PixieStore['language']) => set({ language }), []);
  const setTimezone = useCallback((timezone: string) => set({ timezone }), []);
  const setPixieMode = useCallback((pixieMode: PixieMode) => set({ pixieMode }), []);
  const setOnboardingComplete = useCallback((onboardingComplete: boolean) => set({ onboardingComplete }), []);
  const setHasPhysicalDevice = useCallback((hasPhysicalDevice: boolean) => set({ hasPhysicalDevice }), []);
  const setWifi = useCallback((wifi: WiFiConfig | null) => set({ wifi }), []);
  const setOledBrightness = useCallback((oledBrightness: number) => set({ oledBrightness }), []);
  const setBuzzerVolume = useCallback((buzzerVolume: number) => set({ buzzerVolume }), []);
  const setApiToken = useCallback((apiToken: string) => set({ apiToken }), []);

  const toggleModule = useCallback((id: ModuleId) => {
    const modules = { ...globalState.modules };
    modules[id] = { ...modules[id], enabled: !modules[id].enabled };
    set({ modules });
  }, []);

  const updateModuleConfig = useCallback((id: ModuleId, config: Partial<ModuleConfig>) => {
    const modules = { ...globalState.modules };
    modules[id] = { ...modules[id], config: { ...modules[id].config, ...config } as ModuleConfig };
    set({ modules });
  }, []);

  const resetStore = useCallback(() => {
    globalState = { ...defaultState, modules: { ...defaultModules } };
    persist(globalState);
    notify();
  }, []);

  return {
    ...globalState,
    setDeviceName,
    setCity,
    setLanguage,
    setTimezone,
    setPixieMode,
    setOnboardingComplete,
    setHasPhysicalDevice,
    setWifi,
    setOledBrightness,
    setBuzzerVolume,
    setApiToken,
    toggleModule,
    updateModuleConfig,
    resetStore,
  };
}
