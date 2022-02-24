module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'mongoose',
      settings: {
        uri: env('DATABASE_URI', 'mongodb://localhost:27017, localhost:27018, localhost:27019/3i-analytics?replicaSet=rs'),
        srv: env.bool('DATABASE_SRV', false),
        port: env.int('DATABASE_PORT', 27017),
        database: env('DATABASE_NAME', '3i-analytics'),
        username: env('DATABASE_USERNAME', null),
        password: env('DATABASE_PASSWORD', null),
      },
      options: {
        authenticationDatabase: env('AUTHENTICATION_DATABASE', null),
        ssl: env.bool('DATABASE_SSL', false),
      },
    },
  },
});
