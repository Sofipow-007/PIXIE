import React from 'react';
import { Wifi, WifiOff, RefreshCw, Clock, Cloud, Timer, Languages, Cpu, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { PixieStore, ModuleId } from '../../types';
import type { ViewId } from '../App';
import pixieEyes from '../../../images/PIXIE-LogoEyes.png';

const MODULE_LABELS: Record<ModuleId, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  standby:    { label: 'Standby',    icon: Cpu },
  clock:      { label: 'Clock',      icon: Clock },
  weather:    { label: 'Weather',    icon: Cloud },
  timer:      { label: 'Timer',      icon: Timer },
  translator: { label: 'Translator', icon: Languages },
};

interface Props {
  store: PixieStore;
  patchDevice: (p: Partial<PixieStore['device']>) => void;
  setActiveView: (v: ViewId) => void;
}

export function HomeView({ store, patchDevice, setActiveView }: Props) {
  const { device, global, modules } = store;
  const enabledCount = Object.values(modules).filter(m => m.enabled).length;

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div>
          <h1 className="text-sm font-semibold tracking-[0.1em] text-foreground font-mono uppercase">Dashboard</h1>
          <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">device monitor</p>
        </div>
        <button
          onClick={() => toast.info('No device connected — running in Demo Mode')}
          className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer font-mono"
        >
          <RefreshCw className="w-3 h-3" />
          sync
        </button>
      </div>

      {/* Device card */}
      <div className="border border-border bg-card p-4 flex items-center gap-4">
        <img src={pixieEyes} alt="PIXIE" className="w-12 h-12 object-contain" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-sm text-foreground font-mono">{global.deviceName}</h2>
            <span className={`text-[9px] px-2 py-0.5 font-mono font-bold tracking-[0.15em] border ${
              device.online
                ? 'border-primary/30 bg-primary/8 text-primary'
                : 'border-amber-400/30 bg-amber-400/8 text-amber-400'
            }`}>
              {device.online ? 'ONLINE' : 'DEMO'}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono">fw {device.firmwareVersion}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-0.5 font-mono">
            last sync: {device.lastSync ? new Date(device.lastSync).toLocaleString() : 'never'}
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-border bg-card p-4">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-2 font-mono">active modules</p>
          <p className="text-2xl font-bold font-mono text-foreground">
            {enabledCount}
            <span className="text-sm text-muted-foreground font-normal"> / 5</span>
          </p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-2 font-mono">city</p>
          <p className="text-lg font-bold font-mono truncate text-foreground">{global.city || '—'}</p>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-2 font-mono">wifi</p>
          <div className="flex items-center gap-1.5">
            {global.wifiSSID
              ? <Wifi className="w-3 h-3 text-primary shrink-0" />
              : <WifiOff className="w-3 h-3 text-muted-foreground shrink-0" />
            }
            <p className="text-[11px] font-mono truncate">{global.wifiSSID || 'unconfigured'}</p>
          </div>
        </div>
        <div className="border border-border bg-card p-4">
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] mb-2 font-mono">mode</p>
          <p className="text-sm font-bold font-mono capitalize text-foreground">{device.currentMode}</p>
        </div>
      </div>

      {/* Module status */}
      <div className="border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] text-muted-foreground uppercase tracking-[0.15em] font-mono">module status</span>
          <button
            onClick={() => setActiveView('modules')}
            className="text-[10px] text-primary hover:underline font-mono cursor-pointer"
          >
            configure →
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.entries(MODULE_LABELS) as [ModuleId, typeof MODULE_LABELS[ModuleId]][]).map(([id, { label, icon: Icon }]) => (
            <div
              key={id}
              className={`flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono border transition-colors ${
                modules[id].enabled
                  ? 'border-primary/25 text-primary'
                  : 'border-border text-muted-foreground'
              }`}
            >
              <Icon className="w-2.5 h-2.5" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Demo mode warning */}
      {!device.online && (
        <div className="border border-amber-500/20 bg-amber-500/5 p-3 flex gap-3 items-start">
          <Zap className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-amber-400 font-mono tracking-[0.1em] uppercase">demo mode active</p>
            <p className="text-[11px] text-muted-foreground mt-1">Configure WiFi in Settings to connect to a physical PIXIE device.</p>
          </div>
        </div>
      )}
    </div>
  );
}
