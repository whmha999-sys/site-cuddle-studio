// Top-right country/currency switcher.
import React, { useEffect, useRef, useState } from 'react';
import { CURRENCIES } from './currencies.js';
import { useCurrency } from './currency-context.jsx';

export default function CurrencySwitcher({ lang = 'en' }) {
  const { code, currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  return (
    <div ref={ref} className="currency-switcher" style={{ position: 'relative' }}>
      <button
        type="button"
        className="icon-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Change currency"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
      >
        <span style={{ fontSize: 16, lineHeight: 1 }}>{currency.flag}</span>
        <span style={{ fontWeight: 600, fontSize: 13 }}>{code}</span>
      </button>
      {open && (
        <div
          role="listbox"
          className="currency-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            insetInlineEnd: 0,
            background: '#fff',
            border: '1px solid var(--line, #e5e5e5)',
            borderRadius: 10,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            minWidth: 200,
            zIndex: 200,
            overflow: 'hidden',
          }}
        >
          {Object.values(CURRENCIES).map((c) => {
            const active = c.code === code;
            return (
              <button
                key={c.code}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { setCurrency(c.code); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '10px 14px',
                  background: active ? 'rgba(232,89,12,0.08)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'start',
                  fontSize: 14,
                  color: 'var(--fg, #111)',
                }}
              >
                <span style={{ fontSize: 18, lineHeight: 1 }}>{c.flag}</span>
                <span style={{ flex: 1 }}>{c.countryName[lang] || c.countryName.en}</span>
                <span style={{ fontWeight: 600, color: 'var(--fg-3, #777)', fontSize: 12 }}>{c.code}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
