import React from 'react';

const IMAGES = [
  'https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1729086046027-09979ade13fd?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop',
];

export function LatestCreations() {
  return (
    <section className="lc-section" aria-label="Latest Creations">
      <style>{`
        .lc-section { width: 100%; padding: 64px 24px; box-sizing: border-box; }
        .lc-inner { max-width: 1200px; margin: 0 auto; }
        .lc-head { text-align: center; margin-bottom: 40px; }
        .lc-title { font-size: clamp(28px, 4vw, 44px); font-weight: 700; margin: 0 0 12px; letter-spacing: -0.02em; }
        .lc-sub { font-size: 15px; color: #6b7280; max-width: 540px; margin: 0 auto; line-height: 1.6; }
        .lc-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .lc-item { position: relative; overflow: hidden; border-radius: 14px; aspect-ratio: 1 / 1; background: #f3f4f6; }
        .lc-item img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s ease; }
        .lc-item:hover img { transform: scale(1.06); }
        @media (max-width: 768px) {
          .lc-section { padding: 40px 16px; }
          .lc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
      `}</style>
      <div className="lc-inner">
        <header className="lc-head">
          <h2 className="lc-title">Our Latest Creations</h2>
          <p className="lc-sub">
            A visual collection of our most recent works – each piece crafted with intention, emotion, and style.
          </p>
        </header>
        <div className="lc-grid">
          {IMAGES.map((src, i) => (
            <div className="lc-item" key={i}>
              <img src={src} alt={`Creation ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestCreations;
