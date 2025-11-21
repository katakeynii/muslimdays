import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_METHOD } from '../constants/methods';
import { Location } from '../lib/astro';

/**
 * Service de stockage local pour les préférences utilisateur
 */
export class StorageService {
    private static readonly KEYS = {
        SELECTED_METHOD: 'selected_method',
        LAST_LOCATION: 'last_location',
        CITY_NAME: 'city_name',
        FIRST_LAUNCH: 'first_launch',
    };

    /**
     * Sauvegarde la méthode de calcul sélectionnée
     */
    static async saveSelectedMethod(method: string): Promise<void> {
        try {
            await AsyncStorage.setItem(this.KEYS.SELECTED_METHOD, method);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la méthode:', error);
        }
    }

    /**
     * Récupère la méthode de calcul sauvegardée
     */
    static async getSelectedMethod(): Promise<string> {
        try {
            const method = await AsyncStorage.getItem(this.KEYS.SELECTED_METHOD);
            return method || DEFAULT_METHOD;
        } catch (error) {
            console.error('Erreur lors de la récupération de la méthode:', error);
            return DEFAULT_METHOD;
        }
    }

    /**
     * Sauvegarde la dernière position connue
     */
    static async saveLastLocation(location: Location): Promise<void> {
        try {
            const locationString = JSON.stringify(location);
            await AsyncStorage.setItem(this.KEYS.LAST_LOCATION, locationString);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la position:', error);
        }
    }

    /**
     * Récupère la dernière position sauvegardée
     */
    static async getLastLocation(): Promise<Location | null> {
        try {
            const locationString = await AsyncStorage.getItem(this.KEYS.LAST_LOCATION);
            if (locationString) {
                return JSON.parse(locationString) as Location;
            }
            return null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la position:', error);
            return null;
        }
    }

    /**
     * Sauvegarde le nom de la ville
     */
    static async saveCityName(cityName: string): Promise<void> {
        try {
            await AsyncStorage.setItem(this.KEYS.CITY_NAME, cityName);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du nom de ville:', error);
        }
    }

    /**
     * Récupère le nom de la ville sauvegardé
     */
    static async getCityName(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(this.KEYS.CITY_NAME);
        } catch (error) {
            console.error('Erreur lors de la récupération du nom de ville:', error);
            return null;
        }
    }

    /**
     * Marque l'application comme ayant été lancée pour la première fois
     */
    static async setFirstLaunch(): Promise<void> {
        try {
            await AsyncStorage.setItem(this.KEYS.FIRST_LAUNCH, 'false');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du statut de premier lancement:', error);
        }
    }

    /**
     * Vérifie si c'est le premier lancement de l'application
     */
    static async isFirstLaunch(): Promise<boolean> {
        try {
            const firstLaunch = await AsyncStorage.getItem(this.KEYS.FIRST_LAUNCH);
            return firstLaunch === null;
        } catch (error) {
            console.error('Erreur lors de la vérification du premier lancement:', error);
            return true;
        }
    }

    /**
     * Efface toutes les données sauvegardées
     */
    static async clearAllData(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([
                this.KEYS.SELECTED_METHOD,
                this.KEYS.LAST_LOCATION,
                this.KEYS.CITY_NAME,
                this.KEYS.FIRST_LAUNCH,
            ]);
        } catch (error) {
            console.error('Erreur lors de l\'effacement des données:', error);
        }
    }

    /**
     * Récupère toutes les données sauvegardées
     */
    static async getAllData(): Promise<{
        selectedMethod: string;
        lastLocation: Location | null;
        cityName: string | null;
        isFirstLaunch: boolean;
    }> {
        try {
            const [selectedMethod, lastLocationString, cityName, firstLaunch] = await AsyncStorage.multiGet([
                this.KEYS.SELECTED_METHOD,
                this.KEYS.LAST_LOCATION,
                this.KEYS.CITY_NAME,
                this.KEYS.FIRST_LAUNCH,
            ]);

            return {
                selectedMethod: selectedMethod[1] || DEFAULT_METHOD,
                lastLocation: lastLocationString[1] ? JSON.parse(lastLocationString[1]) : null,
                cityName: cityName[1],
                isFirstLaunch: firstLaunch[1] === null,
            };
        } catch (error) {
            console.error('Erreur lors de la récupération de toutes les données:', error);
            return {
                selectedMethod: DEFAULT_METHOD,
                lastLocation: null,
                cityName: null,
                isFirstLaunch: true,
            };
        }
    }
} 