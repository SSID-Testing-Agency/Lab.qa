import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useBugStore } from '@/store/bugStore'
import { useAuthStore } from '@/store/authStore'

export function useBugMode() {
  const [searchParams] = useSearchParams()
  const role = useAuthStore(s => s.role)
  const { initFromContext, hasBug, isBugMode } = useBugStore()

  useEffect(() => {
    const urlBugs = searchParams.get('bugs') === 'true'
    initFromContext(urlBugs, role)
  }, [searchParams, role, initFromContext])

  return { hasBug, isBugMode }
}
