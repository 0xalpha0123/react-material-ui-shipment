import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import HomeIcon from '@material-ui/icons/Home';
import BoatIcon from '@material-ui/icons/DirectionsBoat';
import DetailIcon from '@material-ui/icons/Assignment';
import SaveIcon from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import PO from './tabs/Po';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';

function TabPanel(props) {
	const { children, value, index, ...other } = props;
	return (
	<div
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
		{...other}
	>
		{value === index && (
		  <Box p={3}>
			<Typography>{children}</Typography>
		  </Box>
		)}
	  </div>
	);
}
  
  
function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}
const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	link: {
		display: 'flex',
	},
	icon: {
		marginRight: theme.spacing(0.5),
		width: 20,
		height: 20,
	},
	btnGroup: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& > *': {
		  margin: theme.spacing(1),
		},
	},
}));
function Detail(props) {
	const classes = useStyles(props);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	const handleTextChange = (event) => {
		event.persist();
		setData(_data => 
			_.setIn(
				{ ..._data },
				event.target.name,
				event.target.value
			));
	};
	const [value, setValue] = React.useState(0);
	const [data, setData] = useState(null);
	const selected = useSelector(state => state.shipment.shipments.selected);
	useEffect(() => {
		if (selected) {
			setData(selected);
		}
	}, [selected]);
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
						<Link className={classes.link} to="/shipment">
							<BoatIcon className={classes.icon} />
							Shipment
						</Link>
						<Typography color="textPrimary">
							<DetailIcon className={classes.icon} />
							Detail
						</Typography>
					</Breadcrumbs>
				</div>
			}
			content={
				<div className='p-24'>
					{data ? <div className={classes.root}>
						<FuseAnimateGroup
							className="flex flex-wrap"
							enter={{
								animation: 'transition.slideUpBigIn'
							}}
						>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<TextField
									className="mb-24"
									id="MBL"
									label="MBL"
									name="MBL"
									required
									fullWidth
									onChange={handleTextChange}
									value={data.MBL}
								/>
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<TextField
									className="mb-24"
									id="HBL"
									label="HBL"
									name="HBL"
									required
									fullWidth
									onChange={handleTextChange}
									value={data.HBL}
								/>
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<TextField
									className="mb-24"
									id="AntekId"
									label="Antek ID"
									name="AntekId"
									required
									fullWidth
									onChange={handleTextChange}
									value={data.AntekId}
								/>
							</div>
							<div className="widget flex w-full sm:w-1/2 md:w-1/4 p-12">
								<TextField
									className="mb-24"
									id="container"
									label="Container"
									name="Container"
									required
									fullWidth
									onChange={handleTextChange}
									value={data.Container}
								/>
							</div>
						</FuseAnimateGroup>
						<div className="p-12">
							<AppBar position="relative">
								<Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
								<Tab label="PO" {...a11yProps(0)} />
								<Tab label="For Future" {...a11yProps(1)} />
								<Tab label="For Future" {...a11yProps(2)} />
								</Tabs>
							</AppBar>
						</div>
						{value === 0 && <PO detail={data} />}
						{value === 1 && <></>}
						{value === 2 && <></>}
						
					</div> : <h1>Non shipment selected!</h1>}
				</div>
			}
		/>
	);
}

export default Detail;
