import { authRoles } from 'app/auth';
import Configuration from './Configuration';

const ConfigurationCongif = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/configuration',
      component: Configuration,
    },
  ],
};

export default ConfigurationCongif;
