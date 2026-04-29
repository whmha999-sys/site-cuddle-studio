// Small presentational components
import React from 'react';

function Icon({ name, size = 18 }) {
  const s = { width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const map = {
    search: <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="7"/><path d="m20 20-3-3"/></svg>,
    user: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>,
    cart: <svg viewBox="0 0 24 24" {...s}><path d="M4 5h2l2 12h11l2-9H7"/><circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/></svg>,
    heart: <svg viewBox="0 0 24 24" {...s}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>,
    close: <svg viewBox="0 0 24 24" {...s}><path d="m6 6 12 12M18 6 6 18"/></svg>,
    chev: <svg viewBox="0 0 24 24" {...s}><path d="m9 6 6 6-6 6"/></svg>,
    chev_d: <svg viewBox="0 0 24 24" {...s}><path d="m6 9 6 6 6-6"/></svg>,
    back: <svg viewBox="0 0 24 24" {...s}><path d="m14 6-6 6 6 6"/></svg>,
    phone: <svg viewBox="0 0 24 24" {...s}><path d="M5 4h4l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>,
    globe: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>,
    check: <svg viewBox="0 0 24 24" {...s}><path d="m5 12 5 5 9-11"/></svg>,
    truck: <svg viewBox="0 0 24 24" {...s}><rect x="2" y="7" width="12" height="10" rx="1"/><path d="M14 10h4l3 4v3h-7"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/></svg>,
    shield: <svg viewBox="0 0 24 24" {...s}><path d="M12 3 4 6v6c0 5 3 8 8 9 5-1 8-4 8-9V6l-8-3z"/></svg>,
    spark: <svg viewBox="0 0 24 24" {...s}><path d="M12 3v5m0 8v5M3 12h5m8 0h5M6 6l3 3m6 6 3 3M6 18l3-3m6-6 3-3"/></svg>,
    bag: <svg viewBox="0 0 24 24" {...s}><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>,
    menu: <svg viewBox="0 0 24 24" {...s}><path d="M4 6h16M4 12h16M4 18h16"/></svg>,
    tag: <svg viewBox="0 0 24 24" {...s}><path d="M3 12V4h8l10 10-8 8L3 12z"/><circle cx="8" cy="9" r="1.5"/></svg>,
    settings: <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1L14.5 3.5h-5L9.1 6a7 7 0 0 0-1.7 1l-2.3-1-2 3.4L5.1 11a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.4 2.5h5l.4-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.4L19 13a7 7 0 0 0 0-1z"/></svg>,
  };
  return map[name] || null;
}
export { Icon };

function Price({ value, size = 'md' }) {
  return (
    <span className={`price price-${size}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
      <small>JOD</small>{value.toFixed(2)}
    </span>
  );
}
export { Price };

function Stars({ n = 5, rating = 4.7, count }) {
  return (
    <span style={{ display:'inline-flex', gap:4, alignItems:'center', fontSize:12, color:'var(--fg-3)' }}>
      <span style={{ color:'#d7a528', letterSpacing:1 }}>{'★'.repeat(Math.round(rating))}</span>
      {count != null && <span style={{ fontFamily:'var(--font-mono)' }}>({count})</span>}
    </span>
  );
}
export { Stars };

function Logo() {
  return (
    <a className="logo" onClick={(e)=>{ e.preventDefault(); window.navigate?.('home'); }} href="#">
      <img src="/uploads/image-removebg-preview.png" alt="Smart Leaders Co." style={{ height: 192, width: 'auto', display: 'block' }}/>
    </a>
  );
}
export { Logo };
