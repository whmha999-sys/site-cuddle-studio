// TabletScrollScene — Apple-style scroll-driven 3D rotation
// Sticky 100vh section; tablet rotates from flat-horizontal to upright as user scrolls

(function () {
  const { useRef, useEffect } = React;

  // SVG blob morph paths — 4 keyframes that interpolate
  const BLOB_PATHS = [
    "M420,300Q380,440,260,460Q140,480,80,370Q20,260,100,160Q180,60,300,60Q420,60,460,160Q500,260,420,300Z",
    "M440,280Q420,460,280,470Q140,480,70,360Q0,240,90,140Q180,40,320,50Q460,60,480,170Q500,280,440,280Z",
    "M400,320Q360,460,230,470Q100,480,60,350Q20,220,110,130Q200,40,330,55Q460,70,470,185Q480,300,400,320Z",
    "M430,290Q400,450,260,465Q120,480,65,355Q10,230,100,140Q190,50,325,58Q460,66,465,178Q470,290,430,290Z",
  ];

  // Linear interpolation between two SVG path numeric values
  function lerpPaths(a, b, t) {
    const numA = a.match(/-?\d+\.?\d*/g).map(Number);
    const numB = b.match(/-?\d+\.?\d*/g).map(Number);
    const letters = a.match(/[A-Za-z]/g);
    let li = 0;
    return a.replace(/-?\d+\.?\d*/g, (_, i) => {
      const idx = li++;
      return (numA[idx] + (numB[idx] - numA[idx]) * t).toFixed(1);
    });
  }

  function getBlobPath(progress) {
    // progress 0→1 across 3 segments
    const seg = Math.min(progress * 3, 2.9999);
    const i = Math.floor(seg);
    const t = seg - i;
    return lerpPaths(BLOB_PATHS[i], BLOB_PATHS[i + 1], t);
  }

  function TabletScrollScene() {
    const sectionRef = useRef(null);
    const stickyRef = useRef(null);
    const tabletRef = useRef(null);
    const blobRef   = useRef(null);
    const blobPathRef = useRef(null);
    const headlineRef = useRef(null);
    const subRef    = useRef(null);
    const rafRef    = useRef(null);

    useEffect(() => {
      let lastProgress = -1;

      function update() {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const scrolled = -rect.top;
        const total = rect.height - window.innerHeight;
        const progress = Math.max(0, Math.min(1, scrolled / total));

        if (Math.abs(progress - lastProgress) < 0.0001) {
          rafRef.current = requestAnimationFrame(update);
          return;
        }
        lastProgress = progress;

        // Tablet rotation: from rotateX(72deg) rotateY(-18deg) → rotateX(0) rotateY(0)
        const rx = 72 * (1 - progress);
        const ry = -18 * (1 - progress);
        const scale = 0.55 + 0.45 * progress;
        const ty = 60 * (1 - progress); // slight upward drift

        if (tabletRef.current) {
          tabletRef.current.style.transform =
            `translateY(${ty}px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
        }

        // Blob morph + rotation
        if (blobRef.current) {
          const blobRot = progress * 120; // degrees
          const blobScale = 0.8 + 0.35 * Math.sin(progress * Math.PI);
          blobRef.current.style.transform = `translate(-50%,-50%) rotate(${blobRot}deg) scale(${blobScale})`;
        }
        if (blobPathRef.current) {
          blobPathRef.current.setAttribute('d', getBlobPath(progress));
        }

        // Text fade in after 40% scroll
        const textProgress = Math.max(0, (progress - 0.4) / 0.4);
        if (headlineRef.current) {
          headlineRef.current.style.opacity = textProgress;
          headlineRef.current.style.transform = `translateY(${24 * (1 - textProgress)}px)`;
        }
        if (subRef.current) {
          subRef.current.style.opacity = textProgress * 0.7;
          subRef.current.style.transform = `translateY(${18 * (1 - textProgress)}px)`;
        }

        rafRef.current = requestAnimationFrame(update);
      }

      rafRef.current = requestAnimationFrame(update);
      return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
      <section
        ref={sectionRef}
        style={{
          position: 'relative',
          height: '300vh',  // scroll height = 3× viewport
          background: '#fff',
          margin: '0 -16px',  // break out of page padding
        }}
      >
        {/* Sticky viewport */}
        <div
          ref={stickyRef}
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff',
          }}
        >
          {/* Gold blob */}
          <div
            ref={blobRef}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 600, height: 600,
              transform: 'translate(-50%,-50%) rotate(0deg) scale(0.8)',
              transformOrigin: 'center center',
              pointerEvents: 'none',
              willChange: 'transform',
              zIndex: 1,
            }}
          >
            <svg viewBox="0 0 500 500" width="600" height="600">
              <defs>
                <radialGradient id="blobGrad" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FFD966" stopOpacity="0.95"/>
                  <stop offset="60%" stopColor="#FFB800" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#E6960A" stopOpacity="0.6"/>
                </radialGradient>
                <filter id="blobBlur">
                  <feGaussianBlur stdDeviation="8"/>
                </filter>
              </defs>
              {/* Soft shadow blob */}
              <path
                d={BLOB_PATHS[0]}
                fill="#FFB800"
                opacity="0.18"
                filter="url(#blobBlur)"
                transform="translate(12,16)"
              />
              {/* Main blob */}
              <path
                ref={blobPathRef}
                d={BLOB_PATHS[0]}
                fill="url(#blobGrad)"
              />
            </svg>
          </div>

          {/* 3D tablet wrapper — perspective container */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            perspective: '1000px',
            perspectiveOrigin: '50% 60%',
            zIndex: 2,
          }}>
            <div
              ref={tabletRef}
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
                transform: 'translateY(60px) rotateX(72deg) rotateY(-18deg) scale(0.55)',
                transition: 'none',
              }}
            >
              <img
                src="/uploads/VIKUSHA Watch V70 main black -47ee13b0.png"
                alt="Vikusha V70 Watch"
                style={{
                  height: 420,
                  width: 'auto',
                  display: 'block',
                  filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.22)) drop-shadow(0 8px 24px rgba(0,0,0,0.14))',
                }}
              />
            </div>
          </div>

          {/* Text overlay — fades in on scroll */}
          <div style={{
            position: 'absolute',
            bottom: '12%',
            left: 0, right: 0,
            textAlign: 'center',
            zIndex: 3,
            pointerEvents: 'none',
          }}>
            <div
              ref={headlineRef}
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontSize: 'clamp(28px, 4vw, 52px)',
                fontWeight: 400,
                letterSpacing: '-0.03em',
                color: '#111',
                opacity: 0,
                transform: 'translateY(24px)',
                willChange: 'opacity, transform',
              }}
            >
              Time. <em style={{ color: '#FFB800' }}>Reimagined.</em>
            </div>
            <div
              ref={subRef}
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 13,
                color: '#666',
                letterSpacing: '0.1em',
                marginTop: 12,
                opacity: 0,
                transform: 'translateY(18px)',
                willChange: 'opacity, transform',
              }}
            >
              1.43″ AMOLED · NFC · Heart rate · IP67
            </div>
          </div>

          {/* Scroll hint — visible at start */}
          <div style={{
            position: 'absolute',
            bottom: 28,
            right: 32,
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: 10,
            color: 'rgba(0,0,0,0.28)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            zIndex: 4,
            pointerEvents: 'none',
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

  window.TabletScrollScene = TabletScrollScene;
})();
