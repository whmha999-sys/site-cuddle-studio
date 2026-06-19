// Instagram / UGC grid + Brand story strip — pre-footer social proof
import React from 'react';
import ugc1 from '@/assets/ugc-vikusha-watch.jpg';
import ugc2 from '@/assets/ugc-tablet-cafe.jpg';
import ugc3 from '@/assets/ugc-runner-watch.jpg';
import ugc4 from '@/assets/ugc-family-tablet.jpg';
import ugc5 from '@/assets/ugc-flatlay.jpg';
import ugc6 from '@/assets/ugc-student-library.jpg';
import brandStory from '@/assets/brand-story-lifestyle.jpg';

const POSTS = [
  { src: ugc1, handle: '@ahmad.jo',     caption: 'Sunrise hike, heart rate locked in.' },
  { src: ugc2, handle: '@layla.writes', caption: 'Morning notes, second coffee.' },
  { src: ugc3, handle: '@runs.with.r',  caption: '8K before the sun.' },
  { src: ugc4, handle: '@the.haddads',  caption: 'Saturday with my favourite human.' },
  { src: ugc5, handle: '@daily.carry',  caption: 'Today’s essentials.' },
  { src: ugc6, handle: '@nour.studies', caption: 'Finals week energy.' },
];

export function BrandStoryStrip({ lang }) {
  const ar = lang === 'ar';
  return (
    <section style={{
      width: '100%',
      margin: '64px 0 0',
      borderRadius: 'var(--radius-lg, 16px)',
      overflow: 'hidden',
      position: 'relative',
      minHeight: 360,
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      background: '#0e1620',
      color: '#fff',
      boxShadow: '0 18px 48px -24px rgba(0,0,0,0.35)',
    }} className="brand-story-strip">
      <div style={{ position: 'relative', minHeight: 320 }}>
        <img
          src={brandStory}
          alt={ar ? 'حياة مع منتجات سمارت ليدرز' : 'Life with Smart Leaders products'}
          loading="lazy"
          width={1536}
          height={1024}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(14,22,32,0.15), rgba(14,22,32,0.55))',
        }}/>
      </div>
      <div style={{
        padding: '48px clamp(28px, 5vw, 64px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16,
      }}>
        <div style={{
          fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.2em',
          color: '#FFB800', textTransform: 'uppercase',
        }}>
          {ar ? 'قصتنا' : 'Our Story'}
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(26px, 3.4vw, 38px)',
          fontWeight: 700, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em',
        }}>
          {ar ? 'تقنية مصنوعة لتعيش معك.' : 'Technology built to live with you.'}
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.78)', maxWidth: '40ch', margin: 0 }}>
          {ar
            ? 'من ساعة على معصمك في رحلتك، إلى جهاز لوحي على مكتبك في نهاية اليوم — نختار منتجات Vikusha و Teclast بعناية، وندعمها بضمان رسمي وشبكة خدمة محلية في الأردن.'
            : 'From a watch on your wrist on the trail, to a tablet on your desk at the end of the day — we hand-pick Vikusha and Teclast gear and back it with an official warranty and a Jordan-wide service network.'}
        </p>
        <div style={{ display: 'flex', gap: 24, marginTop: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>
          <div><strong style={{ color:'#fff', fontSize: 18, display:'block' }}>2018</strong>{ar?'تأسست':'Founded'}</div>
          <div><strong style={{ color:'#fff', fontSize: 18, display:'block' }}>50K+</strong>{ar?'عميل سعيد':'Happy customers'}</div>
          <div><strong style={{ color:'#fff', fontSize: 18, display:'block' }}>24m</strong>{ar?'ضمان':'Warranty'}</div>
        </div>
      </div>
    </section>
  );
}

export function InstagramGrid({ lang }) {
  const ar = lang === 'ar';
  return (
    <section style={{ width: '100%', margin: '64px 0 0' }}>
      <div style={{
        display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono, monospace)', fontSize: 11, letterSpacing: '0.2em',
            color: 'var(--fg-3)', textTransform: 'uppercase', marginBottom: 6,
          }}>
            {ar ? 'إنستغرام' : 'On Instagram'}
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(22px, 2.6vw, 30px)',
            fontWeight: 700, margin: 0, letterSpacing: '-0.02em',
          }}>
            {ar ? 'منتجاتنا في حياة الناس' : 'In the wild — tag us @smartleaders.jo'}
          </h2>
        </div>
        <a
          href="https://instagram.com/vikushagroup" target="_blank" rel="noreferrer"
          style={{
            fontSize: 13, fontWeight: 600, color: 'var(--fg-1)',
            border: '1px solid var(--border)', padding: '10px 18px', borderRadius: 999,
            textDecoration: 'none', background: 'var(--bg-1)',
          }}
        >
          {ar ? 'تابعنا على إنستغرام →' : 'Follow on Instagram →'}
        </a>
      </div>

      <div className="ig-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 8,
      }}>
        {POSTS.map((p, i) => (
          <a
            key={i}
            href="https://instagram.com/vikushagroup" target="_blank" rel="noreferrer"
            className="ig-tile"
            style={{
              position: 'relative', display: 'block', aspectRatio: '1 / 1',
              overflow: 'hidden', borderRadius: 12, background: '#000',
              textDecoration: 'none',
            }}
          >
            <img
              src={p.src}
              alt={p.caption}
              loading="lazy"
              width={1024}
              height={1024}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
            <div className="ig-tile-overlay" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7))',
              opacity: 0, transition: 'opacity 0.25s ease',
              display: 'flex', alignItems: 'flex-end', padding: 12,
            }}>
              <div style={{ color: '#fff', fontSize: 12, lineHeight: 1.4 }}>
                <div style={{ fontWeight: 700 }}>{p.handle}</div>
                <div style={{ opacity: 0.85 }}>{p.caption}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .ig-tile:hover img { transform: scale(1.06); }
        .ig-tile:hover .ig-tile-overlay { opacity: 1; }
        @media (max-width: 900px) {
          .ig-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .ig-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 720px) {
          .brand-story-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
