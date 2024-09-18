import { createContext, ReactNode, useContext, useState } from 'react'
import { RankDir } from './Flow'

interface GraphContextProps {
  direction: RankDir | null
  setDirection: (direction: RankDir | null) => void
}

const GraphContext = createContext<GraphContextProps | undefined>(undefined)

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [direction, setDirection] = useState<RankDir | null>(null)

  return (
    <GraphContext.Provider value={{ direction, setDirection }}>
      {children}
    </GraphContext.Provider>
  )
}

export const useGraph = () => {
  const context = useContext(GraphContext)
  if (!context) {
    throw new Error('useGraph must be used within a GraphProvider')
  }
  return context
}
