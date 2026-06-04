// Static info pages: Warranty, Contact, Service Centers, FAQ,
// About, Become a dealer, Privacy, Terms.
import React, { useState } from 'react';

function PageShell({ title, subtitle, children }) {
  return (
    <section style={{ maxWidth: 920, margin: '0 auto', padding: '64px 24px 96px' }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--gold, #b8893b)', marginBottom: 12,
      }}>{subtitle}</div>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(34px, 5vw, 56px)',
        margin: '0 0 28px', lineHeight: 1.05,
      }}>{title}</h1>
      <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--fg-2, #3a423d)' }}>
        {children}
      </div>
    </section>
  );
}

const tx = (lang, en, ar) => (lang === 'ar' ? ar : en);

export function WarrantyPage({ lang }) {
  return (
    <PageShell
      subtitle={tx(lang, 'Support', 'الدعم')}
      title={tx(lang, 'Warranty', 'الضمان')}
    >
      <p>{tx(lang,
        'Every Vikusha and Teclast product sold by Smart Leaders Co. is covered by a 12-month manufacturer warranty against defects in materials and workmanship, starting on the date of purchase.',
        'كل منتجات فيكوشا وتيكلاست المباعة عبر شركة سمارت ليدرز مغطاة بضمان من المصنّع لمدة ١٢ شهراً ضد عيوب التصنيع والمواد، من تاريخ الشراء.')}</p>
      <h3>{tx(lang, "What's covered", 'ما يشمله الضمان')}</h3>
      <ul>
        <li>{tx(lang, 'Manufacturing defects', 'عيوب التصنيع')}</li>
        <li>{tx(lang, 'Battery failure within first 6 months', 'تعطل البطارية خلال أول ٦ أشهر')}</li>
        <li>{tx(lang, 'Hardware failures under normal use', 'أعطال العتاد ضمن الاستخدام الطبيعي')}</li>
      </ul>
      <h3>{tx(lang, 'Not covered', 'لا يشمله الضمان')}</h3>
      <ul>
        <li>{tx(lang, 'Physical damage, liquid damage, broken screens', 'الأضرار الفيزيائية وأضرار السوائل وكسر الشاشة')}</li>
        <li>{tx(lang, 'Unauthorized repairs or modifications', 'الإصلاحات أو التعديلات غير المعتمدة')}</li>
      </ul>
      <h3>{tx(lang, 'How to claim', 'كيفية المطالبة')}</h3>
      <p>{tx(lang,
        'Visit any Smart Leaders service center with your device and proof of purchase. Most claims are processed within 5–7 working days.',
        'توجّه إلى أي مركز خدمة سمارت ليدرز مع الجهاز وفاتورة الشراء. تُعالَج معظم الطلبات خلال ٥–٧ أيام عمل.')}</p>
    </PageShell>
  );
}

export function ContactPage({ lang }) {
  return (
    <PageShell
      subtitle={tx(lang, 'Support', 'الدعم')}
      title={tx(lang, 'Contact us', 'تواصل معنا')}
    >
      <p>{tx(lang, "We're here to help every day of the week.", 'نحن هنا لمساعدتك طوال أيام الأسبوع.')}</p>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 24 }}>
        <div>
          <h4 style={{ marginBottom: 6 }}>{tx(lang, 'Phone', 'الهاتف')}</h4>
          <p>+962 6 000 0000</p>
        </div>
        <div>
          <h4 style={{ marginBottom: 6 }}>WhatsApp</h4>
          <p>+962 79 000 0000</p>
        </div>
        <div>
          <h4 style={{ marginBottom: 6 }}>Email</h4>
          <p>osama-amreen@vikusha-jo.com</p>
        </div>
        <div>
          <h4 style={{ marginBottom: 6 }}>{tx(lang, 'Address', 'العنوان')}</h4>
          <p>{tx(lang, 'Amman, Jordan', 'عمّان، الأردن')}</p>
        </div>
        <div>
          <h4 style={{ marginBottom: 6 }}>{tx(lang, 'Hours', 'ساعات العمل')}</h4>
          <p>{tx(lang, 'Sat–Thu · 9:00–18:00', 'السبت–الخميس · ٩:٠٠–١٨:٠٠')}</p>
        </div>
      </div>
    </PageShell>
  );
}

export function ServiceCentersPage({ lang }) {
  const centers = [
    { city: tx(lang, 'Amman — Sweifieh', 'عمّان — الصويفية'), addr: tx(lang, 'Wakalat St, Building 22', 'شارع الوكالات، مبنى ٢٢'), phone: '+962 6 581 1111' },
    { city: tx(lang, 'Amman — Abdali', 'عمّان — العبدلي'), addr: tx(lang, 'Boulevard Mall, L1', 'مول البوليفارد، الطابق الأول'), phone: '+962 6 565 2222' },
    { city: tx(lang, 'Irbid', 'إربد'), addr: tx(lang, 'University Street, near gate 3', 'شارع الجامعة، قرب البوابة ٣'), phone: '+962 2 727 3333' },
    { city: tx(lang, 'Zarqa', 'الزرقاء'), addr: tx(lang, 'King Hussein St, Center Plaza', 'شارع الملك حسين، سنتر بلازا'), phone: '+962 5 393 4444' },
    { city: tx(lang, 'Aqaba', 'العقبة'), addr: tx(lang, 'Al-Hammamat Al-Tunisia St', 'شارع الحمامات التونسية'), phone: '+962 3 201 5555' },
  ];
  return (
    <PageShell
      subtitle={tx(lang, 'Support', 'الدعم')}
      title={tx(lang, 'Service centers', 'مراكز الخدمة')}
    >
      <p>{tx(lang, 'Authorized Smart Leaders service points across Jordan.', 'مراكز خدمة سمارت ليدرز المعتمدة في جميع أنحاء الأردن.')}</p>
      <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        {centers.map((c, i) => (
          <div key={i} style={{ padding: 20, border: '1px solid #e6e2d6', borderRadius: 10, background: '#fffdf7' }}>
            <div style={{ fontWeight: 600, fontSize: 17 }}>{c.city}</div>
            <div style={{ color: 'var(--fg-3, #6c7770)', marginTop: 4 }}>{c.addr}</div>
            <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{c.phone}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

export function FAQPage({ lang }) {
  const faqs = [
    { q: tx(lang, 'How long does shipping take?', 'كم يستغرق الشحن؟'),
      a: tx(lang, 'Within Amman: 1–2 business days. Other governorates: 2–4 business days.', 'داخل عمّان: ١–٢ يوم عمل. باقي المحافظات: ٢–٤ أيام عمل.') },
    { q: tx(lang, 'Is shipping free?', 'هل الشحن مجاني؟'),
      a: tx(lang, 'Free shipping on orders over JOD 50.', 'شحن مجاني للطلبات التي تتجاوز ٥٠ ديناراً.') },
    { q: tx(lang, 'What payment methods do you accept?', 'ما طرق الدفع المتاحة؟'),
      a: tx(lang, 'Visa, Mastercard, and Cash on Delivery.', 'فيزا، ماستركارد، والدفع عند الاستلام.') },
    { q: tx(lang, 'Can I return a product?', 'هل يمكنني إرجاع المنتج؟'),
      a: tx(lang, 'Yes — within 14 days of delivery if the product is unused and in original packaging.', 'نعم — خلال ١٤ يوماً من الاستلام بشرط أن يكون المنتج غير مستخدم وبتغليفه الأصلي.') },
    { q: tx(lang, 'Are products original?', 'هل المنتجات أصلية؟'),
      a: tx(lang, 'Yes. Smart Leaders is the official distributor for Vikusha and Teclast in Jordan.', 'نعم. سمارت ليدرز هي الموزع الرسمي لفيكوشا وتيكلاست في الأردن.') },
    { q: tx(lang, 'How do I claim warranty?', 'كيف أطالب بالضمان؟'),
      a: tx(lang, 'Visit any of our service centers with the device and proof of purchase.', 'توجّه إلى أي من مراكز الخدمة مع الجهاز وفاتورة الشراء.') },
  ];
  return (
    <PageShell
      subtitle={tx(lang, 'Support', 'الدعم')}
      title={tx(lang, 'Frequently asked questions', 'الأسئلة الشائعة')}
    >
      <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
        {faqs.map((f, i) => (
          <details key={i} style={{ padding: '14px 18px', border: '1px solid #e6e2d6', borderRadius: 10, background: '#fffdf7' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 600, fontSize: 16 }}>{f.q}</summary>
            <p style={{ marginTop: 10 }}>{f.a}</p>
          </details>
        ))}
      </div>
    </PageShell>
  );
}

export function AboutPage({ lang }) {
  return (
    <PageShell
      subtitle={tx(lang, 'Company', 'الشركة')}
      title={tx(lang, 'About Smart Leaders', 'من نحن')}
    >
      <p>{tx(lang,
        'Founded in 2018 in Amman, Smart Leaders Co. is the official Jordanian distributor for Vikusha and Teclast — bringing reliable tablets, smartwatches, power and accessories to households and businesses across the kingdom.',
        'تأسست شركة سمارت ليدرز في عمّان عام ٢٠١٨، وهي الموزّع الرسمي في الأردن لفيكوشا وتيكلاست — نقدّم أجهزة لوحية وساعات ذكية وحلول طاقة وملحقات موثوقة للأسر والأعمال في جميع أنحاء المملكة.')}</p>
      <p>{tx(lang,
        'Our mission is simple: dependable everyday technology, backed by a real Jordanian service network and honest pricing.',
        'مهمتنا بسيطة: تقنية موثوقة للاستخدام اليومي، مدعومة بشبكة خدمة أردنية حقيقية وأسعار عادلة.')}</p>
    </PageShell>
  );
}

export function DealerPage({ lang }) {
  const [sent, setSent] = useState(false);
  return (
    <PageShell
      subtitle={tx(lang, 'Company', 'الشركة')}
      title={tx(lang, 'Become a dealer', 'كن موزعاً')}
    >
      <p>{tx(lang,
        'Join the Smart Leaders dealer network and stock genuine Vikusha and Teclast products with margin support and Jordan-wide service backing.',
        'انضم إلى شبكة موزّعي سمارت ليدرز ووفّر منتجات فيكوشا وتيكلاست الأصلية بهامش ربح مدروس ودعم خدمة على مستوى الأردن.')}</p>
      {sent ? (
        <div style={{ marginTop: 20, padding: 18, background: '#f3f7f0', borderRadius: 10, color: '#1a3c2e' }}>
          {tx(lang, 'Thanks — we will be in touch within 2 business days.', 'شكراً — سنتواصل معك خلال يومَي عمل.')}
        </div>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          style={{ display: 'grid', gap: 14, marginTop: 24, maxWidth: 520 }}
        >
          {['name','email','city','message'].map((k) => {
            const labels = {
              name: tx(lang, 'Full name', 'الاسم الكامل'),
              email: tx(lang, 'Email', 'البريد الإلكتروني'),
              city: tx(lang, 'City', 'المدينة'),
              message: tx(lang, 'Tell us about your business', 'أخبرنا عن عملك'),
            };
            return (
              <label key={k} style={{ display: 'grid', gap: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--fg-3, #6c7770)' }}>{labels[k]}</span>
                {k === 'message' ? (
                  <textarea required rows={4} style={{ padding: 10, border: '1px solid #d8d2c4', borderRadius: 8, font: 'inherit' }}/>
                ) : (
                  <input required type={k==='email'?'email':'text'} style={{ padding: 10, border: '1px solid #d8d2c4', borderRadius: 8, font: 'inherit' }}/>
                )}
              </label>
            );
          })}
          <button type="submit" className="btn btn-green" style={{ justifySelf: 'start' }}>
            {tx(lang, 'Send application', 'إرسال الطلب')}
          </button>
        </form>
      )}
    </PageShell>
  );
}

export function PrivacyPage({ lang }) {
  return (
    <PageShell
      subtitle={tx(lang, 'Company', 'الشركة')}
      title={tx(lang, 'Privacy policy', 'سياسة الخصوصية')}
    >
      <p>{tx(lang,
        'Smart Leaders Co. respects your privacy. We collect only the information needed to fulfill your orders, provide warranty service, and improve your shopping experience.',
        'تحترم شركة سمارت ليدرز خصوصيتك. لا نجمع سوى المعلومات اللازمة لإتمام طلباتك وتقديم خدمة الضمان وتحسين تجربتك.')}</p>
      <h3>{tx(lang, 'What we collect', 'ما الذي نجمعه')}</h3>
      <p>{tx(lang, 'Name, contact details, delivery address, and order history.', 'الاسم، بيانات التواصل، عنوان التوصيل، وسجل الطلبات.')}</p>
      <h3>{tx(lang, 'How we use it', 'كيف نستخدمها')}</h3>
      <p>{tx(lang, 'To process orders, provide support, and send service updates. We do not sell your data.', 'لمعالجة الطلبات وتقديم الدعم وإرسال تحديثات الخدمة. لا نبيع بياناتك.')}</p>
      <h3>{tx(lang, 'Your rights', 'حقوقك')}</h3>
      <p>{tx(lang, 'You may request access, correction, or deletion of your personal data at any time by contacting osama-amreen@vikusha-jo.com.', 'يحق لك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها بالتواصل مع osama-amreen@vikusha-jo.com.')}</p>
    </PageShell>
  );
}

export function TermsPage({ lang }) {
  return (
    <PageShell
      subtitle={tx(lang, 'Company', 'الشركة')}
      title={tx(lang, 'Terms of use', 'شروط الاستخدام')}
    >
      <p>{tx(lang,
        'By using this website you agree to the following terms. Smart Leaders Co. may update these terms at any time; continued use of the site means you accept any changes.',
        'باستخدامك لهذا الموقع فإنك توافق على الشروط التالية. يحق لشركة سمارت ليدرز تعديل هذه الشروط في أي وقت، ويُعدّ استمرارك في استخدام الموقع موافقة على التعديلات.')}</p>
      <h3>{tx(lang, 'Orders & pricing', 'الطلبات والأسعار')}</h3>
      <p>{tx(lang, 'Prices are in Jordanian Dinar and include VAT. We reserve the right to refuse or cancel orders in case of pricing errors or fraud suspicion.', 'الأسعار بالدينار الأردني وتشمل ضريبة القيمة المضافة. نحتفظ بالحق في رفض أو إلغاء الطلبات في حال وجود خطأ في السعر أو شبهة احتيال.')}</p>
      <h3>{tx(lang, 'Returns', 'الإرجاع')}</h3>
      <p>{tx(lang, 'Products may be returned within 14 days if unused and in original packaging.', 'يمكن إرجاع المنتجات خلال ١٤ يوماً بشرط أن تكون غير مستخدمة وبتغليفها الأصلي.')}</p>
      <h3>{tx(lang, 'Liability', 'المسؤولية')}</h3>
      <p>{tx(lang, 'Smart Leaders is not liable for indirect or consequential damages beyond the warranty terms.', 'لا تتحمّل سمارت ليدرز أي أضرار غير مباشرة أو تبعية تتجاوز شروط الضمان.')}</p>
    </PageShell>
  );
}

export const INFO_PAGES = {
  warranty: WarrantyPage,
  contact: ContactPage,
  'service-centers': ServiceCentersPage,
  faq: FAQPage,
  about: AboutPage,
  dealer: DealerPage,
  privacy: PrivacyPage,
  terms: TermsPage,
};
