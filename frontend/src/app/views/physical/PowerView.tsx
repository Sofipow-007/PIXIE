import React from 'react';
import { AlertTriangle, RotateCcw, Trash2, Info } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { usePixieStore } from '../../store';

export function PowerView() {
  const { firmwareVersion, deviceName, resetStore } = usePixieStore();

  function handleRestart() {
    toast.info('Reiniciando dispositivo…', {
      description: 'Demo Mode — sin conexión al hardware real.',
      icon: <RotateCcw className="w-4 h-4 animate-spin" />,
    });
  }

  function handleReset() {
    resetStore();
    toast.error('Reset de fábrica completado', {
      description: 'Todos los datos fueron eliminados. Recargá la página.',
    });
    setTimeout(() => window.location.reload(), 2000);
  }

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Power & Sistema</h1>
        <p className="text-sm text-muted-foreground mt-1">Control del dispositivo físico y reset de configuración.</p>
      </div>

      {/* Firmware info */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Info className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">Información del sistema</span>
        </div>
        {[
          { label: 'Dispositivo', value: deviceName },
          { label: 'Firmware', value: `v${firmwareVersion}` },
          { label: 'Hardware', value: 'ESP32 DevKit v1' },
          { label: 'Pantalla', value: 'OLED SSD1306 0.96"' },
        ].map(row => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span className="text-sm font-mono font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Restart */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-primary" />
              <span className="font-semibold text-sm text-foreground">Reiniciar dispositivo</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Reinicia el ESP32 sin borrar la configuración. El dispositivo se reconecta al WiFi en segundos.
            </p>
          </div>
          <button
            onClick={handleRestart}
            className="shrink-0 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 transition-colors cursor-pointer"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Factory reset */}
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-destructive" />
          <span className="font-semibold text-sm text-destructive">Zona de peligro</span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-sm font-medium text-foreground block">Reset de fábrica</span>
            <p className="text-xs text-muted-foreground">
              Borra toda la configuración: nombre, WiFi, módulos y preferencias. Esta acción no se puede deshacer.
            </p>
          </div>

          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button className="shrink-0 px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors cursor-pointer">
                Reset
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in-0" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <Dialog.Title className="font-semibold text-foreground">¿Confirmar reset?</Dialog.Title>
                    <Dialog.Description className="text-xs text-muted-foreground">Esta acción no se puede deshacer.</Dialog.Description>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Se borrarán el nombre, WiFi, módulos y toda la configuración guardada en localStorage.
                </p>
                <div className="flex gap-3">
                  <Dialog.Close asChild>
                    <button className="flex-1 h-10 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      Cancelar
                    </button>
                  </Dialog.Close>
                  <Dialog.Close asChild>
                    <button
                      onClick={handleReset}
                      className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors cursor-pointer"
                    >
                      Sí, resetear
                    </button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </div>
  );
}
