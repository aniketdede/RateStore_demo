import React, { useState } from 'react';

const Star = ({ filled, interactive, onMouseEnter, onMouseLeave, onClick, label }) => (
  <button
    type="button"
    aria-label={label}
    disabled={!interactive}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      padding: 2,
      lineHeight: 0,
      cursor: interactive ? 'pointer' : 'default',
    }}
  >
    <svg
      width="22" height="22" viewBox="0 0 24 24"
      fill={filled ? 'var(--accent-gold)' : 'none'}
      stroke={filled ? 'var(--accent-gold)' : 'var(--border-input)'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    </svg>
  </button>
);

// Read-only (display) when onChange is omitted; interactive star picker when provided.
export default function StarRating({ value = 0, onChange, size }) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === 'function';
  const shown = hover || value;

  return (
    <div role={interactive ? 'radiogroup' : 'img'} aria-label={value ? `${value} out of 5 stars` : 'Not rated yet'} style={{ display: 'inline-flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          filled={n <= shown}
          interactive={interactive}
          label={`${n} star${n > 1 ? 's' : ''}`}
          onMouseEnter={() => interactive && setHover(n)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onChange(n)}
        />
      ))}
    </div>
  );
}
