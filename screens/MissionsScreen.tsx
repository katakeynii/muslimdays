import { Plus, Flag } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { MissionCard } from '../components/MissionCard';
import { useMissions } from '../hooks/useMissions';
import { Mission } from '../types';

interface MissionsScreenProps {
    navigation: any;
}

export const MissionsScreen: React.FC<MissionsScreenProps> = ({ navigation }) => {
    const {
        missions,
        loading,
        error,
        loadMissions,
        deleteMission,
        toggleMissionStatus,
    } = useMissions();

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadMissions();
        setRefreshing(false);
    };

    const handleEdit = (mission: Mission) => {
        navigation.navigate('EditMission', { mission });
    };

    const handleDelete = async (id: string) => {
        const success = await deleteMission(id);
        if (success) {
            // La suppression est gérée par le hook
        }
    };

    const handleToggleStatus = async (id: string) => {
        await toggleMissionStatus(id);
    };

    const handleCreateMission = () => {
        navigation.navigate('CreateMission');
    };

    const handleClearAll = () => {
        Alert.alert(
            'Supprimer toutes les missions',
            'Êtes-vous sûr de vouloir supprimer toutes les missions ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer tout',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implémenter clearAllMissions dans le hook
                        Alert.alert('Fonctionnalité à venir');
                    }
                },
            ]
        );
    };

    const activeMissions = missions.filter(mission => mission.isActive);
    const inactiveMissions = missions.filter(mission => !mission.isActive);

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center">
                <Text className="text-gray-600 text-lg">Chargement des missions...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-6 border-b border-gray-200">
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="text-2xl font-bold text-gray-900">
                            Mes Missions
                        </Text>
                        <Text className="text-gray-600 mt-1">
                            {missions.length} mission{missions.length > 1 ? 's' : ''} au total
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleCreateMission}
                        className="bg-blue-500 p-3 rounded-full shadow-sm"
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Contenu */}
            <ScrollView
                className="flex-1 px-4 pt-4"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#3b82f6']}
                    />
                }
            >
                {error && (
                    <View className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <Text className="text-red-700">{error}</Text>
                    </View>
                )}

                {missions.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <Flag size={64} color="#9ca3af" />
                        <Text className="text-xl font-semibold text-gray-600 mt-4 mb-2">
                            Aucune mission
                        </Text>
                        <Text className="text-gray-500 text-center mb-6">
                            Commencez par créer votre première mission de vie
                        </Text>
                        <TouchableOpacity
                            onPress={handleCreateMission}
                            className="bg-blue-500 px-6 py-3 rounded-lg"
                        >
                            <Text className="text-white font-semibold">
                                Créer ma première mission
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Missions actives */}
                        {activeMissions.length > 0 && (
                            <View className="mb-6">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-lg font-semibold text-gray-900">
                                        Missions actives ({activeMissions.length})
                                    </Text>
                                </View>
                                {activeMissions.map(mission => (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Missions inactives */}
                        {inactiveMissions.length > 0 && (
                            <View className="mb-6">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-lg font-semibold text-gray-600">
                                        Missions inactives ({inactiveMissions.length})
                                    </Text>
                                </View>
                                {inactiveMissions.map(mission => (
                                    <MissionCard
                                        key={mission.id}
                                        mission={mission}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onToggleStatus={handleToggleStatus}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Actions supplémentaires */}
                        {missions.length > 0 && (
                            <View className="py-4 border-t border-gray-200">
                                <TouchableOpacity
                                    onPress={handleClearAll}
                                    className="bg-red-50 border border-red-200 rounded-lg p-3"
                                >
                                    <Text className="text-red-600 text-center font-medium">
                                        Supprimer toutes les missions
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}; 