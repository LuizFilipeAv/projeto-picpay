# PicPay PF — redesign com motion

Refatoração do front de `picpay.com/pt-br/pf`. Referência de ritmo e motion: `tuyo.com`.
Inspiração, não cópia: a identidade (verde PicPay, conteúdo, produtos) é da PicPay; o ritmo
(seções full-bleed, elementos sticky, revelações por scroll) vem do Tuyo.

## Modo

Persuade. A página vende a conta e o cartão. Cada seção tem **um** momento de motion autoral.

## Paleta (extraída do site atual)

| Token | Valor | Origem / uso |
|---|---|---|
| `--green-500` | `#38B160` | `--primary-color` do site. CTAs, marca. |
| `--green-400` | `#4FD17A` | Verde clareado para texto/realce sobre fundo escuro (contraste). |
| `--green-700` | `#238662` | `--secondary-pf-color`. Seção de investimentos, links. |
| `--green-900` | `#013E27` | `--secondary-dark-color`. Texto sobre verde, sombras tintadas. |
| `--ink` | `#131313` | `--gray-darkest-color`. Fundo da seção de cartões, hero. |
| `--ink-2` | `#1F1F1F` | `--card-black`. Superfícies sobre ink. |
| `--gray-600` | `#666666` | Texto secundário em fundo claro. |
| `--gray-400` | `#ACACAC` | `--card-black-description-color`. Texto secundário em fundo escuro. |
| `--gray-200` | `#E6E6E6` | Seções alternadas claras. |
| `--paper` | `#F2F2F2` | Fundo base claro. |
| `--white` | `#FFFFFF` | |

Cartões: Gold (verde-menta `#3CC58A → #24946A`), Platinum (verde vivo `#16E584 → #0A9E4E`),
Black (`#2B2B2B → #0B0B0B`), Epic (grafite com reflexo cromado).

## Tipografia

Aeonik (fonte do site) é proprietária. Substituta: **Onest Variable** (grotesca geométrica,
suporta PT-BR). Display 700, tracking −0.03em, line-height 0.95–1.05. Corpo 400, 1.45.
Escala: display `clamp(2.75rem, 7vw, 6rem)`, h2 `clamp(2rem, 4.5vw, 3.75rem)`, h3 `1.5rem`.

## Motion

- Personalidade: **Premium com energia**. Nada quica; tudo desacelera longo.
- Easing assinatura: `cubic-bezier(0.22, 1, 0.36, 1)` (mesmo do Tuyo, ease-out-quint).
- Durações: `160ms` (hover/press) · `550ms` (entradas) · `900ms` (revelações dramáticas).
- Entrada padrão: sobe 24px + blur 8px → 0 + opacity. Stagger 60ms, total < 500ms.
- Scroll suave com Lenis; animações scroll-linked com `motion` (`useScroll`/`useTransform`).
- `prefers-reduced-motion`: sem scroll suave, sem parallax; conteúdo visível estático.

### Momentos por seção

1. **Hero** — painel escuro com aurora verde ambiente; título entra palavra a palavra.
2. **Celular sticky** — celular sobe sobre a manchete "Rende 102% do CDI"; saldo conta ao vivo.
3. **Texto que acende** — "70 milhões de brasileiros..." palavras passam de cinza a tinta com o scroll.
4. **Cartões (peça central)** — seção sticky: os 4 cartões em leque; o scroll traz cada um ao centro
   com rotação 3D, troca a cor ambiente e desliza as características do cartão.
5. **Pix e Boletos** — simulador de parcelas 1–36x com número animado.
6. **Investimentos** — círculo (clip-path) expande do centro e vira seção verde; linha de rendimento desenha.
7. **Seguros** — cards em leque que abrem no scroll.
8. **CTA final** — palavra rotativa (descomplicada / simples / segura / inovadora).
