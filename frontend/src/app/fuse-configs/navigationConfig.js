// import { authRoles } from 'app/auth';
import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'dashboard',
    url: '/dashboard',
  },
  {
    id: 'configuration',
    title: 'Configuration',
    type: 'item',
    icon: 'build',
    url: '/configuration',
  },
  {
    id: 'reports',
    title: 'Reports',
    type: 'item',
    icon: 'clear_all',
    url: '/reports',
  },
  {
    id: 'password',
    title: 'Password',
    type: 'item',
    icon: 'settings',
    url: '/password',
  },
  // {
  //   id: 'settings',
  //   title: 'Settings',
  //   type: 'collapse',
  //   icon: 'settings',
  //   children: [
  //     {
  //       id: 'smtp settings',
  //       title: 'SMTP Settings',
  //       type: 'item',
  //       icon: 'mail',
  //       url: '/smtp-settings',
  //     },
  //   ],
  // },
  {
    id: 'logout',
    title: 'Logout',
    type: 'item',
    icon: 'exit_to_app',
    url: '/logout',
  },
];

export default navigationConfig;
