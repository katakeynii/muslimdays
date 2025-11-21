import { X, Zap, Clock, Calendar as CalendarIcon, Circle } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useMissions, useObjectives } from '../../../hooks';
import { CreateObjectiveData, ObjectiveTermType } from '../../../types';

export default function CreateObjectiveScreen() {
    const router = useRouter();
    const { missionId } = useLocalSearchParams<{ missionId?: string }>();
    const { createObjective } = useObjectives();
    const { missions } = useMissions();

    // États du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedMissionId, setSelectedMissionId] = useState(missionId || '');
    const [termType, setTermType] = useState<ObjectiveTermType>('court');
    const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
    const [successCriteria, setSuccessCriteria] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validation
    const isValid = title.trim().length > 0 && selectedMissionId;

    const handleSubmit = async () => {
        if (!isValid) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        try {
            const objectiveData: CreateObjectiveData = {
                missionId: selectedMissionId,
                title: title.trim(),
                description: description.trim() || undefined,
                termType,
                dueDate,
                successCriteria: successCriteria.trim() || undefined,
            };

            const newObjective = await createObjective(objectiveData);
            if (newObjective) {
                Alert.alert(
                    'Succès',
                    'Objectif créé avec succès',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de créer l\'objectif');
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
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                    <Text className="text-lg font-semibold text-gray-900">
                        Nouvel Objectif
                    </Text>
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!isValid || loading}
                        className={`px-4 py-2 rounded-lg ${isValid && !loading ? 'bg-blue-500' : 'bg-gray-300'
                            }`}
                    >
                        <Text className={`font-semibold ${isValid && !loading ? 'text-white' : 'text-gray-500'
                            }`}>
                            {loading ? 'Création...' : 'Créer'}
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
                        Titre de l'objectif *
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

                {/* Informations sur les types de terme */}
                <View className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <Text className="text-sm font-semibold text-blue-800 mb-2">
                        Guide des horizons temporels
                    </Text>
                    <View className="space-y-2">
                        <View className="flex-row items-center">
                            <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                            <Text className="text-sm text-blue-700">
                                <Text className="font-semibold">Court terme :</Text> Objectifs à réaliser dans les 3 prochains mois
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-3 h-3 bg-yellow-500 rounded-full mr-2" />
                            <Text className="text-sm text-blue-700">
                                <Text className="font-semibold">Moyen terme :</Text> Objectifs à réaliser dans les 6-12 prochains mois
                            </Text>
                        </View>
                        <View className="flex-row items-center">
                            <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                            <Text className="text-sm text-blue-700">
                                <Text className="font-semibold">Long terme :</Text> Objectifs à réaliser dans les 1-3 prochaines années
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Note sur l&apos;activation */}
                <View className="mb-6 bg-yellow-50 p-4 rounded-lg">
                    <Text className="text-sm font-semibold text-yellow-800 mb-2">
                        Note importante
                    </Text>
                    <Text className="text-sm text-yellow-700">
                        Cet objectif sera désactivé par défaut. Vous pourrez l&apos;activer plus tard une fois que vous aurez défini les actions nécessaires et les critères de réussite.
                    </Text>
                </View>
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