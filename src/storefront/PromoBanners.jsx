import React, { useState, useEffect, useRef } from 'react';
import { usePromos } from '@/hooks/usePromos';

// Inject styles once
const promoBannerStyles = `
  @keyframes pb-fade-in { from { opacity: 0; } to { opacity: 1; } }
  .pb-section {
    width: 100%;
    margin-top: 32px;
    position: relative;
  }
  .pb-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 6;
    border-radius: var(--radius-lg, 16px);
    overflow: hidden;
    border: 1px solid var(--border, rgba(255,255,255,0.08));
    background: var(--bg-2, #0f1115);
    box-shadow: 0 10px 40px rgba(0,0,0,0.25);
  }
  .pb-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 0.7s ease;
    display: block;
    text-decoration: none;
    color: inherit;
  }
  .pb-slide.is-active { opacity: 1; }
  .pb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .pb-caption {
    position: absolute;
    left: 24px;
    bottom: 20px;
    padding: 10px 16px;
    background: rgba(0,0,0,0.55);
    backdrop-filter: blur(8px);
    border-radius: 10px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: 0.01em;
    max-width: 70%;
    animation: pb-fade-in 0.6s ease both;
  }
  .pb-dots {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 4;
  }
  .pb-dot {
    width: 8px; height: 8px; border-radius: 4px;
    background: rgba(255,255,255,0.35);
    border: none; padding: 0; cursor: pointer;
    transition: all 0.3s ease;
  }
  .pb-dot.is-active { width: 24px; background: #fff; }

  @media (max-width: 768px) {
    .pb-frame { aspect-ratio: 16 / 9; border-radius: 14px; }
    .pb-caption { left: 14px; bottom: 14px; font-size: 14px; padding: 8px 12px; }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('pb-styles')) {
  const s = document.createElement('style');
  s.id = 'pb-styles';
  s.textContent = promoBannerStyles;
  document.head.appendChild(s);
}

export function PromoBanners() {
  const { data: promos = [], isLoading } = usePromos();
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (promos.length <= 1) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIdx((i) => (i + 1) % promos.length);
    }, 6000);
    return () => clearTimeout(timerRef.current);
  }, [idx, promos.length]);

  // Reset index if list shrinks
  useEffect(() => {
    if (idx >= promos.length) setIdx(0);
  }, [promos.length, idx]);

  if (isLoading || promos.length === 0) return null;

  return (
    <section className="pb-section" aria-label="Promotions">
      <div className="pb-frame">
        {promos.map((p, i) => {
          const isActive = i === idx;
          const Inner = (
            <>
              <img
                src={p.image_url}
                alt={p.title || 'Promo banner'}
                className="pb-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {p.title ? <div className="pb-caption">{p.title}</div> : null}
            </>
          );
          const className = `pb-slide ${isActive ? 'is-active' : ''}`;
          const style = { pointerEvents: isActive ? 'auto' : 'none' };
          return p.link_url ? (
            <a
              key={p.id}
              href={p.link_url}
              className={className}
              style={style}
              target={p.link_url.startsWith('http') ? '_blank' : undefined}
              rel={p.link_url.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              {Inner}
            </a>
          ) : (
            <div key={p.id} className={className} style={style} aria-hidden={!isActive}>
              {Inner}
            </div>
          );
        })}

        {promos.length > 1 && (
          <div className="pb-dots">
            {promos.map((_, i) => (
              <button
                key={i}
                className={`pb-dot ${i === idx ? 'is-active' : ''}`}
                aria-label={`Show promo ${i + 1}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default PromoBanners;
