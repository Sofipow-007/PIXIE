import React, { useEffect, useRef, useState } from 'react';
import { Clock, Cloud, Timer, Languages, ChevronDown, Zap } from 'lucide-react';
import { PixieModel } from '../models/PixieModel';
import pixieLogo from '../../../images/PIXIE-Logo.png';

interface WelcomeStepProps {
  onChoose: (hasDevice: boolean) => void;
}

type Align = 'left' | 'right' | 'center' | 'split';

interface Feature {
  icon: React.ComponentType<{ style?: React.CSSProperties; 'aria-hidden'?: boolean }>;
  title: string;
  desc: string;
  color: string;
  number: string;
  align: Align;
}

const CYAN  = 'oklch(0.73 0.155 192)';
const AMBER = 'oklch(0.82 0.120 75)';

const features: Feature[] = [
  { icon: Clock,     title: 'Reloj sincronizado',   desc: 'Hora exacta vía NTP. Sin configuración manual, siempre al segundo.',                       color: CYAN,  number: '01', align: 'left'   },
  { icon: Cloud,     title: 'Clima en tiempo real',  desc: 'Temperatura de tu ciudad en la pantalla OLED. Open-Meteo, sin API key.',                    color: CYAN,  number: '02', align: 'right'  },
  { icon: Timer,     title: 'Timer con buzzer',      desc: 'Cronómetro regresivo con alarma física. Perfecto para Pomodoro.',                           color: AMBER, number: '03', align: 'center' },
  { icon: Languages, title: 'Traductor ES → IT',     desc: 'Hablás en español, PIXIE muestra la traducción. Micrófono INMP441.',                        color: AMBER, number: '04', align: 'split'  },
];

const team = ['Mauro Beltran', 'Thomas Barrera Fuentes', 'Sofia Power', 'Lautaro Palombo'];

function a(color: string, opacity: number) {
  return color.replace(')', ` / ${opacity})`);
}

// Tracks both raw scrollTop (for parallax) and normalized progress (for model rotation)
function useHeroScroll(ref: React.RefObject<HTMLDivElement | null>) {
  const [scrollTop,      setScrollTop]      = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const st  = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setScrollTop(st);
      setScrollProgress(max > 0 ? st / max : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [ref]);

  return { scrollTop, scrollProgress };
}

// ─── Feature row ──────────────────────────────────────────────────────────────

function FeatureRow({ f }: { f: Feature }) {
  const { icon: Icon, title, desc, color, number, align } = f;

  const numBase: React.CSSProperties = {
    position:   'absolute',
    fontFamily: '"Space Mono", monospace',
    fontSize:   'clamp(6rem, 14vw, 12rem)',
    fontWeight: 700,
    lineHeight: 1,
    color:      a(color, 0.22),
    pointerEvents: 'none',
    userSelect:    'none',
  };

  const rowBorder = '1px solid oklch(0.22 0.018 210 / 0.55)';

  const iconBox = (extra: React.CSSProperties = {}) => (
    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', border: `1px solid ${a(color, 0.28)}`, background: a(color, 0.09), display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', ...extra }}>
      <Icon style={{ width: '1.125rem', height: '1.125rem', color }} aria-hidden />
    </div>
  );

  const h3El = (extra: React.CSSProperties = {}) => (
    <h3 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'oklch(0.96 0.008 200)', marginBottom: '0.625rem', letterSpacing: '-0.02em', fontFamily: '"Plus Jakarta Sans", sans-serif', ...extra }}>
      {title}
    </h3>
  );

  const pEl = (extra: React.CSSProperties = {}) => (
    <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'oklch(0.50 0.018 210)', fontFamily: '"Plus Jakarta Sans", sans-serif', ...extra }}>
      {desc}
    </p>
  );

  if (align === 'split') {
    return (
      <div style={{ position: 'relative', padding: '4rem 0 5.5rem', borderTop: rowBorder, overflow: 'hidden' }}>
        <div aria-hidden style={{ ...numBase, top: '50%', transform: 'translateY(-50%)', right: '-0.5rem' }}>{number}</div>
        <div className="grid md:grid-cols-2" style={{ gap: '2rem 4rem', alignItems: 'end' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>{iconBox()}{h3El()}</div>
          <div style={{ position: 'relative', zIndex: 1, paddingBottom: '0.25rem' }}>{pEl({ fontSize: '1rem', lineHeight: 1.8 })}</div>
        </div>
      </div>
    );
  }

  if (align === 'center') {
    return (
      <div style={{ position: 'relative', padding: '7rem 0', borderTop: rowBorder, overflow: 'hidden', textAlign: 'center' }}>
        <div aria-hidden style={{ ...numBase, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{number}</div>
        <div style={{ maxWidth: '500px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {iconBox({ margin: '0 auto 1.25rem' })}{h3El()}{pEl()}
        </div>
      </div>
    );
  }

  if (align === 'right') {
    return (
      <div style={{ position: 'relative', padding: '7rem 0 4rem', borderTop: rowBorder, overflow: 'hidden', textAlign: 'right' }}>
        <div aria-hidden style={{ ...numBase, top: '50%', transform: 'translateY(-50%)', left: '-0.5rem' }}>{number}</div>
        <div style={{ maxWidth: '480px', marginLeft: 'auto', position: 'relative', zIndex: 1 }}>
          {iconBox({ marginLeft: 'auto' })}{h3El()}{pEl()}
        </div>
      </div>
    );
  }

  // left (default)
  return (
    <div style={{ position: 'relative', padding: '5rem 0', borderTop: rowBorder, overflow: 'hidden' }}>
      <div aria-hidden style={{ ...numBase, right: '-0.5rem', top: '50%', transform: 'translateY(-50%)' }}>{number}</div>
      <div style={{ maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        {iconBox()}{h3El()}{pEl()}
      </div>
    </div>
  );
}

// ─── CTA buttons ──────────────────────────────────────────────────────────────

function PrimaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer"
      style={{ height: '2.875rem', padding: '0 1.75rem', borderRadius: '0.875rem', background: CYAN, color: 'oklch(0.07 0.000 0)', fontSize: '0.875rem', fontWeight: 700, border: 'none', boxShadow: `0 0 0 1px ${a(CYAN, 0.4)}, 0 8px 24px ${a(CYAN, 0.18)}`, fontFamily: '"Plus Jakarta Sans", sans-serif', transition: 'transform 150ms ease, box-shadow 150ms ease', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 0 0 1px ${a(CYAN, 0.5)}, 0 12px 32px ${a(CYAN, 0.28)}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 0 0 1px ${a(CYAN, 0.4)}, 0 8px 24px ${a(CYAN, 0.18)}`; }}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer"
      style={{ height: '2.875rem', padding: '0 1.75rem', borderRadius: '0.875rem', background: 'oklch(0.12 0.008 210)', color: 'oklch(0.96 0.008 200)', fontSize: '0.875rem', fontWeight: 600, border: '1px solid oklch(0.22 0.018 210)', fontFamily: '"Plus Jakarta Sans", sans-serif', transition: 'border-color 150ms ease, background 150ms ease', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = a(CYAN, 0.4); e.currentTarget.style.background = 'oklch(0.14 0.008 210)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'oklch(0.22 0.018 210)'; e.currentTarget.style.background = 'oklch(0.12 0.008 210)'; }}
    >
      {children}
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function WelcomeStep({ onChoose }: WelcomeStepProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [mounted,       setMounted]       = useState(false);
  const [footerOffsetY, setFooterOffsetY] = useState(9999);
  const [viewportH,     setViewportH]     = useState(() => typeof window !== 'undefined' ? window.innerHeight : 900);
  const { scrollTop, scrollProgress } = useHeroScroll(scrollRef as React.RefObject<HTMLDivElement>);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Measure footer position and track viewport height
  useEffect(() => {
    const measure = () => {
      setViewportH(window.innerHeight);
      if (!footerRef.current || !scrollRef.current) return;
      const cRect = scrollRef.current.getBoundingClientRect();
      const fRect = footerRef.current.getBoundingClientRect();
      setFooterOffsetY(fRect.top - cRect.top + scrollRef.current.scrollTop);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [mounted]);

  // Model initial page-Y: vertically centered in the hero (50vh - half model height)
  const MODEL_INIT_Y = viewportH * 0.5 - 180;
  const MODEL_H      = 360;
  // Cap: model bottom stops ~120px before footer
  const maxParallax  = Math.max(0, footerOffsetY - MODEL_H - 120 - MODEL_INIT_Y);
  // Factor > 1 makes model drift DOWN in viewport as user scrolls
  const modelParallaxY = Math.min(scrollTop * 1.05, maxParallax);

  // Opacity: full in hero, dims to 0.62 as model travels through features
  const modelOpacity = 1 - Math.min(
    Math.max((scrollTop - viewportH * 0.35) / (viewportH * 0.55), 0), 1
  ) * 0.38;

  return (
    <div
      ref={scrollRef}
      style={{ height: '100dvh', overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth' }}
    >

      {/* ══ Animated ambient blobs — fixed, z:0, behind everything ═════════ */}
      <div
        aria-hidden
        style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', background: `radial-gradient(circle, ${a(CYAN, 0.18)} 0%, transparent 65%)`, top: '-15%', left: '5%', animation: 'pixie-blob1 28s ease-in-out infinite', willChange: 'transform' }} />
        <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${a(CYAN, 0.14)} 0%, transparent 65%)`, top: '30%', right: '-5%', animation: 'pixie-blob2 35s ease-in-out infinite', willChange: 'transform' }} />
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: `radial-gradient(circle, ${a(AMBER, 0.11)} 0%, transparent 65%)`, bottom: '10%', left: '15%', animation: 'pixie-blob3 22s ease-in-out infinite', willChange: 'transform' }} />
      </div>

      {/* ══ HERO — all layers absolutely positioned ══════════════════════════ */}
      <section style={{ position: 'relative', height: '100dvh', overflow: 'visible' }}>

        {/* ── Ambient radial glow (z: 0) ─────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position:   'absolute', inset: 0, zIndex: 0,
            background: 'radial-gradient(ellipse 80% 65% at 50% 50%, oklch(0.73 0.155 192 / 0.09) 0%, transparent 68%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── "Conocé a" — BEHIND the model (z: 0) ──────────────────────── */}
        <div
          aria-hidden
          style={{
            position:      'absolute',
            top:           '33%',
            left:          '50%',
            transform:     'translate(-50%, -50%)',
            zIndex:         0,
            fontFamily:    '"Plus Jakarta Sans", sans-serif',
            fontSize:      'clamp(2.25rem, 6.5vw, 5.5rem)',
            fontWeight:    800,
            letterSpacing: '-0.025em',
            color:         'oklch(0.96 0.008 200)',
            whiteSpace:    'nowrap',
            pointerEvents: 'none',
            userSelect:    'none',
          }}
        >
          Conocé a
        </div>

        {/* ── 3D Model — travels through the whole page (z: 5) ───────────── */}
        <div
          style={{
            position:      'absolute',
            top:           `${MODEL_INIT_Y + modelParallaxY}px`,
            left:          '50%',
            transform:     'translateX(-50%)',
            zIndex:         5,
            width:         '300px',
            height:        `${MODEL_H}px`,
            opacity:        modelOpacity,
            transition:    'opacity 60ms linear',
            pointerEvents: 'none',
          }}
        >
          {mounted && <PixieModel scrollProgress={scrollProgress} />}
        </div>

        {/* ── "PIXIE" — IN FRONT of the model (z: 6) ─────────────────────── */}
        <div
          aria-hidden
          style={{
            position:      'absolute',
            top:           '57%',
            left:          '50%',
            transform:     'translate(-50%, -50%)',
            zIndex:         6,
            fontFamily:    '"Plus Jakarta Sans", sans-serif',
            fontSize:      'clamp(5rem, 16vw, 11.5rem)',
            fontWeight:    800,
            letterSpacing: '-0.055em',
            lineHeight:    1,
            color:         CYAN,
            whiteSpace:    'nowrap',
            pointerEvents: 'none',
            userSelect:    'none',
          }}
        >
          PIXIE
        </div>

        {/* ── Badge — top center (z: 7) ───────────────────────────────────── */}
        <div
          style={{
            position:  'absolute',
            top:       '11vh',
            left:      '50%',
            transform: 'translateX(-50%)',
            zIndex:     7,
            display:   'inline-flex',
            alignItems: 'center',
            gap:        '0.5rem',
            padding:    '0.375rem 0.875rem',
            borderRadius: '99px',
            border:     `1px solid ${a(CYAN, 0.3)}`,
            background: a(CYAN, 0.07),
            fontSize:   '0.75rem',
            fontWeight: 600,
            color:      CYAN,
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            whiteSpace: 'nowrap',
          }}
        >
          <Zap style={{ width: '0.8rem', height: '0.8rem', flexShrink: 0 }} aria-hidden />
          Asistente de escritorio físico
        </div>

        {/* ── Tagline + CTAs — bottom center (z: 7) ──────────────────────── */}
        <div
          style={{
            position:       'absolute',
            bottom:         '16vh',
            left:           '50%',
            transform:      'translateX(-50%)',
            zIndex:          7,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '1.25rem',
            width:          '90%',
            maxWidth:       '420px',
          }}
        >
          <p
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize:   '0.9375rem',
              lineHeight: 1.75,
              color:      'oklch(0.50 0.018 210)',
              textAlign:  'center',
              margin:      0,
            }}
          >
            Un compañero físico para tu escritorio. Reloj, clima, timer
            y traductor en una pantalla OLED del tamaño de tu pulgar.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <PrimaryBtn onClick={() => onChoose(true)}>Sí, tengo uno</PrimaryBtn>
            <SecondaryBtn onClick={() => onChoose(false)}>Solo digital</SecondaryBtn>
          </div>
        </div>

        {/* ── Scroll hint (z: 7) ──────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position:       'absolute',
            bottom:         '2.25rem',
            left:           '50%',
            transform:      'translateX(-50%)',
            zIndex:          7,
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            gap:            '0.375rem',
            color:          'oklch(0.35 0.012 210)',
            animation:      'pixie-bounce 2s ease-in-out infinite',
            fontFamily:     '"Plus Jakarta Sans", sans-serif',
          }}
        >
          <span style={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.08em' }}>
            VER FUNCIONES
          </span>
          <ChevronDown style={{ width: '0.875rem', height: '0.875rem' }} />
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════ */}
      <section style={{ padding: '2rem 0 0' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 3rem' }}>
          {features.map((f, i) => <FeatureRow key={i} f={f} />)}
        </div>

        {/* Bottom CTA block */}
        <div
          style={{
            display: 'flex', gap: '0.875rem', justifyContent: 'center',
            flexWrap: 'wrap', padding: '5rem 2rem',
            borderTop: '1px solid oklch(0.22 0.018 210 / 0.5)', marginTop: '1rem',
          }}
        >
          <PrimaryBtn onClick={() => onChoose(true)}>Tengo un PIXIE</PrimaryBtn>
          <SecondaryBtn onClick={() => onChoose(false)}>Solo digital</SecondaryBtn>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer
        ref={footerRef as React.RefObject<HTMLElement>}
        style={{
          borderTop:  '1px solid oklch(0.20 0.040 192)',
          background: 'oklch(0.12 0.042 192)',
          padding:    '4rem 3rem 2.5rem',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
        }}
      >
        <div
          className="grid md:grid-cols-2"
          style={{ maxWidth: '1100px', margin: '0 auto', gap: '3rem', alignItems: 'start', marginBottom: '3rem' }}
        >
          {/* Branding */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <img src={pixieLogo} alt="PIXIE" style={{ height: '1.5rem', flexShrink: 0 }} />
              <span style={{ fontSize: '1rem', fontWeight: 700, color: CYAN, letterSpacing: '-0.02em' }}>Pixie</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'oklch(0.50 0.018 210)', lineHeight: 1.75, maxWidth: '30ch', margin: 0 }}>
              Un asistente físico de escritorio basado en ESP32. Reloj,
              clima, timer y traductor en una pantalla OLED del tamaño
              de tu pulgar.
            </p>
          </div>

          {/* Team */}
          <div>
            <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'oklch(0.35 0.012 210)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '0.875rem', margin: '0 0 0.875rem' }}>
              Equipo
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {team.map(name => (
                <li key={name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'oklch(0.68 0.012 210)', fontWeight: 500 }}>
                  <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: a(CYAN, 0.5), flexShrink: 0 }} />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: '1100px', margin: '0 auto', paddingTop: '1.5rem',
            borderTop: '1px solid oklch(0.20 0.040 192 / 0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '0.75rem',
          }}
        >
          <p style={{ fontSize: '0.75rem', color: 'oklch(0.35 0.012 210)', margin: 0 }}>
            © 2025 PIXIE · Proyecto integrador
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: CYAN, boxShadow: `0 0 6px ${a(CYAN, 0.65)}`, flexShrink: 0 }} />
            <p style={{ fontSize: '0.75rem', color: 'oklch(0.35 0.012 210)', margin: 0, fontFamily: '"Space Mono", monospace' }}>
              ESP32 · SSD1306 · Wi-Fi
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pixie-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0);   opacity: 0.6; }
          50%       { transform: translateX(-50%) translateY(5px); opacity: 1;   }
        }
        @keyframes pixie-blob1 {
          0%, 100% { transform: translate(0,     0)    scale(1);    }
          33%       { transform: translate(50px,  60px) scale(1.07); }
          66%       { transform: translate(-35px, 30px) scale(0.95); }
        }
        @keyframes pixie-blob2 {
          0%, 100% { transform: translate(0,     0)     scale(1);    }
          40%       { transform: translate(-55px, -40px) scale(1.09); }
          72%       { transform: translate(35px,  50px)  scale(0.93); }
        }
        @keyframes pixie-blob3 {
          0%, 100% { transform: translate(0,    0)     scale(1);    }
          50%       { transform: translate(60px, -40px) scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="pixie-bounce"],
          [style*="pixie-blob"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
