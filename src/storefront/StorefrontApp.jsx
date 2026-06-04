// Smart Leaders storefront — root app (ported from Smart_Leaders_Storefront.html)
import React, { useEffect, useState } from 'react';
import { useNavigate as useRouterNavigate, useLocation, useParams } from 'react-router-dom';
import './styles.css';

import { CATALOG, I18N, syncCatalogFromDb, imageVersion } from './data.js';
import { Header, Footer, AuthModal, TweaksPanel } from './chrome.jsx';
import { Home } from './home.jsx';
import { PDP } from './pdp.jsx';
import { INFO_PAGES } from './info-pages.jsx';
import { useCatalog } from '@/hooks/useCatalog';
import BackToTop from './back-to-top.jsx';
import WhatsAppFab from './whatsapp-fab.jsx';
import { CurrencyProvider, useCurrency } from './currency-context.jsx';
import { Checkout, SuccessModal } from './checkout.jsx';

function CartLinePrice({ value }) {
  const { formatPrice } = useCurrency();
  return <span>{formatPrice(value)}</span>;
}


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
  const [cartView, setCartView] = useState('cart'); // 'cart' | 'checkout' | 'success'
  const [lastOrder, setLastOrder] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [cartBump, setCartBump] = useState(0);

  const t = I18N[lang];

  // Derive current route from URL
  const routerNavigate = useRouterNavigate();
  const location = useLocation();
  const params = useParams();

  const route = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/product/')) {
      return { name: 'pdp', params: { id: params.id } };
    }
    if (path === '/checkout') return { name: 'checkout', params: {} };
    if (path.startsWith('/p/')) return { name: params.slug, params: {} };
    return { name: 'home', params: {} };
  }, [location.pathname, params.id, params.slug]);

  // Sync DB catalog into in-memory CATALOG/PRODUCT_IMAGES so all child
  // components (which import these directly) see the latest data.
  const { data: dbCat } = useCatalog();
  const [catalog, setCatalog] = useState(CATALOG);
  const [imgVersion, setImgVersion] = useState(0);
  useEffect(() => {
    if (dbCat) {
      syncCatalogFromDb(dbCat.catalog, dbCat.images);
      setCatalog([...CATALOG]); // new reference triggers useMemo in Home
      setImgVersion(imageVersion);
    }
  }, [dbCat]);

  const navigate = React.useCallback((page, params = {}) => {
    const p = page || 'home';
    let url = '/';
    if (p === 'home') url = '/';
    else if (p === 'pdp') url = `/product/${params.id}`;
    else if (p === 'checkout') url = '/checkout';
    else if (INFO_PAGES[p]) url = `/p/${p}`;
    else url = '/';
    window.__routeParams = params;
    routerNavigate(url);
    window.scrollTo(0, 0);
  }, [routerNavigate]);

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
    setCartBump(b => b + 1);
    setCartOpen(true);
  };

  const buyNow = (product, color, qty = 1) => {
    addToCart(product, color, qty);
  };

  const currentProduct = route.name === 'pdp'
    ? catalog.find(p => p.id === route.params?.id)
    : null;

  return (
    <CurrencyProvider>
    <>
      <Header
        t={t}

        cart={cart}
        cartBump={cartBump}
        onOpenCart={() => setCartOpen(true)}
        onOpenAuth={() => setAuthOpen(true)}
        products={catalog}
        lang={lang}
        onLangToggle={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        onSetLang={setLang}
        user={user}
        onSignout={() => setUser(null)}
      />

      <main className="page">
        <div key={route.name + ':' + (route.params?.id || route.params?.cat || '')} className="page-transition">
        {(() => {
          const InfoPage = INFO_PAGES[route.name];
          if (InfoPage) return <InfoPage lang={lang} />;
          if (route.name === 'checkout') {
            return (
              <Checkout
                t={t}
                lang={lang}
                cart={cart}
                user={user}
                onComplete={(order) => {
                  setLastOrder(order);
                  setCart([]);
                  setCartView('success');
                  setCartOpen(true);
                }}
              />
            );
          }
          if (route.name === 'pdp' && currentProduct) {
            return (
              <PDP
                t={t}
                lang={lang}
                product={currentProduct}
                products={catalog}
                onAddToCart={addToCart}
                onBuyNow={buyNow}
                onNavigate={navigate}
              />
            );
          }
          return (
            <Home
              t={t}
              products={catalog}
              onAddToCart={addToCart}
              cart={cart}
              lang={lang}
              imgVersion={imgVersion}
              onNavigate={navigate}
            />
          );
        })()}
        </div>
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

      <BackToTop />
      <WhatsAppFab lang={lang} />


      {/* Cart drawer + Checkout + PDP routes are not wired in this build. */}
      {cartOpen && (
        <div
          className="modal-backdrop"
          onClick={() => { setCartOpen(false); setCartView('cart'); }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 100,
            overflowY: 'auto', padding: '40px 16px',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff', borderRadius: 16, padding: 32,
              maxWidth: cartView === 'cart' ? 420 : 760, width: '100%',
              fontFamily: 'var(--font-sans, Inter)',
            }}
          >
            {cartView === 'success' && lastOrder && (
              <SuccessModal
                order={lastOrder}
                t={t}
                lang={lang}
                onClose={() => { setCartOpen(false); setCartView('cart'); setLastOrder(null); }}
              />
            )}




            {cartView === 'cart' && (
              <>
                <h3 style={{ margin: 0, marginBottom: 8 }}>{t.cart} ({cart.reduce((s,i)=>s+i.qty,0)})</h3>
                {cart.length === 0 ? (
                  <>
                    <p style={{ color: '#777', fontSize: 14 }}>{t.empty_cart}</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      style={{ marginTop: 12, width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: '#1a3c2e', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                    >{t.continue}</button>
                  </>
                ) : (
                  <>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0' }}>
                      {cart.map((item, idx) => {
                        const p = catalog.find(x => x.id === item.id);
                        return (
                          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
                            <span>{p?.name || item.id} × {item.qty}</span>
                            <CartLinePrice value={item.price * item.qty}/>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      onClick={() => { setCartOpen(false); navigate('checkout'); }}
                      style={{ marginTop: 12, width: '100%', padding: '12px 16px', borderRadius: 8, border: 'none', background: '#e8590c', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}
                    >{lang === 'ar' ? 'إتمام الطلب (الدفع عند الاستلام)' : 'Proceed to Checkout (Cash on Delivery)'}</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
    </CurrencyProvider>
  );

}
