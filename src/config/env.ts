import { cleanEnv, str, port } from 'envalid';

export const env = cleanEnv(process.env, {
  DATABASE_URL:           str(),
  JWT_PRIVATE_KEY_PATH:   str({ default: '' }),
  JWT_PUBLIC_KEY_PATH:    str({ default: '' }),
  JWT_PRIVATE_KEY:        str({ default: '' }),
  JWT_PUBLIC_KEY:         str({ default: '' }),
  JWT_ACCESS_EXPIRY:      str({ default: '15m' }),
  JWT_REFRESH_EXPIRY:     str({ default: '7d' }),
  PORT:                   port({ default: 3000 }),
  NODE_ENV:               str({ choices: ['development', 'production', 'test'] }),
  ALLOWED_ORIGINS:        str(),
  PAYMENT_GATEWAY_SECRET: str({ default: '' }),
  PAYMENT_WEBHOOK_SECRET: str({ default: '' }),
  MAIL_API_KEY:           str({ default: '' }),
  MAIL_FROM:              str({ default: '' }),
});