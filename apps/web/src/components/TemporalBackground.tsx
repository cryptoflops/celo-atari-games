import React from 'react';

export const TemporalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none" style={{ background: '#120b1a' }}>
      {/* Subtle pixel grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Faint Prosperity Yellow glow from top center — cabinet marquee */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(252,255,82,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Very subtle Forest green warmth from bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(71,101,32,0.04) 0%, transparent 70%)',
        }}
      />
    </div>
  );
};
