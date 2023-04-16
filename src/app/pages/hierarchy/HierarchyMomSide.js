import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, ReactFlowProvider, Controls} from 'reactflow';
import 'reactflow/dist/style.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { query, where, getDocs, getFirestore, deleteDoc} from "firebase/firestore";
import HierarchyDialog from './HierarchyDialog';

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

const HierarchyMomSide = () => {
  const reactFlowWrapper = useRef(null);
  const connectingNodeId = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [isSelectable] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [captureElementClick] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startingNodeEdited] = useState(false);
  const [currentUser, setCurrentUser] = useState();
  const db = getFirestore();
  const usersCollection = collection(db, "family-members-mom-side");
  const auth = getAuth();
  const [formErrors, setFormErrors] = useState({});
  const [activeSwitch, setActiveSwitch] = useState(1);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  const onConnectStart = useCallback((_, { nodeId }) => {
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target && event.target.classList.contains('react-flow__pane');
  
      if (targetIsPane && !startingNodeEdited) {
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
  
        setFormValues({
          name: "",
          surname: "",
          dob: "",
          place_of_birth: "",
          dod: "",
          gender: "",
        });
        setSelectedValue(null);
        setFormErrors({});
      }
    },
    [project, setEdges, setNodes, startingNodeEdited]
  );

  const onNodeClick = (_, node) => {
    console.log('click node', node);
  
    const nodeLabel = node.data.label;
    const nodeData = nodeLabel.props ? {
      name: nodeLabel.props.children[0],
      surname: nodeLabel.props.children[2],
      dob: nodeLabel.props.children[4]
    } : {
      name: "",
      surname: "",
      dob: ""
    };
  
    setFormValues({
      name: nodeData.name,
      surname: nodeData.surname,
      dob: nodeData.dob,
      place_of_birth: nodeData.place_of_birth,
      dod: "",
      gender: "",
    });
    setSelectedValue(null);
  
    setSelectedNode(node);
    setDialogOpen(true);
  };

  const [formValues, setFormValues] = useState({
    name: "",
    surname: "",
    dob: "",
    place_of_birth: "",
    dod: "",
    gender: "",
  });

  const handleClose = () => {
    setSelectedValue('');
    setFormErrors({});
    setDialogOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value }));
  };

  const deleteNodeById = (id) => {
    if (id === '0') {
      setErrorMessage('The starting node cannot be deleted.');
      setFormErrors({});
      return;
    }
    console.log("Deleting node with id:", id);
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  
    setSelectedNode(null);
  };

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const saveMember = async (memberData) => {
    try {
      await addDoc((usersCollection), memberData);
    } catch (error) {
      console.error('Error adding member data: ', error);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      if (selectedNode) {
        const updatedNode = {
          ...selectedNode,
          data: {
            label: (
              <>
                {formValues.name} {formValues.surname}
                <br />
                  {formValues.dob}
              </>
            ),
          },
        };
  
        setNodes((nds) =>
          nds.map((node) => (node.id === selectedNode.id ? updatedNode : node))
        );
        setSelectedNode(updatedNode);
  
        if (currentUser) {
          const memberData = {
            id: selectedNode.id,
            name: formValues.name,
            surname: formValues.surname,
            date_of_birth: formValues.dob,
            place_of_birth: formValues.place_of_birth,
            date_of_death: formValues.dod,
            gender: selectedValue,
            addedBy: currentUser.uid,
          };
          saveMember(memberData);
        } else {
          console.error('No current user');
        }
      }
      setDialogOpen(false);
    }
  };    

  const deleteMember = async (id, uid) => {

    if (id === '0') { 
      return;
    }

    try {
      const memberSnapshot = await getDocs(
        query(
          usersCollection,
          where("id", "==", id),
          where("addedBy", "==", uid)
        )
      );
      if (!memberSnapshot.empty && id !== 0) {
        memberSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      }
    } catch (error) {
      console.error("Error deleting member data:", error);
    }

    setFormErrors({});
    };

    const validateForm = () => {
      let errors = {};
    
      if (!formValues.name) {
        errors.name = 'Name is required';
      }
      if (!formValues.surname) {
        errors.surname = 'Surname is required';
      }
      if (!formValues.dob) {
        errors.dob = 'Date of Birth is required';
      }
      if (!formValues.place_of_birth) {
        errors.place_of_birth = 'Place of Birth is required';
      }
      if (!selectedValue) {
        errors.gender = 'Gender is required';
      }
    
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const loadActiveSwitchFromLocalStorage = () => {
      const savedActiveSwitch = localStorage.getItem('activeSwitch');
      if (savedActiveSwitch) {
        setActiveSwitch(parseInt(savedActiveSwitch, 10));
      }
    };

    useEffect(() => {
      loadActiveSwitchFromLocalStorage();
    }, []);
  
    useEffect(() => {
      switch (activeSwitch) {
        case 1:
          require('../../styles/hierarchy.css');
          break;
        case 2:
          require('../../styles/hierarchy01.css');
          break;
        case 3:
          require('../../styles/hierarchy02.css');
          break;
        default:
          require('../../styles/hierarchy.css');
      }
    }, [activeSwitch]);

    const getThemeClassName = () => {
      switch (activeSwitch) {
        case 1:
          return 'hierarchy-theme';
        case 2:
          return 'hierarchy-theme01';
        case 3:
          return 'hierarchy-theme02';
        default:
          return 'hierarchy-theme';
      }
    };
    

return (
    <div className={`wrapper ${getThemeClassName()}`} ref={reactFlowWrapper}>
      <div style={{ height: 817 }}>
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
        </ReactFlow>
            <Controls showInteractive={false}>
          </Controls>
            <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{ width: '100%' }}>
              {errorMessage}
            </Alert>
          </Snackbar>
          <HierarchyDialog
            open={dialogOpen}
            formValues={formValues}
            formErrors={formErrors}
            setFormValues={setFormValues}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
            handleClose={handleClose}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            deleteNodeById={deleteNodeById}
            deleteMember={deleteMember}
            currentUser={currentUser}
            selectedNode={selectedNode}
          />
    </div>
  </div>
  );
};

const HierarchyMomSideWrapper = () => (
  <ReactFlowProvider>
    <HierarchyMomSide />
  </ReactFlowProvider>
);

export default HierarchyMomSideWrapper;