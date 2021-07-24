import React from 'react';
import { Redirect } from 'react-router-dom';
import { authRoles } from 'app/auth';
import FuseUtils from '@fuse/utils';
import AuthConfig from 'app/main/auth/AuthConfig';
import DashboardConfig from 'app/main/dashboard/DashboardConfig';
import ShipmentConfig from 'app/main/shipment/ShipmentConfig';
import DispatchConfig from 'app/main/dispatch/DispatchConfig';
import SettingConfig from 'app/main/setting/SettingConfig';

const routeConfigs = [
	AuthConfig,
	DashboardConfig,
	ShipmentConfig,
	DispatchConfig,
	SettingConfig,
];

const routes = [
	...FuseUtils.generateRoutesFromConfigs(routeConfigs),
	// {
	// 	path: '*',
	// 	auth: authRoles.admin,
	// 	component: () => <Redirect to="/dashboard" />
	// },
	{
		path: '/',
		auth: authRoles.user,
		component: () => <Redirect to="/dashboard" />
	},
	{
		path: '/',
		auth: null,
		component: () => <Redirect to="/auth/login" />
	},
];

export default routes;
