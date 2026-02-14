export const APP_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  APP_NAME: 'FlipKart Clone',
  APP_DESCRIPTION: 'Enterprise E-commerce Platform',
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const STRIPE_CONFIG = {
  PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  CURRENCY: 'inr',
};

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'super-secret-change-in-production',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REFRESH_SECRET: process.env.REFRESH_TOKEN_SECRET || '',
  REFRESH_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || '30d',
};

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};
