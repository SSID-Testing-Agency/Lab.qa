type Step = 'info' | 'review' | 'payment' | 'confirmation'

interface CheckoutStepperProps {
  current: Step
}

const STEPS: Array<{ id: Step; label: string }> = [
  { id: 'info',         label: 'Informations' },
  { id: 'review',       label: 'Récapitulatif' },
  { id: 'payment',      label: 'Paiement' },
  { id: 'confirmation', label: 'Confirmation' },
]

export function CheckoutStepper({ current }: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex(s => s.id === current)

  return (
    <nav aria-label="Étapes de commande">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const isDone = i < currentIndex
          const isActive = i === currentIndex

          return (
            <li key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div
                  data-testid={`step-${step.id}`}
                  aria-current={isActive ? 'step' : undefined}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-medium transition-colors ${
                    isDone
                      ? 'bg-success text-canvas'
                      : isActive
                        ? 'bg-accent text-canvas'
                        : 'bg-overlay text-fg-faint border border-border'
                  }`}
                >
                  {isDone ? '✓' : i + 1}
                </div>
                <span className={`text-xs hidden sm:block ${isActive ? 'text-fg' : isDone ? 'text-success' : 'text-fg-faint'}`}>
                  {step.label}
                </span>
              </div>

              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 mx-2 ${i < currentIndex ? 'bg-success' : 'bg-border'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
