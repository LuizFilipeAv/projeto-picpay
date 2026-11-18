import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

type IntroState = {
  /** true quando a cortina começou a sair: a hero pode entrar por baixo dela. */
  revealed: boolean
  /** Chamado pela cortina no início da saída. */
  reveal: () => void
}

const IntroCtx = createContext<IntroState>({ revealed: true, reveal: () => {} })

/**
 * Coordena a cortina de abertura com a hero.
 * Sem cortina (ou com movimento reduzido) `revealed` começa true.
 */
export function IntroProvider({ children, initiallyRevealed = false }: { children: ReactNode; initiallyRevealed?: boolean }) {
  const [revealed, setRevealed] = useState(initiallyRevealed)
  const reveal = useCallback(() => setRevealed(true), [])
  const value = useMemo(() => ({ revealed, reveal }), [revealed, reveal])
  return <IntroCtx.Provider value={value}>{children}</IntroCtx.Provider>
}

export const useIntro = () => useContext(IntroCtx)
