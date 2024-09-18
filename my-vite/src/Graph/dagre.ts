import Dagre from '@dagrejs/dagre'
import { Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { RankDir } from './Flow'

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

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: RankDir | null }
): { nodes: Node[]; edges: Edge[] } => {
  const isHorizontal = options.direction === RankDir.LR
  const rankdir = options.direction ?? RankDir.TB
  graph.setGraph({ rankdir, height: 0, width: 100 })

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

  return {
    edges,
    nodes: newNodes,
  }
}
