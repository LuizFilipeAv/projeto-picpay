import styles from './Footer.module.css'

const EXTERNAL_URL = 'https://picpay.com/pt-br/pf'

/** Links que têm seção correspondente na própria página. */
const SECTION_ANCHORS: Record<string, string> = {
  'Conta digital': '#conta',
  'Cartão de crédito': '#cartoes',
  Empréstimos: '#pix',
  Investimentos: '#investimentos',
  Seguros: '#seguros',
}

const COLUMNS = [
  {
    title: 'Para você',
    links: ['Conta digital', 'Cartão de crédito', 'Empréstimos', 'Investimentos', 'Seguros'],
  },
  {
    title: 'PicPay',
    links: ['Sobre nós', 'Carreiras', 'Imprensa', 'Blog'],
  },
  {
    title: 'Ajuda',
    links: ['Central de ajuda', 'Segurança', 'Privacidade', 'Ouvidoria'],
  },
]

/** Ícones desenhados no mesmo traço (1.75) para casar com o restante da interface. */
const SOCIAL = [
  {
    label: 'Instagram',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </>
    ),
  },
  {
    label: 'X',
    path: <path d="M4 4l16 16M20 4L4 20" />,
  },
  {
    label: 'LinkedIn',
    path: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M8 11v5M8 8v.01M12 16v-5M12 13a2 2 0 0 1 4 0v3" />
      </>
    ),
  },
  {
    label: 'YouTube',
    path: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10 9.5l4.5 2.5-4.5 2.5z" />
      </>
    ),
  },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.columns}>
          {COLUMNS.map((column) => (
            <div key={column.title} className={styles.column}>
              <h2 className={styles.title}>{column.title}</h2>
              <ul className={styles.list}>
                {column.links.map((link) => (
                  <li key={link}>
                    {SECTION_ANCHORS[link] ? (
                      <a href={SECTION_ANCHORS[link]} className={styles.link}>
                        {link}
                      </a>
                    ) : (
                      <a href={EXTERNAL_URL} target="_blank" rel="noopener noreferrer" className={styles.link}>
                        {link}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>PicPay Instituição de Pagamento S.A. — CNPJ 22.896.431/0001-10</p>
          <ul className={styles.social}>
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a href={EXTERNAL_URL} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label={item.label}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    {item.path}
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
