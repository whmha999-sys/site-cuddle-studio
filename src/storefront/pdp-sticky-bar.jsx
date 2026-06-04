// Mobile-only sticky add-to-cart bar for PDP
import React, { useEffect, useState } from 'react';
import { Price } from './atoms.jsx';

export default function PdpStickyBar({ product, color, qty, t, lang, onAddToCart, onBuyNow }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 360);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!product) return null;

  return (
    <div className={`pdp-sticky-bar${visible ? ' is-visible' : ''}`} role="region" aria-label={t.add_to_cart}>
      <div className="pdp-sticky-info">
        <div className="pdp-sticky-name">{product.name}</div>
        <div className="pdp-sticky-price"><Price value={product.price}/></div>
      </div>
      <div className="pdp-sticky-ctas">
        <button className="btn btn-outline" onClick={() => onAddToCart(product, color, qty)}>
          {t.add_to_cart}
        </button>
        <button className="btn btn-green" onClick={() => onBuyNow(product, color, qty)}>
          {t.buy_now}
        </button>
      </div>
    </div>
  );
}
