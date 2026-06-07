import React, { useState } from 'react';
import { Cpu, Monitor } from 'lucide-react';
import { usePixieStore } from '../store';
import { WiFiModal } from './WiFiModal';
import type { PixieMode } from '../types';

interface ModeSwitchProps {
  collapsed?: boolean;
}

const BASE_BTN: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  borderRadius: '0.5rem',
  border: 'none',
  fontSize: '0.8125rem',
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans", sans-serif',
  transition: 'background 150ms, color 150ms, box-shadow 150ms',
  cursor: 'pointer',
};

export function ModeSwitch({ collapsed = false }: ModeSwitchProps) {
  const { pixieMode, setPixieMode, wifi } = usePixieStore();
  const [wifiModalOpen, setWifiModalOpen] = useState(false);

  function handleSwitch(target: PixieMode) {
    if (target === pixieMode) return;
    if (target === 'physical' && !wifi) { setWifiModalOpen(true); return; }
    setPixieMode(target);
  }

  function btnStyle(mode: PixieMode): React.CSSProperties {
    const active = pixieMode === mode;
    return {
      ...BASE_BTN,
      flex: collapsed ? undefined : 1,
      justifyContent: 'center',
      padding: collapsed ? '0.5rem' : '0.4375rem 0.75rem',
      background: active ? 'oklch(0.73 0.155 192 / 0.15)' : 'transparent',
      color: active ? 'oklch(0.73 0.155 192)' : 'oklch(0.45 0.015 210)',
      boxShadow: active
        ? '0 0 0 1px oklch(0.73 0.155 192 / 0.25)'
        : 'none',
    };
  }

  return (
    <>
      <WiFiModal
        open={wifiModalOpen}
        onOpenChange={open => {
          setWifiModalOpen(open);
          if (!open && wifi) setPixieMode('physical');
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: collapsed ? 'column' : 'row',
          gap: '2px',
          padding: '2px',
          borderRadius: '0.625rem',
          background: 'oklch(0.14 0.008 210)',
          border: '1px solid oklch(0.22 0.018 210)',
        }}
      >
        <button
          onClick={() => handleSwitch('physical')}
          title="Modo Físico"
          style={btnStyle('physical')}
        >
          <Cpu style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
          {!collapsed && 'Físico'}
        </button>
        <button
          onClick={() => handleSwitch('digital')}
          title="Modo Digital"
          style={btnStyle('digital')}
        >
          <Monitor style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0 }} />
          {!collapsed && 'Digital'}
        </button>
      </div>
    </>
  );
}
