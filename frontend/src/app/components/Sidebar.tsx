import React, { useRef, useEffect } from 'react';
import {
  LayoutDashboard, Boxes, Settings, Power,
  Heart, Monitor, Settings2,
} from 'lucide-react';
import { ModeSwitch } from './ModeSwitch';
import { usePixieStore } from '../store';
import type { PixieMode, PhysicalTab, DigitalTab } from '../types';
import pixieLogo from '../../images/PIXIE-Logo.png';

interface SidebarProps {
  mode: PixieMode;
  physicalTab: PhysicalTab;
  digitalTab: DigitalTab;
  onPhysicalTabChange: (tab: PhysicalTab) => void;
  onDigitalTabChange:  (tab: DigitalTab)  => void;
}

const PHYSICAL_NAV = [
  { id: 'dashboard' as PhysicalTab, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'modules'   as PhysicalTab, label: 'Módulos',   icon: Boxes },
  { id: 'settings'  as PhysicalTab, label: 'Settings',  icon: Settings },
  { id: 'power'     as PhysicalTab, label: 'Power',     icon: Power },
];

const DIGITAL_NAV = [
  { id: 'companion' as DigitalTab, label: 'Companion', icon: Heart },
  { id: 'desktop'   as DigitalTab, label: 'Desktop',   icon: Monitor },
  { id: 'settings'  as DigitalTab, label: 'Settings',  icon: Settings2 },
];

// Pill indicator that slides between nav items
function SlidingIndicator({
  nav,
  activeId,
}: {
  nav: { id: string }[];
  activeId: string;
}) {
  const activeIndex  = nav.findIndex(n => n.id === activeId);
  const ITEM_HEIGHT  = 38;   // px — matches button height below
  const ITEM_GAP     = 2;    // px — gap between items

  return (
    <div
      aria-hidden
      style={{
        position:       'absolute',
        left:           '0.625rem',
        right:          '0.625rem',
        height:         `${ITEM_HEIGHT}px`,
        borderRadius:   '0.625rem',
        background:     'oklch(0.73 0.155 192 / 0.1)',
        boxShadow:
          '0 0 0 1px oklch(0.73 0.155 192 / 0.15), inset 0 0 0 1px oklch(0.73 0.155 192 / 0.08)',
        transform:      `translateY(${activeIndex * (ITEM_HEIGHT + ITEM_GAP)}px)`,
        transition:     'transform 220ms cubic-bezier(0.4, 0, 0.2, 1)',
        pointerEvents:  'none',
      }}
    />
  );
}

export function Sidebar({
  mode, physicalTab, digitalTab, onPhysicalTabChange, onDigitalTabChange,
}: SidebarProps) {
  const nav      = mode === 'physical' ? PHYSICAL_NAV : DIGITAL_NAV;
  const activeId = mode === 'physical' ? physicalTab  : digitalTab;
  const { setOnboardingComplete } = usePixieStore();

  function handleNav(id: string) {
    if (mode === 'physical') onPhysicalTabChange(id as PhysicalTab);
    else                     onDigitalTabChange(id as DigitalTab);
  }

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────────────────── */}
      <aside
        className="hidden md:flex flex-col"
        style={{
          width:        '14rem',
          minHeight:    '100vh',
          background:   'oklch(0.09 0.004 210)',
          borderRight:  '1px solid oklch(0.22 0.018 210)',
          position:     'sticky',
          top:          0,
          flexShrink:   0,
        }}
      >
        {/* Logo */}
        <button
          onClick={() => setOnboardingComplete(false)}
          title="Ver pantalla de inicio"
          className="cursor-pointer"
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '0.5rem',
            padding:      '1.25rem 1.125rem 1rem',
            borderBottom: '1px solid oklch(0.22 0.018 210)',
            border:       'none',
            background:   'transparent',
            width:        '100%',
            textAlign:    'left',
            transition:   'opacity 150ms ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
          <img src={pixieLogo} alt="PIXIE" style={{ height: '1.75rem', flexShrink: 0 }} />
          <span
            style={{
              fontFamily:    '"Plus Jakarta Sans", sans-serif',
              fontSize:      '1.0625rem',
              fontWeight:    700,
              color:         'oklch(0.73 0.155 192)',
              letterSpacing: '-0.02em',
            }}
          >
            Pixie
          </span>
        </button>

        {/* Nav with sliding indicator */}
        <nav
          aria-label="Navegación principal"
          style={{
            flex:            1,
            padding:         '0.75rem 0',
            display:         'flex',
            flexDirection:   'column',
            position:        'relative',
          }}
        >
          {/* Indicator lives in padding area of nav, behind buttons */}
          <div
            style={{
              position:  'absolute',
              top:       '0.75rem',
              left:      0,
              right:     0,
              bottom:    0,
            }}
          >
            <SlidingIndicator nav={nav} activeId={activeId} />
          </div>

          {/* Buttons */}
          <div
            style={{
              display:       'flex',
              flexDirection: 'column',
              gap:           '2px',
              padding:       '0 0.625rem',
            }}
          >
            {nav.map(item => {
              const Icon   = item.icon;
              const active = activeId === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className="cursor-pointer"
                  style={{
                    position:      'relative',
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '0.625rem',
                    width:         '100%',
                    height:        '38px',
                    padding:       '0 0.75rem',
                    borderRadius:  '0.625rem',
                    border:        'none',
                    background:    'transparent',
                    color:         active
                      ? 'oklch(0.73 0.155 192)'
                      : 'oklch(0.50 0.018 210)',
                    fontSize:      '0.875rem',
                    fontWeight:    active ? 600 : 500,
                    fontFamily:    '"Plus Jakarta Sans", sans-serif',
                    textAlign:     'left',
                    cursor:        'pointer',
                    transition:    'color 200ms ease',
                    zIndex:        1,
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.color = 'oklch(0.70 0.012 210)';
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.color = 'oklch(0.50 0.018 210)';
                  }}
                >
                  <Icon style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                  {item.label}

                  {/* Active dot */}
                  {active && (
                    <div
                      aria-hidden
                      style={{
                        marginLeft:   'auto',
                        width:        '5px',
                        height:       '5px',
                        borderRadius: '50%',
                        background:   'oklch(0.73 0.155 192)',
                        boxShadow:    '0 0 6px oklch(0.73 0.155 192 / 0.6)',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mode switch */}
        <div
          style={{
            padding:    '0.875rem 0.625rem',
            borderTop:  '1px solid oklch(0.22 0.018 210)',
          }}
        >
          <p
            style={{
              fontSize:      '0.6875rem',
              fontWeight:    600,
              color:         'oklch(0.32 0.010 210)',
              padding:       '0 0.5rem',
              marginBottom:  '0.5rem',
            }}
          >
            Modo
          </p>
          <ModeSwitch />
        </div>
      </aside>

      {/* ── Mobile bottom bar ──────────────────────────────────────────────── */}
      <nav
        className="md:hidden"
        aria-label="Navegación principal"
        style={{
          position:           'fixed',
          bottom:             0,
          left:               0,
          right:              0,
          zIndex:             40,
          background:         'oklch(0.09 0.004 210 / 0.92)',
          borderTop:          '1px solid oklch(0.22 0.018 210)',
          backdropFilter:     'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div
          style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'space-around',
            padding:         '0.5rem',
          }}
        >
          {nav.map(item => {
            const Icon   = item.icon;
            const active = activeId === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                aria-current={active ? 'page' : undefined}
                className="cursor-pointer"
                style={{
                  display:        'flex',
                  flexDirection:  'column',
                  alignItems:     'center',
                  gap:            '0.25rem',
                  padding:        '0.5rem 0.875rem',
                  borderRadius:   '0.75rem',
                  border:         'none',
                  background:     active ? 'oklch(0.73 0.155 192 / 0.1)' : 'transparent',
                  color:          active ? 'oklch(0.73 0.155 192)' : 'oklch(0.42 0.015 210)',
                  minWidth:       '3.5rem',
                  transition:     'background 200ms ease, color 200ms ease',
                  fontFamily:     '"Plus Jakarta Sans", sans-serif',
                  cursor:         'pointer',
                }}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span style={{ fontSize: '0.625rem', fontWeight: 600 }}>{item.label}</span>
              </button>
            );
          })}

          <div
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              gap:            '0.25rem',
              padding:        '0.5rem 0.5rem',
            }}
          >
            <ModeSwitch collapsed />
            <span
              style={{
                fontSize:  '0.625rem',
                fontWeight: 600,
                color:     'oklch(0.32 0.010 210)',
              }}
            >
              Modo
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}
