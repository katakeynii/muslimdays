import { Flag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export const MissionsButton: React.FC = () => {
    const router = useRouter();

    const handlePress = () => {
        router.push('/missions');
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="bg-blue-500 px-4 py-3 rounded-lg shadow-sm"
            style={{
                elevation: 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            }}
        >
            <View className="flex-row items-center">
                <Flag size={20} color="white" />
                <Text className="text-white font-semibold ml-2">
                    Mes Missions
                </Text>
            </View>
        </TouchableOpacity>
    );
}; 