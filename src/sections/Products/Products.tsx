import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { SplitWords } from '../../components/Reveal'
import { EASE_OUT } from '../../lib/motion'
import styles from './Products.module.css'

const MAX_TILT = 6
const spring = { stiffness: 220, damping: 22, mass: 0.6 }

type TileProps = {
  className: string
  title: string
  text: string
  index: number
  children: ReactNode
}

function Tile({ className, title, text, index, children }: TileProps) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring)

  const onMove = (e: React.PointerEvent) => {
    // Só ponteiro fino (mouse); toque não inclina.
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <motion.article
      ref={ref}
      className={`${styles.tile} ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      initial={reduce ? false : { opacity: 0, y: 40, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: index * 0.09 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div className={styles.art} aria-hidden>
        {children}
      </div>
      <div className={styles.copy}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
      </div>
    </motion.article>
  )
}

const BARS = [28, 40, 52, 66, 82, 100]

export function Products() {
  return (
    <section className={styles.section}>
      <div className="container">
        <SplitWords as="h2" className={styles.heading} text="Tudo o que o seu dinheiro precisa está aqui" />
        <div className={styles.bento}>
          <Tile
            index={0}
            className={styles.account}
            title="Conta Digital"
            text="Aqui seu dinheiro rende 102% do CDI nos dias úteis."
          >
            <div className={styles.bars}>
              {BARS.map((h, i) => (
                <span key={i} className={styles.bar} style={{ '--h': `${h}%`, '--i': i } as CSSProperties} />
              ))}
            </div>
            <span className={styles.rate}>102% CDI</span>
          </Tile>

          <Tile
            index={1}
            className={styles.card}
            title="Cartão de Crédito"
            text="Construa o limite que é do seu número."
          >
            <div className={styles.miniCard}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="6" width="18" height="12" rx="2.5" />
                <path d="M3 10h18" />
              </svg>
              <span className={styles.chip} />
              <span className={styles.digits}>•••• 4821</span>
            </div>
          </Tile>

          <Tile
            index={2}
            className={styles.pix}
            title="Parcele seus Pix e Boletos"
            text="Em até 36x com toda tranquilidade."
          >
            <span className={styles.big}>
              36<span className={styles.x}>x</span>
            </span>
          </Tile>

          <Tile
            index={3}
            className={styles.loan}
            title="Empréstimo"
            text="Análise simples e dinheiro na sua conta rapidinho."
          >
            <div className={styles.approval}>
              <svg viewBox="0 0 48 48" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="24" cy="24" r="20" className={styles.ring} />
                <path d="M15 25l6 6 12-13" className={styles.tick} />
              </svg>
              <span className={styles.track}>
                <span className={styles.fill} />
              </span>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  )
}
