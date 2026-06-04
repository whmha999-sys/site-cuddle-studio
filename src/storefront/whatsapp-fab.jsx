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
      <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
        <path
          fill="currentColor"
          d="M19.11 17.21c-.28-.14-1.64-.81-1.9-.9-.26-.1-.45-.14-.63.14-.19.28-.72.9-.88 1.08-.16.18-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.64-1.54-1.92-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.18-.28.28-.46.09-.18.04-.35-.02-.49-.07-.14-.63-1.51-.86-2.07-.23-.55-.46-.48-.63-.49-.16-.01-.35-.01-.54-.01-.18 0-.49.07-.74.35-.26.28-.97.95-.97 2.31s.99 2.68 1.13 2.87c.14.18 1.96 3 4.74 4.2.66.29 1.18.46 1.58.59.66.21 1.27.18 1.74.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.21.16-1.32-.07-.11-.26-.18-.54-.32z"
        />
        <path
          fill="currentColor"
          d="M26.59 5.4A14.92 14.92 0 0 0 16 1.07C7.78 1.07 1.1 7.75 1.1 15.96c0 2.62.69 5.18 2.01 7.43L1 31l7.8-2.05a14.9 14.9 0 0 0 7.2 1.83h.01c8.21 0 14.89-6.68 14.89-14.89 0-3.98-1.55-7.72-4.31-10.49zM16 28.27h-.01a12.27 12.27 0 0 1-6.25-1.71l-.45-.27-4.63 1.21 1.24-4.51-.29-.46a12.3 12.3 0 0 1-1.88-6.56c0-6.79 5.53-12.32 12.33-12.32 3.29 0 6.39 1.28 8.71 3.61a12.24 12.24 0 0 1 3.61 8.72c-.01 6.79-5.54 12.29-12.38 12.29z"
        />
      </svg>
    </a>
  );
}
