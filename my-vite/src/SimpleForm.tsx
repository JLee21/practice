import React, { useState } from 'react'

const passportFormats: { [country: string]: string } = {
  USA: 'LDDDDDDDD',
  Canada: 'LLDDDDDD',
  Ireland: 'AADDDDDDD',
  Japan: 'LLDDDDDDD',
}

const isLetter = (char: string) => /[[a-zA-Z]/i.test(char) // L
const isAlphanumeric = (char: string) => /[[a-zA-Z0-9]/i.test(char) // A
const isDigit = (char: string) => /[[0-9]/i.test(char) // D

/**
 *
 * @param passportNum
 * @param passportFormat
 * @returns
 */
const isValid = (
  passportNum: string | undefined,
  passportFormat: string | undefined
): boolean => {
  // passportNum: 123412342 // happy
  // passportNum: 12341234A // fail
  // passportNum: 1234 // fail

  // check nulls?
  if (!passportNum || !passportFormat) return false
  // check trims for whitespace from user

  // check the length of format and number
  if (passportNum.length !== passportFormat.length) return false

  // loop through both format and number, check if they are valid
  for (let i = 0; i < passportNum.length; i++) {
    const formatChar = passportFormat[i]
    const char = passportNum[i]

    if (formatChar === 'L' && isLetter(char)) continue
    if (formatChar === 'A' && isAlphanumeric(char)) continue
    if (formatChar === 'D' && isDigit(char)) continue

    return false
  }
  // if we make it to the end, then valid.
  return true
}

// console.log('*** USA')
// console.log(isValid('L12345678', passportFormats['USA'])) // true
// console.log(isValid('L1234567', passportFormats['USA'])) // false
// console.log(isValid('012345678', passportFormats['USA'])) // false
// console.log(isValid('L1234567 ', passportFormats['USA'])) // should false.

// console.log('*** Ireland')
// console.log(isValid('AA1234567', passportFormats['Ireland'])) // true
// console.log(isValid('001234567', passportFormats['Ireland'])) // true
// console.log(isValid('aa1234567', passportFormats['Ireland'])) // true
// console.log(isValid('L1234567', passportFormats['Ireland'])) // false
// console.log(isValid('012345678', passportFormats['Ireland'])) // true
// console.log(isValid('L1234567 ', passportFormats['Ireland'])) // false.

const PassportForm: React.FC = () => {
  const [country, setCountry] = useState<string>()
  const [passport, setPassport] = useState<string>()
  const [error, setError] = useState<string>()

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const valid = isValid(passport, country)
          if (!valid) {
            setError('Passport number is invalid')
          } else {
            setError('')
          }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div>
          <label>Country</label>
          <select
            onChange={(e) => setCountry(e.currentTarget.value)}
            name="country"
            value={country}
          >
            {Object.entries(passportFormats).map(([country, format]) => (
              <option key={country} value={format}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Passport</label>
          <input
            onChange={(e) => setPassport(e.currentTarget.value)}
            type="text"
            id="passport"
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <button disabled={!country || !passport}>Validate</button>
      </form>
    </div>
  )
}

export default PassportForm
