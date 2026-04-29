// Cart drawer + Checkout page + Success modal
function CartDrawer({ t, cart, onClose, onUpdateQty, onRemove, lang }) {
  const subtotal = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  return (
    <>
      <div className="backdrop" onClick={onClose}/>
      <aside className="cart-drawer" role="dialog">
        <div className="drawer-head">
          <h3>{t.cart} <span style={{ color:'var(--fg-3)', fontFamily:'var(--font-mono)', fontSize: 13 }}>· {cart.reduce((s,i)=>s+i.qty,0)}</span></h3>
          <button onClick={onClose} className="icon-btn" style={{ padding: 8 }}><Icon name="close"/></button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div className="drawer-empty">
              <Icon name="bag" size={48}/>
              <div style={{ fontSize:16, fontWeight:600, color:'var(--fg-2)' }}>{t.empty_cart}</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{t.empty_cart_sub}</div>
              <button className="btn btn-outline btn-sm" style={{marginTop:20}} onClick={onClose}>{t.continue}</button>
            </div>
          ) : cart.map((it,i) => {
            const p = window.CATALOG.find(x=>x.id===it.id);
            return (
              <div key={i} className="cart-item">
                <div className="cart-item-img"><Silhouette product={p} color={it.color}/></div>
                <div>
                  <div className="cart-item-name">{p.name}</div>
                  <div className="cart-item-meta">{it.color} · {p.brand}</div>
                  <div className="cart-item-qty">
                    <button onClick={()=>onUpdateQty(i, Math.max(1, it.qty-1))}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={()=>onUpdateQty(i, it.qty+1)}>+</button>
                  </div>
                </div>
                <div className="cart-item-right">
                  <div className="cart-item-price"><Price value={it.price*it.qty}/></div>
                  <button className="cart-item-remove" onClick={()=>onRemove(i)}>{lang==='ar'?'إزالة':'Remove'}</button>
                </div>
              </div>
            );
          })}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div className="foot-row"><span>{t.sub_total}</span><span><Price value={subtotal}/></span></div>
            <div className="foot-row"><span style={{color:'var(--fg-3)'}}>{t.shipping}</span><span style={{color:'var(--fg-3)'}}>—</span></div>
            <div className="foot-row total"><span>{t.total}</span><span><Price value={subtotal}/></span></div>
            <button className="btn btn-green btn-lg btn-block" style={{marginTop:14}} onClick={()=>{ onClose(); window.navigate('checkout'); }}>
              {t.checkout} <Icon name="chev"/>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
window.CartDrawer = CartDrawer;

const SAVED_CUSTOMER = {
  first: 'Mohammed', last: 'Al-Rashid',
  address: 'Rainbow St. 42, Jabal Amman',
  city: 'Amman', zip: '11181',
  mobile: '+962 79 123 4567', email: 'mohammed@smartleaders.jo',
};

function Checkout({ t, cart, onComplete, lang, user }) {
  const [returning, setReturning] = React.useState(false);
  const [pay, setPay] = React.useState('cod');
  const [coupon, setCoupon] = React.useState('');
  const [applied, setApplied] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({ first:'', last:'', address:'', city:'Amman', zip:'', mobile:'', email: user?.email || '' });

  React.useEffect(()=>{
    if (returning) { setForm(SAVED_CUSTOMER); setEditing(false); }
  }, [returning]);

  const sub = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const tax = sub * 0.10;
  const discount = applied ? (sub * applied.pct) : 0;
  const shipping = sub > 100 ? 0 : 3;
  const total = sub + tax - discount + shipping;

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c === 'SL10') setApplied({ code: c, pct: 0.10 });
    else if (c === 'WELCOME') setApplied({ code: c, pct: 0.05 });
    else setApplied({ code: c, pct: 0, invalid: true });
  };

  const submit = (e) => {
    e.preventDefault();
    const txId = 'SL-' + Math.floor(100000 + Math.random()*900000);
    onComplete({ id: txId, total, items: cart, pay, at: new Date().toISOString() });
  };

  if (cart.length === 0) {
    return (
      <div style={{ padding: '80px 0', textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize: 36, marginBottom: 12 }}>{t.empty_cart}</div>
        <p style={{ color:'var(--fg-3)', marginBottom: 20 }}>{t.empty_cart_sub}</p>
        <button className="btn btn-primary btn-lg" onClick={()=>window.navigate('home')}>{t.continue}</button>
      </div>
    );
  }

  return (
    <>
      <nav className="breadcrumb">
        <a href="#" onClick={(e)=>{e.preventDefault(); window.navigate('home');}}>{lang==='ar'?'الرئيسية':'Home'}</a>
        <span className="sep">/</span>
        <span className="current">{t.checkout}</span>
      </nav>

      <h1 style={{ fontFamily:'var(--font-display)', fontSize: 44, fontWeight: 400, margin:'8px 0 24px' }}>{t.checkout}</h1>

      <form onSubmit={submit} className="checkout-layout">
        <div>
          {/* Items */}
          <div className="co-card">
            <h3>{t.review_items}</h3>
            {cart.map((it,i) => {
              const p = window.CATALOG.find(x=>x.id===it.id);
              return (
                <div key={i} className="co-item">
                  <div className="co-item-img"><Silhouette product={p} color={it.color}/></div>
                  <div>
                    <div className="co-item-name">{p.name}</div>
                    <div className="co-item-meta">{it.color} · Qty {String(it.qty).padStart(2,'0')}</div>
                  </div>
                  <div className="co-item-price"><Price value={it.price*it.qty}/></div>
                </div>
              );
            })}
          </div>

          {/* Returning toggle */}
          <div className="toggle-row">
            <button type="button" className={`check ${returning?'on':''}`} onClick={()=>setReturning(!returning)}>
              {returning && <Icon name="check" size={14}/>}
            </button>
            <span>{t.returning}</span>
          </div>

          {/* Delivery info */}
          <div className="co-card">
            <div className="co-card-head">
              <h3>{t.delivery_info}</h3>
              {returning && !editing ? (
                <button type="button" className="btn btn-outline btn-sm" onClick={()=>setEditing(true)}>{t.edit}</button>
              ) : (
                <button type="button" className="btn btn-ghost btn-sm" style={{color:'var(--fg-3)'}}>{t.save_info}</button>
              )}
            </div>
            {returning && !editing ? (
              <div style={{ fontSize: 14, lineHeight: 1.8 }}>
                <div style={{ fontWeight:600, fontSize: 15 }}>{form.first} {form.last}</div>
                <div>{form.address}</div>
                <div>{form.city} {form.zip}</div>
                <div>{form.mobile}</div>
                <div>{form.email}</div>
              </div>
            ) : (
              <div className="form-grid">
                <div className="field"><label>{t.first_name}*</label><input value={form.first} onChange={e=>setForm({...form, first:e.target.value})} required/></div>
                <div className="field"><label>{t.last_name}*</label><input value={form.last} onChange={e=>setForm({...form, last:e.target.value})} required/></div>
                <div className="field full"><label>{t.address}*</label><input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} required/></div>
                <div className="field"><label>{t.city}*</label><input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required/></div>
                <div className="field"><label>{t.zip}</label><input value={form.zip} onChange={e=>setForm({...form, zip:e.target.value})}/></div>
                <div className="field"><label>{t.mobile}*</label><input value={form.mobile} onChange={e=>setForm({...form, mobile:e.target.value})} required/></div>
                <div className="field"><label>{t.email}*</label><input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/></div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="co-card" style={{ position:'sticky', top: 120 }}>
            <h3>{lang==='ar'?'ملخص الطلب':'Order summary'}</h3>

            <div className="coupon-row">
              <input placeholder={t.coupon_ph} value={coupon} onChange={e=>setCoupon(e.target.value)}/>
              <button type="button" className="btn btn-green" onClick={applyCoupon}>{t.apply}</button>
            </div>
            {applied && !applied.invalid && <div style={{ color:'var(--green-700)', fontSize: 12, marginBottom: 12, fontFamily:'var(--font-mono)' }}>✓ {applied.code} · −{(applied.pct*100).toFixed(0)}%</div>}
            {applied?.invalid && <div style={{ color:'#c43c3c', fontSize: 12, marginBottom: 12 }}>Invalid coupon. Try SL10 or WELCOME.</div>}

            <h3 style={{ fontSize: 20, marginTop: 20 }}>{t.payment}</h3>
            <div className="payment-opts">
              {[
                { k: 'cod', label: t.pay_cod, icon: '💵' },
                { k: 'card', label: t.pay_card, icon: '💳' },
                { k: 'cliq', label: t.pay_cliq, icon: '📱' },
              ].map(opt => (
                <div key={opt.k} className={`payment-opt ${pay===opt.k?'selected':''}`} onClick={()=>setPay(opt.k)}>
                  <span className={`radio ${pay===opt.k?'on':''}`}/>
                  <span style={{ fontSize:18 }}>{opt.icon}</span>
                  <span style={{ fontWeight:500, fontSize:14 }}>{opt.label}</span>
                </div>
              ))}
            </div>

            {pay === 'card' && (
              <div className="form-grid" style={{ marginBottom: 16 }}>
                <div className="field full"><label>{t.card_holder}*</label><input required={false} placeholder="Name as on card"/></div>
                <div className="field full"><label>{t.card_number}*</label><input placeholder="0000 0000 0000 0000" defaultValue="4242 4242 4242 4242"/></div>
                <div className="field"><label>{t.expiry}</label><input placeholder="MM/YY" defaultValue="12/28"/></div>
                <div className="field"><label>{t.cvc}</label><input placeholder="000" defaultValue="123"/></div>
              </div>
            )}

            <div className="summary-row"><span>{t.sub_total}</span><span className="v"><Price value={sub}/></span></div>
            <div className="summary-row"><span>{t.tax}</span><span className="v"><Price value={tax}/></span></div>
            {discount > 0 && <div className="summary-row"><span>{t.discount}</span><span className="v" style={{color:'var(--green-700)'}}>−<Price value={discount}/></span></div>}
            <div className="summary-row"><span>{t.shipping}</span><span className="v">{shipping === 0 ? <span style={{color:'var(--green-700)'}}>{lang==='ar'?'مجاناً':'Free'}</span> : <Price value={shipping}/>}</span></div>
            <div className="summary-row summary-total"><span>{t.total}</span><span className="v"><Price value={total}/></span></div>

            <button type="submit" className="btn btn-green btn-lg btn-block" style={{marginTop:18}}>
              {t.pay_btn} <Price value={total}/>
            </button>
            <div style={{ fontSize: 11, color:'var(--fg-3)', textAlign:'center', marginTop: 10, fontFamily:'var(--font-mono)', letterSpacing:'0.06em' }}>
              SECURED BY SMART LEADERS PAYMENTS
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
window.Checkout = Checkout;

function SuccessModal({ order, onClose, t, lang }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-top">
          <div className="success-icon"><Icon name="check" size={32}/></div>
          <h3>{t.success_title}</h3>
          <p>{t.success_sub}</p>
        </div>
        <div className="modal-body">
          <div className="tx-row">
            <span className="k">{t.success_tx}</span>
            <span style={{fontWeight:600}}>{order.id}</span>
          </div>
          <div className="tx-row">
            <span className="k">{t.total}</span>
            <span style={{fontWeight:600}}><Price value={order.total}/></span>
          </div>
          <div className="tx-row">
            <span className="k">{t.placed_at}</span>
            <span>{new Date(order.at).toLocaleString(lang==='ar'?'ar-JO':'en-GB', { dateStyle:'medium', timeStyle:'short' })}</span>
          </div>
          <div className="modal-actions">
            <button className="btn btn-outline btn-block" onClick={onClose}>{t.back_home}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
window.SuccessModal = SuccessModal;
