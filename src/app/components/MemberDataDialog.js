import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { brown } from '@mui/material/colors';

const MemberDataDialog = ({ open, onClose, user }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Searched person data</DialogTitle>
        <DialogContent>
          <div style={{ margin: '8px 0', fontSize: '1rem' }}>
            {user ? (
              <>
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Surname:</strong> {user.surname}</div>
                <div><strong>Date of Birth:</strong> {user.date_of_birth}</div>
                <div><strong>Place of Birth OR Current Location:</strong> {user.place_of_birth}</div>
                <div><strong>Date of Death:</strong> {user.date_of_death}</div>
                <div><strong>Gender:</strong> {user.gender}</div>
              </>
            ) : (
              <div>No user data to display</div>
            )}
          </div>
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