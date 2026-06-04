import React from 'react';
import { Monitor, Zap, BatteryFull, Signal } from 'lucide-react';
import SpatialProductShowcase from '@/components/ui/spatial-product-showcase';
import { PRODUCT_IMAGES } from './data.js';

const ACCENTS = [
  { haloGradient: 'from-emerald-500/30 via-teal-700/15 to-zinc-950/0', accentBg: 'bg-emerald-500', accentText: 'text-emerald-400', accentRing: 'border-emerald-500/40' },
  { haloGradient: 'from-indigo-600/35 via-blue-800/20 to-zinc-950/0',  accentBg: 'bg-indigo-500',  accentText: 'text-indigo-400',  accentRing: 'border-indigo-500/40' },
  { haloGradient: 'from-amber-500/30 via-orange-700/15 to-zinc-950/0', accentBg: 'bg-amber-500',   accentText: 'text-amber-400',   accentRing: 'border-amber-500/40' },
  { haloGradient: 'from-rose-500/30 via-pink-700/15 to-zinc-950/0',    accentBg: 'bg-rose-500',    accentText: 'text-rose-400',    accentRing: 'border-rose-500/40' },
];

export function P50Showcase({ lang = 'en', onViewSpecs }) {
  const ar = lang === 'ar';
  const images = PRODUCT_IMAGES?.['teclast-p50']?.mint || [];

  const baseMetrics = [
    { label: ar ? 'معدل التحديث' : 'Refresh Rate', value: 90, displayValue: '90 Hz', icon: Monitor },
    { label: ar ? 'السطوع' : 'Brightness', value: 80, displayValue: '400 nits', icon: Zap },
    { label: ar ? 'البطارية' : 'Battery', value: 100, displayValue: '7000 mAh', icon: BatteryFull },
    { label: ar ? 'إشارة LTE' : 'LTE Signal', value: 92, icon: Signal },
  ];

  const title = ar ? 'Teclast P50' : 'Teclast P50';
  const eyebrow = ar ? 'جهاز لوحي' : 'Tablet';
  const description = ar
    ? 'شاشة IPS 10.1 بوصة بمعدل 90 هرتز، بطارية 7000 مللي أمبير، ودعم 4G LTE — أداء وتجربة عرض رائعة طوال اليوم.'
    : '10.1″ IPS panel at 90Hz, 7000 mAh battery, and 4G LTE — all-day performance with a vivid display.';

  const states = React.useMemo(() => images.map((img, i) => {
    const accent = ACCENTS[i % ACCENTS.length];
    // Rotate which 2 metrics show so each thumbnail feels distinct
    const m1 = baseMetrics[i % baseMetrics.length];
    const m2 = baseMetrics[(i + 1) % baseMetrics.length];
    return {
      id: `img-${i}`,
      label: `${i + 1}`,
      eyebrow,
      title,
      description,
      image: img,
      statusLabel: ar ? 'متصل' : 'Connected',
      batteryLabel: ar ? '7000 مللي أمبير' : '7000 mAh',
      ...accent,
      metrics: [m1, m2],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ar, images.join('|')]);

  if (!images.length) return null;

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
