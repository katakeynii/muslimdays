import { Stack } from 'expo-router';

export default function MissionsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Mes Missions de Vie',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="create"
                options={{
                    title: 'Nouvelle Mission',
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: 'Modifier la Mission',
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 