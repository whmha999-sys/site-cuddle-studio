// Header + Footer + Tweaks + Auth + Search dropdown
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

function Header({ t, cart, onOpenCart, onOpenAuth, onSearch, products, onLangToggle, user, onSignout }) {
  const [q, setQ] = useStateH('');
  const [open, setOpen] = useStateH(false);
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

  return (
    <header>
      <PromoBar t={t} onLangToggle={onLangToggle} />
      <div className="header">
        <div className="header-inner">
          <Logo/>
          <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'center', flexWrap:'wrap' }}>
            <nav className="nav">
              <a className="nav-link" href="VIKUSHA Tablets.html">{t.nav_tablets}</a>
              <a className="nav-link" href="#" onClick={(e)=>{e.preventDefault(); window.navigate('home', {cat:'watch'});}}>{t.nav_watches}</a>
              <a className="nav-link" href="#" onClick={(e)=>{e.preventDefault(); window.navigate('home', {cat:'accessory'});}}>{t.nav_accessories}</a>
              <a className="nav-link" href="#" onClick={(e)=>{e.preventDefault(); window.navigate('home');}}>{t.nav_brands}</a>
              <a className="nav-link" href="#">{t.nav_support}</a>
            </nav>
            <div className="nav-search" style={{ marginInlineStart: 16, width: 320 }}>
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
            {user ? (
              <button className="icon-btn" onClick={onSignout}>
                <Icon name="user"/> <span>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button className="icon-btn" onClick={onOpenAuth}>
                <Icon name="user"/> <span>{t.signin}</span>
              </button>
            )}
            <button className="icon-btn" onClick={onOpenCart}>
              <Icon name="bag"/> <span>{t.cart}</span>
              {cartCount > 0 && <span className="count">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
window.Header = Header;

function Footer({ t, lang }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <div className="stamp">
            <div className="stamp-mark">
              <div>SMART<br/>LEADERS<br/>CO.</div>
            </div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:'#f0ede2', marginBottom: 4 }}>Smart Leaders Co.</div>
              <div style={{ color:'#8a948e', fontSize: 12, fontFamily:'var(--font-mono)', letterSpacing:'0.08em' }}>MOBILE TRADING · JORDAN</div>
            </div>
          </div>
          <p className="footer-about">{lang === 'ar' ? 'الموزع الرسمي لفيكوشا وتيكلاست في الأردن. أجهزة لوحية، ساعات ذكية، طاقة وملحقات — مدعومة بشبكة خدمة على مستوى الأردن.' : 'Official distributor for Vikusha and Teclast in Jordan. Tablets, smartwatches, power and accessories — backed by a Jordan-wide service network.'}</p>
        </div>
        <div>
          <h5>{lang === 'ar' ? 'تسوّق' : 'Shop'}</h5>
          <a href="#">{t.nav_tablets}</a>
          <a href="#">{t.nav_watches}</a>
          <a href="#">{t.nav_accessories}</a>
          <a href="#">{t.nav_brands}</a>
        </div>
        <div>
          <h5>{lang === 'ar' ? 'الدعم' : 'Support'}</h5>
          <a href="#">{lang === 'ar' ? 'الضمان' : t.footer_warranty}</a>
          <a href="#">{lang === 'ar' ? 'تواصل معنا' : t.footer_contact}</a>
          <a href="#">{lang === 'ar' ? 'مراكز الخدمة' : 'Service centers'}</a>
          <a href="#">{lang === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</a>
        </div>
        <div>
          <h5>{lang === 'ar' ? 'الشركة' : 'Company'}</h5>
          <a href="#">{lang === 'ar' ? 'من نحن' : t.footer_about}</a>
          <a href="#">{lang === 'ar' ? 'كن موزعاً' : 'Become a dealer'}</a>
          <a href="#">{lang === 'ar' ? 'الخصوصية' : t.footer_privacy}</a>
          <a href="#">{lang === 'ar' ? 'الشروط' : 'Terms'}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <div>{t.footer_rights}</div>
        <div>Amman · Jordan · تأسست ٢٠١٨</div>
      </div>
    </footer>
  );
}
window.Footer = Footer;

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
window.TweaksPanel = TweaksPanel;

function AuthModal({ t, onClose, onSignin }) {
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
window.AuthModal = AuthModal;
