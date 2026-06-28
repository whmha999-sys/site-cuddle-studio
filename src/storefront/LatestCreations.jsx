import React, { useState } from 'react';
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

export function LatestCreations() {
  const [active, setActive] = useState(null);

  return (
    <section className="lc-section" aria-label="Latest Creations">
      <style>{`
        .lc-section { width: 100%; padding: 24px; background: transparent; box-sizing: border-box; }
        .lc-inner { max-width: 1400px; margin: 0 auto; }

        .lc-strip {
          display: flex;
          gap: 12px;
          height: 520px;
          width: 100%;
          overflow: hidden;
        }
        .lc-tile {
          position: relative;
          flex: 1 1 0%;
          min-width: 0;
          overflow: hidden;
          border-radius: 18px;
          cursor: pointer;
          transition: flex 0.7s cubic-bezier(0.22, 1, 0.36, 1);
          background: #111;
        }
        .lc-strip:hover .lc-tile,
        .lc-strip[data-has-active="true"] .lc-tile { flex: 0.45 1 0%; }
        .lc-strip:hover .lc-tile:hover,
        .lc-tile.is-active { flex: 7 1 0%; }
        .lc-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .lc-section { padding: 16px; }
          .lc-strip { height: 360px; gap: 8px; }
          .lc-tile { border-radius: 14px; }
        }
      `}</style>

      <div className="lc-inner">
        <div className="lc-strip" data-has-active={active !== null} onMouseLeave={() => setActive(null)}>
          {TILES.map((tile, i) => (
            <div
              key={i}
              className={`lc-tile ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => {
                if (typeof window !== 'undefined' && window.navigate) {
                  window.navigate('pdp', { id: tile.productId });
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={tile.alt}
            >
              <img src={tile.src} alt={tile.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestCreations;
