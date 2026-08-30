import React from 'react';
// TeclastScroll — lazy-loaded, intersection-observed scroll-scrubbed video
  const { useRef, useEffect, useState } = React;

  if (!document.getElementById('teclast-scroll-styles')) {
    const s = document.createElement('style');
    s.id = 'teclast-scroll-styles';
    s.textContent = `
      .tc-feature {
        opacity: 0; transform: translateX(32px);
        transition: opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1);
      }
      .tc-feature.visible { opacity: 1; transform: translateX(0); }
      @keyframes tc-spin { to { transform: rotate(360deg); } }
      .tc-spinner {
        width: 48px; height: 48px; border-radius: 50%;
        border: 2px solid #FF6B0022; border-top-color: #FF6B00;
        animation: tc-spin 0.9s linear infinite;
      }
    `;
    document.head.appendChild(s);
  }

  const FEATURES = [
    { threshold: 0.20, label: '10.95" 60Hz Display',  sub: 'Fluid visuals, vivid colours' },
    { threshold: 0.40, label: '16+8 GB RAM',           sub: 'Seamless multitasking' },
    { threshold: 0.60, label: '7000 mAh Battery',      sub: 'All-day power on a single charge' },
    { threshold: 0.80, label: '4G LTE Connected',      sub: 'Stay online everywhere you go' },
    { threshold: 1.00, label: 'Lightweight & Portable',sub: 'Built for life on the move' },
  ];

  function TeclastScroll({ lang }) {
    const sectionRef     = useRef(null);
    const videoRef       = useRef(null);
    const featRefs       = useRef([]);
    const headRef        = useRef(null);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(() =>
      typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
    );

    useEffect(() => {
      const mq = window.matchMedia('(max-width: 768px)');
      const onChange = e => setIsMobile(e.matches);
      mq.addEventListener ? mq.addEventListener('change', onChange) : mq.addListener(onChange);
      return () => {
        mq.removeEventListener ? mq.removeEventListener('change', onChange) : mq.removeListener(onChange);
      };
    }, []);

    useEffect(() => {
      const vid     = videoRef.current;
      const section = sectionRef.current;
      if (!vid || !section) return;

      // ── Mobile: simple autoplay loop, no scroll-scrub ──
      if (isMobile) {
        let cancelled = false;
        const src = vid.getAttribute('data-src');
        const start = () => {
          if (cancelled) return;
          vid.muted = true;
          vid.loop = true;
          vid.playsInline = true;
          vid.autoplay = true;
          setLoading(false);
          const playPromise = vid.play();
          if (playPromise && playPromise.catch) playPromise.catch(() => {});
        };
        if (!vid.src) {
          vid.src = src;
          vid.load();
          vid.addEventListener('loadeddata', start, { once: true });
        } else {
          start();
        }
        // Reveal all features immediately on mobile
        FEATURES.forEach((_, i) => {
          const el = featRefs.current[i];
          if (el) el.classList.add('visible');
        });
        if (headRef.current) {
          headRef.current.style.opacity = 1;
          headRef.current.style.transform = 'translateY(0)';
        }
        return () => { cancelled = true; };
      }

      // ── Desktop: scroll-scrub ──
      let loaded = false;
      let active = false;

      function scrub() {
        if (!vid.duration || !isFinite(vid.duration)) return;
        const rect   = section.getBoundingClientRect();
        const total  = section.offsetHeight - window.innerHeight;
        const p      = Math.max(0, Math.min(1, -rect.top / total));
        if (vid.fastSeek) vid.fastSeek(p * vid.duration);
        else vid.currentTime = p * vid.duration;
        if (headRef.current) {
          const hp = Math.min(1, p / 0.15);
          headRef.current.style.opacity   = hp;
          headRef.current.style.transform = `translateY(${20*(1-hp)}px)`;
        }
        FEATURES.forEach((f, i) => {
          const el = featRefs.current[i];
          if (el) el.classList.toggle('visible', p >= f.threshold - 0.01);
        });
      }

      function loadVideo() {
        if (loaded) return;
        loaded = true;
        const src = vid.getAttribute('data-src');
        fetch(src)
          .then(r => r.blob())
          .then(blob => {
            vid.src = URL.createObjectURL(blob);
            vid.load();
            vid.addEventListener('loadedmetadata', () => {
              setLoading(false);
              scrub();
              if (active) window.addEventListener('scroll', scrub, { passive: true });
            }, { once: true });
          })
          .catch(() => {
            vid.src = src; vid.load();
            vid.addEventListener('loadedmetadata', () => {
              setLoading(false);
              scrub();
              if (active) window.addEventListener('scroll', scrub, { passive: true });
            }, { once: true });
          });
      }


      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          active = e.isIntersecting;
          if (active) {
            loadVideo();
            if (loaded) window.addEventListener('scroll', scrub, { passive: true });
          }
          else window.removeEventListener('scroll', scrub);
        });
      }, { rootMargin: '600px' });

      io.observe(section);
      return () => { io.disconnect(); window.removeEventListener('scroll', scrub); };
    }, [isMobile]);

    return (
      <section ref={sectionRef} className="scroll-scene-section" style={{
        position:'relative', height:'300vh', background:'#ffffff',
        margin:'0 -16px', borderTop:'1px solid #FF6B0022', borderBottom:'1px solid #FF6B0022',
      }}>
        <div className="scroll-scene-sticky" dir="ltr" style={{
          position:'sticky', top:0, height:'100vh', overflow:'hidden', background:'#ffffff',
          display:'grid', gridTemplateColumns:'1fr 560px 1fr', alignItems:'center',
        }}>
          {/* LEFT */}
          <div style={{ paddingLeft:'clamp(24px,5vw,64px)', display:'flex', flexDirection:'column', justifyContent:'center', background:'#ffffff' }}>
            <div ref={headRef} style={{ opacity:0, transform:'translateY(20px)', willChange:'opacity,transform' }}>
              <div style={{ fontFamily:'var(--font-mono,monospace)', fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#FF6B00', marginBottom:14 }}>Teclast P50</div>
              <div style={{ fontFamily:'var(--font-display,serif)', fontSize:'clamp(28px,3.5vw,48px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.03em', color:'#111', marginBottom:4 }}>Meet the</div>
              <div style={{ fontFamily:'var(--font-display,serif)', fontSize:'clamp(28px,3.5vw,48px)', fontWeight:700, lineHeight:1.08, letterSpacing:'-0.03em', fontStyle:'italic', color:'#FF6B00', marginBottom:18 }}>Teclast P50.</div>
              <p style={{ fontSize:14, lineHeight:1.65, color:'#666', maxWidth:'28ch' }}>Power meets portability — engineered for work, built for life.</p>
              <div style={{ width:44, height:3, background:'#FF6B00', borderRadius:2, marginTop:22 }}/>
            </div>
          </div>

          {/* CENTER */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', position:'relative', height:'100%', background:'#ffffff' }}>
            {loading && (
              <div style={{ position:'absolute', display:'flex', flexDirection:'column', alignItems:'center', gap:16, zIndex:2 }}>
                <div className="tc-spinner"/>
                <div style={{ fontFamily:'var(--font-mono,monospace)', fontSize:10, color:'#FF6B00', letterSpacing:'0.14em', textTransform:'uppercase' }}>Loading…</div>
              </div>
            )}
            <video
              ref={videoRef}
              data-src="/uploads/u5144992196_httpss.mj.runp2lqYW_dyJY_Add_a_scroll-triggered_l_531df757-ee28-4368-9a1b-b6f7fa47ff10_2.mp4"
              muted playsInline preload="metadata"
              style={{ width:560, maxHeight:'82vh', objectFit:'contain', display:'block', mixBlendMode:'multiply', opacity: loading ? 0 : 1, transition:'opacity 0.4s ease' }}
            />
          </div>

          {/* RIGHT */}
          <div className="scroll-scene-features" style={{ paddingRight:'clamp(24px,5vw,64px)', display:'flex', flexDirection:'column', justifyContent:'center', gap:26, background:'#ffffff' }}>
            {FEATURES.map((f,i) => (
              <div key={i} ref={el=>featRefs.current[i]=el} className="tc-feature" style={{ transitionDelay:`${i*0.04}s` }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:'#FF6B0014', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2, color:'#FF6B00', fontSize:14, fontWeight:700 }}>◈</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:15, color:'#111', marginBottom:3, letterSpacing:'-0.01em' }}>{f.label}</div>
                    <div style={{ fontSize:12, color:'#888', lineHeight:1.5 }}>{f.sub}</div>
                  </div>
                </div>
                <div style={{ width:3, height:3, borderRadius:'50%', background:'#FF6B00', marginTop:8, marginLeft:46, opacity:0.4 }}/>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <div style={{ position:'absolute', bottom:24, left:'50%', transform:'translateX(-50%)', fontFamily:'var(--font-mono,monospace)', fontSize:10, color:'rgba(0,0,0,0.22)', letterSpacing:'0.14em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:6, pointerEvents:'none', zIndex:5 }}>
            Scroll to explore
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none"><rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/><rect x="5.5" y="4" width="3" height="5" rx="1.5" fill="currentColor" opacity="0.5"/></svg>
          </div>
        </div>
      </section>
    );
  }

  export { TeclastScroll };
