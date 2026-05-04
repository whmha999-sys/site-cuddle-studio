// SVG silhouettes for product imagery. Generic + brand-neutral.
import React from 'react';
import { PRODUCT_IMAGES, COLOR_SWATCH } from './data.js';

const TABLET_COLORS = {
  graphite: { body: '#2c2c30', bezel: '#0f0f12', screen: '#1a2030' },
  silver:   { body: '#c9cbcf', bezel: '#8a8d93', screen: '#d6dae2' },
  midnight: { body: '#1a2030', bezel: '#0a0c14', screen: '#12182a' },
  blue:     { body: '#3a6bd6', bezel: '#1c3e8a', screen: '#2a4fa0' },
  pink:     { body: '#e8a0b8', bezel: '#a66a80', screen: '#f3c2d2' },
};
const WATCH_COLORS = {
  black:  { case: '#17181b', strap: '#2a2b2e', screen: '#0a0a0a' },
  silver: { case: '#c9cbcf', strap: '#8a8d93', screen: '#d6dae2' },
  gold:   { case: '#c9a24b', strap: '#8b6c2c', screen: '#1a1a1a' },
};

function TabletSVG({ color = 'graphite' }) {
  const c = TABLET_COLORS[color] || TABLET_COLORS.graphite;
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* body */}
      <rect x="30" y="20" width="140" height="220" rx="14" fill={c.body} />
      <rect x="30" y="20" width="140" height="220" rx="14" fill="none" stroke={c.bezel} strokeWidth="1.5" />
      {/* screen */}
      <rect x="40" y="30" width="120" height="200" rx="6" fill={c.screen} />
      <rect x="40" y="30" width="120" height="200" rx="6" fill="url(#tabGloss)" opacity="0.25" />
      {/* camera */}
      <circle cx="100" cy="26" r="1.5" fill={c.bezel} />
      <defs>
        <linearGradient id="tabGloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.6"/>
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function WatchSVG({ color = 'black' }) {
  const c = WATCH_COLORS[color] || WATCH_COLORS.black;
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      {/* strap top */}
      <rect x="80" y="20" width="40" height="60" rx="6" fill={c.strap} />
      {/* case */}
      <rect x="55" y="70" width="90" height="120" rx="22" fill={c.case} />
      <rect x="55" y="70" width="90" height="120" rx="22" fill="none" stroke="#00000022" strokeWidth="1"/>
      {/* screen */}
      <rect x="65" y="82" width="70" height="96" rx="14" fill={c.screen} />
      <rect x="65" y="82" width="70" height="96" rx="14" fill="url(#watchGloss)" opacity="0.3" />
      {/* crown */}
      <rect x="145" y="118" width="6" height="20" rx="2" fill={c.strap} />
      {/* strap bottom */}
      <rect x="80" y="180" width="40" height="60" rx="6" fill={c.strap} />
      <defs>
        <linearGradient id="watchGloss" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5"/>
          <stop offset="0.6" stopColor="#ffffff" stopOpacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function PowerBankSVG({ color = 'black' }) {
  const body = color === 'white' ? '#f2f2f0' : '#17181b';
  const detail = color === 'white' ? '#c9cbcf' : '#3a3b3e';
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="40" y="60" width="120" height="140" rx="16" fill={body} />
      <rect x="40" y="60" width="120" height="140" rx="16" fill="none" stroke="#00000022"/>
      <rect x="56" y="90" width="8" height="40" rx="2" fill={detail}/>
      <rect x="70" y="90" width="8" height="40" rx="2" fill={detail}/>
      <rect x="84" y="90" width="8" height="40" rx="2" fill={detail}/>
      <rect x="98" y="90" width="8" height="40" rx="2" fill={detail}/>
      <circle cx="130" cy="110" r="4" fill={detail}/>
      <rect x="116" y="150" width="28" height="10" rx="2" fill={detail}/>
    </svg>
  );
}

function KeyboardSVG() {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="20" y="90" width="160" height="80" rx="8" fill="#2c2c30"/>
      {[0,1,2,3].map(r =>
        [0,1,2,3,4,5,6,7,8,9].map(c => (
          <rect key={`${r}-${c}`} x={28 + c*14.5} y={100 + r*16} width="11" height="11" rx="2" fill="#3a3b3e"/>
        ))
      )}
    </svg>
  );
}

function PenSVG() {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="90" y="30" width="20" height="200" rx="6" fill="#2c2c30"/>
      <polygon points="90,30 110,30 100,10" fill="#c9cbcf"/>
      <rect x="90" y="200" width="20" height="30" rx="4" fill="#c9a24b"/>
    </svg>
  );
}

function BagSVG() {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="35" y="55" width="130" height="160" rx="12" fill="#2c2c30"/>
      <rect x="45" y="65" width="110" height="140" rx="8" fill="none" stroke="#3a3b3e" strokeWidth="2" strokeDasharray="4 3"/>
      <rect x="60" y="45" width="80" height="18" rx="6" fill="#3a3b3e"/>
    </svg>
  );
}

function ChargerSVG() {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="60" y="80" width="80" height="80" rx="12" fill="#f2f2f0"/>
      <rect x="60" y="80" width="80" height="80" rx="12" fill="none" stroke="#c9cbcf"/>
      <rect x="88" y="60" width="8" height="22" fill="#c9cbcf"/>
      <rect x="104" y="60" width="8" height="22" fill="#c9cbcf"/>
      <rect x="95" y="160" width="10" height="30" rx="2" fill="#2c2c30"/>
    </svg>
  );
}

function CableSVG() {
  return (
    <svg viewBox="0 0 200 260" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
      <rect x="50" y="40" width="16" height="30" rx="3" fill="#2c2c30"/>
      <path d="M 58 70 C 58 120, 142 100, 142 160 C 142 200, 80 190, 80 230" stroke="#2c2c30" strokeWidth="10" fill="none" strokeLinecap="round"/>
      <rect x="72" y="220" width="16" height="30" rx="3" fill="#2c2c30"/>
    </svg>
  );
}

export function Silhouette({ product, color, size = 'md', imgIndex = 0 }) {
  const c = color || product.colors[0];
  // Use real photo if available
  const imgs = PRODUCT_IMAGES?.[product.id]?.[c];
  if (Array.isArray(imgs) && imgs.length > 0) {
    const src = imgs[imgIndex] || imgs[0];
    return (
      <div className={`silhouette silhouette-${size}`} style={{ display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%' }}>
        <img
          src={src}
          alt={product.name + ' ' + c}
          style={{ width:'100%', height:'100%', objectFit:'contain', display:'block' }}
        />
      </div>
    );
  }
  let inner;
  if (product.category === 'tablet') inner = <TabletSVG color={c} />;
  else if (product.category === 'watch') inner = <WatchSVG color={c} />;
  else {
    const id = product.id;
    if (id.startsWith('p')) inner = <PowerBankSVG color={c}/>;
    else if (id === 'mini-keyboard') inner = <KeyboardSVG/>;
    else if (id === 'stylus-pen') inner = <PenSVG/>;
    else if (id.startsWith('tablet-bag')) inner = <BagSVG/>;
    else if (id === 'u35d') inner = <ChargerSVG/>;
    else inner = <CableSVG/>;
  }
  return <div className={`silhouette silhouette-${size}`}>{inner}</div>;
}

export function ColorDot({ color, selected, onClick, size = 20 }) {
  const bg = COLOR_SWATCH[color] || '#999';
  return (
    <button
      onClick={onClick}
      className="color-dot"
      style={{ width: size, height: size, background: bg, outline: selected ? '2px solid var(--fg)' : 'none', outlineOffset: 2 }}
      aria-label={color}
    />
  );
}
