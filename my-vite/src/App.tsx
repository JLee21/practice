import { Callout, Intent, Tab, Tabs } from '@blueprintjs/core'
import './App.css'
import ClassComponent from './ClassComponent'
import Flow from './Graph/Flow'
import PassportForm from './SimpleForm'
import Search from './Search'
import FuncComponent from './FuncComponent'

const App: React.FC = () => {
  return (
    <>
      <Tabs defaultSelectedTabId="flow">
        <Tab
          id="home"
          title="Home"
          panel={<Callout intent={Intent.PRIMARY}>Time to practice</Callout>}
        />
        <Tab
          id="class"
          title="Class & Func Component"
          panel={
            <div style={{ display: 'flex', gap: 20 }}>
              <ClassComponent />
              <FuncComponent />
            </div>
          }
        />
        <Tab id="search" title="Search" panel={<Search />} />
        <Tab id="form" title="Simple Form" panel={<PassportForm />} />
        <Tab
          id="flow"
          title="Nodes & Edges"
          panel={
            <div style={{ height: '100vh' }}>
              <Flow />
            </div>
          }
        />
      </Tabs>
    </>
  )
}

export default App
