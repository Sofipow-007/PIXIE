import React from 'react';
import { Monitor, Minimize2 } from 'lucide-react';
import { GIFS } from '../../gifs';
import type { PixieStore, WidgetConfig } from '../../types';

const CORNERS: { id: WidgetConfig['corner']; label: string }[] = [
  { id: 'tl', label: '↖' }, { id: 'tr', label: '↗' },
  { id: 'bl', label: '↙' }, { id: 'br', label: '↘' },
];

const labelClass = 'text-[10px] text-muted-foreground uppercase tracking-[0.12em] block mb-1.5 font-mono';

interface Props {
  store: PixieStore;
  setDesktopMode: (v: boolean) => void;
  patchWidgetConfig: (p: Partial<WidgetConfig>) => void;
}

export function DesktopModeView({ store, setDesktopMode, patchWidgetConfig }: Props) {
  const { widgetConfig, desktopModeActive, modules } = store;
  const previewGif = GIFS[(modules.standby.config as any).gifKey] || GIFS.blink;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="pb-1">
        <h1 className="text-sm font-semibold tracking-[0.1em] text-foreground font-mono uppercase">Desktop Mode</h1>
        <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">floating widget — no physical device needed</p>
      </div>

      {/* Widget preview */}
      <div className="border border-border bg-card p-6 flex flex-col items-center gap-4">
        <div
          className="border border-primary/20 bg-background p-4 flex flex-col items-center gap-2 w-32"
          style={{ opacity: widgetConfig.opacity / 100 }}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold text-primary font-mono tracking-widest">PIXIE</span>
            <Minimize2 className="w-2.5 h-2.5 text-muted-foreground" />
          </div>
          <img src={previewGif} alt="preview" className="w-20 h-20 object-contain" />
          <span className="text-xs font-mono font-bold text-foreground">
            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
          </span>
        </div>
        <p className="text-[10px] text-muted-foreground font-mono tracking-wider">widget preview</p>
      </div>

      {/* Widget settings */}
      <div className="border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">Widget Settings</h2>
        </div>
        <div className="p-4 space-y-5">
          <div>
            <label className={labelClass}>Size</label>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => patchWidgetConfig({ size: s })}
                  className={`flex-1 h-8 border text-xs font-mono capitalize transition-colors cursor-pointer ${
                    widgetConfig.size === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Start Position</label>
            <div className="grid grid-cols-2 gap-1.5 w-28">
              {CORNERS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => patchWidgetConfig({ corner: id })}
                  className={`h-9 border text-lg transition-colors cursor-pointer ${
                    widgetConfig.corner === id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-primary/40'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Opacity: <span className="text-primary">{widgetConfig.opacity}%</span></label>
            <input
              type="range" min={20} max={100}
              value={widgetConfig.opacity}
              onChange={e => patchWidgetConfig({ opacity: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Launch button */}
      <button
        onClick={() => setDesktopMode(!desktopModeActive)}
        className={`w-full h-11 font-mono font-medium text-xs tracking-[0.1em] uppercase flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
          desktopModeActive
            ? 'border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20'
            : 'border-primary/40 bg-primary/10 text-primary hover:bg-primary/20'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        {desktopModeActive ? 'close desktop widget' : 'launch desktop widget'}
      </button>

      {desktopModeActive && (
        <p className="text-center text-[10px] text-muted-foreground font-mono">
          widget active — drag it around. use the button above to close.
        </p>
      )}
    </div>
  );
}
