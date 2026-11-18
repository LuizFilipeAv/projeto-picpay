import { useId } from 'react'
import { motion, useMotionTemplate, type MotionValue } from 'motion/react'
import type { CardData } from './cards'
import styles from './CreditCard.module.css'

type Props = {
  card: CardData
  /** Posição do reflexo (0..100) controlada pelo scroll/ponteiro. */
  sheen: MotionValue<number>
}

/** Cartão desenhado em CSS/SVG, sem imagens. Formato vertical como os PicPay Cards. */
export function CreditCard({ card, sheen }: Props) {
  const sheenBg = useMotionTemplate`linear-gradient(115deg, transparent ${sheen}%, rgb(255 255 255 / 0.28) calc(${sheen}% + 8%), transparent calc(${sheen}% + 18%))`

  return (
    <div className={styles.card} style={{ background: card.surface, color: card.ink }} data-tier={card.id}>
      <div className={styles.grain} aria-hidden />
      <motion.div className={styles.sheen} style={{ backgroundImage: sheenBg }} aria-hidden />

      <div className={styles.top}>
        {card.label ? <span className={styles.label}>{card.label}</span> : <span />}
        <Contactless />
      </div>

      <Chip />

      <div className={styles.bottom}>
        {card.id === 'epic' ? (
          <span className={styles.epic}>
            epic<sup>®</sup>
          </span>
        ) : (
          <span className={styles.brand}>PicPay</span>
        )}
        <Network mono={card.network === 'mono'} />
      </div>
    </div>
  )
}

function Chip() {
  const gid = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  return (
    <svg className={styles.chip} viewBox="0 0 40 30" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f3f3" />
          <stop offset="0.5" stopColor="#bdbdbd" />
          <stop offset="1" stopColor="#e2e2e2" />
        </linearGradient>
      </defs>
      <rect x="0.5" y="0.5" width="39" height="29" rx="5" fill={`url(#${gid})`} stroke="rgb(0 0 0 / 0.15)" />
      <path d="M0 10h13M0 20h13M27 10h13M27 20h13M13 0v30M27 0v30M13 15h14" stroke="rgb(0 0 0 / 0.22)" fill="none" />
    </svg>
  )
}

function Contactless() {
  return (
    <svg className={styles.contactless} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <path d="M8.5 9a4.5 4.5 0 0 1 0 6" />
      <path d="M12 6.5a8 8 0 0 1 0 11" />
      <path d="M15.5 4a11.5 11.5 0 0 1 0 16" />
    </svg>
  )
}

function Network({ mono }: { mono: boolean }) {
  return (
    <svg className={styles.network} viewBox="0 0 48 30" aria-label="Mastercard" role="img">
      <circle cx="17" cy="15" r="13" fill={mono ? '#9b9b9b' : '#eb001b'} />
      <circle cx="31" cy="15" r="13" fill={mono ? '#d9d9d9' : '#f79e1b'} fillOpacity={mono ? 0.85 : 0.9} />
    </svg>
  )
}
