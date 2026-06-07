import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';
import { usePixieStore } from './store';
import { OnboardingShell } from './onboarding/OnboardingShell';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/physical/DashboardView';
import { ModulesView } from './views/physical/ModulesView';
import { PhysicalSettingsView } from './views/physical/PhysicalSettingsView';
import { PowerView } from './views/physical/PowerView';
import { CompanionView } from './views/digital/CompanionView';
import { DesktopModeView } from './views/digital/DesktopModeView';
import { DigitalSettingsView } from './views/digital/DigitalSettingsView';
import type { PhysicalTab, DigitalTab } from './types';

const toastStyle = { background: '#0d0d0d', color: '#f5f5f5', border: '1px solid oklch(0.22 0.018 210)' };

function ViewTransition({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { onboardingComplete, pixieMode } = usePixieStore();
  const [physicalTab, setPhysicalTab] = useState<PhysicalTab>('dashboard');
  const [digitalTab, setDigitalTab] = useState<DigitalTab>('companion');

  if (!onboardingComplete) {
    return (
      <>
        <Toaster position="bottom-right" theme="dark" toastOptions={{ style: toastStyle }} />
        <OnboardingShell />
      </>
    );
  }

  const viewKey = `${pixieMode}-${pixieMode === 'physical' ? physicalTab : digitalTab}`;

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Toaster position="bottom-right" theme="dark" toastOptions={{ style: toastStyle }} />

      <Sidebar
        mode={pixieMode}
        physicalTab={physicalTab}
        digitalTab={digitalTab}
        onPhysicalTabChange={setPhysicalTab}
        onDigitalTabChange={setDigitalTab}
      />

      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 min-h-screen">
        <ViewTransition id={viewKey}>
          {pixieMode === 'physical' ? (
            <>
              {physicalTab === 'dashboard' && <DashboardView />}
              {physicalTab === 'modules' && <ModulesView />}
              {physicalTab === 'settings' && <PhysicalSettingsView />}
              {physicalTab === 'power' && <PowerView />}
            </>
          ) : (
            <>
              {digitalTab === 'companion' && <CompanionView />}
              {digitalTab === 'desktop' && <DesktopModeView />}
              {digitalTab === 'settings' && <DigitalSettingsView />}
            </>
          )}
        </ViewTransition>
      </main>
    </div>
  );
}
