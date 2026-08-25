import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { X, Minus, GripHorizontal, Send, Sun, Cloud, CloudRain, Snowflake, CloudLightning, CloudSun, Thermometer } from 'lucide-react';
import { gifCycleDay } from '../gifs';
import { usePixieStore } from '../store';

const API_URL = 'http://localhost:3001';

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

interface WeatherData { temp: number; windspeed: number; code: number; }

function useWeather(city: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    if (!city) return;
    async function fetch_() {
      try {
        const geoRes  = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`);
        const geoData = await geoRes.json();
        const loc     = geoData.results?.[0];
        if (!loc) return;
        const wxRes  = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`);
        const wxData = await wxRes.json();
        setWeather({ temp: Math.round(wxData.current.temperature_2m), windspeed: Math.round(wxData.current.wind_speed_10m), code: wxData.current.weather_code });
      } catch {}
    }
    fetch_();
  }, [city]);

  return weather;
}

function WeatherIcon({ code }: { code: number }) {
  const s = { width: 12, height: 12 };
  const c = 'oklch(0.73 0.155 192)';
  const a = 'oklch(0.82 0.120 75)';
  if (code === 0)  return <Sun style={{ ...s, color: a }} />;
  if (code <= 3)   return <CloudSun style={{ ...s, color: 'oklch(0.65 0.10 210)' }} />;
  if (code <= 67)  return <CloudRain style={{ ...s, color: c }} />;
  if (code <= 77)  return <Snowflake style={{ ...s, color: c }} />;
  if (code <= 99)  return <CloudLightning style={{ ...s, color: a }} />;
  return <Thermometer style={{ ...s, color: 'oklch(0.62 0.210 25)' }} />;
}

type Msg = { role: 'user' | 'assistant'; content: string };

export function WidgetBody() {
  const { city } = usePixieStore();
  const time    = useLiveClock();
  const weather = useWeather(city);
  const [gifIdx, setGifIdx] = useState(0);
  const [input, setInput]   = useState('');
  const [msgs, setMsgs]     = useState<Msg[]>([]);
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setGifIdx(i => (i + 1) % gifCycleDay.length), 4000);
    return () => clearInterval(id);
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || thinking) return;
    const updated: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(updated);
    setInput('');
    setThinking(true);
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMsgs(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', content: '⚠ Sin conexión' }]);
    } finally {
      setThinking(false);
    }
  }

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const showThinking = thinking && msgs[msgs.length - 1]?.role === 'user';

  return (
    <div className="p-3 space-y-2">
      <div className="w-20 h-20 mx-auto rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden">
        <img src={gifCycleDay[gifIdx]} alt="PIXIE" className="w-full h-full object-contain" />
      </div>

      <div className="text-center">
        <div className="font-mono text-lg font-bold text-foreground leading-none">
          {hh}:{mm}<span className="text-muted-foreground text-sm">:{ss}</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5">
          {time.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </div>

      {weather && (
        <div className="flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg bg-white/5 border border-white/8">
          <WeatherIcon code={weather.code} />
          <span className="text-[11px] font-semibold text-foreground">{weather.temp}°</span>
          <span className="text-[10px] text-muted-foreground">{city}</span>
        </div>
      )}

      {msgs.length > 0 && (
        <div className="max-h-28 overflow-y-auto space-y-1.5">
          {msgs.slice(-4).map((m, i) => (
            <div key={i} className={`text-[11px] px-2 py-1.5 rounded-lg leading-snug break-words ${
              m.role === 'assistant'
                ? 'bg-white/5 border border-white/8 text-foreground'
                : 'bg-primary/10 border border-primary/20 text-primary'
            }`}>
              {m.content}
            </div>
          ))}
        </div>
      )}

      {showThinking && (
        <div className="text-[11px] px-2 py-1.5 rounded-lg bg-white/5 border border-white/8 text-muted-foreground">
          Pensando...
        </div>
      )}

      <div className="flex gap-1">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Escribí algo..."
          className="flex-1 h-7 text-[11px] bg-white/5 border border-white/10 rounded-lg px-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 min-w-0"
        />
        <button
          onClick={send}
          disabled={thinking || !input.trim()}
          className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer disabled:opacity-40"
        >
          <Send className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

interface DesktopWidgetProps {
  onClose: () => void;
}

export function DesktopWidget({ onClose }: DesktopWidgetProps) {
  const { deviceName } = usePixieStore();
  const [minimized, setMinimized] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 230, y: 80 });
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    dragging.current = true;
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  }, [pos]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 210, e.clientX - offset.current.x)),
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

  return ReactDOM.createPortal(
    <div style={{ left: pos.x, top: pos.y, position: 'fixed', zIndex: 9999 }} className="select-none">
      <div className="rounded-2xl border border-white/10 bg-[#111]/90 backdrop-blur-xl shadow-2xl shadow-black/60 overflow-hidden w-48">
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
        {!minimized && <WidgetBody />}
      </div>
    </div>,
    document.body
  );
}
