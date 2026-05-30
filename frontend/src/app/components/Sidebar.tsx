import React from 'react';
import { Home, Cpu, Settings, Monitor, Power, Wifi, WifiOff } from 'lucide-react';
import type { ViewId } from '../App';
import pixieLogo from '../../images/PIXIE-Logo.png';
import { cn } from './ui/utils';

const TABS: { id: ViewId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home',     label: 'Home',         icon: Home },
  { id: 'modules',  label: 'Modules',      icon: Cpu },
  { id: 'settings', label: 'Settings',     icon: Settings },
  { id: 'desktop',  label: 'Desktop',      icon: Monitor },
  { id: 'power',    label: 'Power',        icon: Power },
];

interface Props {
  activeView: ViewId;
  onNavigate: (v: ViewId) => void;
  deviceName: string;
  online: boolean;
}

export function Sidebar({ activeView, onNavigate, deviceName, online }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 border-r border-border bg-card shrink-0">

        {/* Brand + device */}
        <div className="px-4 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5 mb-4">
            <img src={pixieLogo} alt="PIXIE" className="w-7 h-7 object-contain" />
            <span className="font-bold text-sm tracking-[0.15em] text-foreground font-mono">PIXIE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn(
              'w-1.5 h-1.5 rounded-full shrink-0',
              online ? 'bg-primary animate-pulse' : 'bg-amber-400'
            )} />
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-foreground truncate">{deviceName}</p>
              <p className="text-[9px] text-muted-foreground tracking-widest uppercase mt-0.5">
                {online ? 'connected' : 'demo mode'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-all cursor-pointer border-l-2',
                activeView === id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="tracking-wide">{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            {online
              ? <Wifi className="w-3 h-3 text-primary" />
              : <WifiOff className="w-3 h-3 text-muted-foreground" />
            }
            <p className="text-[9px] text-muted-foreground font-mono tracking-wider">ESP32 · SSD1306</p>
          </div>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-card/95 backdrop-blur-sm border-t border-border">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              'flex-1 flex flex-col items-center py-2.5 gap-1 cursor-pointer transition-colors',
              activeView === id ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[9px] tracking-wide">{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
