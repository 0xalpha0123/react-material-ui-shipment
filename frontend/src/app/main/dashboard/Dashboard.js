import FusePageSimple from '@fuse/core/FusePageSimple';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
	layoutRoot: {}
}));

function DashboardPage(props) {
	const classes = useStyles(props);
	return (
		<div>
			<center><h1>Welcom Back!</h1></center>
		</div>
	);
}

export default DashboardPage;
