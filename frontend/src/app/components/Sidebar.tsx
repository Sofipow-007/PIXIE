import React from 'react';
import { Home, Cpu, Settings, Monitor, Power, Wifi, WifiOff } from 'lucide-react';
import type { ViewId } from '../App';
import pixieLogo from '../../images/PIXIE-Logo.png';
import { cn } from './ui/utils';

const TABS: { id: ViewId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home',     label: 'Home',         icon: Home },
  { id: 'modules',  label: 'Modules',      icon: Cpu },
  { id: 'settings', label: 'Settings',     icon: Settings },
  { id: 'desktop',  label: 'Desktop Mode', icon: Monitor },
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
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card shrink-0">
        <div className="flex items-center gap-3 p-5 border-b border-border">
          <img src={pixieLogo} alt="PIXIE" className="w-10 h-10 object-contain" />
          <div>
            <p className="font-bold text-sm text-foreground">{deviceName}</p>
            <div className="flex items-center gap-1.5">
              {online ? <Wifi className="w-3 h-3 text-green-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
              <span className="text-xs text-muted-foreground">{online ? 'Connected' : 'Demo Mode'}</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                activeView === id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">PIXIE · ESP32 Assistant</p>
        </div>
      </aside>

      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex bg-card border-t border-border">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors',
              activeView === id ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}