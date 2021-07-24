import { authRoles } from 'app/auth';

import Appointment from './Appointment';
import Schedule from './Schedule';
import Destination from './Destination';
import Driver from './Driver';

const DispatchConfig = {
    settings: {
        layout: {
            config: {
				footer : {
                    display : false
                }
            }
        }
    },
	auth: authRoles.user,
    routes  : [
        {
            path     : '/dispatch/appointment',
            component: Appointment
        },
        {
            path     : '/dispatch/schedule',
            component: Schedule
        },
        {
            path     : '/dispatch/driver',
            component: Driver
        },
        {
            path     : '/dispatch/destination',
            component: Destination
        }
    ]
};

export default DispatchConfig;