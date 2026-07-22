import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/Badge'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { PRODUCTS } from '@/data/products'

interface HeaderProps {
  onMenuToggle: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const count = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0))
  const wishlistCount = useWishlistStore(s => s.ids.length)
  const logout = useAuthStore(s => s.logout)
  const base = import.meta.env.BASE_URL

  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get('q') ?? '')

  useEffect(() => {
    setQuery(new URLSearchParams(location.search).get('q') ?? '')
  }, [location.search])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
  }

  function handleChange(value: string) {
    setQuery(value)
    const q = value.trim()
    // ponytail: autocomplétion à partir de 3 lettres — évite le bruit des requêtes trop courtes
    if (q.length >= 3) navigate(`/catalog?q=${encodeURIComponent(q)}`, { replace: true })
    else if (q.length === 0) navigate('/catalog', { replace: true })
  }

  return (
    <header
      data-testid="navbar"
      className="sticky top-0 z-50 bg-surface border-b border-border"
    >
      {/* Row 1 : logo + actions */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-20 flex items-center gap-3">

        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuToggle}
          aria-label="Ouvrir le menu"
          className="lg:hidden text-fg-muted hover:text-fg transition-colors bg-transparent border-none cursor-pointer p-1 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Logo entreprise — visible après connexion */}
        <span className="shrink-0 flex items-center self-center mt-4">
          <img
            src={`${base}images/brand/ssid-logo-blanc.png`}
            alt="SSID Testing Agency"
            title="SSID Testing Agency"
            data-testid="company-logo-dark"
            className="h-[5.4rem] w-auto mt-1 block [html.light_&]:hidden"
          />
          <img
            src={`${base}images/brand/ssid-logo.png`}
            alt="SSID Testing Agency"
            title="SSID Testing Agency"
            data-testid="company-logo-light"
            className="h-[6.3rem] w-auto hidden [html.light_&]:block"
          />
        </span>

        {/* Logo */}
        <Link to="/" className="flex-1 text-center font-mono text-3xl font-bold text-fg no-underline tracking-wide">
          <span className="text-accent">&gt;</span> ShopLab<span className="text-accent">.qa</span>
        </Link>

        {/* Actions */}
        <nav className="flex items-center self-center gap-2 shrink-0" aria-label="Navigation principale">
          <ThemeToggle />

          <Link
            to="/wishlist"
            className="relative inline-flex items-center text-fg-muted hover:text-fg transition-colors no-underline p-1.5 rounded-md hover:bg-overlay"
            aria-label={`Wishlist — ${wishlistCount} article${wishlistCount > 1 ? 's' : ''}`}
            data-testid="wishlist-icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <Badge count={wishlistCount} data-testid="wishlist-count" />
          </Link>

          <Link
            to="/cart"
            className="relative inline-flex items-center text-fg-muted hover:text-fg transition-colors no-underline p-1.5 rounded-md hover:bg-overlay"
            aria-label={`Panier — ${count} article${count > 1 ? 's' : ''}`}
            data-testid="cart-icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <Badge count={count} data-testid="cart-count" />
          </Link>

          <button
            onClick={() => { logout(); navigate('/login') }}
            aria-label="Se déconnecter"
            data-testid="logout-button"
            className="inline-flex items-center text-fg-muted hover:text-fg transition-colors p-1.5 rounded-md hover:bg-overlay bg-transparent border-none cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Row 2 : search bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-2 flex justify-center">
        <form className="w-full max-w-xl"
          onSubmit={handleSearch}
          role="search"
          aria-label="Rechercher un produit"
        >
          <div className="flex items-center border border-border rounded-md overflow-hidden focus-within:border-accent transition-colors">
            <input
              type="search"
              data-testid="search-input"
              value={query}
              onChange={e => handleChange(e.target.value)}
              placeholder="Rechercher un produit..."
              aria-label="Rechercher un produit"
              className="flex-1 bg-canvas px-4 py-1.5 text-sm text-fg placeholder:text-fg-faint focus:outline-none"
              list="product-suggestions"
            />
            {/* ponytail: suggestions depuis le catalogue statique = même source que le fallback de fetchProducts.
                Si un vrai /api/products diverge un jour, sourcer la datalist via fetchProducts. */}
            <datalist id="product-suggestions">
              {PRODUCTS.map(p => <option key={p.id} value={p.name} />)}
            </datalist>
            <button
              type="submit"
              data-testid="search-button"
              aria-label="Lancer la recherche"
              className="px-3 py-1.5 bg-overlay hover:bg-border border-l border-border text-fg-muted hover:text-fg transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
              </svg>
            </button>
          </div>
          {query.trim().length > 0 && query.trim().length < 3 && (
            <p data-testid="search-hint" className="mt-1 px-1 text-xs text-fg-faint">
              Saisissez au moins 3 lettres pour lancer la recherche.
            </p>
          )}
        </form>
      </div>
    </header>
  )
}
