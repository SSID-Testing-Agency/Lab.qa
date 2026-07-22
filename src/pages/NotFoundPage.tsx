import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 text-center relative">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>

      <p
        data-testid="not-found-code"
        className="font-mono text-8xl font-bold text-fg-faint select-none mb-6 leading-none"
      >
        404
      </p>

      <h1 className="text-2xl font-semibold text-fg mb-2">Page introuvable</h1>
      <p className="text-fg-muted text-sm mb-8 max-w-sm leading-relaxed">
        Cette URL n'existe pas sur{' '}
        <span className="font-mono">Lab<span className="text-accent">.qa</span></span>.
        {' '}Vérifiez l'adresse ou revenez au catalogue.
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        <Link
          to="/catalog"
          data-testid="not-found-catalog"
          className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-canvas rounded-md text-sm font-medium transition-colors no-underline"
        >
          Retour au catalogue
        </Link>
        <Link
          to="/"
          data-testid="not-found-home"
          className="px-5 py-2.5 border border-border hover:border-border-strong text-fg-muted hover:text-fg rounded-md text-sm transition-colors no-underline"
        >
          Page d'accueil
        </Link>
      </div>

      <p className="mt-12 text-xs text-fg-faint font-mono">
        <span className="text-accent">&gt;</span> Lab<span className="text-accent">.qa</span> — QA Training Store
      </p>
    </div>
  )
}
