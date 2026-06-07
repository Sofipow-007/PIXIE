import React, { useState } from 'react';
import { Monitor, ExternalLink, X, Info } from 'lucide-react';
import { DesktopWidget } from '../../components/DesktopWidget';

export function DesktopModeView() {
  const [widgetVisible, setWidgetVisible] = useState(false);

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Desktop Mode</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Widget flotante y arrastrable que vive sobre tus otras apps.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5 glow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Monitor className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Widget flotante</h2>
            <p className="text-sm text-muted-foreground">Arrastralo a cualquier parte de la pantalla.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'Cara animada', desc: 'GIFs cíclicos del PIXIE' },
            { label: 'Reloj en vivo', desc: 'Actualizado cada segundo' },
            { label: 'Minimizable', desc: 'Solo queda la barra' },
            { label: 'Arrastrable', desc: 'Posición libre en pantalla' },
          ].map((feat) => (
            <div key={feat.label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/6">
              <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <div>
                <span className="text-xs font-semibold text-foreground block">{feat.label}</span>
                <span className="text-[11px] text-muted-foreground">{feat.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-1">
          {!widgetVisible ? (
            <button
              onClick={() => setWidgetVisible(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              Lanzar widget
            </button>
          ) : (
            <button
              onClick={() => setWidgetVisible(false)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
              Cerrar widget
            </button>
          )}
        </div>

        {widgetVisible && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/8 border border-primary/20">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-xs text-primary/80">Widget activo — buscalo en la esquina superior derecha de la pantalla.</p>
          </div>
        )}
      </div>

      {widgetVisible && <DesktopWidget onClose={() => setWidgetVisible(false)} />}
    </div>
  );
}
