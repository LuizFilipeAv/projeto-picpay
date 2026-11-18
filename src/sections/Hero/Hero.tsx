import { useEffect, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { SplitWords } from '../../components/Reveal'
import { EASE_OUT } from '../../lib/motion'
import styles from './Hero.module.css'

const PROOFS = ['70 mi+ de clientes', 'Nota 4.7 nas lojas', 'Pix por WhatsApp']

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94])
  const radius = useTransform(scrollYProgress, [0, 1], [32, 56])

  const mx = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 })
  const my = useSpring(0, { stiffness: 60, damping: 18, mass: 0.8 })

  useEffect(() => {
    if (reduce) return
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!mq.matches) return
    const el = ref.current
    if (!el) return
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 60)
      my.set(((e.clientY - r.top) / r.height - 0.5) * 60)
    }
    const leave = () => {
      mx.set(0)
      my.set(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [reduce, mx, my])

  return (
    <section id="conta" ref={ref} className={styles.hero}>
      <motion.div className={styles.panel} style={reduce ? undefined : { scale, borderRadius: radius }}>
        <motion.div className={styles.aurora} style={{ x: mx, y: my }} aria-hidden>
          <span className={`${styles.blob} ${styles.blobA}`} />
          <span className={`${styles.blob} ${styles.blobB}`} />
          <span className={`${styles.blob} ${styles.blobC}`} />
        </motion.div>

        <div className={styles.content}>
          <SplitWords as="h1" immediate className={styles.title} text={'PicPay.\nSeu próximo banco.'} />

          <motion.p
            className={styles.lead}
            initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.55 }}
          >
            Conta que rende 102% do CDI, cartão sem anuidade e Pix parcelado em até 36x. Tudo num app só.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={reduce ? false : { opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.7 }}
          >
            <a href="#conta" className={styles.primary}>
              Abrir conta
            </a>
            <a href="#cartoes" className={styles.ghost}>
              Conheça o cartão
            </a>
          </motion.div>

          <ul className={styles.proofs}>
            {PROOFS.map((p, i) => (
              <motion.li
                key={p}
                className={styles.chip}
                initial={reduce ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.95 + i * 0.08 }}
              >
                {p}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  )
}
