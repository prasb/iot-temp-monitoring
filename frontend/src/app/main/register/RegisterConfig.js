import { authRoles } from 'app/auth';
import i18next from 'i18next';
import RegisterPage from './RegisterPage';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'registerPage', en);
i18next.addResourceBundle('tr', 'registerPage', tr);
i18next.addResourceBundle('ar', 'registerPage', ar);

const RegisterConfig = {
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
      path: '/register',
      component: RegisterPage,
    },
  ],
};

export default RegisterConfig;
