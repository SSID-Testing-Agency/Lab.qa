interface PaginationProps {
  current: number
  total: number
  onChange: (page: number) => void
}

type PageItem = number | '…'

function buildRange(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: PageItem[] = [1]

  if (current > 3) pages.push('…')

  const start = Math.max(2, current - 1)
  const end   = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')

  pages.push(total)
  return pages
}

export function Pagination({ current, total, onChange }: PaginationProps) {
  if (total <= 1) return null

  const pages = buildRange(current, total)

  const btnBase =
    'inline-flex items-center justify-center w-8 h-8 text-sm rounded-md transition-colors cursor-pointer border font-sans'
  const btnActive =
    'bg-accent text-canvas border-accent font-medium'
  const btnInactive =
    'bg-transparent text-fg-muted border-border hover:border-border-strong hover:text-fg'
  const btnDisabled =
    'bg-transparent text-fg-faint border-border opacity-40 cursor-not-allowed'

  return (
    <nav
      aria-label="Pagination"
      data-testid="pagination"
      className="flex items-center justify-center gap-1 mt-8"
    >
      <button
        data-testid="pagination-prev"
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        aria-label="Page précédente"
        className={`${btnBase} ${current === 1 ? btnDisabled : btnInactive}`}
      >
        ‹
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-8 text-center text-sm text-fg-faint select-none">
            …
          </span>
        ) : (
          <button
            key={p}
            data-testid={p === current ? 'pagination-current' : `pagination-page-${p}`}
            onClick={() => onChange(p)}
            aria-current={p === current ? 'page' : undefined}
            aria-label={`Page ${p}`}
            className={`${btnBase} ${p === current ? btnActive : btnInactive}`}
          >
            {p}
          </button>
        )
      )}

      <button
        data-testid="pagination-next"
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        aria-label="Page suivante"
        className={`${btnBase} ${current === total ? btnDisabled : btnInactive}`}
      >
        ›
      </button>
    </nav>
  )
}
