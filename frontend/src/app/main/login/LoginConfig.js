import { authRoles } from 'app/auth';
import i18next from 'i18next';
import LoginPage from './Login';
import Login3Page from './Login3Page';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'loginPage', en);
i18next.addResourceBundle('tr', 'loginPage', tr);
i18next.addResourceBundle('ar', 'loginPage', ar);

const LoginConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: '/login',
      component: Login3Page,
    },
  ],
};

export default LoginConfig;
