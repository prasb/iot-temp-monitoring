import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import ExampleConfig from 'app/main/example/ExampleConfig';
import LoginConfig from 'app/main/login/LoginConfig';
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import RegisterConfig from 'app/main/register/RegisterConfig';
import ForgotPasswordConfig from 'app/main/forgot-password/ForgotPasswordPageConfig';
import AnalyticsDashboardAppConfig from 'app/main/dashboard/AnalyticsDashboardAppConfig';
import ReportsConfig from 'app/main/reports/ReportsConfig';
import ConfigurationCongif from 'app/main/configuration/ConfigurationCongif';
import SmtpSettingsConfig from 'app/main/smtp-settings/smtpSettingsConfig';
import websiteSettingsConfig from 'app/main/website-settings/websiteSettingsConfig';
import LogoutConfig from 'app/main/logout/logoutConfig';
import PassWordConfig from 'app/main/password/PasswordConfig';

const routeConfigs = [
  ExampleConfig,
  LoginConfig,
  RegisterConfig,
  ForgotPasswordConfig,
  AnalyticsDashboardAppConfig,
  ReportsConfig,
  ConfigurationCongif,
  SmtpSettingsConfig,
  websiteSettingsConfig,
  LogoutConfig,
  PassWordConfig,
];

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.

  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => <Redirect to="/dashboard" />,
  },
  {
    path: '/loading',
    exact: true,
    component: () => <FuseLoading />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
