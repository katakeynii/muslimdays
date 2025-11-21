import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'MuslimDay',
    slug: 'MuslimDay',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: "com.katakeynii.productivity.MuslimDay"
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#FFFFFF'
        },
        package: "com.katakeynii.productivity.MuslimDay"
    },
    web: {
        favicon: './assets/favicon.png'
    },
    scheme: 'muslimday',
    experiments: {
        tsconfigPaths: true
    },
    plugins: [
        'expo-router',
        'expo-asset',
        'expo-font',
        '@react-native-community/datetimepicker'
    ],
    extra: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    }
}); 