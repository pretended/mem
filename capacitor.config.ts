

const config= {
  appId: 'io.ionic.starter',
  appName: 'mem',
  webDir: 'dist',
  bundledWebRuntime: false,
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 0
    },
    "GoogleAuth": {
      "scopes": [
        "profile",
        "email"
      ],
      "serverClientId": "REPLACEME.apps.googleusercontent.com",
      "forceCodeForRefreshToken": true
    }
  },
};

export default config;
