import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react'
import styles from './ScrollStatement.module.css'

const TEXT = 'Mais de 70 milhões de brasileiros escolhem PicPay todos os dias.'
const WORDS = TEXT.split(' ')
const GREEN = new Set([3, 4]) // "70 milhões"

// Cores literais espelham os tokens (motion interpola valores, não var()).
const GRAY = '#e6e6e6' // --gray-200
const INK = '#131313' // --ink
const GREEN_ACTION = '#1f7a57' // --green-action (4.7:1 on paper)

const TEXT_END = 0.58 // fração do scroll em que a última palavra acende
const PILL_START = 0.62
const PILL_SPAN = 0.07

const stroke = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const FEATURES: { title: string; text: string; icon: ReactNode }[] = [
  {
    title: 'Modo seguro',
    text: 'Proteção com múltiplas camadas de tecnologia',
    icon: (
      <svg {...stroke} aria-hidden>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'A Conta das Contas',
    text: 'Conecte suas contas de outros bancos aqui',
    icon: (
      <svg {...stroke} aria-hidden>
        <path d="M3 9l9-5 9 5" />
        <path d="M5 10v7M10 10v7M14 10v7M19 10v7" />
        <path d="M3 20h18" />
      </svg>
    ),
  },
  {
    title: 'Assistente de Pagamentos',
    text: 'Receba alertas e pague boletos em um só lugar',
    icon: (
      <svg {...stroke} aria-hidden>
        <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7z" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
    ),
  },
  {
    title: 'Pix no WhatsApp',
    text: 'Faça Pix por áudio ou mensagem com PicPay',
    icon: (
      <svg {...stroke} aria-hidden>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
      </svg>
    ),
  },
]

function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const start = (i / n) * TEXT_END
  const end = ((i + 1) / n) * TEXT_END
  const color = useTransform(progress, [start, end], [GRAY, GREEN.has(i) ? GREEN_ACTION : INK])
  return (
    <motion.span className={styles.word} style={{ color }}>
      {word}
    </motion.span>
  )
}

function Pill({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const f = FEATURES[i]
  const s = PILL_START + i * (PILL_SPAN * 0.8)
  const opacity = useTransform(progress, [s, s + PILL_SPAN], [0, 1])
  const y = useTransform(progress, [s, s + PILL_SPAN], [48, 0])
  const x = useTransform(progress, [s, s + PILL_SPAN], [i % 2 ? 32 : -32, 0])
  return (
    <motion.li className={styles.pill} style={{ opacity, y, x }}>
      <span className={styles.icon}>{f.icon}</span>
      <span>
        <strong className={styles.pillTitle}>{f.title}</strong>
        <span className={styles.pillText}>{f.text}</span>
      </span>
    </motion.li>
  )
}

export function ScrollStatement() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  if (reduce) {
    return (
      <section className={`${styles.section} ${styles.static}`}>
        <div className={styles.inner}>
          <p className={styles.statement}>
            {WORDS.map((w, i) => (
              <span key={i} className={styles.word} style={{ color: GREEN.has(i) ? GREEN_ACTION : INK }}>
                {w}{' '}
              </span>
            ))}
          </p>
          <ul className={styles.pills}>
            {FEATURES.map((f) => (
              <li key={f.title} className={styles.pill}>
                <span className={styles.icon}>{f.icon}</span>
                <span>
                  <strong className={styles.pillTitle}>{f.title}</strong>
                  <span className={styles.pillText}>{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.inner}>
        <p className={styles.statement} aria-label={TEXT}>
          {WORDS.map((w, i) => (
            <span key={i} aria-hidden>
              <Word word={w} i={i} n={WORDS.length} progress={scrollYProgress} />{' '}
            </span>
          ))}
        </p>
        <ul className={styles.pills}>
          {FEATURES.map((_, i) => (
            <Pill key={i} i={i} progress={scrollYProgress} />
          ))}
        </ul>
      </div>
    </section>
  )
}
