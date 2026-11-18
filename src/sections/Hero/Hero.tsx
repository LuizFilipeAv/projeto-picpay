import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useIntro } from '../../components/Intro/IntroContext'
import { EASE_OUT } from '../../lib/motion'
import { HeroScene } from './HeroScene'
import styles from './Hero.module.css'

const TITLE = ['Seu dinheiro', 'faz mais', 'no PicPay.']

/**
 * Hero: painel escuro emoldurado pelo verde PicPay.
 * Entra junto com a saída da cortina (useIntro().revealed):
 *   painel "assenta" (zoom 1.08 → 1) · título sobe linha a linha · cartões voam para a cena · chips estouram
 * No scroll: painel encolhe, título sobe e apaga, cartão herói gira em direção à próxima seção.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = !!useReducedMotion()
  const { revealed } = useIntro()
  const show = revealed || reduce

  const { scrollYProgress: exit } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const panelScale = useTransform(exit, [0, 1], [1, 0.92])
  const panelRadius = useTransform(exit, [0, 1], [32, 64])
  const titleY = useTransform(exit, [0, 1], ['0%', '-35%'])
  const titleOpacity = useTransform(exit, [0, 0.7], [1, 0])

  // Ponteiro normalizado -1..1, com mola (só ponteiro fino).
  const px = useSpring(0, { stiffness: 70, damping: 20, mass: 0.7 })
  const py = useSpring(0, { stiffness: 70, damping: 20, mass: 0.7 })
  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      px.set(((e.clientX - r.left) / r.width) * 2 - 1)
      py.set(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    const leave = () => {
      px.set(0)
      py.set(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [reduce, px, py])

  const glowX = useTransform(px, (v) => `${62 + v * 6}%`)
  const glowY = useTransform(py, (v) => `${58 + v * 6}%`)

  const rise = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 28, filter: 'blur(8px)' } as const),
    animate: show ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined,
    transition: { duration: 0.9, ease: EASE_OUT, delay: reduce ? 0 : delay },
  })

  return (
    <section id="conta" ref={ref} className={styles.hero} aria-labelledby="hero-title">
      <motion.div className={styles.panel} style={reduce ? undefined : { scale: panelScale, borderRadius: panelRadius }}>
        <motion.div
          className={styles.stage}
          initial={reduce ? false : { scale: 1.12 }}
          animate={show ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        >
          <motion.div className={styles.field} style={{ '--gx': glowX, '--gy': glowY } as never} aria-hidden />
          <div className={styles.grain} aria-hidden />
          <HeroScene px={px} py={py} exit={exit} revealed={revealed} reduce={reduce} />
        </motion.div>

        <div className={styles.content}>
          <motion.div className={styles.proof} {...rise(0.75)}>
            <span className={styles.stars} aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} />
              ))}
            </span>
            <span>
              <strong>4,7</strong> nas lojas de apps
            </span>
            <span className={styles.proofDivider} aria-hidden />
            <span>
              <strong>70 mi+</strong> de clientes
            </span>
          </motion.div>

          <motion.h1 id="hero-title" className={styles.title} style={{ y: titleY, opacity: titleOpacity }}>
            {TITLE.map((line, i) => (
              <span key={line} className={styles.lineMask}>
                <motion.span
                  className={styles.line}
                  data-accent={i === TITLE.length - 1 || undefined}
                  initial={reduce ? false : { y: '110%', rotate: 3 }}
                  animate={show ? { y: '0%', rotate: 0 } : undefined}
                  transition={{ duration: 1.1, ease: EASE_OUT, delay: reduce ? 0 : 0.18 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          <motion.div className={styles.aside} {...rise(0.9)}>
            <p className={styles.lead}>
              Conta que rende 102% do CDI, cartão sem anuidade e Pix parcelado em até 36x. Tudo num app só.
            </p>
            <div className={styles.actions}>
              <a href="#abrir-conta" className={styles.primary}>
                Abrir conta grátis
                <span className={styles.primaryIcon} aria-hidden>
                  <Arrow />
                </span>
              </a>
              <a href="#cartoes" className={styles.secondary}>
                Conheça os cartões
              </a>
            </div>
          </motion.div>

          <motion.a href="#cartoes" className={styles.scrollCue} aria-label="Rolar para conhecer" {...rise(1.2)}>
            <span className={styles.scrollTrack} aria-hidden>
              <span className={styles.scrollThumb} />
            </span>
            Role para descobrir
          </motion.a>
        </div>
      </motion.div>
    </section>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 1.8l2.47 5.18 5.68.68-4.2 3.9 1.12 5.62L10 14.4l-5.07 2.78 1.12-5.62-4.2-3.9 5.68-.68z" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 15L15 5M7 5h8v8" />
    </svg>
  )
}
