import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Alert from '@material-ui/lab/Alert';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SplitIcon from '@material-ui/icons/CallSplit';
import AssignIcon from '@material-ui/icons/Assignment';
import EditIcon from '@material-ui/icons/Edit';
import ImportIcon from '@material-ui/icons/OpenInBrowser';
import AddIcon from '@material-ui/icons/Add';
import SaveIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import _ from '@lodash';
import moment from 'moment';
import clsx from 'clsx';
import Papa from 'papaparse';
import SplitDialog from './SplitDialog';
import AssignDialog from './AssignDialog';
import UnassignDialog from './UnassignDialog';
import { updateShipment } from '../store/shipmentsSlice';

const useStyles = makeStyles(theme => ({
	root: {
		flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        padding: 20
	},
	link: {
		display: 'flex',
	},
	icon: {
		marginRight: theme.spacing(0.5),
		width: 20,
		height: 20,
    },
    fullWidth: {
        width:"100%",
    },
	btnGroup: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'& > *': {
		  margin: theme.spacing(1),
		},
    },
    input: {
        display: "none",
    }
}));
function Po(props) {
    const classes = useStyles(props);
    const dispatch = useDispatch();
    const [expanded, setExpanded] = React.useState(false);
    const [detail, setDetail] = useState({
        AntekId:"",
        MBL:"",
        HBL:"",
        Container:"",
        Port:[],
        ETA:"",
        Status:"",
        Type:"",
        Pallets:0,
        Volume:0,
        Weight:0,
        Carton:0,
        Unit:0,
        Note:"",
        POList: []
    })
    useEffect(() => {
        setDetail({...detail, ...props.detail});
    }, [props]);
    const appointmentOptions = [
        {
            ISA: "123456",
            destination_id: "YYZ3",
            DateTime: moment().format("MMM DD, YYYY H:mm a"),
            Status:["PENDING", "SCHEDULED", "TERMINATED", "CLOSED", "CANCELLED"],
            Pallets:10,
        },
        {
            ISA: "1234567",
            destination_id: "YYZ3",
            DateTime: moment().format("MMM DD, YYYY H:mm a"),
            Status:["PENDING", "SCHEDULED", "TERMINATED", "CLOSED", "CANCELLED"],
            Pallets:12,
        },
        {
            ISA: "12345678",
            destination_id: "YYZ3",
            DateTime: moment().format("MMM DD, YYYY H:mm a"),
            Status:["PENDING", "SCHEDULED", "TERMINATED", "CLOSED", "CANCELLED"],
            Pallets:17,
        },
        
    ]
    const [editing, setEditing] = React.useState({
        value:false,
        index: null,
    });
    const [showCard, setShowCard] = React.useState(false);
    const [newItem, setNewItem] = React.useState({
        destination: '',
        pos: ''
    })
    const getData = async (fileName) => {
            console.log("ffff", fileName)
            const response = await fetch(fileName)
            const reader = response.body.getReader()
            const result =  await reader.read()
            const decoder = new TextDecoder('utf-8')
            const csv = decoder.decode(result.value)
            const results = Papa.parse(csv, {header: false})
            const rows = results.data
            return rows;
        }
    const handleInputChange = (event) => {
        setNewItem({ ...newItem, [event.target.name]: event.target.value });
    };
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
        setEditing({...editing, value: false});
    };
    const handleAdd = () => {
        setShowCard(true);
    }
    const handleAccept = () => {
        if(!(newItem.pos.length > 0))
        {
            let array = detail.POList;
            let newPolist = array.slice(0)
            newPolist.splice(editing.index, 1);
            setDetail({...detail, POList:newPolist});
        }
        else{
            const results = Papa.parse(newItem.pos, {header: false})
            const rows = results.data
            saveNewPo(rows);
            setEditing({value: false, index: null});
            setNewItem({destination:'', pos: ''});
            setShowCard(false);
        }
    }
    const handleReject = () => {
        setEditing({value: false, index: null});
        setNewItem({destination:'', pos: ''});
        setShowCard(false);
    }
    const handleEdit = (i) => {
        let editPanel = 'Destination:' + '\t' + detail.POList[i].destination_id + '\t' +'Pallets:' + '\t' + detail.POList[i].Pallets + '\t' + 'Volume:' + '\t' + detail.POList[i].Volume + '\t' + 'Weight:' + '\t' + detail.POList[i].Weight;
        detail.POList[i].POS.map((po) => {
            editPanel += '\n' + po.PO + '\t' + po.Referce + '\t' + po.Carton + '\t' + po.Unit
        })
        setNewItem({...newItem, pos:editPanel});
        setEditing({value: true, index: i});
    }
    const handleImport = (ev) => {
        setShowCard(false);
        setEditing({...editing, value: false})
        const filePath = URL.createObjectURL(ev.target.files[0])
        getData(filePath)
        .then(res => {
            const data = res;
            saveNewPo(data);
        })
        .catch((e) => {
            console.log(e)
        });        
    }
    function saveNewPo(data) {
        let newPo = {
            destination_id : '',
            Pallets: 0,
            Weight: 0,
            Volume: 0,
            AssignedISA: !editing.value ? '' : detail.POList[editing.index].AssignedISA,
            POS: [],
        }
        data.map((po, i) => {
            if(i === 0) {
                newPo.destination_id = po[1];
                newPo.Pallets = po[3];
                newPo.Volume = po[5];
                newPo.Weight = po[7];
            }
            else
                newPo.POS.push({
                    PO:po[0],
                    Referce:po[1],
                    Carton:po[2],
                    Unit:po[3],
                })
        })
        let polist = [];
        detail.POList.map((po, i) => {
            if(editing.value)
            {
                if(i === editing.index)
                    polist.push(newPo);
                else
                    polist.push(po)
            }
            else
                polist.push(po);            
        })
        if(!editing.value) polist.push(newPo);       
        setNewPolist(polist);
        console.log("aaaaaaaaaa", polist)
        // setDetail({...detail, POList:newPolist});
    }
    function TotalPallets() {
        let total = 0;  
        if(detail.POList.length)
        {
            detail.POList.map(PO => {
                total += Number(PO.Pallets);
            })
        }
        return (<span>{total}</span>);
    }
    const [open, setOpen] = React.useState({
        status: false,
        pallets:0,
        index: undefined    
    });
    const [openAssign, setOpenAssign] = React.useState({
        status: false,
        pallets:0,
        appointmentOptions: [],
        index: undefined
    })
    const [openUnAssign, setOpenUnassign] = React.useState({
        status: false,
        date: "",
        index: -1
    })
    const [selectedValue, setSelectedValue] = React.useState(0);
    const handleSplitDialog = (i) => {
        setOpen({status: true, pallets: detail.POList[i].Pallets, index: i});
    };
    
    const handleCloseDialog = (value) => {
        setOpen({...open, status: false, pallets: 0});
        setSelectedValue(value);
    };
    const [selectedISA, setSelectedISA] = React.useState(-1);
    const handleCloseAssignDialog = (value) => {
        setOpenAssign({...openAssign, status: false})
        setSelectedISA(value);
        setExpanded('panel0');
    }
    const handleCloseUnAssignDialog = (value) => {
        if(value) {
            let polist= [];
            detail.POList.map((po, i) => {
                if(i == openUnAssign.index) 
                    polist.push({
                        destination_id: po.destination_id,  //Required
                        Pallets: po.Pallets, 
                        Volume: po.Volume,
                        Weight: po.Weight,
                        AssignedISA: "",
                        POS: po.POS
                    });
                else polist.push(po)  
            });
            setNewPolist(polist);
        }
        
        setOpenUnassign({...openUnAssign, status: false})
        setExpanded('panel0');
    }
    const handleAssign = (i) => {
        setOpenAssign({status: true, pallets: detail.POList[i].Pallets, appointmentOptions: appointmentOptions, index: i})
    }
    const handleUnassign = (i) => {
        const date = appointmentOptions.find( appointment => appointment.ISA == detail.POList[i].AssignedISA).DateTime;
        setOpenUnassign({status: true, date: date, index: i});
    }
    const handleSave = () => {
        dispatch(updateShipment(detail));
    }
    const [newPolist, setNewPolist] = React.useState([]);
    useEffect(() => {
        if(selectedISA != -1)
        {
            let polist = [];
            detail.POList.map((po, i) => {
                if(i === openAssign.index) 
                    polist.push({
                        destination_id: po.destination_id,  //Required
                        Pallets: po.Pallets, 
                        Volume: po.Volume,
                        Weight: po.Weight,
                        AssignedISA: selectedISA.ISA,
                        POS: po.POS
                    });
                else polist.push(po)
            });
            setNewPolist(polist);
        }
    }, [selectedISA]);
    useEffect(() => {
        if(newPolist.length)
            setDetail({...detail, POList: newPolist});
            console.log(newPolist)
    }, [newPolist])
    useEffect(() => {
		if (selectedValue) {
            let array = detail.POList;
            let newPolist = array.slice(0);
            let newPo = {
                ...detail.POList[open.index] 
            };
            newPo.Pallets = newPo.Pallets - selectedValue;
            newPolist[open.index].Pallets = selectedValue;
            newPolist.splice(open.index + 1, 0, newPo);
            setDetail({...detail, POList: newPolist});
            setExpanded('panel0')
		}
    }, [selectedValue]);
    
    return (
		<div className={classes.root}>
            <Grid container spacing={2}>
                <div className="flex w-full">
                    <div className="widget flex w-full sm:w-1/2 md:w-1/2 mb-12 pb-6 pt-6">
                        <Button onClick={handleAdd} className="mr-12" color="primary" variant="contained" startIcon={<AddIcon />}>Add</Button>
                        <input accept="*" onChange={handleImport} className={classes.input} id="upgrade-firmware" type="file" />
                        <label htmlFor="upgrade-firmware">
                            <div>
                                <Button component="span" color="primary" variant="contained" startIcon={<ImportIcon />} >Import</Button>
                            </div>
                        </label>
                    </div>
                    <div className="widget flex w-full sm:w-1/2 md:w-1/2 mb-12">
                        <Alert severity="info" className="text-15 flex" icon={false}>
                            <span className="truncate">Total</span>:
                            <b className="px-10"><TotalPallets /> pallets</b>
                        </Alert>
                    </div>
                </div>
                <Grid container>
                    {showCard && <Card className="w-full mb-12">
                        <CardContent>
                            <Typography variant="h5" component="h5" className="mb-6">
                                Add new PO
                            </Typography>
                            <TextField
                                label="POS"
                                id="POs"
                                name="pos"
                                value={newItem.pos}
                                onChange={handleInputChange}
                                multiline
                                rows={8}
                                fullWidth
                                variant="outlined"
                            />
                        </CardContent>
                        <CardActions>
                            <IconButton disabled={!(newItem.pos.length > 0)} onClick={handleAccept}>
                                <SaveIcon color="secondary" />
                            </IconButton>
                            <IconButton onClick={handleReject}>
                                <CancelIcon color="secondary" />
                            </IconButton>
                        </CardActions>  
                    </Card>}
                    {detail.POList && detail.POList.map((PO, i) => {
                        return(<Accordion 
                            expanded={expanded === `panel${i + 1}`}
                            onChange={handleChange(`panel${i + 1}`)}
                            className={classes.fullWidth}
                            key = {i}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel${i}bh-content`}
                                id={`panel${i}bh-header`}
                            >
                                <Grid container spacing={3} className={classes.fullWidth}>
                                    <div className="widget flex w-full sm:w-2/3 md:w-2/3 p-12">
                                        <Typography className='p-12'>{PO.destination_id}</Typography>
                                    </div>
                                    <div className="widget flex w-full sm:w-1/6 md:w-1/6 p-12">
                                        <Typography className='p-12'>{PO.Pallets} Pallets
                                        </Typography>
                                    </div>
                                    <div className="widget flex w-full sm:w-1/6 md:w-1/6 p-12">
                                        <div className={clsx('inline text-14 p-10 rounded truncate text-white', PO.AssignedISA ? 'bg-green-700' : 'bg-red-700')}>
                                            {PO.AssignedISA ? PO.AssignedISA : "Unassigned"}
                                        </div>
                                    </div>
                                </Grid>
                            </AccordionSummary>
                            <AccordionDetails>
                                {!editing.value ? 
                                <div className="widget w-full sm:w-1/1 md:w-1/1">
                                    {PO.AssignedISA && <Typography className="p-12 text-center text-16">Appointment{'\t' + 'ISA#' + '\t' + PO.AssignedISA + '\t' + appointmentOptions.find( appointment => appointment.ISA == PO.AssignedISA).DateTime}</Typography>}
                                    {PO.POS && PO.POS.map((row, index) => {
                                        return(
                                            <div key={index} className={classes.fullWidth}>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={3}>
                                                        <Typography noWrap>{row.PO}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography noWrap>{row.Referce}</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography>{row.Carton} Cartons</Typography>
                                                    </Grid>
                                                    <Grid item xs={3}>
                                                        <Typography>{row.Unit} Units</Typography>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        )
                                    })}
                                    <div className="widget flex w-full mt-12">
                                        <Button 
                                            className="mr-12"
                                            variant="contained"
                                            color="primary"
                                            disabled={PO.AssignedISA.length > 0}
                                            startIcon={<SplitIcon />}
                                            onClick={() => handleSplitDialog(i)}
                                        >
                                            Split
                                        </Button>
                                        <Button 
                                            className="mr-12"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<AssignIcon />}
                                            onClick={() => !PO.AssignedISA ? handleAssign(i): handleUnassign(i)}
                                        >
                                            {!PO.AssignedISA ? "Assign" : "Unassign"}
                                        </Button>
                                        <Button 
                                            className="mr-12"
                                            variant="contained"
                                            color="primary"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(i)}
                                        >
                                            Eidt
                                        </Button>
                                    </div>
                                </div> : 
                                <div className="widget w-full sm:w-1/1 md:w-1/1">
                                    <Typography variant="h5" component="h5" className="mb-6">
                                        Edit PO
                                    </Typography>
                                    <TextField
                                        label="POS"
                                        id="POs"
                                        name="pos"
                                        value={newItem.pos}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={15}
                                        fullWidth
                                        variant="outlined"
                                    />
                                    <IconButton onClick={handleAccept}>
                                        <SaveIcon color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={handleReject}>
                                        <CancelIcon color="secondary" />
                                    </IconButton>
                                </div>}
                            </AccordionDetails>
                        </Accordion>)
                    })}
                </Grid>
                <div className="widget flex w-full sm:w-1/2 md:w-1/2 mb-12 pb-6 pt-6">
                    <Divider className="mb-12" />
                    <Button onClick={handleSave} color="primary" variant="contained" startIcon={<SaveIcon />}>Save</Button>
                </div>
                
            </Grid>
            <SplitDialog pallets={open.pallets} selectedValue={selectedValue} open={open.status} onClose={handleCloseDialog} />
            <AssignDialog pallets={openAssign.pallets} appointmentOptions={openAssign.appointmentOptions} open={openAssign.status} onClose={handleCloseAssignDialog} />
            <UnassignDialog date={openUnAssign.date} open={openUnAssign.status} onClose={handleCloseUnAssignDialog} />
            
        </div>
	);
}

export default Po;
