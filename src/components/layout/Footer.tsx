export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span className="font-mono text-base font-bold text-fg tracking-wide">
              <span className="text-accent">&gt;</span> ShopLab<span className="text-accent">.qa</span>
            </span>
            <p className="text-sm text-fg-muted leading-relaxed">
              Une boutique fictive proposée par SSID - Testing agency conçue pour la pratique des tests automatisés.
            </p>
          </div>

          {/* SSID */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-fg-faint">SSID - Testing Agency</h3>
            <address className="not-italic flex flex-col gap-0.5 text-sm text-fg-muted">
              <span>47 rue de la Fourmisière</span>
              <span>59242 Templeuve-en-Pévèle</span>
            </address>
          </div>

          {/* Liens */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-fg-faint">Liens</h3>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a href="https://www.ssid.fr" target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted hover:text-fg transition-colors no-underline">
                  Site web SSID Testing Agency
                </a>
              </li>
              <li>
                <a href="mailto:fdubois@ssid.fr" className="text-sm text-fg-muted hover:text-fg transition-colors no-underline">
                  Mail contact : fdubois@ssid.fr
                </a>
              </li>
            </ul>
          </div>

          {/* Formations */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-fg-faint">Formations</h3>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a href="https://www.ssid.fr/on-vous-forme/nouveau-playwright-augmentee-par-l-ia-niveau-avance/" target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted hover:text-fg transition-colors no-underline">
                  Playwright augmenté par l'IA
                </a>
              </li>
              <li>
                <a href="https://www.ssid.fr/on-vous-forme/certification-istqb-ct-gen-ai-intelligence-artificielle/" target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted hover:text-fg transition-colors no-underline">
                  ISTQB CT GenAI — Spécialiste Testeur
                </a>
              </li>
              <li>
                <a href="https://www.ssid.fr/on-vous-forme/certification-istqb-foundation/" target="_blank" rel="noopener noreferrer" className="text-sm text-fg-muted hover:text-fg transition-colors no-underline">
                  ISTQB Foundation
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-muted px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-xs text-fg-faint">
          © {year} SSID Testing Agency
        </span>
        <span className="text-xs text-fg-faint italic">
          Ceci n'est pas une vraie boutique.
        </span>
      </div>
    </footer>
  )
}
