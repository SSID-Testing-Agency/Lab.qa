import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Fil d'Ariane"
      data-testid="breadcrumb"
      className="flex items-center gap-1 text-xs text-fg-muted mb-5 flex-wrap"
    >
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && (
            <span className="text-fg-faint select-none" aria-hidden="true">/</span>
          )}
          {item.to ? (
            <Link
              to={item.to}
              className="hover:text-fg transition-colors no-underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-fg" aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
