import { Button } from '@blueprintjs/core'
import React, { useEffect, useState } from 'react'

// Create an application that uses the github apis (graphql or rest) to view files in a github repo.
// For frontend focused create a UI and for backend focused create a CLI

// assume endpoitn to a github repo, hardcoded for now.
// fetch, the endpoint -> return string[] 'src/package.json', etc.
// UI states, no data, loading, data
// save API data as string[] state.
// presentaitonal, loop through state -> display nicely

const OWNER = 'JLee21'
const REPO = 'udacity-design'
const URL = `https://api.github.com/repos/${OWNER}/${REPO}/contents`

type FileContent = any

const Fetch: React.FC = () => {
  const [fileContents, setFileContents] = useState<FileContent[]>([])

  // data layer
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL)
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        setFileContents(json)
        return json
      } catch (error: any) {
        console.error(error.message)
      }
    }
    fetchData()
  }, [])

  // loading state

  // error state

  // no data state

  // data
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {fileContents.map((fileContent) => (
        <Button minimal key={fileContent.name}>
          {fileContent.path}
        </Button>
        // Subrow
      ))}
    </div>
  )
}

export default Fetch
