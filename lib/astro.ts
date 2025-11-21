/**
 * Calculs astronomiques pour les heures de prière musulmanes
 * Basé directement sur prayTime.js avec ajout de la gestion des intervalles
 */

export interface Location {
    latitude: number;
    longitude: number;
    timezone?: number;
}

export interface SunCoordinates {
    declination: number;
    equation: number;
}

export interface PrayerTime {
    start: Date;
    time: Date;
    end: Date;
}

export interface PrayerSchedule {
    fajr: PrayerTime;
    sunrise: { time: Date };
    dhuhr: PrayerTime;
    asr: PrayerTime;
    maghrib: PrayerTime;
    isha: PrayerTime;
}

// Méthodes de calcul avec leurs paramètres
const METHODS: { [key: string]: any } = {
    MWL: { fajr: 18, isha: 17 },
    ISNA: { fajr: 15, isha: 15 },
    Egypt: { fajr: 19.5, isha: 17.5 },
    Makkah: { fajr: 18.5, isha: '90 min' },
    Karachi: { fajr: 18, isha: 18 },
    Tehran: { fajr: 17.7, maghrib: 4.5, midnight: 'Jafari' },
    Jafari: { fajr: 16, maghrib: 4, midnight: 'Jafari' },
    France: { fajr: 12, isha: 12 },
    Russia: { fajr: 16, isha: 15 },
    Singapore: { fajr: 20, isha: 18 },
    defaults: { isha: 14, maghrib: '1 min', midnight: 'Standard' }
};

// Fonctions trigonométriques en degrés (exactement comme prayTime.js)
const dtr = (d: number) => d * Math.PI / 180;
const rtd = (r: number) => r * 180 / Math.PI;

const sin = (d: number) => Math.sin(dtr(d));
const cos = (d: number) => Math.cos(dtr(d));
const tan = (d: number) => Math.tan(dtr(d));

const arcsin = (d: number) => rtd(Math.asin(d));
const arccos = (d: number) => rtd(Math.acos(d));
const arctan = (d: number) => rtd(Math.atan(d));
const arccot = (x: number) => rtd(Math.atan(1 / x));
const arctan2 = (y: number, x: number) => rtd(Math.atan2(y, x));

// Modulo positif
function mod(a: number, b: number): number {
    return ((a % b) + b) % b;
}

// Convertir string en nombre
function value(str: string | number): number {
    return +String(str).split(/[^0-9.+-]/)[0];
}

// Détecter si input contient 'min'
function isMin(str: string | number): boolean {
    return String(str).indexOf('min') != -1;
}

/**
 * Calcule la position du soleil (exactement comme prayTime.js)
 */
export function getSunPosition(date: Date, longitude: number): SunCoordinates {
    const utcTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const lng = longitude;
    const D = utcTime / 864e5 - 10957.5 - lng / 360;

    const g = mod(357.529 + 0.98560028 * D, 360);
    const q = mod(280.459 + 0.98564736 * D, 360);
    const L = mod(q + 1.915 * sin(g) + 0.020 * sin(2 * g), 360);
    const e = 23.439 - 0.00000036 * D;
    const RA = mod(arctan2(cos(e) * sin(L), cos(L)) / 15, 24);

    return {
        declination: arcsin(sin(e) * sin(L)),
        equation: q / 15 - RA,
    };
}

/**
 * Calcule le midi solaire (exactement comme prayTime.js)
 */
export function getMidDay(date: Date, longitude: number): number {
    const eqt = getSunPosition(date, longitude).equation;
    const noon = mod(12 - eqt, 24);
    return noon;
}

/**
 * Calcule l'heure quand le soleil atteint un angle spécifique (exactement comme prayTime.js)
 */
export function getAngleTime(
    date: Date,
    location: Location,
    angle: number,
    direction: number = 1
): number {
    const lat = location.latitude;
    const decl = getSunPosition(date, location.longitude).declination;
    const numerator = -sin(angle) - sin(lat) * sin(decl);
    const diff = arccos(numerator / (cos(lat) * cos(decl))) / 15;
    return getMidDay(date, location.longitude) + diff * direction;
}

/**
 * Calcule l'angle pour Asr (exactement comme prayTime.js)
 */
export function getAsrAngle(date: Date, location: Location, shadowFactor: number = 1): number {
    const lat = location.latitude;
    const decl = getSunPosition(date, location.longitude).declination;
    return -arccot(shadowFactor + tan(Math.abs(lat - decl)));
}

/**
 * Calcule tous les temps de prière (exactement comme prayTime.js)
 */
export function computePrayerTimes(date: Date, location: Location, method: string = 'MWL'): any {
    const params = { ...METHODS.defaults, ...METHODS[method] };
    const horizon = 0.833;

    // Calculs initiaux
    let times = {
        fajr: getAngleTime(date, location, params.fajr, -1),
        sunrise: getAngleTime(date, location, horizon, -1),
        dhuhr: getMidDay(date, location.longitude),
        asr: getAngleTime(date, location, getAsrAngle(date, location, 1), 1),
        sunset: getAngleTime(date, location, horizon, 1),
        maghrib: getAngleTime(date, location, params.maghrib || 0, 1),
        isha: getAngleTime(date, location, params.isha, 1),
        midnight: getMidDay(date, location.longitude) + 12
    };

    // Mise à jour des temps
    if (isMin(params.maghrib)) {
        times.maghrib = times.sunset + value(params.maghrib) / 60;
    }
    if (isMin(params.isha)) {
        times.isha = times.maghrib + value(params.isha) / 60;
    }
    if (params.midnight == 'Jafari') {
        const nextFajr = getAngleTime(date, location, params.fajr, -1) + 24;
        times.midnight = (times.sunset + nextFajr) / 2;
    }

    // Conversion en timestamps (exactement comme prayTime.js)
    const lng = location.longitude;
    const utcTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());

    const result: any = {};
    for (const [key, time] of Object.entries(times)) {
        const adjustedTime = time - lng / 15;
        const timestamp = utcTime + Math.floor(adjustedTime * 36e5);
        result[key] = new Date(timestamp);
    }

    return result;
}

/**
 * Calcule l'heure d'une prière spécifique
 */
export function getPrayerTime(
    date: Date,
    location: Location,
    prayerType: string,
    method: string = 'MWL'
): Date {
    const times = computePrayerTimes(date, location, method);
    return times[prayerType.toLowerCase()];
}

/**
 * Calcule l'heure de Fajr
 */
export function getFajrTime(date: Date, location: Location, method: string = 'MWL'): Date {
    return getPrayerTime(date, location, 'fajr', method);
}

/**
 * Calcule l'heure du lever du soleil
 */
export function getSunriseTime(date: Date, location: Location): Date {
    return getPrayerTime(date, location, 'sunrise', 'MWL');
}

/**
 * Calcule l'heure de Dhuhr
 */
export function getDhuhrTime(date: Date, location: Location): Date {
    return getPrayerTime(date, location, 'dhuhr', 'MWL');
}

/**
 * Calcule l'heure d'Asr
 */
export function getAsrTime(date: Date, location: Location, method: string = 'MWL'): Date {
    return getPrayerTime(date, location, 'asr', method);
}

/**
 * Calcule l'heure de Maghrib
 */
export function getMaghribTime(date: Date, location: Location, method: string = 'MWL'): Date {
    return getPrayerTime(date, location, 'maghrib', method);
}

/**
 * Calcule l'heure d'Isha
 */
export function getIshaTime(date: Date, location: Location, method: string = 'MWL'): Date {
    return getPrayerTime(date, location, 'isha', method);
}

/**
 * Calcule l'heure du coucher du soleil
 */
export function getSunsetTime(date: Date, location: Location): Date {
    return getPrayerTime(date, location, 'sunset', 'MWL');
}

/**
 * Calcule les intervalles (plages) pour chaque prière
 */
export function calculatePrayerRanges(
    fajrTime: Date,
    sunriseTime: Date,
    dhuhrTime: Date,
    asrTime: Date,
    maghribTime: Date,
    ishaTime: Date
): PrayerSchedule {
    // Fajr: de Fajr jusqu'au lever du soleil
    const fajr: PrayerTime = {
        start: fajrTime,
        time: fajrTime,
        end: sunriseTime
    };

    // Dhuhr: du zénith jusqu'à 2h30 après Dhuhr
    const dhuhrEnd = new Date(dhuhrTime);
    dhuhrEnd.setMinutes(dhuhrEnd.getMinutes() + 150); // 2h30 après Dhuhr
    const dhuhr: PrayerTime = {
        start: dhuhrTime,
        time: dhuhrTime,
        end: dhuhrEnd
    };

    // Asr: du début d'Asr jusqu'au coucher du soleil (Maghrib)
    const asr: PrayerTime = {
        start: asrTime,
        time: asrTime,
        end: maghribTime
    };

    // Maghrib: du coucher du soleil + 20 minutes
    const maghribEnd = new Date(maghribTime);
    maghribEnd.setMinutes(maghribEnd.getMinutes() + 20);
    const maghrib: PrayerTime = {
        start: maghribTime,
        time: maghribTime,
        end: maghribEnd
    };

    // Isha: de la fin de Maghrib jusqu'au Fajr du lendemain
    const isha: PrayerTime = {
        start: maghribEnd,
        time: ishaTime,
        end: fajrTime
    };

    return {
        fajr,
        sunrise: { time: sunriseTime },
        dhuhr,
        asr,
        maghrib,
        isha
    };
}

/**
 * Calcule l'emploi du temps complet avec intervalles
 */
export function getCompletePrayerSchedule(
    date: Date,
    location: Location,
    method: string = 'MWL'
): PrayerSchedule {
    const fajrTime = getFajrTime(date, location, method);
    const sunriseTime = getSunriseTime(date, location);
    const dhuhrTime = getDhuhrTime(date, location);
    const asrTime = getAsrTime(date, location, method);
    const maghribTime = getMaghribTime(date, location, method);
    const ishaTime = getIshaTime(date, location, method);

    return calculatePrayerRanges(
        fajrTime,
        sunriseTime,
        dhuhrTime,
        asrTime,
        maghribTime,
        ishaTime
    );
} 