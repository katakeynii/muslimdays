import { AlertCircle, Plus, Check, List } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { ObjectiveCard } from '../../../components/ObjectiveCard';
import { useMissions, useObjectives } from '../../../hooks';
import { ObjectiveTermType } from '../../../types';

export default function ObjectivesScreen() {
    const router = useRouter();
    const { objectives, loading, error, toggleObjectiveCompletion, deleteObjective, loadObjectives } = useObjectives();
    const { missions } = useMissions();

    // États pour les filtres
    const [selectedMissionId, setSelectedMissionId] = useState<string>('all');
    const [selectedTermType, setSelectedTermType] = useState<ObjectiveTermType | 'all'>('all');
    const [showCompleted, setShowCompleted] = useState(true);

    // Objectifs filtrés
    const filteredObjectives = useMemo(() => {
        let filtered = objectives;

        // Filtre par mission
        if (selectedMissionId !== 'all') {
            filtered = filtered.filter(obj => obj.missionId === selectedMissionId);
        }

        // Filtre par type de terme
        if (selectedTermType !== 'all') {
            filtered = filtered.filter(obj => obj.termType === selectedTermType);
        }

        // Filtre par statut de complétion
        if (!showCompleted) {
            filtered = filtered.filter(obj => !obj.isCompleted);
        }

        // Tri par date de création (plus récent en premier)
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [objectives, selectedMissionId, selectedTermType, showCompleted]);

    // Statistiques
    const stats = useMemo(() => {
        const total = objectives.length;
        const completed = objectives.filter(obj => obj.isCompleted).length;
        const pending = total - completed;
        const byTermType = {
            court: objectives.filter(obj => obj.termType === 'court').length,
            moyen: objectives.filter(obj => obj.termType === 'moyen').length,
            long: objectives.filter(obj => obj.termType === 'long').length,
        };

        return { total, completed, pending, byTermType };
    }, [objectives]);

    const handleToggleCompletion = async (id: string) => {
        await toggleObjectiveCompletion(id);
    };

    const handleDeleteObjective = async (id: string) => {
        const success = await deleteObjective(id);
        if (success) {
            Alert.alert('Succès', 'Objectif supprimé avec succès');
        }
    };

    const handleRefresh = () => {
        loadObjectives();
    };

    const getTermTypeColor = (termType: ObjectiveTermType) => {
        switch (termType) {
            case 'court': return 'bg-green-500';
            case 'moyen': return 'bg-yellow-500';
            case 'long': return 'bg-blue-500';
            default: return 'bg-gray-500';
        }
    };

    const getTermTypeLabel = (termType: ObjectiveTermType) => {
        switch (termType) {
            case 'court': return 'Court terme';
            case 'moyen': return 'Moyen terme';
            case 'long': return 'Long terme';
            default: return termType;
        }
    };

    if (error) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center p-6">
                <AlertCircle size={48} color="#EF4444" />
                <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                    Erreur de chargement
                </Text>
                <Text className="text-gray-600 text-center mb-4">
                    {error}
                </Text>
                <TouchableOpacity
                    onPress={handleRefresh}
                    className="bg-blue-500 px-6 py-3 rounded-lg"
                >
                    <Text className="text-white font-semibold">Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {/* En-tête */}
            <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-gray-900">
                        Mes Objectifs
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/objectives/create')}
                        className="bg-blue-500 p-3 rounded-full"
                    >
                        <Plus size={24} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Statistiques */}
                <View className="flex-row justify-between mb-4">
                    <View className="bg-blue-50 p-3 rounded-lg flex-1 mr-2">
                        <Text className="text-2xl font-bold text-blue-600">{stats.total}</Text>
                        <Text className="text-sm text-blue-600">Total</Text>
                    </View>
                    <View className="bg-green-50 p-3 rounded-lg flex-1 mr-2">
                        <Text className="text-2xl font-bold text-green-600">{stats.completed}</Text>
                        <Text className="text-sm text-green-600">Terminés</Text>
                    </View>
                    <View className="bg-yellow-50 p-3 rounded-lg flex-1">
                        <Text className="text-2xl font-bold text-yellow-600">{stats.pending}</Text>
                        <Text className="text-sm text-yellow-600">En cours</Text>
                    </View>
                </View>

                {/* Filtres */}
                <View className="mb-4">
                    {/* Filtre par mission */}
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Filtrer par mission</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                        <TouchableOpacity
                            onPress={() => setSelectedMissionId('all')}
                            className={`px-4 py-2 rounded-full mr-2 ${selectedMissionId === 'all'
                                    ? 'bg-blue-500'
                                    : 'bg-gray-200'
                                }`}
                        >
                            <Text className={`text-sm font-medium ${selectedMissionId === 'all' ? 'text-white' : 'text-gray-700'
                                }`}>
                                Toutes les missions
                            </Text>
                        </TouchableOpacity>
                        {missions.map(mission => (
                            <TouchableOpacity
                                key={mission.id}
                                onPress={() => setSelectedMissionId(mission.id)}
                                className={`px-4 py-2 rounded-full mr-2 ${selectedMissionId === mission.id
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                    }`}
                            >
                                <Text className={`text-sm font-medium ${selectedMissionId === mission.id ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {mission.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Filtre par type de terme */}
                    <Text className="text-sm font-semibold text-gray-700 mb-2">Filtrer par horizon</Text>
                    <View className="flex-row">
                        {(['all', 'court', 'moyen', 'long'] as const).map(termType => (
                            <TouchableOpacity
                                key={termType}
                                onPress={() => setSelectedTermType(termType)}
                                className={`flex-1 px-3 py-2 rounded-lg mr-2 ${selectedTermType === termType
                                        ? 'bg-blue-500'
                                        : 'bg-gray-200'
                                    }`}
                            >
                                <Text className={`text-sm font-medium text-center ${selectedTermType === termType ? 'text-white' : 'text-gray-700'
                                    }`}>
                                    {termType === 'all' ? 'Tous' : getTermTypeLabel(termType)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Toggle pour afficher/masquer les terminés */}
                    <TouchableOpacity
                        onPress={() => setShowCompleted(!showCompleted)}
                        className="flex-row items-center mt-3"
                    >
                        <View className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${showCompleted ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                            }`}>
                            {showCompleted && <Check size={12} color="white" />}
                        </View>
                        <Text className="text-sm text-gray-700">Afficher les objectifs terminés</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Liste des objectifs */}
            <ScrollView
                className="flex-1 px-6 pt-4"
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {filteredObjectives.length === 0 ? (
                    <View className="flex-1 justify-center items-center py-12">
                        <List size={64} color="#9CA3AF" />
                        <Text className="text-lg font-semibold text-gray-500 mt-4 mb-2">
                            Aucun objectif trouvé
                        </Text>
                        <Text className="text-gray-400 text-center mb-6">
                            {objectives.length === 0
                                ? 'Créez votre premier objectif pour commencer'
                                : 'Aucun objectif ne correspond aux filtres sélectionnés'
                            }
                        </Text>
                        {objectives.length === 0 && (
                            <TouchableOpacity
                                onPress={() => router.push('/objectives/create')}
                                className="bg-blue-500 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-semibold">Créer un objectif</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    filteredObjectives.map(objective => {
                        const mission = missions.find(m => m.id === objective.missionId);
                        return (
                            <ObjectiveCard
                                key={objective.id}
                                objective={objective}
                                missionTitle={mission?.title}
                                onToggleCompletion={handleToggleCompletion}
                                onDelete={handleDeleteObjective}
                                showMissionTitle={selectedMissionId === 'all'}
                            />
                        );
                    })
                )}
            </ScrollView>
        </View>
    );
} 