// Smart Leaders storefront — root app (ported from Smart_Leaders_Storefront.html)
import React, { useEffect, useState } from 'react';
import './styles.css';

import { CATALOG, I18N, syncCatalogFromDb } from './data.js';
import { Header, Footer, AuthModal, TweaksPanel } from './chrome.jsx';
import { Home } from './home.jsx';
import { PDP } from './pdp.jsx';
import { useCatalog } from '@/hooks/useCatalog';

export default function StorefrontApp() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sl_cart') || '[]'); } catch { return []; }
  });
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sl_user') || 'null'); } catch { return null; }
  });
  const [lang, setLang] = useState(() => localStorage.getItem('sl_lang') || 'en');
  const [dir, setDir]   = useState(() => localStorage.getItem('sl_dir') || 'ltr');
  const [theme, setTheme] = useState(() => localStorage.getItem('sl_theme') || 'light');

  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [route, setRoute] = useState({ name: 'home', params: {} });

  const t = I18N[lang];

  // Sync DB catalog into in-memory CATALOG/PRODUCT_IMAGES so all child
  // components (which import these directly) see the latest data.
  const { data: dbCat } = useCatalog();
  const [catalog, setCatalog] = useState(CATALOG);
  useEffect(() => {
    if (dbCat) {
      syncCatalogFromDb(dbCat.catalog, dbCat.images);
      setCatalog([...CATALOG]); // new reference triggers useMemo in Home
    }
  }, [dbCat]);

  const navigate = React.useCallback((page, params = {}) => {
    setRoute({ name: page || 'home', params: params || {} });
    window.__routeParams = params;
    window.scrollTo(0, 0);
  }, []);

  // Expose navigate globally for in-component links that use window.navigate(...)
  useEffect(() => {
    window.navigate = navigate;
    return () => { try { delete window.navigate; } catch {} };
  }, [navigate]);

  // Persist
  useEffect(() => { localStorage.setItem('sl_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    if (user) localStorage.setItem('sl_user', JSON.stringify(user));
    else localStorage.removeItem('sl_user');
  }, [user]);
  useEffect(() => { localStorage.setItem('sl_lang', lang); }, [lang]);
  useEffect(() => {
    localStorage.setItem('sl_dir', dir);
    document.documentElement.dir = dir;
  }, [dir]);
  useEffect(() => {
    localStorage.setItem('sl_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Auto RTL on Arabic
  useEffect(() => {
    if (lang === 'ar' && dir === 'ltr') setDir('rtl');
    if (lang === 'en' && dir === 'rtl') setDir('ltr');
  }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cart ops
  const addToCart = (product, color, qty = 1) => {
    setCart(prev => {
      const i = prev.findIndex(x => x.id === product.id && x.color === color);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { id: product.id, color, qty, price: product.price }];
    });
    setCartOpen(true);
  };

  const buyNow = (product, color, qty = 1) => {
    addToCart(product, color, qty);
  };

  const currentProduct = route.name === 'pdp'
    ? CATALOG.find(p => p.id === route.params?.id)
    : null;

  return (
    <>
      <Header
        t={t}
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        products={CATALOG}
        onLangToggle={() => setLang(lang === 'en' ? 'ar' : 'en')}
        user={user}
        onSignout={() => setUser(null)}
      />

      <main className="page">
        {route.name === 'pdp' && currentProduct ? (
          <PDP
            t={t}
            lang={lang}
            product={currentProduct}
            products={CATALOG}
            onAddToCart={addToCart}
            onBuyNow={buyNow}
            onNavigate={navigate}
          />
        ) : (
          <Home
            t={t}
            products={CATALOG}
            onAddToCart={addToCart}
            cart={cart}
            lang={lang}
          />
        )}
      </main>

      <Footer t={t} lang={lang} />

      {authOpen && (
        <AuthModal
          t={t}
          lang={lang}
          onClose={() => setAuthOpen(false)}
          onSignin={(u) => { setUser(u); setAuthOpen(false); }}
        />
      )}

      {tweaksOpen && (
        <TweaksPanel
          lang={lang} setLang={setLang}
          dir={dir} setDir={setDir}
          theme={theme} setTheme={setTheme}
          t={t}
          onClose={() => setTweaksOpen(false)}
        />
      )}

      {/* Tiny floating button to open the Tweaks panel (lang/dir/theme) */}
      <button
        onClick={() => setTweaksOpen(true)}
        aria-label="Open tweaks"
        style={{
          position: 'fixed', bottom: 16, insetInlineEnd: 16, zIndex: 50,
          width: 40, height: 40, borderRadius: 999,
          background: '#1a3c2e', color: '#fff', border: 'none',
          boxShadow: '0 6px 16px rgba(0,0,0,0.18)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono, monospace)', fontSize: 12, letterSpacing: '0.08em',
        }}
        title="Language · Theme"
      >
        {lang === 'en' ? 'AR' : 'EN'}
      </button>

      {/* Cart drawer + Checkout + PDP routes are not wired in this build. */}
      {cartOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setCartOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: 32, maxWidth: 420, width: '90%',
              fontFamily: 'var(--font-sans, Inter)',
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 8 }}>{t.cart} ({cart.reduce((s,i)=>s+i.qty,0)})</h3>
            {cart.length === 0 ? (
              <p style={{ color: '#777', fontSize: 14 }}>{t.empty_cart}</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0' }}>
                {cart.map((item, idx) => {
                  const p = CATALOG.find(x => x.id === item.id);
                  return (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                      <span>{p?.name || item.id} × {item.qty}</span>
                      <span>JOD {(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
            )}
            <button
              onClick={() => setCartOpen(false)}
              style={{ marginTop: 12, width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#1a3c2e', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
            >{t.continue}</button>
          </div>
        </div>
      )}
    </>
  );
}
