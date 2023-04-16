import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { styled } from '@mui/system';
import { brown } from '@mui/material/colors';
import Places from './Places';

const StyledButton = styled(Button)({
  marginLeft: '8px',
});

const HierarchyDadSideDialog = ({
  open,
  formValues,
  formErrors,
  setFormValues,
  selectedValue,
  setSelectedValue,
  handleClose,
  handleInputChange,
  handleSave,
  deleteNodeById,
  deleteMember,
  currentUser,
  selectedNode,
}) => {

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit / Add data</DialogTitle>
        <DialogContent>
          <form>
            <FormHelperText error>{formErrors.name}</FormHelperText>
            <InputLabel required htmlFor="component-simple">Name</InputLabel>
            <Input
              name="name"
              id="component-simple"
              defaultValue=""
              fullWidth
              className='form-field'
              onChange={handleInputChange}
              required
            />

            <FormHelperText error>{formErrors.surname}</FormHelperText>
            <InputLabel required htmlFor="component-simple">Surname</InputLabel>
            <Input
              name="surname"
              id="component-simple"
              defaultValue=""
              fullWidth
              className='form-field'
              onChange={handleInputChange}
              required
            />

            <FormHelperText error>{formErrors.dob}</FormHelperText>
            <InputLabel required htmlFor="component-simple">Date of Birth</InputLabel>
            <Input
              name="dob"
              id="component-simple"
              type="date"
              defaultValue=""
              fullWidth
              className='form-field'
              onChange={handleInputChange}
              required
            />

            <FormHelperText error>{formErrors.place_of_birth}</FormHelperText>
            <InputLabel required htmlFor="component-simple">Place of Birth OR Current Location</InputLabel>
            <Places
              name="place_of_birth"
              id="component-simple"
              className='form-field'
              onChange={handleInputChange}
            />

            <InputLabel htmlFor="component-simple">Date of Death</InputLabel>
            <Input
              name="dod"
              id="component-simple"
              type="date"
              defaultValue=""
              fullWidth
              className='form-field'
              onChange={handleInputChange}
            />

            <FormHelperText error>{formErrors.gender}</FormHelperText>
            <FormControl required>
              <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
              <RadioGroup aria-labelledby="demo-radio-buttons-group-label" name="radio-buttons-group">
                <FormControlLabel
                  value="male"
                  control={
                    <Radio
                      {...controlProps('male')}
                      sx={{ color: brown[  800],
                        '&.Mui-checked': { color: brown[600] },
                      }}
                    />
                  }
                  label="Male"
                />
                <FormControlLabel
                  value="female"
                  control={
                    <Radio
                      {...controlProps('female')}
                      sx={{ color: brown[800], '&.Mui-checked': { color: brown[600] } }}
                    />
                  }
                  label="Female"
                />
                <FormControlLabel
                  value="other"
                  control={
                    <Radio
                      {...controlProps('other')}
                      sx={{ color: brown[800], '&.Mui-checked': { color: brown[600] } }}
                    />
                  }
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <StyledButton sx={{ color: brown[600] }} onClick={handleClose}>
            Cancel
          </StyledButton>
          <StyledButton
            sx={{ color: brown[600] }}
            onClick={() => {
              deleteNodeById(selectedNode.id);
              deleteMember(selectedNode.id, currentUser.uid);
              handleClose();
            }}
          >
            Delete Member
          </StyledButton>
          <StyledButton sx={{ color: brown[600] }} onClick={handleSave}>
            Save
          </StyledButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
  
export default HierarchyDadSideDialog;
