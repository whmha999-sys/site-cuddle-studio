// Product Detail Page
import React from 'react';
import { Icon, Price, Stars } from './atoms.jsx';
import { Silhouette, ColorDot } from './silhouettes.jsx';
import { ProductCard } from './home.jsx';
import { PRODUCT_IMAGES } from './data.js';
import { ProductShowcase } from './product-showcase.jsx';
import ProductShowcaseCard from '@/components/ui/product-showcase-card';
import PdpStickyBar from './pdp-sticky-bar.jsx';


export function PDP({ t, product, onAddToCart, onBuyNow, products, lang, onNavigate }) {
  const nav = onNavigate || ((p, params) => window.navigate?.(p, params));
  const [color, setColor] = React.useState(product.colors[0]);
  const [qty, setQty] = React.useState(1);
  const [thumb, setThumb] = React.useState(0);

  const realImgs = PRODUCT_IMAGES?.[product.id]?.[color] || null;

  React.useEffect(()=>{
    setColor(product.colors[0]);
    setQty(1);
    setThumb(0);
    window.scrollTo(0,0);
  }, [product.id]);

  // Reset thumb index when color changes
  React.useEffect(()=>{ setThumb(0); }, [color]);

  const [generalSpecs, detailSpecs] = React.useMemo(() => {
    const entries = Object.entries(product.specs);
    const half = Math.ceil(entries.length / 2);
    return [entries.slice(0, half), entries.slice(half)];
  }, [product]);

  const similar = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);
  const brandLabel = product.brand === 'vikusha' ? 'Vikusha' : 'Teclast';

  return (
    <>
      <nav className="breadcrumb">
        <a href="#" onClick={(e)=>{e.preventDefault(); nav('home');}}>{lang==='ar'?'الرئيسية':'Home'}</a>
        <span className="sep">/</span>
        <a href="#" onClick={(e)=>{e.preventDefault(); nav('home',{cat:product.category});}}>{t['cat_'+product.category]}s</a>
        <span className="sep">/</span>
        <a href="#" onClick={(e)=>{e.preventDefault(); nav('home',{brand:product.brand});}}>{brandLabel}</a>
        <span className="sep">/</span>
        <span className="current">{product.name}</span>
      </nav>

      {realImgs && (
        <ProductShowcase
          product={product}
          color={color}
          lang={lang}
          t={t}
          onViewSpecs={() => {
            document.querySelector('.specs-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      )}

      <section className="pdp">

        {!realImgs && (
        <div className="pdp-gallery">

          <div className="pdp-main-img">
            <Silhouette product={product} color={color}/>
          </div>
          <div className="pdp-thumbs">
            {(product.colors.length >= 4 ? product.colors : [...product.colors, ...product.colors, ...product.colors, ...product.colors]).slice(0,4).map((c,i) => (
              <div key={i} className={`pdp-thumb ${thumb===i?'active':''}`} onClick={()=>{ setThumb(i); if(product.colors[i]) setColor(product.colors[i]); }}>
                <Silhouette product={product} color={product.colors[i] || c}/>
              </div>
            ))}
          </div>
        </div>
        )}


        <div className="pdp-info">
          <h1 className="pdp-title">{product.name}</h1>

          <div className="pdp-price"><Price value={product.price}/></div>

          {product.colors.length > 1 && (
            <div className="pdp-field">
              <div className="pdp-field-label">{t.color} — <b style={{color:'var(--fg)', textTransform:'capitalize'}}>{color}</b></div>
              <div className="pdp-colors">
                {product.colors.map(c => (
                  <ColorDot key={c} color={c} selected={color===c} onClick={()=>{ setColor(c); const i = product.colors.indexOf(c); if(i>=0) setThumb(i); }} size={32}/>
                ))}
              </div>
            </div>
          )}

          <div className="pdp-field">
            <div className="pdp-field-label">{t.quantity}</div>
            <div className="qty">
              <button onClick={()=>setQty(Math.max(1, qty-1))}>−</button>
              <span>{qty}</span>
              <button onClick={()=>setQty(qty+1)}>+</button>
            </div>
          </div>

          <div className="pdp-ctas">
            <button className="btn btn-green btn-lg" onClick={()=>onBuyNow(product, color, qty)}>{t.buy_now}</button>
            <button className="btn btn-outline btn-lg" onClick={()=>onAddToCart(product, color, qty)}>{t.add_to_cart}</button>
          </div>

        </div>
      </section>



      <section className="specs-section">
        <h3 className="specs-title">{product.name} — {t.specs}</h3>
        <div className="specs-grid">
          <div className="specs-card">
            <h4>{lang==='ar'?'عام':'General'}</h4>
            <table className="spec-table">
              <tbody>
                {generalSpecs.map(([k,v])=>(
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
                <tr><th>{lang==='ar'?'العلامة':'Brand'}</th><td>{brandLabel}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="specs-card">
            <h4>{lang==='ar'?'التفاصيل':'Product details'}</h4>
            <table className="spec-table">
              <tbody>
                {detailSpecs.map(([k,v])=>(
                  <tr key={k}><th>{k}</th><td>{v}</td></tr>
                ))}
                <tr><th>SKU</th><td style={{fontFamily:'var(--font-mono)'}}>{product.id.toUpperCase()}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section style={{ marginTop: 72 }}>
          <div className="section-head"><h2>{lang==='ar'?'منتجات مشابهة':'Similar items'}</h2></div>
          <div className="grid">
            {similar.map(p => (
              <ProductCard
                key={p.id} p={p} t={t}
                inCart={false}
                onAdd={(prod,c)=>onAddToCart(prod,c,1)}
                onOpen={(prod)=>nav('pdp',{id:prod.id})}
              />
            ))}
          </div>
        </section>
      )}

      {(product.id === 'vz-80-plus' || product.id === 'vz-70' || product.id === 'vz-60-4g' || product.id === 'vz-30-pro-4g' || product.id === 'vn-7-kids' || product.id === 'v-70') && (
        <section style={{ marginTop: 48, display:'flex', justifyContent:'center' }}>
          <div style={{ width:'100%', maxWidth: 900, aspectRatio:'16 / 9', borderRadius: 12, overflow:'hidden', boxShadow:'0 8px 30px rgba(0,0,0,0.15)' }}>
            <iframe
              src={product.id === 'vz-80-plus' ? 'https://www.youtube.com/embed/2MaWT7_jjeg' : product.id === 'vz-70' ? 'https://www.youtube.com/embed/AEQFdvcYt0A' : product.id === 'vz-60-4g' ? 'https://www.youtube.com/embed/YIuv1YCkiAQ' : product.id === 'vz-30-pro-4g' ? 'https://www.youtube.com/embed/AlhPo-wxnWg' : product.id === 'v-70' ? 'https://www.youtube.com/embed/ULd-4eXI-yM' : 'https://www.youtube.com/embed/JCeSEW6wyc4'}
              title={product.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ width:'100%', height:'100%', border:0, display:'block' }}
            />
          </div>
        </section>
      )}

      {product.id === 'vz-80-plus' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[1,2,3,4,5,7,8,9,10,11,12].map(n => (
            <img
              key={n}
              src={`/uploads/vz80-feature-${n}.webp`}
              alt={`VZ-80 PLUS feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'vz-70' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[1,2,3,4,8,9,10,11].map(n => (
            <img
              key={n}
              src={`/uploads/vz70-feature-${n}.webp`}
              alt={`VZ-70 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'vz-60-4g' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {['1','4','4b','5','6','7','8','10','10b','11','12','12b','13'].map(n => (
            <img
              key={n}
              src={`/uploads/vz60-feature-${n}.webp`}
              alt={`VZ-60 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'vz-30-pro-4g' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <img
              key={n}
              src={`/uploads/vz30-feature-${n}.webp`}
              alt={`VZ-30 PRO feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
          <img
            src="/uploads/vz30-parameters.webp"
            alt="VZ-30 PRO product parameters"
            loading="lazy"
            style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
          />
        </section>
      )}

      {product.id === 'v-m1' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[1,2,3,4,5,6,7,8,9,10].map(n => (
            <img
              key={n}
              src={`/uploads/vm1-feature-${n}.webp`}
              alt={`V-M1 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
          <img
            src="/uploads/vm1-parameters.webp"
            alt="V-M1 product parameters"
            loading="lazy"
            style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
          />
        </section>
      )}

      {product.id === 'vn-7-kids' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          <img
            src="/uploads/vn7-feature-main.webp"
            alt="V-N7 Kids hero"
            loading="lazy"
            style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
          />
          {[1,2,3,4,5,6,7,8].map(n => (
            <img
              key={n}
              src={`/uploads/vn7-feature-${n}.webp`}
              alt={`V-N7 Kids feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
          <img
            src="/uploads/vn7-parameters.webp"
            alt="V-N7 Kids product parameters"
            loading="lazy"
            style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
          />
        </section>
      )}

      {product.id === 'teclast-t65' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {['01','02','03','04','05','06','07','08','09','10','11','12','13','14b','14','15','16','17','18','19','20','21'].map(n => (
            <img
              key={n}
              src={`/uploads/t65-feature-${n}.webp`}
              alt={`Teclast T65 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'teclast-p30t' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {['00','01','02','04','05','06','07','08','09-1','09-2','09-3','09-4','09-5','09-6','09-7','11','12','13','14','15','16'].map(n => (
            <img
              key={n}
              src={`/uploads/p30t-feature-${n}.webp`}
              alt={`Teclast P30T feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'teclast-p50' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {['01','03','04','02','1-02','14','15','1-15','2-01','16','1-05','07','08','2-02','06','13','1-09','11','1-10','1-12','2-03','2-04','2-05','2-06'].map(n => (
            <img
              key={n}
              src={`/uploads/p50-feature-${n}.webp`}
              alt={`Teclast P50 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'v-70' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map(n => (
            <img
              key={n}
              src={`/uploads/v70-feature-${n}.webp`}
              alt={`V-70 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'usb-type-c-66w' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[0,1,2,4,3].map(n => (
            <img
              key={n}
              src={`/uploads/usb-typec-66w-marketing-${n}.webp`}
              alt={`USB Type-C 66W feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'type-c-66w' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[0,1,2,3,4].map(n => (
            <img
              key={n}
              src={`/uploads/ctc66w-marketing-${n}.webp`}
              alt={`Type-C Cable 66W feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'p200' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {[1,2,3,4,5,6,7,8].map(n => (
            <img
              key={n}
              src={`/uploads/p200-feature-${n}.webp`}
              alt={`Power Bank P200 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'p110' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          <video
            src="/uploads/p110-video.mp4"
            autoPlay muted loop playsInline
            style={{ width:'100%', maxWidth: 900, height:'auto', display:'block', borderRadius: 12 }}
          />
          {[1,2,3,4,5,6,7,8].map(n => (
            <img
              key={n}
              src={`/uploads/p110-feature-${n}.webp`}
              alt={`Power Bank P110 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'p20' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          <video
            src="/uploads/p20-video.mp4"
            autoPlay muted loop playsInline
            style={{ width:'100%', maxWidth: 900, height:'auto', display:'block', borderRadius: 12 }}
          />
          {[1,2,3,4,5,6,7,8].map(n => (
            <img
              key={n}
              src={`/uploads/p20-feature-${n}.webp`}
              alt={`Power Bank P20 feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
        </section>
      )}

      {product.id === 'vb-1-4g' && (
        <section style={{ marginTop: 72, display:'flex', flexDirection:'column', alignItems:'center', gap: 0 }}>
          {['02','04','06','08','10','12','14','16','18','20','22','24','25'].map(n => (
            <img
              key={n}
              src={`/uploads/vb1-feature-${n}.webp`}
              alt={`VB-1 4G feature ${n}`}
              loading="lazy"
              style={{ width:'100%', maxWidth: 900, height:'auto', display:'block' }}
            />
          ))}
          <div style={{ width:'100%', maxWidth: 900, marginTop: 32 }}>
            <div style={{ position:'relative', width:'100%', paddingBottom:'56.25%', height: 0, overflow:'hidden', borderRadius: 12, background:'#000' }}>
              <iframe
                src="https://www.youtube.com/embed/VdABDlWDuFs"
                title="VB-1 4G Kids Watch"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position:'absolute', top:0, left:0, width:'100%', height:'100%' }}
              />
            </div>
          </div>
        </section>
      )}
      <PdpStickyBar
        product={product}
        color={color}
        qty={qty}
        t={t}
        lang={lang}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />
    </>
  );
}

export default PDP;
