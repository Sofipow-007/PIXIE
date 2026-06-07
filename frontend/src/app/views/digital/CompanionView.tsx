import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, RotateCcw, Wind,
  Sun, Cloud, CloudRain, Snowflake, CloudLightning, Thermometer, CloudSun,
} from 'lucide-react';
import { gifCycleDay } from '../../gifs';
import { usePixieStore } from '../../store';

// ── Clock ─────────────────────────────────────────────────────────────────────

function useLiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ── Weather ───────────────────────────────────────────────────────────────────

interface WeatherData {
  temp: number;
  windspeed: number;
  code: number;
}

function useWeather(city: string) {
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState(false);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    setError(false);

    async function fetch_() {
      try {
        const geoRes  = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es&format=json`,
        );
        const geoData = await geoRes.json();
        const loc     = geoData.results?.[0];
        if (!loc) throw new Error('City not found');

        const wxRes  = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,wind_speed_10m,weather_code&timezone=auto`,
        );
        const wxData = await wxRes.json();
        setWeather({
          temp:      Math.round(wxData.current.temperature_2m),
          windspeed: Math.round(wxData.current.wind_speed_10m),
          code:      wxData.current.weather_code,
        });
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetch_();
  }, [city]);

  return { weather, loading, error };
}

function WeatherIcon({ code, size = 20 }: { code: number; size?: number }) {
  const s = { width: size, height: size };
  const primary = 'oklch(0.73 0.155 192)';
  const amber   = 'oklch(0.82 0.120 75)';

  if (code === 0)  return <Sun style={{ ...s, color: amber }} aria-label="Soleado" />;
  if (code <= 3)   return <CloudSun style={{ ...s, color: 'oklch(0.65 0.10 210)' }} aria-label="Parcialmente nublado" />;
  if (code <= 67)  return <CloudRain style={{ ...s, color: primary }} aria-label="Lluvia" />;
  if (code <= 77)  return <Snowflake style={{ ...s, color: primary }} aria-label="Nieve" />;
  if (code <= 99)  return <CloudLightning style={{ ...s, color: amber }} aria-label="Tormenta" />;
  return <Thermometer style={{ ...s, color: 'oklch(0.62 0.210 25)' }} aria-label="Temperatura extrema" />;
}

function weatherLabel(code: number): string {
  if (code === 0)  return 'Soleado';
  if (code <= 3)   return 'Parcialmente nublado';
  if (code <= 67)  return 'Lluvia';
  if (code <= 77)  return 'Nieve';
  if (code <= 99)  return 'Tormenta';
  return 'Temperatura extrema';
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CompanionView() {
  const { city, deviceName } = usePixieStore();
  const time                 = useLiveClock();
  const { weather, loading, error } = useWeather(city);

  // GIF cycling
  const [gifIdx, setGifIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setGifIdx(i => (i + 1) % gifCycleDay.length), 4000);
    return () => clearInterval(id);
  }, []);

  // Timer
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s > 0) return s - 1;
          setTimerMinutes(m => {
            if (m > 0) return m - 1;
            setTimerRunning(false);
            clearInterval(timerRef.current);
            return 0;
          });
          return 59;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  function resetTimer() {
    setTimerRunning(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  }

  const timerDone = timerMinutes === 0 && timerSeconds === 0;
  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');

  const timerPct = timerDone
    ? 0
    : ((timerMinutes * 60 + timerSeconds) / (25 * 60)) * 100;

  return (
    <div
      style={{
        padding: '2rem 2.5rem',
        maxWidth: '30rem',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
      className="animate-in fade-in slide-in-from-bottom-4 duration-500"
    >

      {/* ── Face + Clock: wide horizontal card ─────────────────────────── */}
      <div
        style={{
          borderRadius: '1.25rem',
          border: '1px solid oklch(0.22 0.018 210)',
          background: 'oklch(0.10 0.006 210)',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Glow accent */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-2rem',
            right: '-2rem',
            width: '10rem',
            height: '10rem',
            borderRadius: '50%',
            background: 'radial-gradient(circle, oklch(0.73 0.155 192 / 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* GIF face */}
        <div
          style={{
            width: '5.5rem',
            height: '5.5rem',
            borderRadius: '1rem',
            background: 'oklch(0.07 0.000 0)',
            border: '1px solid oklch(0.73 0.155 192 / 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 0 16px oklch(0.73 0.155 192 / 0.1)',
          }}
        >
          <img
            src={gifCycleDay[gifIdx]}
            alt={`${deviceName} face`}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>

        {/* Time + date */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '2.25rem',
              fontWeight: 700,
              color: 'oklch(0.96 0.008 200)',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              marginBottom: '0.25rem',
            }}
          >
            {hh}:{mm}
            <span style={{ color: 'oklch(0.40 0.015 210)', fontSize: '1.25rem' }}>
              :{ss}
            </span>
          </div>
          <div
            style={{
              fontSize: '0.8125rem',
              color: 'oklch(0.45 0.015 210)',
              textTransform: 'capitalize',
            }}
          >
            {time.toLocaleDateString('es-AR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </div>
        </div>
      </div>

      {/* ── Weather + Timer: side-by-side row ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

        {/* Weather */}
        <div
          style={{
            borderRadius: '1.25rem',
            border: '1px solid oklch(0.22 0.018 210)',
            background: 'oklch(0.10 0.006 210)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'oklch(0.40 0.015 210)',
              letterSpacing: '0.03em',
            }}
          >
            {city || 'Clima'}
          </div>

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  border: '2px solid oklch(0.73 0.155 192 / 0.3)',
                  borderTopColor: 'oklch(0.73 0.155 192)',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
              <span style={{ fontSize: '0.8125rem', color: 'oklch(0.45 0.015 210)' }}>
                Cargando…
              </span>
            </div>
          )}

          {error && (
            <span style={{ fontSize: '0.8125rem', color: 'oklch(0.45 0.015 210)' }}>
              No disponible
            </span>
          )}

          {weather && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <WeatherIcon code={weather.code} size={28} />
                <span
                  style={{
                    fontFamily: '"Space Mono", monospace',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    color: 'oklch(0.96 0.008 200)',
                    lineHeight: 1,
                  }}
                >
                  {weather.temp}°
                </span>
              </div>

              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'oklch(0.45 0.015 210)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <Wind style={{ width: '0.75rem', height: '0.75rem' }} aria-hidden />
                {weather.windspeed} km/h · {weatherLabel(weather.code)}
              </div>
            </>
          )}
        </div>

        {/* Timer */}
        <div
          style={{
            borderRadius: '1.25rem',
            border: timerDone
              ? '1px solid oklch(0.55 0.18 145 / 0.4)'
              : '1px solid oklch(0.22 0.018 210)',
            background: timerDone
              ? 'oklch(0.12 0.04 145)'
              : 'oklch(0.10 0.006 210)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.875rem',
            transition: 'border-color 400ms ease, background 400ms ease',
          }}
        >
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: timerDone ? 'oklch(0.65 0.18 145)' : 'oklch(0.40 0.015 210)',
              letterSpacing: '0.03em',
              transition: 'color 400ms ease',
            }}
          >
            Pomodoro
          </div>

          <div
            style={{
              fontFamily: '"Space Mono", monospace',
              fontSize: '1.75rem',
              fontWeight: 700,
              color: timerDone ? 'oklch(0.72 0.18 145)' : 'oklch(0.96 0.008 200)',
              lineHeight: 1,
              transition: 'color 400ms ease',
            }}
          >
            {timerMinutes.toString().padStart(2, '0')}:
            {timerSeconds.toString().padStart(2, '0')}
          </div>

          {/* Progress bar */}
          <div
            style={{
              height: '3px',
              borderRadius: '99px',
              background: 'oklch(0.18 0.008 210)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${timerDone ? 0 : timerPct}%`,
                background: timerDone
                  ? 'oklch(0.65 0.18 145)'
                  : 'oklch(0.73 0.155 192)',
                borderRadius: '99px',
                transition: 'width 1s linear, background 400ms ease',
              }}
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {!timerRunning && !timerDone && (
              <input
                type="number"
                min={1}
                max={120}
                value={timerMinutes}
                onChange={e => { setTimerMinutes(Number(e.target.value)); setTimerSeconds(0); }}
                aria-label="Minutos del timer"
                style={{
                  width: '3rem',
                  height: '1.875rem',
                  borderRadius: '0.5rem',
                  border: '1px solid oklch(0.22 0.018 210)',
                  background: 'oklch(0.14 0.008 210)',
                  color: 'oklch(0.96 0.008 200)',
                  fontSize: '0.8125rem',
                  textAlign: 'center',
                  fontFamily: '"Space Mono", monospace',
                  outline: 'none',
                }}
              />
            )}
            <button
              onClick={() => setTimerRunning(v => !v)}
              disabled={timerDone}
              aria-label={timerRunning ? 'Pausar' : 'Iniciar'}
              className="cursor-pointer"
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.625rem',
                border: '1px solid oklch(0.73 0.155 192 / 0.25)',
                background: 'oklch(0.73 0.155 192 / 0.1)',
                color: 'oklch(0.73 0.155 192)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms ease',
                cursor: timerDone ? 'not-allowed' : 'pointer',
                opacity: timerDone ? 0.4 : 1,
              }}
            >
              {timerRunning
                ? <Pause  style={{ width: '0.875rem', height: '0.875rem' }} />
                : <Play   style={{ width: '0.875rem', height: '0.875rem' }} />}
            </button>
            <button
              onClick={resetTimer}
              aria-label="Reiniciar timer"
              className="cursor-pointer"
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.625rem',
                border: '1px solid oklch(0.22 0.018 210)',
                background: 'transparent',
                color: 'oklch(0.45 0.015 210)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 150ms ease, color 150ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.background = 'oklch(0.16 0.008 210)';
                b.style.color = 'oklch(0.70 0.010 210)';
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.background = 'transparent';
                b.style.color = 'oklch(0.45 0.015 210)';
              }}
            >
              <RotateCcw style={{ width: '0.875rem', height: '0.875rem' }} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          [style*="spin"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
