export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col animate-pulse"
    >
      <div className="w-full h-48 bg-overlay" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-4 bg-overlay rounded w-3/4" />
        <div className="h-3 bg-overlay rounded w-1/2" />
        <div className="flex items-center justify-between mt-1">
          <div className="h-4 bg-overlay rounded w-16" />
          <div className="h-8 bg-overlay rounded w-20" />
        </div>
      </div>
    </div>
  )
}
