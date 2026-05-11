import React from 'react';
// SwipeScene — scroll-driven finger swipe animation for Vikusha keyboard/trackpad
// 200vh tall sticky section; finger swipes across trackpad as user scrolls

  const { useRef, useEffect } = React;

  const SWIPE_BLOB_PATHS = [
    "M440,270Q430,460,270,470Q110,480,70,340Q30,200,130,110Q230,20,370,50Q510,80,500,175Q490,270,440,270Z",
    "M460,260Q450,470,275,475Q100,480,65,330Q30,180,140,100Q250,20,385,55Q520,90,510,175Q500,260,460,260Z",
    "M430,290Q410,470,255,472Q100,474,65,345Q30,216,125,118Q220,20,365,52Q510,84,505,187Q500,290,430,290Z",
    "M450,275Q435,465,265,468Q95,471,65,338Q35,205,135,112Q235,19,375,52Q515,85,508,180Q501,275,450,275Z",
  ];

  function lerpPaths(a, b, t) {
    const numsA = a.match(/-?\d+\.?\d*/g).map(Number);
    const numsB = b.match(/-?\d+\.?\d*/g).map(Number);
    let li = 0;
    return a.replace(/-?\d+\.?\d*/g, () => {
      const i = li++;
      return (numsA[i] + (numsB[i] - numsA[i]) * t).toFixed(1);
    });
  }

  function getBlobPath(progress) {
    const seg = Math.min(progress * 3, 2.9999);
    const i = Math.floor(seg);
    return lerpPaths(SWIPE_BLOB_PATHS[i], SWIPE_BLOB_PATHS[i + 1], seg - i);
  }

  // Inject styles once
  if (!document.getElementById('swipe-scene-styles')) {
    const s = document.createElement('style');
    s.id = 'swipe-scene-styles';
    s.textContent = `
      @keyframes sw-text-up {
        from { opacity:0; transform:translateY(30px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes sw-ripple {
        0%   { transform:scale(0.6); opacity:0.7; }
        100% { transform:scale(2.2); opacity:0; }
      }
      .sw-ripple-ring {
        position:absolute;
        border-radius:50%;
        border:1.5px solid rgba(255,184,0,0.55);
        animation: sw-ripple 1.4s ease-out infinite;
        pointer-events:none;
      }
    `;
    document.head.appendChild(s);
  }

  function SwipeScene() {
    const sectionRef  = useRef(null);
    const tabletRef   = useRef(null);
    const handRef     = useRef(null);
    const blobRef     = useRef(null);
    const blobPathRef = useRef(null);
    const rippleRef   = useRef(null);
    const headRef     = useRef(null);
    const subRef      = useRef(null);
    const rafRef      = useRef(null);

    useEffect(() => {
      let last = -1;
      function tick() {
        const section = sectionRef.current;
        if (!section) { rafRef.current = requestAnimationFrame(tick); return; }

        const rect    = section.getBoundingClientRect();
        const scrolled = -rect.top;
        const total   = rect.height - window.innerHeight;
        const p       = Math.max(0, Math.min(1, scrolled / total));

        if (Math.abs(p - last) > 0.0003) {
          last = p;

          // ── Tablet: subtle scale-up and slight tilt easing out ──
          const tabletScale = 0.82 + 0.18 * p;
          const tabletTY    = 30 * (1 - p);
          if (tabletRef.current) {
            tabletRef.current.style.transform = `translateY(${tabletTY}px) scale(${tabletScale})`;
          }

          // ── Hand/finger: enters from bottom-right, swipes left ──
          // Phase 1 (0→0.3): hand slides in from bottom-right corner
          // Phase 2 (0.3→0.7): finger swipes left across trackpad
          // Phase 3 (0.7→1.0): hand lifts and fades out
          let handX, handY, handOpacity, handRotate;
          if (p < 0.3) {
            const t = p / 0.3;
            handX       = 30 - t * 5;          // starts far right, eases slightly left
            handY       = 55 + (1 - t) * 30;   // enters from below
            handOpacity = t;
            handRotate  = -12 + t * 8;
          } else if (p < 0.7) {
            const t = (p - 0.3) / 0.4;
            handX       = 25 - t * 30;          // swipes left
            handY       = 55 - t * 4;
            handOpacity = 1;
            handRotate  = -4 + t * 6;
          } else {
            const t = (p - 0.7) / 0.3;
            handX       = -5 - t * 15;
            handY       = 55 - 4 - t * 20;     // lifts up
            handOpacity = 1 - t;
            handRotate  = 2 + t * 10;
          }

          if (handRef.current) {
            handRef.current.style.transform  = `translate(${handX}%, ${handY}%) rotate(${handRotate}deg)`;
            handRef.current.style.opacity    = handOpacity;
          }

          // ── Ripple: show during swipe phase ──
          if (rippleRef.current) {
            rippleRef.current.style.opacity = (p > 0.28 && p < 0.72) ? '1' : '0';
          }

          // ── Blob: morph + slow rotation ──
          const blobRot = p * 90;
          const blobS   = 0.75 + 0.3 * Math.sin(p * Math.PI);
          if (blobRef.current)    blobRef.current.style.transform = `translate(-50%,-50%) rotate(${blobRot}deg) scale(${blobS})`;
          if (blobPathRef.current) blobPathRef.current.setAttribute('d', getBlobPath(p));

          // ── Text: fades in after 25% scroll ──
          const tp = Math.max(0, (p - 0.25) / 0.35);
          if (headRef.current) {
            headRef.current.style.opacity   = tp;
            headRef.current.style.transform = `translateY(${22 * (1 - tp)}px)`;
          }
          if (subRef.current) {
            const sp = Math.max(0, (p - 0.35) / 0.35);
            subRef.current.style.opacity   = sp;
            subRef.current.style.transform = `translateY(${16 * (1 - sp)}px)`;
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      }

      rafRef.current = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          height: '200vh',
          background: '#fff',
          margin: '72px -16px 0',
        }}
      >
        <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
        }}>

          {/* Gold blob */}
          <div
            ref={blobRef}
            style={{
              position: 'absolute',
              top: '50%', left: '58%',
              width: 560, height: 560,
              transform: 'translate(-50%,-50%) rotate(0deg) scale(0.75)',
              transformOrigin: 'center',
              pointerEvents: 'none',
              willChange: 'transform',
              zIndex: 1,
            }}
          >
            <svg viewBox="0 0 500 500" width="560" height="560">
              <defs>
                <radialGradient id="swBlobGrad" cx="38%" cy="32%" r="65%">
                  <stop offset="0%"   stopColor="#FFE066" stopOpacity="0.95"/>
                  <stop offset="55%"  stopColor="#FFB800" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#E6960A" stopOpacity="0.55"/>
                </radialGradient>
                <filter id="swBlobBlur">
                  <feGaussianBlur stdDeviation="10"/>
                </filter>
              </defs>
              <path d={SWIPE_BLOB_PATHS[0]} fill="#FFB800" opacity="0.15" filter="url(#swBlobBlur)" transform="translate(14,18)"/>
              <path ref={blobPathRef} d={SWIPE_BLOB_PATHS[0]} fill="url(#swBlobGrad)"/>
            </svg>
          </div>

          {/* Left: text column */}
          <div style={{
            position: 'relative', zIndex: 4,
            paddingLeft: 'clamp(28px, 6vw, 80px)',
            width: '42%', flexShrink: 0,
          }}>
            <div style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 10, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#FFB800',
              marginBottom: 14,
              animation: 'sw-text-up 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
            }}>Keyboard Case</div>

            <div
              ref={headRef}
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontSize: 'clamp(36px, 5vw, 64px)',
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#111',
                opacity: 0,
                transform: 'translateY(22px)',
                willChange: 'opacity, transform',
                marginBottom: 20,
              }}
            >
              Work<br/><em style={{ color:'#FFB800', fontStyle:'italic' }}>smarter.</em>
            </div>

            <div
              ref={subRef}
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: '#555',
                maxWidth: '36ch',
                opacity: 0,
                transform: 'translateY(16px)',
                willChange: 'opacity, transform',
              }}
            >
              The VIKUSHA keyboard case gives you a full typing experience with a precise trackpad — built for productivity on the go.
            </div>

            {/* Gold accent line */}
            <div style={{
              width: 48, height: 3,
              background: '#FFB800',
              borderRadius: 2,
              marginTop: 28,
              animation: 'sw-text-up 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both',
            }}/>
          </div>

          {/* Right: tablet + hand stage */}
          <div style={{
            position: 'relative',
            flex: 1,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}>

            {/* Tablet image */}
            <div
              ref={tabletRef}
              style={{
                position: 'relative',
                zIndex: 2,
                transform: 'translateY(30px) scale(0.82)',
                willChange: 'transform',
              }}
            >
              <img
                src="/uploads/file_00000000b87071f5a910d5f48a4cd8cd.webp"
                alt="Vikusha Tablet with Keyboard Case"
                style={{
                  height: 'clamp(260px, 38vh, 420px)',
                  width: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.16)) drop-shadow(0 8px 20px rgba(0,0,0,0.1))',
                }}
              />

              {/* Ripple on trackpad area */}
              <div
                ref={rippleRef}
                style={{
                  position: 'absolute',
                  bottom: '14%', left: '37%',
                  width: 44, height: 44,
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              >
                {[0, 0.35, 0.7].map((delay, i) => (
                  <div key={i} className="sw-ripple-ring" style={{
                    width: 44, height: 44,
                    top: '50%', left: '50%',
                    marginLeft: -22, marginTop: -22,
                    animationDelay: `${delay}s`,
                  }}/>
                ))}
              </div>
            </div>

            {/* Hand/finger image — absolutely positioned over the tablet */}
            <div
              ref={handRef}
              style={{
                position: 'absolute',
                bottom: 0, right: 0,
                width: '55%',
                opacity: 0,
                transform: 'translate(30%, 85%) rotate(-12deg)',
                willChange: 'transform, opacity',
                zIndex: 6,
                pointerEvents: 'none',
              }}
            >
              <img
                src="/uploads/file_00000000169c71f5a6773cffff446159.webp"
                alt="finger swiping trackpad"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))',
                }}
              />
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{
            position: 'absolute', bottom: 24, right: 28,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10, color: 'rgba(0,0,0,0.25)',
            letterSpacing: '0.14em', textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 6,
            pointerEvents: 'none', zIndex: 10,
          }}>
            Scroll
            <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
              <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
              <rect x="5.5" y="4" width="3" height="5" rx="1.5" fill="currentColor" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </section>
    );
  }

  export { SwipeScene };
