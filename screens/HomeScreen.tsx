import HeaderSection from 'components/HeaderSection';
import PrayerTimesBar from 'components/PrayerTimesBar';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    Text,
    View,
} from 'react-native';
import PrayerCard from '../components/PrayerCard';
import { PrayerSchedule, PrayerTime } from '../lib/astro';
import { getCurrentLocation, getGuediawayeLocation, LocationData } from '../services/locationService';
import { getCurrentPrayer, getNextPrayer, getPrayerSchedule } from '../services/prayerTimes';
import { StorageService } from '../services/storageService';

export default function HomeScreen() {
    const [location, setLocation] = useState<LocationData | null>(null);
    const [cityName, setCityName] = useState<string>('');
    const [schedule, setSchedule] = useState<PrayerSchedule | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string>('MWL');
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Chargement initial
    useEffect(() => {
        initializeApp();
    }, []);

    // Mise à jour du planning quand la méthode ou la localisation change
    useEffect(() => {
        if (location) {
            updatePrayerSchedule();
        }
    }, [location]);

    const initializeApp = async () => {
        try {
            setLoading(true);
            setError(null);

            // Charger les données sauvegardées
            const savedData = await StorageService.getAllData();
            setSelectedMethod(savedData.selectedMethod);
            setCityName(savedData.cityName || '');

            // Essayer de charger la position sauvegardée
            if (savedData.lastLocation) {
                setLocation(savedData.lastLocation);
            }

            // Récupérer la position actuelle
            await getCurrentLocationHandler();

        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            setError('Erreur lors du chargement de l\'application');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentLocationHandler = async () => {
        try {
            // Essayer d'obtenir la position actuelle
            const currentLocation = await getCurrentLocation();
            setLocation(currentLocation);

            // Sauvegarder la position
            await StorageService.saveLastLocation(currentLocation);
            console.log(currentLocation)
            // Définir le nom de la ville (pour l'instant, on utilise une approximation)
            const city = 'Votre position';
            setCityName(city);
            await StorageService.saveCityName(city);

        } catch (error) {
            console.error('Erreur lors de la récupération de la position:', error);

            // Fallback: utiliser Guédiawaye par défaut
            console.log('Utilisation de Guédiawaye comme position par défaut');
            const defaultLocation = getGuediawayeLocation();
            setLocation(defaultLocation);
            setCityName('Guédiawaye, Sénégal');

            await StorageService.saveLastLocation(defaultLocation);
            await StorageService.saveCityName('Guédiawaye, Sénégal');
        }
    };

    const updatePrayerSchedule = async () => {
        if (!location) return;

        try {
            const today = new Date();
            const prayerSchedule = getPrayerSchedule(today, location, selectedMethod);
            setSchedule(prayerSchedule);
            setError(null);
        } catch (error) {
            console.error('Erreur lors du calcul des heures de prière:', error);
            setError('Erreur lors du calcul des heures de prière');
        }
    };

    const handleMethodChange = async (method: string) => {
        setSelectedMethod(method);
        await StorageService.saveSelectedMethod(method);
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await getCurrentLocationHandler();
        } catch (error) {
            console.error('Erreur lors du rafraîchissement:', error);
        } finally {
            setRefreshing(false);
        }
    };

    const handlePrayerPress = (prayerName: string) => {
        if (!schedule) return;

        const prayer = schedule[prayerName as keyof PrayerSchedule];
        if (prayer && 'time' in prayer) {
            const timeStr = prayer.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            if ('start' in prayer && 'end' in prayer) {
                const startStr = prayer.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                const endStr = prayer.end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                Alert.alert(
                    prayerName.charAt(0).toUpperCase() + prayerName.slice(1),
                    `Heure de prière: ${timeStr}\nPlage: ${startStr} - ${endStr}`
                );
            } else {
                Alert.alert(
                    prayerName.charAt(0).toUpperCase() + prayerName.slice(1),
                    `Heure: ${timeStr}`
                );
            }
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <StatusBar style="auto" />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="text-gray-600 mt-4 text-lg">Chargement...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <StatusBar style="auto" />
                <View className="flex-1 justify-center items-center p-6">
                    <Text className="text-red-600 text-xl font-semibold mb-4 text-center">
                        Erreur
                    </Text>
                    <Text className="text-gray-600 text-center mb-6">
                        {error}
                    </Text>
                    <View className="bg-blue-500 px-6 py-3 rounded-xl">
                        <Text className="text-white font-semibold" onPress={initializeApp}>
                            Réessayer
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    if (!schedule) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <StatusBar style="auto" />
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-600 text-lg">Aucune donnée disponible</Text>
                </View>
            </SafeAreaView>
        );
    }

    const currentPrayer = getCurrentPrayer(schedule);
    const nextPrayer = getNextPrayer(schedule);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar style="auto" />

            <ScrollView
                className="flex-1 px-6"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                }
            >
                <HeaderSection schedule={schedule} />
                <View className="">
                    <PrayerTimesBar schedule={schedule} />
                </View>
                {/* En-tête avec la ville */}
                {/* <View className="pt-4 pb-2 bg-red-400">
                    <Text className="text-2xl font-bold text-gray-800 text-center">
                        Heures de Prière
                    </Text>
                    {cityName && (
                        <Text className="text-gray-600 text-center mt-1">
                            📍 {cityName}
                        </Text>
                    )}
                </View> */}

                {/* Affichage de l'heure actuelle et prochaine prière */}
                {/* <CurrentTimeDisplay schedule={schedule} /> */}

                {/* Sélecteur de méthode */}
                {/* <MethodSelector
                    selectedMethod={selectedMethod}
                    onMethodChange={handleMethodChange}
                /> */}

                {/* Liste des prières */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                        Horaires du jour
                    </Text>
                    <View className='flex '>

                        <PrayerCard
                            name="fajr"
                            prayerTime={schedule.fajr}
                            isActive={currentPrayer?.name === 'fajr'}
                            isNext={nextPrayer?.name === 'fajr'}
                            onPress={() => handlePrayerPress('fajr')}
                        />

                        <PrayerCard
                            name="sunrise"
                            prayerTime={{
                                start: schedule.sunrise.time,
                                time: schedule.sunrise.time,
                                end: schedule.sunrise.time
                            } as PrayerTime}
                            isActive={false}
                            isNext={false}
                            onPress={() => handlePrayerPress('sunrise')}
                        />

                        <PrayerCard
                            name="dhuhr"
                            prayerTime={schedule.dhuhr}
                            isActive={currentPrayer?.name === 'dhuhr'}
                            isNext={nextPrayer?.name === 'dhuhr'}
                            onPress={() => handlePrayerPress('dhuhr')}
                        />

                        <PrayerCard
                            name="asr"
                            prayerTime={schedule.asr}
                            isActive={currentPrayer?.name === 'asr'}
                            isNext={nextPrayer?.name === 'asr'}
                            onPress={() => handlePrayerPress('asr')}
                        />

                        <PrayerCard
                            name="maghrib"
                            prayerTime={schedule.maghrib}
                            isActive={currentPrayer?.name === 'maghrib'}
                            isNext={nextPrayer?.name === 'maghrib'}
                            onPress={() => handlePrayerPress('maghrib')}
                        />

                        <PrayerCard
                            name="isha"
                            prayerTime={schedule.isha}
                            isActive={currentPrayer?.name === 'isha'}
                            isNext={nextPrayer?.name === 'isha'}
                            onPress={() => handlePrayerPress('isha')}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
} 