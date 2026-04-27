import 'dotenv/config';

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

export const env = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    user: process.env.DB_USER ?? 'postgres',
    pass: process.env.DB_PASS ?? 'password',
    name: process.env.DB_NAME ?? 'library_management',
  },
  jwtSecret: required('JWT_SECRET'),
};
