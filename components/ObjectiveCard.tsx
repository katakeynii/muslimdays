import { Check, Pencil, Trash2, Flag, Calendar, Zap, Clock, Circle } from 'lucide-react-native';
import React from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { Objective, ObjectiveTermType } from '../types';

interface ObjectiveCardProps {
    objective: Objective;
    missionTitle?: string;
    onToggleCompletion: (id: string) => void;
    onEdit?: (objective: Objective) => void;
    onDelete?: (id: string) => void;
    showMissionTitle?: boolean;
}

/**
 * Composant pour afficher un objectif individuel
 */
export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
    objective,
    missionTitle,
    onToggleCompletion,
    onEdit,
    onDelete,
    showMissionTitle = false,
}) => {
    const getTermTypeColor = (termType: ObjectiveTermType) => {
        switch (termType) {
            case 'court':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'moyen':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'long':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getTermTypeIcon = (termType: ObjectiveTermType) => {
        switch (termType) {
            case 'court':
                return Zap;
            case 'moyen':
                return Clock;
            case 'long':
                return Calendar;
            default:
                return Circle;
        }
    };

    const formatDate = (date?: Date) => {
        if (!date) return 'Aucune échéance';
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleDelete = () => {
        Alert.alert(
            'Supprimer l\'objectif',
            'Êtes-vous sûr de vouloir supprimer cet objectif ?',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(objective.id) },
            ]
        );
    };

    return (
        <View className={`mb-4 bg-white rounded-xl shadow-sm border ${objective.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
            {/* En-tête avec titre et actions */}
            <View className="flex-row items-center justify-between p-4 pb-2">
                <View className="flex-1 flex-row items-center">
                    {/* Checkbox pour marquer comme terminé */}
                    <TouchableOpacity
                        onPress={() => onToggleCompletion(objective.id)}
                        className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${objective.isCompleted
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}
                    >
                        {objective.isCompleted && (
                            <Check size={14} color="white" />
                        )}
                    </TouchableOpacity>

                    {/* Titre de l'objectif */}
                    <Text
                        className={`flex-1 text-lg font-semibold ${objective.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                        numberOfLines={2}
                    >
                        {objective.title}
                    </Text>
                </View>

                {/* Actions */}
                <View className="flex-row items-center ml-2">
                    {onEdit && (
                        <TouchableOpacity
                            onPress={() => onEdit(objective)}
                            className="p-2 mr-1"
                        >
                            <Pencil size={18} color="#6B7280" />
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity
                            onPress={handleDelete}
                            className="p-2"
                        >
                            <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Informations de l'objectif */}
            <View className="px-4 pb-4">
                {/* Description */}
                {objective.description && (
                    <Text
                        className={`mb-3 text-sm ${objective.isCompleted ? 'text-gray-400' : 'text-gray-600'
                            }`}
                        numberOfLines={3}
                    >
                        {objective.description}
                    </Text>
                )}

                {/* Mission associée */}
                {showMissionTitle && missionTitle && (
                    <View className="flex-row items-center mb-2">
                        <Flag size={14} color="#6B7280" />
                        <Text className="ml-1 text-xs text-gray-500">
                            Mission: {missionTitle}
                        </Text>
                    </View>
                )}

                {/* Métadonnées */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        {/* Type de terme */}
                        <View className={`flex-row items-center px-2 py-1 rounded-full border ${getTermTypeColor(objective.termType)}`}>
                            {(() => {
                                const IconComponent = getTermTypeIcon(objective.termType);
                                return <IconComponent size={12} color="currentColor" />;
                            })()}
                            <Text className="ml-1 text-xs font-medium capitalize">
                                {objective.termType} terme
                            </Text>
                        </View>

                        {/* Échéance */}
                        <View className="flex-row items-center ml-3">
                            <Calendar size={14} color="#6B7280" />
                            <Text className="ml-1 text-xs text-gray-500">
                                {formatDate(objective.dueDate)}
                            </Text>
                        </View>
                    </View>

                    {/* Date de création */}
                    <Text className="text-xs text-gray-400">
                        {new Date(objective.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                        })}
                    </Text>
                </View>
            </View>
        </View>
    );
}; 