import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
// @ts-ignore -- JS module without TS types
import { COLOR_SWATCH } from '@/storefront/data.js';

export interface ShowcaseCardProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  currency?: string;
  colors?: string[];
}

interface Props {
  product: ShowcaseCardProduct;
  isDark?: boolean;
  onAddToCart?: (p: ShowcaseCardProduct) => void;
  onToggleWishlist?: (id: ShowcaseCardProduct['id'], wishlisted: boolean) => void;
  onCardClick?: () => void;
  selectedColor?: string;
  onColorSelect?: (color: string) => void;
  addToCartLabel?: string;
  outOfStockLabel?: string;
  reviewsLabel?: string;
  inStockLabel?: string;
}

export const ProductShowcaseCard: React.FC<Props> = ({
  product,
  isDark = false,
  onAddToCart,
  onCardClick,
  selectedColor,
  onColorSelect,
  addToCartLabel = 'Add to Cart',
  outOfStockLabel = 'Out of Stock',
  reviewsLabel = 'reviews',
  inStockLabel = '✓ In Stock',
}) => {
  const [hover, setHover] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const inStock = product.inStock !== false;
  const currency = product.currency || '$';
  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? 0;

  const palette = isDark
    ? { card: '#1f2937', border: '#374151', text: '#ffffff', sub: '#d1d5db', muted: '#9ca3af', imgBg: '#111827', btn: btnHover ? '#ea580c' : '#f97316' }
    : { card: '#ffffff', border: '#e5e7eb', text: '#111827', sub: '#4b5563', muted: '#6b7280', imgBg: '#ffffff', btn: btnHover ? '#ea580c' : '#f97316' };

  return (
    <div
      dir="ltr"
      onClick={onCardClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: '100%',
        maxWidth: 380,
        margin: '0 auto',
        background: palette.card,
        color: palette.text,
        border: `1px solid ${palette.border}`,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: hover ? '0 20px 40px rgba(0,0,0,0.25)' : '0 8px 20px rgba(0,0,0,0.15)',
        transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        cursor: onCardClick ? 'pointer' : 'default',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1 / 1', background: palette.imgBg, overflow: 'hidden' }}>
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          style={{
            width: '100%', height: '100%', objectFit: 'contain', display: 'block',
            transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.5s ease',
          }}
        />


        {!inStock && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ background: '#fff', color: '#111827', padding: '6px 12px', borderRadius: 6, fontWeight: 600, fontSize: 14 }}>
              {outOfStockLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        <p style={{ margin: 0, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: palette.muted, fontWeight: 500 }}>
          {product.category}
        </p>

        <h3 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 600, lineHeight: 1.3, color: palette.text }}>
          {product.name}
        </h3>

        {(rating > 0 || reviews > 0) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <div style={{ display: 'flex' }}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  color={i < Math.round(rating) ? '#facc15' : '#d1d5db'}
                  fill={i < Math.round(rating) ? '#facc15' : 'none'}
                />
              ))}
            </div>
            <span style={{ fontSize: 12, color: palette.sub }}>
              {rating} ({reviews} {reviewsLabel})
            </span>
          </div>
        )}

        {product.colors && product.colors.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {product.colors.map((c) => {
              const isSel = selectedColor ? c === selectedColor : false;
              const bg = (COLOR_SWATCH as Record<string,string>)[c] || '#999';
              return (
                <button
                  key={c}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onColorSelect?.(c); }}
                  aria-label={c}
                  title={c}
                  style={{
                    width: 18, height: 18, borderRadius: '50%', background: bg,
                    border: '1px solid rgba(0,0,0,0.15)',
                    outline: isSel ? `2px solid ${palette.text}` : 'none',
                    outlineOffset: 2,
                    padding: 0, cursor: 'pointer',
                    transform: isSel ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              );
            })}
          </div>
        )}


        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: isDark ? '#fff' : '#111827' }}>{currency}{Number(product.price).toLocaleString('en-US')}</span>
          </div>
          {inStock && <span style={{ fontSize: 12, color: '#10b981', fontWeight: 500 }}>{inStockLabel}</span>}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); inStock && onAddToCart?.(product); }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}
          disabled={!inStock}
          style={{
            marginTop: 20, width: '100%', padding: '12px 0',
            background: inStock ? palette.btn : '#9ca3af',
            color: '#fff', fontWeight: 600, fontSize: 15,
            border: 'none', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: inStock ? 'pointer' : 'not-allowed',
            transition: 'background 0.2s ease',
          }}
        >
          <ShoppingCart size={18} />
          {inStock ? addToCartLabel : outOfStockLabel}
        </button>
      </div>
    </div>
  );
};

export default ProductShowcaseCard;
