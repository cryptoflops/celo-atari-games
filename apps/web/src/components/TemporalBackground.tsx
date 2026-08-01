import type { FC } from 'react';

/**
 * Sega-tinted ambient backdrop. Pixel grid + a primary-blue top glow and a
 * secondary-yellow bottom glow — colors come from tokens, the whole layer is
 * decorative and pointer-events-none behind the app.
 */
export const TemporalBackground: FC = () => {
  return (
    <div
      className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
      style={{ background: 'var(--color-background)' }}
      aria-hidden="true"
    >
      {/* Subtle pixel grid */}
      <div
        className="absolute inset-0"
        style={{
          opacity: '0.04',
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Primary blue marquee glow from top center */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(69,2,255,0.10) 0%, transparent 70%)',
        }}
      />

      {/* Secondary yellow glow from bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,218,20,0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
