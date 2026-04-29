// Home page: hero, filters, grid, CTA strip
import React from 'react';
import { Icon, Price } from './atoms.jsx';
import { Silhouette, ColorDot } from './silhouettes.jsx';
import { TeclastScroll } from './teclast-scroll.jsx';
import { VikushaScroll } from './vikusha-scroll.jsx';
import { PromoReel } from './promo.jsx';
function getHeroSlides(lang) {
  const ar = lang === 'ar';
  return [
  {
    id: 'v-70',
    bg: '#c49a00',
    accent: '#d7a528',
    eyebrow: ar ? 'ساعة فيكوشا الذكية' : 'Vikusha Smartwatch',
    title: ar ? 'الوقت.' : 'Time.',
    titleItalic: ar ? 'بشكل مختلف.' : 'Reimagined.',
    sub: ar ? '١.٤٣" AMOLED · NFC · معدل ضربات القلب · IP67' : '1.43" AMOLED · NFC · Heart rate · IP67',
    price: 50,
    oldPrice: 75,
    cta: ar ? 'احجز الآن' : 'Claim Yours',
    cta2: ar ? 'استعرض فيكوشا' : 'Explore Vikusha',
    brand: 'vikusha',
    imgType: 'photo',
    imgSrc: '/uploads/file_00000000f98471fdb5a91f41d515c0c7-removebg-preview.png',
    promo: true,
    ribbon: ar ? 'عرض محدود' : 'LIMITED DROP',
    promoDurationMs: 48 * 60 * 60 * 1000, // 48h
  },
  {
    id: 'vz-80-plus',
    bg: '#0a1628',
    accent: '#FF6B00',
    eyebrow: ar ? 'جهاز فيكوشا الرائد' : 'Vikusha Flagship Tablet',
    title: ar ? 'مصمم' : 'Built for',
    titleItalic: ar ? 'ليدوم.' : 'the long haul.',
    sub: ar ? 'شاشة 10.95" 2K · ذاكرة 12+12 · بطارية 8500 · 4G LTE' : '10.95" 2K · 12+12 GB RAM · 8500 mAh · 4G LTE',
    price: 260,
    cta: ar ? 'تسوّق VZ-80 PLUS' : 'Shop VZ-80 PLUS',
    cta2: ar ? 'استعرض الأجهزة' : 'Explore Tablets',
    brand: 'vikusha',
    imgType: 'photo',
    imgSrc: '/uploads/04d9883d725a093586b7b7b1518ac3dd_abbcf2340001434b9a4d564263254942-removebg-preview.png',
  },
  {
    id: 'teclast-p50',
    bg: '#1a1208',
    accent: '#e86a1f',
    eyebrow: ar ? 'جهاز تيكلاست اللوحي' : 'Teclast Tablet',
    title: ar ? 'القوة تلتقي' : 'Power meets',
    titleItalic: ar ? 'الإمكانية.' : 'portability.',
    sub: ar ? '10.95" · 90Hz · 8+12 GB · 4G LTE · 7000 mAh' : '10.95" · 90 Hz · 8+12 GB · 4G LTE · 7000 mAh',
    price: 135,
    cta: ar ? 'تسوّق P50' : 'Shop P50',
    cta2: ar ? 'استعرض تيكلاست' : 'Explore Teclast',
    brand: 'teclast',
    imgType: 'photo',
    imgSrc: '/uploads/0f39d92f840194b3eb70333db1a89b38_46c26fc6e6aa4dd7b5cff127dbc89fcc-removebg-preview.png',
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
            src="/uploads/1.png"
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
            src="/uploads/2.png"
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

function HeroSlide({ slide, products, active, animKey, t }) {
  const product = products.find(p => p.id === slide.id);
  const k = animKey; // changes each time slide becomes active → re-triggers animations

  return (
    <div
      className="hero-slide hero-slide-inner"
      style={{
        background: slide.bg,
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
        transition: 'opacity 0.6s ease',
        position: 'absolute', inset: 0,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: '0 0 0 52px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle radial glow */}
      <div style={{
        position:'absolute', inset:0,
        background: slide.id === 'vz-80-plus'
          ? `radial-gradient(ellipse at top right, #c44a0055, transparent 50%), radial-gradient(ellipse at bottom left, #0d2a5044, transparent 50%)`
          : `radial-gradient(ellipse at top right, ${slide.accent}22, transparent 55%)`,
        pointerEvents:'none',
      }}/>

      {/* Left: text — slides in from left */}
      <div key={`text-${k}`} style={{ position:'relative', zIndex:1 }}>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:8,
          fontFamily:'var(--font-mono)', fontSize:10, letterSpacing:'0.16em',
          textTransform:'uppercase', color: slide.accent, marginBottom:10,
          background:'rgba(255,255,255,0.08)', padding:'4px 10px', borderRadius:999,
          border:`1px solid ${slide.accent}44`,
          animation: active ? 'hero-slide-left 0.6s cubic-bezier(0.22,1,0.36,1) both' : 'none',
        }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:slide.accent, display:'inline-block' }}/>
          {slide.eyebrow}
        </div>

        <h2 style={{
          fontFamily:'var(--font-display)', fontSize:40, lineHeight:1.05,
          fontWeight:400, margin:'0 0 10px', letterSpacing:'-0.02em',
          color:'#f3f1e7', textWrap:'balance',
          animation: active ? 'hero-slide-left 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s both' : 'none',
        }}>
          {slide.title} <em style={{ color: slide.accent === '#d7a528' ? '#f4e6b8' : slide.accent }}>{slide.titleItalic}</em>
        </h2>

        <p style={{
          fontSize:13, color:'rgba(255,255,255,0.65)', margin:'0 0 20px', maxWidth:'44ch',
          animation: active ? 'hero-fade-up 0.5s ease 0.2s both' : 'none',
        }}>{slide.sub}</p>

        <div style={{
          display:'flex', gap:10, flexWrap:'wrap',
          animation: active ? 'hero-fade-up 0.5s ease 0.4s both' : 'none',
        }}>
          <button
            className="btn btn-sm"
            style={{ background:slide.accent, color: slide.accent === '#d7a528' ? '#0f2a20' : '#fff', borderRadius:999, fontWeight:600 }}
            onClick={()=>window.navigate('pdp', {id: slide.id})}
          >{slide.cta} <Icon name="chev" size={14}/></button>
          <button
            className="btn btn-sm btn-outline"
            style={{ color:'rgba(255,255,255,0.8)', borderColor:'rgba(255,255,255,0.25)', borderRadius:999 }}
            onClick={()=>window.navigate('home', {brand: slide.brand})}
          >{slide.cta2}</button>
        </div>
      </div>

      {/* Right: product image — slides in from right */}
      <div className="hero-slide-img" style={{
        position:'relative', height:'100%',
        borderRadius:'0 var(--radius-lg) var(--radius-lg) 0',
        overflow:'hidden',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <div key={`img-${k}`} style={{
          position:'relative', zIndex:1, height:'90%', display:'flex', alignItems:'center',
          animation: active ? 'hero-slide-right 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both' : 'none',
        }}>
          {slide.imgType === 'photo' ? (
            <img
              src={slide.imgSrc}
              alt={slide.eyebrow}
              style={{
                height:'100%', width:'auto', maxWidth:'100%',
                objectFit:'contain',
                filter:'drop-shadow(0 20px 40px rgba(0,0,0,0.45))',
              }}
            />
          ) : (
            <div style={{
              width:220, height: product?.category === 'watch' ? 280 : 240,
              filter:'drop-shadow(0 20px 40px rgba(0,0,0,0.5))',
              transform:'rotate(-4deg)',
            }}>
              {product && <Silhouette product={product} color={product.colors[0]}/>}
            </div>
          )}
        </div>

        {/* Left gradient fade */}
        <div style={{
          position:'absolute', inset:0,
          background:`linear-gradient(to right, ${slide.bg} 0%, ${slide.bg}88 20%, transparent 50%)`,
          pointerEvents:'none',
        }}/>

        {/* Price badge — bounce in */}
        <div key={`badge-${k}`} style={{
          position:'absolute', top:16, right:16,
          background:slide.accent, color: slide.accent==='#d7a528'?'#0f2a20':'#fff',
          fontFamily:'var(--font-mono)', fontSize:11, letterSpacing:'0.1em',
          padding:'5px 12px', borderRadius:999, fontWeight:600,
          animation: active ? 'hero-badge-bounce 0.6s cubic-bezier(0.22,1,0.36,1) 0.3s both' : 'none',
          transformOrigin: 'top right',
        }}>JOD {slide.price.toFixed(0)}</div>
      </div>
    </div>
  );
}

const INTERVAL = 5000;

function Hero({ t, products, lang }) {
  const HERO_SLIDES = getHeroSlides(lang);
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
        position:'relative', height:300, borderRadius:'var(--radius-lg)',
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
        />
      ))}

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo(cur - 1)}
        style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          width:36, height:36, borderRadius:'50%',
          background:'rgba(255,255,255,0.15)', color:'#fff',
          backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.2)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:10, cursor:'pointer',
        }}
      ><Icon name="back" size={18}/></button>
      <button
        onClick={() => goTo(cur + 1)}
        style={{
          position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
          width:36, height:36, borderRadius:'50%',
          background:'rgba(255,255,255,0.15)', color:'#fff',
          backdropFilter:'blur(4px)', border:'1px solid rgba(255,255,255,0.2)',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:10, cursor:'pointer',
        }}
      ><Icon name="chev" size={18}/></button>

      {/* Dot indicators */}
      <div style={{
        position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:8, zIndex:10,
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i===cur ? 24 : 8, height:8, borderRadius:4,
              background: i===cur ? '#fff' : 'rgba(255,255,255,0.4)',
              transition:'all 0.3s ease', border:'none', padding:0, cursor:'pointer',
            }}
          />
        ))}
      </div>

      {/* Gold progress bar */}
      <div style={{
        position:'absolute', bottom:0, left:0, right:0,
        height:3, background:'rgba(255,255,255,0.12)', zIndex:10,
      }}>
        <div
          key={progressKey}
          style={{
            height:'100%',
            background:'#FFB800',
            transformOrigin:'left center',
            animation: paused ? 'none' : `hero-progress ${INTERVAL}ms linear both`,
          }}
        />
      </div>
    </section>
  );
}

function ProductCard({ p, t, inCart, onAdd, onOpen }) {
  const [color, setColor] = React.useState(p.colors[0]);
  const [wish, setWish] = React.useState(false);
  return (
    <article className="card">
      <div className="card-img" onClick={()=>onOpen(p)}>
        <span className={`card-brand-tag ${p.brand}`}>
          {p.brand === 'vikusha'
            ? <img src="/uploads/1.png" alt="Vikusha" style={{ height: 22, width: 'auto', borderRadius: 4, display:'block' }}/>
            : <img src="/uploads/2.png" alt="Teclast" style={{ height: 18, width: 'auto', display:'block' }}/>
          }
        </span>
        <button className={`card-wish ${wish?'active':''}`} onClick={(e)=>{e.stopPropagation(); setWish(!wish);}}><Icon name="heart" size={15}/></button>
        <Silhouette product={p} color={color}/>
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

function Home({ t, products, onAddToCart, cart, lang }) {
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

  return (
    <>
      <Hero t={t} products={products} lang={lang}/>

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
        {filtered.map(p => (
          <ProductCard
            key={p.id}
            p={p}
            t={t}
            inCart={isInCart(p.id)}
            onAdd={(prod, color) => onAddToCart(prod, color, 1)}
            onOpen={(prod) => window.navigate('pdp', {id: prod.id})}
          />
        ))}
      </div>

      <BrandStory lang={lang}/>

      <WhyChooseUs lang={lang}/>

      <TeclastScroll lang={lang}/>

      <VikushaScroll lang={lang}/>

      <PromoReel lang={lang}/>

      <div className="home-perks" style={{
        marginTop: 60, padding: '36px 44px',
        background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'center'
      }}>
        {[
          { icon: 'truck', title: lang==='ar'?'توصيل لكل الأردن':'Jordan-wide delivery', sub: lang==='ar'?'١–٣ أيام عمل':'1–3 business days' },
          { icon: 'shield', title: lang==='ar'?'ضمان الوكيل':'Official warranty', sub: lang==='ar'?'حتى ٢٤ شهر':'Up to 24 months' },
          { icon: 'spark', title: lang==='ar'?'أسعار موزع':'Dealer pricing', sub: lang==='ar'?'سجّل دخولك للوصول':'Sign in to access' },
        ].map((x,i)=>(
          <div key={i} style={{ display:'flex', gap:16, alignItems:'start' }}>
            <div className="perk-icon" style={{ width:44, height:44 }}><Icon name={x.icon} size={20}/></div>
            <div>
              <div style={{ fontWeight:600, fontSize:15 }}>{x.title}</div>
              <div style={{ color:'var(--fg-3)', fontSize:13 }}>{x.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export { Home, ProductCard };
