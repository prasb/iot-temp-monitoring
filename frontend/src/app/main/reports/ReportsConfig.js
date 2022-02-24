import i18next from 'i18next';
import { authRoles } from 'app/auth';
import Reports from './Reports';
import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';

i18next.addResourceBundle('en', 'reportsPage', en);
i18next.addResourceBundle('tr', 'reportsPage', tr);
i18next.addResourceBundle('ar', 'reportsPage', ar);

const ReportsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/reports',
      component: Reports,
    },
  ],
};

export default ReportsConfig;
