import React from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'locked' | 'accent';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  /** When provided, renders as a router-aware anchor via className passthrough (caller installs <Link>). */
  fullWidth?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: 'arcade-btn',
  secondary: 'arcade-btn arcade-btn-secondary',
  tertiary: 'arcade-btn arcade-btn-tertiary',
  destructive: 'arcade-btn arcade-btn-destructive',
  locked: 'arcade-btn arcade-btn-locked',
  accent: 'arcade-btn arcade-btn-accent',
};

/**
 * Sega arcade button. Pill-shaped, hard offset-block shadow, compresses on
 * active. Variants map to `.arcade-btn*` classes in index.css. The loading
 * state preserves button width and shows a pixel prompt overlay.
 *
 * For router links, wrap a `<Link>` or `<a>` with the same class string via
 * `buttonClass(variant)` instead of using this component.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}) => {
  const classes = [
    variantClass[variant],
    fullWidth ? 'w-full' : '',
    loading ? 'is-loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  );
};

/** Class string for the same variants, for use on <Link>/<a> elements. */
export const buttonClass = (variant: Variant = 'primary', extra = '') =>
  [variantClass[variant], extra].filter(Boolean).join(' ');
