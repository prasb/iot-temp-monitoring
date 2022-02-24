import websiteSettings from './websiteSettings'

const websiteSettingsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/website-settings',
      component: websiteSettings,
    },
  ],
};

export default websiteSettingsConfig;
