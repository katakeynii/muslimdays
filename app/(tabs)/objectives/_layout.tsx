import { Stack } from 'expo-router';

export default function ObjectivesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: 'Mes Objectifs',
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="create"
                options={{
                    title: 'Nouvel Objectif',
                    headerShown: false,
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: 'Modifier l\'Objectif',
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 