import { Stack } from 'expo-router';

export default function ActionsLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="create"
                options={{
                    title: 'Nouvelle Action',
                    headerShown: false,
                }}
            />
        </Stack>
    );
} 