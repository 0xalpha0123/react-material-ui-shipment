import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import SaveIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

function AssignDialog(props) {
    const { onClose, pallets, open, appointmentOptions } = props;
    
    const handleClose = () => {
      onClose(-1);
    };
    const [selectedISA, setSelectedISA] = React.useState(0);
    const handleAccept = (value) => {
        onClose(value);
    };
    const handleChange = (e) => {
        setSelectedISA(e.target.value)
    }
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Assign to appointment{'\t' + pallets +' pallets in this PO'}</DialogTitle>
        <div className="p-24">
            <FormControl fullWidth>
                <InputLabel id="type-label">Appointment for the same destination</InputLabel>
                <Select
                labelId="type-label"
                id="Type"
                className="mb-24"
                name="Split"
                value={selectedISA}
                onChange={handleChange}
                >
                {appointmentOptions.map((app, i) => (
                    <MenuItem key={app.ISA} value={i} >
                    {app.DateTime + '\t' + app.Pallets + 'pallets'}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <div className="flex">
                <IconButton onClick={() => handleAccept(appointmentOptions[selectedISA])}>
                    <SaveIcon color="secondary" />
                </IconButton>
                <IconButton onClick={handleClose}>
                    <CancelIcon color="secondary" />
                </IconButton>
            </div>
        
        </div> 
      </Dialog>
    );
  }

export default AssignDialog;
