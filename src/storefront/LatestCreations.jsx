import React, { useState, useEffect, useCallback } from 'react';
import watchAsset from '@/assets/vikusha-watch.png.asset.json';
import p30tAsset from '@/assets/teclast-p30t.png.asset.json';
import t65HeroAsset from '@/assets/teclast-t65-hero.jpg.asset.json';
import p200HeroAsset from '@/assets/vikusha-p200-hero.png.asset.json';

const TILES = [
  { src: p200HeroAsset.url, productId: 'p200', alt: 'Vikusha Power Bank P200' },
  { src: p30tAsset.url, productId: 'teclast-p30t', alt: 'Teclast P30T' },
  { src: watchAsset.url, productId: 'v-70', alt: 'Vikusha V-70 Watch' },
  { src: t65HeroAsset.url, productId: 'teclast-t65', alt: 'Teclast T65' },
];

const AUTO_INTERVAL_MS = 5000;

export function LatestCreations() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fitMode, setFitMode] = useState('contain');

  const toggleFit = useCallback((mode) => setFitMode(mode), []);

  const goTo = useCallback((idx) => {
    setActive((idx + TILES.length) % TILES.length);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  useEffect(() => {
    if (paused || TILES.length <= 1) return undefined;
    const id = setInterval(next, AUTO_INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, next]);

  const handleTileClick = (tile) => {
    if (typeof window !== 'undefined' && window.navigate) {
      window.navigate('pdp', { id: tile.productId });
    }
  };

  return (
    <section className="lc-section" aria-label="Latest Creations">
      <style>{`
        .lc-section {
          width: 100%;
          padding: 24px;
          background: transparent;
          box-sizing: border-box;
        }
        .lc-inner {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .lc-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          max-height: 560px;
          border-radius: 20px;
          overflow: hidden;
          background: transparent;
        }
        .lc-slides {
          width: 100%;
          height: 100%;
          display: flex;
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .lc-slide {
          width: 100%;
          height: 100%;
          flex: 0 0 100%;
          cursor: pointer;
        }
        .lc-slide img {
          width: 100%;
          height: 100%;
          display: block;
          pointer-events: none;
        }
        .lc-fit-cover { object-fit: cover; }
        .lc-fit-contain { object-fit: contain; }

        .lc-fit-toggle {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          align-items: center;
        }
        .lc-fit-toggle-label {
          color: var(--muted-foreground, rgba(255,255,255,0.6));
          font-size: 12px;
          margin-inline-end: 4px;
        }
        .lc-fit-toggle button {
          padding: 6px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 12px;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .lc-fit-toggle button:hover { background: rgba(255,255,255,0.15); }
        .lc-fit-toggle button.is-active {
          background: var(--orange, #e86a1f);
          border-color: var(--orange, #e86a1f);
          color: #fff;
        }

        .lc-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.88);
          color: #111;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.25s ease, background 0.2s ease, transform 0.2s ease;
          z-index: 2;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .lc-arrow:hover { background: #fff; transform: translateY(-50%) scale(1.05); }
        .lc-stage:hover .lc-arrow { opacity: 1; }
        .lc-arrow-prev { inset-inline-start: 16px; }
        .lc-arrow-next { inset-inline-end: 16px; }

        .lc-dots {
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 2;
        }
        .lc-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255,255,255,0.45);
          border: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .lc-dot.is-active { background: #fff; transform: scale(1.2); }
        .lc-dot:hover { background: rgba(255,255,255,0.8); }

        .lc-thumbs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        .lc-thumb {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          border: 2px solid transparent;
          background: #111;
          transition: border-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
          opacity: 0.7;
        }
        .lc-thumb:hover { opacity: 1; transform: translateY(-2px); }
        .lc-thumb.is-active { opacity: 1; border-color: var(--orange, #e86a1f); }
        .lc-thumb img {
          width: 100%;
          height: 100%;
          display: block;
        }

        @media (max-width: 768px) {
          .lc-section { padding: 16px; }
          .lc-inner { gap: 12px; }
          .lc-stage { border-radius: 14px; }
          .lc-arrow { width: 36px; height: 36px; opacity: 1; }
          .lc-arrow-prev { inset-inline-start: 8px; }
          .lc-arrow-next { inset-inline-end: 8px; }
          .lc-thumbs { gap: 8px; }
          .lc-thumb { border-radius: 10px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lc-slides { transition: none; }
        }
      `}</style>

      <div className="lc-inner">
        <div className="lc-fit-toggle" aria-label="Image fit mode">
          <span className="lc-fit-toggle-label">Fit:</span>
          <button
            className={fitMode === 'cover' ? 'is-active' : ''}
            onClick={() => toggleFit('cover')}
            aria-pressed={fitMode === 'cover'}
            type="button"
          >
            Cover
          </button>
          <button
            className={fitMode === 'contain' ? 'is-active' : ''}
            onClick={() => toggleFit('contain')}
            aria-pressed={fitMode === 'contain'}
            type="button"
          >
            Contain
          </button>
        </div>

        <div
          className="lc-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="lc-slides"
            style={{ transform: `translateX(${-active * 100}%)` }}
          >
            {TILES.map((tile, i) => (
              <div
                key={i}
                className="lc-slide"
                onClick={() => handleTileClick(tile)}
                role="link"
                aria-label={tile.alt}
              >
                <img className={`lc-fit-${fitMode}`} src={tile.src} alt={tile.alt} loading={i === 0 ? 'eager' : 'lazy'} />
              </div>
            ))}
          </div>

          <button
            className="lc-arrow lc-arrow-prev"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous slide"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            className="lc-arrow lc-arrow-next"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next slide"
            type="button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="lc-dots" role="tablist" aria-label="Slideshow navigation">
            {TILES.map((tile, i) => (
              <button
                key={i}
                className={`lc-dot ${active === i ? 'is-active' : ''}`}
                onClick={() => goTo(i)}
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to ${tile.alt}`}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="lc-thumbs">
          {TILES.map((tile, i) => (
            <div
              key={i}
              className={`lc-thumb ${active === i ? 'is-active' : ''}`}
              onClick={() => { goTo(i); handleTileClick(tile); }}
              role="button"
              aria-label={tile.alt}
              tabIndex={0}
            >
              <img className={`lc-fit-${fitMode}`} src={tile.src} alt={tile.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestCreations;
