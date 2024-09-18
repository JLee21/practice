import { Button, ButtonGroup, Colors } from '@blueprintjs/core'
import { IconNames } from '@blueprintjs/icons'
import {
  Edge,
  Handle,
  Node,
  NodeProps,
  Position,
  useReactFlow,
} from '@xyflow/react'
import { useState } from 'react'

export type CircleNode = Node<
  {
    label: string
    hidden: boolean
  },
  'circle'
>

const getAllChildren = (
  parentId: string,
  edges: Edge[]
): { nodes: Set<string>; edges: Set<string> } => {
  const childrenNodes = new Set<string>()
  const childrenEdges = new Set<string>()
  const stack = [parentId]

  while (stack.length > 0) {
    const current = stack.pop()
    edges.forEach((edge) => {
      if (edge.source === current && !childrenNodes.has(edge.target)) {
        childrenNodes.add(edge.target)
        childrenEdges.add(edge.id)
        stack.push(edge.target)
      }
    })
  }

  return { nodes: childrenNodes, edges: childrenEdges }
}

const CircleNode = (props: NodeProps<CircleNode>) => {
  const { data } = props
  const flow = useReactFlow()
  const [expand, setExpand] = useState(false)

  const handleExpand = () => {
    setExpand((isExpanded) => !isExpanded)
    const nodes = flow.getNodes()
    const edges = flow.getEdges()

    const children = getAllChildren(props.id, edges)

    const newEdges = edges.map((edge: Edge) => {
      const hidden = !expand && children.edges.has(edge.id)
      return {
        ...edge,
        hidden,
        data: { ...edge.data },
      }
    })
    flow.setEdges(newEdges)

    const newNodes = nodes.map((node: Node) => {
      const hidden = !expand && children.nodes.has(node.id)

      return {
        ...node,
        data: { ...node.data, hidden },
      }
    })
    flow.setNodes(newNodes)
  }

  return (
    <div
      style={{
        visibility: data.hidden ? 'hidden' : 'visible',
        borderRadius: '50%',
        width: '75px',
        height: '75px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #777',
        backgroundColor: Colors.LIGHT_GRAY5,
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <div style={{ display: 'flex', gap: 10 }}>
        <p>{data.label}</p>
        <ButtonGroup className="nodrag">
          <Button
            onClick={handleExpand}
            icon={expand ? IconNames.CaretDown : IconNames.CaretRight}
            minimal
          />
        </ButtonGroup>
      </div>
    </div>
  )
}

export default CircleNode
