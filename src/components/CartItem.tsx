import type { Product } from '@/data/products'
import { effectivePrice } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/utils/price'

interface CartItemProps {
  productId: string
  size?: string
  quantity: number
  product: Product
  onRemove: (productId: string, quantity: number, size?: string) => void
}

export function CartItem({ productId, size, quantity, product, onRemove }: CartItemProps) {
  const updateQuantity = useCartStore(s => s.updateQuantity)
  const base = import.meta.env.BASE_URL
  const atMax = quantity >= product.inventory

  function handleDecrease() {
    if (quantity <= 1) onRemove(productId, 1, size)
    else updateQuantity(productId, quantity - 1, size)
  }

  return (
    <div
      data-testid={`cart-item-${productId}${size ? `-${size.toLowerCase()}` : ''}`}
      className="flex items-start gap-4 py-4 border-b border-border last:border-0"
    >
      <img
        src={`${base}${product.image}`}
        alt={product.name}
        className="w-16 h-16 object-contain bg-overlay rounded p-1 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-fg">{product.name}</p>
        {size && (
          <p className="text-xs text-fg-muted mt-0.5">Taille : <span className="font-medium text-fg">{size}</span></p>
        )}
        <p className="text-xs text-fg-muted font-mono mt-0.5">
          {product.discount ? (
            <>
              <span className="text-success">{formatPrice(effectivePrice(product) / 100)}</span>
              <span className="line-through ml-1 text-fg-faint">{formatPrice(product.price / 100)}</span>
              <span> / unité</span>
            </>
          ) : (
            <>{formatPrice(product.price / 100)} / unité</>
          )}
        </p>
        {atMax && (
          <p data-testid={`cart-max-${productId}`} className="text-xs text-warning mt-1">
            Stock max atteint ({product.inventory})
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Stepper */}
        <div className="flex items-center gap-1">
          <button
            data-testid={`cart-decrease-${productId}`}
            onClick={handleDecrease}
            aria-label={`Diminuer la quantité de ${product.name}`}
            className="w-7 h-7 flex items-center justify-center border border-border rounded text-fg-muted hover:text-fg hover:border-border-strong transition-colors bg-transparent cursor-pointer text-base leading-none"
          >
            −
          </button>
          <input
            id={`qty-${productId}${size ? `-${size}` : ''}`}
            data-testid={`cart-quantity-${productId}`}
            type="number"
            min={1}
            max={product.inventory}
            value={quantity}
            onChange={e => updateQuantity(productId, parseInt(e.target.value) || 1, size)}
            className="w-10 py-1 bg-canvas border border-border rounded text-sm text-fg text-center focus:outline-none focus:border-accent"
            aria-label={`Quantité pour ${product.name}${size ? ` taille ${size}` : ''}`}
          />
          <button
            data-testid={`cart-increase-${productId}`}
            onClick={() => updateQuantity(productId, quantity + 1, size)}
            disabled={atMax}
            aria-label={`Augmenter la quantité de ${product.name}`}
            className="w-7 h-7 flex items-center justify-center border border-border rounded text-fg-muted hover:text-fg hover:border-border-strong transition-colors bg-transparent cursor-pointer text-base leading-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        <span className="font-mono font-medium text-fg w-20 text-right">
          {formatPrice((effectivePrice(product) * quantity) / 100)}
        </span>

        <button
          data-testid={`cart-remove-${productId}`}
          onClick={() => onRemove(productId, quantity, size)}
          aria-label={`Retirer ${product.name}${size ? ` taille ${size}` : ''} du panier`}
          className="text-fg-faint hover:text-danger transition-colors bg-transparent border-none cursor-pointer p-1 text-sm"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
