import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { WiFiModal } from '../WiFiModal';
import type { PixieStore, GlobalSettings } from '../../types';

const LANGUAGES = [
  { value: 'es', label: 'Spanish' }, { value: 'en', label: 'English' },
  { value: 'it', label: 'Italian' }, { value: 'pt', label: 'Portuguese' },
];
const TIMEZONES = ['America/Argentina/Buenos_Aires', 'America/New_York', 'Europe/London', 'Europe/Madrid', 'Asia/Tokyo'];

const fieldClass = 'h-9 border border-border bg-input px-3 text-sm w-full text-foreground font-mono focus:outline-none focus:border-primary/50 transition-colors';
const labelClass = 'text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-1.5 font-mono';

interface Props {
  store: PixieStore;
  patchGlobal: (p: Partial<GlobalSettings>) => void;
}

export function GlobalSettingsView({ store, patchGlobal }: Props) {
  const { global } = store;
  const [wifiOpen, setWifiOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToken = () => {
    navigator.clipboard.writeText(global.deviceToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="pb-1">
        <h1 className="text-sm font-semibold tracking-[0.1em] text-foreground font-mono uppercase">Settings</h1>
        <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">configure your PIXIE device preferences</p>
      </div>

      {/* Device section */}
      <section className="border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Device</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className={labelClass}>Device Name</label>
            <input
              defaultValue={global.deviceName}
              onBlur={e => { patchGlobal({ deviceName: e.target.value }); toast.success('Settings saved'); }}
              className={fieldClass}
            />
          </div>
          <div>
            <label className={labelClass}>Language</label>
            <select
              value={global.language}
              onChange={e => patchGlobal({ language: e.target.value })}
              className={fieldClass}
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Timezone</label>
            <select
              value={global.timezone}
              onChange={e => patchGlobal({ timezone: e.target.value })}
              className={fieldClass}
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>City (for Weather)</label>
            <input
              defaultValue={global.city}
              onBlur={e => { patchGlobal({ city: e.target.value }); toast.success('Settings saved'); }}
              placeholder="Buenos Aires"
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      {/* Display section */}
      <section className="border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Display</h2>
        </div>
        <div className="p-4">
          <label className={labelClass}>OLED Brightness: <span className="text-primary">{global.oledBrightness}%</span></label>
          <input
            type="range" min={0} max={100}
            value={global.oledBrightness}
            onChange={e => patchGlobal({ oledBrightness: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </section>

      {/* Sound section */}
      <section className="border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Sound</h2>
        </div>
        <div className="p-4">
          <label className={labelClass}>Buzzer Volume: <span className="text-primary">{global.buzzerVolume}%</span></label>
          <input
            type="range" min={0} max={100}
            value={global.buzzerVolume}
            onChange={e => patchGlobal({ buzzerVolume: Number(e.target.value) })}
            className="w-full"
          />
        </div>
      </section>

      {/* Connection section */}
      <section className="border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Connection</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className={labelClass}>WiFi Network</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={global.wifiSSID || 'not configured'}
                className={`${fieldClass} flex-1 text-muted-foreground bg-muted/40`}
              />
              <button
                onClick={() => setWifiOpen(true)}
                className="h-9 px-3 border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer font-mono"
              >
                change
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Device Token</label>
            <div className="flex gap-2">
              <input
                type="password"
                defaultValue={global.deviceToken}
                onBlur={e => patchGlobal({ deviceToken: e.target.value })}
                placeholder="enter token from backend"
                className={`${fieldClass} flex-1`}
              />
              <button
                onClick={copyToken}
                className="h-9 px-3 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      <WiFiModal
        open={wifiOpen}
        onClose={() => setWifiOpen(false)}
        initialSSID={global.wifiSSID}
        onSave={(ssid, pw) => patchGlobal({ wifiSSID: ssid, wifiPassword: pw })}
      />
    </div>
  );
}
