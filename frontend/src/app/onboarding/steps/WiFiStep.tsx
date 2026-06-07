import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, Lock } from 'lucide-react';
import { usePixieStore } from '../../store';

interface WiFiStepProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WiFiStep({ onNext, onSkip }: WiFiStepProps) {
  const { setWifi } = usePixieStore();
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  function handleSave() {
    if (!ssid.trim()) return;
    setWifi({ ssid: ssid.trim(), password });
    onNext();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Wifi className="w-7 h-7 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Conectar a WiFi</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        PIXIE necesita WiFi para sincronizar la hora, el clima y recibir configuraciones.
      </p>

      <div className="w-full max-w-xs space-y-3 text-left">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">Red WiFi (SSID)</label>
          <input
            type="text"
            value={ssid}
            onChange={e => setSsid(e.target.value)}
            placeholder="Nombre de la red"
            className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="Contraseña"
              className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 pr-11 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onSkip}
            className="flex-1 h-11 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all cursor-pointer"
          >
            Saltar por ahora
          </button>
          <button
            onClick={handleSave}
            disabled={!ssid.trim()}
            className="flex-1 h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 cursor-pointer"
          >
            Guardar y continuar
          </button>
        </div>
      </div>
    </div>
  );
}
