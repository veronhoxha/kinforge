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
/* eslint-disable */

const initialNodes = [
  {
    id: uuidv4(),
    type: 'input',
    data: { label: 'Node' },
    position: { x: 0, y: 50 },
    isInitialNode: true,
  },
];

const getId = () => uuidv4();

const fitViewOptions = {
  padding: 3,
};

export const HierarchyMomSide = () => {

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
    const [hasNodeWithData, setHasNodeWithData] = useState(false);

    const onConnect = useCallback(async (params) => {
      if (params.source === '0' && params.target === '0') {
        setErrorMessage("The initial node cannot be connected to itself.");
        return;
      }
      if (edges.find((edge) => edge.source === params.source && edge.target === params.target)) {
        setErrorMessage("The connection already exists.");
        return;
      }
      setEdges((eds) => addEdge(params, eds));
    
      if (currentUser) {
        const nodeEdgeData = {
          userId: currentUser.uid,
          nodes: nodes,
          edges: [...edges, { id: getId(), source: params.source, target: params.target }],
        };
        await saveNodeEdgeData(nodeEdgeData);
      } else {
        console.error("No current user");
      }
    }, [setEdges, edges, currentUser, nodes]);
    
    const deleteAndUpdateNodes = async (id) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              label: "Node",
            },
          };
        }
        return node;
      });
      setNodes(updatedNodes);
      checkIfAnyNodeHasData(updatedNodes, familyMembers);
    
      if (currentUser) {
        const nodeEdgeData = {
          userId: currentUser.uid,
          nodes: updatedNodes,
          edges: edges,
        };
        await saveNodeEdgeData(nodeEdgeData);
      } else {
        console.error("No current user");
      }
    };

    const onConnectStart = useCallback((_, { nodeId }) => {
      connectingNodeId.current = nodeId;
    }, []);

    const checkIfAnyNodeHasData = useCallback((nodes, familyMembers) => {
      const result = nodes.some((node) => {
        const member = familyMembers.find((m) => m.id === node.id);
        return (
          member &&
          (member.name ||
            member.surname ||
            member.date_of_birth ||
            member.place_of_birth)
        );
      });
      setHasNodeWithData(result);
    }, []);

    useEffect(() => {
      checkIfAnyNodeHasData(nodes, familyMembers);
    }, [nodes, familyMembers, checkIfAnyNodeHasData]);    
    
    const onConnectEnd = useCallback(
      async (event) => {
        const targetIsPane = event.target && event.target.classList.contains('react-flow__pane');
    
        if (targetIsPane && !startingNodeEdited) {
          const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
          const id = getId();
          const newNode = {
            id,
            position: project({ x: event.clientX - left - 25, y: event.clientY - top }),
            data: { label: `Node` },
          };

          if (hasNodeWithData) {
            setErrorMessage("Adding new nodes with saved positions will soon be available exclusively for premium users. As a free user, you can add as many new nodes as you want when none of the nodes has data, and their positions will be saved in the database, remaining available whenever you return to the page. However, when at least one of them has data, the positions of newly added nodes won't be saved and they will disappear after refreshing the page, but any data you add to the nodes will still be saved. Stay tuned for the premium upgrade to enjoy the full functionality and an improved user experience.")
          } else {
            setErrorMessage(null);
          }

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
        setErrorMessage('The starting node cannot be deleted. However, if there was already data for the node, you deleted the data of the member.');
        setFormErrors({});
        return;
      }
    
      const selectedMember = familyMembers.find((member) => member.id === id);
      if (hasNodeWithData && !selectedMember) {
        setErrorMessage("Cannot delete nodes when at least one node has data. This feature will be will soon be available exclusively for premium users.");
        return;
      } else {
        setErrorMessage(null);
      }
    
      const updatedNodes = nodes.filter((node) => node.id !== id);
    
      const updatedEdges = edges;
    
      setNodes(updatedNodes);
      setEdges(updatedEdges);
    
      const remainingNodesWithData = updatedNodes.some((node) => {
        const member = familyMembers.find((m) => m.id === node.id);
        return (
          member &&
          (member.name ||
            member.surname ||
            member.date_of_birth ||
            member.place_of_birth)
        );
      });
      setHasNodeWithData(remainingNodesWithData);
    
      if (selectedMember) {
        await deleteMember(id, currentUser.uid, checkIfAnyNodeHasData);
      }
    
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
      setFamilyMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
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
            deleteAndUpdateNodes(selectedNode.id);
          } else {
            console.error('No current user');
          }
        }
        updateNodesWithFamilyMembers();
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
      
      updateNodesWithFamilyMembers();
      fetchNodeEdgeData();
      
    }, [currentUser]);

    const updateNodesWithFamilyMembers = () => {
      if (familyMembers.length > 0) {
        const updatedNodes = nodes.map((node) => {
          const member = familyMembers.find((m) => m.id === node.id);
          if (member) {
            if (member.name || member.surname) {
              return {
                ...node,
                data: {
                  label: (
                    <>
                      <span className="node-content">
                        {member.name} {member.surname}
                      <br />
                      {member.date_of_birth}
                      </span>
                    </>
                  ),
                },
              };    
            } else {
              return {
                ...node,
                data: {
                  label: "Node",
                },
              };
            
            }
          }
          return node;
        });
        setNodes(updatedNodes);
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
    
          const updatedNodes = nodes.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  label: "Node",
                },
              };
            }
            return node;
          });
          setNodes(updatedNodes);
          deleteAndUpdateNodes(id);
    
          const remainingFamilyMembers = familyMembers.filter((member) => member.id !== id);
          setFamilyMembers(remainingFamilyMembers);
    
          checkIfAnyNodeHasData(updatedNodes, remainingFamilyMembers);
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

    const onNodeDragStop = async (_, node) => {

      setNodes((nds) =>
        nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n))
      );
    
      if (currentUser) {
        try {
          const nodeEdgeSnapshot = await getDocs(
            query(nodeEdgeCollection, where("userId", "==", currentUser.uid))
          );
    
          if (!nodeEdgeSnapshot.empty) {
            nodeEdgeSnapshot.forEach(async (doc) => {
              const data = doc.data();
              const updatedNodes = data.nodes.map((n) =>
                n.id === node.id ? { ...n, position: node.position } : n
              );
              await updateDoc(doc.ref, { ...data, nodes: updatedNodes });
            });
          }
        } catch (error) {
          console.error("Error updating node position in Firestore:", error);
        }
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
            onNodeDragStop={onNodeDragStop}
            fitView
            fitViewOptions={fitViewOptions}
            proOptions={{ hideAttribution: true }}>
            </ReactFlow>
                <Controls showInteractive={false} className='controls'>
              </Controls>
                <Snackbar className="snackbar" open={!!errorMessage} autoHideDuration={14000} onClose={() => setErrorMessage(null)} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
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
                deleteNodeEdgeById={deleteNodeEdgeById}
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

export default Authentication(HierarchyMomSideWrapper);