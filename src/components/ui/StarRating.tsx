import { useId } from 'react'

const STAR_PATH =
  'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z'

function Star({ fill, px }: { fill: 0 | 0.5 | 1; px: number }) {
  const clipId = useId()

  if (fill === 1) {
    return (
      <svg width={px} height={px} viewBox="0 0 24 24" fill="#FBBF24" aria-hidden="true">
        <path d={STAR_PATH} />
      </svg>
    )
  }

  if (fill === 0) {
    return (
      <svg width={px} height={px} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-fg-faint" aria-hidden="true">
        <path d={STAR_PATH} />
      </svg>
    )
  }

  // Half star: outline underneath, filled star clipped to left half
  return (
    <svg width={px} height={px} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="12" height="24" />
        </clipPath>
      </defs>
      <path d={STAR_PATH} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-fg-faint)' }} />
      <path d={STAR_PATH} fill="#FBBF24" clipPath={`url(#${clipId})`} />
    </svg>
  )
}

interface StarRatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md'
}

export function StarRating({ value, count, size = 'sm' }: StarRatingProps) {
  const px = size === 'md' ? 20 : 14
  const rounded = Math.round(value * 2) / 2

  const stars = Array.from({ length: 5 }, (_, i) => {
    const pos = i + 1
    if (rounded >= pos)       return 1 as const
    if (rounded >= pos - 0.5) return 0.5 as const
    return 0 as const
  })

  return (
    <div
      className="flex items-center gap-1"
      aria-label={`Note : ${value} sur 5${count !== undefined ? `, ${count} avis` : ''}`}
    >
      <div className="flex items-center gap-0.5">
        {stars.map((fill, i) => (
          <Star key={i} fill={fill} px={px} />
        ))}
      </div>
      <span className={`font-mono tabular-nums text-fg-muted ${size === 'md' ? 'text-sm' : 'text-xs'}`}>
        {value.toFixed(1)}
      </span>
      {count !== undefined && (
        <span className={`text-fg-faint ${size === 'md' ? 'text-sm' : 'text-xs'}`}>
          ({count.toLocaleString('fr-FR')})
        </span>
      )}
    </div>
  )
}
