import { Callout, InputGroup } from '@blueprintjs/core'
import React from 'react'

export const DELAY_MS = 500

/**
 * Custom hook that debounces a value.
 *
 * @template T - The type of the value.
 * @param value - The value to debounce.
 * @param delay - The delay in milliseconds.
 * @returns The debounced value.
 */
export const useDebounce = <T,>(value: T, delay: number = DELAY_MS): T => {
  const [debouncedValue, setDebouncedValue] = React.useState(null as T)

  React.useEffect(() => {
    const id = window.setTimeout(() => setDebouncedValue(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])

  return debouncedValue
}

const Search: React.FC = () => {
  const [search, setSearch] = React.useState('')
  const debouncedValue = useDebounce(search, DELAY_MS)

  return (
    <>
      <InputGroup
        value={search}
        onValueChange={(val) => setSearch(val)}
        leftIcon="search"
        placeholder="Search..."
      />
      <Callout title={`I'm delayed by ${DELAY_MS}ms`}>
        {debouncedValue || '...'}
      </Callout>
    </>
  )
}

export default Search
