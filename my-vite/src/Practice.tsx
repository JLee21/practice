import { H1 } from '@blueprintjs/core'
import React, { FormEvent, useState } from 'react'

type Option = {
  label: string
  value: number
}

const options: Option[] = [
  { label: 'a', value: 1 },
  { label: 'b', value: 2 },
  { label: 'c', value: 3 },
]

const Practice: React.FC = () => {
  const [selected, setSelected] = useState<Option[]>([])

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { options: selectOptions } = event.target
    const selectedValues: Option[] = []
    for (let i = 0; i < selectOptions.length; i++) {
      if (selectOptions[i].selected) {
        const selectedOption = options.find(
          (option) => option.value === Number(selectOptions[i].value)
        )
        if (selectedOption) {
          selectedValues.push(selectedOption)
        }
      }
    }
    setSelected(selectedValues)
  }

  const handlSubmit = (event: FormEvent) => {
    event.preventDefault()
    // action here.
  }

  return (
    <div>
      <form onSubmit={handlSubmit}>
        <select id="multi-select" onChange={handleChange} multiple>
          {options.map(({ label, value }: Option) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </form>
      <div>
        <H1>Selected:</H1>

        {selected.map((option: Option) => (
          <p>
            <label>{option.label}</label>
            {option.value}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Practice
