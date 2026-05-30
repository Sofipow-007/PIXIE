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
    <div className={cn(
      'border bg-card transition-all',
      enabled ? 'border-primary/20' : 'border-border'
    )}>
      <div className="flex items-center gap-3 p-4">
        <div className={cn(
          'w-8 h-8 flex items-center justify-center shrink-0 transition-colors text-sm',
          enabled ? 'text-primary' : 'text-muted-foreground'
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-foreground">{title}</span>
            {badge && (
              <span className="text-[9px] px-1.5 py-0.5 border border-border text-muted-foreground font-mono tracking-wider">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {enabled && children && (
            <button
              onClick={() => setOpen(o => !o)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          <SwitchPrimitive.Root
            checked={enabled}
            onCheckedChange={onToggle}
            className={cn(
              'w-9 h-5 rounded-full relative transition-colors outline-none cursor-pointer',
              enabled ? 'bg-primary' : 'bg-muted'
            )}
          >
            <SwitchPrimitive.Thumb className="block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform translate-x-0.5 data-[state=checked]:translate-x-[18px]" />
          </SwitchPrimitive.Root>
        </div>
      </div>
      {enabled && open && children && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}
