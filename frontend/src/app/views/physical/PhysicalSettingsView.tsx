import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { toast } from 'sonner';
import { Wifi, Key, Monitor, Volume2, MapPin, Tag, CheckCircle2 } from 'lucide-react';
import { usePixieStore } from '../../store';
import { WiFiModal } from '../../components/WiFiModal';

export function PhysicalSettingsView() {
  const store = usePixieStore();
  const [name, setName] = useState(store.deviceName);
  const [city, setCity] = useState(store.city);
  const [language, setLanguage] = useState(store.language);
  const [timezone, setTimezone] = useState(store.timezone);
  const [token, setToken] = useState(store.apiToken);
  const [wifiOpen, setWifiOpen] = useState(false);

  function handleSave() {
    store.setDeviceName(name);
    store.setCity(city);
    store.setLanguage(language as 'es' | 'en' | 'it');
    store.setTimezone(timezone);
    store.setApiToken(token);
    toast.success('Configuración guardada', {
      icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
    });
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">Ajustes del dispositivo físico y la app.</p>
      </div>

      <WiFiModal open={wifiOpen} onOpenChange={setWifiOpen} />

      {/* General */}
      <Section title="General" icon={Tag}>
        <Field label="Nombre del dispositivo">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={16}
            className={inputClass}
          />
        </Field>
        <Field label="Ciudad (clima)">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Idioma">
          <select value={language} onChange={e => setLanguage(e.target.value as typeof language)} className={selectClass}>
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="it">Italiano</option>
          </select>
        </Field>
        <Field label="Zona horaria">
          <select value={timezone} onChange={e => setTimezone(e.target.value)} className={selectClass}>
            <option value="America/Argentina/Buenos_Aires">Buenos Aires (ART)</option>
            <option value="America/Sao_Paulo">São Paulo (BRT)</option>
            <option value="America/Santiago">Santiago (CLT)</option>
            <option value="America/Bogota">Bogotá (COT)</option>
            <option value="Europe/Rome">Roma (CET)</option>
            <option value="UTC">UTC</option>
          </select>
        </Field>
      </Section>

      {/* Hardware */}
      <Section title="Pantalla OLED" icon={Monitor}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Brillo</span>
            <span className="text-sm font-mono font-semibold text-primary">{store.oledBrightness}%</span>
          </div>
          <Slider.Root
            value={[store.oledBrightness]}
            onValueChange={([v]) => store.setOledBrightness(v)}
            min={0} max={100} step={5}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-white/10">
              <Slider.Range className="absolute h-full rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 rounded-full border-2 border-primary bg-background shadow-md focus:outline-none cursor-pointer" />
          </Slider.Root>
        </div>
      </Section>

      <Section title="Buzzer" icon={Volume2}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Volumen</span>
            <span className="text-sm font-mono font-semibold text-primary">{store.buzzerVolume}%</span>
          </div>
          <Slider.Root
            value={[store.buzzerVolume]}
            onValueChange={([v]) => store.setBuzzerVolume(v)}
            min={0} max={100} step={5}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-white/10">
              <Slider.Range className="absolute h-full rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb className="block w-4 h-4 rounded-full border-2 border-primary bg-background shadow-md focus:outline-none cursor-pointer" />
          </Slider.Root>
        </div>
      </Section>

      {/* WiFi */}
      <Section title="WiFi" icon={Wifi}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-medium text-foreground block">
              {store.wifi ? store.wifi.ssid : 'No configurado'}
            </span>
            <span className="text-xs text-muted-foreground">
              {store.wifi ? 'Red guardada en el dispositivo' : 'Necesitás WiFi para sync'}
            </span>
          </div>
          <button
            onClick={() => setWifiOpen(true)}
            className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-foreground hover:bg-white/10 transition-colors cursor-pointer"
          >
            {store.wifi ? 'Cambiar' : 'Configurar'}
          </button>
        </div>
      </Section>

      {/* API Token */}
      <Section title="Token API" icon={Key}>
        <Field label="Token de acceso">
          <input
            type="password"
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="Para uso futuro con el backend"
            className={inputClass}
          />
        </Field>
        <p className="text-xs text-muted-foreground">Necesario para la fase 2 del backend.</p>
      </Section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-4 hover:border-white/12 hover:bg-white/[0.04] transition-all duration-200">
      <div className="flex items-center gap-2 pb-1 border-b border-white/5">
        <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-primary" />
        </div>
        <span className="font-semibold text-sm text-foreground">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all';

const selectClass =
  'w-full h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer appearance-none';
