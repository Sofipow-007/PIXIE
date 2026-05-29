import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Wifi } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  open: boolean;
  onClose: () => void;
  initialSSID: string;
  onSave: (ssid: string, password: string) => void;
}

export function WiFiModal({ open, onClose, initialSSID, onSave }: Props) {
  const [ssid, setSSID] = useState(initialSSID);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSave = () => {
    if (!ssid.trim()) { toast.error('SSID is required'); return; }
    onSave(ssid.trim(), password);
    toast.success('WiFi credentials saved');
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-primary" />
              <Dialog.Title className="font-bold text-lg">WiFi Configuration</Dialog.Title>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Network Name (SSID)</label>
              <input value={ssid} onChange={e => setSSID(e.target.value)} placeholder="My WiFi Network" className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-10 rounded-xl border border-border bg-background px-3 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                <button onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground">{showPw ? 'Hide' : 'Show'}</button>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={onClose} className="flex-1 h-10 rounded-xl border border-border text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
            <button onClick={handleSave} className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Save</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}