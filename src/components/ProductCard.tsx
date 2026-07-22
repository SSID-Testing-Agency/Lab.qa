import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/data/products'
import { effectivePrice } from '@/data/products'
import { useBugStore } from '@/store/bugStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/utils/price'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [clicked, setClicked] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const addItem = useCartStore(s => s.addItem)
  const cartQty = useCartStore(s =>
    s.items.filter(i => i.productId === product.id).reduce((sum, i) => sum + i.quantity, 0)
  )
  const hasBug = useBugStore(s => s.hasBug)
  const isWishlisted = useWishlistStore(s => s.ids.includes(product.id))
  const toggleWishlist = useWishlistStore(s => s.toggle)
  const base = import.meta.env.BASE_URL

  const isOutOfStock = product.inventory === 0
  const remaining = product.inventory - cartQty
  const isAtMax = !isOutOfStock && remaining <= 0
  const isLowStock = !isOutOfStock && !isAtMax && product.inventory <= 3

  const imageSrc = hasBug('broken-images')
    ? `${base}images/broken.svg`
    : `${base}${product.image}`

  const hasSizes = product.sizes && product.sizes.length > 0
  const showButton = !(hasBug('disappearing-button') && clicked)
  const canAdd = !isOutOfStock && !isAtMax && (!hasSizes || selectedSize !== null)

  function handleAddToCart() {
    if (!canAdd) return
    addItem(product.id, selectedSize ?? undefined, qty)
    setQty(1)
    if (hasBug('disappearing-button')) setClicked(true)
  }

  // Top-left badge: rupture > low-stock > nouveau
  const topLeftBadge = isOutOfStock
    ? <span className="absolute top-2 left-2 text-xs font-medium bg-danger/90 text-canvas px-2 py-0.5 rounded">Rupture de stock</span>
    : isLowStock
      ? <span data-testid={`low-stock-badge-${product.id}`} className="absolute top-2 left-2 text-xs font-medium bg-warning/90 text-canvas px-2 py-0.5 rounded">Stock faible</span>
      : product.isNew
        ? <span data-testid={`new-badge-${product.id}`} className="absolute top-2 left-2 text-xs font-semibold bg-accent text-canvas px-2 py-0.5 rounded">Nouveau</span>
        : null

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col hover:border-accent transition-colors"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative block overflow-hidden no-underline"
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={imageSrc}
          alt={product.name}
          data-testid={`product-image-${product.id}`}
          className={`w-full h-48 object-contain bg-overlay p-4 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
          loading="lazy"
        />
        {topLeftBadge}
        {!isOutOfStock && product.discount && (
          <span
            data-testid={`discount-badge-${product.id}`}
            className="absolute top-2 right-2 text-xs font-bold bg-success text-canvas px-2 py-0.5 rounded"
          >
            −{Math.round(product.discount * 100)} %
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div className="flex-1 flex flex-col gap-1">
          <Link
            to={`/product/${product.id}`}
            className="text-fg font-medium text-sm leading-snug hover:text-accent no-underline"
          >
            <span data-testid={`product-name-${product.id}`}>{product.name}</span>
          </Link>
          <StarRating
            value={product.rating}
            count={product.reviewCount}
          />
        </div>

        {hasSizes && (
          <div className="flex items-center gap-1.5" role="group" aria-label="Choisir une taille">
            {product.sizes!.map(s => (
              <button
                key={s}
                data-testid={`size-btn-${product.id}-${s}`}
                onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                disabled={isOutOfStock}
                aria-pressed={selectedSize === s}
                className={`w-8 h-8 text-xs font-medium rounded border transition-colors cursor-pointer bg-transparent font-sans ${
                  selectedSize === s
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-fg-muted hover:border-border-strong hover:text-fg'
                } disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {!isOutOfStock && !isAtMax && (
          <div className="flex items-center gap-1.5">
            <button
              data-testid={`qty-decrease-${product.id}`}
              onClick={() => setQty(q => Math.max(1, q - 1))}
              aria-label="Diminuer la quantité"
              className="w-6 h-6 flex items-center justify-center border border-border rounded text-fg-muted hover:text-fg hover:border-border-strong transition-colors bg-transparent cursor-pointer text-sm leading-none"
            >
              −
            </button>
            <span
              data-testid={`qty-value-${product.id}`}
              className="w-6 text-center text-sm font-mono text-fg"
            >
              {qty}
            </span>
            <button
              data-testid={`qty-increase-${product.id}`}
              onClick={() => setQty(q => Math.min(remaining, q + 1))}
              disabled={qty >= remaining}
              aria-label="Augmenter la quantité"
              className="w-6 h-6 flex items-center justify-center border border-border rounded text-fg-muted hover:text-fg hover:border-border-strong transition-colors bg-transparent cursor-pointer text-sm leading-none disabled:opacity-40 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        )}

        {isAtMax && (
          <p className="text-xs text-warning">Quantité maximale atteinte</p>
        )}

        <div className="flex items-center justify-between gap-2">
          {product.discount ? (
            <div className="flex items-baseline gap-2">
              <span
                data-testid={`product-price-${product.id}`}
                className="font-mono font-medium text-success"
              >
                {formatPrice(effectivePrice(product) / 100)}
              </span>
              <span className="font-mono text-xs text-fg-faint line-through">
                {formatPrice(product.price / 100)}
              </span>
            </div>
          ) : (
            <span
              data-testid={`product-price-${product.id}`}
              className="font-mono font-medium text-fg"
            >
              {formatPrice(product.price / 100)}
            </span>
          )}

          <div className="flex items-center gap-1 shrink-0">
            <button
              data-testid={`wishlist-btn-${product.id}`}
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? `Retirer ${product.name} de la wishlist` : `Ajouter ${product.name} à la wishlist`}
              aria-pressed={isWishlisted}
              className={`p-1.5 rounded-md transition-colors bg-transparent border-none cursor-pointer ${
                isWishlisted ? 'text-danger hover:text-danger-hover' : 'text-fg-muted hover:text-danger'
              }`}
            >
              {isWishlisted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
            </button>
            {showButton && (
              <Button
                size="sm"
                data-testid={`add-to-cart-${product.id}`}
                onClick={handleAddToCart}
                disabled={!canAdd}
                aria-label={`Ajouter ${product.name} au panier`}
              >
                {isOutOfStock ? 'Rupture de stock' : isAtMax ? 'Max atteint' : hasSizes && !selectedSize ? 'Choisir taille' : '+ Panier'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
