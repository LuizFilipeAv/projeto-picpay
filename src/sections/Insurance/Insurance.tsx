import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react'
import { Reveal, SplitWords } from '../../components/Reveal'
import styles from './Insurance.module.css'

const stroke = {
  viewBox: '0 0 96 96',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const CARDS: { title: string; text: string; tone: string; icon: ReactNode }[] = [
  {
    title: 'Seguro Carteira Digital',
    text: 'A proteção extra que blinda o seu bolso',
    tone: styles.white,
    icon: (
      <svg {...stroke} aria-hidden>
        <path d="M14 30a8 8 0 0 1 8-8h46a6 6 0 0 1 6 6v8" />
        <rect x="14" y="30" width="68" height="46" rx="9" />
        <path d="M82 46H66a8 8 0 0 0 0 16h16" />
        <circle cx="67" cy="54" r="1.5" />
        <path d="M24 30l30-14 6 14" />
      </svg>
    ),
  },
  {
    title: 'Seguro Celular PicPay',
    text: 'Planos para o seu celular a partir de R$ 9,90/mês',
    tone: styles.dark,
    icon: (
      <svg {...stroke} aria-hidden>
        <rect x="26" y="10" width="40" height="76" rx="8" />
        <path d="M40 17h12" />
        <path d="M60 46l22 8v12c0 11-9 18-22 22-13-4-22-11-22-22V54l22-8z" className={styles.shieldFill} />
        <path d="M52 66l5 5 9-10" />
      </svg>
    ),
  },
  {
    title: 'Seguro de Vida PicPay',
    text: 'Coberturas sob medida a partir de R$ 5,55',
    tone: styles.gray,
    icon: (
      <svg {...stroke} aria-hidden>
        <path d="M48 82S14 62 14 36a17 17 0 0 1 34-6 17 17 0 0 1 34 6c0 26-34 46-34 46z" />
        <path d="M24 50h14l5-10 8 18 5-8h16" />
      </svg>
    ),
  },
]

function useIsMobile() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 47.99rem)')
    const on = () => setM(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}

function Card({
  i,
  progress,
  mobile,
  fixed,
}: {
  i: number
  progress: MotionValue<number>
  mobile: boolean
  fixed: boolean
}) {
  const c = CARDS[i]
  const side = i - 1 // -1, 0, 1
  const start = mobile ? `${-i * 104}%` : `${-side * 104}%`
  const x = useTransform(progress, [0, 1], mobile ? ['0%', '0%'] : [start, '0%'])
  const y = useTransform(progress, [0, 1], mobile ? [start, '0%'] : ['0%', '0%'])
  const rotateFinal = useTransform(progress, [0, 1], mobile ? [side * 2, 0] : [side * 3, side * 8])

  return (
    <motion.article
      className={`${styles.card} ${c.tone}`}
      style={fixed ? { rotate: mobile ? 0 : side * 8 } : { x, y, rotate: rotateFinal, zIndex: 3 - Math.abs(side) }}
    >
      <div className={styles.icon}>{c.icon}</div>
      <div className={styles.body}>
        <h3 className={styles.title}>{c.title}</h3>
        <p className={styles.text}>{c.text}</p>
        <a href="#abrir-conta" className={styles.link}>
          Saiba mais
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={styles.arrow} aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </motion.article>
  )
}

export function Insurance() {
  const stage = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const mobile = useIsMobile()
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start 95%', 'start 25%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.5 })

  return (
    <section id="seguros" className={styles.section}>
      <div className="container">
        <header className={styles.head}>
          <SplitWords as="h2" className={styles.heading} text="Proteger o que realmente importa para sua vida" />
          <Reveal as="p" className={styles.sub} delay={0.15}>
            Com PicPay, cotar e contratar seguros é acessível.
          </Reveal>
        </header>
        <div ref={stage} className={styles.stage}>
          {CARDS.map((_, i) => (
            <Card key={i} i={i} progress={progress} mobile={mobile} fixed={!!reduce} />
          ))}
        </div>
      </div>
    </section>
  )
}
