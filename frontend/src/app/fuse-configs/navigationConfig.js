import authRoles from 'app/auth/authRoles';
const navigationConfig = [
	{
		id: 'shipment-component',
		title: 'Shipment',
		type: 'item',
		icon: 'directions_boat',
		url: '/shipment'
	},
	{
		id: 'dispatch-component',
		title: 'Dispatch',
		type: 'group',
		icon: 'dispatch',
		children: [
			{
				id: 'appointment-component',
				title: 'Appointment',
				type: 'item',
				icon: 'location_on',
				url: '/dispatch/appointment'
			},
			{
				id: 'Schedule-component',
				title: 'Schedule',
				type: 'item',
				icon: 'schedule',
				url: '/dispatch/schedule',
			},
			{
				id: 'driver-component',
				title: 'Driver',
				type: 'item',
				icon: 'rowing',
				url: '/dispatch/driver'
			},
			{
				id: 'destination-component',
				title: 'Destination',
				type: 'item',
				icon: 'location_searching',
				url: '/dispatch/destination'
			}
		]
	},
	{
		id: 'settings-component',
		title: 'Settings',
		type: 'group',
		icon: 'settings',
		children: [
			{
				id: 'users-component',
				title: 'Users',
				type: 'item',
				icon: 'people',
				auth: authRoles.admin,
				url: '/settings/users'
			},
			{
				id: 'ResetPassword-component',
				title: 'ResetPassword',
				type: 'item',
				icon: 'autorenew',
				url: '/settings/resetpass'
			},
			{
				id: 'Schedule-component',
				title: 'Logout',
				type: 'item',
				icon: 'input',
				url: '/settings/logout',
			},
		]
	}
];

export default navigationConfig;
