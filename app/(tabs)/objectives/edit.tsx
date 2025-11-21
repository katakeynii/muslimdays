import { ArrowLeft, X, Zap, Clock, Calendar as CalendarIcon, Circle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useActions, useMissions, useObjectives } from '../../../hooks';
import { ObjectiveTermType, UpdateObjectiveData } from '../../../types';

export default function EditObjectiveScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { updateObjective, getObjectiveById } = useObjectives();
    const { missions } = useMissions();
    const { getActionsByObjectiveId } = useActions();

    // États du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMissionId, setSelectedMissionId] = useState('');
    const [termType, setTermType] = useState<ObjectiveTermType>('court');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [successCriteria, setSuccessCriteria] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [objective, setObjective] = useState<any>(null);

    // Charger l'objectif au montage
    useEffect(() => {
        if (id) {
            const currentObjective = getObjectiveById(id);
            if (currentObjective) {
                setObjective(currentObjective);
                setTitle(currentObjective.title);
                setDescription(currentObjective.description || '');
                setSelectedMissionId(currentObjective.missionId);
                setTermType(currentObjective.termType);
                setDueDate(currentObjective.dueDate);
                setSuccessCriteria(currentObjective.successCriteria || '');
                setIsActive(currentObjective.isActive);
            }
        }
    }, [id, getObjectiveById]);

    // Validation
    const isValid = title.trim().length > 0 && selectedMissionId;

    const handleSubmit = async () => {
        if (!isValid) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        try {
            const updateData: UpdateObjectiveData = {
                title: title.trim(),
                description: description.trim() || undefined,
                termType,
                dueDate,
                successCriteria: successCriteria.trim() || undefined,
                isActive,
            };

            const updatedObjective = await updateObjective(id, updateData);
            if (updatedObjective) {
                Alert.alert(
                    'Succès',
                    'Objectif mis à jour avec succès',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de mettre à jour l\'objectif');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
        }
    };

    const clearDueDate = () => {
        setDueDate(undefined);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const getTermTypeLabel = (type: ObjectiveTermType) => {
        switch (type) {
            case 'court': return 'Court terme';
            case 'moyen': return 'Moyen terme';
            case 'long': return 'Long terme';
            default: return type;
        }
    };

    const getTermTypeIcon = (type: ObjectiveTermType) => {
        switch (type) {
            case 'court': return Zap;
            case 'moyen': return Clock;
            case 'long': return CalendarIcon;
            default: return Circle;
        }
    };

    const linkedActions = getActionsByObjectiveId(id);

    if (!objective) {
        return (
            <View className="flex-1 bg-gray-50 items-center justify-center">
                <Text className="text-gray-500">Chargement...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* En-tête */}
            <View className="bg-white px-6 pt-12 pb-4 border-b border-gray-200">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="p-2 -ml-2"
                    >
                        <ArrowLeft size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-gray-900">
                        Modifier l&apos;objectif
                    </Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!isValid || loading}
                        className={`px-4 py-2 rounded-lg ${isValid && !loading ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                    >
                        <Text className={`font-semibold ${isValid && !loading ? 'text-white' : 'text-gray-500'
                            }`}>
                            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                {/* Mission associée */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Mission associée *
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {missions.map(mission => (
                            <TouchableOpacity
                                key={mission.id}
                                onPress={() => setSelectedMissionId(mission.id)}
                                className={`px-4 py-3 rounded-lg mr-3 border-2 ${selectedMissionId === mission.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <Text className={`font-medium ${selectedMissionId === mission.id
                                    ? 'text-blue-700'
                                    : 'text-gray-700'
                                    }`}>
                                    {mission.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Titre */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Titre de l&apos;objectif *
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Apprendre une nouvelle compétence"
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                        maxLength={100}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                        {title.length}/100 caractères
                    </Text>
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Description (optionnel)
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Décrivez votre objectif en détail..."
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={500}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                        {description.length}/500 caractères
                    </Text>
                </View>

                {/* Type de terme */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Horizon temporel
                    </Text>
                    <View className="flex-row">
                        {(['court', 'moyen', 'long'] as const).map(type => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setTermType(type)}
                                className={`flex-1 flex-row items-center justify-center px-4 py-3 rounded-lg mr-2 border-2 ${termType === type
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                {(() => {
                                    const IconComponent = getTermTypeIcon(type);
                                    return (
                                        <IconComponent
                                            size={16}
                                            color={termType === type ? '#3B82F6' : '#6B7280'}
                                        />
                                    );
                                })()}
                                <Text className={`ml-2 font-medium ${termType === type ? 'text-blue-700' : 'text-gray-700'
                                    }`}>
                                    {getTermTypeLabel(type)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Échéance */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Échéance (optionnel)
                    </Text>
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 mr-3"
                        >
                            <Text className={dueDate ? 'text-gray-900' : 'text-gray-500'}>
                                {dueDate ? formatDate(dueDate) : 'Sélectionner une date'}
                            </Text>
                        </TouchableOpacity>
                        {dueDate && (
                            <TouchableOpacity
                                onPress={clearDueDate}
                                className="p-3 bg-red-50 rounded-lg"
                            >
                                <X size={20} color="#EF4444" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Critères de réussite */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Critères de réussite (optionnel)
                    </Text>
                    <TextInput
                        value={successCriteria}
                        onChangeText={setSuccessCriteria}
                        placeholder="Comment saurez-vous que vous avez réussi cet objectif ?"
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        maxLength={300}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                        {successCriteria.length}/300 caractères
                    </Text>
                </View>

                {/* Actions liées */}
                <View className="mb-6">
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-sm font-semibold text-gray-700">
                            Actions liées
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push(`/actions/create?objectiveId=${id}`)}
                            className="bg-blue-500 px-3 py-1 rounded-lg"
                        >
                            <Text className="text-white text-sm font-medium">
                                Ajouter
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {linkedActions.length === 0 ? (
                        <View className="bg-gray-50 p-4 rounded-lg">
                            <Text className="text-sm text-gray-500 text-center">
                                Aucune action liée à cet objectif
                            </Text>
                        </View>
                    ) : (
                        <View className="bg-white border border-gray-200 rounded-lg p-4">
                            <Text className="text-sm text-gray-600">
                                {linkedActions.length} action{linkedActions.length > 1 ? 's' : ''} liée{linkedActions.length > 1 ? 's' : ''}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Activation de l&apos;objectif */}
                <View className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
                    <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-gray-700 mb-1">
                                Activer l&apos;objectif
                            </Text>
                            <Text className="text-xs text-gray-500">
                                Un objectif actif peut être suivi et mesuré
                            </Text>
                        </View>
                        <Switch
                            value={isActive}
                            onValueChange={setIsActive}
                            trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                            thumbColor={isActive ? '#FFFFFF' : '#FFFFFF'}
                        />
                    </View>
                </View>

                {/* Note sur l&apos;activation */}
                {!isActive && (
                    <View className="mb-6 bg-yellow-50 p-4 rounded-lg">
                        <Text className="text-sm font-semibold text-yellow-800 mb-2">
                            Objectif désactivé
                        </Text>
                        <Text className="text-sm text-yellow-700">
                            Cet objectif est actuellement désactivé. Activez-le pour commencer à le suivre et à mesurer vos progrès.
                        </Text>
                    </View>
                )}

                {isActive && (
                    <View className="mb-6 bg-green-50 p-4 rounded-lg">
                        <Text className="text-sm font-semibold text-green-800 mb-2">
                            Objectif actif
                        </Text>
                        <Text className="text-sm text-green-700">
                            Cet objectif est actif et peut être suivi. Vous pouvez créer des actions pour le mesurer et le réaliser.
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={dueDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}
        </KeyboardAvoidingView>
    );
} 