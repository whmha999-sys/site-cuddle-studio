import React, { useState, useEffect, useRef } from 'react';
import { usePromos } from '@/hooks/usePromos';

// Inject styles once
const promoBannerStyles = `
  @keyframes pb-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .pb-section {
    width: 100%;
    max-width: 900px;
    margin: 8px auto 0;
    position: relative;
  }
  .pb-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
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
    inset-inline-start: 24px;
    bottom: 70px;
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
  .pb-cta {
    position: absolute;
    inset-inline-start: 24px;
    bottom: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 26px;
    background: linear-gradient(180deg, #FF7A1A 0%, #FF6B00 100%);
    color: #fff;
    text-decoration: none;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-radius: 999px;
    box-shadow: 0 8px 24px rgba(255,107,0,0.45), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
    animation: pb-fade-in 0.7s ease both;
    z-index: 3;
  }
  .pb-cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(255,107,0,0.55), inset 0 1px 0 rgba(255,255,255,0.3);
    filter: brightness(1.05);
  }
  .pb-cta-arrow { font-size: 16px; line-height: 1; }
  .pb-dots {
    position: absolute;
    bottom: 14px;
    inset-inline-end: 18px;
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
    .pb-caption { inset-inline-start: 14px; bottom: 60px; font-size: 13px; padding: 7px 11px; }
    .pb-cta { inset-inline-start: 14px; bottom: 14px; padding: 10px 18px; font-size: 11px; }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('pb-styles')) {
  const s = document.createElement('style');
  s.id = 'pb-styles';
  s.textContent = promoBannerStyles;
  document.head.appendChild(s);
}

function isExternal(url) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
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

  useEffect(() => {
    if (idx >= promos.length) setIdx(0);
  }, [promos.length, idx]);

  if (isLoading || promos.length === 0) return null;

  return (
    <section className="pb-section" aria-label="Promotions">
      <div className="pb-frame">
        {promos.map((p, i) => {
          const isActive = i === idx;
          const showBtn = !!(p.button_enabled && p.button_label);
          const btnHref = p.button_url || p.link_url || '#';
          const wholeSlideLink = !showBtn && p.link_url;

          const inner = (
            <>
              <img
                src={p.image_url}
                alt={p.title || 'Promo banner'}
                className="pb-img"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
              {p.title ? <div className="pb-caption">{p.title}</div> : null}
              {showBtn ? (
                <a
                  href={btnHref}
                  className="pb-cta"
                  target={isExternal(btnHref) ? '_blank' : undefined}
                  rel={isExternal(btnHref) ? 'noopener noreferrer' : undefined}
                  tabIndex={isActive ? 0 : -1}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{p.button_label}</span>
                  <span className="pb-cta-arrow" aria-hidden>→</span>
                </a>
              ) : null}
            </>
          );

          const className = `pb-slide ${isActive ? 'is-active' : ''}`;
          const style = { pointerEvents: isActive ? 'auto' : 'none' };

          return wholeSlideLink ? (
            <a
              key={p.id}
              href={p.link_url}
              className={className}
              style={style}
              target={isExternal(p.link_url) ? '_blank' : undefined}
              rel={isExternal(p.link_url) ? 'noopener noreferrer' : undefined}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              {inner}
            </a>
          ) : (
            <div key={p.id} className={className} style={style} aria-hidden={!isActive}>
              {inner}
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
