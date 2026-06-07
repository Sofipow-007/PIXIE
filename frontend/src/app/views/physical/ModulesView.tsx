import React from 'react';
import { ModuleCard } from '../../components/ModuleCard';
import type { ModuleId } from '../../types';

const MODULE_ORDER: ModuleId[] = ['standby', 'clock', 'weather', 'timer', 'translator'];

export function ModulesView() {
  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Módulos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Activá o desactivá los módulos del firmware. Los cambios se sincronizan al device.
        </p>
      </div>

      <div className="space-y-3">
        {MODULE_ORDER.map(id => (
          <ModuleCard key={id} moduleId={id} />
        ))}
      </div>
    </div>
  );
}
