export type ModuleId = 'standby' | 'clock' | 'weather' | 'timer' | 'translator';
export type GifKey = 'blink' | 'happy' | 'boring' | 'angry' | 'zzz1' | 'zzz2' | 'cry1' | 'cry2';

export interface StandbyConfig { animationSpeed: 'slow' | 'normal' | 'fast'; gifKey: GifKey; enabledGifs: GifKey[]; }
export interface ClockConfig { format: '12h' | '24h'; showDate: boolean; showSeconds: boolean; timezone: string; }
export interface WeatherConfig { city: string; unit: 'C' | 'F'; updateIntervalMin: number; }
export interface TimerConfig { defaultMinutes: number; alarmSound: boolean; buzzerTone: string; }
export interface TranslatorConfig { sourceLang: string; targetLang: string; micThreshold: number; }

export type ModuleConfig = StandbyConfig | ClockConfig | WeatherConfig | TimerConfig | TranslatorConfig;

export interface ModuleState<T extends ModuleConfig = ModuleConfig> {
  enabled: boolean;
  config: T;
}

export interface GlobalSettings {
  deviceName: string;
  oledBrightness: number;
  buzzerVolume: number;
  deviceToken: string;
  wifiSSID: string;
  wifiPassword: string;
  city: string;
  language: string;
  timezone: string;
}

export interface DeviceStatus {
  online: boolean;
  lastSync: string | null;
  firmwareVersion: string;
  currentMode: ModuleId | 'idle';
}

export interface WidgetConfig {
  size: 'small' | 'medium' | 'large';
  corner: 'tl' | 'tr' | 'bl' | 'br';
  opacity: number;
}

export interface PixieStore {
  global: GlobalSettings;
  modules: {
    standby: ModuleState<StandbyConfig>;
    clock: ModuleState<ClockConfig>;
    weather: ModuleState<WeatherConfig>;
    timer: ModuleState<TimerConfig>;
    translator: ModuleState<TranslatorConfig>;
  };
  device: DeviceStatus;
  desktopModeActive: boolean;
  widgetConfig: WidgetConfig;
}