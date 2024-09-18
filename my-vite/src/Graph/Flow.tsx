import {
  Button,
  ButtonGroup,
  Colors,
  Divider,
  InputGroup,
} from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import {
  Background,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '../Search.js'
import { initialEdges, initialNodes } from './example-nodes-edges.js'
import { GraphProvider, useGraph } from './GraphContext.js'
import { toNodeAndEdges } from './node-util.js'
import CircleNode from './Nodes/Circle.js'
import { getLayoutedElements } from './dagre.js'

const nodeTypes = {
  circle: CircleNode,
}

export enum RankDir {
  TB = 'TB',
  BT = 'BT',
  LR = 'LR',
  RL = 'RL',
}

const Layout = () => {
  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [tree, setTree] = useState('')
  const [error, setError] = useState<string | undefined>()
  const { direction, setDirection } = useGraph()
  const treeDebounced = useDebounce(tree)

  // Debounce the tree input to prevent too many layout calculations.
  useEffect(() => {
    const { nodes, edges, error } = toNodeAndEdges(treeDebounced)
    const layouted = getLayoutedElements(nodes, edges, {
      direction: direction ?? RankDir.TB,
    })
    setNodes([...layouted.nodes])
    setEdges([...layouted.edges])
    setError(error)

    // fitView()
  }, [treeDebounced])

  const onLayout = useCallback(
    (direction: RankDir | null = RankDir.TB) => {
      setDirection(direction)

      const layouted = getLayoutedElements(nodes, edges, { direction })
      setNodes([...layouted.nodes])
      setEdges([...layouted.edges])

      window.requestAnimationFrame(() => fitView())
    },
    [nodes, edges]
  )

  return (
    <>
      <></>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel
          position="top-left"
          style={{
            backgroundColor: Colors.LIGHT_GRAY5,
            borderRadius: 10,
            padding: 10,
          }}
        >
          <ButtonGroup>
            <Button
              onClick={() => {
                setNodes(initialNodes)
                setEdges(initialEdges)
              }}
              intent="none"
              minimal
              icon={IconNames.Graph}
            >
              Example
            </Button>
            <Divider />
            <Button
              onClick={() => onLayout(RankDir.TB)}
              icon={IconNames.ALIGNMENT_VERTICAL_CENTER}
              minimal
              intent={direction === RankDir.TB ? 'primary' : 'none'}
            >
              Vertical
            </Button>
            <Button
              onClick={() => onLayout(RankDir.LR)}
              icon={IconNames.ALIGNMENT_HORIZONTAL_CENTER}
              minimal
              intent={direction === RankDir.LR ? 'primary' : 'none'}
            >
              Horizontal
            </Button>
          </ButtonGroup>
          <InputGroup
            value={tree}
            onValueChange={setTree}
            placeholder="Binary tree..."
            style={{ marginTop: 10 }}
          />
          {error && (
            <p className="bp3-text-muted" style={{ color: Colors.RED3 }}>
              {error}
            </p>
          )}
        </Panel>
        <Background />
      </ReactFlow>
    </>
  )
}

export default function () {
  return (
    <ReactFlowProvider>
      <GraphProvider>
        <Layout />
      </GraphProvider>
    </ReactFlowProvider>
  )
}
