import { registerAs } from '@nestjs/config';

export default registerAs('postgres', () => ({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT ? Number(process.env.POSTGRES_PORT) : 5434,
  database: process.env.POSTGRES_DATABASE || 'api-gateway',
  username: process.env.POSTGRES_USERNAME || 'api-gateway',
  password: process.env.POSTGRES_PASSWORD || 'api-gateway',
}));
