import React from 'react';
import { Monitor, Zap, BatteryFull, Signal } from 'lucide-react';
import SpatialProductShowcase from '@/components/ui/spatial-product-showcase';

export function P50Showcase({ lang = 'en', onViewSpecs }) {
  const ar = lang === 'ar';
  const states = React.useMemo(() => ([
    {
      id: 'display',
      label: ar ? 'العرض' : 'Display',
      eyebrow: ar ? 'الشاشة' : 'Display',
      title: ar ? 'شاشة 10.1″ بمعدل 90Hz' : '10.1″ at 90Hz',
      description: ar
        ? 'شاشة IPS كبيرة بمعدل تحديث 90 هرتز وألوان نابضة بالحياة — مثالية للبث والقراءة والألعاب الخفيفة.'
        : 'A large IPS panel with a 90Hz refresh rate and vibrant color — perfect for streaming, reading, and casual gaming.',
      image: '/uploads/teclast-p50-front.webp',
      statusLabel: ar ? 'متصل' : 'Connected',
      batteryLabel: ar ? '٤٠٠ شمعة سطوع' : '400 nits',
      haloGradient: 'from-emerald-500/30 via-teal-700/15 to-zinc-950/0',
      accentBg: 'bg-emerald-500',
      accentText: 'text-emerald-400',
      accentRing: 'border-emerald-500/30',
      metrics: [
        { label: ar ? 'معدل التحديث' : 'Refresh Rate', value: 90, displayValue: '90 Hz', icon: Monitor },
        { label: ar ? 'السطوع' : 'Brightness', value: 80, displayValue: '400 nits', icon: Zap },
      ],
    },
    {
      id: 'performance',
      label: ar ? 'الأداء' : 'Performance',
      eyebrow: ar ? 'الأداء' : 'Performance',
      title: ar ? '٧٠٠٠ ميلي أمبير + LTE' : '7000 mAh + LTE',
      description: ar
        ? 'بطارية ضخمة بسعة 7000 مللي أمبير تدوم طوال اليوم، مع دعم 4G LTE ثنائي الشريحة ومعالج ثماني النوى للتنقل دون انقطاع.'
        : 'A massive 7000 mAh battery for all-day use, dual-SIM 4G LTE, and an octa-core chipset to keep you moving without compromise.',
      image: '/uploads/teclast-p50-back.webp',
      statusLabel: ar ? 'متصل بـ LTE' : 'LTE Connected',
      batteryLabel: ar ? '7000 مللي أمبير' : '7000 mAh',
      haloGradient: 'from-indigo-600/35 via-blue-800/20 to-zinc-950/0',
      accentBg: 'bg-indigo-500',
      accentText: 'text-indigo-400',
      accentRing: 'border-indigo-500/30',
      metrics: [
        { label: ar ? 'البطارية' : 'Battery', value: 100, displayValue: '7000 mAh', icon: BatteryFull },
        { label: ar ? 'إشارة LTE' : 'LTE Signal', value: 92, icon: Signal },
      ],
    },
  ]), [ar]);

  return (
    <div className="mb-10">
      <SpatialProductShowcase
        states={states}
        dir={ar ? 'rtl' : 'ltr'}
        viewSpecsLabel={ar ? 'عرض المواصفات' : 'View Specs'}
        onViewSpecs={onViewSpecs}
      />
    </div>
  );
}
