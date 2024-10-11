import { Callout, Intent, Tab, Tabs } from '@blueprintjs/core'
import './App.css'
import ClassComponent from './ClassComponent'
import Flow from './Graph/Flow'
import PassportForm from './SimpleForm'
import Search from './Search'
import FuncComponent from './FuncComponent'
import Practice from './Practice'
import Ocean from './Fetch'

const tabs = [
  {
    id: 'home',
    title: 'Home',
    panel: <Callout intent={Intent.PRIMARY}>Time to practice</Callout>,
  },
  {
    id: 'class',
    title: 'Class & Func Component',
    panel: (
      <div style={{ display: 'flex', gap: 20 }}>
        <ClassComponent />
        <FuncComponent />
      </div>
    ),
  },
  { id: 'search', title: 'Search', panel: <Search /> },
  { id: 'form', title: 'Simple Form', panel: <PassportForm /> },
  {
    id: 'flow',
    title: 'Nodes & Edges',
    panel: (
      <div style={{ height: '100vh' }}>
        <Flow />
      </div>
    ),
  },
  {
    id: 'Practice',
    title: 'Practice',
    panel: <Practice />,
  },
  {
    id: 'fetch',
    title: 'Fetch',
    panel: <Ocean />,
  },
]

const App: React.FC = () => {
  return (
    <>
      <Tabs defaultSelectedTabId="flow">
        {tabs.map((tab) => (
          <Tab key={tab.id} id={tab.id} title={tab.title} panel={tab.panel} />
        ))}
      </Tabs>
    </>
  )
}

export default App
