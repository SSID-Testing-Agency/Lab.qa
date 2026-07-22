import { Link } from 'react-router-dom'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useBugStore } from '@/store/bugStore'
import { PRODUCTS_MAP, effectivePrice } from '@/data/products'
import { Button } from '@/components/ui/Button'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { formatPrice } from '@/utils/price'

export function WishlistPage() {
  const ids     = useWishlistStore(s => s.ids)
  const remove  = useWishlistStore(s => s.remove)
  const clear   = useWishlistStore(s => s.clear)
  const addItem = useCartStore(s => s.addItem)
  const cartItems = useCartStore(s => s.items)
  const hasBug  = useBugStore(s => s.hasBug)
  const base    = import.meta.env.BASE_URL

  const products = ids.map(id => PRODUCTS_MAP.get(id)).filter(Boolean)

  function handleMoveToCart(id: string) {
    addItem(id)
    remove(id)
  }

  return (
    <div className="max-w-2xl">
      <Breadcrumb items={[{ label: 'Ma wishlist' }]} />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-fg">
          Ma wishlist
          {ids.length > 0 && (
            <span className="text-sm font-normal text-fg-muted ml-2">
              ({ids.length} article{ids.length > 1 ? 's' : ''})
            </span>
          )}
        </h1>
        {ids.length > 0 && (
          <button
            data-testid="wishlist-clear"
            onClick={clear}
            className="text-sm text-fg-muted hover:text-danger transition-colors bg-transparent border-none cursor-pointer"
          >
            Tout supprimer
          </button>
        )}
      </div>

      {ids.length === 0 ? (
        <div
          data-testid="wishlist-empty"
          className="bg-surface border border-border rounded-lg p-12 text-center"
        >
          <p className="text-fg-muted mb-4">Votre wishlist est vide.</p>
          <Link to="/catalog">Parcourir le catalogue →</Link>
        </div>
      ) : (
        <div
          data-testid="wishlist-list"
          className="bg-surface border border-border rounded-lg divide-y divide-border-muted"
        >
          {products.map(product => {
            if (!product) return null
            const cartQty    = cartItems.find(i => i.productId === product.id)?.quantity ?? 0
            const isOutOfStock = product.inventory === 0
            const isAtMax    = !isOutOfStock && product.inventory - cartQty <= 0
            const canAdd     = !isOutOfStock && !isAtMax
            const imageSrc   = hasBug('broken-images')
              ? `${base}images/broken.svg`
              : `${base}${product.image}`

            return (
              <div
                key={product.id}
                data-testid={`wishlist-item-${product.id}`}
                className="flex items-center gap-4 p-4"
              >
                {/* Thumbnail */}
                <Link to={`/product/${product.id}`} tabIndex={-1} aria-hidden="true" className="shrink-0">
                  <img
                    src={imageSrc}
                    alt={product.name}
                    className={`w-16 h-16 object-contain rounded bg-overlay p-1 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${product.id}`}
                    className="text-sm font-medium text-fg hover:text-accent no-underline line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {product.discount ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-mono text-sm font-medium text-success">
                          {formatPrice(effectivePrice(product) / 100)}
                        </span>
                        <span className="font-mono text-xs text-fg-faint line-through">
                          {formatPrice(product.price / 100)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-mono text-sm font-medium text-fg">
                        {formatPrice(product.price / 100)}
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="text-xs text-danger">Rupture de stock</span>
                    )}
                    {isAtMax && !isOutOfStock && (
                      <span className="text-xs text-warning">Déjà au max dans le panier</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    data-testid={`wishlist-add-to-cart-${product.id}`}
                    onClick={() => handleMoveToCart(product.id)}
                    disabled={!canAdd}
                    aria-label={`Ajouter ${product.name} au panier`}
                  >
                    + Panier
                  </Button>
                  <button
                    data-testid={`wishlist-remove-${product.id}`}
                    onClick={() => remove(product.id)}
                    aria-label={`Retirer ${product.name} de la wishlist`}
                    className="p-1.5 rounded-md text-fg-muted hover:text-danger transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
