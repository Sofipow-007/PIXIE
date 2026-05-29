import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { usePixieStore } from './store';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './views/HomeView';
import { ModulesView } from './views/ModulesView';
import { GlobalSettingsView } from './views/GlobalSettingsView';
import { DesktopModeView } from './views/DesktopModeView';
import { PowerView } from './views/PowerView';
import { DesktopWidget } from './components/DesktopWidget';

export type ViewId = 'home' | 'modules' | 'settings' | 'desktop' | 'power';

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('home');
  const pixie = usePixieStore();

  const renderView = () => {
    switch (activeView) {
      case 'home':     return <HomeView store={pixie.store} patchDevice={pixie.patchDevice} setActiveView={setActiveView} />;
      case 'modules':  return <ModulesView store={pixie.store} patchModule={pixie.patchModule} patchModuleConfig={pixie.patchModuleConfig} />;
      case 'settings': return <GlobalSettingsView store={pixie.store} patchGlobal={pixie.patchGlobal} />;
      case 'desktop':  return <DesktopModeView store={pixie.store} setDesktopMode={pixie.setDesktopMode} patchWidgetConfig={pixie.patchWidgetConfig} />;
      case 'power':    return <PowerView store={pixie.store} />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Toaster richColors position="top-right" />
      <Sidebar activeView={activeView} onNavigate={setActiveView} deviceName={pixie.store.global.deviceName} online={pixie.store.device.online} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {renderView()}
      </main>
      {pixie.store.desktopModeActive && (
        <DesktopWidget store={pixie.store} onClose={() => pixie.setDesktopMode(false)} />
      )}
    </div>
  );
}