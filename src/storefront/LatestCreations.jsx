import React, { useState } from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=1200&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=1200&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=1200&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=1200&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=1200&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=1200&w=1600&auto=format&fit=crop',
];

export function LatestCreations() {
  const [active, setActive] = useState(null);

  return (
    <section className="lc-section" aria-label="Latest Creations">
      <style>{`
        .lc-section { width: 100%; padding: 72px 24px; background: #000; box-sizing: border-box; }
        .lc-inner { max-width: 1400px; margin: 0 auto; }
        .lc-head { text-align: center; margin-bottom: 48px; }
        .lc-title { font-size: clamp(28px, 4vw, 44px); font-weight: 800; color: #fff; margin: 0 0 14px; letter-spacing: -0.02em; }
        .lc-sub { font-size: 15px; color: #94a3b8; max-width: 620px; margin: 0 auto; line-height: 1.6; }

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
          .lc-section { padding: 48px 16px; }
          .lc-strip { height: 360px; gap: 8px; }
          .lc-tile { border-radius: 14px; }
        }
      `}</style>

      <div className="lc-inner">
        <header className="lc-head">
          <h2 className="lc-title">Our Latest Creations</h2>
          <p className="lc-sub">
            A visual collection of our most recent works – each piece crafted with intention, emotion, and style.
          </p>
        </header>

        <div className="lc-strip" data-has-active={active !== null} onMouseLeave={() => setActive(null)}>
          {IMAGES.map((src, i) => (
            <div
              key={i}
              className={`lc-tile ${active === i ? 'is-active' : ''}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(active === i ? null : i)}
              tabIndex={0}
            >
              <img src={src} alt={`Creation ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestCreations;
