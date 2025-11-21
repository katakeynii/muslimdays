import { List } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useObjectives } from '../hooks';

export const ObjectivesButton: React.FC = () => {
    const router = useRouter();
    const { objectives } = useObjectives();

    // Calculer les statistiques
    const totalObjectives = objectives.length;
    const completedObjectives = objectives.filter(obj => obj.isCompleted).length;
    const pendingObjectives = totalObjectives - completedObjectives;

    const handlePress = () => {
        router.push('/objectives');
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    <View className="bg-blue-100 p-3 rounded-lg mr-4">
                        <List size={24} color="#3B82F6" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900 mb-1">
                            Mes Objectifs
                        </Text>
                        <Text className="text-sm text-gray-600">
                            Gérez vos objectifs de vie
                        </Text>
                    </View>
                </View>

                <View className="items-end">
                    <View className="bg-blue-50 px-3 py-1 rounded-full mb-1">
                        <Text className="text-sm font-semibold text-blue-700">
                            {pendingObjectives} en cours
                        </Text>
                    </View>
                    <Text className="text-xs text-gray-500">
                        {completedObjectives}/{totalObjectives} terminés
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}; 