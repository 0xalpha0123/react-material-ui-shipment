import { authRoles } from 'app/auth';

import Shipment from './Shipment';
import Detail from './Detail';
const ShipmentConfig = {
	settings: {
        layout: {
            config: {				
            }
        }
    },
	auth: authRoles.user,
	routes: [
		{
			path: '/shipment/detail',
			component: Detail
		},
		{
			path: '/shipment/',
			component: Shipment
		}
	]
};

export default ShipmentConfig;