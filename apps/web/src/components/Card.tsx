import React from 'react';

type PanelVariant = 'default' | 'featured' | 'paper' | 'locked';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: PanelVariant;
  interactive?: boolean;
}

const panelClass: Record<PanelVariant, string> = {
  default: 'sega-panel',
  featured: 'sega-panel sega-panel-featured',
  paper: 'sega-panel sega-panel-paper',
  locked: 'sega-panel sega-panel-locked',
};

/** Hard-edged 0px Sega panel. Strong ink border, hard offset shadow, no blur. */
export const Panel: React.FC<PanelProps> = ({
  variant = 'default',
  interactive = false,
  className,
  children,
  ...rest
}) => {
  const classes = [
    panelClass[variant],
    interactive ? 'sega-panel-interactive' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};

/** Featured arcade card with rainbow cabinet-trim shadow. Reserve margin so the
 *  trim never collides with neighbouring UI. */
export const FeaturedCard: React.FC<PanelProps> = ({ className, children, ...rest }) => (
  <Panel variant="featured" className={['mb-3', className ?? ''].filter(Boolean).join(' ')} {...rest}>
    {children}
  </Panel>
);

/** Locked card — intentional unavailable treatment, not just opacity. */
export const LockedCard: React.FC<PanelProps> = ({ className, children, ...rest }) => (
  <Panel variant="locked" className={className} {...rest}>
    {children}
  </Panel>
);

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}

/** Compact stat module for player cards / HUD blocks. */
export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  hint,
  className,
  ...rest
}) => (
  <div className={['sega-card-stats', className ?? ''].filter(Boolean).join(' ')} {...rest}>
    <div className="tech-label text-white/55" style={{ fontSize: '13px' }}>{label}</div>
    <div className="font-arcade text-cream" style={{ fontSize: '21px', lineHeight: 1.1 }}>{value}</div>
    {hint && <div className="tech-label text-white/45" style={{ fontSize: '13px' }}>{hint}</div>}
  </div>
);
