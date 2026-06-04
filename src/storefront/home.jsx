// Home page: hero, filters, grid, CTA strip
import React from 'react';
import { Icon, Price } from './atoms.jsx';
import { Silhouette, ColorDot } from './silhouettes.jsx';
import { PRODUCT_IMAGES } from './data.js';
import { TeclastScroll } from './teclast-scroll.jsx';
import { VikushaScroll } from './vikusha-scroll.jsx';
import { PromoReel } from './promo.jsx';
import { PromoBanners } from './PromoBanners.jsx';
import { InstagramGrid, BrandStoryStrip } from './instagram-grid.jsx';
import { useHeroSettings } from '@/hooks/useHeroSettings';
import ProductShowcaseCard from '@/components/ui/product-showcase-card';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';
import { TestimonialsSection } from './testimonials-section.jsx';
function getHeroSlides(lang) {
  const ar = lang === 'ar';
  return [
  {
    id: 'v-70',
    bg: '#0d0d0f',
    accent: '#FF6B00',
    accentSoft: '#ffaa55',
    eyebrow: ar ? 'ساعة فيكوشا الذكية' : 'Vikusha Smartwatch',
    title: ar ? 'الوقت.' : 'Time.',
    titleItalic: ar ? 'بشكل مختلف.' : 'Reimagined.',
    sub: ar ? '١.٤٣" AMOLED · NFC · معدل ضربات القلب · IP67' : '1.43" AMOLED · NFC · Heart rate · IP67',
    price: 50,
    oldPrice: 75,
    discountLabel: '−33%',
    cta: ar ? 'احجز الآن' : 'Claim Yours',
    cta2: ar ? 'استعرض فيكوشا' : 'Explore Vikusha',
    brand: 'vikusha',
    imgSrc: '/uploads/file_00000000f98471fdb5a91f41d515c0c7-removebg-preview.webp',
    promo: true,
    tag: ar ? 'مباشر' : 'LIVE',
    tagKind: 'live',
    ribbon: ar ? 'عرض محدود' : 'LIMITED DROP',
    promoDurationMs: 48 * 60 * 60 * 1000, // 48h
  },
  {
    id: 'vz-30-pro-4g',
    bg: '#0a1628',
    accent: '#d99258',
    accentSoft: '#f0b577',
    eyebrow: ar ? 'جهاز فيكوشا اللوحي' : 'Vikusha Tablet',
    title: ar ? 'بطارية' : 'All-day',
    titleItalic: ar ? 'تدوم اليوم كله.' : 'battery life.',
    sub: ar ? '١٠.١" · ٤+٤ جيجا · ٦٠٠٠ mAh · 4G LTE' : '10.1" HD · 4+4 GB RAM · 6000 mAh · 4G LTE',
    price: 120,
    cta: ar ? 'تسوّق VZ-30 PRO' : 'Shop VZ-30 PRO',
    cta2: ar ? 'استعرض الأجهزة' : 'Explore Tablets',
    brand: 'vikusha',
    imgSrc: '/uploads/vz30-brown-main.webp',
    tag: ar ? 'إصدار جديد' : 'NEW DROP',
    tagKind: 'new',
    ribbon: ar ? 'إصدار جديد' : 'NEW DROP',
    productBlend: 'screen', // mute the orange arch
  },
  {
    id: 'teclast-p50',
    bg: '#1a1208',
    accent: '#e86a1f',
    accentSoft: '#ffb066',
    eyebrow: ar ? 'جهاز تيكلاست اللوحي' : 'Teclast Tablet',
    title: ar ? 'القوة تلتقي' : 'Power meets',
    titleItalic: ar ? 'الإمكانية.' : 'portability.',
    sub: ar ? '10.95" · 90Hz · 8+12 GB · 4G LTE · 7000 mAh' : '10.95" · 90 Hz · 8+12 GB · 4G LTE · 7000 mAh',
    price: 135,
    cta: ar ? 'تسوّق P50' : 'Shop P50',
    cta2: ar ? 'استعرض تيكلاست' : 'Explore Teclast',
    brand: 'teclast',
    imgSrc: '/uploads/0f39d92f840194b3eb70333db1a89b38_46c26fc6e6aa4dd7b5cff127dbc89fcc-removebg-preview.webp',
    tag: ar ? 'الأكثر مبيعًا' : 'BESTSELLER',
    tagKind: 'best',
    ribbon: ar ? 'الأكثر مبيعًا' : 'BESTSELLER',
    productBlend: 'screen',
  },
  ];}


// Inject hero animation keyframes once
if (!document.getElementById('hero-anim-styles')) {
  const s = document.createElement('style');
  s.id = 'hero-anim-styles';
  s.textContent = `
    @keyframes hero-slide-left  { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:translateX(0); } }
    @keyframes hero-slide-right { from { opacity:0; transform:translateX(60px);  } to { opacity:1; transform:translateX(0); } }
    @keyframes hero-fade-up     { from { opacity:0; transform:translateY(14px);  } to { opacity:1; transform:translateY(0); } }
    @keyframes hero-badge-bounce {
      0%   { transform: scale(0.5) rotate(-6deg); opacity:0; }
      60%  { transform: scale(1.15) rotate(2deg); opacity:1; }
      80%  { transform: scale(0.95) rotate(-1deg); }
      100% { transform: scale(1) rotate(0deg); opacity:1; }
    }
    @keyframes hero-progress {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    @keyframes vk-promo-pulse {
      0%,100% { opacity:1; transform:scale(1); }
      50%     { opacity:0.4; transform:scale(0.7); }
    }
    @keyframes vk-promo-glow {
      0%,100% { box-shadow: 0 0 0 0 rgba(255,107,0,0.35); }
      50%     { box-shadow: 0 0 0 6px rgba(255,107,0,0); }
    }
    @keyframes vk-promo-marquee {
      from { transform: translate3d(0,0,0); }
      to   { transform: translate3d(-50%,0,0); }
    }
    @keyframes vk-promo-shimmer {
      0%   { transform: translateX(-120%); }
      100% { transform: translateX(220%); }
    }
    @keyframes vk-promo-float {
      0%,100% { transform: translateY(0); }
      50%     { transform: translateY(-8px); }
    }
    @keyframes vk-tick-flip {
      from { transform: translateY(-6px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes vk-spot-pulse {
      0%,100% { opacity: 0.85; transform: scale(1); }
      50%     { opacity: 1;    transform: scale(1.05); }
    }
    .vk-promo-marquee-track {
      display:inline-flex; gap:48px; padding-right:48px;
      animation: vk-promo-marquee 60s linear infinite;
      will-change: transform;
    }
    .vk-promo-marquee:hover .vk-promo-marquee-track { animation-play-state: paused; }
    .vk-cta-primary {
      position:relative; overflow:hidden;
      transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease;
    }
    .vk-cta-primary:hover { transform: translateY(-2px); }
    .vk-cta-primary::after {
      content:''; position:absolute; top:0; left:0; height:100%; width:40%;
      background:linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
      transform:translateX(-120%); pointer-events:none;
    }
    .vk-cta-primary:hover::after { animation: vk-promo-shimmer 0.9s ease forwards; }
    .vk-cta-ghost {
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }
    .vk-cta-ghost:hover { background: rgba(255,255,255,0.10); color: #fff; }
    .vk-tick { animation: vk-tick-flip 0.32s cubic-bezier(0.22,1,0.36,1); }
    .vk-product-float { animation: vk-promo-float 5.5s ease-in-out infinite; }
    .vk-spot { animation: vk-spot-pulse 8s ease-in-out infinite; }
    .vk-hero-arrow { opacity: 0; transition: opacity 0.25s ease, background 0.2s ease; }
    .hero-wrap:hover .vk-hero-arrow { opacity: 1; }
    .vk-hero-arrow:hover { background: rgba(255,255,255,0.22) !important; }
    @media (prefers-reduced-motion: reduce) {
      .vk-product-float, .vk-spot, .vk-promo-marquee-track { animation: none !important; }
    }
  `;
  document.head.appendChild(s);
}

// Why Choose Us section
(function(){
  if (!document.getElementById('wcu-styles')) {
    const s = document.createElement('style');
    s.id = 'wcu-styles';
    s.textContent = `
      @keyframes wcu-wipe {
        from { clip-path: inset(0 100% 0 0); opacity: 0; }
        to   { clip-path: inset(0 0% 0 0);   opacity: 1; }
      }
      @keyframes wcu-slide-right {
        from { opacity: 0; transform: translateX(40px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      .wcu-line { opacity: 0; }
      .wcu-line.in { animation: wcu-wipe 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
      .wcu-benefit { opacity: 0; transform: translateX(40px); }
      .wcu-benefit.in { animation: wcu-slide-right 0.6s cubic-bezier(0.22,1,0.36,1) forwards; }
    `;
    document.head.appendChild(s);
  }
})();

function WhyChooseUs({ lang }) {
  const sectionRef = React.useRef(null);
  const line1Ref   = React.useRef(null);
  const line2Ref   = React.useRef(null);
  const line3Ref   = React.useRef(null);
  const b1Ref      = React.useRef(null);
  const b2Ref      = React.useRef(null);
  const b3Ref      = React.useRef(null);

  React.useEffect(() => {
    const targets = [
      { el: line1Ref.current, delay: 0 },
      { el: line2Ref.current, delay: 120 },
      { el: line3Ref.current, delay: 240 },
      { el: b1Ref.current,    delay: 0 },
      { el: b2Ref.current,    delay: 300 },
      { el: b3Ref.current,    delay: 600 },
    ];

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          targets.forEach(({ el, delay }) => {
            if (!el) return;
            setTimeout(() => el.classList.add('in'), delay);
          });
          obs.disconnect();
        }
      });
    }, { threshold: 0.2 });

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const benefits = [
    {
      ref: b1Ref,
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#FFB80018"/>
          <path d="M5 10h18M5 10l2 8h14l2-8M10 10V8a4 4 0 018 0v2" stroke="#FFB800" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="10" cy="20" r="1.5" fill="#FFB800"/>
          <circle cx="18" cy="20" r="1.5" fill="#FFB800"/>
        </svg>
      ),
      title: lang === 'ar' ? 'توصيل مجاني فوق ١٠٠ د.أ' : 'Free Delivery over JOD 100',
      sub:   lang === 'ar' ? 'شحن سريع لجميع أنحاء الأردن' : 'Fast shipping across all of Jordan',
    },
    {
      ref: b2Ref,
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#FFB80018"/>
          <path d="M14 5l2.5 4.5L22 11l-4 3.5 1 5.5-5-2.5L9 20l1-5.5L6 11l5.5-1.5L14 5z" stroke="#FFB800" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
      ),
      title: lang === 'ar' ? 'ضمان رسمي من الشركة المصنّعة' : 'Official Manufacturer Warranty',
      sub:   lang === 'ar' ? 'كل منتج أصلي ومضمون بالكامل' : 'Every product is 100% authentic and covered',
    },
    {
      ref: b3Ref,
      icon: (
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="#FFB80018"/>
          <path d="M8 8h12a2 2 0 012 2v6a2 2 0 01-2 2h-5l-4 3v-3H8a2 2 0 01-2-2v-6a2 2 0 012-2z" stroke="#FFB800" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="11" cy="12" r="1" fill="#FFB800"/>
          <circle cx="14" cy="12" r="1" fill="#FFB800"/>
          <circle cx="17" cy="12" r="1" fill="#FFB800"/>
        </svg>
      ),
      title: lang === 'ar' ? 'نحن دائماً هنا من أجلك' : 'Always Here For You',
      sub:   lang === 'ar' ? 'تواصل معنا هاتفياً أو واتساب — دعم حقيقي' : 'Call or WhatsApp us anytime — real support, real people',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="wcu-grid"
      style={{
        width: '100%',
        background: '#fff',
        borderTop: '1px solid #FFB80033',
        borderBottom: '1px solid #FFB80033',
        margin: '0',
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        minHeight: 320,
      }}
    >
      {/* LEFT — headline */}
      <div style={{
        padding: 'clamp(40px,6vw,72px) clamp(28px,5vw,64px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{ overflow: 'hidden' }}>
          {[
            { ref: line1Ref, text: lang === 'ar' ? 'نحن لا نبيع' : 'We don\'t just' },
            { ref: line2Ref, text: lang === 'ar' ? 'أجهزة فقط.' : 'sell devices.' },
            { ref: line3Ref, text: lang === 'ar' ? 'نبني الثقة.' : 'We build trust.', gold: true },
          ].map(({ ref, text, gold }, i) => (
            <div
              key={i}
              ref={ref}
              className="wcu-line"
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontSize: 'clamp(32px, 4.5vw, 56px)',
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: gold ? '#FFB800' : '#c49a00',
                display: 'block',
                animationDelay: `${i * 0.12}s`,
              }}
            >{text}</div>
          ))}
        </div>

        {/* Gold accent bar */}
        <div style={{
          width: 52, height: 3,
          background: '#FFB800',
          borderRadius: 2,
          margin: '22px 0 18px',
        }}/>

        <p style={{
          fontSize: 13, color: '#888', lineHeight: 1.6,
          fontFamily: 'var(--font-mono, monospace)',
          letterSpacing: '0.04em',
          maxWidth: '34ch',
        }}>
          {lang === 'ar'
            ? 'شركة سمارت ليدرز — شريككم التقني الموثوق في الأردن'
            : "Smart Leaders Co. — Amman, Jordan's trusted technology partner."}
        </p>
      </div>

      {/* Divider */}
      <div className="wcu-divider" style={{ background: '#FFB80033' }}/>

      {/* RIGHT — benefits */}
      <div style={{
        padding: 'clamp(40px,6vw,72px) clamp(28px,5vw,64px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 32,
      }}>
        {benefits.map(({ ref, icon, title, sub }, i) => (
          <div
            key={i}
            ref={ref}
            className="wcu-benefit"
            style={{
              display: 'flex', gap: 18, alignItems: 'flex-start',
              animationDelay: `${i * 0.3}s`,
            }}
          >
            <div style={{ flexShrink: 0, marginTop: 2 }}>{icon}</div>
            <div>
              <div style={{
                fontWeight: 600, fontSize: 15, color: '#111',
                marginBottom: 4, letterSpacing: '-0.01em',
              }}>{title}</div>
              <div style={{
                fontSize: 13, color: '#777', lineHeight: 1.55,
              }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
// (export at bottom)

// Brand story section
function BrandStory({ lang }) {
  const [hovered, setHovered] = React.useState(null);

  const panels = [
    {
      id: 'vikusha',
      content: (
        <>
          <img
            src="/uploads/1.webp"
            alt="Vikusha"
            style={{ height: 52, width: 'auto', marginBottom: 20, display: 'block' }}
          />
          <div style={{
            fontFamily: 'var(--font-display, serif)', fontSize: 22,
            fontWeight: 700, color: '#111', marginBottom: 10, letterSpacing: '-0.02em',
          }}>VIKUSHA</div>
          <p style={{
            fontSize: 13, lineHeight: 1.7, color: '#555', maxWidth: '28ch', textAlign: 'center',
          }}>
            {lang === 'ar' ? 'مصممة لمن يريد أكثر. أجهزة لوحية وساعات ذكية لحياة حقيقية.' : 'Built for those who demand more. Tablets and smartwatches engineered for real life.'}
          </p>
          <div style={{
            marginTop: 16, width: 32, height: 2,
            background: '#FFB800', borderRadius: 1,
          }}/>
        </>
      ),
    },
    {
      id: 'teclast',
      content: (
        <>
          <img
            src="/uploads/2.webp"
            alt="Teclast"
            style={{ height: 42, width: 'auto', marginBottom: 20, display: 'block' }}
          />
          <div style={{
            fontFamily: 'var(--font-display, serif)', fontSize: 22,
            fontWeight: 700, color: '#111', marginBottom: 10, letterSpacing: '-0.02em',
          }}>TECLAST</div>
          <p style={{
            fontSize: 13, lineHeight: 1.7, color: '#555', maxWidth: '28ch', textAlign: 'center',
          }}>
            {lang === 'ar' ? 'تقنية دقيقة بسعر عادل. أداء تشعر به وقيمة تثق بها.' : 'Precision technology at an honest price. Performance you can feel, value you can trust.'}
          </p>
          <div style={{
            marginTop: 16, width: 32, height: 2,
            background: '#FF6B00', borderRadius: 1,
          }}/>
        </>
      ),
    },
  ];

  return (
    <section className="brand-story-grid" style={{
      width: '100%',
      background: '#fff',
      borderTop: '1px solid #FFB80033',
      borderBottom: '1px solid #FFB80033',
      margin: '48px 0 0',
      display: 'grid',
      gridTemplateColumns: '1fr 1px 1fr',
    }}>
      {panels.map((panel, i) => (
        <React.Fragment key={panel.id}>
          <div
            onMouseEnter={() => setHovered(panel.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '48px 32px',
              transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease',
              transform: hovered === panel.id ? 'translateY(-6px)' : 'translateY(0)',
              cursor: 'default',
            }}
          >
            {panel.content}
          </div>
          {i < panels.length - 1 && (
            <div className="brand-story-divider" style={{ background: '#FFB80044', alignSelf: 'stretch' }}/>
          )}
        </React.Fragment>
      ))}
    </section>
  );
}
// (export at bottom)

// ── Vikusha promo: countdown + marquee helpers ──
function VkCountdown({ endsAt, accent='#FF6B00', ink='#fff' }) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, endsAt - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cells = [
    { v: d, label: 'DAYS' },
    { v: h, label: 'HRS' },
    { v: m, label: 'MIN' },
    { v: s, label: 'SEC' },
  ];
  return (
    <div style={{ display:'inline-flex', gap:8, alignItems:'stretch' }}>
      {cells.map((c, i) => (
        <React.Fragment key={c.label}>
          <div style={{
            minWidth:50, padding:'8px 10px 6px',
            border:`1px solid rgba(255,255,255,0.12)`,
            background:'rgba(255,255,255,0.04)',
            borderRadius:10, textAlign:'center',
            backdropFilter:'blur(6px)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,0.06)',
          }}>
            <div
              key={c.v}
              className="vk-tick"
              style={{
                fontFamily:'var(--font-display, serif)',
                fontSize:22, fontWeight:700, lineHeight:1, color:ink,
                fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em',
              }}
            >{String(c.v).padStart(2,'0')}</div>
            <div style={{
              fontFamily:'var(--font-mono, monospace)',
              fontSize:8, letterSpacing:'0.22em',
              color:'rgba(255,255,255,0.5)', marginTop:4,
            }}>{c.label}</div>
          </div>
          {i < cells.length-1 && (
            <div style={{
              display:'flex', alignItems:'center',
              color:`${accent}aa`,
              fontFamily:'var(--font-display, serif)', fontSize:18, fontWeight:600,
              animation: 'vk-promo-pulse 1.1s ease-in-out infinite',
            }}>:</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function PromoSlide({ slide, active, animKey, t, lang, settings }) {
  const k = animKey;
  const accent = slide.accent || '#FF6B00';
  const accentSoft = slide.accentSoft || '#ffaa55';
  const ink   = '#ffffff';
  const muted = 'rgba(255,255,255,0.62)';
  const isPromo = !!slide.promo;
  const endsAtRef = React.useRef(Date.now() + (slide.promoDurationMs || 48*3600*1000));

  const marqueeItems = lang === 'ar'
    ? ['شحن مجاني', 'ضمان سنة', 'الدفع عند الاستلام', 'شحن اليوم', 'إصدار محدود']
    : ['FREE SHIPPING', '1-YEAR WARRANTY', 'CASH ON DELIVERY', 'SHIPS TODAY', 'LIMITED EDITION'];
  const marqueeRow = (
    <span style={{ display:'inline-flex', gap:48, alignItems:'center' }}>
      {marqueeItems.map((it, i) => (
        <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:48 }}>
          <span>{it}</span>
          <span style={{ color: accent, opacity:0.85 }}>◆</span>
        </span>
      ))}
    </span>
  );

  // Tag pill style varies by kind
  const tagStyles = {
    live: { color: accent, bg: 'rgba(255,107,0,0.10)', border: `${accent}66`, dot: true },
    new:  { color: accentSoft, bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', dot: false },
    best: { color: accentSoft, bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.18)', dot: false },
  };
  const tagStyle = tagStyles[slide.tagKind] || tagStyles.new;

  return (
    <div
      className="hero-slide hero-slide-inner vk-promo-slide"
      style={{
        background: slide.bg,
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.7s cubic-bezier(0.22,1,0.36,1)',
        position:'absolute', inset:0,
        display:'grid', gridTemplateColumns:'1.05fr 1fr',
        alignItems:'center',
        padding:'0 0 0 56px',
        overflow:'hidden',
        color: ink,
      }}
    >
      {/* Layered background — deep gradient + warm accent glow */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none',
        background: `
          radial-gradient(ellipse 70% 60% at 85% 30%, ${accent}55, transparent 60%),
          radial-gradient(ellipse 60% 80% at 15% 90%, ${accent}22, transparent 65%),
          linear-gradient(135deg, ${slide.bg} 0%, #07070a 100%)
        `,
      }}/>

      {/* Subtle grain / noise via SVG */}
      <div style={{
        position:'absolute', inset:0, pointerEvents:'none', opacity:0.06, mixBlendMode:'overlay',
        backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>")`,
      }}/>

      {/* LEFT */}
      <div className="vk-promo-text" key={`text-${k}`} style={{ position:'relative', zIndex:1, paddingRight:24 }}>
        {/* Eyebrow row */}
        <div style={{
          display:'inline-flex', alignItems:'center', gap:12, flexWrap:'wrap',
          fontFamily:'var(--font-mono, monospace)', fontSize:10,
          letterSpacing:'0.24em', textTransform:'uppercase', color: muted,
          marginBottom:18,
          animation: active ? 'hero-slide-left 0.7s cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}>
          <span style={{ color: accent }}>◆</span>
          <span>{slide.eyebrow}</span>
          {slide.ribbon && slide.ribbon !== slide.tag && (
            <>
              <span style={{ opacity:0.35 }}>/</span>
              <span style={{ color: accent, fontWeight:700 }}>{slide.ribbon}</span>
            </>
          )}
          <span role="status" style={{
            display:'inline-flex', alignItems:'center', gap:6,
            marginLeft:2, padding:'3px 9px',
            border:`1px solid ${tagStyle.border}`, borderRadius:999,
            color: tagStyle.color, background: tagStyle.bg,
          }}>
            {tagStyle.dot && <span style={{
              width:6, height:6, borderRadius:'50%', background: accent,
              animation:'vk-promo-pulse 1.4s ease-in-out infinite, vk-promo-glow 1.8s ease-in-out infinite',
            }}/>}
            {slide.tag}
          </span>
        </div>

        {/* Title */}
        <h2 className="vk-promo-title" style={{
          fontFamily:'var(--font-display, serif)', fontSize:'clamp(28px, 4.2vw, 52px)',
          lineHeight:1.02, fontWeight:700, margin:'0 0 10px',
          letterSpacing:'-0.035em', color: ink,
          animation: active ? 'hero-slide-left 0.7s cubic-bezier(0.22,1,0.36,1) 0.08s both' : 'none',
        }}>
          {slide.title}{' '}
          <em style={{
            fontStyle:'italic',
            background:`linear-gradient(135deg, ${accent} 0%, ${accentSoft} 100%)`,
            WebkitBackgroundClip:'text', backgroundClip:'text',
            WebkitTextFillColor:'transparent', color:'transparent',
          }}>{slide.titleItalic}</em>
        </h2>

        {/* Accent bar */}
        <div style={{
          width:48, height:2, background: accent, borderRadius:2, margin:'12px 0 16px',
          boxShadow:`0 0 18px ${accent}99`,
          animation: active ? 'hero-fade-up 0.6s ease 0.18s both' : 'none',
        }}/>

        {/* Sub */}
        <p style={{
          fontFamily:'var(--font-mono, monospace)', fontSize:11, letterSpacing:'0.12em',
          textTransform:'uppercase', color: muted, margin:'0 0 22px', maxWidth:'46ch',
          animation: active ? 'hero-fade-up 0.6s ease 0.24s both' : 'none',
        }}>{slide.sub}</p>

        {/* Price + countdown row */}
        <div className="vk-promo-pricerow" style={{
          display:'flex', alignItems:'center', gap:24, flexWrap:'wrap', marginBottom:24,
          animation: active ? 'hero-fade-up 0.6s ease 0.32s both' : 'none',
        }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:12 }}>
            {slide.oldPrice ? (
              <span style={{
                fontFamily:'var(--font-mono, monospace)', fontSize:12,
                color:'rgba(255,255,255,0.4)', textDecoration:'line-through',
              }}>JOD {slide.oldPrice}</span>
            ) : (
              <span style={{
                fontFamily:'var(--font-mono, monospace)', fontSize:10, letterSpacing:'0.22em',
                color:'rgba(255,255,255,0.5)', textTransform:'uppercase',
              }}>{lang === 'ar' ? 'يبدأ من' : 'Starting at'}</span>
            )}
            <span className="vk-promo-price" style={{
              fontFamily:'var(--font-display, serif)', fontStyle:'italic',
              fontSize:'clamp(40px, 5.2vw, 64px)', fontWeight:700,
              background:`linear-gradient(135deg, ${accent} 0%, ${accentSoft} 100%)`,
              WebkitBackgroundClip:'text', backgroundClip:'text',
              WebkitTextFillColor:'transparent', color:'transparent',
              letterSpacing:'-0.03em', lineHeight:1.05,
              display:'inline-block',
              paddingInlineStart:'0.12em', marginInlineStart:'-0.04em',
              paddingInlineEnd:'0.18em', marginInlineEnd:'-0.05em',
              overflow:'visible',
            }}>JOD {slide.price}</span>
            {slide.discountLabel && (
              <span style={{
                fontFamily:'var(--font-mono, monospace)', fontSize:9, letterSpacing:'0.22em',
                padding:'4px 9px', borderRadius:999, color: accent, fontWeight:700,
                background:`${accent}1f`, border:`1px solid ${accent}55`,
              }}>{slide.discountLabel}</span>
            )}
          </div>
          {isPromo && <VkCountdown endsAt={endsAtRef.current} accent={accent} ink={ink}/>}
        </div>

        {/* CTAs */}
        {(() => {
          const showPrimary = settings?.primary_button_enabled !== false;
          const showSecondary = settings?.secondary_button_enabled !== false;
          if (!showPrimary && !showSecondary) return null;
          return (
        <div className="vk-promo-ctas" style={{
          display:'flex', gap:12, flexWrap:'wrap',
          animation: active ? 'hero-fade-up 0.6s ease 0.4s both' : 'none',
        }}>
          {showPrimary && (
          <button
            className="vk-cta-primary"
            style={{
              background:`linear-gradient(135deg, ${accent} 0%, ${accentSoft} 100%)`,
              color:'#fff',
              fontFamily:'var(--font-mono, monospace)', fontSize:11, letterSpacing:'0.2em',
              textTransform:'uppercase', fontWeight:700,
              padding:'13px 22px', border:'none', borderRadius:999, cursor:'pointer',
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap:10,
              boxShadow:`0 8px 22px ${accent}55`,
            }}
            onClick={()=>window.navigate('pdp', {id: slide.id})}
          >
            <span>{slide.cta}</span>
            <span style={{ fontSize:14, lineHeight:1 }}>→</span>
          </button>
          )}
          {showSecondary && (
          <button
            className="vk-cta-ghost"
            style={{
              background:'rgba(255,255,255,0.04)', color: muted,
              fontFamily:'var(--font-mono, monospace)', fontSize:11, letterSpacing:'0.2em',
              textTransform:'uppercase', fontWeight:600,
              padding:'12px 20px',
              border:`1px solid rgba(255,255,255,0.18)`,
              borderRadius:999, cursor:'pointer',
              backdropFilter:'blur(6px)',
            }}
            onClick={()=>window.navigate('home', {brand: slide.brand})}
          >{slide.cta2}</button>
          )}
        </div>
          );
        })()}
      </div>

      {/* RIGHT — product image stage */}
      <div className="hero-slide-img" style={{
        position:'relative', height:'100%',
        borderRadius:'0 var(--radius-lg) var(--radius-lg) 0',
        overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {/* Soft circular spotlight behind product (pulses gently) */}
        <div className="vk-spot" style={{
          position:'absolute',
          width:'72%', aspectRatio:'1/1',
          background:`radial-gradient(circle, ${accent}44 0%, ${accent}11 35%, transparent 65%)`,
          filter:'blur(6px)',
          pointerEvents:'none',
        }}/>
        <div key={`img-${k}`} className="vk-product-float" style={{
          position:'relative', zIndex:1, height:'88%',
          display:'flex', alignItems:'center', justifyContent:'center',
          animation: active
            ? 'hero-slide-right 0.7s cubic-bezier(0.22,1,0.36,1) 0.14s both, vk-promo-float 5.5s ease-in-out 0.9s infinite'
            : 'none',
        }}>
          <img
            src={slide.imgSrc}
            alt={slide.eyebrow}
            loading={active ? 'eager' : 'lazy'}
            style={{
              height:'100%', width:'auto', maxWidth:'100%',
              objectFit:'contain',
              mixBlendMode: slide.productBlend === 'screen' ? 'normal' : 'normal',
              filter:`drop-shadow(0 28px 48px rgba(0,0,0,0.55)) drop-shadow(0 0 32px ${accent}55)`,
            }}
          />
        </div>
        {/* Left fade for legibility */}
        <div style={{
          position:'absolute', inset:0,
          background:`linear-gradient(to right, ${slide.bg} 0%, ${slide.bg}cc 18%, transparent 55%)`,
          pointerEvents:'none',
        }}/>
      </div>

      {/* Bottom marquee — only on promo slides */}
      {isPromo && (
        <div className="vk-promo-marquee" style={{
          position:'absolute', bottom:0, left:0, right:0,
          padding:'8px 0',
          background:'rgba(0,0,0,0.35)',
          borderTop:`1px solid ${accent}33`,
          overflow:'hidden',
          fontFamily:'var(--font-mono, monospace)', fontSize:10,
          letterSpacing:'0.22em', textTransform:'uppercase',
          color:'rgba(255,255,255,0.7)',
          whiteSpace:'nowrap',
          zIndex:2,
        }}>
          <div className="vk-promo-marquee-track">
            {marqueeRow}{marqueeRow}
          </div>
        </div>
      )}
    </div>
  );
}

function HeroSlide({ slide, products, active, animKey, t, lang, settings }) {
  return <PromoSlide slide={slide} active={active} animKey={animKey} t={t} lang={lang} settings={settings}/>;
}

const INTERVAL = 5000;

function Hero({ t, products, lang }) {
  const HERO_SLIDES = getHeroSlides(lang);
  const { data: heroSettings = {} } = useHeroSettings();
  const [cur, setCur] = React.useState(0);
  const [animKey, setAnimKey] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progressKey, setProgressKey] = React.useState(0);
  const total = HERO_SLIDES.length;
  const timerRef = React.useRef(null);

  const goTo = React.useCallback((idx) => {
    const next = (idx + total) % total;
    setCur(next);
    setAnimKey(k => k + 1);
    setProgressKey(k => k + 1);
  }, [total]);

  // Auto-advance
  React.useEffect(() => {
    if (paused) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => goTo(cur + 1), INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [cur, paused, goTo]);

  return (
    <section
      className="hero-wrap"
      style={{
        position:'relative', height:420, borderRadius:'var(--radius-lg)',
        overflow:'hidden', margin:'12px 0 0',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {HERO_SLIDES.map((slide, i) => (
        <HeroSlide
          key={slide.id}
          slide={slide}
          products={products}
          active={i === cur}
          animKey={i === cur ? animKey : 0}
          t={t}
          lang={lang}
          settings={heroSettings[slide.id]}
        />
      ))}

      {/* Prev / Next arrows — ghost, fade in on hover, hidden on mobile via CSS */}
      <button
        aria-label="Previous slide"
        className="vk-hero-arrow vk-hero-arrow-prev"
        onClick={() => goTo(cur - 1)}
        style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          width:40, height:40, borderRadius:'50%',
          background:'rgba(255,255,255,0.10)', color:'#fff',
          backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:10, cursor:'pointer',
        }}
      ><Icon name="back" size={18}/></button>
      <button
        aria-label="Next slide"
        className="vk-hero-arrow vk-hero-arrow-next"
        onClick={() => goTo(cur + 1)}
        style={{
          position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
          width:40, height:40, borderRadius:'50%',
          background:'rgba(255,255,255,0.10)', color:'#fff',
          backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.18)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:10, cursor:'pointer',
        }}
      ><Icon name="chev" size={18}/></button>

      {/* Progress-bar indicators (one per slide; active fills with autoplay timer) */}
      <div className="vk-hero-progress" style={{
        position:'absolute', bottom:18, left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:8, zIndex:11,
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i+1}`}
            onClick={() => goTo(i)}
            style={{
              width: i===cur ? 44 : 22, height:3, borderRadius:2,
              background:'rgba(255,255,255,0.22)',
              border:'none', padding:0, cursor:'pointer',
              position:'relative', overflow:'hidden',
              transition:'width 0.4s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {i === cur && (
              <span
                key={progressKey}
                style={{
                  position:'absolute', inset:0,
                  background:'#fff',
                  transformOrigin:'left center',
                  animation: paused ? 'none' : `hero-progress ${INTERVAL}ms linear both`,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ p, t, inCart, onAdd, onOpen, imgVersion }) {
  const [color, setColor] = React.useState(p.colors[0]);
  const [wish, setWish] = React.useState(false);
  const [imgIndex, setImgIndex] = React.useState(0);
  const intervalRef = React.useRef(null);
  const imgs = (PRODUCT_IMAGES[p.id] && PRODUCT_IMAGES[p.id][color]) || [];

  React.useEffect(() => {
    setImgIndex(0);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, [color]);

  React.useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const handleEnter = () => {
    if (imgs.length <= 1 || intervalRef.current) return;
    // immediate first switch
    setImgIndex(1 % imgs.length);
    intervalRef.current = setInterval(() => {
      setImgIndex(i => (i + 1) % imgs.length);
    }, 600);
  };
  const handleLeave = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setImgIndex(0);
  };

  return (
    <article className="card">
      <div className="card-img" onClick={()=>onOpen(p)} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <span className={`card-brand-tag ${p.brand}`}>
          {p.brand === 'vikusha'
            ? <img src="/uploads/1.webp" alt="Vikusha" style={{ height: 22, width: 'auto', borderRadius: 4, display:'block' }}/>
            : <img src="/uploads/2.webp" alt="Teclast" style={{ height: 18, width: 'auto', display:'block' }}/>
          }
        </span>
        
        <Silhouette product={p} color={color} key={color + '-' + imgVersion} imgIndex={imgIndex}/>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <div onClick={()=>onOpen(p)} className="card-name">{p.name}</div>
          <div className="card-price"><Price value={p.price}/></div>
        </div>
        <p className="card-tagline">{p.tagline}</p>
        {p.colors.length > 1 && (
          <div className="card-colors">
            {p.colors.map(c => (
              <ColorDot key={c} color={c} selected={color===c} onClick={()=>setColor(c)} size={16}/>
            ))}
          </div>
        )}
        <div className="card-actions">
          <button
            className={`btn ${inCart ? 'btn-outline' : 'btn-primary'} btn-sm`}
            style={{
              flex:1,
              ...(inCart ? {} : {
                background: p.brand === 'vikusha' ? '#FFB800' : '#FF6B00',
                color: p.brand === 'vikusha' ? '#1a1200' : '#fff',
              })
            }}
            onClick={()=>onAdd(p, color)}
          >
            {inCart ? <><Icon name="check" size={14}/> {t.in_cart}</> : t.add_to_cart}
          </button>
        </div>
      </div>
    </article>
  );
}

function LifestyleBanner({ lang }) {
  return (
    <section style={{
      position: 'relative',
      width: '100%',
      minHeight: 480,
      overflow: 'hidden',
      margin: '48px 0 0',
    }}>
      <img
        src="/uploads/vikusha-lifestyle-wrist.webp"
        alt="Vikusha smartwatch on wrist"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: lang === 'ar'
          ? 'linear-gradient(to left, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 40%, transparent 68%)'
          : 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.5) 40%, transparent 68%)',
      }} />
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: lang === 'ar' ? 'flex-end' : 'flex-start',
        justifyContent: 'center',
        minHeight: 480,
        padding: '60px clamp(36px, 7vw, 96px)',
        textAlign: lang === 'ar' ? 'right' : 'left',
        maxWidth: '50%',
      }}>
        <div style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#FFB800',
          marginBottom: 14,
        }}>
          {lang === 'ar' ? 'فيكوشا' : 'VIKUSHA'}
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display, serif)',
          fontSize: 'clamp(28px, 5vw, 52px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          marginBottom: 16,
          maxWidth: '14ch',
        }}>
          {lang === 'ar' ? 'مصمّمة لكل لحظة' : 'Designed for every moment'}
        </h2>
        <p style={{
          fontSize: 15,
          color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.6,
          maxWidth: '36ch',
          marginBottom: 28,
        }}>
          {lang === 'ar'
            ? 'ساعة ذكية تجمع بين الأناقة والتكنولوجيا — على معصمك، أينما كنت.'
            : 'A smartwatch that blends elegance with technology — on your wrist, wherever you go.'}
        </p>
        <button
          className="vk-cta-primary"
          onClick={() => window.navigate?.('pdp', { id: 'v-70' })}
          style={{
            padding: '13px 36px',
            background: '#FFB800',
            color: '#1a1200',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            borderRadius: 28,
            cursor: 'pointer',
            letterSpacing: '0.02em',
          }}
        >
          {lang === 'ar' ? 'تسوّق V-70' : 'Shop V-70'}
        </button>
      </div>
    </section>
  );
}

function Home({ t, products, onAddToCart, cart, lang, imgVersion, onNavigate }) {
  const [cat, setCat] = React.useState('all');
  const [brand, setBrand] = React.useState('all');
  const [sort, setSort] = React.useState('featured');

  React.useEffect(() => {
    const p = window.__routeParams || {};
    if (p.cat) setCat(p.cat);
    if (p.brand) setBrand(p.brand);
  }, []);

  const filtered = React.useMemo(() => {
    let list = products.slice();
    if (cat !== 'all') list = list.filter(p => p.category === cat);
    if (brand !== 'all') list = list.filter(p => p.brand === brand);
    if (sort === 'price_asc') list.sort((a,b)=>a.price-b.price);
    if (sort === 'price_desc') list.sort((a,b)=>b.price-a.price);
    if (sort === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
    if (sort === 'featured') list.sort((a,b)=>(b.hero?1:0)-(a.hero?1:0));
    return list;
  }, [products, cat, brand, sort]);

  const flagship = products.find(p => p.id === 'vz-80-plus');
  const isInCart = (id) => cart.some(c => c.id === id);

  const { data: visibility } = useSectionVisibility();
  const showPromoBanners = visibility?.promo_banners !== false;
  const showLifestyle = visibility?.lifestyle_banner !== false;

  return (
    <>


      {showPromoBanners && <PromoBanners/>}

      <div className="toolbar">
        <div className="chips">
          {[['all',t.filter_all],['tablet',t.filter_tablet],['watch',t.filter_watch],['accessory',t.filter_accessory]].map(([k,label])=>(
            <button key={k} className={`chip ${cat===k?'active':''}`} onClick={()=>setCat(k)}>{label}</button>
          ))}
          <span style={{ width:1, background:'var(--border)', margin:'0 4px' }}/>
          {[['all',t.filter_all],['vikusha',t.filter_vikusha],['teclast',t.filter_teclast]].map(([k,label])=>(
            <button key={k} className={`chip chip-brand ${brand===k?'active '+k:''}`} onClick={()=>setBrand(k)}>{label}</button>
          ))}
        </div>
        <select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="featured">{t.sort_featured}</option>
          <option value="price_asc">{t.sort_price_asc}</option>
          <option value="price_desc">{t.sort_price_desc}</option>
          <option value="name">{t.sort_name}</option>
        </select>
      </div>

      <div className="section-head">
        <h2>{cat==='all' ? (lang==='ar'?'كل المنتجات':'All products') : t['filter_'+cat]}</h2>
        <div className="count">{filtered.length} items</div>
      </div>

      <div className="grid">
        {filtered.map(p => {
          const seed = String(p.id).split('').reduce((a,c)=>a+c.charCodeAt(0),0);
          const rating = parseFloat((4.2 + ((seed % 7) / 10)).toFixed(1));
          const reviews = 40 + (seed * 7) % 260;
          const firstColor = p.colors?.[0];
          const image = (PRODUCT_IMAGES?.[p.id]?.[firstColor] || [])[0] || '';
          return (
            <ProductShowcaseCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                category: t['cat_'+p.category] || p.category,
                price: p.price,
                image,
                rating,
                reviews,
                inStock: true,
                currency: 'JOD ',
              }}
              addToCartLabel={t.add_to_cart}
              outOfStockLabel={lang==='ar'?'غير متوفر':'Out of Stock'}
              reviewsLabel={lang==='ar'?'تقييم':'reviews'}
              inStockLabel={lang==='ar'?'✓ متوفر':'✓ In Stock'}
              onAddToCart={() => { onAddToCart(p, firstColor, 1); }}
              onCardClick={() => { onNavigate && onNavigate('pdp', { id: p.id }); }}
            />
          );
        })}
      </div>

      <TestimonialsSection lang={lang}/>

      <BrandStory lang={lang}/>

      

      <TeclastScroll lang={lang}/>

      <VikushaScroll lang={lang}/>

      {showLifestyle && <LifestyleBanner lang={lang}/>}

      <PromoReel lang={lang}/>

      <BrandStoryStrip lang={lang}/>

      <InstagramGrid lang={lang}/>

    </>
  );
}
export { Home, ProductCard };
