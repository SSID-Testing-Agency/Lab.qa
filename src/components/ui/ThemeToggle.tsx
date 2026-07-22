import { useState, useEffect } from 'react'

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-9H21M3 12H2.34M18.36 5.64l-.7.7M6.34 17.66l-.7.7M18.36 18.36l-.7-.7M6.34 6.34l-.7-.7M12 7a5 5 0 100 10A5 5 0 0012 7z" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
    </svg>
  )
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [isLight, setIsLight] = useState(() => document.documentElement.classList.contains('light'))

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight)
    localStorage.setItem('theme', isLight ? 'light' : 'dark')
  }, [isLight])

  return (
    <button
      data-testid="theme-toggle"
      onClick={() => setIsLight(v => !v)}
      aria-label={isLight ? 'Passer en mode sombre' : 'Passer en mode clair'}
      className={`text-fg-muted hover:text-fg transition-colors bg-transparent border-none cursor-pointer w-11 h-11 flex items-center justify-center rounded-md hover:bg-overlay ${className}`}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}
