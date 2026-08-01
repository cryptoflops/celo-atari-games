import React from 'react';

export type BadgeStatus =
  | 'live'
  | 'beta'
  | 'soon'
  | 'locked'
  | 'verified'
  | 'warning'
  | 'danger';

const STATUS_TEXT: Record<BadgeStatus, string> = {
  live: 'LIVE',
  beta: 'BETA',
  soon: 'SOON',
  locked: 'LOCKED',
  verified: 'VERIFIED',
  warning: 'NOTICE',
  danger: 'ERROR',
};

/** A short ASCII marker so state never relies on color alone. */
const STATUS_MARKER: Record<BadgeStatus, string> = {
  live: '●',
  beta: '◆',
  soon: '◇',
  locked: '▣',
  verified: '✓',
  warning: '!',
  danger: '✕',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: BadgeStatus;
  /** Override the default text label (e.g. for a custom verification word). */
  label?: string;
  light?: boolean;
}

/**
 * Sega status badge. Marker + text always present so state is identifiable
 * without color (a11y). Use for LIVE / BETA / SOON / LOCKED / VERIFIED etc.
 */
export const Badge: React.FC<BadgeProps> = ({
  status,
  label,
  light = false,
  className,
  ...rest
}) => {
  const classes = ['sega-badge', `sega-badge--${status}`, className ?? '']
    .filter(Boolean)
    .join(' ');
  const text = label ?? STATUS_TEXT[status];
  return (
    <span className={classes} aria-label={text} role="status" {...rest}>
      <span aria-hidden="true">{STATUS_MARKER[status]}</span>
      <span>{text}</span>
      {light && <span aria-hidden="true" className="status-light status-light-live" />}
    </span>
  );
};

export interface RankBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  rank: number; // 1 = gold, 2 = silver, 3 = bronze
}

const RANK_LABEL: Record<number, string> = { 1: '1ST', 2: '2ND', 3: '3RD' };

/**
 * Rank badge for the scoreboard podium/list. Marker + label, never emoji-only.
 */
export const RankBadge: React.FC<RankBadgeProps> = ({ rank, className, ...rest }) => {
  const cls = ['sega-badge', `sega-badge--rank-${rank}`, className ?? ''].filter(Boolean).join(' ');
  const marker = rank <= 3 ? String.fromCharCode(0x2605) : '#'; // ★ for podium, # for rest
  return (
    <span className={cls} {...rest}>
      <span aria-hidden="true">{marker}</span>
      <span>{RANK_LABEL[rank] ?? `#${rank}`}</span>
    </span>
  );
};
