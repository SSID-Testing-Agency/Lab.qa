import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PRODUCTS, PRODUCTS_MAP, effectivePrice } from '@/data/products'
import { useBugStore } from '@/store/bugStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore'
import { ProductCard } from '@/components/ProductCard'
import { StarRating } from '@/components/ui/StarRating'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { formatPrice } from '@/utils/price'

const CATEGORY_LABELS: Record<string, string> = {
  clothing:    'Vêtements',
  accessories: 'Accessoires',
  electronics: 'Électronique',
  books:       'Livres',
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const addItem = useCartStore(s => s.addItem)
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const hasBug = useBugStore(s => s.hasBug)
  const isWishlisted = useWishlistStore(s => id ? s.ids.includes(id) : false)
  const toggleWishlist = useWishlistStore(s => s.toggle)
  const recentIds = useRecentlyViewedStore(s => s.ids)
  const addViewed = useRecentlyViewedStore(s => s.addViewed)
  const base = import.meta.env.BASE_URL

  const product = id ? PRODUCTS_MAP.get(id) : undefined

  useEffect(() => {
    if (id && PRODUCTS_MAP.has(id)) addViewed(id)
  }, [id])

  function handleAddToCart() {
    addItem(product!.id, selectedSize ?? undefined, qty)
    setQty(1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-fg-muted text-lg mb-4">Produit introuvable.</p>
        <Link to="/catalog" data-testid="product-detail-back">
          ← Retour au catalogue
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.inventory === 0
  const totalInCart = useCartStore(s =>
    s.items.filter(i => i.productId === product.id).reduce((sum, i) => sum + i.quantity, 0)
  )
  const remaining = product.inventory - totalInCart
  const isAtMax = !isOutOfStock && remaining <= 0
  const isLowStock = !isOutOfStock && !isAtMax && product.inventory <= 3
  const hasSizes = product.sizes && product.sizes.length > 0
  const canAdd = !isOutOfStock && !isAtMax && (!hasSizes || selectedSize !== null)

  const imageSrc = hasBug('broken-images')
    ? `${base}images/broken.svg`
    : `${base}${product.image}`

  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3)

  const recentlyViewed = recentIds
    .filter(rid => rid !== product.id)
    .map(rid => PRODUCTS_MAP.get(rid))
    .filter(Boolean)
    .slice(0, 4)

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Catalogue', to: '/catalog' },
        { label: CATEGORY_LABELS[product.category] ?? product.category, to: `/catalog?category=${product.category}` },
        { label: product.name },
      ]} />
      <Link
        to="/catalog"
        data-testid="product-detail-back"
        className="inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg mb-6 no-underline transition-colors"
      >
        ← Retour au catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div className={`bg-overlay rounded-lg overflow-hidden flex items-center justify-center p-8 ${isOutOfStock ? 'opacity-60' : ''}`}>
          <img
            src={imageSrc}
            alt={product.name}
            data-testid="product-detail-image"
            className={`max-w-full h-auto max-h-80 object-contain ${isOutOfStock ? 'grayscale' : ''}`}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-accent mb-2 block">
              {product.category}
            </span>
            <h1
              data-testid="product-detail-name"
              className="text-2xl font-medium text-fg leading-tight"
            >
              {product.name}
            </h1>
            <div className="mt-2">
              <StarRating value={product.rating} count={product.reviewCount} size="md" />
            </div>
          </div>

          <p
            data-testid="product-detail-description"
            className="text-fg-muted text-sm leading-relaxed"
          >
            {product.description}
          </p>

          {hasSizes && (
            <div>
              <p className="text-xs font-medium text-fg-faint uppercase tracking-wide mb-2">Taille</p>
              <div className="flex gap-2" role="group" aria-label="Choisir une taille">
                {product.sizes!.map(s => (
                  <button
                    key={s}
                    data-testid={`size-btn-${s}`}
                    onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                    disabled={isOutOfStock}
                    aria-pressed={selectedSize === s}
                    className={`w-11 h-11 text-sm font-medium rounded-md border transition-colors cursor-pointer bg-transparent font-sans ${
                      selectedSize === s
                        ? 'border-accent text-accent bg-accent/10'
                        : 'border-border text-fg-muted hover:border-border-strong hover:text-fg'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!selectedSize && !isOutOfStock && (
                <p className="text-xs text-fg-faint mt-2">Veuillez sélectionner une taille avant d'ajouter au panier.</p>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            {product.discount ? (
              <>
                <span
                  data-testid="product-detail-price"
                  className="text-3xl font-mono font-medium text-success"
                >
                  {formatPrice(effectivePrice(product) / 100)}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg text-fg-faint line-through">
                    {formatPrice(product.price / 100)}
                  </span>
                  <span
                    data-testid="product-detail-discount-badge"
                    className="text-xs font-bold bg-success text-canvas px-2 py-0.5 rounded"
                  >
                    −{Math.round(product.discount * 100)} %
                  </span>
                </div>
              </>
            ) : (
              <span
                data-testid="product-detail-price"
                className="text-3xl font-mono font-medium text-fg"
              >
                {formatPrice(product.price / 100)}
              </span>
            )}

            {isOutOfStock ? (
              <span
                data-testid="product-detail-out-of-stock"
                className="text-sm font-medium text-danger"
              >
                Rupture de stock
              </span>
            ) : isAtMax ? (
              <span className="text-sm text-warning">
                Quantité maximale atteinte ({product.inventory})
              </span>
            ) : isLowStock ? (
              <span
                data-testid="product-detail-low-stock"
                className="text-sm text-warning"
              >
                Plus que {remaining} en stock
              </span>
            ) : (
              <span
                data-testid="product-detail-stock"
                className="text-sm text-fg-muted"
              >
                {product.inventory} en stock
              </span>
            )}
          </div>

          {!isOutOfStock && !isAtMax && (
            <div className="flex items-center gap-3">
              <p className="text-xs font-medium text-fg-faint uppercase tracking-wide">Quantité</p>
              <div className="flex items-center gap-2">
                <button
                  data-testid="product-detail-qty-decrease"
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  aria-label="Diminuer la quantité"
                  className="w-8 h-8 flex items-center justify-center border border-border rounded-md text-fg-muted hover:text-fg hover:border-border-strong transition-colors bg-transparent cursor-pointer text-base leading-none"
                >
                  −
                </button>
                <span
                  data-testid="product-detail-qty-value"
                  className="w-8 text-center text-base font-mono text-fg"
                >
                  {qty}
                </span>
                <button
                  data-testid="product-detail-qty-increase"
                  onClick={() => setQty(q => Math.min(remaining, q + 1))}
                  disabled={qty >= remaining}
                  aria-label="Augmenter la quantité"
                  className="w-8 h-8 flex items-center justify-center border border-border rounded-md text-fg-muted hover:text-fg hover:border-border-strong transition-colors bg-transparent cursor-pointer text-base leading-none disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <p aria-live="polite" className="sr-only">
              {added ? `${product.name} ajouté au panier` : ''}
            </p>
            <Button
              size="lg"
              data-testid="product-detail-add-to-cart"
              data-added={added ? 'true' : undefined}
              onClick={handleAddToCart}
              disabled={!canAdd}
              aria-label={
                added
                  ? `${product.name} ajouté au panier`
                  : isOutOfStock
                    ? `${product.name} — rupture de stock`
                    : isAtMax
                      ? `${product.name} — quantité maximale atteinte`
                      : `Ajouter ${product.name} au panier`
              }
              className={`w-full sm:w-auto${added ? ' !bg-success hover:!bg-success' : ''}`}
            >
              {added ? 'Ajouté ✓' : isOutOfStock ? 'Rupture de stock' : isAtMax ? 'Max atteint' : hasSizes && !selectedSize ? 'Choisir une taille' : 'Ajouter au panier'}
            </Button>

            <button
              data-testid="wishlist-btn-detail"
              onClick={() => id && toggleWishlist(id)}
              aria-label={isWishlisted ? `Retirer de la wishlist` : `Ajouter à la wishlist`}
              aria-pressed={isWishlisted}
              className={`inline-flex items-center gap-2 px-4 py-3 rounded-md border text-sm font-medium transition-colors cursor-pointer bg-transparent font-sans ${
                isWishlisted
                  ? 'border-danger/40 text-danger hover:border-danger hover:bg-danger/5'
                  : 'border-border text-fg-muted hover:border-danger hover:text-danger'
              }`}
            >
              {isWishlisted ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
              {isWishlisted ? 'Dans la wishlist' : 'Ajouter à la wishlist'}
            </button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section data-testid="related-products" aria-labelledby="related-heading" className="mt-12 pt-8 border-t border-border">
          <h2 id="related-heading" className="text-base font-medium text-fg mb-6">
            Produits similaires
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {recentlyViewed.length > 0 && (
        <section data-testid="recently-viewed" aria-labelledby="recent-heading" className="mt-12 pt-8 border-t border-border">
          <h2 id="recent-heading" className="text-base font-medium text-fg mb-6">
            Récemment consultés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.map(p => (
              <ProductCard key={p!.id} product={p!} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
