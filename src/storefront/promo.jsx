import React from 'react';
// Cinematic promo reel — two-product animated showcase
// Uses CSS keyframe animations (no external deps)

const promoStyles = `
  @keyframes promo-fade-in {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes promo-slide-left {
    from { opacity: 0; transform: translateX(-80px) scale(0.92); }
    to   { opacity: 1; transform: translateX(0)    scale(1);    }
  }
  @keyframes promo-slide-right {
    from { opacity: 0; transform: translateX(80px) scale(0.92); }
    to   { opacity: 1; transform: translateX(0)   scale(1);    }
  }
  @keyframes promo-float {
    0%, 100% { transform: translateY(0px) rotate(-3deg); }
    50%       { transform: translateY(-14px) rotate(-3deg); }
  }
  @keyframes promo-float-watch {
    0%, 100% { transform: translateY(0px) rotate(6deg); }
    50%       { transform: translateY(-10px) rotate(6deg); }
  }
  @keyframes promo-line-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes promo-word-up {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes promo-glow-pulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50%       { opacity: 0.85; transform: scale(1.12); }
  }
  @keyframes promo-scan {
    0%   { top: 0%; opacity: 0.7; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes promo-badge-in {
    from { opacity:0; transform: scale(0.5) rotate(-8deg); }
    to   { opacity:1; transform: scale(1) rotate(-4deg); }
  }
  .promo-section {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: #080b0f;
    border-radius: var(--radius-lg, 16px);
    margin-top: 48px;
  }

  /* ── Mobile (≤ 768px): flatten the cinematic stage into a vertical stack ── */
  @media (max-width: 768px) {
    .promo-section {
      height: auto !important;
      min-height: 0 !important;
      padding: 24px 16px 64px !important;
      margin-top: 28px !important;
      border-radius: 14px;
      border: 1px solid rgba(255,255,255,0.06);
    }
    /* Hide non-active scenes entirely on mobile so they don't double the page height */
    .promo-scene { position: relative !important; inset: auto !important;
      display: none !important; opacity: 1 !important;
      flex-direction: column; align-items: stretch !important;
      gap: 18px; pointer-events: auto !important; }
    .promo-scene.is-visible { display: flex !important; }

    /* Reset every absolute child inside a scene back to flow */
    .promo-scene > div {
      position: static !important;
      transform: none !important;
      left: auto !important; right: auto !important;
      top: auto !important; bottom: auto !important;
      max-width: none !important;
      text-align: start !important;
    }
    /* Decorative bg/grid layers — keep behind everything */
    .promo-scene-bg { position: absolute !important; inset: 0 !important; }
    .promo-section svg { display: none !important; }

    /* Image: centered, capped */
    .promo-scene-image { display: flex !important; justify-content: center; align-items: center;
      order: 2; padding: 8px 0; }
    .promo-scene-image img { height: clamp(180px, 46vw, 240px) !important; width: auto !important; max-width: 86% !important; }
    .promo-scene-image, .promo-scene-image > * { animation: none !important; }

    /* Text column on top */
    .promo-scene-text { order: 1; }
    .promo-scene-text > div[style*="font-size: 42"],
    .promo-scene-text .promo-title { font-size: clamp(28px, 7.5vw, 38px) !important; line-height: 1.04 !important; }

    /* Badges become a 2-col grid below image */
    .promo-scene-badges { order: 3;
      display: grid !important; grid-template-columns: repeat(2, 1fr); gap: 8px;
      margin: 0 !important; }
    .promo-scene-badges > div { text-align: start !important; padding: 10px 12px !important; }

    /* Duo scene: stack the two products */
    .promo-scene-duo { display: flex !important; flex-direction: column; gap: 18px; }
    .promo-scene-duo .promo-duo-side { width: 100% !important; flex: none !important; }
    .promo-scene-duo .promo-duo-x { display: none !important; }
    .promo-scene-duo .promo-duo-cta {
      position: static !important; transform: none !important;
      margin-top: 8px;
    }

    /* Section label moves under dots so it stops fighting eyebrow */
    .promo-section .promo-scene-label {
      top: auto !important; right: auto !important;
      bottom: 36px !important; left: 50% !important;
      transform: translateX(-50%) !important;
    }
  }
`;

// inject styles once
if (!document.getElementById('promo-styles')) {
  const s = document.createElement('style');
  s.id = 'promo-styles';
  s.textContent = promoStyles;
  document.head.appendChild(s);
}

const { useState, useEffect, useRef } = React;

// Animated word reveal
function WordReveal({ text, delay = 0, style = {} }) {
  return (
    <span style={{ display:'inline-block', overflow:'hidden', verticalAlign:'bottom', ...style }}>
      <span style={{
        display:'inline-block',
        animation: `promo-word-up 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s both`,
      }}>{text}</span>
    </span>
  );
}

// Scene 1: Watch focus
function SceneWatch({ visible }) {
  return (
    <div className={`promo-scene ${visible?'is-visible':''}`} style={{
      position:'absolute', inset:0,
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s ease',
      pointerEvents: visible ? 'auto' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {/* Background glow */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 60% 50% at 55% 50%, #c49a0055, transparent 70%)',
        animation: visible ? 'promo-glow-pulse 3s ease-in-out infinite' : 'none',
      }}/>

      {/* Grid lines */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }}>
        {[...Array(12)].map((_,i) => (
          <line key={`h${i}`} x1="0" y1={`${(i+1)*8}%`} x2="100%" y2={`${(i+1)*8}%`} stroke="#FFB800" strokeWidth="0.5"/>
        ))}
        {[...Array(16)].map((_,i) => (
          <line key={`v${i}`} x1={`${(i+1)*6.25}%`} y1="0" x2={`${(i+1)*6.25}%`} y2="100%" stroke="#FFB800" strokeWidth="0.5"/>
        ))}
      </svg>

      {/* Watch image */}
      <div className="promo-scene-image" style={{
        position:'relative', zIndex:2,
        animation: visible ? 'promo-float-watch 4s ease-in-out infinite, promo-slide-right 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both' : 'none',
      }}>
        <img
          src="/uploads/file_00000000f98471fdb5a91f41d515c0c7-removebg-preview.png"
          alt="VIKUSHA Watch V70"
          style={{
            height: 340, width:'auto',
            filter:'drop-shadow(0 0 60px #c49a0044) drop-shadow(0 20px 50px rgba(0,0,0,0.7))',
          }}
        />
        {/* Scan line */}
        <div style={{
          position:'absolute', left:0, right:0, height:2,
          background:'linear-gradient(to right, transparent, #FFB800aa, transparent)',
          animation: visible ? 'promo-scan 2.5s linear infinite' : 'none',
          pointerEvents:'none',
        }}/>
      </div>

      {/* Left text column */}
      <div className="promo-scene-text" style={{
        position:'absolute', left:'8%', top:'50%', transform:'translateY(-50%)',
        zIndex:3, maxWidth:220,
      }}>
        <div style={{
          fontFamily:'var(--font-mono, monospace)', fontSize:10, letterSpacing:'0.18em',
          color:'#FFB800', textTransform:'uppercase', marginBottom:12,
          animation: visible ? 'promo-fade-in 0.6s 0.3s both' : 'none',
        }}>Vikusha V70</div>

        <div style={{
          fontFamily:'var(--font-display, serif)', fontSize:42, lineHeight:1.05,
          color:'#f0ede4', fontWeight:400, marginBottom:14,
          letterSpacing:'-0.02em',
        }}>
          {visible && <>
            <WordReveal text="Your" delay={0.4}/>{' '}
            <WordReveal text="wrist." delay={0.55}/><br/>
            <em style={{ color:'#FFB800' }}>
              <WordReveal text="Alive." delay={0.7}/>
            </em>
          </>}
        </div>

        <div style={{
          fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6,
          animation: visible ? 'promo-fade-in 0.7s 1s both' : 'none',
        }}>
          1.43″ AMOLED · NFC<br/>Heart rate · IP67
        </div>

        {/* Divider */}
        <div style={{
          height:1, background:'#FFB800', marginTop:18, transformOrigin:'left',
          animation: visible ? 'promo-line-grow 0.6s cubic-bezier(0.22,1,0.36,1) 1.1s both' : 'none',
        }}/>
        <div style={{
          fontFamily:'var(--font-mono, monospace)', fontSize:11, color:'#FFB800',
          marginTop:10, fontWeight:600, letterSpacing:'0.1em',
          animation: visible ? 'promo-fade-in 0.5s 1.3s both' : 'none',
        }}>JOD 50</div>
      </div>

      {/* Right spec badges */}
      <div className="promo-scene-badges" style={{
        position:'absolute', right:'7%', top:'50%', transform:'translateY(-50%)',
        zIndex:3, display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end',
      }}>
        {[
          { label:'AMOLED', val:'1.43″', delay:0.6 },
          { label:'Battery', val:'300 mAh', delay:0.75 },
          { label:'Water', val:'IP67', delay:0.9 },
          { label:'Sensors', val:'SpO2 · HR', delay:1.05 },
        ].map(b => (
          <div key={b.label} style={{
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:8, padding:'8px 14px', textAlign:'right',
            backdropFilter:'blur(6px)',
            animation: visible ? `promo-slide-right 0.6s cubic-bezier(0.22,1,0.36,1) ${b.delay}s both` : 'none',
          }}>
            <div style={{ fontFamily:'var(--font-mono,monospace)', fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'0.12em', textTransform:'uppercase' }}>{b.label}</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#f0ede4', marginTop:2 }}>{b.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scene 2: Tablet focus
function SceneTablet({ visible }) {
  return (
    <div className={`promo-scene ${visible?'is-visible':''}`} style={{
      position:'absolute', inset:0,
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s ease',
      pointerEvents: visible ? 'auto' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {/* Background glow */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 60% 50% at 45% 50%, #3d180088, transparent 70%)',
        animation: visible ? 'promo-glow-pulse 3.5s ease-in-out infinite' : 'none',
      }}/>

      {/* Dot grid */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.08 }}>
        {[...Array(10)].map((_,row) =>
          [...Array(14)].map((_,col) => (
            <circle key={`${row}-${col}`} cx={`${(col+1)*7}%`} cy={`${(row+1)*10}%`} r="1.2" fill="#FF6B00"/>
          ))
        )}
      </svg>

      {/* Tablet image */}
      <div className="promo-scene-image" style={{
        position:'relative', zIndex:2,
        animation: visible ? 'promo-float 4.5s ease-in-out infinite, promo-slide-left 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both' : 'none',
      }}>
        <img
          src="/uploads/file_00000000ac7c71fdbdf9f307e9b75486-removebg-preview.png"
          alt="VZ-80 Plus Tablet"
          style={{
            height: 320, width:'auto',
            filter:'drop-shadow(0 0 80px #c44a0055) drop-shadow(0 24px 56px rgba(0,0,0,0.8))',
          }}
        />
      </div>

      {/* Right text column */}
      <div className="promo-scene-text" style={{
        position:'absolute', right:'8%', top:'50%', transform:'translateY(-50%)',
        zIndex:3, maxWidth:240, textAlign:'right',
      }}>
        <div style={{
          fontFamily:'var(--font-mono, monospace)', fontSize:10, letterSpacing:'0.18em',
          color:'#FF6B00', textTransform:'uppercase', marginBottom:12,
          animation: visible ? 'promo-fade-in 0.6s 0.3s both' : 'none',
        }}>Vikusha VZ-80 Plus</div>

        <div style={{
          fontFamily:'var(--font-display, serif)', fontSize:42, lineHeight:1.05,
          color:'#f0ede4', fontWeight:400, marginBottom:14,
          letterSpacing:'-0.02em',
        }}>
          {visible && <>
            <WordReveal text="Built" delay={0.4}/>{' '}
            <WordReveal text="for" delay={0.55}/><br/>
            <em style={{ color:'#FF6B00' }}>
              <WordReveal text="the haul." delay={0.7}/>
            </em>
          </>}
        </div>

        <div style={{
          fontSize:12, color:'rgba(255,255,255,0.5)', lineHeight:1.6,
          animation: visible ? 'promo-fade-in 0.7s 1s both' : 'none',
        }}>
          10.95″ 2K · 12+12 GB RAM<br/>8500 mAh · 4G LTE
        </div>

        <div style={{
          height:1, background:'#FF6B00', marginTop:18, transformOrigin:'right',
          animation: visible ? 'promo-line-grow 0.6s cubic-bezier(0.22,1,0.36,1) 1.1s both' : 'none',
        }}/>
        <div style={{
          fontFamily:'var(--font-mono, monospace)', fontSize:11, color:'#FF6B00',
          marginTop:10, fontWeight:600, letterSpacing:'0.1em',
          animation: visible ? 'promo-fade-in 0.5s 1.3s both' : 'none',
        }}>JOD 260</div>
      </div>

      {/* Left spec badges */}
      <div className="promo-scene-badges" style={{
        position:'absolute', left:'7%', top:'50%', transform:'translateY(-50%)',
        zIndex:3, display:'flex', flexDirection:'column', gap:10,
      }}>
        {[
          { label:'Display', val:'10.95″ 2K', delay:0.6 },
          { label:'RAM', val:'12+12 GB', delay:0.75 },
          { label:'Battery', val:'8500 mAh', delay:0.9 },
          { label:'Network', val:'4G LTE', delay:1.05 },
        ].map(b => (
          <div key={b.label} style={{
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:8, padding:'8px 14px',
            backdropFilter:'blur(6px)',
            animation: visible ? `promo-slide-left 0.6s cubic-bezier(0.22,1,0.36,1) ${b.delay}s both` : 'none',
          }}>
            <div style={{ fontFamily:'var(--font-mono,monospace)', fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'0.12em', textTransform:'uppercase' }}>{b.label}</div>
            <div style={{ fontSize:14, fontWeight:600, color:'#f0ede4', marginTop:2 }}>{b.val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scene 3: Both together — Power Duo
function SceneDuo({ visible }) {
  return (
    <div className={`promo-scene promo-scene-duo ${visible?'is-visible':''}`} style={{
      position:'absolute', inset:0,
      opacity: visible ? 1 : 0,
      transition: 'opacity 1s ease',
      pointerEvents: visible ? 'auto' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center', gap:0,
    }}>
      {/* Dual glow */}
      <div style={{
        position:'absolute', inset:0,
        background:'radial-gradient(ellipse 35% 60% at 32% 50%, #c49a0044, transparent 55%), radial-gradient(ellipse 35% 60% at 68% 50%, #3d180055, transparent 55%)',
      }}/>

      {/* Center divider line */}
      <div style={{
        position:'absolute', left:'50%', top:'10%', bottom:'10%', width:1,
        background:'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.12) 70%, transparent)',
        transform:'translateX(-50%)',
        animation: visible ? 'promo-fade-in 0.5s 0.5s both' : 'none',
      }}/>

      {/* Top center tagline */}
      <div style={{
        position:'absolute', top:40, left:0, right:0, textAlign:'center', zIndex:4,
        animation: visible ? 'promo-word-up 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s both' : 'none',
      }}>
        <div style={{
          fontFamily:'var(--font-mono,monospace)', fontSize:10, letterSpacing:'0.22em',
          color:'rgba(255,255,255,0.4)', textTransform:'uppercase',
        }}>Smart Leaders Collection</div>
      </div>

      {/* Watch side */}
      <div className="promo-duo-side" style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        position:'relative', zIndex:2,
      }}>
        <div style={{
          animation: visible ? 'promo-float-watch 4s ease-in-out infinite, promo-slide-left 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both' : 'none',
        }}>
          <img
            src="/uploads/file_00000000f98471fdb5a91f41d515c0c7-removebg-preview.png"
            alt="VIKUSHA Watch V70"
            style={{
              height:260, width:'auto',
              filter:'drop-shadow(0 0 40px #c49a0044) drop-shadow(0 16px 40px rgba(0,0,0,0.7))',
            }}
          />
        </div>
        <div style={{
          marginTop:20, textAlign:'center',
          animation: visible ? 'promo-fade-in 0.7s 0.9s both' : 'none',
        }}>
          <div style={{ fontFamily:'var(--font-display,serif)', fontSize:22, color:'#f0ede4', fontWeight:400 }}>V70 Watch</div>
          <div style={{ fontFamily:'var(--font-mono,monospace)', fontSize:13, color:'#FFB800', marginTop:4, fontWeight:600 }}>JOD 50</div>
        </div>
      </div>

      {/* Center "×" connector */}
      <div style={{
        width:56, height:56, borderRadius:'50%', flexShrink:0,
        border:'1px solid rgba(255,255,255,0.15)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontFamily:'var(--font-mono,monospace)', fontSize:18, color:'rgba(255,255,255,0.3)',
        background:'rgba(255,255,255,0.04)', backdropFilter:'blur(4px)',
        zIndex:5,
        animation: visible ? 'promo-fade-in 0.5s 0.7s both' : 'none',
      }}>×</div>

      {/* Tablet side */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        position:'relative', zIndex:2,
      }}>
        <div style={{
          animation: visible ? 'promo-float 4.5s ease-in-out infinite, promo-slide-right 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s both' : 'none',
        }}>
          <img
            src="/uploads/file_00000000ac7c71fdbdf9f307e9b75486-removebg-preview.png"
            alt="VZ-80 Plus"
            style={{
              height:240, width:'auto',
              filter:'drop-shadow(0 0 50px #c44a0055) drop-shadow(0 16px 40px rgba(0,0,0,0.8))',
            }}
          />
        </div>
        <div style={{
          marginTop:20, textAlign:'center',
          animation: visible ? 'promo-fade-in 0.7s 0.9s both' : 'none',
        }}>
          <div style={{ fontFamily:'var(--font-display,serif)', fontSize:22, color:'#f0ede4', fontWeight:400 }}>VZ-80 Plus</div>
          <div style={{ fontFamily:'var(--font-mono,monospace)', fontSize:13, color:'#FF6B00', marginTop:4, fontWeight:600 }}>JOD 260</div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position:'absolute', bottom:36, left:0, right:0,
        display:'flex', flexDirection:'column', alignItems:'center', gap:14, zIndex:4,
        animation: visible ? 'promo-word-up 0.7s cubic-bezier(0.22,1,0.36,1) 1.1s both' : 'none',
      }}>
        <div style={{
          fontFamily:'var(--font-display,serif)', fontSize:28, color:'#f0ede4',
          letterSpacing:'-0.02em', fontWeight:400, textAlign:'center',
        }}>
          The <em style={{ color:'#d7a528' }}>Smart Leader's</em> Kit
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button
            className="btn btn-sm"
            style={{ background:'#FFB800', color:'#1a1200', borderRadius:999, fontWeight:600, padding:'10px 22px' }}
            onClick={()=>window.navigate('pdp',{id:'v-70'})}
          >Shop Watch</button>
          <button
            className="btn btn-sm"
            style={{ background:'#FF6B00', color:'#fff', borderRadius:999, fontWeight:600, padding:'10px 22px' }}
            onClick={()=>window.navigate('pdp',{id:'vz-80-plus'})}
          >Shop Tablet</button>
        </div>
      </div>
    </div>
  );
}

// Main promo component
function PromoReel({ lang }) {
  const SCENES = ['watch', 'tablet', 'duo'];
  const DURATIONS = [5000, 5000, 6000]; // ms per scene
  const [scene, setScene] = useState(0);
  const timerRef = useRef(null);

  const go = (idx) => {
    clearTimeout(timerRef.current);
    const next = (idx + SCENES.length) % SCENES.length;
    setScene(next);
    timerRef.current = setTimeout(() => go(next + 1), DURATIONS[next]);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => go(1), DURATIONS[0]);
    return () => clearTimeout(timerRef.current);
  }, []);

  const goTo = (idx) => {
    clearTimeout(timerRef.current);
    setScene(idx);
    timerRef.current = setTimeout(() => go(idx + 1), DURATIONS[idx]);
  };

  return (
    <section className="promo-section" style={{ height: 480 }}>
      <SceneWatch   visible={scene === 0} />
      <SceneTablet  visible={scene === 1} />
      <SceneDuo     visible={scene === 2} />

      {/* Scene dots */}
      <div style={{
        position:'absolute', bottom:14, left:'50%', transform:'translateX(-50%)',
        display:'flex', gap:10, zIndex:20,
      }}>
        {SCENES.map((_, i) => (
          <button key={i} onClick={()=>goTo(i)} style={{
            width: i===scene ? 28 : 8, height:8, borderRadius:4,
            background: i===scene ? '#fff' : 'rgba(255,255,255,0.3)',
            border:'none', padding:0, cursor:'pointer',
            transition:'all 0.3s ease',
          }}/>
        ))}
      </div>

      {/* Scene label */}
      <div style={{
        position:'absolute', top:16, right:20, zIndex:20,
        fontFamily:'var(--font-mono,monospace)', fontSize:9,
        color:'rgba(255,255,255,0.25)', letterSpacing:'0.14em', textTransform:'uppercase',
      }}>
        {scene === 0 ? 'Watch' : scene === 1 ? 'Tablet' : 'The Kit'} · {scene+1}/{SCENES.length}
      </div>
    </section>
  );
}

export { PromoReel };
