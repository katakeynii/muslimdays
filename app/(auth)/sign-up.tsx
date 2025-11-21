import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react-native';

export default function SignUpScreen() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const validatePassword = (pwd: string): string | null => {
        if (pwd.length < 6) {
            return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        return null;
    };

    const handleSignUp = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            Alert.alert('Erreur', passwordError);
            return;
        }

        setLoading(true);
        try {
            await signUp(email.trim(), password, fullName.trim() || undefined);
            Alert.alert(
                'Inscription réussie',
                'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(auth)/sign-in'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert('Erreur d\'inscription', error.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-6 py-12">
                    {/* En-tête */}
                    <View className="mb-8">
                        <Text className="text-3xl font-bold text-gray-900 mb-2">
                            Créer un compte
                        </Text>
                        <Text className="text-gray-600">
                            Rejoignez MuslimDay pour gérer vos missions et objectifs
                        </Text>
                    </View>

                    {/* Formulaire */}
                    <View className="space-y-4">
                        {/* Nom complet */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Nom complet (optionnel)
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                <User size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900"
                                    placeholder="Votre nom"
                                    placeholderTextColor="#9CA3AF"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Email *
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                <Mail size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900"
                                    placeholder="votre@email.com"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoComplete="email"
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Mot de passe */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Mot de passe *
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                <Lock size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900"
                                    placeholder="Au moins 6 caractères"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoComplete="password-new"
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="ml-2"
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} color="#6B7280" />
                                    ) : (
                                        <Eye size={20} color="#6B7280" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirmation mot de passe */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Confirmer le mot de passe *
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                <Lock size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900"
                                    placeholder="Répétez le mot de passe"
                                    placeholderTextColor="#9CA3AF"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoComplete="password-new"
                                    editable={!loading}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="ml-2"
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} color="#6B7280" />
                                    ) : (
                                        <Eye size={20} color="#6B7280" />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Bouton d'inscription */}
                        <TouchableOpacity
                            onPress={handleSignUp}
                            disabled={loading}
                            className={`bg-green-600 py-4 rounded-lg items-center justify-center mt-6 ${
                                loading ? 'opacity-50' : ''
                            }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold text-lg">
                                    S'inscrire
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Lien vers la connexion */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-gray-600">
                                Déjà un compte ?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/sign-in')}
                                disabled={loading}
                            >
                                <Text className="text-green-600 font-semibold">
                                    Se connecter
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

