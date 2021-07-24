import React, { useEffect } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import SaveIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import IconButton from '@material-ui/core/IconButton';

function SplitDialog(props) {
    const { onClose, pallets, open } = props;
    
    const handleClose = () => {
      onClose(0);
    };
    
    const [splitPallets, setSplitPallets] = React.useState(0);
    useEffect(() => {
		setSplitPallets(1);
	}, [props]);
    const splitOptions = [];
    for(let i = 0; i < pallets; i ++) {
        splitOptions.push(i + 1);
    }
    const handleAccept = (value) => {
        onClose(value);
    };
    const handleChange = (e) => {
        setSplitPallets(e.target.value)
    }
    return (
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <DialogTitle id="simple-dialog-title">Select number of pallets to split</DialogTitle>
        <div className="p-24">
            <FormControl fullWidth>
                <InputLabel id="type-label">number of pallets</InputLabel>
                <Select
                labelId="type-label"
                id="Type"
                className="mb-24"
                name="Split"
                value={splitPallets}
                onChange={handleChange}
                >
                {splitOptions.map((num) => (
                    <MenuItem key={num} value={num} >
                    {num}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>
            <div className="flex">
                <IconButton disabled={!(splitPallets < props.pallets)} onClick={() => handleAccept(splitPallets)}>
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

export default SplitDialog;
