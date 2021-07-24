import { authRoles } from 'app/auth';

import Dashboard from './Dashboard';

const DashboardConfig = {
	settings: {
        layout: {
			style: 'layout2',
            config: {
				footer : {
                    display : false
				},
            }
        }
	},
	auth: authRoles.user,
	routes: [
		{
			path: '/dashboard',
			component: Dashboard
		}
	]
};

export default DashboardConfig;