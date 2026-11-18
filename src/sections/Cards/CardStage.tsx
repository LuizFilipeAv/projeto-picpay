import { motion, useSpring, useTransform, type MotionValue } from 'motion/react'
import { CreditCard } from './CreditCard'
import type { CardData } from './cards'
import styles from './CardsShowcase.module.css'

type Props = {
  card: CardData
  index: number
  /** Índice ativo contínuo (0..3) derivado do scroll. */
  t: MotionValue<number>
  /** Entrada do baralho (0 = fora da tela, 1 = no lugar). */
  intro: MotionValue<number>
  /** Inclinação do ponteiro, -1..1. */
  tiltX: MotionValue<number>
  tiltY: MotionValue<number>
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Um cartão no palco. Toda a pose sai da distância d = index - t:
 *   d = 0   → centro, de frente, por cima
 *   d > 0   → próximos: empilhados atrás, à direita, levemente girados
 *   d < 0   → já vistos: saem girando para cima e para a esquerda
 */
export function CardStage({ card, index, t, intro, tiltX, tiltY }: Props) {
  const d = useTransform(t, (v) => index - v)

  // Pose do baralho (antes do scroll começar a escolher cartões): leque abaixo do título.
  const fanX = (index - 1.5) * 34
  const fanRot = (index - 1.5) * 9

  const x = useTransform([d, intro], ([dv, iv]: number[]) => {
    const pose = dv >= 0 ? clamp(dv, 0, 3) * 15 : dv * 70 // % da largura do cartão
    return `${mix(fanX, pose, iv)}%`
  })
  const y = useTransform([d, intro], ([dv, iv]: number[]) => {
    const pose = dv >= 0 ? clamp(dv, 0, 3) * -5 : dv * -38
    const fanY = Math.abs(index - 1.5) * 6 + 55
    return `${mix(fanY, pose, iv)}%`
  })
  const rotateZ = useTransform([d, intro], ([dv, iv]: number[]) => {
    const pose = dv >= 0 ? clamp(dv, 0, 3) * 5 : dv * 22
    return mix(fanRot, pose, iv)
  })
  const rotateYBase = useTransform(d, (dv) => (dv >= 0 ? clamp(dv, 0, 1) * -18 : dv * 50))
  const scale = useTransform([d, intro], ([dv, iv]: number[]) => {
    const pose = dv >= 0 ? 1 - clamp(dv, 0, 3) * 0.07 : 1 + dv * 0.12
    return mix(0.62, pose, iv)
  })
  const opacity = useTransform(d, (dv) => (dv >= 0 ? 1 - clamp(dv - 2, 0, 1) * 0.6 : clamp(1 + dv * 1.4, 0, 1)))
  const brightness = useTransform([d, intro], ([dv, iv]: number[]) => {
    const pose = dv >= 0 ? 1 - clamp(dv, 0, 3) * 0.22 : 1
    return `brightness(${mix(0.9, pose, iv)})`
  })
  const zIndex = useTransform(d, (dv) => (dv >= -0.5 ? 100 - Math.round(dv * 10) : 0))

  // O ponteiro só inclina o cartão ativo; os outros recebem fração disso.
  const focus = useTransform(d, (dv) => clamp(1 - Math.abs(dv), 0, 1))
  const rotateY = useTransform([rotateYBase, tiltX, focus], ([r, tx, f]: number[]) => r + tx * 14 * f)
  const rotateX = useTransform([tiltY, focus], ([ty, f]: number[]) => -ty * 12 * f)

  // Reflexo percorre o cartão conforme ele chega ao centro e com o ponteiro.
  const sheenRaw = useTransform([d, tiltX], ([dv, tx]: number[]) => 40 - dv * 70 + tx * 25)
  const sheen = useSpring(sheenRaw, { stiffness: 120, damping: 24 })

  return (
    <motion.div
      className={styles.slot}
      style={{ x, y, rotateZ, rotateY, rotateX, scale, opacity, zIndex, filter: brightness }}
      aria-hidden
    >
      <CreditCard card={card} sheen={sheen} />
      <motion.div className={styles.cardShadow} style={{ opacity: focus }} />
    </motion.div>
  )
}

const mix = (a: number, b: number, p: number) => a + (b - a) * p
