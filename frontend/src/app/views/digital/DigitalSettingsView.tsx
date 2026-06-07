import React, { useState } from 'react';
import { CheckCircle2, Tag, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { usePixieStore } from '../../store';

export function DigitalSettingsView() {
  const store = usePixieStore();
  const [name, setName] = useState(store.deviceName);
  const [city, setCity] = useState(store.city);
  const [language, setLanguage] = useState(store.language);
  const [timezone, setTimezone] = useState(store.timezone);

  function handleSave() {
    store.setDeviceName(name);
    store.setCity(city);
    store.setLanguage(language as 'es' | 'en' | 'it');
    store.setTimezone(timezone);
    toast.success('Configuración guardada', {
      icon: <CheckCircle2 className="w-4 h-4 text-primary" />,
    });
  }

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground mt-1">Preferencias del modo digital.</p>
      </div>

      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-5 hover:border-white/12 hover:bg-white/[0.04] transition-all duration-200">
        <div className="flex items-center gap-2 pb-1 border-b border-white/5">
          <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
            <Tag className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-sm font-semibold text-foreground">General</span>
        </div>

        <Field label="Nombre del compañero">
          <input
            type="text"
            value={name}
            maxLength={16}
            onChange={e => setName(e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Ciudad para el clima">
          <input
            type="text"
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="Ej: Buenos Aires"
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
            <option value="Europe/Rome">Roma (CET)</option>
            <option value="UTC">UTC</option>
          </select>
        </Field>
      </div>

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
