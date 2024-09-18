import { Button, H1, H4, Intent } from '@blueprintjs/core'
import React, { useEffect } from 'react'

const FuncComponent: React.FC = () => {
  const [count, setCount] = React.useState<number>(0)
  const [data, setData] = React.useState<string>()
  const [windowWidth, setWindowWidth] = React.useState<number>(
    window.innerWidth
  )

  // setInterval
  useEffect(() => {
    const handlerId = setInterval(() => {
      setCount((count) => count + 1)
    }, 500)
    return () => {
      clearInterval(handlerId)
    }
  }, [])

  // setTimeout
  useEffect(() => {
    const handler = setTimeout(() => {
      setData('Data fetched!')
    }, 3000)
    return () => {
      clearTimeout(handler)
    }
  }, [])

  // Window resizing
  useEffect(() => {
    const handler = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handler)
    return () => {
      window.removeEventListener('resize', handler)
    }
  }, [])

  return (
    <div>
      <H1>Functional Component</H1>
      <H4>Count: {count}</H4>
      <Button
        intent={Intent.PRIMARY}
        onClick={() => setCount((count) => count + 1)}
      >
        Increment Count
      </Button>
      {data ? <H4>{data}</H4> : <H4>Loading data...</H4>}
      <p>Window Width: {windowWidth}px</p>
    </div>
  )
}

export default FuncComponent
