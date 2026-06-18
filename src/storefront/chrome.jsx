// Header + Footer + Tweaks + Auth + Search dropdown
import React from 'react';
import { Icon, Price, Logo } from './atoms.jsx';
import { Silhouette } from './silhouettes.jsx';
import CurrencySwitcher from './currency-switcher.jsx';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle, Music2 } from 'lucide-react';
const { useState: useStateH, useEffect: useEffectH, useMemo: useMemoH, useRef: useRefH } = React;


function PromoBar({ t, onLangToggle }) {
  return (
    <div className="promo-bar">
      <div className="pb-left" style={{ display:'flex', gap:14, alignItems:'center' }}>
        <Icon name="phone" size={14}/> <span>+962 6 000 0000</span>
      </div>
      <div className="pb-center">{t.promo}</div>
      <div className="pb-right">
        <button onClick={onLangToggle}><Icon name="globe" size={14}/> {t.ar}</button>
      </div>
    </div>
  );
}

function Header({ t, cart, cartBump = 0, onOpenCart, onOpenAuth, onSearch, products, onLangToggle, onSetLang, lang, user, onSignout }) {
  const [q, setQ] = useStateH('');
  const [open, setOpen] = useStateH(false);
  const [navOpen, setNavOpen] = useStateH(false);
  const results = useMemoH(() => {
    if (!q.trim()) return [];
    const qq = q.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(qq) ||
      p.tagline.toLowerCase().includes(qq) ||
      p.brand.includes(qq)
    ).slice(0, 6);
  }, [q, products]);

  const cartCount = cart.reduce((s,i)=>s+i.qty, 0);
  const [bumping, setBumping] = useStateH(false);
  useEffectH(() => {
    if (!cartBump) return;
    setBumping(true);
    const id = setTimeout(() => setBumping(false), 600);
    return () => clearTimeout(id);
  }, [cartBump]);

  // Lock body scroll while drawer open
  useEffectH(() => {
    if (!navOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [navOpen]);

  const goCat = (cat) => { setNavOpen(false); window.navigate('home', { cat }); };

  return (
    <header>
      <div className="header">
        <div className="header-inner">
          <Logo/>
          <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'center', flexWrap:'wrap', minWidth: 0 }}>
            <nav className="nav">
              <a className="nav-link" href="#" onClick={(e)=>{e.preventDefault(); window.navigate('home', {cat:'tablet'});}}>{t.nav_tablets}</a>
              <a className="nav-link" href="#" onClick={(e)=>{e.preventDefault(); window.navigate('home', {cat:'watch'});}}>{t.nav_watches}</a>
            </nav>
            <div className="nav-search" style={{ marginInlineStart: 16 }}>
              <span className="search-icon"><Icon name="search" size={16}/></span>
              <input
                placeholder={t.search_ph}
                value={q}
                onChange={e=>{ setQ(e.target.value); setOpen(true); }}
                onFocus={()=>setOpen(true)}
                onBlur={()=>setTimeout(()=>setOpen(false), 150)}
              />
              {open && q.trim() && (
                <div className="search-dropdown">
                  {results.length === 0 && <div style={{padding:'16px 18px', color:'var(--fg-3)', fontSize:13}}>{t.search_empty}</div>}
                  {results.map(p => (
                    <a key={p.id} href="#" className="search-result" onClick={(e)=>{e.preventDefault(); setQ(''); setOpen(false); window.navigate('pdp', {id: p.id});}}>
                      <div className="search-result-img"><Silhouette product={p}/></div>
                      <div className="search-result-meta">
                        <div className="search-result-name">{p.name}</div>
                        <div className="search-result-cat">{p.brand === 'vikusha' ? 'Vikusha' : 'Teclast'} · {t['cat_'+p.category]}</div>
                      </div>
                      <div className="search-result-price"><Price value={p.price}/></div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="header-right">
            <button className={`icon-btn${bumping ? ' bump' : ''}`} onClick={onOpenCart} aria-label={t.cart}>
              <Icon name="bag"/> <span className="hide-on-mobile">{t.cart}</span>
              {cartCount > 0 && <span key={cartBump} className="count pop">{cartCount}</span>}
            </button>
            <CurrencySwitcher lang={lang}/>
            <div className="lang-toggle" role="group" aria-label="Language">
              <button
                className={lang === 'en' ? 'on' : ''}
                onClick={() => onSetLang ? onSetLang('en') : (lang !== 'en' && onLangToggle?.())}
                aria-pressed={lang === 'en'}
              >EN</button>
              <button
                className={lang === 'ar' ? 'on' : ''}
                onClick={() => onSetLang ? onSetLang('ar') : (lang !== 'ar' && onLangToggle?.())}
                aria-pressed={lang === 'ar'}
              >ع</button>
            </div>

            <button
              className="icon-btn mobile-only"
              onClick={()=>setNavOpen(true)}
              aria-label="Menu"
            >
              <Icon name="menu" size={20}/>
            </button>
          </div>
        </div>
      </div>

      {navOpen && (
        <>
          <div className="mobile-nav-scrim" onClick={()=>setNavOpen(false)}/>
          <aside className="mobile-nav-drawer" role="dialog" aria-label="Menu">
            <div className="mobile-nav-head">
              <span className="mobile-nav-title">{t.nav_brands || 'Menu'}</span>
              <button className="icon-btn" onClick={()=>setNavOpen(false)} aria-label="Close">
                <Icon name="close" size={18}/>
              </button>
            </div>
            <nav className="mobile-nav-links">
              <a href="#" className="mobile-nav-link" onClick={(e)=>{e.preventDefault(); goCat('tablet');}}>{t.nav_tablets}</a>
              <a href="#" className="mobile-nav-link" onClick={(e)=>{e.preventDefault(); goCat('watch');}}>{t.nav_watches}</a>
              <a href="#" className="mobile-nav-link" onClick={(e)=>{e.preventDefault(); goCat('accessory');}}>{t.nav_accessories}</a>
            </nav>
            <div className="mobile-nav-divider"/>
            {lang !== 'ar' && (
              <button
                className="mobile-nav-link mobile-nav-row"
                onClick={()=>{ setNavOpen(false); onLangToggle?.(); }}
              >
                <Icon name="globe" size={16}/> <span>{t.ar}</span>
              </button>
            )}
            <a
              href="#"
              className="mobile-nav-link mobile-nav-row"
              onClick={(e)=>{ e.preventDefault(); setNavOpen(false); window.navigate?.('home'); setTimeout(()=>{ const el = document.querySelector('.footer'); el?.scrollIntoView({behavior:'smooth'}); }, 50); }}
            >
              <Icon name="phone" size={16}/> <span>{t.footer_contact}</span>
            </a>
          </aside>
        </>
      )}
    </header>
  );
}
export { Header };

function Footer({ t, lang }) {
  const isAr = lang === 'ar';
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div style={{ marginBottom: 20 }}>
            <Logo/>
          </div>
          <p className="footer-about">{isAr ? 'الموزع الرسمي لفيكوشا وتيكلاست في الأردن. أجهزة لوحية، ساعات ذكية، طاقة وملحقات — مدعومة بشبكة خدمة على مستوى الأردن.' : 'Official distributor for Vikusha and Teclast in Jordan. Tablets, smartwatches, power and accessories — backed by a Jordan-wide service network.'}</p>

          <div className="footer-social" aria-label={isAr ? 'وسائل التواصل' : 'Social'}>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={16}/></a>
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={16}/></a>
            <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><Music2 size={16}/></a>
            <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={16}/></a>
            <a href="https://wa.me/962797772455" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><MessageCircle size={16}/></a>
          </div>
        </div>

        <div>
          <h5>{isAr ? 'الدعم' : 'Support'}</h5>
          <div className="footer-section">
            <div className="footer-section-title">{isAr ? 'تواصل معنا' : 'Contact us'}</div>
            <a href="tel:0797772455"><Phone size={14}/> {isAr ? 'رقم التلفون - 0797772455' : 'Phone: 0797772455'}</a>
            <a href="https://wa.me/962797772455" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14}/> {isAr ? 'الواتس اب 0797772455' : 'WhatsApp: 0797772455'}
            </a>
            <a href="mailto:osama-amreen@vikusha-jo.com"><Mail size={14}/> osama-amreen@vikusha-jo.com</a>
          </div>
        </div>

        <div>
          <h5>{isAr ? 'ساعات العمل' : 'Working hours'}</h5>
          <div className="footer-section">
            <span>{isAr ? 'السبت - الخميس 10-10' : 'Sat - Thu 10-10'}</span>
            <span>{isAr ? 'الجمعه 2 - 8' : 'Fri 2 - 8'}</span>
          </div>
        </div>

        <div>
          <h5>{isAr ? 'العنوان' : 'Address'}</h5>
          <div className="footer-section">
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, color:'rgba(255,255,255,0.92)', lineHeight:1.6 }}>
              <MapPin size={14}/> {isAr ? 'الجاردنز شارع وصفي التل - مجمع رياض التجاري 124' : 'Gardens Wasfi Al-Tal St - Riyad Commercial Complex 124'}
            </span>
          </div>
        </div>
      </div>

      <div className="footer-payments">
        <div className="footer-payments-label">{isAr ? 'طرق الدفع المتاحة' : 'We accept'}</div>
        <div className="footer-payments-list" aria-label={isAr ? 'طرق الدفع' : 'Payment methods'}>
          <span className="pay-badge pay-cod">{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
          <span className="pay-badge"><svg viewBox="0 0 48 32" width="38" height="22" aria-label="Visa"><rect width="48" height="32" rx="4" fill="#1a1f71"/><text x="24" y="21" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="12" fill="#fff" fontStyle="italic" fontWeight="900">VISA</text></svg></span>
          <span className="pay-badge"><svg viewBox="0 0 48 32" width="38" height="22" aria-label="Mastercard"><rect width="48" height="32" rx="4" fill="#fff" stroke="#e4e4de"/><circle cx="20" cy="16" r="8" fill="#eb001b"/><circle cx="28" cy="16" r="8" fill="#f79e1b" fillOpacity=".9"/></svg></span>
          <span className="pay-badge"><svg viewBox="0 0 48 32" width="38" height="22" aria-label="Apple Pay"><rect width="48" height="32" rx="4" fill="#000"/><text x="24" y="21" textAnchor="middle" fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fill="#fff" fontWeight="600"> Pay</text></svg></span>
          <span className="pay-badge">{isAr ? 'كليك' : 'CliQ'}</span>
        </div>
      </div>

      <div className="footer-bottom">
        <div>{t.footer_rights}</div>
        <div>
          Amman · Jordan · {isAr ? 'تأسست ٢٠١٨' : 'Est. 2018'}
          <a
            href="/auth"
            style={{ marginInlineStart: 12, opacity: 0.4, fontSize: 12 }}
            title="Admin"
          >
            {isAr ? 'الإدارة' : 'Admin'}
          </a>
        </div>
      </div>
    </footer>
  );
}
export { Footer };

function TweaksPanel({ lang, setLang, dir, setDir, theme, setTheme, t, onClose }) {
  return (
    <div className="tweaks">
      <h4>{t.tweaks} <button onClick={onClose} style={{color:'var(--fg-3)'}}><Icon name="close" size={16}/></button></h4>
      <div className="tweak-row">
        <span>{t.language}</span>
        <div className="seg">
          <button className={lang==='en'?'on':''} onClick={()=>setLang('en')}>EN</button>
          <button className={lang==='ar'?'on':''} onClick={()=>setLang('ar')}>AR</button>
        </div>
      </div>
      <div className="tweak-row">
        <span>{t.direction}</span>
        <div className="seg">
          <button className={dir==='ltr'?'on':''} onClick={()=>setDir('ltr')}>{t.ltr}</button>
          <button className={dir==='rtl'?'on':''} onClick={()=>setDir('rtl')}>{t.rtl}</button>
        </div>
      </div>
      <div className="tweak-row">
        <span>{t.theme}</span>
        <div className="seg">
          <button className={theme==='light'?'on':''} onClick={()=>setTheme('light')}>{t.light}</button>
          <button className={theme==='dark'?'on':''} onClick={()=>setTheme('dark')}>{t.dark}</button>
        </div>
      </div>
    </div>
  );
}
export { TweaksPanel };

function AuthModal({ t, onClose, onSignin, lang = 'en' }) {
  const [mode, setMode] = useStateH('signin');
  const [name, setName] = useStateH('');
  const [email, setEmail] = useStateH('');

  const submit = (e) => {
    e.preventDefault();
    const finalName = mode === 'signup' ? name : (email.split('@')[0] || 'Customer');
    onSignin({ name: finalName, email: email || 'demo@smartleaders.jo' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="auth-modal" onClick={e=>e.stopPropagation()}>
        <h3>{mode==='signin' ? t.login_title : t.signup_title}</h3>
        <p>{t.login_sub}</p>
        <form onSubmit={submit}>
          {mode === 'signup' && (
            <div className="field"><label>{t.signup_name}</label><input value={name} onChange={e=>setName(e.target.value)} required/></div>
          )}
          <div className="field"><label>{t.login_email}</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div>
          <div className="field"><label>{t.login_pass}</label><input type="password" defaultValue="demo1234"/></div>
          <button type="submit" className="btn btn-green btn-block btn-lg">{mode==='signin' ? t.login_btn : t.signup_btn}</button>
        </form>
        <div className="alt">
          {mode==='signin' ? (
            <>{t.login_alt || (lang==='ar' ? 'جديد هنا؟' : 'New here?')} <a onClick={()=>setMode('signup')}>{lang==='ar' ? 'أنشئ حساباً' : 'Create account'}</a></>
          ) : (
            <>{lang==='ar' ? 'لديك حساب؟' : 'Have an account?'} <a onClick={()=>setMode('signin')}>{lang==='ar' ? 'تسجيل الدخول' : 'Sign in'}</a></>
          )}
        </div>
      </div>
    </div>
  );
}
export { AuthModal };
