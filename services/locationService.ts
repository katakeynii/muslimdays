import * as Location from 'expo-location';

export interface LocationData {
    latitude: number;
    longitude: number;
    timezone?: number;
}

/**
 * Obtient la localisation actuelle de l'utilisateur
 */
export async function getCurrentLocation(): Promise<LocationData> {
    try {
        // Demander les permissions
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Permission de localisation refusée');
        }

        // Obtenir la position actuelle
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
        });

        // Obtenir le fuseau horaire
        const timezone = await getTimezoneFromCoordinates(
            location.coords.latitude,
            location.coords.longitude
        );

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timezone
        };
    } catch (error) {
        console.error('Erreur lors de l\'obtention de la localisation:', error);
        throw error;
    }
}

/**
 * Obtient le fuseau horaire à partir des coordonnées
 * Utilise une API gratuite pour obtenir le fuseau horaire
 */
async function getTimezoneFromCoordinates(latitude: number, longitude: number): Promise<number> {
    try {
        const response = await fetch(
            `https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${latitude}&lng=${longitude}`
        );

        if (!response.ok) {
            // Fallback: utiliser un fuseau horaire par défaut basé sur la longitude
            return Math.round(longitude / 15);
        }

        const data = await response.json();
        return data.gmtOffset / 3600; // Convertir en heures
    } catch (error) {
        console.warn('Impossible d\'obtenir le fuseau horaire, utilisation du calcul par longitude');
        // Fallback: calcul approximatif basé sur la longitude
        return Math.round(longitude / 15);
    }
}

/**
 * Coordonnées prédéfinies pour Guédiawaye, Sénégal
 */
export function getGuediawayeLocation(): LocationData {
    return {
        latitude: 14.7761,
        longitude: -17.3666,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Dakar, Sénégal
 */
export function getDakarLocation(): LocationData {
    return {
        latitude: 14.7167,
        longitude: -17.4677,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Saint-Louis, Sénégal
 */
export function getSaintLouisLocation(): LocationData {
    return {
        latitude: 16.0333,
        longitude: -16.5000,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Thiès, Sénégal
 */
export function getThiesLocation(): LocationData {
    return {
        latitude: 14.7833,
        longitude: -16.9333,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Kaolack, Sénégal
 */
export function getKaolackLocation(): LocationData {
    return {
        latitude: 14.1500,
        longitude: -16.0833,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Ziguinchor, Sénégal
 */
export function getZiguinchorLocation(): LocationData {
    return {
        latitude: 12.5833,
        longitude: -16.2667,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Touba, Sénégal
 */
export function getToubaLocation(): LocationData {
    return {
        latitude: 14.8667,
        longitude: -15.8833,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Mbour, Sénégal
 */
export function getMbourLocation(): LocationData {
    return {
        latitude: 14.4167,
        longitude: -16.9667,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Rufisque, Sénégal
 */
export function getRufisqueLocation(): LocationData {
    return {
        latitude: 14.7167,
        longitude: -17.2667,
        timezone: 0 // UTC pour le Sénégal
    };
}

/**
 * Coordonnées prédéfinies pour Diourbel, Sénégal
 */
export function getDiourbelLocation(): LocationData {
    return {
        latitude: 14.6500,
        longitude: -16.2333,
        timezone: 0 // UTC pour le Sénégal
    };
} 