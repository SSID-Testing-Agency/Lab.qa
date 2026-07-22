export function BugBanner() {
  return (
    <div
      data-testid="bug-mode-banner"
      role="alert"
      className="bg-warning text-canvas text-sm font-mono font-medium px-4 py-2 text-center"
    >
      ⚠ Bug mode actif — certaines fonctionnalités sont intentionnellement cassées pour l'entraînement QA
    </div>
  )
}
