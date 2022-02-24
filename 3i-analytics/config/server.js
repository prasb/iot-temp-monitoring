module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 8080),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '78d5da0c1412e9f50969e019bea4ebf5'),
    },
  },
});
