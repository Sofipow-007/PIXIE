import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { usePixieStore } from '../../store';

interface CityStepProps {
  onNext: () => void;
}

const suggestions = ['Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Mar del Plata'];

export function CityStep({ onNext }: CityStepProps) {
  const { city, setCity } = usePixieStore();
  const [value, setValue] = useState(city);

  function handleNext() {
    if (!value.trim()) return;
    setCity(value.trim());
    onNext();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
        <MapPin className="w-7 h-7 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">¿En qué ciudad estás?</h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs">
        PIXIE usa esto para mostrarte el clima actual en la pantalla.
      </p>

      <div className="w-full max-w-xs space-y-4">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleNext()}
          placeholder="Ej: Buenos Aires"
          autoFocus
          className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />

        <div className="flex flex-wrap gap-2 justify-center">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => setValue(s)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                value === s
                  ? 'border-primary/50 bg-primary/10 text-primary'
                  : 'border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

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
