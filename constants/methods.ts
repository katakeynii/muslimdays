export interface PrayerMethod {
    name: string;
    fajrAngle: number;
    ishaAngle?: number;
    ishaInterval?: number; // minutes after Maghrib
    maghribAngle: number;
    sunriseAngle: number;
    asrShadowFactor: number;
}

export const METHODS: Record<string, PrayerMethod> = {
    MWL: {
        name: 'Muslim World League',
        fajrAngle: 18,
        ishaAngle: 17,
        maghribAngle: 0.833,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    ISNA: {
        name: 'Islamic Society of North America',
        fajrAngle: 15,
        ishaAngle: 15,
        maghribAngle: 0.833,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    UMM_AL_QURA: {
        name: 'Umm al-Qura University, Makkah',
        fajrAngle: 18.5,
        ishaInterval: 90, // minutes after Maghrib
        maghribAngle: 0.833,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    EGYPT: {
        name: 'Egyptian General Authority',
        fajrAngle: 19.5,
        ishaAngle: 17.5,
        maghribAngle: 0.833,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    MAKKAH: {
        name: 'Umm al-Qura University, Makkah (New)',
        fajrAngle: 18.5,
        ishaInterval: 120, // minutes after Maghrib
        maghribAngle: 0.833,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    KARACHI: {
        name: 'University Of Islamic Sciences, Karachi',
        fajrAngle: 18,
        ishaAngle: 18,
        maghribAngle: 0.833,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    TEHRAN: {
        name: 'Institute of Geophysics, Tehran',
        fajrAngle: 17.7,
        ishaAngle: 14,
        maghribAngle: 4.5,
        sunriseAngle: 0.833,
        asrShadowFactor: 1
    },
    JAFARI: {
        name: 'Shia Ithna Ashari, Leva Research Institute',
        fajrAngle: 16,
        ishaAngle: 14,
        maghribAngle: 4,
        sunriseAngle: 0.833,
        asrShadowFactor: 2 // Hanafi shadow factor
    }
};

export const DEFAULT_METHOD = 'MWL'; 