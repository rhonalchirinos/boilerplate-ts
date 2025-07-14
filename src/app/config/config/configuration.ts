export default () => ({
  database: process.env.DATABASE_URL,
  redis: process.env.REDIS_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    fromAddress: process.env.MAIL_FROM_ADDRESS,
  },
});
