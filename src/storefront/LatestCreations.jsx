import React, { useState, useEffect, useRef } from 'react';
import watchAsset from '@/assets/vikusha-watch.png.asset.json';
import tabletAsset from '@/assets/vikusha-tablet.png.asset.json';
import p30tAsset from '@/assets/teclast-p30t.png.asset.json';
import t65HeroAsset from '@/assets/teclast-t65-hero.jpg.asset.json';
import p200HeroAsset from '@/assets/vikusha-p200-hero.png.asset.json';

const SLIDES = [
  { src: p200HeroAsset.url, productId: 'p200', alt: 'Vikusha Power Bank P200' },
  { src: p30tAsset.url, productId: 'teclast-p30t', alt: 'Teclast P30T' },
  { src: watchAsset.url, productId: 'v-70', alt: 'Vikusha V-70 Watch' },
  { src: t65HeroAsset.url, productId: 'teclast-t65', alt: 'Teclast T65' },
  { src: tabletAsset.url, productId: 'vz-80-plus', alt: 'Vikusha VZ-80 PLUS' },
];

export function LatestCreations() {
  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const total = SLIDES.length;

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdx((i) => (i + 1) % total), 5000);
    return () => clearTimeout(timerRef.current);
  }, [idx, total]);

  const go = (n) => setIdx((n + total) % total);
  const openPdp = (productId) => {
    if (typeof window !== 'undefined' && window.navigate) {
      window.navigate('pdp', { id: productId });
    }
  };

  return (
    <section className="lc-section" aria-label="Latest Creations">
      <style>{`
        .lc-section { width: 100%; padding: 24px; box-sizing: border-box; }
        .lc-inner { max-width: 1400px; margin: 0 auto; }
        .lc-slider {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          max-height: 640px;
          border-radius: 18px;
          overflow: hidden;
          background: #111;
        }
        .lc-slide {
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
          cursor: pointer;
        }
        .lc-slide.is-active { opacity: 1; z-index: 1; }
        .lc-slide img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .lc-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 44px; height: 44px; border-radius: 50%;
          background: rgba(0,0,0,0.5); color: #fff;
          border: none; cursor: pointer; z-index: 3;
          font-size: 22px; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
          transition: background 0.2s ease;
        }
        .lc-arrow:hover { background: rgba(0,0,0,0.75); }
        .lc-arrow.prev { left: 16px; }
        .lc-arrow.next { right: 16px; }
        .lc-dots {
          position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 3;
        }
        .lc-dot {
          width: 8px; height: 8px; border-radius: 4px;
          background: rgba(255,255,255,0.45);
          border: none; padding: 0; cursor: pointer;
          transition: all 0.3s ease;
        }
        .lc-dot.is-active { width: 24px; background: #fff; }

        @media (max-width: 768px) {
          .lc-section { padding: 16px; }
          .lc-slider { aspect-ratio: 16 / 9; max-height: 360px; border-radius: 14px; }
          .lc-arrow { width: 36px; height: 36px; font-size: 18px; }
        }
      `}</style>

      <div className="lc-inner">
        <div className="lc-slider">
          {SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`lc-slide ${i === idx ? 'is-active' : ''}`}
              onClick={() => openPdp(slide.productId)}
              role="button"
              aria-label={slide.alt}
              aria-hidden={i !== idx}
            >
              <img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
            </div>
          ))}

          <button className="lc-arrow prev" aria-label="Previous slide" onClick={() => go(idx - 1)}>‹</button>
          <button className="lc-arrow next" aria-label="Next slide" onClick={() => go(idx + 1)}>›</button>

          <div className="lc-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`lc-dot ${i === idx ? 'is-active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIdx(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LatestCreations;
