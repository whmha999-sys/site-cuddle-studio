import React from 'react';
import { Monitor, Zap, BatteryFull, Signal, Cpu, HardDrive, Smartphone, Camera, Bluetooth, Wifi } from 'lucide-react';
import SpatialProductShowcase from '@/components/ui/spatial-product-showcase';
import { PRODUCT_IMAGES } from './data.js';

const ACCENTS = [
  { haloGradient: 'from-emerald-500/30 via-teal-700/15 to-zinc-950/0', accentBg: 'bg-emerald-500', accentText: 'text-emerald-400', accentRing: 'border-emerald-500/40' },
  { haloGradient: 'from-indigo-600/35 via-blue-800/20 to-zinc-950/0',  accentBg: 'bg-indigo-500',  accentText: 'text-indigo-400',  accentRing: 'border-indigo-500/40' },
  { haloGradient: 'from-amber-500/30 via-orange-700/15 to-zinc-950/0', accentBg: 'bg-amber-500',   accentText: 'text-amber-400',   accentRing: 'border-amber-500/40' },
  { haloGradient: 'from-rose-500/30 via-pink-700/15 to-zinc-950/0',    accentBg: 'bg-rose-500',    accentText: 'text-rose-400',    accentRing: 'border-rose-500/40' },
];

// Extract a numeric value out of a spec string, e.g. "10.95\" · 90 Hz" -> 90
function pickNumber(str, re) {
  const m = String(str).match(re);
  return m ? parseFloat(m[1].replace(/,/g, '')) : null;
}

function buildMetrics(product, ar) {
  const s = product.specs || {};
  const out = [];

  const display = s['Display'] || '';
  const hz = pickNumber(display, /(\d{2,3})\s*Hz/i);
  if (hz) out.push({ label: ar ? 'معدل التحديث' : 'Refresh Rate', value: Math.min(100, (hz / 120) * 100), displayValue: `${hz} Hz`, icon: Monitor });

  const bat = pickNumber(s['Battery'] || '', /([\d,]+)\s*mAh/i);
  if (bat) out.push({ label: ar ? 'البطارية' : 'Battery', value: Math.min(100, (bat / 8500) * 100), displayValue: `mAh ${bat.toLocaleString()}`, icon: BatteryFull });

  const cap = pickNumber(s['Capacity'] || '', /([\d,]+)/);
  if (cap && !bat) out.push({ label: ar ? 'السعة' : 'Capacity', value: Math.min(100, (cap / 20000) * 100), displayValue: `mAh ${cap.toLocaleString()}`, icon: BatteryFull });

  const ram = pickNumber(s['RAM'] || '', /(\d+)/);
  if (ram) out.push({ label: ar ? 'الذاكرة' : 'RAM', value: Math.min(100, (ram / 16) * 100), displayValue: s['RAM'], icon: Cpu });

  const storage = pickNumber(s['Storage'] || '', /(\d+)/);
  if (storage && out.length < 4) out.push({ label: ar ? 'التخزين' : 'Storage', value: Math.min(100, (storage / 512) * 100), displayValue: `${storage} GB`, icon: HardDrive });

  const net = (s['Network'] || s['Connectivity'] || '').toLowerCase();
  if (net && out.length < 4) {
    if (net.includes('lte') || net.includes('4g') || net.includes('5g')) {
      out.push({ label: ar ? 'الشبكة' : 'Network', value: 92, displayValue: s['Network'], icon: Signal });
    } else if (net.includes('wifi')) {
      out.push({ label: ar ? 'الاتصال' : 'WiFi', value: 80, displayValue: s['Network'] || s['Connectivity'], icon: Wifi });
    } else if (net.includes('bluetooth') || net.includes('bt')) {
      out.push({ label: ar ? 'بلوتوث' : 'Bluetooth', value: 75, displayValue: s['Connectivity'] || s['Network'], icon: Bluetooth });
    }
  }

  if (s['Camera'] && out.length < 4) {
    out.push({ label: ar ? 'الكاميرا' : 'Camera', value: 70, displayValue: s['Camera'], icon: Camera });
  }
  if (s['Display'] && out.length < 4) {
    out.push({ label: ar ? 'الشاشة' : 'Display', value: 80, displayValue: s['Display'], icon: Monitor });
  }

  // Fallback so the bars area always has something meaningful
  if (out.length < 2) {
    const fallback = Object.entries(s).slice(0, 2).map(([k, v]) => ({
      label: k, value: 70, displayValue: String(v), icon: Smartphone,
    }));
    return [...out, ...fallback].slice(0, 4);
  }
  return out.slice(0, 4);
}

export function ProductShowcase({ product, color, lang = 'en', t = {}, onViewSpecs }) {
  const ar = lang === 'ar';
  const imageMap = PRODUCT_IMAGES?.[product.id] || null;
  if (!imageMap) return null;

  const colorKey = imageMap[color] ? color : Object.keys(imageMap)[0];
  const images = imageMap[colorKey] || [];
  if (!images.length) return null;

  const eyebrow = t['cat_' + product.category] || product.category;
  const title = product.name;
  const description = product.tagline || '';

  const metrics = React.useMemo(() => buildMetrics(product, ar), [product, ar]);

  // Pull a battery/capacity label for the status pill
  const batSpec = product.specs?.['Battery'] || product.specs?.['Capacity'] || '';

  const states = React.useMemo(() => images.map((img, i) => {
    const accent = ACCENTS[i % ACCENTS.length];
    const m1 = metrics[i % Math.max(metrics.length, 1)];
    const m2 = metrics[(i + 1) % Math.max(metrics.length, 1)];
    return {
      id: `${product.id}-${colorKey}-${i}`,
      label: `${i + 1}`,
      eyebrow,
      title,
      description,
      image: img,
      statusLabel: ar ? 'متصل' : 'Connected',
      batteryLabel: batSpec,
      ...accent,
      metrics: m2 && m2 !== m1 ? [m1, m2] : [m1].filter(Boolean),
    };
  }), [images.join('|'), metrics, eyebrow, title, description, batSpec, ar, product.id, colorKey]);

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

// Back-compat for any existing imports
export { ProductShowcase as P50Showcase };
