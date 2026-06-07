import React, { useState } from 'react';
import { usePixieStore } from '../store';
import { WelcomeStep } from './steps/WelcomeStep';
import { NameStep } from './steps/NameStep';
import { WiFiStep } from './steps/WiFiStep';
import { CityStep } from './steps/CityStep';
import { DoneStep } from './steps/DoneStep';
import pixieLogo from '../../images/PIXIE-Logo.png';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type Step = 'welcome' | 'name' | 'wifi' | 'city' | 'done';

const PHYSICAL_STEPS: Step[] = ['welcome', 'name', 'wifi', 'city', 'done'];
const DIGITAL_STEPS: Step[] = ['welcome', 'name', 'city', 'done'];

function ProgressBar({ steps, current }: { steps: Step[]; current: Step }) {
  const idx = steps.indexOf(current);
  const progress = steps.length <= 1 ? 100 : (idx / (steps.length - 1)) * 100;
  return (
    <div
      style={{
        width: '6rem',
        height: '3px',
        borderRadius: '99px',
        background: 'oklch(0.22 0.018 210)',
        overflow: 'hidden',
      }}
      role="progressbar"
      aria-valuenow={idx + 1}
      aria-valuemin={1}
      aria-valuemax={steps.length}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'oklch(0.73 0.155 192)',
          borderRadius: '99px',
          transition: 'width 300ms ease',
        }}
      />
    </div>
  );
}

export function OnboardingShell() {
  const { setHasPhysicalDevice, setOnboardingComplete, deviceName } = usePixieStore();
  const [step, setStep] = useState<Step>('welcome');
  const [hasDevice, setHasDevice] = useState(false);

  // True when the user navigated here from the main app (logo click)
  const isReturning = deviceName !== 'PIXIE';

  const steps = hasDevice ? PHYSICAL_STEPS : DIGITAL_STEPS;

  function goNext() {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  }

  function goBack() {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  }

  function handleWelcomeChoice(device: boolean) {
    setHasDevice(device);
    setHasPhysicalDevice(device);
    const nextSteps = device ? PHYSICAL_STEPS : DIGITAL_STEPS;
    setStep(nextSteps[1]);
  }

  const showHeader = step !== 'welcome';

  return (
    <div
      style={{
        height: '100dvh',
        background: 'oklch(0.07 0.000 0)',
        display: 'flex',
        flexDirection: 'column',
        overflow: step === 'welcome' ? 'hidden' : 'auto',
      }}
    >
      {/* Header — only visible after welcome */}
      {showHeader && (
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid oklch(0.22 0.018 210)',
            flexShrink: 0,
          }}
        >
          <img src={pixieLogo} alt="PIXIE" style={{ height: '1.875rem' }} />

          {step !== 'done' && (
            <ProgressBar steps={steps.slice(1, -1)} current={step} />
          )}

          {step !== 'done' ? (
            <button
              onClick={goBack}
              aria-label="Volver al paso anterior"
              className="cursor-pointer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.375rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid oklch(0.22 0.018 210)',
                background: 'transparent',
                color: 'oklch(0.50 0.018 210)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                transition: 'color 150ms, border-color 150ms',
              }}
              onMouseEnter={e => {
                const b = e.currentTarget;
                b.style.color = 'oklch(0.96 0.008 200)';
                b.style.borderColor = 'oklch(0.35 0.018 210)';
              }}
              onMouseLeave={e => {
                const b = e.currentTarget;
                b.style.color = 'oklch(0.50 0.018 210)';
                b.style.borderColor = 'oklch(0.22 0.018 210)';
              }}
            >
              <ArrowLeft style={{ width: '0.875rem', height: '0.875rem' }} />
              Volver
            </button>
          ) : (
            <div style={{ width: '4.5rem' }} />
          )}
        </header>
      )}

      {/* Welcome header (logo only, no nav) */}
      {!showHeader && (
        <header
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            zIndex: 10,
          }}
        >
          <img src={pixieLogo} alt="PIXIE" style={{ height: '1.875rem' }} />

          {isReturning && (
            <button
              onClick={() => setOnboardingComplete(true)}
              className="cursor-pointer"
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '0.375rem',
                padding:     '0.375rem 0.875rem',
                borderRadius: '0.5rem',
                border:      '1px solid oklch(0.73 0.155 192 / 0.25)',
                background:  'oklch(0.73 0.155 192 / 0.06)',
                color:       'oklch(0.73 0.155 192)',
                fontSize:    '0.8125rem',
                fontWeight:  600,
                fontFamily:  '"Plus Jakarta Sans", sans-serif',
                transition:  'background 150ms, border-color 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background    = 'oklch(0.73 0.155 192 / 0.12)';
                e.currentTarget.style.borderColor   = 'oklch(0.73 0.155 192 / 0.45)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background    = 'oklch(0.73 0.155 192 / 0.06)';
                e.currentTarget.style.borderColor   = 'oklch(0.73 0.155 192 / 0.25)';
              }}
            >
              Volver a la app
              <ArrowRight style={{ width: '0.8rem', height: '0.8rem' }} />
            </button>
          )}
        </header>
      )}

      {/* Step content */}
      <div style={{ flex: 1, overflow: step === 'welcome' ? 'hidden' : 'visible', display: 'flex', flexDirection: 'column' }}>
        {step === 'welcome' && <WelcomeStep onChoose={handleWelcomeChoice} />}
        {step === 'name' && <NameStep onNext={goNext} />}
        {step === 'wifi' && <WiFiStep onNext={goNext} onSkip={goNext} />}
        {step === 'city' && <CityStep onNext={goNext} />}
        {step === 'done' && <DoneStep onFinish={() => {}} />}
      </div>
    </div>
  );
}
