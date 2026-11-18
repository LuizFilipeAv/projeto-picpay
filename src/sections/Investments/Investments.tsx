import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import styles from './Investments.module.css'

const PRODUCTS = [
  { name: 'Cofrinho', text: 'Comece a guardar dinheiro com rendimento automático a 102% do CDI' },
  { name: 'Renda Fixa', text: 'Invista com estabilidade em produtos com retorno' },
  { name: 'Fundos de Investimento', text: 'Conheça fundos especiais geridos por profissionais renomados do mercado' },
]

const LINE = 'M4 168 C 60 164, 90 150, 130 138 S 200 112, 240 84 S 330 36, 396 14'

function ProductRow({ p, i, progress, reduce }: { p: (typeof PRODUCTS)[number]; i: number; progress: MotionValue<number>; reduce: boolean }) {
  const a = 0.78 + i * 0.05
  const x = useTransform(progress, [a, a + 0.1], [48, 0])
  const o = useTransform(progress, [a, a + 0.08], [0, 1])
  return (
    <motion.li className={styles.row} style={reduce ? undefined : { x, opacity: o }}>
      <h3 className={styles.rowName}>{p.name}</h3>
      <p className={styles.rowText}>{p.text}</p>
      <svg className={styles.arrow} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </motion.li>
  )
}

export function Investments() {
  const reduce = !!useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const clip = useTransform(p, [0, 0.4], [8, 150], { ease: (t: number) => 1 - Math.pow(1 - t, 2) })
  const clipPath = useTransform(clip, (r) => `circle(${r}% at 50% 50%)`)
  const headO = useTransform(p, [0.18, 0.4], [0, 1])
  const headY = useTransform(p, [0.18, 0.4], [40, 0])
  const draw = useTransform(p, [0.5, 0.85], [0, 1])
  const dotO = useTransform(p, [0.83, 0.87], [0, 1])
  const chartO = useTransform(p, [0.46, 0.55], [0, 1])
  const cdi = useTransform(p, [0.5, 0.85], [0, 102])
  const cdiText = useTransform(cdi, (v) => `${Math.round(v)}%`)
  const btnO = useTransform(p, [0.9, 0.98], [0, 1])
  const btnY = useTransform(p, [0.9, 0.98], [16, 0])

  return (
    <section id="investimentos" className={styles.section}>
      <div ref={ref} className={styles.track} data-static={reduce}>
        <div className={styles.sticky}>
          <motion.div className={styles.circle} style={reduce ? { clipPath: 'circle(150% at 50% 50%)' } : { clipPath }} aria-hidden />
          <div className={`container ${styles.content}`}>
            <div className={styles.top}>
              <motion.h2 className={styles.title} style={reduce ? undefined : { opacity: headO, y: headY }}>
                Investir e dar novos rumos para o seu dinheiro
              </motion.h2>

              <motion.div className={styles.chart} style={reduce ? undefined : { opacity: chartO }}>
                <svg viewBox="0 0 400 180" className={styles.svg} role="img" aria-label="Gráfico ilustrativo de rendimento crescente">
                  <line x1="0" y1="176" x2="400" y2="176" className={styles.axis} />
                  <motion.path d={LINE} className={styles.line} fill="none" strokeWidth="4" strokeLinecap="round" style={reduce ? undefined : { pathLength: draw }} />
                  <motion.g style={reduce ? undefined : { opacity: dotO }}>
                    <circle cx="396" cy="14" r="6" className={styles.pulse} />
                    <circle cx="396" cy="14" r="6" className={styles.dot} />
                  </motion.g>
                </svg>
                <p className={`${styles.cdi} tabular`}>
                  <span className={styles.cdiNum}>{reduce ? '102%' : <motion.span>{cdiText}</motion.span>}</span> do CDI
                </p>
              </motion.div>
            </div>

            <ul className={styles.rows}>
              {PRODUCTS.map((pr, i) => (
                <ProductRow key={pr.name} p={pr} i={i} progress={p} reduce={reduce} />
              ))}
            </ul>

            <motion.a href="https://picpay.com/pt-br/pf" target="_blank" rel="noopener noreferrer" className={styles.cta} style={reduce ? undefined : { opacity: btnO, y: btnY }}>
              Conheça os investimentos
            </motion.a>
          </div>
        </div>
      </div>
    </section>
  )
}

