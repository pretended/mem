

const config= {
  appId: 'io.ionic.starter',
  appName: 'mem',
  webDir: 'dist',
  bundledWebRuntime: false,
  "plugins": {
    "GoogleAuth": {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "64359081462-hfk338vvanvdfgand8i9hgbmoon5c9r1.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  },
};

export default config;
