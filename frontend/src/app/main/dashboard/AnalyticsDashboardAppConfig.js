import { authRoles } from 'app/auth';
import Dashboard from './Dashboard';

const AnalyticsDashboardAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/dashboard',
      component: Dashboard,
    },
  ],
};

export default AnalyticsDashboardAppConfig;
