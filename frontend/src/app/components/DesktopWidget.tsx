import React, { useState, useEffect, useRef } from 'react';
import { X, Minus } from 'lucide-react';
import { GIFS } from '../gifs';
import type { PixieStore, GifKey } from '../types';

const IDLE_SEQUENCE: GifKey[] = ['blink', 'blink', 'happy', 'boring', 'blink', 'zzz1'];
const SIZE_MAP = { small: 160, medium: 220, large: 300 };

interface Props {
  store: PixieStore;
  onClose: () => void;
}

export function DesktopWidget({ store, onClose }: Props) {
  const { widgetConfig } = store;
  const size = SIZE_MAP[widgetConfig.size];
  const opacity = widgetConfig.opacity / 100;

  const [pos, setPos] = useState(() => {
    const m = 20;
    const c = widgetConfig.corner;
    return {
      x: c === 'tl' || c === 'bl' ? m : window.innerWidth - size - m,
      y: c === 'tl' || c === 'tr' ? m : window.innerHeight - size - m,
    };
  });
  const dragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({ x: dragStart.current.px + e.clientX - dragStart.current.mx, y: dragStart.current.py + e.clientY - dragStart.current.my });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, []);

  const [gifIdx, setGifIdx] = useState(0);
  const [minimized, setMinimized] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => setGifIdx(i => (i + 1) % IDLE_SEQUENCE.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const clockFmt = store.modules.clock.config.format === '12h'
    ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    : time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div
      style={{ left: pos.x, top: pos.y, opacity, width: size, zIndex: 9999, position: 'fixed' }}
      className="rounded-2xl bg-card/90 backdrop-blur-md border border-border shadow-2xl select-none"
    >
      <div onMouseDown={onMouseDown} className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing">
        <span className="text-xs font-bold text-primary">PIXIE</span>
        <div className="flex gap-1">
          <button onClick={() => setMinimized(m => !m)} className="text-muted-foreground hover:text-foreground"><Minus className="w-3 h-3" /></button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
        </div>
      </div>
      {!minimized && (
        <div className="flex flex-col items-center pb-4 px-3 gap-2">
          <img src={GIFS[IDLE_SEQUENCE[gifIdx]]} alt="PIXIE face" className="rounded-xl object-contain" style={{ width: size - 32, height: size - 32 }} />
          <span className="text-lg font-mono font-bold text-foreground">{clockFmt}</span>
          {store.modules.clock.config.showDate && (
            <span className="text-xs text-muted-foreground">{time.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
          )}
          {store.modules.weather.enabled && store.global.city && (
            <span className="text-xs text-muted-foreground">{store.global.city}</span>
          )}
        </div>
      )}
    </div>
  );
}