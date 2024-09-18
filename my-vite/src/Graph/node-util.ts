import { Edge } from '@xyflow/react'
import { Node } from '../Graph/dagre'

const isNode = (node: string): boolean => node !== 'null' && node !== ''

/**
 * Validates a binary tree represented as an array.
 *
 * 1,2,3 -> valid
 * 1,null,3 -> valid
 * null,1 -> not valid,
 * 1,null,3,4 -> not valid, 4 is a child of 2 but 2 is null
 *
 * @param parts - An array of strings representing the tree.
 * @returns True if the tree is valid, false otherwise.
 */
const validateTree = (parts: string[]): boolean => {
  if (parts.length === 0) return false
  console.log('parts: ', parts)

  const queue = [0]
  let counter = 0

  while (queue.length > 0) {
    const nodeIndex = queue.shift()
    console.log('nodeIndex: ', nodeIndex)

    if (nodeIndex !== undefined && nodeIndex !== null) {
      counter++

      const leftChildIndex = nodeIndex * 2 + 1 // 3
      const rightChildIndex = nodeIndex * 2 + 2 // 4
      const isValidParentNode = isNode(parts[nodeIndex])
      if (leftChildIndex < parts.length && isValidParentNode) {
        queue.push(leftChildIndex)
      }
      if (rightChildIndex < parts.length && isValidParentNode) {
        queue.push(rightChildIndex)
      }
    }
  }
  console.log('counter: ', counter)
  return counter === parts.length
}

const validateInput = (tree: string): string | undefined => {
  const parts = tree.split(',')

  // if parts end in a comma, remove the last element
  // if (parts[parts.length - 1] === '') parts.pop()

  // validate binary tree by traversing the array
  if (!validateTree(parts))
    return 'Invalid binary tree. Each parent node must have 0 or 2 children.'

  // two nulls in a row are not allowed
  for (let i = 0; i < parts.length - 1; i++) {
    if (parts[i] === '' && parts[i + 1] === '') {
      return 'Invalid tree. Two empty or null values in a row are not allowed.'
    }
  }
  return undefined
}

/**
 * Converts a comma-separated string representation of a tree into nodes and edges.
 *
 * @param tree - A string representing the tree, where each value is separated by a comma.
 *               Example: "1,2,3" or "1,null,3".
 * @returns An object containing two arrays:
 *          - `nodes`: An array of node objects, each with an id, data, position, type, and measured properties.
 *          - `edges`: An array of edge objects, each with an id, source, and target properties.
 *          - `error`: String when invalid input is provided.
 */
export const toNodeAndEdges = (
  tree: string | undefined
): { nodes: Node[]; edges: Edge[]; error?: string } => {
  if (!tree) return { nodes: [], edges: [] }

  const error = validateInput(tree)
  if (error) return { nodes: [], edges: [], error }

  const nodes = tree.split(',').map((label, index) => ({
    id: `node-${index}`,
    type: 'circle',
    data: {
      label,
      hidden: label === '',
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
        type: 'straight',
      })
    }
    if (rightChild) {
      edges.push({
        id: `${node.id}-${rightChild.id}`,
        source: node.id,
        target: rightChild.id,
        type: 'straight',
      })
    }
  })
  const edgesFiltered = edges.filter((edge) => edge.target)

  return { nodes, edges: edgesFiltered }
}
