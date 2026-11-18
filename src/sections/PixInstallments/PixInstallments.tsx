import { useEffect, useId, useState } from 'react'
import type { ChangeEvent } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { Reveal, SplitWords } from '../../components/Reveal'
import { EASE_OUT } from '../../lib/motion'
import styles from './PixInstallments.module.css'

const MIN_CENTS = 1000
const MAX_CENTS = 5_000_000
const MONTHLY_RATE = 0.0249
const MAX_INSTALLMENTS = 36

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const num = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const money = (v: number) => brl.format(v).replace(/ /g, ' ')

/** Tabela Price: PMT = PV * i / (1 - (1 + i)^-n). */
function installmentValue(principal: number, n: number) {
  return (principal * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -n))
}

const POINTS = [
  'PicPay dá muito mais tempo para você',
  'Parcele com cartões de qualquer banco',
  'Combine até 2 cartões para pagamentos',
]

function Check() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9.25" />
      <path d="m8 12.25 2.9 2.9L16.25 9.5" />
    </svg>
  )
}

export function PixInstallments() {
  const reduce = useReducedMotion()
  const uid = useId()
  const [cents, setCents] = useState(120000)
  const [n, setN] = useState(36)

  const error =
    cents < MIN_CENTS
      ? 'O valor mínimo do Pix parcelado é R$ 10,00. Aumente o valor.'
      : cents > MAX_CENTS
        ? 'O valor máximo é R$ 50.000,00. Reduza o valor.'
        : null
  const valid = !error
  const pmt = installmentValue(cents / 100, n)
  const total = pmt * n

  // Contagem animada do valor da parcela
  const shown = useMotionValue(pmt)
  const text = useTransform(shown, (v) => num.format(v))
  useEffect(() => {
    if (!valid) return
    if (reduce) {
      shown.set(pmt)
      return
    }
    const c = animate(shown, pmt, { duration: 0.7, ease: EASE_OUT })
    return () => c.stop()
  }, [pmt, valid, reduce, shown])

  const onValue = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9)
    setCents(digits ? parseInt(digits, 10) : 0)
  }

  const fill = ((n - 1) / (MAX_INSTALLMENTS - 1)) * 100

  return (
    <section id="pix" className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <SplitWords text="Organizar a sua vida financeira com mais liberdade" className={styles.title} />
          <Reveal delay={0.15}>
            <p className={styles.lead}>Pix e Boletos em até 36x no cartão de qualquer banco.</p>
          </Reveal>
          <ul className={styles.points}>
            {POINTS.map((p, i) => (
              <li key={p}>
                <Reveal as="div" delay={0.25 + i * 0.08} className={styles.point}>
                  <span className={styles.check}>
                    <Check />
                  </span>
                  <span>{p}</span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={0.1}>
          <div className={styles.card}>
            <div className={styles.field}>
              <label htmlFor={`${uid}-v`} className={styles.label}>
                Valor do Pix
              </label>
              <input
                id={`${uid}-v`}
                className={styles.input}
                inputMode="numeric"
                autoComplete="off"
                value={money(cents / 100)}
                onChange={onValue}
                aria-invalid={!valid}
                aria-describedby={`${uid}-e`}
              />
              <p id={`${uid}-e`} className={styles.error} role="alert" data-visible={!valid}>
                {error ?? ' '}
              </p>
            </div>

            <div className={styles.field}>
              <div className={styles.row}>
                <label htmlFor={`${uid}-n`} className={styles.label}>
                  Parcelas
                </label>
                <span className={`${styles.count} tabular`}>{n}x</span>
              </div>
              <input
                id={`${uid}-n`}
                type="range"
                min={1}
                max={MAX_INSTALLMENTS}
                step={1}
                value={n}
                onChange={(e) => setN(Number(e.target.value))}
                className={styles.range}
                style={{ ['--fill' as string]: `${fill}%` }}
                aria-valuetext={`${n} parcelas`}
              />
              <div className={styles.ticks} aria-hidden>
                <span>1x</span>
                <span>36x</span>
              </div>
            </div>

            <div className={styles.bars} aria-hidden>
              {Array.from({ length: MAX_INSTALLMENTS }, (_, i) => {
                const on = i < n
                return (
                  <motion.span
                    key={i}
                    className={styles.bar}
                    initial={false}
                    animate={{ scaleY: on ? 1 : 0.3, opacity: on ? 1 : 0.5, backgroundColor: on ? '#38b160' : '#acacac' }}
                    transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE_OUT, delay: i * 0.012 }}
                  />
                )
              })}
            </div>

            <div className={styles.result} aria-live="polite">
              {valid ? (
                <>
                  <p className={`${styles.big} tabular`}>
                    <span>{n}x de R$&nbsp;</span>
                    <motion.span>{text}</motion.span>
                  </p>
                  <p className={`${styles.total} tabular`}>
                    Total {money(total)} · taxa ilustrativa de 2,49% a.m.
                  </p>
                </>
              ) : (
                <p className={styles.big} data-muted>
                  Corrija o valor
                </p>
              )}
            </div>

            <button type="button" className={styles.cta} disabled={!valid}>
              Simular no app
            </button>
            <p className={styles.fine}>Simulação ilustrativa. Taxas reais no app.</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
