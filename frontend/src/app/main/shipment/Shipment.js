import FusePageSimple from '@fuse/core/FusePageSimple';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useDeepCompareEffect } from '@fuse/hooks';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Create';
import SyncIcon from '@material-ui/icons/Sync';
import HomeIcon from '@material-ui/icons/Home';
import BoatIcon from '@material-ui/icons/DirectionsBoat';
import MaterialTable from 'material-table';
import history from '@history'
import { openNewShipmentDialog, selectRow, getShipments, removeShipment} from './store/shipmentsSlice';
import ShipmentStatus from './ShipmentStatus';
import ShipmentDialog from './ShipmentDialog';
import { Button, Typography, Breadcrumbs} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
	layoutRoot: {},
	buttonGroup: {
		'& > *': {
		  margin: theme.spacing(1),
		},
	},
	link: {
		display: 'flex',
	},
	icon: {
		marginRight: theme.spacing(0.5),
		width: 20,
		height: 20,
	},
}));
function Shipment(props) {
	const classes = useStyles(props);
	const dispatch = useDispatch();
	const shipments = useSelector(state => state.shipment.shipments.data);
	useEffect(() => {
		function getFilteredArray(shipments) {
			if(shipments.length)
			{
				let data = [];
				shipments.map((shipment) => {
					data.push({
						id: shipment._id,
						Urgent: shipment.Urgent,
						AntekId: shipment.AntekId,
						MBL: shipment.MBL,
						HBL: shipment.HBL,
						Container: shipment.Container,
						Port: shipment.Port,
						ETA: shipment.ETA,
						Status: shipment.Status,
						Type: shipment.Type,
						Pallets: shipment.Pallets,  //Required, auto populate if empty
						Volume: shipment.Volume, //Required
						Weight: shipment.Weight, //Required
						Carton: shipment.Carton, //Required
						Piece: shipment.Piece,
						Note: shipment.Note,
						POList: shipment.POList,
					})
				})
				return data;
			}
			return [];
		}

		if (shipments) {
			setData(getFilteredArray(shipments));
		}
	}, [shipments]);
	useDeepCompareEffect(() => {
		dispatch(getShipments());
	}, [dispatch,]);
	const columns = [
		{ title: 'Urgent', field: 'Urgent' },
		{ title: 'MBL', field: 'MBL' },
		{ title: 'HBL', field: 'HBL' },
		{ title: 'Container#', field: 'Container' },
		{ title: 'Port', field: 'Port' ,  render: rowData =>
			{
				return <div className="no-wrap">
				{
					rowData.Port.length && rowData.Port.map( row => {
							return (<div key = {row} className='inline text-12 p-6 mr-5 rounded truncate text-white' style={{backgroundColor:"#192d3e"}}>{row}</div>)

					})
				}
				</div>
			}
		},
		{ title: 'ETA Final', field: 'ETA' },
		{ title: 'Status', field: 'Status', render: rowData => {
			return <ShipmentStatus name={rowData.Status} />
		}},
		{ title: 'Type', field: 'Type' },
	]
	const [data, setData] = useState(null);
	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="p-24">
					<Breadcrumbs aria-label="breadcrumb">
						<Link className={classes.link} to="/dashboard">
							<HomeIcon className={classes.icon} />
							Home
						</Link>
						<Typography color="textPrimary">
							<BoatIcon className={classes.icon} />
							Shipment
						</Typography>
					</Breadcrumbs>
				</div>
			}
			content={
				<div className="p-24">
					<MaterialTable				
					title={
						<div className = {classes.buttonGroup}>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								startIcon={<AddIcon>add</AddIcon>}
								onClick={ev => dispatch(openNewShipmentDialog())}
							>
								Create
							</Button>
							<Button
								variant="contained"
								color="primary"
								className={classes.button}
								startIcon={<SyncIcon>sync</SyncIcon>}
							>
								Sync
							</Button>
						</div>
					}
					columns={columns}
					data={data?data:[]}
					style = {{padding:15}}
					onRowClick= { (event, rowData) => {
						console.log()
						dispatch(selectRow(rowData));
						history.push('/shipment/detail')
					}}
					editable={{
						onRowDelete: (oldData) =>
						new Promise((resolve) => {
							setTimeout(() => {
							resolve();
							dispatch(removeShipment(oldData.id));
							}, 300);
						}),
					}}
					/>
					<ShipmentDialog />
				</div>
			}
		/>
	);
}

export default Shipment;
