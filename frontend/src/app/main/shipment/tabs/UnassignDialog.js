import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import SaveIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

function UnassignDialog(props) {
    const { date, onClose, open } = props;
    
    const handleClose = () => {
      onClose(false);
    };
    const handleAccept = () => {
        onClose(true);
    };
    return (
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure unassign from appointment on " + date}</DialogTitle>
        <DialogActions>
            <IconButton onClick={handleAccept}>
                <SaveIcon color="secondary" />
            </IconButton>
            <IconButton onClick={handleClose}>
                <CancelIcon color="secondary" />
            </IconButton>
        </DialogActions>
      </Dialog>
    );
  }

export default UnassignDialog;
