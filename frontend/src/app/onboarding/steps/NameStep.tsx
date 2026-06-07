import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { usePixieStore } from '../../store';

interface NameStepProps {
  onNext: () => void;
}

export function NameStep({ onNext }: NameStepProps) {
  const { deviceName, setDeviceName } = usePixieStore();
  const [value, setValue] = useState(deviceName);

  function handleNext() {
    const trimmed = value.trim();
    if (!trimmed) return;
    setDeviceName(trimmed);
    onNext();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <Tag className="w-7 h-7 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">Dale un nombre a tu PIXIE</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        Este nombre aparecerá en la pantalla OLED y en la interfaz web.
      </p>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder="Ej: PIXIE, Mi Compañero..."
          maxLength={16}
          autoFocus
          className="w-full h-12 rounded-xl border border-white/10 bg-white/5 px-4 text-center text-lg font-mono font-semibold text-primary placeholder:text-muted-foreground/50 placeholder:font-sans placeholder:text-base placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
        <p className="text-xs text-muted-foreground">{value.length}/16 caracteres</p>

        <button
          onClick={handleNext}
          disabled={!value.trim()}
          className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
