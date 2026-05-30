import React, { useState } from 'react';
import { Power, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import type { PixieStore } from '../../types';

interface Props { store: PixieStore; }

export function PowerView({ store }: Props) {
  const [resetOpen, setResetOpen] = useState(false);

  const handleReset = () => {
    localStorage.removeItem('pixie-config');
    toast.success('Settings reset — reload the page to apply');
    setResetOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="pb-1">
        <h1 className="text-sm font-semibold tracking-[0.1em] text-foreground font-mono uppercase">Power & System</h1>
        <p className="text-[10px] text-muted-foreground tracking-wider mt-0.5">device control and system settings</p>
      </div>

      {/* System info */}
      <div className="border border-border bg-card">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-mono">System</h2>
        </div>

        <div className="divide-y divide-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs font-mono text-foreground">firmware version</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{store.device.firmwareVersion}</p>
            </div>
            <button
              onClick={() => toast.info('No update available in Demo Mode')}
              className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer font-mono"
            >
              <RefreshCw className="w-3 h-3" />
              check updates
            </button>
          </div>

          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <p className="text-xs font-mono text-foreground">restart device</p>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">reboot the ESP32</p>
            </div>
            <button
              onClick={() => toast.info('No physical device connected')}
              className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer font-mono"
            >
              <Power className="w-3 h-3" />
              restart
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-destructive/20 bg-card">
        <div className="px-4 py-3 border-b border-destructive/20">
          <h2 className="text-[10px] text-destructive/70 uppercase tracking-[0.15em] font-mono">Danger Zone</h2>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-mono text-destructive">reset all settings</p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">clears all saved preferences from this browser</p>
          </div>
          <button
            onClick={() => setResetOpen(true)}
            className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 border border-destructive/30 text-destructive hover:bg-destructive/10 transition-all cursor-pointer font-mono"
          >
            <Trash2 className="w-3 h-3" />
            reset
          </button>
        </div>
      </div>

      {/* Reset dialog */}
      <Dialog.Root open={resetOpen} onOpenChange={setResetOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-card border border-destructive/30 p-6 shadow-2xl">
            <div className="flex items-center gap-2.5 mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <Dialog.Title className="font-mono font-bold text-sm text-foreground">reset all settings?</Dialog.Title>
            </div>
            <p className="text-xs text-muted-foreground mb-6 font-mono leading-relaxed">
              This will delete all PIXIE configuration from this browser.<br />
              This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setResetOpen(false)}
                className="flex-1 h-9 border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
              >
                cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 h-9 border border-destructive/50 bg-destructive/10 text-destructive text-xs font-mono hover:bg-destructive/20 transition-all cursor-pointer"
              >
                yes, reset
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
