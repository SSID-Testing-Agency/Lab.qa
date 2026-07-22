interface BadgeProps {
  count: number
  'data-testid'?: string
}

export function Badge({ count, 'data-testid': testId }: BadgeProps) {
  if (count <= 0) return null
  return (
    <span
      data-testid={testId}
      className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-accent text-canvas text-[11px] font-bold rounded-full flex items-center justify-center px-1 leading-none"
    >
      {count > 99 ? '99+' : count}
    </span>
  )
}
