import React from 'react';
import {
  Cpu, Wifi, WifiOff, RefreshCw, Clock, Cloud, Timer, Languages, Smile,
  Activity, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { usePixieStore } from '../../store';
import pixieLogo from '../../../images/PIXIE-Logo.png';
import type { ModuleId } from '../../types';

const MODULE_ICONS: Record<ModuleId, React.ComponentType<{ className?: string }>> = {
  standby: Smile,
  clock: Clock,
  weather: Cloud,
  timer: Timer,
  translator: Languages,
};

const MODULE_LABELS: Record<ModuleId, string> = {
  standby: 'Standby',
  clock: 'Reloj',
  weather: 'Clima',
  timer: 'Timer',
  translator: 'Traductor',
};

export function DashboardView() {
  const { deviceName, wifi, modules, firmwareVersion } = usePixieStore();

  const enabledModules = (Object.keys(modules) as ModuleId[]).filter(id => modules[id].enabled);

  function handleSync() {
    toast.info('Sincronizando con el dispositivo…', {
      description: 'El dispositivo está en modo Demo. Conectá el backend para sync real.',
    });
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">

      {/* Demo mode banner */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/8">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-xs text-amber-400/80">
          <span className="font-semibold text-amber-400">Demo Mode</span> — El dispositivo aparece offline hasta que se conecte el backend WebSocket.
        </p>
      </div>

      {/* Device card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 relative overflow-hidden glow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          {/* Device icon */}
          <div className="w-24 h-24 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
            <img src={pixieLogo} alt="PIXIE" className="w-14 h-14 object-contain opacity-80" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <h2 className="text-xl font-bold font-mono text-foreground">{deviceName}</h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                  Offline / Demo
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Firmware v{firmwareVersion} · ESP32 DevKit v1
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatChip
                icon={Cpu}
                label="Modo"
                value="Standby"
              />
              <StatChip
                icon={wifi ? Wifi : WifiOff}
                label="Red"
                value={wifi?.ssid ?? 'Sin configurar'}
                iconClass={wifi ? 'text-emerald-400' : 'text-zinc-500'}
              />
              <StatChip
                icon={Activity}
                label="Última sync"
                value="—"
              />
            </div>

            <button
              onClick={handleSync}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </button>
          </div>
        </div>
      </div>

      {/* Modules active */}
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-3">
          Módulos del firmware
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {(Object.keys(modules) as ModuleId[]).map(id => {
            const Icon   = MODULE_ICONS[id];
            const active = modules[id].enabled;
            return (
              <div
                key={id}
                className="rounded-xl border p-3 flex flex-col items-center gap-2 transition-all duration-200"
                style={{
                  borderColor: active ? 'oklch(0.73 0.155 192 / 0.2)' : 'oklch(0.22 0.018 210)',
                  background:  active ? 'oklch(0.73 0.155 192 / 0.06)' : 'oklch(0.10 0.006 210)',
                  opacity:     active ? 1 : 0.45,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: active ? 'oklch(0.73 0.155 192 / 0.12)' : 'oklch(0.14 0.008 210)' }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: active ? 'oklch(0.73 0.155 192)' : 'oklch(0.45 0.015 210)' }}
                  />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {MODULE_LABELS[id]}
                </span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-mono"
                  style={{
                    background: active ? 'oklch(0.55 0.18 145 / 0.12)' : 'oklch(0.14 0.008 210)',
                    color:      active ? 'oklch(0.65 0.18 145)'         : 'oklch(0.40 0.015 210)',
                  }}
                >
                  {active ? 'ON' : 'OFF'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  iconClass = 'text-muted-foreground',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  iconClass?: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className={`w-3.5 h-3.5 ${iconClass}`} />
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <span className="text-sm font-semibold text-foreground truncate">{value}</span>
    </div>
  );
}
