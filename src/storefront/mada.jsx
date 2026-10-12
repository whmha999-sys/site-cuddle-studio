import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import madaLogo from '@/assets/mada-logo-white.png.asset.json';

// Public key from Mada Merchant Portal > API Tokens > Other Keys > Public Key (safe in browser).
export const MADA_PUBLIC_KEY = '';
export const MADA_ENV = 'sandbox'; // 'sandbox' | 'live'
const WIDGET_SRC = MADA_ENV === 'live'
  ? 'https://cdn.mada-bnpl.com/widgets/v1/widget.js'
  : 'https://cdn.mada-bnpl.com/sandbox/v1/widget.js';

let loader = null;
function loadWidget() {
  if (window.MadaWidget) return Promise.resolve();
  if (!loader) {
    loader = new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = WIDGET_SRC; s.defer = true;
      s.onload = () => res(); s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  return loader;
}

/** "or 4 payments of X JOD" badge. amount is in JOD. */
export function MadaWidget({ amount, lang = 'ar' }) {
  const ref = useRef(null);
  const inst = useRef(null);
  useEffect(() => {
    if (!MADA_PUBLIC_KEY || !(amount > 0)) return;
    let cancelled = false;
    loadWidget().then(() => {
      if (cancelled || !ref.current || !window.MadaWidget) return;
      if (inst.current?.update) inst.current.update({ amount: Number(amount), lang });
      else inst.current = window.MadaWidget.init({
        publicKey: MADA_PUBLIC_KEY, amount: Number(amount), currency: 'JOD', theme: 'light', lang,
      }, ref.current);
    }).catch(e => console.warn('Mada widget failed to load', e));
    return () => { cancelled = true; };
  }, [amount, lang]);
  if (!MADA_PUBLIC_KEY) return null;
  return <div ref={ref} style={{ margin: '12px 0' }} />;
}

export function MadaLogoTile({ size = 56 }) {
  return (
    <div style={{
      width: size * 1.4, height: size, borderRadius: 10, flexShrink: 0,
      background: 'linear-gradient(135deg, #2b6e8f 0%, #22b8b8 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img src={madaLogo.url} alt="Mada" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
    </div>
  );
}

export function PaymentResult({ lang = 'ar', failed = false }) {
  const [params] = useSearchParams();
  const orderId = params.get('order');
  const [state, setState] = useState({ loading: !failed && !!orderId, data: null });
  const L = (en, ar) => (lang === 'ar' ? ar : en);

  useEffect(() => {
    if (failed || !orderId) return;
    let tries = 0, stop = false;
    const run = async () => {
      const { data } = await supabase.functions.invoke('mada-verify', { body: { orderId } });
      if (stop) return;
      if (data?.payment_status === 'paid' || tries >= 4) { setState({ loading: false, data }); return; }
      tries++; setTimeout(run, 2500);
    };
    run();
    if (!failed) { try { localStorage.setItem('sl_cart', '[]'); } catch {} }
    return () => { stop = true; };
  }, [orderId, failed]);

  const paid = state.data?.payment_status === 'paid';
  return (
    <div style={{ maxWidth: 560, margin: '80px auto', padding: 24, textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><MadaLogoTile /></div>
      {failed ? (
        <>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>{L('Payment was not completed', 'لم تكتمل عملية الدفع')}</h1>
          <p style={{ color: 'var(--fg-3)', marginBottom: 24 }}>{L('No money was taken. You can try again or choose cash on delivery.', 'لم يتم خصم أي مبلغ. يمكنك المحاولة مرة أخرى أو اختيار الدفع عند الاستلام.')}</p>
          <button className="btn btn-primary btn-lg" onClick={() => window.navigate?.('checkout')}>{L('Back to checkout', 'العودة إلى الدفع')}</button>
        </>
      ) : state.loading ? (
        <h1 style={{ fontSize: 24 }}>{L('Confirming your payment…', 'جارٍ تأكيد الدفع…')}</h1>
      ) : (
        <>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>
            {paid ? L('Thank you! Your order is confirmed', 'شكراً لك! تم تأكيد طلبك') : L('Your order was received', 'تم استلام طلبك')}
          </h1>
          {state.data?.order_number && <p style={{ marginBottom: 8 }}>{L('Order', 'رقم الطلب')}: SL-{state.data.order_number}</p>}
          <p style={{ color: 'var(--fg-3)', marginBottom: 24 }}>
            {paid ? L('Paid with Mada in 4 interest-free installments.', 'تم الدفع عبر مدى على 4 دفعات بدون فوائد.')
                  : L('We are waiting for Mada to confirm the payment. We will contact you shortly.', 'بانتظار تأكيد الدفع من مدى. سنتواصل معك قريباً.')}
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => window.navigate?.('home')}>{L('Continue shopping', 'متابعة التسوق')}</button>
        </>
      )}
    </div>
  );
}
