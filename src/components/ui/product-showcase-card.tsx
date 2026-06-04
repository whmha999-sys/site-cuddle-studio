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
  onToggleWishlist,
  addToCartLabel = 'Add to Cart',
  outOfStockLabel = 'Out of Stock',
  reviewsLabel = 'reviews',
  inStockLabel = '✓ In Stock',
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const inStock = product.inStock !== false;
  const currency = product.currency || '$';
  const rating = product.rating ?? 0;
  const reviews = product.reviews ?? 0;

  const handleWishlistClick = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    onToggleWishlist?.(product.id, next);
  };

  const cardClasses = isDark
    ? 'bg-gray-800 text-white border-gray-700'
    : 'bg-white text-gray-900 border-gray-200';
  const textSecondary = isDark ? 'text-gray-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';
  const buttonPrimary = isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600';
  const wishlistButton = isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50';

  const discount =
    product.salePrice && product.salePrice < product.price
      ? Math.round(((product.price - product.salePrice) / product.price) * 100)
      : null;

  return (
    <div
      className={`max-w-sm w-full mx-auto rounded-2xl border overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${cardClasses}`}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          draggable={false}
        />

        <button
          onClick={handleWishlistClick}
          aria-label="Toggle wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${wishlistButton}`}
        >
          <Heart
            size={18}
            className={isWishlisted ? 'fill-red-500 text-red-500' : isDark ? 'text-gray-300' : 'text-gray-600'}
          />
        </button>

        {discount !== null && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            -{discount}%
          </div>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-900 text-sm font-semibold px-3 py-1 rounded-md">
              {outOfStockLabel}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className={`text-xs uppercase tracking-wider font-medium ${textMuted}`}>
          {product.category}
        </p>

        <h3 className="mt-1 text-lg font-semibold leading-snug line-clamp-2">
          {product.name}
        </h3>

        {(rating > 0 || reviews > 0) && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className={`text-xs ${textSecondary}`}>
              {rating} ({reviews} {reviewsLabel})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-baseline gap-2">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold">{currency}{product.salePrice}</span>
                <span className={`text-sm line-through ${textMuted}`}>{currency}{product.price}</span>
              </>
            ) : (
              <span className="text-2xl font-bold">{currency}{product.price}</span>
            )}
          </div>
          {inStock && <span className="text-xs text-green-500 font-medium">{inStockLabel}</span>}
        </div>

        <button
          onClick={() => inStock && onAddToCart?.(product)}
          disabled={!inStock}
          className={`mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold transition-all duration-200 ${
            inStock ? buttonPrimary : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={18} />
          {inStock ? addToCartLabel : outOfStockLabel}
        </button>
      </div>
    </div>
  );
};

export default ProductShowcaseCard;
