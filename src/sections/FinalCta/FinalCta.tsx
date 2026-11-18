import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { Reveal } from '../../components/Reveal'
import { DUR, EASE_OUT } from '../../lib/motion'
import styles from './FinalCta.module.css'

const WORDS = ['descomplicada.', 'simples.', 'segura.', 'inovadora.']
const ROTATE_EVERY = 2200

export function FinalCta() {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  // A palavra só gira com a seção visível: não gasta frames fora da tela.
  const inView = useInView(ref, { margin: '-15% 0px' })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || !inView) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % WORDS.length)
    }, ROTATE_EVERY)
    return () => window.clearInterval(id)
  }, [reduce, inView])

  const word = WORDS[reduce ? 0 : index]

  const copy = (
    <>
      <p className={styles.lead}>Mais de 70 milhões de brasileiros já escolheram. Abra sua conta em minutos, direto no app.</p>
      <button type="button" className={styles.cta}>
        Abrir conta
      </button>
    </>
  )

  return (
    <section ref={ref} className={styles.section} aria-labelledby="final-cta-title">
      <div className={`container ${styles.inner}`}>
        <h2 id="final-cta-title" className={styles.heading}>
          <span>Com PicPay, a experiência é</span>
          <span className={styles.rotatorLine}>
            <motion.span layout={!reduce} className={styles.line} transition={{ layout: { duration: DUR.base, ease: EASE_OUT } }}>
              {reduce ? (
                <span className={styles.word}>{word}</span>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={word}
                    className={styles.word}
                    aria-hidden="true"
                    initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    exit={{ y: '-100%', opacity: 0 }}
                    transition={{ duration: DUR.base, ease: EASE_OUT }}
                  >
                    {word}
                  </motion.span>
                </AnimatePresence>
              )}
            </motion.span>
            <span className="visually-hidden">{word}</span>
          </span>
        </h2>

        {reduce ? <div className={styles.body}>{copy}</div> : <Reveal className={styles.body}>{copy}</Reveal>}
      </div>
    </section>
  )
}
