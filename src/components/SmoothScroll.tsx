import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { useReducedMotion } from 'motion/react'
import { registerLenis } from '../lib/scrollLock'

/**
 * Scroll suave com Lenis. Desligado quando o usuário prefere menos movimento.
 * O motion lê window.scrollY, então useScroll continua funcionando sem integração extra.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      anchors: { offset: -80 },
    })
    registerLenis(lenis)
    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      registerLenis(null)
      lenis.destroy()
    }
  }, [reduce])

  return <>{children}</>
}
