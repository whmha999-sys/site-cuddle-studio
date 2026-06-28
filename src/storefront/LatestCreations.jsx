import React, { useState, useEffect, useRef } from 'react';
import watchAsset from '@/assets/vikusha-watch.png.asset.json';
import tabletAsset from '@/assets/vikusha-tablet.png.asset.json';
import p30tAsset from '@/assets/teclast-p30t.png.asset.json';
import t65HeroAsset from '@/assets/teclast-t65-hero.jpg.asset.json';
import p200HeroAsset from '@/assets/vikusha-p200-hero.png.asset.json';
import video1Asset from '@/assets/hero-video-1.mp4.asset.json';
import video2Asset from '@/assets/hero-video-2.mp4.asset.json';

const SLIDES = [
  { type: 'video', src: video1Asset.url, productId: 'teclast-t65', alt: 'Teclast T65 video' },
  { type: 'video', src: video2Asset.url, productId: 'p200', alt: 'Vikusha P200 video' },
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
        .lc-section { width: 100vw; margin-left: calc(50% - 50vw); padding: 0; box-sizing: border-box; }
        .lc-inner { width: 100%; margin: 0; }
        .lc-slider {
          position: relative;
          width: 100%;
          aspect-ratio: 21 / 9;
          overflow: hidden;
          background: #fff;
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
          object-fit: contain; object-position: center;
          display: block;
        }
        .lc-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(0,0,0,0.45); color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer; z-index: 3;
          font-size: 24px; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
          transition: background 0.2s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        }
        .lc-arrow:hover { background: rgba(0,0,0,0.7); }
        .lc-arrow.prev { left: 24px; }
        .lc-arrow.next { right: 24px; }
        .lc-dots {
          position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 10px; z-index: 3;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(0,0,0,0.25);
        }
        .lc-dot {
          width: 10px; height: 10px; border-radius: 5px;
          background: rgba(255,255,255,0.65);
          border: none; padding: 0; cursor: pointer;
          transition: all 0.3s ease;
        }
        .lc-dot.is-active { width: 28px; background: #fff; }

        @media (max-width: 900px) {
          .lc-slider { aspect-ratio: 16 / 9; }
        }
        @media (max-width: 600px) {
          .lc-slider { aspect-ratio: 4 / 3; }
          .lc-arrow { width: 40px; height: 40px; font-size: 20px; }
          .lc-arrow.prev { left: 12px; }
          .lc-arrow.next { right: 12px; }
          .lc-dots { bottom: 16px; }
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
              {slide.type === 'video' ? (
                <video src={slide.src} autoPlay muted loop playsInline preload={i === 0 ? 'auto' : 'metadata'} />
              ) : (
                <img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              )}
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
