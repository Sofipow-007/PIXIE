import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Minus, GripHorizontal } from 'lucide-react';
import { gifCycleDay } from '../gifs';
import { usePixieStore } from '../store';

interface WidgetPosition {
  x: number;
  y: number;
}

interface DesktopWidgetProps {
  onClose: () => void;
}

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function DesktopWidget({ onClose }: DesktopWidgetProps) {
  const { deviceName } = usePixieStore();
  const time = useLiveClock();
  const [minimized, setMinimized] = useState(false);
  const [gifIdx, setGifIdx] = useState(0);
  const [pos, setPos] = useState<WidgetPosition>({ x: window.innerWidth - 220, y: 80 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const widgetRef = useRef<HTMLDivElement>(null);

  // Cycle GIFs every 4s
  useEffect(() => {
    const id = setInterval(() => setGifIdx(i => (i + 1) % gifCycleDay.length), 4000);
    return () => clearInterval(id);
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 200, e.clientX - offset.current.x)),
        y: Math.max(0, Math.min(window.innerHeight - 60, e.clientY - offset.current.y)),
      });
    }
    function onMouseUp() { dragging.current = false; }
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');

  return ReactDOM.createPortal(
    <div
      ref={widgetRef}
      style={{ left: pos.x, top: pos.y, position: 'fixed', zIndex: 9999 }}
      className="select-none"
    >
      <div className={`rounded-2xl border border-white/10 bg-[#111]/90 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden transition-all duration-300 ${minimized ? 'w-44' : 'w-44'}`}>
        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          className="flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing border-b border-white/8"
        >
          <div className="flex items-center gap-1.5">
            <GripHorizontal className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] font-mono font-semibold text-primary">{deviceName}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(v => !v)}
              className="w-4 h-4 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
            >
              <Minus className="w-2.5 h-2.5" />
            </button>
            <button
              onClick={onClose}
              className="w-4 h-4 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="p-3 space-y-2">
            {/* GIF face */}
            <div className="w-20 h-20 mx-auto rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden">
              <img
                src={gifCycleDay[gifIdx]}
                alt="PIXIE face"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Clock */}
            <div className="text-center">
              <div className="font-mono text-lg font-bold text-foreground leading-none">
                {hh}:{mm}
                <span className="text-muted-foreground text-sm">:{ss}</span>
              </div>
              <div className="text-[10px] text-muted-foreground mt-0.5">
                {time.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
