import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, ReactFlowProvider, Controls, ControlButton} from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/hierarchy.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


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
  const [isSelectable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [captureElementClick] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
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
        setSelectedNode(newNode);
        console.log(connectingNodeId.current)
      }
    },
    [project, setEdges, setNodes]
  );  

  // const onSelectionChange = useCallback((elements) => {
  //   setSelectedElements(elements);
  //   console.log("Currently selected node:", elements && elements[0]?.type === 'node' ? elements[0] : "None");
  // }, []);

  // console.log(onSelectionChange);

  const onNodeClick = (_, node) => {
    console.log('click node', node);
    setSelectedNode(node);
  };

  const deleteNodeById = (id) => {
    if (id === '0') {
      setErrorMessage('The starting node cannot be deleted.');
      return;
    }
    console.log("Deleting node with id:", id);
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    setSelectedNode(null);
  };
  

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
        elementsSelectable={isSelectable}
        onNodeClick={captureElementClick ? onNodeClick : undefined}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={fitViewOptions}
        proOptions={{ hideAttribution: true }}>
          <Controls showInteractive={false}>
          <ControlButton>
            <DeleteIcon className="icon" onClick={() => selectedNode && deleteNodeById(selectedNode.id)} />
          </ControlButton>
          </Controls>
            </ReactFlow>
            <Snackbar
              open={!!errorMessage}
              autoHideDuration={6000}
              onClose={() => setErrorMessage(null)}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
            <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          </Snackbar>
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