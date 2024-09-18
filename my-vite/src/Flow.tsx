import { Button, ButtonGroup, InputGroup } from '@blueprintjs/core'
import Dagre from '@dagrejs/dagre'
import {
  Background,
  Edge,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect, useState } from 'react'
import { GraphProvider, useGraph } from './GraphContext.js'
import { toNodeAndEdges } from './node-util.js'
import { initialEdges, initialNodes } from './nodes-edges.js'
import CircleNode from './Nodes/Circle.js'
import { useDebounce } from './Search.js'

const nodeTypes = {
  circle: CircleNode,
}

export enum RankDir {
  TB = 'TB',
  BT = 'BT',
  LR = 'LR',
  RL = 'RL',
}

export interface Node {
  id: string
  data: { label: string }
  measured?: {
    width: number
    height: number
  }
  position: {
    x: number
    y: number
  }
}
const graph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))

const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: RankDir }
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = options.direction === RankDir.LR
  graph.setGraph({ rankdir: options.direction, height: 0, width: 100 })

  edges.forEach((edge) => graph.setEdge(edge.source, edge.target))
  nodes.forEach((node) =>
    graph.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  )

  Dagre.layout(graph)

  graph.edges()

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = graph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x,
        y: nodeWithPosition.y,
      },
    }
  })
  console.log('newNodes: ', newNodes)

  return {
    edges,
    nodes: newNodes,
  }
}

const Layout = () => {
  const { fitView } = useReactFlow()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [tree, setTree] = useState('')
  const { setDirection } = useGraph()
  const treeDebounced = useDebounce(tree)

  // Debounce the tree input to prevent too many layout calculations.
  useEffect(() => {
    if (!treeDebounced) return
    const { nodes, edges } = toNodeAndEdges(treeDebounced)
    const layouted = getLayoutedElements(nodes, edges, {
      direction: RankDir.TB,
    })
    setNodes([...layouted.nodes])
    setEdges([...layouted.edges])

    window.requestAnimationFrame(() => {
      fitView()
    })
  }, [treeDebounced])

  const onLayout = useCallback(
    (direction: RankDir) => {
      setDirection(direction)

      const layouted = getLayoutedElements(nodes, edges, { direction })
      setNodes([...layouted.nodes])
      setEdges([...layouted.edges])

      window.requestAnimationFrame(() => {
        fitView()
      })
    },
    [nodes, edges]
  )

  return (
    <>
      <>
        <InputGroup
          value={tree}
          onValueChange={setTree}
          placeholder="Binary tree..."
        />
      </>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-left">
          <ButtonGroup>
            <Button onClick={() => onLayout(RankDir.TB)}>Vertical</Button>
            <Button onClick={() => onLayout(RankDir.LR)}>Horizontal</Button>
          </ButtonGroup>
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
