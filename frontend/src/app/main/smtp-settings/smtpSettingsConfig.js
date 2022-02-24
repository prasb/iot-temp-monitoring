import SmtpSettings from './smtpSettings'

const SmtpSettingsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/smtp-settings',
      component: SmtpSettings,
    },
  ],
};

export default SmtpSettingsConfig;
