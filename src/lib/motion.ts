import type { Transition, Variants } from 'motion/react'

/** Easing assinatura (ease-out-quint), o mesmo ritmo do Tuyo. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const

export const DUR = {
  fast: 0.16,
  base: 0.55,
  slow: 0.9,
} as const

export const STAGGER = 0.06

export const enter: Transition = { duration: DUR.base, ease: EASE_OUT }

/** Entrada padrão: sobe 24px, desfoca 8px → 0, opacity 0 → 1. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: enter,
  },
}

export const staggerParent = (delayChildren = 0, stagger = STAGGER): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren } },
})

/** Viewport padrão para whileInView. */
export const VIEWPORT = { once: true, amount: 0.35 } as const

/** Mapeia um valor de 0..1 para um subintervalo [start, end], com clamp. */
export const segment = (p: number, start: number, end: number) =>
  Math.min(1, Math.max(0, (p - start) / (end - start)))
