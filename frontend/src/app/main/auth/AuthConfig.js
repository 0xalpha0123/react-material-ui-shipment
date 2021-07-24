import { authRoles } from 'app/auth';

import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ResetPasswordPage from './ResetPasswordPage';

const AuthConfig = {
    settings: {
        layout: {
            style : 'layout2',
            config: {
                scroll : 'content',
                navbar : {
                    display : false
                },
                mode   : 'fullwidth'
            }
        },
        customScrollbars: true,
        theme           : {
            main   : 'default',
            navbar : 'mainThemeDark',
        }
    },
    routes  : [
        {
            path     : '/auth/login',
            component: LoginPage
        },
        {
            path     : '/auth/register',
            component: RegisterPage
        },
        {
            path     : '/auth/reset_password',
            component: ResetPasswordPage
        }
    ]
};

export default AuthConfig;