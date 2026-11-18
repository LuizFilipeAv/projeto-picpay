export type CardTier = 'gold' | 'platinum' | 'black' | 'epic'

export type CardData = {
  id: CardTier
  name: string
  /** Rótulo impresso no cartão (canto superior). */
  label?: string
  headline: string
  features: string[]
  /** Cor do brilho ambiente da seção quando este cartão está ativo. */
  glow: string
  /** Fundo do cartão. */
  surface: string
  /** Texto e ícones impressos no cartão. */
  ink: string
  network: 'color' | 'mono'
}

export const CARDS: CardData[] = [
  {
    id: 'gold',
    name: 'PicPay Gold',
    headline: 'Limite de até R$ 4 mil',
    features: ['Anuidade zero', 'Pix e Boletos em 24x', 'Parcelamento de compras feitas à vista'],
    glow: '#3cc58a',
    surface: 'linear-gradient(150deg, #5fd9a2 0%, #3cc58a 38%, #24946a 100%)',
    ink: 'rgb(255 255 255 / 0.92)',
    network: 'color',
  },
  {
    id: 'platinum',
    name: 'PicPay Platinum',
    label: 'platinum',
    headline: 'Limite de até R$ 10 mil',
    features: ['0,5% de cashback que rende 102% do CDI', 'Seguro médico em viagens', 'Até 3 cartões adicionais'],
    glow: '#16e584',
    surface: 'linear-gradient(150deg, #3ff5a0 0%, #16e584 30%, #0a9e4e 100%)',
    ink: 'rgb(1 40 24 / 0.9)',
    network: 'color',
  },
  {
    id: 'black',
    name: 'PicPay Black',
    label: 'black',
    headline: 'Limite sob consulta',
    features: ['1,2% de cashback que rende 102% do CDI', 'Sala VIP em aeroportos', 'Até 5 cartões adicionais'],
    glow: '#6b6b6b',
    surface: 'linear-gradient(150deg, #3a3a3a 0%, #1c1c1c 45%, #0b0b0b 100%)',
    ink: 'rgb(255 255 255 / 0.88)',
    network: 'mono',
  },
  {
    id: 'epic',
    name: 'PicPay Epic',
    label: 'black',
    headline: 'Limite sob consulta',
    features: [
      'Até 4% de cashback',
      'Até 3x sem juros nas compras internacionais',
      'Cofrinho Turbinado com rendimento diário de 121% do CDI',
    ],
    glow: '#9aa3b8',
    surface: 'linear-gradient(150deg, #4a4d55 0%, #23252b 40%, #111215 75%, #2c2f36 100%)',
    ink: 'rgb(235 238 245 / 0.92)',
    network: 'mono',
  },
]

export const SHARED_BENEFITS = [
  'Zero anuidade*',
  'Cartão virtual',
  'Cashback',
  'Benefícios Mastercard',
  'Limite extra',
  'Internacional',
]
