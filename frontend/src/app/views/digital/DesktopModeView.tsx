import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Monitor, ExternalLink, X, Info, AppWindow } from 'lucide-react';
import { DesktopWidget, WidgetBody } from '../../components/DesktopWidget';

export function DesktopModeView() {
  const [widgetVisible, setWidgetVisible] = useState(false);
  const [pipActive, setPipActive] = useState(false);
  const pipWindowRef = useRef<any>(null);

  async function launchPiP() {
    if (!('documentPictureInPicture' in window)) {
      alert('Tu navegador no soporta esta función. Usá Chrome 116 o superior.');
      return;
    }

    if (pipWindowRef.current && !pipWindowRef.current.closed) {
      pipWindowRef.current.close();
      pipWindowRef.current = null;
      setPipActive(false);
      return;
    }

    try {
      const pipWin = await (window as any).documentPictureInPicture.requestWindow({
        width: 210,
        height: 420,
      });

      pipWindowRef.current = pipWin;
      setPipActive(true);

      // Copiar todos los estilos del documento principal
      [...document.styleSheets].forEach(sheet => {
        try {
          const cssText = [...sheet.cssRules].map(r => r.cssText).join('');
          const style = pipWin.document.createElement('style');
          style.textContent = cssText;
          pipWin.document.head.appendChild(style);
        } catch {}
      });

      pipWin.document.documentElement.setAttribute('data-theme', 'dark');
      pipWin.document.documentElement.style.background = '#0a0a0f';
      pipWin.document.body.style.cssText = 'margin:0;padding:8px;background:#0a0a0f;';

      const container = pipWin.document.createElement('div');
      pipWin.document.body.appendChild(container);

      const root = createRoot(container);
      root.render(
        <div className="rounded-2xl border border-white/10 bg-[#111]/90 overflow-hidden">
          <WidgetBody />
        </div>
      );

      pipWin.addEventListener('pagehide', () => {
        root.unmount();
        pipWindowRef.current = null;
        setPipActive(false);
      });
    } catch (e) {
      console.error('PiP error:', e);
      setPipActive(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Desktop Mode</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Widget flotante con chat que vive sobre tus otras apps.
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
            { label: 'Chat con IA', desc: 'Hablá con Pixie desde el widget' },
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

        <div className="flex flex-wrap gap-3 pt-1">
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

          <button
            onClick={launchPiP}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              pipActive
                ? 'border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20'
                : 'border border-white/10 bg-white/5 text-foreground hover:bg-white/10'
            }`}
          >
            <AppWindow className="w-4 h-4" />
            {pipActive ? 'Cerrar ventana flotante' : 'Pop out (Chrome)'}
          </button>
        </div>

        {widgetVisible && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/8 border border-primary/20">
            <Info className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-xs text-primary/80">Widget activo — buscalo en la esquina superior derecha.</p>
          </div>
        )}

        {pipActive && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/8 border border-primary/20">
            <AppWindow className="w-3.5 h-3.5 text-primary shrink-0" />
            <p className="text-xs text-primary/80">Ventana flotante activa — persiste al cambiar de pestaña.</p>
          </div>
        )}
      </div>

      {widgetVisible && <DesktopWidget onClose={() => setWidgetVisible(false)} />}
    </div>
  );
}
