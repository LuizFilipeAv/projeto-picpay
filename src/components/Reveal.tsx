import type { ElementType, ReactNode } from 'react'
import { motion } from 'motion/react'
import { enter, riseIn, staggerParent, VIEWPORT } from '../lib/motion'

// motion.create precisa ser estável entre renders; cacheia por tag.
const cache = new Map<ElementType, ElementType>()
const motionTag = (as: ElementType): ElementType => {
  let c = cache.get(as)
  if (!c) {
    c = motion.create(as as 'div') as ElementType
    cache.set(as, c)
  }
  return c
}

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  delay?: number
}

/** Entrada padrão ao entrar na viewport. Use em blocos, não em toda linha. */
export function Reveal({ children, as = 'div', className, delay = 0 }: RevealProps) {
  const Tag = motionTag(as)
  return (
    <Tag
      className={className}
      variants={delay ? { ...riseIn, visible: { ...riseIn.visible, transition: { ...enter, delay } } } : riseIn}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </Tag>
  )
}

type SplitWordsProps = {
  text: string
  as?: ElementType
  className?: string
  delay?: number
  /** Anima ao montar em vez de ao entrar na viewport. */
  immediate?: boolean
}

/** Título que entra palavra a palavra, cada palavra subindo por trás de uma máscara. */
export function SplitWords({ text, as = 'h2', className, delay = 0, immediate }: SplitWordsProps) {
  const Tag = motionTag(as)
  const lines = text.split('\n')
  const trigger = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: VIEWPORT }

  return (
    <Tag className={className} variants={staggerParent(delay, 0.05)} initial="hidden" {...trigger} aria-label={text.replace(/\n/g, ' ')}>
      {lines.map((line, li) => (
        <span key={li} aria-hidden style={{ display: 'block' }}>
          {line.split(' ').map((word, wi) => (
            <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.2em', marginBottom: '-0.2em' }}>
              <motion.span
                style={{ display: 'inline-block', willChange: 'transform' }}
                variants={{
                  hidden: { y: '110%', rotate: 4 },
                  visible: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } },
                }}
              >
                {word}
              </motion.span>
              {wi < line.split(' ').length - 1 ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  )
}
