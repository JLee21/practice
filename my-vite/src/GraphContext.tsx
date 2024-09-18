import { createContext, ReactNode, useContext, useState } from 'react'

interface GraphContextProps {
  direction: string
  setDirection: (direction: string) => void
}

const GraphContext = createContext<GraphContextProps | undefined>(undefined)

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [direction, setDirection] = useState('TB')

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
