import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import MUIDataTable from "mui-datatables";
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/VpnKey';
import HomeIcon from '@material-ui/icons/Home';
import UserIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/Settings';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers, removeUser, initPassword } from 'app/auth/store/userSlice';
import moment from 'moment';
import { useDeepCompareEffect } from '@fuse/hooks';


const useStyles = makeStyles(theme => ({
	layoutRoot: {
        padding: 20
    },
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


function Users(props) {
	const classes = useStyles(props);
	// const [state, setState] = React.useState({
	// 	users: [
    //         { email : 'lahm@gmail.com', role:'admin', created:'2020.02.20'},
    //         { email : 'lahm@gmail.com', role:'user', created:'2020.02.20'},
    //         { email : 'lahm@gmail.com', role:'staff', created:'2020.02.20'},
    //         { email : 'lahm@gmail.com', role:'user', created:'2020.02.20'},
	// 	],
    // });
    const users = useSelector( state => state.auth.user.users);
    const dispatch = useDispatch();
    useDeepCompareEffect(() => {
		dispatch(getUsers());
	}, [dispatch,]);
    const handleDelete = (user) => {
        dispatch(removeUser(user));
    }
    const handleEdit = (user) => {
        dispatch(initPassword(user));
    }
    const columns = [
        {
            name: "username",
            label: "E-mail",
            options: {
                sort: true,
            }
        },
        {
            name: "role",
            label: "Role",
            options: {
                sort: true,
            }
        },
        {
            name: "created",
            label: "Created",
            options: {
                sort: true,
                customBodyRender: (text, dataIndex) => {
                    return moment(text).format("YYYY-MM-DD")
                  }
            }
        },
        {
            name: "Action",
            options: {
                filter: false,
                sort: false,
                empty: true,
                customBodyRenderLite: (dataIndex) => {
                    return (
                        <div>
                            <Tooltip title={"Initiate Password"}>
                                <IconButton onClick= {() => handleEdit(users[dataIndex])}>
                                    <EditIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={"Remove User"}>
                                <IconButton onClick= {() => handleDelete(users[dataIndex])}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Tooltip>
                        </div>
                    
                    );
                }
            }
        }
    ]
 
	return (
		<FusePageSimple
			// classes={{
			// 	root: classes.layoutRoot
			// }}
			header={
				<div className="p-24">
					<Breadcrumbs aria-label="breadcrumb">
						<Link className={classes.link} to="/dashboard">
							<HomeIcon className={classes.icon} />
							Home
						</Link>
                        <Typography color="textPrimary">
							<SettingsIcon className={classes.icon} />
							Settings
						</Typography>
						<Typography color="textPrimary">
							<UserIcon className={classes.icon} />
							Users
						</Typography>
					</Breadcrumbs>
				</div>
			}
			content={
				<div className="p-24">
					<MUIDataTable
                        className={classes.layoutRoot}
                        title="Users"
                        data={ users?users:[] }
                        columns={columns}
                        options = {{
                            rowHover: true,
                            selectableRows: "none",
                            viewColumns: false,
                            rowsPerPage: 2,
                            download: false,
                            print: false,
                            rowsPerPageOptions: [2, 5, 10],
                            filter: false,
                            // filterType: 'dropdown',
                            responsive: 'standard',
                            // expandableRows: true,
                            // expandableRowsOnClick: false,
                            // isRowExpandable: (dataIndex, expandedRows) => {
                        
                            // return true;
                            // },
                        
                            // renderExpandableRow: (rowData, rowMeta) => {
                            // const colSpan = rowData.length + 1;
                            // return (
                            //     <>
                            //     <TableRow>
                            //         <TableCell colSpan={colSpan}>
                            //     <b> Job Title:</b>  {rowData[7]} <b>Job Joining:</b>{rowData[8]} <b>Status:</b>{rowData[9] ? "Ture" :"False"} <b>description:</b>{rowData[10]} 
                            //         </TableCell>
                                    
                            //     </TableRow>
                            //     </>
                            // );
                            // },
                        }}
                        // components = {components}
                    />
				</div>
			}
		/>
	);
}

export default Users;
