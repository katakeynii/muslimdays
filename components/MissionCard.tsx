import { Plus, ChevronLeft, Pause, Play, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Mission } from '../types';

interface MissionCardProps {
    mission: Mission;
    onEdit: (mission: Mission) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (id: string) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
    mission,
    onEdit,
    onDelete,
    onToggleStatus,
}) => {
    const router = useRouter();
    const swipeableRef = useRef<any>(null);

    const handleDelete = () => {
        Alert.alert(
            'Supprimer la mission',
            `Êtes-vous sûr de vouloir supprimer "${mission.title}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        onDelete(mission.id);
                        swipeableRef.current?.close();
                    }
                },
            ]
        );
    };

    const handleToggleStatus = () => {
        Alert.alert(
            mission.isActive ? 'Désactiver la mission' : 'Activer la mission',
            `Voulez-vous ${mission.isActive ? 'désactiver' : 'activer'} "${mission.title}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: mission.isActive ? 'Désactiver' : 'Activer',
                    onPress: () => {
                        onToggleStatus(mission.id);
                        swipeableRef.current?.close();
                    }
                },
            ]
        );
    };

    const renderRightActions = () => {
        return (
            <View className="flex-row items-center justify-end h-full pr-4 pl-4">
                <TouchableOpacity
                    onPress={handleToggleStatus}
                    className={`w-12 h-12 rounded-full justify-center items-center mr-2 ${mission.isActive ? 'bg-orange-500' : 'bg-green-500'
                        }`}
                >
                    {mission.isActive ? (
                        <Pause size={20} color="white" />
                    ) : (
                        <Play size={20} color="white" />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleDelete}
                    className="w-12 h-12 rounded-full bg-red-500 justify-center items-center"
                >
                    <Trash2 size={20} color="white" />
                </TouchableOpacity>
            </View>
        );
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    return (
        <View className="mb-3 bg-gray-200 rounded-xl">
            <Swipeable
                ref={swipeableRef}
                renderRightActions={renderRightActions}
                rightThreshold={40}
                overshootRight={false}
            >
                <TouchableOpacity
                    onPress={() => onEdit(mission)}
                    activeOpacity={0.7}
                    className={`p-4 rounded-xl border-l-4 ${mission.isActive
                        ? 'bg-white border-l-blue-500 shadow-sm'
                        : 'bg-gray-50 border-l-gray-400'
                        }`}
                >
                    {/* En-tête avec titre et statut */}
                    <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-3">
                            <Text className={`text-lg font-semibold ${mission.isActive ? 'text-gray-900' : 'text-gray-600'
                                }`}>
                                {mission.title}
                            </Text>
                            <Text className="text-xs text-gray-500 mt-1">
                                Créée le {formatDate(mission.createdAt)}
                            </Text>
                        </View>

                        {/* Indicateur de statut */}
                        <View className={`px-2 py-1 rounded-full ${mission.isActive ? 'bg-blue-100' : 'bg-gray-200'
                            }`}>
                            <Text className={`text-xs font-medium ${mission.isActive ? 'text-blue-700' : 'text-gray-600'
                                }`}>
                                {mission.isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                    </View>

                    {/* Description */}
                    {mission.description && (
                        <Text className={`text-sm mb-2 ${mission.isActive ? 'text-gray-700' : 'text-gray-600'
                            }`}>
                            {mission.description}
                        </Text>
                    )}

                    {/* Vision */}
                    {mission.vision && (
                        <View className="mb-3">
                            <Text className="text-xs font-medium text-gray-500 mb-1">
                                Vision de réussite :
                            </Text>
                            <Text className={`text-sm italic ${mission.isActive ? 'text-gray-700' : 'text-gray-600'
                                }`}>
                                &ldquo;{mission.vision}&rdquo;
                            </Text>
                        </View>
                    )}

                    {/* Actions */}
                    <View className="flex-row items-center justify-between mt-3">
                        <TouchableOpacity
                            onPress={() => router.push(`/objectives/create?missionId=${mission.id}`)}
                            className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg"
                        >
                            <Plus size={16} color="#3B82F6" />
                            <Text className="text-sm font-medium text-blue-700 ml-1">
                                Ajouter un objectif
                            </Text>
                        </TouchableOpacity>

                        <View className="flex-row items-center">
                            <ChevronLeft size={16} color="#9ca3af" />
                            <Text className="text-xs text-gray-500 ml-1">
                                Glissez pour les actions
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        </View>
    );
}; 