export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api',
  apiBaseUrl: 'http://127.0.0.1:8000',
  healthUrl: 'http://127.0.0.1:8000/up',
  lowStockThreshold: 10,
  socialAuthUrls: {
    google: 'http://localhost:8000/api/auth/google/redirect',
    facebook: 'http://localhost:8000/api/auth/facebook/redirect',
    github: 'http://localhost:8000/api/auth/github/redirect'
  },
  featureFlags: {
    enableProducts: true,
    enableNotifications: true,
  }
};
