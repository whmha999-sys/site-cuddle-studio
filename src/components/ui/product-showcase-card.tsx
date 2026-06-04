import React, { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';

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
}

interface Props {
  product: ShowcaseCardProduct;
  isDark?: boolean;
  onAddToCart?: (p: ShowcaseCardProduct) => void;
  onToggleWishlist?: (id: ShowcaseCardProduct['id'], wishlisted: boolean) => void;
  addToCartLabel?: string;
  outOfStockLabel?: string;
  reviewsLabel?: string;
  inStockLabel?: string;
}

export const ProductShowcaseCard: React.FC<Props> = ({
  product,
  isDark = false,
  onAddToCart,
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

  const handleWishlistClick = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    onToggleWishlist?.(product.id, next);
  };

  const palette = isDark
    ? { card: '#1f2937', border: '#374151', text: '#ffffff', sub: '#d1d5db', muted: '#9ca3af', imgBg: '#111827', wish: '#374151', btn: btnHover ? '#1d4ed8' : '#2563eb' }
    : { card: '#ffffff', border: '#e5e7eb', text: '#111827', sub: '#4b5563', muted: '#6b7280', imgBg: '#f3f4f6', wish: '#ffffff', btn: btnHover ? '#2563eb' : '#3b82f6' };

  const discount =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  return (
    <div
      dir="ltr"
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


        {discount !== null && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#ef4444', color: '#fff', fontSize: 12, fontWeight: 700,
            padding: '4px 8px', borderRadius: 6,
          }}>
            -{discount}%
          </div>
        )}

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

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            {product.salePrice ? (
              <>
                <span style={{ fontSize: 24, fontWeight: 700, color: '#ef4444' }}>{currency}{product.salePrice}</span>
                <span style={{ fontSize: 14, textDecoration: 'line-through', color: palette.muted }}>{currency}{product.price}</span>
              </>
            ) : (
              <span style={{ fontSize: 24, fontWeight: 700, color: isDark ? '#fff' : '#111827' }}>{currency}{product.price}</span>
            )}
          </div>
          {inStock && <span style={{ fontSize: 12, color: '#10b981', fontWeight: 500 }}>{inStockLabel}</span>}
        </div>

        <button
          onClick={() => inStock && onAddToCart?.(product)}
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
