import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from './ui/utils';

interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
  badge?: string;
}

export function ModuleCard({ icon, title, description, enabled, onToggle, children, badge }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn('rounded-2xl border bg-card transition-all', enabled ? 'border-primary/40' : 'border-border')}>
      <div className="flex items-center gap-4 p-5">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0', enabled ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{title}</span>
            {badge && <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{badge}</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {enabled && children && (
            <button onClick={() => setOpen(o => !o)} className="text-muted-foreground hover:text-foreground transition-colors">
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <SwitchPrimitive.Root
            checked={enabled}
            onCheckedChange={onToggle}
            className={cn('w-10 h-6 rounded-full relative transition-colors outline-none cursor-pointer', enabled ? 'bg-primary' : 'bg-muted')}
          >
            <SwitchPrimitive.Thumb className="block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
          </SwitchPrimitive.Root>
        </div>
      </div>
      {enabled && open && children && (
        <div className="border-t border-border px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}