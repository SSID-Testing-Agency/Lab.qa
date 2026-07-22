import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { USERS_MAP } from '@/data/users'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore(s => s.login)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) return <Navigate to="/catalog" replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Le nom d\'utilisateur est requis')
      return
    }
    if (!password.trim()) {
      setError('Le mot de passe est requis')
      return
    }

    const user = USERS_MAP.get(username)

    if (!user || user.password !== password) {
      setError('Le nom d\'utilisateur et le mot de passe ne correspondent à aucun utilisateur de ce service')
      return
    }

    if (user.role === 'locked_out_user') {
      setError('Désolé, ce compte est verrouillé')
      return
    }

    setLoading(true)

    if (user.role === 'performance_glitch_user') {
      await new Promise(resolve => setTimeout(resolve, 3000))
    }

    login(user.username, user.role)
    navigate('/catalog')
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}images/brand/ssid-logo-blanc.png`}
              alt="SSID Testing Agency"
              className="h-[6.3rem] w-auto block [html.light_&]:hidden"
            />
            <img
              src={`${import.meta.env.BASE_URL}images/brand/ssid-logo.png`}
              alt="SSID Testing Agency"
              className="h-[6.3rem] w-auto hidden [html.light_&]:block"
            />
          </div>
          <h1 className="font-mono text-3xl font-bold text-fg tracking-wide">
            <span className="text-accent">&gt;</span> Lab<span className="text-accent">.qa</span>
          </h1>
          <p className="text-sm text-fg-muted mt-2">Boutique d'entraînement QA</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-base font-medium text-fg mb-6">Connexion</h2>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <Input
              id="username"
              label="Nom d'utilisateur"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              value={username}
              onChange={e => setUsername(e.target.value)}
              data-testid="login-username"
              disabled={loading}
              placeholder="jean_dupont"
            />

            <Input
              id="password"
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              data-testid="login-password"
              disabled={loading}
              placeholder="Baguette42!"
            />

            {error && (
              <div
                data-testid="login-error"
                role="alert"
                className="text-sm text-danger bg-danger-bg border border-danger/30 rounded px-3 py-2"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              data-testid="login-submit"
              disabled={loading}
              className="w-full mt-2"
            >
              {loading ? 'Connexion en cours…' : 'Se connecter'}
            </Button>
          </form>
        </div>

        <details className="mt-6 bg-surface border border-border rounded-lg p-4">
          <summary className="text-sm text-fg-muted cursor-pointer hover:text-fg transition-colors">
            Comptes disponibles
          </summary>
          <div className="mt-3 space-y-2">
            {['jean_dupont', 'compte_banni', 'client_chaos', 'tortue_du_web'].map(u => (
              <div key={u} className="font-mono text-xs text-fg-muted">
                <span className="text-accent">{u}</span> / Baguette42!
              </div>
            ))}
          </div>
        </details>

        <div className="mt-3">
          <button
            type="button"
            data-testid="login-quick"
            disabled={loading}
            onClick={() => { login('jean_dupont', 'standard_user'); navigate('/catalog') }}
            className="w-full py-2 text-sm text-fg-muted hover:text-fg border border-border hover:border-border-strong rounded-md transition-colors bg-transparent cursor-pointer"
          >
            Connexion rapide — Jean Dupont
          </button>
          <p className="text-xs text-fg-faint text-center mt-2">Ne pas utiliser lors des exercices.</p>
        </div>
      </div>
    </div>
  )
}
