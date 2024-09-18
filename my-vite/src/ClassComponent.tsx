import { Button, H1, H4, Intent } from '@blueprintjs/core'
import React from 'react'

interface State {
  count: number
  data: string | null
  windowWidth: number
  intervalId: NodeJS.Timeout | null
}

class ClassComponent extends React.Component<{}, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      count: 0,
      data: null,
      windowWidth: window.innerWidth,
      intervalId: null,
    }
    // Binding the event handler
    this.handleIncrement = this.handleIncrement.bind(this)
  }

  // Lifecycle: componentDidMount (used for side effects like data fetching and adding event listeners)
  componentDidMount() {
    // Simulate fetching data
    this.fetchData()

    // Add event listener
    window.addEventListener('resize', this.handleResize)

    // Example of setting an interval
    const intervalId = setInterval(() => {
      this.setState((prevState) => ({ count: prevState.count + 1 }))
    }, 1000)

    this.setState({ intervalId })
  }

  // Lifecycle: componentDidUpdate (used to respond to state/prop changes)
  componentDidUpdate(prevProps: any, prevState: State) {
    if (prevState.count !== this.state.count) {
      // console.log(`Count updated to: ${this.state.count}`)
    }
  }

  // Lifecycle: componentWillUnmount (used for cleanup, like removing listeners or clearing intervals)
  componentWillUnmount() {
    // Clean up interval
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId)
    }

    // Remove event listener
    window.removeEventListener('resize', this.handleResize)
  }

  // Event handler for incrementing the count
  handleIncrement() {
    this.setState((prevState) => ({ count: prevState.count + 1 }))
  }

  // Event handler for handling window resize
  handleResize = () => {
    this.setState({ windowWidth: window.innerWidth })
  }

  // Simulate fetching data
  fetchData() {
    setTimeout(() => {
      this.setState({ data: 'Data fetched!' })
    }, 3000)
  }

  render() {
    return (
      <div>
        <H1>Class Component</H1>
        <H4>Count: {this.state.count}</H4>
        <Button intent={Intent.PRIMARY} onClick={this.handleIncrement}>
          Increment Count
        </Button>

        {this.state.data ? (
          <H4>{this.state.data}</H4>
        ) : (
          <H4>Loading data...</H4>
        )}

        <p>Window Width: {this.state.windowWidth}px</p>
      </div>
    )
  }
}

export default ClassComponent
