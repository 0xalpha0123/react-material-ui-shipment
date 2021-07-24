import { useForm } from '@fuse/hooks';
import FuseUtils from '@fuse/utils/FuseUtils';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import {
    KeyboardDatePicker,
  } from '@material-ui/pickers';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addShipment,
	closeNewShipmentDialog,
} from './store/shipmentsSlice';

import moment from 'moment'
const defaultFormState = {
	AntekId:"",  //Required
	MBL:"",
	HBL:"",
	Container:"",
	Port:[], // Required
	ETA: moment().format("MM/DD/YYYY"),  //Required
	Status:"PENDING",
    Type:"AIR", //Required
    Pallets: undefined, //Required
	Volume: undefined, //Required
	Weight: undefined, //Required
	Carton: undefined, //Required
	Unit: undefined,
    Note:"",
    POList: []
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
};

function ShipmentDialog(props) {
	const dispatch = useDispatch();
    const shipmentDialog = useSelector(({ shipment }) => shipment.shipments.shipmentDialog);
    
	const { form, handleChange, setForm } = useForm(defaultFormState);

	const initDialog = useCallback(() => {
		setForm({
            ...defaultFormState,
            id: FuseUtils.generateGUID()
        });
	}, [shipmentDialog.type, setForm]);

	useEffect(() => {
		/**
		 * After Dialog Open
		 */
		if (shipmentDialog.props.open) {
			initDialog();
		}
	}, [shipmentDialog.props.open, initDialog]);

	function closeComposeDialog() {
		return dispatch(closeNewShipmentDialog());
	}

	function canBeSubmitted() {
		return form.AntekId.length && form.Port.length && form.ETA.length && form.Volume && form.Weight && form.Carton && form.Pallets;
	}

	function handleSubmit(event) {
		event.preventDefault();
        dispatch(addShipment(form));
        console.log(form)
		closeComposeDialog();
	}
    const portOptions = ["VANCOUVER", "CALGARY", "EDMONTON","TORONTO","MONTREAL","HALIFAX"];
    const statusOptions = ["PENDING", "SCHEDULING", "APPOINTMENT_MADE", "DELIVERED"];
    const typeOptions = ["AIR", "FCL", "LCL"];
    function handleDateChange(date) {
        setForm({
            ...defaultFormState,
            ETA: date.format("MM/DD/YYYY"),
        });
    }
	return (
		<Dialog
			classes={{
				paper: 'm-24 rounded-8'
			}}
			{...shipmentDialog.props}
			onClose={closeComposeDialog}
			fullWidth
			maxWidth="md"
		>
			<AppBar position="static" elevation={1}>
				<Toolbar className="flex w-full">
					<Typography variant="subtitle1" color="inherit">
						New Shipment
					</Typography>
				</Toolbar>
			</AppBar>
			<form noValidate onSubmit={handleSubmit} className="flex flex-col md:overflow-hidden">
				<DialogContent classes={{ root: 'p-24' }}>
					<div className="flex">
						<TextField
							className="mb-24"
							label="AntekId"
							autoFocus
							id="AntekId"
							name="AntekId"
							value={form.AntekId}
							onChange={handleChange}
							required
							fullWidth
						/>
                        <div className="p-12"></div>
                        <TextField
							className="mb-24"
							label="MBL"
							autoFocus
							id="MBL"
							name="MBL"
							value={form.MBL}
							onChange={handleChange}
							fullWidth
						/>
					</div>
                    <div className="flex">
						<TextField
							className="mb-24"
							label="HBL"
							autoFocus
							id="HBL"
							name="HBL"
							value={form.HBL}
							onChange={handleChange}
							fullWidth
						/>
                        <div className="p-12"></div>
						<TextField
							className="mb-24"
							label="Container"
							autoFocus
							id="Container"
							name="Container"
							value={form.Container}
							onChange={handleChange}
							fullWidth
						/>
					</div>
                    <div className="flex">
                        <FormControl fullWidth>
                            <InputLabel id="port-label">Port</InputLabel>
                            <Select
                            labelId="port-label"
                            id="Port"
                            className="mb-24"
                            multiple
                            required
                            name="Port"
                            value={form.Port}
                            onChange={handleChange}
                            input={<Input id="select-multiple-chip" />}
                            renderValue={(selected) => (
                                <div >
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                            >
                            {portOptions.map((name) => (
                                <MenuItem key={name} value={name} >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex">
                        <KeyboardDatePicker
                            className="mb-24"
                            // disableToolbar
                            variant="inline"
                            format="MM/DD/yyyy"
                            name="ETA"
                            id="ETA"
                            label="ETA"
                            value={moment(form.ETA)}
                            onChange={handleDateChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            fullWidth
                        />
                        <div className="p-12"></div>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                            labelId="status-label"
                            id="Status"
                            className="mb-24"
                            name="Status"
                            value={form.Status}
                            onChange={handleChange}
                            MenuProps={MenuProps}
                            >
                            {statusOptions.map((name) => (
                                <MenuItem key={name} value={name} >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        <div className="p-12"></div>
                        <FormControl fullWidth>
                            <InputLabel id="type-label">Type</InputLabel>
                            <Select
                            labelId="type-label"
                            id="Type"
                            className="mb-24"
                            required
                            name="Type"
                            value={form.Type}
                            onChange={handleChange}
                            MenuProps={MenuProps}
                            >
                            {typeOptions.map((name) => (
                                <MenuItem key={name} value={name} >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="flex">
                        <TextField
                            className="mb-24"
                            id="Pallets"
                            label="Pallets"
                            type="number"
                            name="Pallets"
                            required
                            fullWidth
                            onChange={handleChange}
                            value={form.Pallets || ''}
                        />
                        <div className="p-12"></div>
                        <TextField
                            className="mb-24"
                            id="Volume"
                            label="Volume"
                            type="number"
                            name="Volume"
                            required
                            fullWidth
                            onChange={handleChange}
                            value={form.Volume || ''}
                        />
                        <div className="p-12"></div>
                        <TextField
                            className="mb-24"
                            id="Weight"
                            label="Weight"
                            type="number"
                            name="Weight"
                            required
                            fullWidth
                            onChange={handleChange}
                            value={form.Weight || ''}
                        />
                        <div className="p-12"></div>
                        <TextField
                            className="mb-24"
                            id="Carton"
                            label="Carton"
                            type="number"
                            name="Carton"
                            required
                            fullWidth
                            onChange={handleChange}
                            value={form.Carton || ''}
                        />
                        <div className="p-12"></div>
                        <TextField
                            className="mb-24"
                            id="Unit"
                            label="Unit"
                            type="number"
                            name="Unit"
                            fullWidth
                            onChange={handleChange}
                            value={form.Unit || ''}
                        />
                    </div>
					<div className="flex">
						<TextField
							label="Note"
							id="Note"
							name="Note"
							value={form.Note}
                            onChange={handleChange}
							multiline
                            rows={5}
                            fullWidth
                            variant="filled"
						/>
					</div>
				</DialogContent>
                <DialogActions className="justify-between p-8">
                    <div className="px-16">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            type="submit"
                            disabled={!canBeSubmitted()}
                        >
                            Add
                        </Button>
                    </div>
                </DialogActions>
			</form>
		</Dialog>
	);
}

export default ShipmentDialog;
