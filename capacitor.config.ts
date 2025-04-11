import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.sample.googlelensclone',
  appName: 'Google Lens Clone',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*']
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#202124',
      androidSplashResourceName: 'splash',
      showSpinner: true,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#202124',
      overlaysWebView: false
    }
  }
};

export default config;
