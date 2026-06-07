import React, { useState } from 'react';
import { ChevronDown, Clock, Cloud, Timer, Languages, Smile } from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { usePixieStore } from '../store';
import type { ModuleId, StandbyConfig, ClockConfig, WeatherConfig, TimerConfig, TranslatorConfig } from '../types';

const MODULE_META: Record<ModuleId, { label: string; icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  standby: { label: 'Standby', icon: Smile, desc: 'Cara animada con expresiones cuando PIXIE está en reposo.' },
  clock: { label: 'Reloj', icon: Clock, desc: 'Hora y fecha sincronizadas por NTP, mostradas en la OLED.' },
  weather: { label: 'Clima', icon: Cloud, desc: 'Temperatura de tu ciudad vía Open-Meteo (sin API key).' },
  timer: { label: 'Timer', icon: Timer, desc: 'Cronómetro regresivo con alarma sonora via buzzer.' },
  translator: { label: 'Traductor', icon: Languages, desc: 'Voz a texto con INMP441, traducción ES → IT vía MyMemory.' },
};

interface ModuleCardProps {
  moduleId: ModuleId;
}

export function ModuleCard({ moduleId }: ModuleCardProps) {
  const { modules, toggleModule, updateModuleConfig } = usePixieStore();
  const mod = modules[moduleId];
  const meta = MODULE_META[moduleId];
  const Icon = meta.icon;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      mod.enabled
        ? 'border-primary/25 bg-primary/5 glow-sm'
        : 'border-white/8 bg-white/[0.03]'
    }`}>
      <div className="flex items-center gap-4 p-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
          mod.enabled ? 'bg-primary/20' : 'bg-white/8'
        }`}>
          <Icon className={`w-5 h-5 transition-colors ${mod.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">{meta.label}</span>
            {!mod.enabled && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5 text-muted-foreground uppercase tracking-wide">
                off
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">{meta.desc}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {mod.enabled && (
            <button
              onClick={() => setExpanded(v => !v)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-all cursor-pointer ${
                expanded ? 'rotate-180' : ''
              }`}
            >
              <ChevronDown className="w-4 h-4 transition-transform duration-300" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
          )}
          <Switch.Root
            checked={mod.enabled}
            onCheckedChange={() => toggleModule(moduleId)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              mod.enabled ? 'bg-primary' : 'bg-white/20'
            }`}
          >
            <Switch.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
          </Switch.Root>
        </div>
      </div>

      {/* Expandable config */}
      {mod.enabled && expanded && (
        <div className="border-t border-white/8 px-4 py-4 space-y-4 bg-white/[0.02]">
          {moduleId === 'standby' && <StandbyConfig config={mod.config as StandbyConfig} onChange={c => updateModuleConfig(moduleId, c)} />}
          {moduleId === 'clock' && <ClockConfigPanel config={mod.config as ClockConfig} onChange={c => updateModuleConfig(moduleId, c)} />}
          {moduleId === 'weather' && <WeatherConfigPanel config={mod.config as WeatherConfig} onChange={c => updateModuleConfig(moduleId, c)} />}
          {moduleId === 'timer' && <TimerConfigPanel config={mod.config as TimerConfig} onChange={c => updateModuleConfig(moduleId, c)} />}
          {moduleId === 'translator' && <TranslatorConfigPanel config={mod.config as TranslatorConfig} onChange={c => updateModuleConfig(moduleId, c)} />}
        </div>
      )}
    </div>
  );
}

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      {children}
    </div>
  );
}

function SelectInput({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function StandbyConfig({ config, onChange }: { config: StandbyConfig; onChange: (c: Partial<StandbyConfig>) => void }) {
  return (
    <div className="space-y-3">
      <ConfigRow label="Expresión inicial">
        <SelectInput
          value={config.expression}
          onChange={v => onChange({ expression: v as StandbyConfig['expression'] })}
          options={[
            { value: 'blink', label: 'Blink' },
            { value: 'happy', label: 'Happy' },
            { value: 'boring', label: 'Boring' },
            { value: 'angry', label: 'Angry' },
            { value: 'zzz', label: 'Zzz' },
            { value: 'cry', label: 'Cry' },
          ]}
        />
      </ConfigRow>
      <ConfigRow label="Velocidad animación">
        <SelectInput
          value={config.speed}
          onChange={v => onChange({ speed: v as StandbyConfig['speed'] })}
          options={[
            { value: 'slow', label: 'Lento' },
            { value: 'normal', label: 'Normal' },
            { value: 'fast', label: 'Rápido' },
          ]}
        />
      </ConfigRow>
    </div>
  );
}

function ClockConfigPanel({ config, onChange }: { config: ClockConfig; onChange: (c: Partial<ClockConfig>) => void }) {
  return (
    <div className="space-y-3">
      <ConfigRow label="Formato">
        <SelectInput
          value={config.format24h ? '24' : '12'}
          onChange={v => onChange({ format24h: v === '24' })}
          options={[{ value: '24', label: '24 horas' }, { value: '12', label: '12 horas' }]}
        />
      </ConfigRow>
      <ConfigRow label="Servidor NTP">
        <input
          type="text"
          value={config.ntpServer}
          onChange={e => onChange({ ntpServer: e.target.value })}
          className="h-8 w-40 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </ConfigRow>
    </div>
  );
}

function WeatherConfigPanel({ config, onChange }: { config: WeatherConfig; onChange: (c: Partial<WeatherConfig>) => void }) {
  return (
    <div className="space-y-3">
      <ConfigRow label="Ciudad">
        <input
          type="text"
          value={config.city}
          onChange={e => onChange({ city: e.target.value })}
          className="h-8 w-36 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </ConfigRow>
      <ConfigRow label="Unidad">
        <SelectInput
          value={config.unit}
          onChange={v => onChange({ unit: v as WeatherConfig['unit'] })}
          options={[{ value: 'celsius', label: '°C' }, { value: 'fahrenheit', label: '°F' }]}
        />
      </ConfigRow>
    </div>
  );
}

function TimerConfigPanel({ config, onChange }: { config: TimerConfig; onChange: (c: Partial<TimerConfig>) => void }) {
  return (
    <div className="space-y-3">
      <ConfigRow label="Minutos por defecto">
        <input
          type="number"
          min={1}
          max={120}
          value={config.defaultMinutes}
          onChange={e => onChange({ defaultMinutes: Number(e.target.value) })}
          className="h-8 w-20 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
      </ConfigRow>
      <ConfigRow label="Buzzer al terminar">
        <Switch.Root
          checked={config.buzzerOnEnd}
          onCheckedChange={v => onChange({ buzzerOnEnd: v })}
          className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${config.buzzerOnEnd ? 'bg-primary' : 'bg-white/20'}`}
        >
          <Switch.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
        </Switch.Root>
      </ConfigRow>
    </div>
  );
}

function TranslatorConfigPanel({ config, onChange }: { config: TranslatorConfig; onChange: (c: Partial<TranslatorConfig>) => void }) {
  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground px-3 py-2 rounded-lg bg-white/5 border border-white/8">
        Traducción fija: <span className="text-foreground font-medium">Español → Italiano</span> via MyMemory API
      </div>
      <ConfigRow label="Micrófono INMP441">
        <Switch.Root
          checked={config.micEnabled}
          onCheckedChange={v => onChange({ micEnabled: v })}
          className={`relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${config.micEnabled ? 'bg-primary' : 'bg-white/20'}`}
        >
          <Switch.Thumb className="pointer-events-none block h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0" />
        </Switch.Root>
      </ConfigRow>
      {!config.micEnabled && (
        <p className="text-xs text-amber-400/70">El micrófono INMP441 es necesario para el traductor.</p>
      )}
    </div>
  );
}
