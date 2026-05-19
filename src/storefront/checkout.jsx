// Cart drawer + Checkout page + Success modal
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from './currency-context.jsx';

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

const GOVS = {
  JO: ['Amman','Zarqa','Irbid','Aqaba','Madaba','Salt','Karak','Mafraq','Jerash','Ajloun','Tafilah',"Ma'an"],
  SY: ['Damascus','Aleppo','Homs','Latakia','Hama','Tartus','Daraa','Deir ez-Zor','Raqqa','Hasakah','Sweida','Quneitra','Idlib'],
  IQ: ['Baghdad','Basra','Erbil','Mosul','Najaf','Karbala','Kirkuk','Sulaymaniyah','Duhok','Anbar','Babil','Diyala'],
};
const COUNTRY_LABEL = { JO: 'Jordan', SY: 'Syria', IQ: 'Iraq' };
const COUNTRY_LABEL_AR = { JO: 'الأردن', SY: 'سوريا', IQ: 'العراق' };
const CURRENCY_TO_COUNTRY = { JOD: 'JO', SYP: 'SY', IQD: 'IQ' };

const SAVED_CUSTOMER = {
  first: 'Mohammed', last: 'Al-Rashid',
  country: 'JO', city: 'Amman', area: 'Jabal Amman',
  address: 'Rainbow St., Building 42, Floor 3, Apt 7',
  landmark: 'Near Wild Jordan Center',
  zip: '11181',
  mobile: '+962 79 123 4567', mobile2: '',
  email: 'mohammed@smartleaders.jo',
  window: 'anytime', notes: '',
};

export function Checkout({ t, cart, onComplete, lang, user }) {
  const { code: currencyCode, currency, convertPrice } = useCurrency();
  const ar = lang === 'ar';
  const L = (en, arT) => (ar ? arT : en);
  const initialCountry = CURRENCY_TO_COUNTRY[currencyCode] || 'JO';
  const [returning, setReturning] = React.useState(false);
  const [pay] = React.useState('cod');
  const [coupon, setCoupon] = React.useState('');
  const [applied, setApplied] = React.useState(null);
  const [editing, setEditing] = React.useState(false);
  const [codConfirmed, setCodConfirmed] = React.useState(false);
  const [touched, setTouched] = React.useState({});
  const [form, setForm] = React.useState({
    first:'', last:'',
    country: initialCountry,
    city: GOVS[initialCountry][0],
    area:'', address:'', landmark:'', zip:'',
    mobile:'', mobile2:'',
    email: user?.email || '',
    window: 'anytime', notes:'',
  });

  // Re-sync city when country changes (unless returning data already set)
  React.useEffect(() => {
    if (!GOVS[form.country].includes(form.city)) {
      setForm(f => ({ ...f, city: GOVS[f.country][0] }));
    }
  }, [form.country]);




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

  // Validation
  const errors = {};
  if (!form.first.trim()) errors.first = L('Required','مطلوب');
  if (!form.last.trim()) errors.last = L('Required','مطلوب');
  if (!form.area.trim()) errors.area = L('Required','مطلوب');
  if (!form.address.trim()) errors.address = L('Required','مطلوب');
  const phoneRe = /^[\d\s+\-]{8,}$/;
  if (!phoneRe.test(form.mobile.trim())) errors.mobile = L('Enter a valid phone number','أدخل رقم هاتف صحيح');
  if (form.mobile2.trim() && !phoneRe.test(form.mobile2.trim())) errors.mobile2 = L('Enter a valid phone number','أدخل رقم هاتف صحيح');
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = L('Enter a valid email','أدخل بريداً صحيحاً');
  const formValid = Object.keys(errors).length === 0;
  const canSubmit = formValid && codConfirmed;

  const showErr = (k) => (touched[k] || touched.__all) && errors[k];

  const submit = async (e) => {
    e.preventDefault();
    if (!canSubmit) { setTouched({ __all: true }); return; }
    const items = cart.map(it => {
      const p = (window.CATALOG || []).find(x => x.id === it.id);
      return {
        id: it.id, name: p?.name || it.id, color: it.color, qty: it.qty,
        price: it.price, // base JOD unit price
        price_local: convertPrice(it.price),
      };
    });
    const winLabel = { anytime:'Anytime', morning:'Morning (9–12)', afternoon:'Afternoon (12–5)', evening:'Evening (5–9)' }[form.window];
    const fullAddress = [
      `Country: ${COUNTRY_LABEL[form.country]}`,
      `Governorate: ${form.city}`,
      `Area: ${form.area}`,
      `Address: ${form.address}`,
      form.landmark && `Landmark: ${form.landmark}`,
      form.zip && `ZIP: ${form.zip}`,
      form.mobile2 && `Alt phone: ${form.mobile2}`,
      `Delivery window: ${winLabel}`,
      form.notes && `Notes: ${form.notes}`,
    ].filter(Boolean).join('\n');
    const orderRow = {
      customer_first: form.first, customer_last: form.last,
      customer_email: form.email || `noemail-${Date.now()}@cod.local`,
      customer_mobile: form.mobile,
      customer_address: fullAddress,
      customer_city: form.city,
      customer_zip: form.zip || null,
      items,
      // Totals stored in the customer's selected currency.
      subtotal: convertPrice(sub),
      tax: convertPrice(tax),
      shipping: convertPrice(shipping),
      discount: convertPrice(discount),
      total: convertPrice(total),
      currency: currencyCode,
      exchange_rate: currency.rate,
      payment_method: pay, status: 'pending',
    };

    let orderId = 'SL-' + Math.floor(100000 + Math.random()*900000);
    let orderNumber = null;
    try {
      const { data, error } = await supabase.from('orders').insert(orderRow).select('id, order_number').single();
      if (error) throw error;
      orderId = data.id;
      orderNumber = data.order_number;
      // Fire-and-forget n8n notification
      supabase.functions.invoke('notify-n8n', {
        body: { ...orderRow, id: data.id, order_number: data.order_number },
      }).catch((err) => console.warn('n8n notify failed:', err));
    } catch (err) {
      console.error('Order save failed, completing locally:', err);
    }
    onComplete({ id: orderNumber ? `SL-${orderNumber}` : orderId, total, items: cart, pay, at: new Date().toISOString() });
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
                <div>{COUNTRY_LABEL[form.country]} · {form.city} · {form.area}</div>
                <div>{form.address}</div>
                {form.landmark && <div style={{color:'var(--fg-3)'}}>↳ {form.landmark}</div>}
                <div>{form.mobile}{form.mobile2 && ` · ${form.mobile2}`}</div>
                {form.email && <div>{form.email}</div>}
              </div>
            ) : (
              <div className="form-grid">
                <div className="field"><label>{L('First name','الاسم الأول')}*</label>
                  <input value={form.first} maxLength={60} onChange={e=>setForm({...form, first:e.target.value})} onBlur={()=>setTouched({...touched, first:true})}/>
                  {showErr('first') && <div className="field-err">{errors.first}</div>}
                </div>
                <div className="field"><label>{L('Last name','اسم العائلة')}*</label>
                  <input value={form.last} maxLength={60} onChange={e=>setForm({...form, last:e.target.value})} onBlur={()=>setTouched({...touched, last:true})}/>
                  {showErr('last') && <div className="field-err">{errors.last}</div>}
                </div>
                <div className="field"><label>{L('Country','الدولة')}*</label>
                  <select value={form.country} onChange={e=>setForm({...form, country:e.target.value})}>
                    {Object.keys(GOVS).map(c => <option key={c} value={c}>{ar?COUNTRY_LABEL_AR[c]:COUNTRY_LABEL[c]}</option>)}
                  </select>
                </div>
                <div className="field"><label>{L('Governorate','المحافظة')}*</label>
                  <select value={form.city} onChange={e=>setForm({...form, city:e.target.value})}>
                    {GOVS[form.country].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="field"><label>{L('Area / Neighborhood','المنطقة / الحي')}*</label>
                  <input value={form.area} maxLength={80} placeholder={L('e.g. Abdoun','مثال: عبدون')} onChange={e=>setForm({...form, area:e.target.value})} onBlur={()=>setTouched({...touched, area:true})}/>
                  {showErr('area') && <div className="field-err">{errors.area}</div>}
                </div>
                <div className="field"><label>{L('ZIP / Postal code','الرمز البريدي')}</label>
                  <input value={form.zip} maxLength={20} onChange={e=>setForm({...form, zip:e.target.value})}/>
                </div>
                <div className="field full"><label>{L('Street, building, floor, apartment','الشارع، المبنى، الطابق، الشقة')}*</label>
                  <textarea rows={2} value={form.address} maxLength={200} placeholder={L('Full street address with building number','العنوان الكامل مع رقم المبنى')} onChange={e=>setForm({...form, address:e.target.value})} onBlur={()=>setTouched({...touched, address:true})}/>
                  {showErr('address') && <div className="field-err">{errors.address}</div>}
                </div>
                <div className="field full"><label>{L('Nearest landmark','أقرب معلم')}</label>
                  <input value={form.landmark} maxLength={120} placeholder={L('Helps the driver find you faster','يساعد السائق في الوصول أسرع')} onChange={e=>setForm({...form, landmark:e.target.value})}/>
                </div>
                <div className="field"><label>{L('Mobile (primary)','الجوال (رئيسي)')}*</label>
                  <input value={form.mobile} maxLength={30} placeholder="+962 7X XXX XXXX" onChange={e=>setForm({...form, mobile:e.target.value})} onBlur={()=>setTouched({...touched, mobile:true})}/>
                  {showErr('mobile') && <div className="field-err">{errors.mobile}</div>}
                </div>
                <div className="field"><label>{L('Alternate mobile','جوال بديل')}</label>
                  <input value={form.mobile2} maxLength={30} placeholder={L('In case we cannot reach you','في حال تعذر الوصول إليك')} onChange={e=>setForm({...form, mobile2:e.target.value})} onBlur={()=>setTouched({...touched, mobile2:true})}/>
                  {showErr('mobile2') && <div className="field-err">{errors.mobile2}</div>}
                </div>
                <div className="field full"><label>{L('Email (optional)','البريد الإلكتروني (اختياري)')}</label>
                  <input type="email" value={form.email} maxLength={120} onChange={e=>setForm({...form, email:e.target.value})} onBlur={()=>setTouched({...touched, email:true})}/>
                  {showErr('email') && <div className="field-err">{errors.email}</div>}
                </div>
                <div className="field full"><label>{L('Preferred delivery time','وقت التوصيل المفضل')}</label>
                  <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                    {[
                      ['anytime', L('Anytime','أي وقت')],
                      ['morning', L('Morning (9–12)','صباحاً (9–12)')],
                      ['afternoon', L('Afternoon (12–5)','ظهراً (12–5)')],
                      ['evening', L('Evening (5–9)','مساءً (5–9)')],
                    ].map(([k,label])=>(
                      <button key={k} type="button"
                        className={`payment-opt ${form.window===k?'selected':''}`}
                        style={{padding:'8px 14px',flex:'0 0 auto'}}
                        onClick={()=>setForm({...form, window:k})}>
                        <span className={`radio ${form.window===k?'on':''}`}/>
                        <span style={{fontSize:13}}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field full"><label>{L('Notes for the driver','ملاحظات للسائق')}</label>
                  <textarea rows={2} value={form.notes} maxLength={500} placeholder={L('Gate code, call before arriving, etc.','رمز البوابة، الاتصال قبل الوصول، إلخ.')} onChange={e=>setForm({...form, notes:e.target.value})}/>
                </div>
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
              <div className="payment-opt selected">
                <span className="radio on"/>
                <span style={{ fontSize:18 }}>💵</span>
                <span style={{ fontWeight:500, fontSize:14 }}>{t.pay_cod}</span>
              </div>
            </div>

            <div className="summary-row"><span>{t.sub_total}</span><span className="v"><Price value={sub}/></span></div>
            <div className="summary-row"><span>{t.tax}</span><span className="v"><Price value={tax}/></span></div>
            {discount > 0 && <div className="summary-row"><span>{t.discount}</span><span className="v" style={{color:'var(--green-700)'}}>−<Price value={discount}/></span></div>}
            <div className="summary-row"><span>{t.shipping}</span><span className="v">{shipping === 0 ? <span style={{color:'var(--green-700)'}}>{lang==='ar'?'مجاناً':'Free'}</span> : <Price value={shipping}/>}</span></div>
            <div className="summary-row summary-total"><span>{t.total}</span><span className="v"><Price value={total}/></span></div>

            <div className="toggle-row" style={{marginTop:14, alignItems:'flex-start'}}>
              <button type="button" className={`check ${codConfirmed?'on':''}`} onClick={()=>setCodConfirmed(!codConfirmed)}>
                {codConfirmed && <Icon name="check" size={14}/>}
              </button>
              <span style={{fontSize:13, lineHeight:1.5}}>
                {L('I confirm I will pay ','أؤكد أنني سأدفع ')}
                <strong><Price value={total}/></strong>
                {L(' in cash on delivery.',' نقداً عند الاستلام.')}
              </span>
            </div>

            <button type="submit" disabled={!canSubmit} className="btn btn-green btn-lg btn-block" style={{marginTop:14, opacity: canSubmit?1:0.5, cursor: canSubmit?'pointer':'not-allowed'}}>
              {L('Place order','تأكيد الطلب')} · <Price value={total}/>
            </button>
            <div style={{ fontSize: 11, color:'var(--fg-3)', textAlign:'center', marginTop: 10, fontFamily:'var(--font-mono)', letterSpacing:'0.06em' }}>
              {L('CASH ON DELIVERY · NO PAYMENT NOW','الدفع عند الاستلام · لا دفع الآن')}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
window.Checkout = Checkout;

export function SuccessModal({ order, onClose, t, lang }) {
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
