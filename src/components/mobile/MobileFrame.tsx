import React, { useState, useEffect } from 'react';
import { Smartphone, Moon, Sun, RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const { theme, toggleTheme, isPhoneSimulator, togglePhoneSimulator, resetAllData } = useGame();
  const [currentTime, setCurrentTime] = useState<string>('9:41');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // If phone simulator is disabled or opened on a real mobile device viewport, render full screen directly
  if (!isPhoneSimulator) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-surface text-on-surface">
        {/* Floating Quick Action Bar */}
        <div className="fixed top-2 right-2 z-50 flex items-center gap-1.5 bg-surface-container-high/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-outline-variant/40 shadow-lg text-xs">
          <button
            onClick={togglePhoneSimulator}
            title="Switch to Phone Frame view"
            className="p-1 hover:text-primary-container transition-colors"
          >
            <Smartphone className="w-4 h-4" />
          </button>
          <button
            onClick={toggleTheme}
            title="Toggle Dark/Light theme"
            className="p-1 hover:text-secondary transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-secondary" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#08090d] flex flex-col items-center justify-center p-0 sm:py-8 sm:px-4">
      {/* Simulator Control Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[430px] mb-3 px-3 py-1.5 bg-surface-container-lowest/80 backdrop-blur-md rounded-2xl border border-outline-variant/30 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-mono font-medium text-on-surface">AetherFit Mobile Simulator</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high hover:text-on-surface transition-colors"
            title="Toggle Dark/Light theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-secondary" /> : <Moon className="w-3.5 h-3.5" />}
            <span className="font-mono uppercase">{theme}</span>
          </button>
          <button
            onClick={togglePhoneSimulator}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container-high hover:text-on-surface transition-colors"
            title="Toggle full screen view"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="font-mono">Fill</span>
          </button>
          <button
            onClick={resetAllData}
            className="p-1 rounded-lg hover:text-error hover:bg-error-container/20 transition-colors"
            title="Reset to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulated Smartphone Chassis (iPhone 15 Pro / Pixel dimensions) */}
      <div className="w-full sm:w-[412px] h-screen sm:h-[860px] bg-surface text-on-surface sm:rounded-[48px] sm:ring-[10px] sm:ring-[#282a32] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(0,255,135,0.15)] flex flex-col relative overflow-hidden">
        {/* Dynamic Island / Top Speaker Notch */}
        <div className="absolute top-0 left-0 right-0 h-10 z-50 flex items-center justify-between px-7 pt-2 pointer-events-none">
          {/* Status Bar: Time */}
          <span className="font-mono text-xs font-semibold tracking-tight text-on-surface">
            {currentTime}
          </span>

          {/* Dynamic Island Pill */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container/20 border border-primary-container flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-primary-container"></span>
            </span>
          </div>

          {/* Status Bar: Icons */}
          <div className="flex items-center gap-1.5 text-on-surface text-[11px]">
            <span className="material-symbols-outlined text-[13px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[13px]">wifi</span>
            <div className="w-5 h-2.5 rounded-[3px] border border-on-surface/80 p-0.5 flex items-center">
              <div className="w-full h-full bg-primary-container rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Mobile Viewport Content Container */}
        <div className="flex-1 w-full h-full flex flex-col overflow-hidden relative">
          {children}
        </div>

        {/* Mobile Bottom Home Bar Indicator */}
        <div className="absolute bottom-1 left-0 right-0 z-50 flex justify-center pointer-events-none pb-1">
          <div className="w-36 h-1 bg-on-surface/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
