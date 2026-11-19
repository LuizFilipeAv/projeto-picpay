import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { EASE_OUT, enter, riseIn, staggerParent } from '../../lib/motion'
import { useIntro } from '../../components/Intro/IntroContext'
import { lockScroll, unlockScroll } from '../../lib/scrollLock'
import styles from './Nav.module.css'

const LINKS = [
  { label: 'Conta', href: '#conta' },
  { label: 'Cartões', href: '#cartoes' },
  { label: 'Pix e Boletos', href: '#pix' },
  { label: 'Investimentos', href: '#investimentos' },
  { label: 'Seguros', href: '#seguros' },
]

/** Scroll (px) a partir do qual a barra vira a pill compacta. */
const COMPACT_AT = 40
/** Até aqui a barra nunca esconde. */
const HIDE_AFTER = 240
/** Velocidade (px/s) descendo rápido: esconde. Subindo: reaparece. */
const HIDE_SPEED = 600
const SHOW_SPEED = -200

const instant = { duration: 0 }
/** Entrada da barra logo depois que a cortina começa a subir (o título da hero já está subindo). */
const ENTER = { duration: 1, ease: EASE_OUT, delay: 0.55 }

function join(...names: (string | false | undefined)[]) {
  return names.filter(Boolean).join(' ')
}

export function Nav() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const [compact, setCompact] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { revealed } = useIntro()
  const show = revealed || !!reduce
  const entered = useRef(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setCompact(latest > COMPACT_AT)
    if (reduce || open) return
    const speed = scrollY.getVelocity()
    if (latest <= HIDE_AFTER || speed < SHOW_SPEED) setHidden(false)
    else if (speed > HIDE_SPEED) setHidden(true)
  })

  // Fecha o menu ao virar desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 860px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Menu aberto: trava o scroll (inclusive o do Lenis).
  useEffect(() => {
    if (!open) return
    lockScroll()
    return unlockScroll
  }, [open])

  // Esc fecha o menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const isHidden = hidden && !open
  const close = () => setOpen(false)

  return (
    <motion.header
      className={styles.header}
      initial={reduce ? false : { y: '-130%' }}
      animate={{ y: !show ? '-130%' : isHidden ? '-110%' : '0%' }}
      transition={reduce ? instant : entered.current ? enter : ENTER}
      onAnimationComplete={() => {
        if (show) entered.current = true
      }}
    >
      <div className={join(styles.bar, compact || open ? styles.compact : styles.onDark)}>
        <a href="#conta" className={styles.brand} aria-label="PicPay, voltar ao início">
          PicPay
        </a>

        <nav aria-label="Seções da página" className={styles.links}>
          <ul className={styles.linkList}>
            {LINKS.map((link, i) => (
              <motion.li
                key={link.href}
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={show ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.7, ease: EASE_OUT, delay: reduce ? 0 : 0.75 + i * 0.05 }}
              >
                <a href={link.href} className={styles.link}>
                  {link.label}
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href="#abrir-conta" className={styles.cta}>
            Abrir conta
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path className={styles.barTop} d="M4 8h16" />
              <path className={styles.barBottom} d="M4 16h16" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            className={styles.sheet}
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={reduce ? instant : { duration: 0.4, ease: EASE_OUT }}
          >
            <motion.nav
              aria-label="Menu"
              className={styles.sheetNav}
              variants={staggerParent(0.05, 0.06)}
              initial={reduce ? false : 'hidden'}
              animate="visible"
            >
              {LINKS.map((link) => (
                <motion.a key={link.href} href={link.href} className={styles.sheetLink} variants={riseIn} onClick={close}>
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
            <motion.div className={styles.sheetFoot} variants={riseIn} initial={reduce ? false : 'hidden'} animate="visible">
              <a href="#abrir-conta" className={styles.ghostWide} onClick={close}>
                Abrir conta
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
