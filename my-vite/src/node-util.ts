import { Edge } from '@xyflow/react'
import { Node } from './Flow'

/**
 * Converts a comma-separated string representation of a tree into nodes and edges.
 *
 * @param tree - A string representing the tree, where each value is separated by a comma.
 *               Example: "1,2,3" or "1,null,3".
 * @returns An object containing two arrays:
 *          - `nodes`: An array of node objects, each with an id, data, position, type, and measured properties.
 *          - `edges`: An array of edge objects, each with an id, source, and target properties.
 */
export const toNodeAndEdges = (
  tree: string
): { nodes: Node[]; edges: Edge[] } => {
  const nodes = tree.split(',').map((line, index) => ({
    id: `node-${index}`,
    type: 'circle',
    data: {
      label: line,
    },
    position: { x: 0, y: 0 }, // this will be set later by Dagre
    measured: { width: 100, height: 100 },
  }))

  const edges: any[] = []
  nodes.forEach((node, index) => {
    const leftChild = nodes[index * 2 + 1]
    const rightChild = nodes[index * 2 + 2]
    if (leftChild) {
      edges.push({
        id: `${node.id}-${leftChild.id}`,
        source: node.id,
        target: leftChild.id,
      })
    }
    if (rightChild) {
      edges.push({
        id: `${node.id}-${rightChild.id}`,
        source: node.id,
        target: rightChild.id,
      })
    }
  })
  const edgesFiltered = edges.filter((edge) => edge.target)

  return { nodes, edges: edgesFiltered }
}
