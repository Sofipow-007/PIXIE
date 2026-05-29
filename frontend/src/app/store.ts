import { useState, useCallback } from 'react';
import type { PixieStore, ModuleId, GlobalSettings, DeviceStatus, WidgetConfig } from './types';

const DEFAULT_STORE: PixieStore = {
  global: {
    deviceName: 'PIXIE',
    oledBrightness: 80,
    buzzerVolume: 60,
    deviceToken: '',
    wifiSSID: '',
    wifiPassword: '',
    city: 'Buenos Aires',
    language: 'es',
    timezone: 'America/Argentina/Buenos_Aires',
  },
  modules: {
    standby:    { enabled: true,  config: { animationSpeed: 'normal', gifKey: 'blink', enabledGifs: ['happy', 'boring', 'angry', 'zzz1', 'blink'] } },
    clock:      { enabled: true,  config: { format: '24h', showDate: true, showSeconds: false, timezone: 'America/Argentina/Buenos_Aires' } },
    weather:    { enabled: false, config: { city: 'Buenos Aires', unit: 'C', updateIntervalMin: 5 } },
    timer:      { enabled: false, config: { defaultMinutes: 5, alarmSound: true, buzzerTone: 'beep' } },
    translator: { enabled: false, config: { sourceLang: 'es', targetLang: 'it', micThreshold: 30 } },
  },
  device: { online: false, lastSync: null, firmwareVersion: 'v1.0.0', currentMode: 'idle' },
  desktopModeActive: false,
  widgetConfig: { size: 'medium', corner: 'br', opacity: 90 },
};

function loadStore(): PixieStore {
  try {
    const saved = localStorage.getItem('pixie-config');
    if (saved) return { ...DEFAULT_STORE, ...JSON.parse(saved) };
  } catch {}
  return DEFAULT_STORE;
}

function saveStore(s: PixieStore) {
  localStorage.setItem('pixie-config', JSON.stringify(s));
}

export function usePixieStore() {
  const [store, setStore] = useState<PixieStore>(loadStore);

  const update = useCallback((next: PixieStore) => {
    saveStore(next);
    setStore(next);
  }, []);

  const patchGlobal = useCallback((patch: Partial<GlobalSettings>) => {
    setStore(s => { const n = { ...s, global: { ...s.global, ...patch } }; saveStore(n); return n; });
  }, []);

  const patchModule = useCallback(<T extends ModuleId>(id: T, patch: Partial<PixieStore['modules'][T]>) => {
    setStore(s => {
      const n = { ...s, modules: { ...s.modules, [id]: { ...s.modules[id], ...patch } } };
      saveStore(n);
      return n;
    });
  }, []);

  const patchModuleConfig = useCallback(<T extends ModuleId>(id: T, configPatch: Partial<PixieStore['modules'][T]['config']>) => {
    setStore(s => {
      const n = { ...s, modules: { ...s.modules, [id]: { ...s.modules[id], config: { ...s.modules[id].config, ...configPatch } } } };
      saveStore(n);
      return n;
    });
  }, []);

  const patchDevice = useCallback((patch: Partial<DeviceStatus>) => {
    setStore(s => { const n = { ...s, device: { ...s.device, ...patch } }; saveStore(n); return n; });
  }, []);

  const setDesktopMode = useCallback((active: boolean) => {
    setStore(s => { const n = { ...s, desktopModeActive: active }; saveStore(n); return n; });
  }, []);

  const patchWidgetConfig = useCallback((patch: Partial<WidgetConfig>) => {
    setStore(s => { const n = { ...s, widgetConfig: { ...s.widgetConfig, ...patch } }; saveStore(n); return n; });
  }, []);

  return { store, update, patchGlobal, patchModule, patchModuleConfig, patchDevice, setDesktopMode, patchWidgetConfig };
}