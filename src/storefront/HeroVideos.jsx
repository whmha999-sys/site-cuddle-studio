import React from 'react';
import video1Asset from '@/assets/hero-video-1.mp4.asset.json';
import video2Asset from '@/assets/hero-video-2.mp4.asset.json';

export function HeroVideos() {
  const go = (id) => {
    if (typeof window !== 'undefined' && window.navigate) {
      window.navigate('pdp', { id });
    }
  };

  return (
    <section className="hv-section" aria-label="Hero">
      <style>{`
        .hv-section {
          width: 100vw;
          margin-left: calc(50% - 50vw);
          background: #0b0b0d;
          padding: clamp(28px, 5vw, 64px) clamp(16px, 4vw, 64px);
          color: #fff;
        }
        .hv-head {
          max-width: 1280px;
          margin: 0 auto clamp(20px, 3vw, 36px);
          text-align: center;
        }
        .hv-eyebrow {
          font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase;
          color: #FFB800; font-weight: 600;
        }
        .hv-title {
          font-family: var(--font-display, serif);
          font-size: clamp(28px, 4.6vw, 56px);
          font-weight: 700; line-height: 1.05; letter-spacing: -0.02em;
          margin: 10px 0 12px;
        }
        .hv-sub {
          font-size: clamp(13px, 1.4vw, 16px);
          color: #c9c9cf; max-width: 60ch; margin: 0 auto;
          line-height: 1.6;
        }
        .hv-grid {
          max-width: 1280px; margin: 0 auto;
          display: grid; gap: clamp(12px, 2vw, 20px);
          grid-template-columns: 1fr 1fr;
        }
        .hv-card {
          position: relative; overflow: hidden;
          border-radius: 18px;
          aspect-ratio: 9 / 16;
          background: #000;
          cursor: pointer;
          box-shadow: 0 14px 40px rgba(0,0,0,0.45);
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .hv-card:hover { transform: translateY(-4px); }
        .hv-card video {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
        }
        .hv-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 70%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: clamp(16px, 2.4vw, 28px);
          pointer-events: none;
        }
        .hv-tag {
          align-self: flex-start;
          font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          background: #FF6B00; color: #fff; font-weight: 700;
          padding: 5px 10px; border-radius: 4px; margin-bottom: 10px;
        }
        .hv-card-title {
          font-family: var(--font-display, serif);
          font-size: clamp(20px, 2.6vw, 32px);
          font-weight: 700; letter-spacing: -0.01em; margin: 0 0 6px;
        }
        .hv-card-sub { font-size: 13px; color: #d6d6dc; margin: 0 0 14px; }
        .hv-cta {
          align-self: flex-start;
          pointer-events: auto;
          display: inline-flex; align-items: center; gap: 8px;
          background: #fff; color: #111;
          border: none; cursor: pointer;
          padding: 10px 18px; border-radius: 999px;
          font-size: 13px; font-weight: 600; letter-spacing: 0.02em;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .hv-cta:hover { background: #FFB800; color: #111; transform: translateX(2px); }

        @media (max-width: 720px) {
          .hv-grid { grid-template-columns: 1fr; }
          .hv-card { aspect-ratio: 16 / 10; }
        }
      `}</style>

      <div className="hv-head">
        <div className="hv-eyebrow">Teclast MENA · Vikusha</div>
        <h1 className="hv-title">تقنية تستحق الثقة</h1>
        <p className="hv-sub">
          أجهزة لوحية وساعات ذكية وملحقات أصلية — أداء حقيقي، سعر عادل، وضمان رسمي في الأردن.
        </p>
      </div>

      <div className="hv-grid">
        <div className="hv-card" onClick={() => go('teclast-t65')} role="button" aria-label="Teclast T65">
          <video src={video1Asset.url} autoPlay muted loop playsInline preload="auto" />
          <div className="hv-overlay">
            <span className="hv-tag">Teclast</span>
            <h3 className="hv-card-title">Teclast T65</h3>
            <p className="hv-card-sub">جهاز لوحي بشاشة كبيرة وأداء ثابت</p>
            <button className="hv-cta" onClick={(e) => { e.stopPropagation(); go('teclast-t65'); }}>
              تسوّق الآن →
            </button>
          </div>
        </div>

        <div className="hv-card" onClick={() => go('p200')} role="button" aria-label="Vikusha P200">
          <video src={video2Asset.url} autoPlay muted loop playsInline preload="auto" />
          <div className="hv-overlay">
            <span className="hv-tag">Vikusha</span>
            <h3 className="hv-card-title">Vikusha P200</h3>
            <p className="hv-card-sub">باور بانك بطاقة عالية وشحن سريع</p>
            <button className="hv-cta" onClick={(e) => { e.stopPropagation(); go('p200'); }}>
              تسوّق الآن →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroVideos;
