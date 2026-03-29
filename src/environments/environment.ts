export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  apiBaseUrl: 'http://127.0.0.1:8000',
  healthUrl: 'http://127.0.0.1:8000/up',
  lowStockThreshold: 10,
  socialAuthUrls: {
    google: 'https://api.yourgym-platform.com/api/auth/google/redirect',
    facebook: 'https://api.yourgym-platform.com/api/auth/facebook/redirect',
    github: 'https://api.yourgym-platform.com/api/auth/github/redirect'
  },
  featureFlags: {
    enableProducts: true,
    enableNotifications: true,
  }
};
