import ResetPasswordPage from '../auth/ResetPasswordPage';
import Users from './User/Users';
import { authRoles } from 'app/auth/';
import store from 'app/store';
import { logoutUser } from 'app/auth/store/userSlice';

const SettingConfig = {
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
            path     : '/settings/resetpass',
            component: ResetPasswordPage
        },
        {
			path: '/settings/logout',
			component: () => {
				store.dispatch(logoutUser());
				return 'Logging out..';
			}
        },
        {
            path: '/settings/users',
            auth: authRoles.admin,
			component: Users,
        }
        
    ]
};

export default SettingConfig;