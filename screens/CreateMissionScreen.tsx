import { X, Lightbulb } from 'lucide-react-native';
import React, { useState } from 'react';
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
import { useMissions } from '../hooks/useMissions';

interface CreateMissionScreenProps {
    navigation: any;
}

export const CreateMissionScreen: React.FC<CreateMissionScreenProps> = ({ navigation }) => {
    const { createMission } = useMissions();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [vision, setVision] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Erreur', 'Le titre est obligatoire');
            return;
        }

        setIsSubmitting(true);
        try {
            const newMission = await createMission({
                title: title.trim(),
                description: description.trim() || undefined,
                vision: vision.trim() || undefined,
            });

            if (newMission) {
                Alert.alert(
                    'Succès',
                    'Mission créée avec succès !',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            }
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de créer la mission');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (title.trim() || description.trim() || vision.trim()) {
            Alert.alert(
                'Annuler',
                'Voulez-vous vraiment annuler ? Vos modifications seront perdues.',
                [
                    { text: 'Continuer l\'édition', style: 'cancel' },
                    {
                        text: 'Annuler',
                        style: 'destructive',
                        onPress: () => navigation.goBack()
                    },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    const isFormValid = title.trim().length > 0;

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-gray-50"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/* Header */}
            <View className="bg-white px-4 py-6 border-b border-gray-200">
                <View className="flex-row justify-between items-center">
                    <TouchableOpacity onPress={handleCancel}>
                        <X size={24} color="#6b7280" />
                    </TouchableOpacity>

                    <Text className="text-lg font-semibold text-gray-900">
                        Nouvelle Mission
                    </Text>

                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                        className={`px-4 py-2 rounded-lg ${isFormValid && !isSubmitting
                            ? 'bg-blue-500'
                            : 'bg-gray-300'
                            }`}
                    >
                        <Text className={`font-medium ${isFormValid && !isSubmitting
                            ? 'text-white'
                            : 'text-gray-500'
                            }`}>
                            {isSubmitting ? 'Création...' : 'Créer'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Formulaire */}
            <ScrollView className="flex-1 px-4 pt-6">
                {/* Titre */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Titre de la mission *
                    </Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="Ex: Devenir un expert en développement mobile"
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                        style={{ fontSize: 16 }}
                        maxLength={100}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                        {title.length}/100 caractères
                    </Text>
                </View>

                {/* Description */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Description (optionnelle)
                    </Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Décrivez votre mission, vos motivations, le contexte..."
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                        style={{ fontSize: 16 }}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={500}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                        {description.length}/500 caractères
                    </Text>
                </View>

                {/* Vision de réussite */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                        Vision de réussite (optionnelle)
                    </Text>
                    <TextInput
                        value={vision}
                        onChangeText={setVision}
                        placeholder="Comment imaginez-vous votre réussite ? Que voulez-vous accomplir ?"
                        className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                        style={{ fontSize: 16 }}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        maxLength={300}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                        {vision.length}/300 caractères
                    </Text>
                </View>

                {/* Conseils */}
                <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <View className="flex-row items-start">
                        <Lightbulb size={20} color="#3b82f6" />
                        <View className="ml-3 flex-1">
                            <Text className="text-sm font-medium text-blue-800 mb-1">
                                Conseils pour une bonne mission
                            </Text>
                            <Text className="text-sm text-blue-700">
                                • Soyez spécifique et mesurable{'\n'}
                                • Alignez avec vos valeurs profondes{'\n'}
                                • Pensez à long terme (5-10 ans){'\n'}
                                • Restez motivant et inspirant
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}; 