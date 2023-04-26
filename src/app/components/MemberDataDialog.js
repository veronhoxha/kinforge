import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { brown } from '@mui/material/colors';

const MemberDataDialog = ({ open, onClose, user }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Searched person data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {user ? (
              <>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Surname:</strong> {user.surname}</p>
                <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
                <p><strong>Place of Birth OR Current Location:</strong> {user.place_of_birth}</p>
                <p><strong>Date of Death:</strong> {user.date_of_death}</p>
                <p><strong>Gender:</strong> {user.gender}</p>
              </>
            ) : (
              <p>No user data to display</p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: brown[600] }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  

export default MemberDataDialog;
