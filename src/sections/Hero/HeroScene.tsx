import type { ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { CreditCard } from '../Cards/CreditCard'
import { CARDS } from '../Cards/cards'
import { EASE_OUT } from '../../lib/motion'
import styles from './Hero.module.css'

type Props = {
  /** Ponteiro normalizado -1..1 (com mola). */
  px: MotionValue<number>
  py: MotionValue<number>
  /** Progresso de saída da hero pelo scroll, 0..1. */
  exit: MotionValue<number>
  revealed: boolean
  reduce: boolean
}

const platinum = CARDS.find((c) => c.id === 'platinum')!
const black = CARDS.find((c) => c.id === 'black')!

/**
 * Cena da hero, montada em camadas de profundidade:
 *   órbitas (fundo) → cartão Black → cartão Platinum (herói) → chips flutuantes (frente)
 * Cada camada anda com o ponteiro na proporção da sua profundidade.
 */
export function HeroScene({ px, py, exit, revealed, reduce }: Props) {
  const far = useDepth(px, py, -10)
  const mid = useDepth(px, py, 18)
  const near = useDepth(px, py, 34)

  // Cartão herói: inclina com o ponteiro e, no scroll, gira e cresce "vindo" para a próxima seção.
  const heroRotY = useTransform(px, (v) => v * 16)
  const heroRotX = useTransform(py, (v) => -v * 12)
  const heroRotZ = useTransform(exit, [0, 1], [-14, 6])
  const heroScale = useTransform(exit, [0, 1], [1, 1.18])
  // Soma a paralaxe do ponteiro com a subida do scroll.
  const heroY = useTransform([py, exit], ([v, e]: number[]) => v * 34 - e * 140)
  const sheen = useTransform(px, (v) => 35 + v * 30)

  const backRotZ = useTransform(exit, [0, 1], [12, 22])
  const chipsY = useTransform(exit, [0, 1], ['0%', '-60%'])

  const show = revealed || reduce
  const t = (delay: number, duration = 1.1) => ({ duration, ease: EASE_OUT, delay: reduce ? 0 : delay })

  return (
    <div className={styles.scene} aria-hidden>
      {/* Órbitas: desenham-se na entrada e giram devagar (camada ambiente). */}
      <motion.svg className={styles.orbits} viewBox="0 0 600 600" style={far}>
        {[290, 220, 150].map((r, i) => (
          <motion.circle
            key={r}
            cx="300"
            cy="300"
            r={r}
            className={styles.orbit}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={show ? { pathLength: 1, opacity: 1 } : undefined}
            transition={t(0.4 + i * 0.12, 1.6)}
          />
        ))}
        <circle cx="300" cy="10" r="5" className={styles.orbitDot} />
        <circle cx="520" cy="300" r="4" className={styles.orbitDot} />
      </motion.svg>

      {/* Cartão de trás */}
      <motion.div className={styles.backCard} style={mid}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 160, rotate: 40, scale: 0.8 }}
          animate={show ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : undefined}
          transition={t(0.42, 1.3)}
        >
          <motion.div className={styles.bobSlow} style={{ rotate: backRotZ }}>
            <CreditCard card={black} sheen={sheen} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Cartão herói */}
      <motion.div className={styles.heroCard} style={{ ...near, y: heroY, scale: heroScale }}>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 260, rotate: -45, scale: 0.7 }}
          animate={show ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : undefined}
          transition={t(0.3, 1.35)}
        >
          <motion.div
            className={styles.bob}
            style={{ rotateZ: heroRotZ, rotateY: heroRotY, rotateX: heroRotX, transformPerspective: 1200 }}
          >
            <CreditCard card={platinum} sheen={sheen} />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Chips flutuantes: primeiro plano, maior paralaxe. */}
      <motion.div className={styles.chips} style={{ y: chipsY }}>
        <Chip className={styles.chipPix} depth={near} delay={0.95} show={show} reduce={reduce}>
          <span className={styles.chipIcon} data-tone="green">
            <PixIcon />
          </span>
          <span>
            <small>Pix recebido</small>
            <strong className="tabular">+ R$ 250,00</strong>
          </span>
        </Chip>
        <Chip className={styles.chipYield} depth={mid} delay={1.1} show={show} reduce={reduce}>
          <span className={styles.chipIcon} data-tone="ink">
            <UpIcon />
          </span>
          <span>
            <small>Rendeu hoje</small>
            <strong className="tabular">+ R$ 3,42</strong>
          </span>
        </Chip>
        <Chip className={styles.chipCash} depth={near} delay={1.25} show={show} reduce={reduce}>
          <strong>36x</strong>
          <small>no Pix e boleto</small>
        </Chip>
      </motion.div>
    </div>
  )
}

function Chip({
  children,
  className,
  depth,
  delay,
  show,
  reduce,
}: {
  children: ReactNode
  className: string
  depth: { x: MotionValue<number>; y: MotionValue<number> }
  delay: number
  show: boolean
  reduce: boolean
}) {
  return (
    <motion.div className={`${styles.chip} ${className}`} style={depth}>
      <motion.div
        className={styles.chipInner}
        initial={reduce ? false : { opacity: 0, scale: 0.6, y: 30, filter: 'blur(10px)' }}
        animate={show ? { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' } : undefined}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: reduce ? 0 : delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function PixIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" aria-hidden>
      <path d="M12 3.5 20.5 12 12 20.5 3.5 12z" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  )
}

function UpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 16l5-5 4 4 7-7" />
      <path d="M15 8h5v5" />
    </svg>
  )
}

function useDepth(px: MotionValue<number>, py: MotionValue<number>, d: number) {
  const x = useTransform(px, (v) => v * d)
  const y = useTransform(py, (v) => v * d)
  return { x, y }
}
