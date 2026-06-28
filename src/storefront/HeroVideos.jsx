import React, { useState, useEffect, useRef } from 'react';
import video1Asset from '@/assets/hero-video-1.mp4.asset.json';
import video2Asset from '@/assets/hero-video-2.mp4.asset.json';

const SLIDES = [
  { src: video1Asset.url, productId: 'teclast-t65', alt: 'Teclast T65' },
  { src: video2Asset.url, productId: 'p200', alt: 'Vikusha P200' },
];

export function HeroVideos() {
  const [idx, setIdx] = useState(0);
  const total = SLIDES.length;
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIdx((i) => (i + 1) % total), 7000);
    return () => clearTimeout(timerRef.current);
  }, [idx, total]);

  const go = (n) => setIdx((n + total) % total);
  const openPdp = (id) => {
    if (typeof window !== 'undefined' && window.navigate) window.navigate('pdp', { id });
  };

  return (
    <section className="hv-section" aria-label="Hero">
      <style>{`
        .hv-section {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          height: 100vh;
          position: relative;
          background: #000;
          overflow: hidden;
        }
        .hv-slide {
          position: absolute; inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
          cursor: pointer;
        }
        .hv-slide.is-active { opacity: 1; z-index: 1; }
        .hv-slide video {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center;
          display: block;
        }
        .hv-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(0,0,0,0.45); color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
          cursor: pointer; z-index: 3;
          font-size: 24px; display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .hv-arrow:hover { background: rgba(0,0,0,0.7); }
        .hv-arrow.prev { left: 24px; }
        .hv-arrow.next { right: 24px; }
        .hv-dots {
          position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 10px; z-index: 3;
          padding: 6px 10px; border-radius: 999px;
          background: rgba(0,0,0,0.25);
        }
        .hv-dot {
          width: 10px; height: 10px; border-radius: 5px;
          background: rgba(255,255,255,0.65);
          border: none; padding: 0; cursor: pointer;
          transition: all 0.3s ease;
        }
        .hv-dot.is-active { width: 28px; background: #fff; }
        @media (max-width: 600px) {
          .hv-arrow { width: 40px; height: 40px; font-size: 20px; }
          .hv-arrow.prev { left: 12px; }
          .hv-arrow.next { right: 12px; }
        }
      `}</style>

      {SLIDES.map((s, i) => (
        <div
          key={i}
          className={`hv-slide ${i === idx ? 'is-active' : ''}`}
          onClick={() => openPdp(s.productId)}
          role="button"
          aria-label={s.alt}
          aria-hidden={i !== idx}
        >
          <video src={s.src} autoPlay muted loop playsInline preload={i === 0 ? 'auto' : 'metadata'} />
        </div>
      ))}

      <button className="hv-arrow prev" aria-label="Previous" onClick={() => go(idx - 1)}>‹</button>
      <button className="hv-arrow next" aria-label="Next" onClick={() => go(idx + 1)}>›</button>

      <div className="hv-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hv-dot ${i === idx ? 'is-active' : ''}`}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroVideos;
