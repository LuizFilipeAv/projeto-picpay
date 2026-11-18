import { useEffect, useRef, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../../lib/motion'
import { lockScroll, unlockScroll } from '../../lib/scrollLock'
import { useIntro } from './IntroContext'
import styles from './Curtain.module.css'

const LIFT_EASE = [0.76, 0, 0.24, 1] as const
const EXIT_AT = 1900 // ms após o mount
const LIFT = 0.9 // s
const BACK_DELAY = 0.08 // s
const LETTERS = 'PicPay'.split('')

type Phase = 'in' | 'exit' | 'done'

export function Curtain() {
  const reduced = useReducedMotion()
  const { reveal } = useIntro()
  const [phase, setPhase] = useState<Phase>('in')
  const counterRef = useRef<HTMLSpanElement>(null)
  const done = phase === 'done'

  // Movimento reduzido: sem cortina, hero liberada de imediato.
  useEffect(() => {
    if (reduced) reveal()
  }, [reduced, reveal])

  // Trava de scroll + topo da página enquanto visível.
  useEffect(() => {
    if (reduced || done) return
    const prevRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    lockScroll()
    return () => {
      unlockScroll()
      history.scrollRestoration = prevRestoration
    }
  }, [reduced, done])

  // Contador 000 → 100.
  useEffect(() => {
    if (reduced) return
    const controls = animate(0, 100, {
      duration: 1.4,
      delay: 0.2,
      ease: EASE_OUT,
      onUpdate: (v) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, '0')
      },
    })
    return () => controls.stop()
  }, [reduced])

  // Início da saída: reveal() exatamente aqui.
  useEffect(() => {
    if (reduced) return
    const t = window.setTimeout(() => {
      reveal()
      setPhase('exit')
    }, EXIT_AT)
    return () => window.clearTimeout(t)
  }, [reduced, reveal])

  if (reduced || phase === 'done') return null

  const exiting = phase === 'exit'
  const lift = { duration: LIFT, ease: LIFT_EASE }

  return (
    <div aria-hidden="true">
      <motion.div
        className={styles.back}
        initial={{ clipPath: 'inset(0 0 0 0)' }}
        animate={{ clipPath: exiting ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)' }}
        transition={{ ...lift, delay: exiting ? BACK_DELAY : 0 }}
      />
      <motion.div
        className={styles.curtain}
        initial={{ clipPath: 'inset(0 0 0 0)' }}
        animate={{ clipPath: exiting ? 'inset(0 0 100% 0)' : 'inset(0 0 0 0)' }}
        transition={lift}
        onAnimationComplete={() => {
          if (exiting) setPhase('done')
        }}
      >
        <motion.div
          className={styles.glow}
          initial={{ x: '-32vw', y: '-30vh', scale: 0.9 }}
          animate={{ x: 0, y: 0, scale: 1.1 }}
          transition={{ duration: 3, ease: 'easeOut' }}
        />
        <div className={styles.vignette} />
        <div className={styles.grain} />

        <motion.div
          className={styles.center}
          animate={exiting ? { y: '-12vh', opacity: 0, filter: 'blur(10px)' } : { y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
        >
          <div className={styles.word}>
            {LETTERS.map((l, i) => (
              <span key={i} className={styles.mask}>
                <motion.span
                  className={styles.letter}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 + i * 0.04 }}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </div>
          <motion.p
            className={styles.tagline}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
          >
            Seu próximo banco.
          </motion.p>
        </motion.div>

        <motion.div
          className={styles.bottom}
          animate={{ opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <p className={styles.services}>Conta · Cartão · Pix · Investimentos</p>
          <span className={styles.counter} ref={counterRef}>
            000
          </span>
        </motion.div>
        <div className={styles.line}>
          <motion.span
            className={styles.lineFill}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.2, ease: EASE_OUT }}
          />
        </div>
      </motion.div>
    </div>
  )
}
