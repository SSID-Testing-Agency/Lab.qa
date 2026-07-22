import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import type { Product } from '@/data/products'
import { effectivePrice } from '@/data/products'
import { fetchProducts } from '@/api/products'
import { useBugStore } from '@/store/bugStore'
import { ProductCard } from '@/components/ProductCard'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { Select } from '@/components/ui/Select'
import { Pagination } from '@/components/ui/Pagination'
import type { SortOption, Category } from '@/types'

const PAGE_SIZE = 6

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'default',    label: 'Sélection' },
  { value: 'name-asc',   label: 'Nom A → Z' },
  { value: 'name-desc',  label: 'Nom Z → A' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
]

const CATEGORY_LABELS: Record<string, string> = {
  clothing:    'Vêtements',
  accessories: 'Accessoires',
  electronics: 'Électronique',
  books:       'Livres',
}

type PriceRange = 'all' | 'under-20' | '20-50' | '50-100' | 'over-100'

const PRICE_RANGES: Array<{ value: PriceRange; label: string }> = [
  { value: 'all',       label: 'Tous les prix' },
  { value: 'under-20',  label: '< 20 €' },
  { value: '20-50',     label: '20 – 50 €' },
  { value: '50-100',    label: '50 – 100 €' },
  { value: 'over-100',  label: '> 100 €' },
]

function matchesPriceRange(priceInCents: number, range: PriceRange): boolean {
  switch (range) {
    case 'all':       return true
    case 'under-20':  return priceInCents < 2000
    case '20-50':     return priceInCents >= 2000 && priceInCents < 5000
    case '50-100':    return priceInCents >= 5000 && priceInCents < 10000
    case 'over-100':  return priceInCents >= 10000
  }
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchQuery = searchParams.get('q') ?? ''
  const category = (searchParams.get('category') ?? 'all') as Category | 'all'
  const priceRange = (searchParams.get('priceRange') ?? 'all') as PriceRange
  const inStockOnly = searchParams.get('inStock') === 'true'
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)

  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const hasBug = useBugStore(s => s.hasBug)

  useEffect(() => {
    fetchProducts().then(data => { setProducts(data); setLoading(false) })
  }, [])

  const sortedProducts = useMemo(() => {
    const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)

    const filtered = products
      .filter(p => category === 'all' || p.category === category)
      .filter(p => !inStockOnly || p.inventory > 0)
      .filter(p => matchesPriceRange(effectivePrice(p), priceRange))
      .filter(p => terms.length === 0 || terms.every(t =>
        p.name.toLowerCase().includes(t) || p.description.toLowerCase().includes(t)
      ))

    const sorted = sortOption === 'default' ? [...filtered] : [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':   return a.name.localeCompare(b.name)
        case 'name-desc':  return b.name.localeCompare(a.name)
        case 'price-asc':  return a.price - b.price
        case 'price-desc': return b.price - a.price
      }
    })

    return hasBug('reversed-sort') ? sorted.reverse() : sorted
  }, [sortOption, category, searchQuery, priceRange, inStockOnly, hasBug, products])

  const totalPages  = Math.ceil(sortedProducts.length / PAGE_SIZE)
  const currentPage = Math.max(1, Math.min(pageParam, totalPages || 1))
  const pageStart   = (currentPage - 1) * PAGE_SIZE
  const paginated   = sortedProducts.slice(pageStart, pageStart + PAGE_SIZE)

  const hasActiveFilters = priceRange !== 'all' || inStockOnly

  // Any filter change resets to page 1
  function setParam(key: string, value: string | null) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (value === null || value === '') next.delete(key)
      else next.set(key, value)
      next.delete('page')
      return next
    }, { replace: true })
  }

  function goToPage(n: number) {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (n <= 1) next.delete('page')
      else next.set('page', String(n))
      return next
    }, { replace: true })
  }

  function resetSearch() {
    navigate('/catalog', { replace: true })
    setSortOption('default')
  }

  function resetFilters() {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      next.delete('priceRange')
      next.delete('inStock')
      next.delete('page')
      return next
    }, { replace: true })
  }

  const title = searchQuery
    ? <>Résultats pour <span className="text-accent">« {searchQuery} »</span></>
    : category !== 'all'
      ? CATEGORY_LABELS[category] ?? 'Catalogue'
      : 'Tous les produits'

  return (
    <div>
      {/* Title + sort row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <h1 className="text-xl font-medium text-fg">
          {title}{' '}
          {!loading && (
            <span className="text-sm font-normal text-fg-muted">
              ({sortedProducts.length} produit{sortedProducts.length !== 1 ? 's' : ''}
              {totalPages > 1 && ` — page ${currentPage}/${totalPages}`})
            </span>
          )}
        </h1>

        <Select
          id="sort-select"
          data-testid="sort-select"
          aria-label="Trier les produits"
          value={sortOption}
          onChange={e => {
            setSortOption(e.target.value as SortOption)
            setSearchParams(prev => { const n = new URLSearchParams(prev); n.delete('page'); return n }, { replace: true })
          }}
          options={SORT_OPTIONS}
        />
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {/* Price range pills */}
        <div
          role="group"
          aria-label="Filtrer par prix"
          className="flex items-center gap-1 flex-wrap"
        >
          {PRICE_RANGES.map(range => (
            <button
              key={range.value}
              data-testid={`filter-price-${range.value}`}
              onClick={() => setParam('priceRange', range.value === 'all' ? null : range.value)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer font-sans ${
                priceRange === range.value
                  ? 'bg-accent text-canvas border-accent font-medium'
                  : 'bg-transparent text-fg-muted border-border hover:border-border-strong hover:text-fg'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* In-stock toggle */}
        <label
          data-testid="filter-in-stock"
          className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors select-none ${
            inStockOnly
              ? 'bg-success text-canvas border-success font-medium'
              : 'bg-transparent text-fg-muted border-border hover:border-border-strong hover:text-fg'
          }`}
        >
          <input
            type="checkbox"
            className="sr-only"
            checked={inStockOnly}
            onChange={e => setParam('inStock', e.target.checked ? 'true' : null)}
          />
          En stock uniquement
        </label>

        {/* Reset filters */}
        {hasActiveFilters && (
          <button
            data-testid="filter-reset"
            onClick={resetFilters}
            className="px-3 py-1 text-xs text-fg-faint hover:text-fg transition-colors underline underline-offset-2 cursor-pointer bg-transparent border-none font-sans"
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Grid or empty state */}
      {loading ? (
        <div
          data-testid="product-grid-skeleton"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div
          data-testid="empty-state"
          className="flex flex-col items-center justify-center py-20 gap-4 text-center"
        >
          <span className="text-5xl select-none" aria-hidden="true">🔍</span>
          <div>
            <h2 className="text-base font-medium text-fg mb-1">
              {searchQuery ? 'Aucun résultat' : 'Aucun produit trouvé'}
            </h2>
            <p className="text-sm text-fg-muted max-w-xs leading-relaxed">
              {searchQuery
                ? <>Aucun produit ne correspond à <strong className="text-fg">« {searchQuery} »</strong>{hasActiveFilters ? ' avec les filtres actifs' : ''}.</>
                : hasActiveFilters
                  ? 'Aucun produit ne correspond aux filtres sélectionnés.'
                  : 'Cette catégorie ne contient aucun produit pour le moment.'}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {searchQuery && (
              <button
                data-testid="reset-search"
                onClick={resetSearch}
                className="px-4 py-2 bg-accent hover:bg-accent-hover text-canvas text-sm rounded-md transition-colors cursor-pointer border-none font-sans font-medium"
              >
                Réinitialiser la recherche
              </button>
            )}
            {hasActiveFilters && (
              <button
                data-testid="reset-filters-empty"
                onClick={resetFilters}
                className="px-4 py-2 border border-border hover:border-border-strong text-fg-muted hover:text-fg text-sm rounded-md transition-colors cursor-pointer bg-transparent font-sans"
              >
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div
            data-testid="product-grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {paginated.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination current={currentPage} total={totalPages} onChange={goToPage} />
        </>
      )}
    </div>
  )
}
