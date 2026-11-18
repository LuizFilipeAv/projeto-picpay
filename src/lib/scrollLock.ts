import type Lenis from 'lenis'

/**
 * Trava de scroll compartilhada (cortina, menu mobile...).
 * `overflow: hidden` sozinho não basta: o Lenis rola via scrollTo programático,
 * então a trava também para a instância do Lenis. Contador permite travas aninhadas.
 */
let lenis: Lenis | null = null
let locks = 0

export function registerLenis(instance: Lenis | null) {
  lenis = instance
  if (instance && locks > 0) instance.stop()
}

export function lockScroll() {
  locks += 1
  if (locks === 1) {
    document.documentElement.style.overflow = 'hidden'
    lenis?.stop()
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1)
  if (locks === 0) {
    document.documentElement.style.overflow = ''
    lenis?.start()
  }
}
