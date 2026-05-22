import React, { useState } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as SliderPrimitive from '@radix-ui/react-slider';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Toaster, toast } from 'sonner';
import { 
  Home, Settings, Monitor, Volume2, Bell, Power,
  Wifi, CheckCircle2, Moon, Clock, Cloud, Timer,
  Send, AlertTriangle, RefreshCw, X, CircleOff, Trash2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** --- UTILS --- */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** --- UI COMPONENTS --- */

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6", className)}>
    {children}
  </div>
);

const Label = ({ className, children, htmlFor }: { className?: string, children: React.ReactNode, htmlFor?: string }) => (
  <label htmlFor={htmlFor} className={cn("text-sm font-medium text-foreground mb-2 block", className)}>
    {children}
  </label>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-border bg-input-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full appearance-none rounded-xl border border-border bg-input-background px-4 py-2 pr-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
);
Select.displayName = "Select";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' }>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground text-muted-foreground hover:text-foreground",
    };
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-11 px-5 py-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const Switch = ({ checked, onCheckedChange, id }: { checked: boolean, onCheckedChange: (c: boolean) => void, id?: string }) => (
  <SwitchPrimitive.Root
    id={id}
    checked={checked}
    onCheckedChange={onCheckedChange}
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary" : "bg-muted"
    )}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitive.Root>
);

const Slider = ({ value, onValueChange, max = 100, step = 1 }: { value: number[], onValueChange: (v: number[]) => void, max?: number, step?: number }) => (
  <SliderPrimitive.Root
    className="relative flex w-full touch-none select-none items-center py-4"
    value={value}
    max={max}
    step={step}
    onValueChange={onValueChange}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-muted">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
);

/** --- MAIN APP COMPONENT --- */

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  // Global Mock State
  const [general, setGeneral] = useState({ name: 'PIXIE', language: 'en', city: 'Buenos Aires', wifi: 'HomeNetwork_5G' });
  const [display, setDisplay] = useState({ brightness: [80], timeout: '5', speed: 'normal' });
  const [sound, setSound] = useState({ volume: [60], timerAlarm: true, notifications: true });
  const [notifications, setNotifications] = useState({ enabled: true, customMessage: '' });
  const [power, setPower] = useState({ screenOn: true });
  
  const [recentNotifs, setRecentNotifs] = useState([
    { id: 1, msg: "Hello!", time: "10:45 AM" },
    { id: 2, msg: "Time for a break", time: "09:00 AM" }
  ]);

  const handleSave = () => {
    toast.success("Settings saved to device", {
      icon: <CheckCircle2 className="w-4 h-4 text-primary" />
    });
  };

  const TABS = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'general', label: 'General', icon: Settings },
    { id: 'display', label: 'Display', icon: Monitor },
    { id: 'sound', label: 'Sound', icon: Volume2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'power', label: 'Power', icon: Power },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans selection:bg-primary/30">
      <Toaster position="bottom-right" theme="dark" toastOptions={{ style: { background: '#18181b', color: '#fafafa', border: '1px solid #27272a' } }} />

      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/30 p-4 shrink-0">
        <div className="flex items-center gap-3 px-2 py-4 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
            <Monitor className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">PIXIE Config</span>
        </div>
        
        <nav className="flex flex-col gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full text-left",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Bottom Nav - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-md pb-safe z-50">
        <div className="flex justify-around items-center p-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 min-w-[60px] rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn("p-1.5 rounded-full", isActive && "bg-primary/10")}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 pb-24 md:pb-12 max-w-4xl mx-auto w-full overflow-y-auto">
        <div className="mb-8 md:hidden flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
             <Monitor className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">PIXIE Config</span>
        </div>

        {/* --- HOME VIEW --- */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Device Status</h1>
            
            <Card className="flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
              
              <div className="w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center shrink-0 border border-border shadow-inner">
                 <Monitor className="w-12 h-12 text-primary/80" />
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left z-10">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{general.name}</h2>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">Last sync: Just now</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-background rounded-xl p-3 border border-border flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                       <Clock className="w-4 h-4" />
                       <span className="text-xs font-medium">Mode</span>
                    </div>
                    <span className="font-semibold text-sm">Standby</span>
                  </div>
                  <div className="bg-background rounded-xl p-3 border border-border flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                       <Wifi className="w-4 h-4" />
                       <span className="text-xs font-medium">Network</span>
                    </div>
                    <span className="font-semibold text-sm truncate max-w-[80px]" title={general.wifi}>{general.wifi}</span>
                  </div>
                  <div className="bg-background rounded-xl p-3 border border-border flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                       <Cloud className="w-4 h-4" />
                       <span className="text-xs font-medium">Weather</span>
                    </div>
                    <span className="font-semibold text-sm truncate max-w-[80px]" title={general.city}>{general.city}</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button onClick={() => toast.success("Sync successful")} className="w-full md:w-auto gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Sync Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* --- GENERAL VIEW --- */}
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight">General Settings</h1>
            
            <Card className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deviceName">Device Name</Label>
                  <Input 
                    id="deviceName" 
                    value={general.name} 
                    onChange={e => setGeneral({...general, name: e.target.value})} 
                  />
                  <p className="text-xs text-muted-foreground">This name appears on your local network.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    id="language" 
                    value={general.language} 
                    onChange={e => setGeneral({...general, language: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="it">Italiano</option>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City for Weather</Label>
                  <Input 
                    id="city" 
                    value={general.city} 
                    onChange={e => setGeneral({...general, city: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wifi">WiFi Network</Label>
                  <div className="relative">
                    <Input id="wifi" value={general.wifi} readOnly className="pr-10 bg-muted/50 cursor-default text-muted-foreground" />
                    <Wifi className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-end">
                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </Card>
          </div>
        )}

        {/* --- DISPLAY VIEW --- */}
        {activeTab === 'display' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Display</h1>
            
            <Card className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Brightness</Label>
                  <span className="text-sm font-medium text-primary">{display.brightness[0]}%</span>
                </div>
                <Slider 
                  value={display.brightness} 
                  onValueChange={v => setDisplay({...display, brightness: v})} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timeout">Screen Timeout</Label>
                  <Select 
                    id="timeout" 
                    value={display.timeout} 
                    onChange={e => setDisplay({...display, timeout: e.target.value})}
                  >
                    <option value="never">Never (Always On)</option>
                    <option value="1">1 minute</option>
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="speed">Animation Speed</Label>
                  <Select 
                    id="speed" 
                    value={display.speed} 
                    onChange={e => setDisplay({...display, speed: e.target.value})}
                  >
                    <option value="slow">Slow</option>
                    <option value="normal">Normal</option>
                    <option value="fast">Fast</option>
                  </Select>
                  <p className="text-xs text-muted-foreground">Applies to standby face animations.</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-end">
                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </Card>
          </div>
        )}

        {/* --- SOUND VIEW --- */}
        {activeTab === 'sound' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Sound</h1>
            
            <Card className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Master Volume</Label>
                  <span className="text-sm font-medium text-primary">{sound.volume[0]}%</span>
                </div>
                <Slider 
                  value={sound.volume} 
                  onValueChange={v => setSound({...sound, volume: v})} 
                />
              </div>

              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="mb-0 text-base">Timer Alarm Sound</Label>
                    <p className="text-sm text-muted-foreground">Play a melody when a timer finishes.</p>
                  </div>
                  <Switch 
                    checked={sound.timerAlarm} 
                    onCheckedChange={c => setSound({...sound, timerAlarm: c})} 
                  />
                </div>
                
                <div className="w-full h-px bg-border"></div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="mb-0 text-base">Notification Sound</Label>
                    <p className="text-sm text-muted-foreground">Play a short beep for new notifications.</p>
                  </div>
                  <Switch 
                    checked={sound.notifications} 
                    onCheckedChange={c => setSound({...sound, notifications: c})} 
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <Button variant="outline" onClick={() => toast("Playing test sound on device...")}>
                  Test Sound
                </Button>
                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </Card>
          </div>
        )}

        {/* --- NOTIFICATIONS VIEW --- */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            
            <Card className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-border">
                <div className="space-y-0.5">
                  <Label className="mb-0 text-base">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">Allow PIXIE to receive and display messages.</p>
                </div>
                <Switch 
                  checked={notifications.enabled} 
                  onCheckedChange={c => setNotifications({...notifications, enabled: c})} 
                />
              </div>

              <div className={cn("space-y-6 transition-opacity", !notifications.enabled && "opacity-50 pointer-events-none")}>
                <div className="space-y-2">
                  <Label>Send custom message</Label>
                  <div className="flex gap-3">
                    <Input 
                      placeholder="Type a message to show on PIXIE..." 
                      value={notifications.customMessage}
                      onChange={e => setNotifications({...notifications, customMessage: e.target.value})}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && notifications.customMessage.trim()) {
                          const newMsg = { id: Date.now(), msg: notifications.customMessage, time: "Just now" };
                          setRecentNotifs([newMsg, ...recentNotifs].slice(0, 5));
                          setNotifications({...notifications, customMessage: ''});
                          toast.success("Message sent to device");
                        }
                      }}
                    />
                    <Button 
                      className="shrink-0 gap-2 px-6"
                      onClick={() => {
                        if(notifications.customMessage.trim()) {
                          const newMsg = { id: Date.now(), msg: notifications.customMessage, time: "Just now" };
                          setRecentNotifs([newMsg, ...recentNotifs].slice(0, 5));
                          setNotifications({...notifications, customMessage: ''});
                          toast.success("Message sent to device");
                        }
                      }}
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Recent Messages</Label>
                  <div className="space-y-2">
                    {recentNotifs.map((notif) => (
                      <div key={notif.id} className="flex justify-between items-center p-3 rounded-xl bg-background border border-border">
                        <span className="text-sm">{notif.msg}</span>
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                      </div>
                    ))}
                    {recentNotifs.length === 0 && (
                      <div className="p-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
                        No recent messages sent
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* --- POWER VIEW --- */}
        {activeTab === 'power' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold tracking-tight">Power & System</h1>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="space-y-6">
                <div className="flex items-center gap-3 text-lg font-semibold mb-2">
                  <Moon className="w-5 h-5 text-primary" />
                  Screen Control
                </div>
                <p className="text-sm text-muted-foreground">
                  Turn off the device screen remotely. The device will stay connected to WiFi.
                </p>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                  <span className="font-medium">Screen Active</span>
                  <Switch 
                    checked={power.screenOn} 
                    onCheckedChange={c => setPower({...power, screenOn: c})} 
                  />
                </div>
              </Card>

              <Card className="space-y-6 border-destructive/20">
                <div className="flex items-center gap-3 text-lg font-semibold mb-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-background border border-border">
                    <div className="space-y-1">
                      <span className="font-medium block text-sm">Restart Device</span>
                      <span className="text-xs text-muted-foreground">Reboots the hardware immediately.</span>
                    </div>
                    <Button variant="outline" onClick={() => toast("Device is restarting...")}>Restart</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="space-y-1">
                      <span className="font-medium block text-sm text-destructive">Factory Reset</span>
                      <span className="text-xs text-destructive/70">Wipes all configuration data.</span>
                    </div>
                    
                    {/* Radix Dialog for Confirmation */}
                    <DialogPrimitive.Root>
                      <DialogPrimitive.Trigger asChild>
                        <Button variant="destructive">Reset</Button>
                      </DialogPrimitive.Trigger>
                      <DialogPrimitive.Portal>
                        <DialogPrimitive.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-2xl">
                          <div className="flex flex-col gap-2">
                            <DialogPrimitive.Title className="text-lg font-semibold text-foreground flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-destructive" />
                              Reset to Factory Defaults
                            </DialogPrimitive.Title>
                            <DialogPrimitive.Description className="text-sm text-muted-foreground">
                              This action cannot be undone. This will permanently delete your device's WiFi configuration, preferences, and custom name. The device will reboot into setup mode.
                            </DialogPrimitive.Description>
                          </div>
                          
                          <div className="flex justify-end gap-3 mt-4">
                            <DialogPrimitive.Close asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogPrimitive.Close>
                            <DialogPrimitive.Close asChild>
                              <Button variant="destructive" onClick={() => {
                                toast.error("Factory reset initiated");
                                setActiveTab('home'); // Just for effect
                              }}>
                                Yes, reset device
                              </Button>
                            </DialogPrimitive.Close>
                          </div>
                          
                          <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                          </DialogPrimitive.Close>
                        </DialogPrimitive.Content>
                      </DialogPrimitive.Portal>
                    </DialogPrimitive.Root>
                    
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
