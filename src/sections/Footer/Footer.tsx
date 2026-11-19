import styles from './Footer.module.css'

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
                      // Sem página própria neste projeto: texto, não link.
                      <span className={styles.plain}>{link}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>
            Projeto de estudo de front-end, sem vínculo com o PicPay. Nomes e marcas pertencem aos seus donos. Nenhum dado é coletado e
            nenhuma conta é aberta aqui.
          </p>
        </div>
      </div>
    </footer>
  )
}
