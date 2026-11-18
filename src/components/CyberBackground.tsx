import React from 'react';
import { useGame } from '../context/GameContext';

/**
 * CyberBackground: Multi-layered tactical HUD background
 * Adapts to the active universe theme (Sunset Néon default or Cyber Grid)
 */
export const CyberBackground: React.FC = () => {
  const { activeTheme } = useGame();
  const isViceSunset = activeTheme === 'sunset-neon';

  return (
    <div
      className={`fixed inset-0 z-[-1] pointer-events-none overflow-hidden select-none transition-colors duration-500 ${
        isViceSunset ? 'bg-[#120428]' : 'bg-[#090d16]'
      }`}
    >
      {/* Layer 1: Blueprint Engineering Grid */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: isViceSunset
            ? `
              linear-gradient(to right, rgba(255, 42, 133, 0.45) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 240, 255, 0.35) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(6, 182, 212, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.4) 1px, transparent 1px)
            `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Secondary larger tactical grid coordinates */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: isViceSunset
            ? `
              linear-gradient(to right, rgba(0, 240, 255, 0.7) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 123, 0, 0.6) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(6, 182, 212, 0.8) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.8) 1px, transparent 1px)
            `,
          backgroundSize: '160px 160px',
        }}
      />

      {/* Layer 2: CRT Scanlines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.8) 1px,
            transparent 1px,
            transparent 2px
          )`,
          backgroundSize: '100% 2px',
        }}
      />

      {/* Layer 3: Subtle SVG Noise / Grain */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03] mix-blend-overlay">
        <filter id="cyber-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cyber-noise)" />
      </svg>

      {/* Layer 4: Radial HUD Vignette & Sunset Néon Horizon Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isViceSunset
            ? `
              radial-gradient(circle at 20% 15%, rgba(255, 42, 133, 0.14) 0%, transparent 50%),
              radial-gradient(circle at 80% 12%, rgba(255, 123, 0, 0.12) 0%, transparent 45%),
              radial-gradient(circle at 50% 85%, rgba(0, 240, 255, 0.08) 0%, transparent 55%),
              radial-gradient(circle at 50% 50%, transparent 40%, rgba(18, 4, 40, 0.88) 100%)
            `
            : `
              radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.05) 0%, transparent 60%),
              radial-gradient(circle at 50% 50%, transparent 40%, rgba(9, 13, 22, 0.85) 100%)
            `,
        }}
      />
    </div>
  );
};
