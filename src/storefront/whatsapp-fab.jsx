// Floating WhatsApp contact button — high-trust signal for MENA shoppers
import React from 'react';

const WA_NUMBER = '962790000000'; // Jordan mobile placeholder

export default function WhatsAppFab({ lang = 'en' }) {
  const isAr = lang === 'ar';
  const msg = encodeURIComponent(
    isAr
      ? 'مرحبا، أود الاستفسار عن منتج من Smart Leaders.'
      : "Hi, I'd like to ask about a Smart Leaders product."
  );
  const href = `https://wa.me/${WA_NUMBER}?text=${msg}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
      title={isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
      className="wa-fab"
    >
      <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden="true" className="wa-fab-icon">
        <defs>
          <linearGradient id="waGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43e97b" />
            <stop offset="100%" stopColor="#25d366" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waGrad)"
          d="M16 2C8.27 2 2 8.27 2 16c0 2.38.58 4.66 1.64 6.73L2.06 29.7l6.97-1.62A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm8.48 19.33c-.3.85-1.73 1.56-2.42 1.66-.65.1-1.23.44-4.13-.88-3.5-1.56-5.76-5.45-5.93-5.7-.17-.25-1.41-1.88-1.41-3.58 0-1.71.9-2.54 1.22-2.88.32-.34.7-.42.93-.42.23 0 .47 0 .68.01.22.01.52-.09.81.61.3.71 1.03 2.46 1.12 2.64.09.18.15.39.03.6-.12.21-.18.34-.36.53-.18.18-.38.38-.54.52-.17.16-.35.33-.21.65.14.32.64 1.06 1.08 1.71.74 1.04 1.35 1.4 1.56 1.55.21.15.34.13.46-.08.12-.21.54-.63.68-.85.14-.21.28-.18.47-.1.19.09 1.22.58 1.43.68.21.1.35.15.4.24.05.09.03.52-.07.87z"
        />
      </svg>
      <span className="wa-fab-badge">1</span>
    </a>
  );
}
