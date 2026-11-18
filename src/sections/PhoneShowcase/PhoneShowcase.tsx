import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import styles from './PhoneShowcase.module.css'

const START_CENTS = 1248000 // R$ 12.480,00
const TICK_MS = 120

function useLiveBalance(enabled: boolean) {
  const [cents, setCents] = useState(START_CENTS)
  useEffect(() => {
    if (!enabled) return
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      const steps = Math.floor((now - last) / TICK_MS)
      if (steps > 0) {
        last += steps * TICK_MS
        setCents((c) => c + steps)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [enabled])
  return cents
}

const stroke = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

const IconPix = () => (
  <svg {...stroke} aria-hidden>
    <path d="M12 3l4.5 4.5L12 12 7.5 7.5 12 3z" />
    <path d="M12 12l4.5 4.5L12 21l-4.5-4.5L12 12z" />
    <path d="M3 12l3-3M21 12l-3 3" />
  </svg>
)
const IconPig = () => (
  <svg {...stroke} aria-hidden>
    <path d="M5 11a7 6 0 0 1 12-3.5h2v3l1.5 1V14l-1.5.5V17h-3v-1.5H9V17H6v-3A5 5 0 0 1 5 11z" />
    <circle cx="15.5" cy="10" r=".5" />
  </svg>
)
const IconCart = () => (
  <svg {...stroke} aria-hidden>
    <path d="M3 4h2.5l2 10h10l2-7.5H6.5" />
    <circle cx="9" cy="19" r="1.2" />
    <circle cx="17" cy="19" r="1.2" />
  </svg>
)
const IconHome = () => (
  <svg {...stroke} aria-hidden>
    <path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1v-8z" />
  </svg>
)
const IconCard = () => (
  <svg {...stroke} aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 10h18" />
  </svg>
)
const IconUser = () => (
  <svg {...stroke} aria-hidden>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" />
  </svg>
)

const TX = [
  { icon: <IconPix />, name: 'Pix recebido', sub: 'Ana Souza', value: '+ R$ 250,00', in: true },
  { icon: <IconPig />, name: 'Cofrinho', sub: 'Viagem', value: '- R$ 100,00', in: false },
  { icon: <IconCart />, name: 'Mercado', sub: 'Cartão final 4821', value: '- R$ 87,35', in: false },
]

export function PhoneShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const cents = useLiveBalance(!reduce)

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const phoneY = useTransform(scrollYProgress, [0, 0.6], ['60vh', '0vh'], { clamp: true })
  const phoneScale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1])
  const headOpacity = useTransform(scrollYProgress, [0.15, 0.7], [1, 0.22])
  const headBlurN = useTransform(scrollYProgress, [0.15, 0.7], [0, 6])
  const headBlur = useTransform(headBlurN, (v) => `blur(${v}px)`)
  const headScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.94])
  const noteOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1])
  const noteY = useTransform(scrollYProgress, [0.6, 0.85], [24, 0])

  const reais = Math.floor(cents / 100)
  const intPart = reais.toLocaleString('pt-BR')
  const decPart = String(cents % 100).padStart(2, '0')

  const staticMode = !!reduce

  return (
    <div ref={ref} className={styles.wrap} style={staticMode ? { height: 'auto' } : undefined}>
      <div className={styles.sticky} style={staticMode ? { position: 'relative' } : undefined}>
        <motion.h2
          className={styles.headline}
          style={staticMode ? undefined : { opacity: headOpacity, filter: headBlur, scale: headScale }}
        >
          <span>Seu dinheiro rende</span>
          <span>102% do CDI</span>
        </motion.h2>

        <motion.div
          className={styles.phoneSlot}
          style={staticMode ? undefined : { y: phoneY, scale: phoneScale }}
        >
          <div className={styles.phone} role="img" aria-label="Tela da conta PicPay com saldo rendendo em tempo real">
            <div className={styles.island} />
            <div className={styles.screen}>
              <div className={styles.status}>
                <span>9:41</span>
                <span className={styles.statusIcons} aria-hidden>
                  <i /> <i /> <b />
                </span>
              </div>

              <div className={styles.body}>
                <p className={styles.label}>Saldo em conta</p>
                <p className={styles.balance} aria-live="off">
                  <span>R$ {intPart}</span>
                  <span className={styles.cents}>,{decPart}</span>
                </p>
                <span className={styles.yieldChip}>Rendendo 102% do CDI</span>

                <div className={styles.today}>
                  <span>Rendimento hoje</span>
                  <strong>+R$ 3,42</strong>
                </div>

                <ul className={styles.list}>
                  {TX.map((t) => (
                    <li key={t.name} className={styles.tx}>
                      <span className={styles.txIcon}>{t.icon}</span>
                      <span className={styles.txText}>
                        <strong>{t.name}</strong>
                        <small>{t.sub}</small>
                      </span>
                      <span className={t.in ? styles.txIn : styles.txOut}>{t.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <nav className={styles.tabs} aria-hidden>
                <span className={styles.tabActive}>
                  <IconHome />
                </span>
                <span>
                  <IconCard />
                </span>
                <span className={styles.pixBtn}>Pix</span>
                <span>
                  <IconPig />
                </span>
                <span>
                  <IconUser />
                </span>
              </nav>
            </div>
          </div>
        </motion.div>

        <motion.p
          className={styles.note}
          style={staticMode ? undefined : { opacity: noteOpacity, y: noteY }}
        >
          Seu saldo rende automaticamente todo dia útil, sem você fazer nada. E fica disponível para usar quando quiser.
        </motion.p>
      </div>
    </div>
  )
}
