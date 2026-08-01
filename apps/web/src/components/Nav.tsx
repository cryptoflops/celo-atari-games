import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface NavItem {
  to: string;
  label: string;
}

export interface NavProps {
  items: NavItem[];
  /** Optional short marker glyph for the active tab edge. */
  activeMarker?: string;
}

/**
 * Sega text-first bottom navigation. Active state = filled primary block with a
 * secondary top-border marker plus a `data-active-marker` character pin — uses
 * fill + marker + border beyond color alone. Keyboard focus-visible handled by
 * the `.sega-menu-item:focus-visible` rule in index.css (3px yellow ring).
 */
export const Nav: React.FC<NavProps> = ({ items, activeMarker = '◆' }) => {
  const location = useLocation();
  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-ink bg-surface/95 pb-safe flex"
    >
      {items.map((item) => {
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            aria-current={active ? 'page' : undefined}
            className="sega-menu-item"
            data-active-marker={active ? activeMarker : undefined}
          >
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};
