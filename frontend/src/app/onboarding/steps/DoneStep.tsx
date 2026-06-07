import React, { useEffect, useState } from 'react';
import { CheckCircle2, Cpu, Monitor } from 'lucide-react';
import { usePixieStore } from '../../store';

interface DoneStepProps {
  onFinish: () => void;
}

export function DoneStep({ onFinish }: DoneStepProps) {
  const { deviceName, city, wifi, hasPhysicalDevice, setOnboardingComplete, setPixieMode } = usePixieStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChecked(true), 300);
    return () => clearTimeout(timer);
  }, []);

  function handleFinish() {
    setOnboardingComplete(true);
    setPixieMode(hasPhysicalDevice ? 'physical' : 'digital');
    onFinish();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      {/* Animated checkmark */}
      <div
        className={`w-20 h-20 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center mb-6 transition-all duration-700 ${
          checked ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        <CheckCircle2 className="w-9 h-9 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">¡Todo listo, {deviceName}!</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        Tu configuración fue guardada. Podés cambiarla en cualquier momento desde Settings.
      </p>

      {/* Summary */}
      <div className="w-full max-w-xs space-y-2 mb-8">
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5">
          <span className="text-sm text-muted-foreground">Nombre</span>
          <span className="text-sm font-mono font-semibold text-primary">{deviceName}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5">
          <span className="text-sm text-muted-foreground">Ciudad</span>
          <span className="text-sm font-medium text-foreground">{city}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5">
          <span className="text-sm text-muted-foreground">WiFi</span>
          <span className={`text-sm font-medium ${wifi ? 'text-primary' : 'text-muted-foreground'}`}>
            {wifi ? wifi.ssid : 'No configurado'}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 bg-white/5">
          <span className="text-sm text-muted-foreground">Modo</span>
          <div className="flex items-center gap-1.5">
            {hasPhysicalDevice ? (
              <><Cpu className="w-3.5 h-3.5 text-primary" /><span className="text-sm font-medium text-foreground">Físico</span></>
            ) : (
              <><Monitor className="w-3.5 h-3.5 text-primary" /><span className="text-sm font-medium text-foreground">Digital</span></>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleFinish}
        className="w-full max-w-xs h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 cursor-pointer"
      >
        Entrar a PIXIE
      </button>
    </div>
  );
}
