import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, { useNodesState, useEdgesState, addEdge, useReactFlow, ReactFlowProvider, Controls} from 'reactflow';
import 'reactflow/dist/style.css';
import '../../styles/hierarchy.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/system';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import { brown } from '@mui/material/colors';
import {collection, addDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { query, where, getDocs, getFirestore, deleteDoc} from "firebase/firestore";
import { FormHelperText } from '@mui/material';

  const initialNodes = [
    {
      id: '0',
      type: 'input',
      data: { label: 'Node' },
      position: { x: 0, y: 50 },
    },
  ];

  const StyledButton = styled(Button)({
    marginLeft: '8px',
  });

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
    const [currentUser, setCurrentUser] = useState();
    const db = getFirestore();
    const usersCollection = collection(db, "family-members-mom-side");
    const auth = getAuth();
    const [formErrors, setFormErrors] = useState({});

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

    const handleChange = (event) => {
      setSelectedValue(event.target.value);
    };

    const onNodeClick = (_, node) => {
      console.log('click node', node);
      setSelectedNode(node);
      setSelectedValue('');
      setDialogOpen(true);
    };

    const [formValues, setFormValues] = useState({
      name: "",
      surname: "",
      dob: "",
      dod: "",
      gender: "",
    });

    const handleClose = () => {
      setSelectedValue('');
      setDialogOpen(false);
    };
    
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormValues((prevState) => ({ ...prevState, [name]: value }));
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

    const controlProps = (item) => ({
      checked: selectedValue === item,
      onChange: handleChange,
      value: item,
      name: 'color-radio-button-demo',
      inputProps: { 'aria-label': item },
    });

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
        if (!selectedValue) {
          errors.gender = 'Gender is required';
        }
      
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
      };
      

  return (
      <div className="wrapper" ref={reactFlowWrapper}>
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
            <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth >
              <DialogTitle>Edit / Add data</DialogTitle>
              <DialogContent>
                <form>
                <FormHelperText error>{formErrors.name}</FormHelperText>
                <InputLabel required htmlFor="component-simple">Name</InputLabel>
                <Input name="name" id="component-simple" defaultValue="" fullWidth className='form-field' onChange={handleInputChange} required />

                <FormHelperText error>{formErrors.surname}</FormHelperText>
                <InputLabel required htmlFor="component-simple">Surname</InputLabel>
                <Input name="surname" id="component-simple" defaultValue="" fullWidth className='form-field' onChange={handleInputChange} required  />

                <FormHelperText error>{formErrors.dob}</FormHelperText>
                <InputLabel required htmlFor="component-simple">Date of Birth</InputLabel>
                <Input name="dob" id="component-simple" type="date" defaultValue="" fullWidth className='form-field' onChange={handleInputChange} required />


                <InputLabel  htmlFor="component-simple">Date of Death</InputLabel>
                <Input name="dod" id="component-simple" type="date" defaultValue="" fullWidth className='form-field' onChange={handleInputChange}/>

                <FormHelperText error>{formErrors.gender}</FormHelperText>
                <FormControl required >
                  <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
                  <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
                  <FormControlLabel value="male" control={<Radio  {...controlProps('male')}
                    sx={{ color: brown[800], '&.Mui-checked': {color: brown[600],},}}/>} label="Male" />
                  <FormControlLabel value="female" control={<Radio  {...controlProps('female')}
                    sx={{ color: brown[800], '&.Mui-checked': {color: brown[600],},}}/>} label="Female" />
                  <FormControlLabel value="other" control={<Radio  {...controlProps('other')}
                    sx={{ color: brown[800], '&.Mui-checked': {color: brown[600],},}}/>} label="Other" />
                  </RadioGroup>
                </FormControl>

                </form>
              </DialogContent>
              <DialogActions>
                <StyledButton sx={{ color: brown[600] }} onClick={() => setDialogOpen(false)}>Cancel</StyledButton>
                <StyledButton sx={{ color: brown[600] }} onClick={() => { deleteNodeById(selectedNode.id);  deleteMember(selectedNode.id, currentUser.uid); setDialogOpen(false);}}> Delete Member</StyledButton>
                <StyledButton sx={{ color: brown[600] }} onClick={handleSave}>Save</StyledButton>
              </DialogActions>
            </Dialog>
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