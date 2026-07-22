export function AboutPage() {
  return (
    <div className="max-w-2xl py-4">
      <h1 className="text-2xl font-semibold text-fg mb-2">À propos de Lab<span className="text-accent">.qa</span></h1>
      <p className="text-fg-muted mb-6 text-sm">Un terrain d'entraînement pour les QA et les passionnés de Playwright.</p>

      <div className="flex flex-col gap-6">
        <section className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-base font-medium text-fg mb-2">C'est quoi ?</h2>
          <p className="text-sm text-fg-muted leading-relaxed">
            Lab est une fausse boutique e-commerce conçue pour apprendre l'automatisation de tests.
            Chaque écran, chaque bouton et chaque prix existe pour être testé — pas pour être acheté.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-base font-medium text-fg mb-3">Stack technique</h2>
          <ul className="flex flex-col gap-1.5">
            {[
              ['React 19', 'UI'],
              ['Vite 6', 'Build'],
              ['TypeScript', 'Typage'],
              ['Tailwind CSS v4', 'Styles'],
              ['Zustand', 'État global'],
              ['React Router v7', 'Navigation'],
              ['Playwright', 'Tests E2E'],
            ].map(([tech, role]) => (
              <li key={tech} className="flex items-center justify-between text-sm">
                <span className="font-mono text-accent">{tech}</span>
                <span className="text-fg-faint">{role}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-base font-medium text-fg mb-2">Bug Mode</h2>
          <p className="text-sm text-fg-muted leading-relaxed">
            Le site embarque un mode bugs intentionnels pour s'entraîner à détecter des régressions :
            tri inversé, images cassées, ajout au panier défaillant. Active-le depuis la console.
          </p>
        </section>

        <section className="bg-surface border border-border rounded-lg p-5">
          <h2 className="text-base font-medium text-fg mb-2">Auteur</h2>
          <p className="text-sm text-fg-muted">
            Conçu par{' '}
            <a href="https://ssid-testing-agency.github.io/website/" className="text-accent" target="_blank" rel="noreferrer">
              Romuald Lenormand
            </a>
            , QA Engineer chez{' '}
            <a href="https://ssid.fr" className="text-accent" target="_blank" rel="noreferrer">
              SSID
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
