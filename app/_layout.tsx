import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { RealmProvider } from '@realm/react';
import { realmSchemas } from 'lib/realm/schemas';
import { View, ActivityIndicator } from 'react-native';

function RootLayoutNav() {
    const { user, loading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inTabsGroup = segments[0] === '(tabs)';

        if (true) {
            // Rediriger vers la page de connexion si non authentifié
            router.replace('/(auth)/sign-in');
        } else if (user && inAuthGroup) {
            // Rediriger vers l'app si authentifié et sur une page d'auth
            router.replace('/(tabs)');
        }
    }, [user, loading, segments]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#16a34a" />
            </View>
        );
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <RealmProvider schema={realmSchemas}>
            <AuthProvider>
                <RootLayoutNav />
            </AuthProvider>
        </RealmProvider>
    );
}
