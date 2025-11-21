import { Location, PrayerSchedule, getCompletePrayerSchedule } from '../lib/astro';

/**
 * Service pour calculer les heures de prière musulmanes
 * Basé sur les formules éprouvées de prayTime.js
 */

export interface PrayerMethod {
    name: string;
    code: string;
    description: string;
}

export const PRAYER_METHODS: PrayerMethod[] = [
    {
        name: 'Muslim World League',
        code: 'MWL',
        description: 'Méthode recommandée par la Ligue Islamique Mondiale'
    },
    {
        name: 'Islamic Society of North America',
        code: 'ISNA',
        description: 'Méthode utilisée en Amérique du Nord'
    },
    {
        name: 'Egyptian General Authority',
        code: 'Egypt',
        description: 'Méthode de l\'Autorité Générale Égyptienne'
    },
    {
        name: 'Umm al-Qura University',
        code: 'Makkah',
        description: 'Méthode de l\'Université Umm al-Qura (Makkah)'
    },
    {
        name: 'University of Islamic Sciences',
        code: 'Karachi',
        description: 'Méthode de l\'Université des Sciences Islamiques (Karachi)'
    },
    {
        name: 'Institute of Geophysics',
        code: 'Tehran',
        description: 'Méthode de l\'Institut de Géophysique (Téhéran)'
    },
    {
        name: 'Shia Ithna Ashari',
        code: 'Jafari',
        description: 'Méthode Shia Ithna Ashari'
    }
];

/**
 * Calcule l'emploi du temps des prières pour une date et un lieu donnés
 */
export async function calculatePrayerTimes(
    date: Date,
    location: Location,
    method: string = 'MWL'
): Promise<PrayerSchedule> {
    try {
        // Utiliser les nouvelles fonctions basées sur prayTime.js
        return getCompletePrayerSchedule(date, location, method);
    } catch (error) {
        console.error('Erreur lors du calcul des heures de prière:', error);
        throw new Error('Impossible de calculer les heures de prière');
    }
}

/**
 * Calcule l'emploi du temps des prières pour une date et un lieu donnés (version synchrone)
 */
export function getPrayerSchedule(
    date: Date,
    location: Location,
    method: string = 'MWL'
): PrayerSchedule {
    try {
        // Utiliser les nouvelles fonctions basées sur prayTime.js
        return getCompletePrayerSchedule(date, location, method);
    } catch (error) {
        console.error('Erreur lors du calcul des heures de prière:', error);
        throw new Error('Impossible de calculer les heures de prière');
    }
}

/*
 * Obtient la méthode de calcul par défaut
 */
export function getDefaultMethod(): string {
    return 'MWL';
}

/**
 * Obtient la liste des méthodes disponibles
 */
export function getAvailableMethods(): PrayerMethod[] {
    return PRAYER_METHODS;
}

/**
 * Obtient une méthode par son code
 */
export function getMethodByCode(code: string): PrayerMethod | undefined {
    return PRAYER_METHODS.find(method => method.code === code);
}

/**
 * Vérifie si une méthode est valide
 */
export function isValidMethod(method: string): boolean {
    return PRAYER_METHODS.some(m => m.code === method);
}

/**
 * Détermine quelle prière est actuellement active
 */
export function getCurrentPrayer(schedule: PrayerSchedule): { name: string, time: Date } | null {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: 'fajr', time: schedule.fajr.time },
        { name: 'sunrise', time: schedule.sunrise.time },
        { name: 'dhuhr', time: schedule.dhuhr.time },
        { name: 'asr', time: schedule.asr.time },
        { name: 'maghrib', time: schedule.maghrib.time },
        { name: 'isha', time: schedule.isha.time }
    ];

    for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const prayerTime = prayer.time.getHours() * 60 + prayer.time.getMinutes();

        if (i === prayers.length - 1) {
            // Pour Isha, vérifier si on est entre Isha et Fajr du lendemain
            const nextFajr = new Date(schedule.fajr.time);
            nextFajr.setDate(nextFajr.getDate() + 1);
            const nextFajrTime = nextFajr.getHours() * 60 + nextFajr.getMinutes();

            if (currentTime >= prayerTime || currentTime < nextFajrTime) {
                return prayer;
            }
        } else {
            const nextPrayer = prayers[i + 1];
            const nextPrayerTime = nextPrayer.time.getHours() * 60 + nextPrayer.time.getMinutes();

            if (currentTime >= prayerTime && currentTime < nextPrayerTime) {
                return prayer;
            }
        }
    }

    return null;
}

/**
 * Détermine quelle sera la prochaine prière
 */
export function getNextPrayer(schedule: PrayerSchedule): { name: string, time: Date } | null {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
        { name: 'fajr', time: schedule.fajr.time },
        { name: 'sunrise', time: schedule.sunrise.time },
        { name: 'dhuhr', time: schedule.dhuhr.time },
        { name: 'asr', time: schedule.asr.time },
        { name: 'maghrib', time: schedule.maghrib.time },
        { name: 'isha', time: schedule.isha.time }
    ];

    for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const prayerTime = prayer.time.getHours() * 60 + prayer.time.getMinutes();

        if (currentTime < prayerTime) {
            return prayer;
        }
    }

    // Si on a passé toutes les prières du jour, la prochaine sera Fajr du lendemain
    return { name: 'fajr', time: schedule.fajr.time };
}

/**
 * Calcule le temps restant jusqu'à la prochaine prière
 */
export function getTimeUntilNextPrayer(schedule: PrayerSchedule): {
    prayer: string;
    timeRemaining: number;
} | null {
    const now = new Date();
    const currentTime = now.getTime();

    const prayers = [
        { name: 'fajr', time: schedule.fajr.time },
        { name: 'sunrise', time: schedule.sunrise.time },
        { name: 'dhuhr', time: schedule.dhuhr.time },
        { name: 'asr', time: schedule.asr.time },
        { name: 'maghrib', time: schedule.maghrib.time },
        { name: 'isha', time: schedule.isha.time }
    ];

    for (let i = 0; i < prayers.length; i++) {
        const prayer = prayers[i];
        const prayerTime = prayer.time.getTime();

        if (currentTime < prayerTime) {
            const timeRemaining = Math.max(0, prayerTime - currentTime);
            return {
                prayer: prayer.name,
                timeRemaining: Math.floor(timeRemaining) // Convertir en secondes
            };
        }
    }

    // Si on a passé toutes les prières du jour, calculer jusqu'à Fajr du lendemain
    const nextFajr = new Date(schedule.fajr.time);
    nextFajr.setDate(nextFajr.getDate() + 1);
    const timeRemaining = Math.max(0, nextFajr.getTime() - currentTime);

    return {
        prayer: 'fajr---',
        timeRemaining: Math.floor(timeRemaining) // Convertir en secondes
    };
} 