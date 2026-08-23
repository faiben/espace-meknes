import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.espacemeknes.app',
  appName: 'Espace Meknès',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#059669',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#d4af37',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#065f46',
    },
  },
  android: {
    backgroundColor: '#065f46',
    allowMixedContent: true,
  },
};

export default config;
