import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, ReactFlowProvider, Controls} from 'reactflow';
import 'reactflow/dist/style.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import HierarchyDialog from './HierarchyDialog';
import { v4 as uuidv4 } from 'uuid';
import Authentication from '../../../Authentication';

const initialNodes = [
  {
    id: uuidv4(),
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
    isInitialNode: true,
  },
];

let id = 1;
const getId = () => uuidv4();

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
  const nodeEdgeCollection = collection(db, "family-members-mom-side-node-edge");
  const auth = getAuth();
  const [formErrors, setFormErrors] = useState({});
  const [activeSwitch, setActiveSwitch] = useState(1);
  const [familyMembers, setFamilyMembers] = useState([]);

  const onConnect = useCallback((params) => {
    console.log('onConnect called with params:', params);
    if (params.source === '0' && params.target === '0') {
      setErrorMessage("The initial node cannot be connected to itself.");
      return;
    }
    if (edges.find((edge) => edge.source === params.source && edge.target === params.target)) {
      setErrorMessage("The connection already exists.");
      return;
    }
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges, edges]);
  
  const onConnectStart = useCallback((_, { nodeId }) => {
    console.log('onConnectStart called with nodeId:', nodeId);
    connectingNodeId.current = nodeId;
  }, []);
  const onConnectEnd = useCallback(
    async (event) => {
      console.log('onConnectEnd called with event:', event);
      const targetIsPane = event.target && event.target.classList.contains('react-flow__pane');
  
      if (targetIsPane && !startingNodeEdited) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
          data: { label: `Node` },
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

        if (currentUser) {
          const nodeEdgeData = {
            userId: currentUser.uid,
            nodes: [...nodes, newNode],
            edges: [...edges, { id, source: connectingNodeId.current, target: id }],
          };
          await saveNodeEdgeData(nodeEdgeData);          
        } else {
          console.error("No current user");
        }
      }
    },
    [project, setEdges, setNodes, startingNodeEdited, currentUser, nodes, edges]
  );  

  const onNodeClick = async (_, node) => {
    console.log('onNodeClick called with node:', node);
    console.log('click node', node);
  
    if (currentUser) {
      try {
        const memberSnapshot = await getDocs(
          query(
            usersCollection,
            where("id", "==", node.id),
            where("addedBy", "==", currentUser.uid)
          )
        );
  
        if (!memberSnapshot.empty) {
          memberSnapshot.forEach((doc) => {
            const data = doc.data();
            setFormValues({
              name: data.name,
              surname: data.surname,
              dob: data.date_of_birth,
              place_of_birth: data.place_of_birth,
              dod: data.date_of_death,
              gender: data.gender,
            });
          });
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    }
  
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

  const deleteNodeEdgeById = async (id) => {
    if (!currentUser) {
      console.error("No current user");
      return;
    }
  
    const nodeToDelete = nodes.find((node) => node.id === id);
    if (nodeToDelete && nodeToDelete.isInitialNode) {
      setErrorMessage('The starting node cannot be deleted.');
      setFormErrors({});
      return;
    }
    console.log("Deleting node with id:", id);
  
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
  
    const updatedNodes = nodes.filter((node) => node.id !== id);
    const updatedEdges = edges.filter((edge) => edge.source !== id && edge.target !== id);
  
    try {
      const existingDataSnapshot = await getDocs(
        query(nodeEdgeCollection, where("userId", "==", currentUser.uid))
      );
  
      if (!existingDataSnapshot.empty) {
        existingDataSnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            userId: currentUser.uid,
            nodes: updatedNodes,
            edges: updatedEdges,
          });
        });
      }
    } catch (error) {
      console.error("Error deleting node and edge data: ", error);
    }
  
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

  const updateMember = async (id, memberData) => {
    try {
      const memberSnapshot = await getDocs(
        query(
          usersCollection,
          where("id", "==", id),
          where("addedBy", "==", memberData.addedBy)
        )
      );
  
      if (!memberSnapshot.empty) {
        memberSnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, memberData);
        });
      } else {
        await addDoc(usersCollection, memberData);
      }
    } catch (error) {
      console.error('Error updating member data: ', error);
    }
  }; 

  const handleSave = () => {
    console.log('handleSave called');
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
            gender: formValues.gender,
            addedBy: currentUser.uid,
          };
          updateMember(selectedNode.id, memberData);
  
          const memberIndex = familyMembers.findIndex((m) => m.id === selectedNode.id);
          if (memberIndex > -1) {
            setFamilyMembers((prevState) => {
              const newFamilyMembers = [...prevState];
              newFamilyMembers[memberIndex] = memberData;
              return newFamilyMembers;
            });
          } else {
            setFamilyMembers((prevState) => [...prevState, memberData]);
          }
        }
        if (currentUser) {
          const nodeEdgeData = {
            userId: currentUser.uid,
            nodes: nodes,
            edges: edges,
          };
          saveNodeEdgeData(nodeEdgeData);
        } else {
          console.error('No current user');
        }
      }
      setDialogOpen(false);
    }
  };
  
useEffect(() => {
  updateNodesWithFamilyMembers();
}, [familyMembers]);

const saveNodeEdgeData = async (nodeEdgeData) => {
  try {
    const existingDataSnapshot = await getDocs(
      query(
        nodeEdgeCollection,
        where("userId", "==", nodeEdgeData.userId)
      )
    );

    if (!existingDataSnapshot.empty) {
      existingDataSnapshot.forEach((doc) => {
        updateDoc(doc.ref, nodeEdgeData);
      });
    } else {
      addDoc(nodeEdgeCollection, nodeEdgeData);
    }
  } catch (error) {
    console.error("Error saving node and edge data: ", error);
  }
};

 
  useEffect(() => {
    const fetchNodeEdgeData = async () => {
      if (currentUser) {
        const nodeEdgeSnapshot = await getDocs(
          query(
            nodeEdgeCollection,
            where("userId", "==", currentUser.uid)
          )
        );
    
        if (!nodeEdgeSnapshot.empty) {
          nodeEdgeSnapshot.forEach((doc) => {
            const data = doc.data();
            setNodes(data.nodes);
            setEdges(data.edges);
          });
        }
    
        const familyMembersSnapshot = await getDocs(
          query(
            usersCollection,
            where("addedBy", "==", currentUser.uid)
          )
        );
    
        if (!familyMembersSnapshot.empty) {
          const members = [];
          familyMembersSnapshot.forEach((doc) => {
            const data = doc.data();
            members.push(data);
          });
          setFamilyMembers(members);
        }
      }
    };
    
    fetchNodeEdgeData();
    
  }, [currentUser]);

  const updateNodesWithFamilyMembers = () => {
    if (familyMembers.length > 0) {
      const updatedNodes = nodes.map((node) => {
        const member = familyMembers.find((m) => m.id === node.id);
        if (member) {
          return {
            ...node,
            data: {
              label: (
                <>
                  {member.name} {member.surname}
                  <br />
                  {member.date_of_birth}
                </>
              ),
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };
  
  useEffect(() => {
    updateNodesWithFamilyMembers();
  }, [familyMembers, nodes]);

  const deleteMember = async (id, uid) => {
    console.log('deleteMember called with id and uid:', id, uid);

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
      console.log('validateForm called');
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
      if (!formValues.gender) {
        errors.gender = "Gender is required";
      }

      if (formValues.dod && new Date(formValues.dod) < new Date(formValues.dob)) {
        errors.dod = "Date of death cannot be before date of birth";
      }
    
      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };
    
    const loadActiveSwitchFromFirestore = useCallback(async () => {
      if (auth.currentUser) {
        const userId = auth.currentUser.uid;
        const designDocRef = doc(db, 'users_designs', userId);
        const designDocSnap = await getDoc(designDocRef);
    
        if (designDocSnap.exists()) {
          setActiveSwitch(designDocSnap.data().activeSwitch);
        } else {
          setActiveSwitch(1);
        }
      }
    }, [auth, db]);
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          loadActiveSwitchFromFirestore();
        }
      });
      return () => {
        unsubscribe();
      };
    }, [auth, loadActiveSwitchFromFirestore]);       

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
      console.log(activeSwitch)
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
      <div style={{ height: '100vh' }}>
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
            deleteNodeById={deleteNodeEdgeById}
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
    <HierarchyMomSide  />
  </ReactFlowProvider>
);

export default Authentication(HierarchyMomSideWrapper);