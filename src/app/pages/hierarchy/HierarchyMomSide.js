import React, { useCallback, useRef } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, ReactFlowProvider } from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/hierarchy.css';

const initialNodes = [
  {
    id: '0',
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = () => `${id++}`;

const fitViewOptions = {
  padding: 3,
};

const AddNodeOnEdgeDrop = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target && event.target.classList.contains('react-flow__pane');
  
      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
          data: { label: `Node ${id}` },
        };
  
        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) => eds.concat({ id, source: connectingNodeId.current, target: id }));
      }
    },
    [project, setEdges, setNodes]
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <div style={{ height: 800 }}>
      <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          fitView
          fitViewOptions={fitViewOptions}
          proOptions={{ hideAttribution: true }}
        />
      </div>
    </div>
  );
};

const AddNodeOnEdgeDropWrapper = () => (
  <ReactFlowProvider>
    <AddNodeOnEdgeDrop />
  </ReactFlowProvider>
);

export default AddNodeOnEdgeDropWrapper;
