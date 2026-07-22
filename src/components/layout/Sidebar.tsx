import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const CATEGORIES = [
  { value: 'clothing',    label: 'Vêtements' },
  { value: 'accessories', label: 'Accessoires' },
  { value: 'electronics', label: 'Électronique' },
  { value: 'books',       label: 'Livres' },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
      aria-hidden="true"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [catOpen, setCatOpen] = useState(true)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterError, setNewsletterError] = useState('')
  const [newsletterSuccess, setNewsletterSuccess] = useState(false)
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const logout = useAuthStore(s => s.logout)

  const currentCategory = searchParams.get('category') ?? 'all'
  const isCatalog = location.pathname === '/catalog'
  const isAllProducts = isCatalog && currentCategory === 'all'
  const isAccount = location.pathname === '/account'
  const isWishlist = location.pathname === '/wishlist'
  const isAbout = location.pathname === '/about'
  const isQaLab = location.pathname === '/qa-lab'

  // Close mobile drawer on navigation
  useEffect(() => { onClose() }, [location.pathname, location.search])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterError('Adresse email invalide')
      return
    }
    setNewsletterSuccess(true)
    setNewsletterEmail('')
    setNewsletterError('')
  }

  function handleResetClick() {
    if (!resetConfirm) {
      setResetConfirm(true)
      resetTimerRef.current = setTimeout(() => setResetConfirm(false), 3000)
    } else {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      localStorage.clear()
      window.location.replace(window.location.origin + window.location.pathname)
    }
  }

  const navLink = 'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors no-underline w-full'
  const activeLink = `${navLink} bg-accent/10 text-accent font-medium`
  const inactiveLink = `${navLink} text-fg-muted hover:text-fg hover:bg-overlay`

  const content = (
    <div className="flex flex-col gap-1 p-3 h-full">

      {/* Close button — mobile only */}
      <div className="flex items-center justify-between mb-2 lg:hidden">
        <span className="font-mono text-sm font-medium text-fg">Menu</span>
        <button
          onClick={onClose}
          aria-label="Fermer le menu"
          className="text-fg-muted hover:text-fg transition-colors bg-transparent border-none cursor-pointer p-1 rounded-md hover:bg-overlay"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tous les produits */}
      <Link
        to="/catalog"
        data-testid="sidebar-all-products"
        className={isAllProducts ? activeLink : inactiveLink}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6h16.5M3.75 12h16.5M3.75 18h16.5" />
        </svg>
        Tous les produits
      </Link>

      {/* Catégorie — accordéon */}
      <div>
        <button
          onClick={() => setCatOpen(v => !v)}
          aria-expanded={catOpen}
          aria-controls="sidebar-cat-list"
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-fg-muted hover:text-fg hover:bg-overlay rounded-md transition-colors cursor-pointer bg-transparent border-none font-sans"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Catégorie
          </span>
          <ChevronIcon open={catOpen} />
        </button>

        {catOpen && (
          <ul id="sidebar-cat-list" className="mt-1 ml-4 flex flex-col gap-0.5 border-l border-border-muted pl-3">
            {CATEGORIES.map(cat => {
              const isActive = isCatalog && currentCategory === cat.value
              return (
                <li key={cat.value}>
                  <Link
                    to={`/catalog?category=${cat.value}`}
                    data-testid={`sidebar-category-${cat.value}`}
                    className={isActive ? activeLink : inactiveLink}
                  >
                    {cat.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="my-2 border-t border-border-muted" />

      {/* Wishlist */}
      <Link
        to="/wishlist"
        data-testid="sidebar-wishlist"
        className={isWishlist ? activeLink : inactiveLink}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
        Wishlist
      </Link>

      {/* Mon compte */}
      <Link
        to="/account"
        data-testid="sidebar-account"
        className={isAccount ? activeLink : inactiveLink}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        Mon compte
      </Link>

      {/* QA Lab */}
      <Link
        to="/qa-lab"
        data-testid="sidebar-qa-lab"
        className={isQaLab ? activeLink : inactiveLink}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
        QA Lab
      </Link>

      {/* About */}
      <Link
        to="/about"
        data-testid="sidebar-about"
        className={isAbout ? activeLink : inactiveLink}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        À propos
      </Link>

      {/* Newsletter */}
      <div className="px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint mb-2">
          Newsletter
        </p>
        {newsletterSuccess ? (
          <p data-testid="newsletter-success" className="text-xs text-success">
            Inscription confirmée ✓
          </p>
        ) : (
          <form
            data-testid="newsletter-form"
            onSubmit={handleNewsletterSubmit}
            noValidate
            className="flex flex-col gap-1.5"
          >
            <input
              type="email"
              data-testid="newsletter-email"
              value={newsletterEmail}
              onChange={e => { setNewsletterEmail(e.target.value); setNewsletterError('') }}
              placeholder="votre@email.com"
              aria-label="Adresse email pour la newsletter"
              aria-invalid={newsletterError ? true : undefined}
              aria-describedby={newsletterError ? 'newsletter-email-error' : undefined}
              className="w-full px-2.5 py-1.5 bg-canvas border border-border rounded text-xs text-fg placeholder:text-fg-faint focus:outline-none focus:border-accent transition-colors"
            />
            {newsletterError && (
              <p id="newsletter-email-error" data-testid="newsletter-error" className="text-xs text-danger">
                {newsletterError}
              </p>
            )}
            <button
              type="submit"
              data-testid="newsletter-submit"
              className="w-full px-3 py-1.5 text-xs bg-accent hover:bg-accent-hover text-canvas rounded transition-colors cursor-pointer border-none font-sans font-medium"
            >
              S'inscrire
            </button>
          </form>
        )}
      </div>

      <div className="my-1 border-t border-border-muted" />

      {/* Déconnexion */}
      <button
        data-testid="sidebar-logout"
        onClick={handleLogout}
        className={`${inactiveLink} hover:text-danger text-left`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        Déconnexion
      </button>

      {/* Reset session */}
      <button
        data-testid="sidebar-reset-session"
        onClick={handleResetClick}
        className={`${inactiveLink} text-left transition-colors ${
          resetConfirm
            ? 'text-danger bg-danger/10 hover:text-danger'
            : 'text-fg-faint hover:text-warning'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        {resetConfirm ? 'Confirmer ?' : 'Réinitialiser la session'}
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside
        data-testid="sidebar"
        className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border overflow-y-auto"
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-canvas/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer */}
          <aside
            data-testid="sidebar-mobile"
            className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border overflow-y-auto lg:hidden"
          >
            {content}
          </aside>
        </>
      )}
    </>
  )
}
