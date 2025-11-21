import { X, Circle, Repeat, Calendar as CalendarIcon } from 'lucide-react-native';
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
import { useActions, useObjectives } from '../../../hooks';
import { CreateActionData, RecurrenceType } from '../../../types';

export default function CreateActionScreen() {
    const router = useRouter();
    const { objectiveId } = useLocalSearchParams<{ objectiveId?: string }>();
    const { createAction } = useActions();
    const { objectives } = useObjectives();

    // États du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedObjectiveId, setSelectedObjectiveId] = useState(objectiveId || '');
    const [datetime, setDatetime] = useState(new Date());
    const [duration, setDuration] = useState(60); // 1 heure par défaut
    const [recurrence, setRecurrence] = useState<RecurrenceType>('none');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [loading, setLoading] = useState(false);

    // Validation
    const isValid = title.trim().length > 0;

    const handleSubmit = async () => {
        if (!isValid) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        setLoading(true);
        try {
            const actionData: CreateActionData = {
                title: title.trim(),
                description: description.trim() || undefined,
                datetime,
                duration,
                recurrence,
                linkedObjectiveId: selectedObjectiveId || undefined,
            };

            const newAction = await createAction(actionData);
            if (newAction) {
                Alert.alert(
                    'Succès',
                    'Action créée avec succès',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de créer l\'action');
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDatetime(selectedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDatetime = new Date(datetime);
            newDatetime.setHours(selectedTime.getHours());
            newDatetime.setMinutes(selectedTime.getMinutes());
            setDatetime(newDatetime);
        }
    };

    const formatDateTime = (date: Date) => {
        return date.toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRecurrenceLabel = (type: RecurrenceType) => {
        switch (type) {
            case 'none': return 'Une fois';
            case 'daily': return 'Quotidien';
            case 'weekly': return 'Hebdomadaire';
            case 'monthly': return 'Mensuel';
            case 'yearly': return 'Annuel';
            default: return type;
        }
    };

    const getRecurrenceIcon = (type: RecurrenceType) => {
        switch (type) {
            case 'none': return Circle;
            case 'daily': return Repeat;
            case 'weekly': return CalendarIcon;
            case 'monthly': return CalendarIcon;
            case 'yearly': return CalendarIcon;
            default: return Circle;
        }
    };

    const durationOptions = [15, 30, 45, 60, 90, 120, 180, 240];

    const formatDuration = (minutes: number) => {
        if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        if (remainingMinutes === 0) {
            return `${hours}h`;
        }
        return `${hours}h${remainingMinutes}min`;
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
                        Nouvelle Action
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
                {/* Titre */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Titre de l'action *
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Réunion équipe, Ménage, Étude..."
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
                        placeholder="Décrivez votre action en détail..."
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

                {/* Objectif associé (optionnel) */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Objectif associé (optionnel)
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            onPress={() => setSelectedObjectiveId('')}
                            className={`px-4 py-3 rounded-lg mr-3 border-2 ${!selectedObjectiveId
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 bg-white'
                                }`}
                        >
                            <Text className={`font-medium ${!selectedObjectiveId
                                ? 'text-blue-700'
                                : 'text-gray-700'
                                }`}>
                                Aucun objectif
                            </Text>
                        </TouchableOpacity>
                        {objectives.map(objective => (
                            <TouchableOpacity
                                key={objective.id}
                                onPress={() => setSelectedObjectiveId(objective.id)}
                                className={`px-4 py-3 rounded-lg mr-3 border-2 ${selectedObjectiveId === objective.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <Text className={`font-medium ${selectedObjectiveId === objective.id
                                    ? 'text-blue-700'
                                    : 'text-gray-700'
                                    }`}>
                                    {objective.title}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Date et heure */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Date et heure *
                    </Text>
                    <View className="flex-row space-x-3">
                        <TouchableOpacity
                            onPress={() => setShowDatePicker(true)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <Text className="text-gray-900">
                                {datetime.toLocaleDateString('fr-FR')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setShowTimePicker(true)}
                            className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3"
                        >
                            <Text className="text-gray-900">
                                {datetime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Durée */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Durée
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {durationOptions.map(durationOption => (
                            <TouchableOpacity
                                key={durationOption}
                                onPress={() => setDuration(durationOption)}
                                className={`px-4 py-3 rounded-lg mr-3 border-2 ${duration === durationOption
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                <Text className={`font-medium ${duration === durationOption
                                    ? 'text-blue-700'
                                    : 'text-gray-700'
                                    }`}>
                                    {formatDuration(durationOption)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Récurrence */}
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Récurrence
                    </Text>
                    <View className="flex-row flex-wrap">
                        {(['none', 'daily', 'weekly', 'monthly', 'yearly'] as RecurrenceType[]).map(type => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => setRecurrence(type)}
                                className={`flex-row items-center px-4 py-3 rounded-lg mr-3 mb-3 border-2 ${recurrence === type
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 bg-white'
                                    }`}
                            >
                                {(() => {
                                    const IconComponent = getRecurrenceIcon(type);
                                    return (
                                        <IconComponent
                                            size={16}
                                            color={recurrence === type ? '#3B82F6' : '#6B7280'}
                                        />
                                    );
                                })()}
                                <Text className={`ml-2 font-medium ${recurrence === type ? 'text-blue-700' : 'text-gray-700'
                                    }`}>
                                    {getRecurrenceLabel(type)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Résumé */}
                <View className="mb-6 bg-blue-50 p-4 rounded-lg">
                    <Text className="text-sm font-semibold text-blue-800 mb-2">
                        Résumé de votre action
                    </Text>
                    <Text className="text-sm text-blue-700">
                        <Text className="font-semibold">{title || 'Titre'}</Text>
                        {description && ` - ${description}`}
                    </Text>
                    <Text className="text-sm text-blue-700 mt-1">
                        {formatDateTime(datetime)} • {formatDuration(duration)}
                    </Text>
                    {recurrence !== 'none' && (
                        <Text className="text-sm text-blue-700 mt-1">
                            Récurrence : {getRecurrenceLabel(recurrence)}
                        </Text>
                    )}
                    {selectedObjectiveId && (
                        <Text className="text-sm text-blue-700 mt-1">
                            Lié à l'objectif : {objectives.find(o => o.id === selectedObjectiveId)?.title}
                        </Text>
                    )}
                </View>
            </ScrollView>

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={datetime}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {/* Time Picker */}
            {showTimePicker && (
                <DateTimePicker
                    value={datetime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                />
            )}
        </KeyboardAvoidingView>
    );
} 