import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

// URLs réelles SSID — remplaçables si besoin
const PODCAST_URL    = 'https://linktr.ee/QGQualite'
const FORMATIONS_URL = 'https://www.ssid.fr/on-vous-forme/'

function randomPos() {
  return { x: 4 + Math.random() * 88, y: 4 + Math.random() * 88 }
}

function WalkingBug() {
  const [pos, setPos]         = useState(randomPos)
  const [caught, setCaught]   = useState(0)
  const [flash, setFlash]     = useState(false)
  const [showBubble, setShowBubble] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setPos(randomPos()), 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setTimeout(() => setShowBubble(false), 4000)
    return () => clearTimeout(id)
  }, [])

  function handleClick() {
    setFlash(true)
    setCaught(c => c + 1)
    setTimeout(() => { setFlash(false); setPos(randomPos()) }, 500)
  }

  return (
    <>
      <div
        data-testid="walking-bug"
        style={{
          position: 'fixed',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transition: 'left 1.2s cubic-bezier(.25,.46,.45,.94), top 1.2s cubic-bezier(.25,.46,.45,.94)',
          zIndex: 50,
        }}
      >
        {showBubble && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
            <div className="bg-surface border border-border text-fg text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-md">
              Catch me if you can!
            </div>
            {/* triangle */}
            <div className="w-0 h-0 mx-auto border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border" />
          </div>
        )}
        <button
          onClick={handleClick}
          aria-label="Attrape le bug !"
          title="Attrape le bug !"
          className="text-2xl bg-transparent border-none cursor-pointer select-none p-1 leading-none"
        >
          {flash ? '💥' : '🪲'}
        </button>
      </div>

      {caught > 0 && (
        <div
          data-testid="bug-caught-count"
          className="fixed bottom-4 right-4 text-xs text-fg-muted bg-surface border border-border rounded-md px-3 py-1.5 font-mono z-50"
        >
          🪲 × {caught} attrapé{caught > 1 ? 's' : ''}
        </div>
      )}
    </>
  )
}

const FLOWS = [
  { label: 'Login',     desc: 'Authentification & sessions' },
  { label: 'Catalogue', desc: 'Navigation & filtres' },
  { label: 'Panier',    desc: 'Gestion du panier' },
  { label: 'Checkout',  desc: 'Formulaires & validation' },
  { label: 'Paiement',  desc: 'Carte, refus, erreur serveur' },
  { label: 'Bug mode',  desc: 'Tests de régression' },
  { label: 'QA Lab',   desc: 'Catalogue des bugs' },
]

const ACCOUNTS = [
  { username: 'jean_dupont',   password: 'Baguette42!', desc: 'Parcours complet' },
  { username: 'compte_banni',  password: 'Baguette42!', desc: 'Compte verrouillé' },
  { username: 'client_chaos',  password: 'Baguette42!', desc: 'Éléments défectueux' },
  { username: 'tortue_du_web', password: 'Baguette42!', desc: 'Délai au login (3 s)' },
]

const FORMATIONS = [
  { title: 'Playwright augmenté par l\'IA', desc: 'Fixtures, Page Objects, agents IA (Planner, Generator, Healer).' },
  { title: 'Fondamentaux du test automatisé', desc: 'Stratégie, sélecteurs robustes, intégration CI/CD.' },
  { title: 'QA & IA en entreprise', desc: 'Industrialiser l\'usage de l\'IA dans les équipes qualité.' },
]

export function LandingPage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const base = import.meta.env.BASE_URL
  if (isAuthenticated) return <Navigate to="/catalog" replace />

  const sectionLabel = 'text-xs font-semibold uppercase tracking-widest text-fg-faint mb-4'

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center px-4 py-10 relative">
      <div className="absolute top-3 right-3">
        <ThemeToggle />
      </div>
      <WalkingBug />

      <div className="w-full max-w-6xl flex flex-col gap-8">

        {/* Logo Lab (boutique d'entraînement) */}
        <div className="text-center">
          <p className="font-mono text-3xl font-bold text-fg tracking-wide">
            <span className="text-accent">&gt;</span> Lab<span className="text-accent">.qa</span>
          </p>
          <p className="text-sm text-fg-muted mt-1">Boutique en ligne fictive d'entraînement QA</p>
        </div>

        {/* Grille 3 colonnes : entreprise · accès · formations */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_minmax(0,1fr)] gap-6 items-start">

          {/* ───────── COLONNE GAUCHE : entreprise + podcast ───────── */}
          <div className="flex flex-col gap-6">

            {/* SSID Testing Agency */}
            <div data-testid="ssid-card" className="bg-surface border border-border rounded-lg p-6">
              <div className="mb-4 flex justify-center">
                <img
                  src={`${base}images/brand/ssid-logo-blanc.png`}
                  alt="SSID Testing Agency"
                  width={200}
                  height={114}
                  className="h-auto w-auto max-h-[6.3rem] block [html.light_&]:hidden"
                />
                <img
                  src={`${base}images/brand/ssid-logo.png`}
                  alt="SSID Testing Agency"
                  width={200}
                  height={114}
                  className="h-auto w-auto max-h-[6.3rem] hidden [html.light_&]:block"
                />
              </div>
              <p className="text-sm text-fg-muted">
                Pure player de la qualification logicielle. Depuis 11 ans, chez SSID, nous aidons nos clients à garantir la qualité de leurs logiciels.<br />Audit, test, coaching, accompagnement, formation : notre expertise couvre toute la chaîne de l'assurance qualité.
              </p>
              <a
                href="https://www.ssid.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-sm text-primary hover:underline"
              >
                Découvrir SSID Testing Agency
              </a>
            </div>

            {/* Podcast QG Qualité */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className={sectionLabel}>Podcast</h2>
              <a
                href={PODCAST_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="podcast-link"
                className="group block no-underline rounded-md focus-visible:outline-none"
              >
                <div className="flex justify-center">
                  <img
                    src={`${base}images/brand/qg-qualite-logo.png`}
                    alt="Logo du podcast QG Qualité"
                    width={150}
                    height={128}
                    className="h-auto w-auto max-h-28"
                  />
                </div>
                <p className="text-xs text-fg-muted mt-3">
                  Le podcast QG Qualité, par SSID. Audio et vidéo.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs text-accent mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a8.25 8.25 0 0 1 16.5 0v5.25a2.25 2.25 0 0 1-2.25 2.25h-.75a.75.75 0 0 1-.75-.75v-3.75a.75.75 0 0 1 .75-.75h2.25m-16.5 0H6a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-.75.75h-.75A2.25 2.25 0 0 1 3 17.25V12Z" />
                  </svg>
                  Écouter le podcast →
                </span>
              </a>
            </div>
          </div>

          {/* ───────── COLONNE CENTRALE : accès au site d'entraînement ───────── */}
          <div className="flex flex-col gap-6">

            {/* Welcome */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h1 className="text-xl font-semibold text-fg mb-1">
                Bienvenue sur Lab.qa
              </h1>
              <p className="text-sm text-fg-muted">
                Objectif : s'entraîner aux tests E2E avec Playwright sur un parcours e-commerce complet.
              </p>
            </div>

            {/* Flows */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className={sectionLabel}>Parcours disponibles</h2>
              <div className="grid grid-cols-2 gap-3">
                {FLOWS.map(flow => (
                  <div
                    key={flow.label}
                    className="bg-canvas border border-border-muted rounded-md px-4 py-3"
                  >
                    <p className="text-sm font-medium text-fg">{flow.label}</p>
                    <p className="text-xs text-fg-muted mt-0.5">{flow.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accounts */}
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className={sectionLabel}>Comptes de test disponibles</h2>
              <div className="flex flex-col divide-y divide-border-muted">
                {ACCOUNTS.map(acc => (
                  <div
                    key={acc.username}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div>
                      <span className="font-mono text-sm text-accent">{acc.username}</span>
                      <span className="font-mono text-sm text-fg-faint"> / {acc.password}</span>
                    </div>
                    <span className="text-xs text-fg-muted shrink-0">{acc.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA principal */}
            <Link
              to="/login"
              data-testid="landing-start"
              className="w-full py-3 text-center bg-accent hover:bg-accent-hover text-canvas font-medium rounded-md transition-colors no-underline"
            >
              Accéder à la boutique →
            </Link>
          </div>

          {/* ───────── COLONNE DROITE : expertise régie + formations ───────── */}
          <div className="flex flex-col gap-6">
            <div className="bg-surface border border-border rounded-lg p-6">
              <h2 className={sectionLabel}>Expertise Régie Testing</h2>
              <p className="text-sm text-fg-muted">
                SSID Testing Agency dispose d'une cellule d'expertise et d'excellence qualité pour accompagner à la fois l'équipe et nos clients sur la méthodologie qualité, les bonnes pratiques de test, l'accompagnement aux spécificités du test en contexte agile Scrum Kanban, l'amélioration continue, mais aussi la mise en œuvre de solutions techniques variées (ex : POC Cypress, Playwright, Selenium, Robot Framework, tests d'API ...)
              </p>
            </div>

            <div data-testid="formations-card" className="bg-surface border border-border rounded-lg p-6">
              <h2 className={sectionLabel}>Nos formations</h2>
              <div className="flex flex-col divide-y divide-border-muted">
                {FORMATIONS.map(f => (
                  <div key={f.title} className="py-3 first:pt-0 last:pb-0">
                    <p className="text-sm font-medium text-fg">{f.title}</p>
                    <p className="text-xs text-fg-muted mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
              <a
                href={FORMATIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="landing-formations"
                className="mt-4 w-full inline-block py-2.5 text-center bg-canvas border border-border hover:border-accent text-fg text-sm font-medium rounded-md transition-colors no-underline"
              >
                Voir les formations QA &amp; Playwright →
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
