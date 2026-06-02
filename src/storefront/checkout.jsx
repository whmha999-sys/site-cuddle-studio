// Cart drawer + Checkout page + Success modal
import React from 'react';
import { Silhouette } from './silhouettes.jsx';
import { Price, Icon } from './atoms.jsx';
import { supabase } from '@/integrations/supabase/client';
import { useCurrency } from './currency-context.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Truck, Shield, MapPin, User as UserIcon, Mail, Phone, ShoppingBag,
  Check, ChevronLeft, Percent, X, Wallet, Tag,
} from 'lucide-react';

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

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
];

export function Checkout({ t, cart, onComplete, lang, user }) {
  const { code: currencyCode, currency, convertPrice } = useCurrency();
  const ar = lang === 'ar';
  const L = (en, arT) => (ar ? arT : en);

  const [currentStep, setCurrentStep] = React.useState(1);
  const [coupon, setCoupon] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState(null);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const [shipping, setShipping] = React.useState({
    firstName: '', lastName: '', email: user?.email || '', phone: '',
    address: '', city: '', state: '', zipCode: '', country: 'US',
  });

  const upd = (field, value) => setShipping(prev => ({ ...prev, [field]: value }));

  const sub = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  const discount = appliedPromo ? sub * appliedPromo.pct : 0;
  const tax = (sub - discount) * 0.10;
  const ship = sub > 100 ? 0 : 3;
  const total = sub - discount + tax + ship;

  const applyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (c === 'SL10') setAppliedPromo({ code: c, pct: 0.10 });
    else if (c === 'WELCOME') setAppliedPromo({ code: c, pct: 0.05 });
    else setAppliedPromo({ code: c, pct: 0, invalid: true });
  };
  const removePromo = () => { setAppliedPromo(null); setCoupon(''); };

  const validateStep = (step) => {
    if (step === 1) {
      return !!(shipping.firstName && shipping.lastName && shipping.email &&
        shipping.address && shipping.city && shipping.state && shipping.zipCode);
    }
    if (step === 2) return true; // COD always valid
    if (step === 3) return agreeToTerms;
    return false;
  };

  const nextStep = () => { if (validateStep(currentStep)) setCurrentStep(s => Math.min(s+1, 3)); };
  const prevStep = () => setCurrentStep(s => Math.max(s-1, 1));

  const placeOrder = async () => {
    if (!agreeToTerms || submitting) return;
    setSubmitting(true);
    const items = cart.map(it => {
      const p = (window.CATALOG || []).find(x => x.id === it.id);
      return {
        id: it.id, name: p?.name || it.id, color: it.color, qty: it.qty,
        price: it.price, price_local: convertPrice(it.price),
      };
    });
    const fullAddress = [
      `Country: ${shipping.country}`,
      `State: ${shipping.state}`,
      `City: ${shipping.city}`,
      `Address: ${shipping.address}`,
      `ZIP: ${shipping.zipCode}`,
    ].join('\n');
    const orderRow = {
      customer_first: shipping.firstName, customer_last: shipping.lastName,
      customer_email: shipping.email || `noemail-${Date.now()}@cod.local`,
      customer_mobile: shipping.phone || 'N/A',
      customer_address: fullAddress,
      customer_city: shipping.city,
      customer_zip: shipping.zipCode || null,
      items,
      subtotal: convertPrice(sub),
      tax: convertPrice(tax),
      shipping: convertPrice(ship),
      discount: convertPrice(discount),
      total: convertPrice(total),
      currency: currencyCode,
      exchange_rate: currency.rate,
      payment_method: 'cod', status: 'pending',
    };

    let orderId = 'SL-' + Math.floor(100000 + Math.random()*900000);
    let orderNumber = null;
    try {
      const { data, error } = await supabase.from('orders').insert(orderRow).select('id, order_number').single();
      if (error) throw error;
      orderId = data.id;
      orderNumber = data.order_number;
      supabase.functions.invoke('notify-n8n', {
        body: { ...orderRow, id: data.id, order_number: data.order_number },
      }).catch(err => console.warn('n8n notify failed:', err));
    } catch (err) {
      console.error('Order save failed, completing locally:', err);
    }
    setSubmitting(false);
    onComplete({
      id: orderNumber ? `SL-${orderNumber}` : orderId,
      total, items: cart, pay: 'cod', at: new Date().toISOString(),
    });
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

  const OrderSummaryCard = () => (
    <Card className="flex flex-col gap-5">
      <CardHeader>
        <h3 className="font-semibold flex items-center gap-2">
          <ShoppingBag className="h-4 w-4" />
          {L('Order Summary','ملخص الطلب')}
        </h3>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {cart.map((it, i) => {
            const p = window.CATALOG.find(x => x.id === it.id);
            return (
              <div key={i} className="flex gap-3">
                <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  <Silhouette product={p} color={it.color}/>
                  <Badge className="absolute -top-1 -right-1 text-xs min-w-5 h-5 px-1 flex items-center justify-center">
                    {it.qty}
                  </Badge>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <div className="text-xs text-muted-foreground">{it.color}</div>
                </div>
                <div className="text-sm font-semibold whitespace-nowrap">
                  <Price value={it.price * it.qty}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Coupon */}
        <div className="flex gap-2">
          <Input
            placeholder={t.coupon_ph || L('Coupon code','رمز الخصم')}
            value={coupon}
            onChange={e => setCoupon(e.target.value)}
            disabled={!!appliedPromo && !appliedPromo.invalid}
          />
          <Button type="button" variant="outline" onClick={applyCoupon}>
            <Tag className="h-4 w-4 mr-1"/>{t.apply || L('Apply','تطبيق')}
          </Button>
        </div>

        {appliedPromo && !appliedPromo.invalid && (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-md border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                {appliedPromo.code} · −{(appliedPromo.pct*100).toFixed(0)}%
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={removePromo} className="h-6 w-6 p-0 text-green-700">
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        {appliedPromo?.invalid && (
          <div className="text-xs text-destructive">
            {L('Invalid coupon. Try SL10 or WELCOME.','رمز غير صالح. جرّب SL10 أو WELCOME.')}
          </div>
        )}

        {/* Totals */}
        <div className="flex flex-col gap-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span>{t.sub_total}</span>
            <span><Price value={sub}/></span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>{t.discount}</span>
              <span>−<Price value={discount}/></span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>{t.shipping}</span>
            <span>{ship === 0 ? <span className="text-green-600">{L('Free','مجاناً')}</span> : <Price value={ship}/>}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t.tax}</span>
            <span><Price value={tax}/></span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>{t.total}</span>
            <span><Price value={total}/></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const steps = [
    { step: 1, label: L('Shipping','الشحن'), icon: Truck },
    { step: 2, label: L('Payment','الدفع'), icon: Wallet },
    { step: 3, label: L('Review','المراجعة'), icon: Check },
  ];

  return (
    <div className="w-full mx-auto p-6 flex flex-col gap-6" dir={ar ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex flex-col items-start gap-4">
          <Button
            variant="ghost" size="sm"
            onClick={() => window.navigate('home')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            {L('Back to Cart','العودة للسلة')}
          </Button>
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              {t.checkout}
            </h1>
            <p className="text-muted-foreground text-sm">
              {L('Complete your purchase securely','أكمل عملية الشراء بأمان')}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {L('SSL Secured','مؤمّن SSL')}
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-start gap-4 sm:gap-6 py-4">
        {steps.map(({ step, label, icon: StepIcon }, index) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
                currentStep >= step
                  ? "bg-primary border-primary text-primary-foreground"
                  : "border-border text-muted-foreground"
              )}>
                {currentStep > step ? <Check className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
              </div>
              <span className={cn(
                "text-sm font-medium hidden sm:block",
                currentStep >= step ? "text-foreground" : "text-muted-foreground"
              )}>{label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={cn("w-8 h-0.5", currentStep > step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Step 1: Shipping */}
          {currentStep === 1 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {L('Shipping Information','معلومات الشحن')}
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">{L('First Name','الاسم الأول')} *</Label>
                    <Input id="firstName" placeholder="John"
                      value={shipping.firstName} onChange={e => upd('firstName', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">{L('Last Name','اسم العائلة')} *</Label>
                    <Input id="lastName" placeholder="Doe"
                      value={shipping.lastName} onChange={e => upd('lastName', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">{L('Email','البريد الإلكتروني')} *</Label>
                    <Input id="email" type="email" placeholder="john@example.com"
                      value={shipping.email} onChange={e => upd('email', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">{L('Phone','الهاتف')}</Label>
                    <Input id="phone" type="tel" placeholder="+1 (555) 123-4567"
                      value={shipping.phone} onChange={e => upd('phone', e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="address">{L('Address','العنوان')} *</Label>
                  <Input id="address" placeholder="123 Main Street"
                    value={shipping.address} onChange={e => upd('address', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="city">{L('City','المدينة')} *</Label>
                    <Input id="city" placeholder="New York"
                      value={shipping.city} onChange={e => upd('city', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="state">{L('State','الولاية')} *</Label>
                    <Select value={shipping.state} onValueChange={v => upd('state', v)}>
                      <SelectTrigger><SelectValue placeholder={L('Select state','اختر الولاية')} /></SelectTrigger>
                      <SelectContent>
                        {US_STATES.map(([code, name]) => (
                          <SelectItem key={code} value={code}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="zipCode">{L('ZIP Code','الرمز البريدي')} *</Label>
                    <Input id="zipCode" placeholder="10001"
                      value={shipping.zipCode} onChange={e => upd('zipCode', e.target.value)} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={nextStep} disabled={!validateStep(1)} className="ml-auto" size="lg">
                  {L('Continue to Payment','المتابعة إلى الدفع')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Payment - COD only */}
          {currentStep === 2 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  {L('Payment Method','طريقة الدفع')}
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <Label className="text-base font-medium">
                    {L('Available Payment Methods','طرق الدفع المتاحة')}
                  </Label>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center gap-3 p-4 border-2 border-primary bg-primary/5 rounded-md">
                      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                        <span className="text-xl">💵</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{L('Cash on Delivery','الدفع عند الاستلام')}</div>
                        <div className="text-xs text-muted-foreground">
                          {L('Pay in cash when your order arrives','ادفع نقداً عند وصول طلبك')}
                        </div>
                      </div>
                      <Check className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="rounded-md border border-border bg-muted/30 p-4 flex items-start gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">
                    {L('No payment required now. You will pay the driver in cash upon delivery.',
                       'لا حاجة للدفع الآن. ستدفع للسائق نقداً عند الاستلام.')}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="lg" onClick={prevStep} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {L('Back','رجوع')}
                </Button>
                <Button onClick={nextStep} size="lg">
                  {L('Review Order','مراجعة الطلب')}
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <Card className="flex flex-col gap-6">
              <CardHeader>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  {L('Review Your Order','راجع طلبك')}
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                {/* Shipping summary */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {L('Shipping Address','عنوان الشحن')}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                      {L('Edit','تعديل')}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed pl-6">
                    <div className="font-medium text-foreground">
                      {shipping.firstName} {shipping.lastName}
                    </div>
                    <div>{shipping.address}</div>
                    <div>{shipping.city}, {shipping.state} {shipping.zipCode}</div>
                    <div>{shipping.country}</div>
                    {shipping.phone && <div className="flex items-center gap-1 mt-1"><Phone className="h-3 w-3"/>{shipping.phone}</div>}
                    {shipping.email && <div className="flex items-center gap-1"><Mail className="h-3 w-3"/>{shipping.email}</div>}
                  </div>
                </div>

                {/* Payment summary */}
                <div className="flex flex-col gap-2 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {L('Payment Method','طريقة الدفع')}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                      {L('Edit','تعديل')}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground pl-6">
                    💵 {L('Cash on Delivery','الدفع عند الاستلام')}
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 border-t pt-4">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(c) => setAgreeToTerms(c === true)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    {L('I confirm I will pay ','أؤكد أنني سأدفع ')}
                    <strong><Price value={total}/></strong>
                    {L(' in cash on delivery and agree to the terms of service.',
                       ' نقداً عند الاستلام وأوافق على شروط الخدمة.')}
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="lg" onClick={prevStep} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  {L('Back','رجوع')}
                </Button>
                <Button
                  size="lg"
                  onClick={placeOrder}
                  disabled={!agreeToTerms || submitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {submitting
                    ? L('Placing order...','جاري التأكيد...')
                    : <>{L('Place Order','تأكيد الطلب')} · <Price value={total}/></>}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
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
