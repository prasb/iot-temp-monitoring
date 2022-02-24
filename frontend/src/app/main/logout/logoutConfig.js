// import Logout from './logout'
import { Redirect } from 'react-router-dom';

const LogoutConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/logout',
      component: () => <Redirect to="/login" />,
    },
  ],
};

export default LogoutConfig;
