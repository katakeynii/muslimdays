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
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function SignInScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    const handleSignIn = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            await signIn(email.trim(), password);
            router.replace('/(tabs)');
        } catch (error: any) {
            Alert.alert('Erreur de connexion', error.message || 'Une erreur est survenue');
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
                            Connexion
                        </Text>
                        <Text className="text-gray-600">
                            Connectez-vous à votre compte MuslimDay
                        </Text>
                    </View>

                    {/* Formulaire */}
                    <View className="space-y-4">
                        {/* Email */}
                        <View>
                            <Text className="text-sm font-medium text-gray-700 mb-2">
                                Email
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
                                Mot de passe
                            </Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-300 rounded-lg px-4 py-3">
                                <Lock size={20} color="#6B7280" />
                                <TextInput
                                    className="flex-1 ml-3 text-gray-900"
                                    placeholder="••••••••"
                                    placeholderTextColor="#9CA3AF"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoComplete="password"
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

                        {/* Bouton de connexion */}
                        <TouchableOpacity
                            onPress={handleSignIn}
                            disabled={loading}
                            className={`bg-green-600 py-4 rounded-lg items-center justify-center mt-6 ${
                                loading ? 'opacity-50' : ''
                            }`}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-semibold text-lg">
                                    Se connecter
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Lien vers l'inscription */}
                        <View className="flex-row justify-center items-center mt-6">
                            <Text className="text-gray-600">
                                Pas encore de compte ?{' '}
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/sign-up')}
                                disabled={loading}
                            >
                                <Text className="text-green-600 font-semibold">
                                    S'inscrire
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

