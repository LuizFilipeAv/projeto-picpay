import { useRef, useState, type PointerEvent } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { SplitWords } from '../../components/Reveal'
import { EASE_OUT } from '../../lib/motion'
import { CardStage } from './CardStage'
import { CreditCard } from './CreditCard'
import { CARDS, SHARED_BENEFITS } from './cards'
import styles from './CardsShowcase.module.css'

/**
 * Coreografia do scroll (progresso p do trilho 0..1):
 *   0.00–0.14  título grande + baralho em leque; o leque se fecha numa pilha
 *   0.14–1.00  t vai de 0 a 3 com platôs: cada cartão para no centro tempo
 *              suficiente para ler as características, depois sai girando
 */
const T_IN = [0.14, 0.24, 0.36, 0.44, 0.56, 0.64, 0.76, 1]
const T_OUT = [0, 0, 1, 1, 2, 2, 3, 3]
/** Meio de cada platô, usado pela navegação do trilho. */
const PLATEAU = [0.19, 0.4, 0.6, 0.88]

export function CardsShowcase() {
  const reduce = useReducedMotion()
  return (
    <section id="cartoes" className={styles.section} aria-labelledby="cartoes-title">
      {reduce ? <StaticCards /> : <ScrollCards />}
      <Benefits />
    </section>
  )
}

function ScrollCards() {
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: track, offset: ['start start', 'end end'] })

  const tRaw = useTransform(p, T_IN, T_OUT)
  // Mola leve: o cartão "assenta" no centro em vez de parar seco.
  const t = useSpring(tRaw, { stiffness: 140, damping: 26, mass: 0.6 })
  const intro = useTransform(p, [0.02, 0.14], [0, 1], { ease: easeOutQuint })

  const [active, setActive] = useState(0)
  useMotionValueEvent(t, 'change', (v) => {
    const next = Math.min(CARDS.length - 1, Math.max(0, Math.round(v)))
    setActive((cur) => (cur === next ? cur : next))
  })

  // Camada ambiente: brilho que troca de cor com o cartão ativo e respira devagar.
  const glow = useTransform(t, [0, 1, 2, 3], CARDS.map((c) => c.glow))
  const glowBg = useMotionTemplate`radial-gradient(60% 55% at 30% 55%, color-mix(in oklab, ${glow} 55%, transparent) 0%, transparent 70%)`

  const headingOpacity = useTransform(p, [0.04, 0.11], [1, 0])
  const headingY = useTransform(p, [0.04, 0.12], ['0%', '-30%'])
  const headingBlur = useTransform(p, [0.04, 0.11], ['blur(0px)', 'blur(10px)'])
  const detailsOpacity = useTransform(p, [0.1, 0.17], [0, 1])
  const detailsX = useTransform(p, [0.1, 0.18], [40, 0])

  // Inclinação pelo ponteiro (só ponteiro fino).
  const tiltXRaw = useSpringValue()
  const tiltYRaw = useSpringValue()
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    tiltXRaw.set(((e.clientX - r.left) / r.width) * 2 - 1)
    tiltYRaw.set(((e.clientY - r.top) / r.height) * 2 - 1)
  }
  const onPointerLeave = () => {
    tiltXRaw.set(0)
    tiltYRaw.set(0)
  }

  const goTo = (i: number) => {
    const el = track.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + range * PLATEAU[i], behavior: 'smooth' })
  }

  const card = CARDS[active]

  return (
    <div ref={track} className={styles.track}>
      <div className={styles.sticky}>
        <motion.div className={styles.glow} style={{ backgroundImage: glowBg }} aria-hidden />
        <div className={styles.grid} aria-hidden />

        <motion.div className={styles.intro} style={{ opacity: headingOpacity, y: headingY, filter: headingBlur }}>
          <SplitWords as="h2" text={'Aproveitar mil\npossibilidades\nem um só cartão'} className={styles.title} />
          <p className={styles.lead}>Parcele suas compras em até 36x com PicPay Card.</p>
        </motion.div>

        <div className={styles.layout}>
          <div className={styles.stage} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            {CARDS.map((c, i) => (
              <CardStage key={c.id} card={c} index={i} t={t} intro={intro} tiltX={tiltXRaw} tiltY={tiltYRaw} />
            ))}
          </div>

          <motion.div className={styles.details} style={{ opacity: detailsOpacity, x: detailsX }}>
            <h2 id="cartoes-title" className="visually-hidden">
              Cartões de crédito PicPay
            </h2>
            <div className={styles.detailBody} aria-live="polite">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={card.id}
                  initial="out"
                  animate="in"
                  exit="exit"
                  variants={{ in: { transition: { staggerChildren: 0.06 } }, exit: { transition: { staggerChildren: 0.03 } } }}
                >
                  <motion.h3 className={styles.cardName} variants={line}>
                    {card.name}
                  </motion.h3>
                  <motion.p className={styles.headline} variants={line}>
                    {card.headline}
                  </motion.p>
                  <ul className={styles.features}>
                    {card.features.map((f) => (
                      <motion.li key={f} variants={line}>
                        <Check />
                        <span>{f}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>

            <a className={styles.cta} href="#abrir-conta">
              Peça seu cartão
              <Arrow />
            </a>

            <nav className={styles.rail} aria-label="Escolher cartão">
              {CARDS.map((c, i) => (
                <RailItem key={c.id} label={c.name.replace('PicPay ', '')} index={i} t={t} active={i === active} onClick={() => goTo(i)} />
              ))}
            </nav>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function RailItem({
  label,
  index,
  t,
  active,
  onClick,
}: {
  label: string
  index: number
  t: MotionValue<number>
  active: boolean
  onClick: () => void
}) {
  const fill = useTransform(t, (v) => Math.min(1, Math.max(0, v - index + 1)))
  return (
    <button type="button" className={styles.railItem} data-active={active} aria-current={active} onClick={onClick}>
      <span className={styles.railBar}>
        <motion.span className={styles.railFill} style={{ scaleX: fill }} />
      </span>
      {label}
    </button>
  )
}

/** Versão sem movimento: os quatro cartões lado a lado com suas características. */
function StaticCards() {
  const still = useSpring(40)
  return (
    <div className={`container ${styles.static}`}>
      <h2 id="cartoes-title" className={styles.title}>
        Aproveitar mil possibilidades em um só cartão
      </h2>
      <p className={styles.lead}>Parcele suas compras em até 36x com PicPay Card.</p>
      <div className={styles.staticGrid}>
        {CARDS.map((c) => (
          <article key={c.id} className={styles.staticItem}>
            <div className={styles.staticCard}>
              <CreditCard card={c} sheen={still} />
            </div>
            <h3 className={styles.cardName}>{c.name}</h3>
            <p className={styles.headline}>{c.headline}</p>
            <ul className={styles.features}>
              {c.features.map((f) => (
                <li key={f}>
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  )
}

/** Faixa contínua com os benefícios comuns a todos os cartões (camada ambiente). */
function Benefits() {
  const items = [...SHARED_BENEFITS, ...SHARED_BENEFITS]
  return (
    <div className={styles.benefits}>
      <p className="visually-hidden">Todos os cartões: {SHARED_BENEFITS.join(', ')}.</p>
      <div className={styles.marquee} aria-hidden>
        {[0, 1].map((k) => (
          <div key={k} className={styles.marqueeTrack}>
            {items.map((b, i) => (
              <span key={i} className={styles.benefit}>
                {b}
                <Spark />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const line = {
  out: { opacity: 0, y: 18, filter: 'blur(6px)' },
  in: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: EASE_OUT } },
  exit: { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.22, ease: [0.3, 0, 1, 1] as const } },
}

function easeOutQuint(x: number) {
  return 1 - Math.pow(1 - x, 5)
}

function useSpringValue() {
  return useSpring(0, { stiffness: 150, damping: 18 })
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.5 10.5l3.5 3.5 7.5-8" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

function Spark() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0c.4 4.2 3.8 7.6 8 8-4.2.4-7.6 3.8-8 8-.4-4.2-3.8-7.6-8-8 4.2-.4 7.6-3.8 8-8z" />
    </svg>
  )
}
