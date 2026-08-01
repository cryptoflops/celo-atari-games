import React from 'react';

export type StatusLightKind = 'live' | 'beta' | 'soon' | 'warn' | 'error';

export interface StatusLightProps extends React.HTMLAttributes<HTMLSpanElement> {
  kind: StatusLightKind;
  /** Required so the indicator is never color-only. Set aria-hidden when paired with explicit text. */
  label: string;
  hideLabel?: boolean;
}

/**
 * Tied status-light dot. Always carries a text label (visually hidden only when
 * `hideLabel` and an accompanying text node is already shown next to it).
 */
export const StatusLight: React.FC<StatusLightProps> = ({
  kind,
  label,
  hideLabel = false,
  className,
  ...rest
}) => (
  <span
    className={['inline-flex items-center gap-1.5', className ?? ''].filter(Boolean).join(' ')}
    {...rest}
  >
    <span aria-hidden="true" className={`status-light status-light-${kind}`} />
    <span className={hideLabel ? 'sr-only' : undefined}>{label}</span>
  </span>
);
