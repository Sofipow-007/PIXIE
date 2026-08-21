export type PixieMode = 'physical' | 'digital';

export type ModuleId = 'standby' | 'clock' | 'weather' | 'timer' | 'translator';

export interface StandbyConfig {
  expression: 'blink' | 'happy' | 'boring' | 'angry' | 'zzz' | 'cry';
  speed: 'slow' | 'normal' | 'fast';
}

export interface ClockConfig {
  ntpServer: string;
  timezone: string;
  format24h: boolean;
}

export interface WeatherConfig {
  city: string;
  unit: 'celsius' | 'fahrenheit';
}

export interface TimerConfig {
  defaultMinutes: number;
  buzzerOnEnd: boolean;
}

export interface TranslatorConfig {
  sourceLang: 'es';
  targetLang: 'it';
  micEnabled: boolean;
}

export type ModuleConfig = StandbyConfig | ClockConfig | WeatherConfig | TimerConfig | TranslatorConfig;

export interface PixieModule {
  id: ModuleId;
  enabled: boolean;
  config: ModuleConfig;
}

export interface WiFiConfig {
  ssid: string;
  password: string;
}

export interface PixieStore {
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

  setDeviceName: (name: string) => void;
  setCity: (city: string) => void;
  setLanguage: (lang: PixieStore['language']) => void;
  setTimezone: (tz: string) => void;
  setPixieMode: (mode: PixieMode) => void;
  setOnboardingComplete: (complete: boolean) => void;
  setHasPhysicalDevice: (has: boolean) => void;
  setWifi: (wifi: WiFiConfig | null) => void;
  setOledBrightness: (brightness: number) => void;
  setBuzzerVolume: (volume: number) => void;
  setApiToken: (token: string) => void;
  toggleModule: (id: ModuleId) => void;
  updateModuleConfig: (id: ModuleId, config: Partial<ModuleConfig>) => void;
  resetStore: () => void;
}

export type PhysicalTab = 'dashboard' | 'modules' | 'settings' | 'power';
export type DigitalTab = 'chat' | 'companion' | 'desktop' | 'settings';
