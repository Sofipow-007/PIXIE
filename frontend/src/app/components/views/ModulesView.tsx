import React, { useState, useEffect } from 'react';
import { Clock, Cloud, Timer, Languages } from 'lucide-react';
import { GIFS } from '../../gifs';
import { ModuleCard } from '../ModuleCard';
import type { PixieStore, ModuleId, GifKey } from '../../types';

const LANGUAGES = [
  { value: 'es', label: 'Spanish' }, { value: 'en', label: 'English' },
  { value: 'it', label: 'Italian' }, { value: 'pt', label: 'Portuguese' },
  { value: 'fr', label: 'French'  }, { value: 'de', label: 'German'   },
];
const TIMEZONES = ['America/Argentina/Buenos_Aires', 'America/New_York', 'Europe/London', 'Europe/Madrid', 'Asia/Tokyo'];
const BUZZER_TONES = ['beep', 'melody', 'alarm', 'gentle'];
const GIF_KEYS: GifKey[] = ['blink', 'happy', 'boring', 'angry', 'zzz1', 'zzz2', 'cry1', 'cry2'];

const fieldClass = 'h-9 border border-border bg-input px-3 text-sm w-full text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors';
const labelClass = 'text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-1.5 font-mono';

interface Props {
  store: PixieStore;
  patchModule: (id: ModuleId, patch: any) => void;
  patchModuleConfig: (id: ModuleId, config: any) => void;
}

export function ModulesView({ store, patchModule, patchModuleConfig }: Props) {
  const { modules } = store;
  const [clockTime, setClockTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setClockTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const clockFmt = (modules.clock.config as any).format === '12h'
    ? clockTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : clockTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="pb-1">
        <h1 className="text-sm font-semibold tracking-[0.1em] text-foreground font-mono uppercase">Modules</h1>
        <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">toggle and configure what PIXIE displays</p>
      </div>

      <ModuleCard
        icon={<span className="text-base">:)</span>}
        title="Standby"
        description="Animated face with random expressions"
        enabled={modules.standby.enabled}
        onToggle={v => patchModule('standby', { enabled: v })}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Expression Preview</label>
            <div className="flex gap-1.5 flex-wrap">
              {GIF_KEYS.map(k => (
                <button
                  key={k}
                  onClick={() => patchModuleConfig('standby', { gifKey: k })}
                  className={`relative overflow-hidden border transition-all cursor-pointer ${
                    (modules.standby.config as any).gifKey === k
                      ? 'border-primary'
                      : 'border-border opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={GIFS[k]} alt={k} className="w-12 h-12 object-contain bg-muted" />
                  <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] bg-black/60 text-white py-0.5 font-mono">{k}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Animation Speed</label>
            <select
              value={(modules.standby.config as any).animationSpeed}
              onChange={e => patchModuleConfig('standby', { animationSpeed: e.target.value })}
              className={fieldClass}
            >
              <option value="slow">Slow</option>
              <option value="normal">Normal</option>
              <option value="fast">Fast</option>
            </select>
          </div>
        </div>
      </ModuleCard>

      <ModuleCard
        icon={<Clock className="w-4 h-4" />}
        title="Clock & Date"
        description="NTP-synced time display"
        enabled={modules.clock.enabled}
        onToggle={v => patchModule('clock', { enabled: v })}
        badge="NTP"
      >
        <div className="space-y-4">
          <div className="bg-muted/40 border border-border px-4 py-3 text-center">
            <span className="text-2xl font-mono font-bold text-primary">{clockFmt}</span>
            {(modules.clock.config as any).showDate && (
              <p className="text-[11px] text-muted-foreground mt-1 font-mono">
                {clockTime.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>Time Format</label>
            <div className="flex gap-2">
              {(['12h', '24h'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => patchModuleConfig('clock', { format: f })}
                  className={`flex-1 h-8 border text-sm font-mono transition-colors cursor-pointer ${
                    (modules.clock.config as any).format === f
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Show Date</label>
            <input type="checkbox" checked={(modules.clock.config as any).showDate} onChange={e => patchModuleConfig('clock', { showDate: e.target.checked })} className="w-4 h-4" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Show Seconds</label>
            <input type="checkbox" checked={(modules.clock.config as any).showSeconds} onChange={e => patchModuleConfig('clock', { showSeconds: e.target.checked })} className="w-4 h-4" />
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
            <select
              value={(modules.clock.config as any).timezone}
              onChange={e => patchModuleConfig('clock', { timezone: e.target.value })}
              className={fieldClass}
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>
      </ModuleCard>

      <ModuleCard
        icon={<Cloud className="w-4 h-4" />}
        title="Weather"
        description="Open-Meteo API — no key required"
        enabled={modules.weather.enabled}
        onToggle={v => patchModule('weather', { enabled: v })}
        badge="Open-Meteo"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>City</label>
            <input
              value={(modules.weather.config as any).city}
              onChange={e => patchModuleConfig('weather', { city: e.target.value })}
              placeholder="Buenos Aires"
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Temperature Unit</label>
            <div className="flex gap-2">
              {(['C', 'F'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => patchModuleConfig('weather', { unit: u })}
                  className={`flex-1 h-8 border text-sm font-mono transition-colors cursor-pointer ${
                    (modules.weather.config as any).unit === u
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:border-primary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  °{u}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Update Interval: {(modules.weather.config as any).updateIntervalMin} min</label>
            <input
              type="range" min={1} max={30}
              value={(modules.weather.config as any).updateIntervalMin}
              onChange={e => patchModuleConfig('weather', { updateIntervalMin: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </ModuleCard>

      <ModuleCard
        icon={<Timer className="w-4 h-4" />}
        title="Timer"
        description="Countdown timer with buzzer alarm"
        enabled={modules.timer.enabled}
        onToggle={v => patchModule('timer', { enabled: v })}
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Default Duration: {(modules.timer.config as any).defaultMinutes} min</label>
            <input
              type="range" min={1} max={60}
              value={(modules.timer.config as any).defaultMinutes}
              onChange={e => patchModuleConfig('timer', { defaultMinutes: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className={labelClass}>Buzzer Tone</label>
            <select
              value={(modules.timer.config as any).buzzerTone}
              onChange={e => patchModuleConfig('timer', { buzzerTone: e.target.value })}
              className={fieldClass}
            >
              {BUZZER_TONES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs text-foreground">Alarm Sound</label>
            <input type="checkbox" checked={(modules.timer.config as any).alarmSound} onChange={e => patchModuleConfig('timer', { alarmSound: e.target.checked })} className="w-4 h-4" />
          </div>
        </div>
      </ModuleCard>

      <ModuleCard
        icon={<Languages className="w-4 h-4" />}
        title="Translator"
        description="Voice-to-text with INMP441 mic — ES→IT"
        enabled={modules.translator.enabled}
        onToggle={v => patchModule('translator', { enabled: v })}
        badge="INMP441"
      >
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Source Language</label>
            <select
              value={(modules.translator.config as any).sourceLang}
              onChange={e => patchModuleConfig('translator', { sourceLang: e.target.value })}
              className={fieldClass}
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Target Language</label>
            <select
              value={(modules.translator.config as any).targetLang}
              onChange={e => patchModuleConfig('translator', { targetLang: e.target.value })}
              className={fieldClass}
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Mic Threshold: {(modules.translator.config as any).micThreshold}%</label>
            <input
              type="range" min={0} max={100}
              value={(modules.translator.config as any).micThreshold}
              onChange={e => patchModuleConfig('translator', { micThreshold: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-400 font-mono">
            Requires INMP441 microphone and Google Speech-to-Text API key configured in backend.
          </div>
        </div>
      </ModuleCard>
    </div>
  );
}
