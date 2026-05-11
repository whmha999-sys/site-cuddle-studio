import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Back to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: 68,
        insetInlineEnd: 16,
        zIndex: 50,
        width: 44,
        height: 44,
        borderRadius: 999,
        background: '#e8590c',
        color: '#fff',
        border: 'none',
        boxShadow: '0 6px 18px rgba(232,89,12,0.35)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 200ms ease, transform 200ms ease',
      }}
    >
      <ChevronUp size={22} strokeWidth={2.5} />
    </button>
  );
}
