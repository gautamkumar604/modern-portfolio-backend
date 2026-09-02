export default () => {
  const isProd = process.env.NODE_ENV === 'production';
  const envCookieSecure = process.env.COOKIE_SECURE;
  
  const cookieSecure =
    envCookieSecure !== undefined && envCookieSecure !== ''
      ? envCookieSecure === 'true'
      : isProd;

  const envSameSite = process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none' | undefined;
  const validSameSite =
    envSameSite === 'lax' || envSameSite === 'strict' || envSameSite === 'none'
      ? envSameSite
      : undefined;

  const cookieSameSite = validSameSite || (cookieSecure ? 'none' : 'lax');

  return {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGO_URI || '',
    jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminInitialPassword: process.env.ADMIN_INITIAL_PASSWORD || '',
    cookieSecure,
    cookieSameSite,
  };
};
