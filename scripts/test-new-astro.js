// Test des nouvelles fonctions basées sur prayTime.js
// Simulation des fonctions TypeScript en JavaScript

// Coordonnées de Guédiawaye
const guediawayeLocation = {
    latitude: 14.7761,
    longitude: -17.3666,
    timezone: 0
};

// Date de test
const testDate = new Date('2025-08-03');

// Résultats de référence
const expectedResults = {
    "Fajr": "05:37",
    "Sunrise": "06:53", 
    "Dhuhr": "13:16",
    "Asr": "16:28",
    "Maghrib": "19:39",
    "Isha": "20:50"
};

console.log('🔍 Test des nouvelles fonctions basées sur prayTime.js\n');
console.log('📍 Coordonnées:', guediawayeLocation);
console.log('📅 Date de test:', testDate.toISOString().split('T')[0]);
console.log('🕌 Méthode: Muslim World League\n');

// Méthodes de calcul (copiées de astro.ts)
const METHODS = {
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

// Fonctions trigonométriques (copiées de astro.ts)
const dtr = (d) => d * Math.PI / 180;
const rtd = (r) => r * 180 / Math.PI;

const sin = (d) => Math.sin(dtr(d));
const cos = (d) => Math.cos(dtr(d));
const tan = (d) => Math.tan(dtr(d));

const arcsin = (d) => rtd(Math.asin(d));
const arccos = (d) => rtd(Math.acos(d));
const arctan = (d) => rtd(Math.atan(d));
const arccot = (x) => rtd(Math.atan(1 / x));
const arctan2 = (y, x) => rtd(Math.atan2(y, x));

function mod(a, b) {
    return ((a % b) + b) % b;
}

function value(str) {
    return +String(str).split(/[^0-9.+-]/)[0];
}

function isMin(str) {
    return String(str).indexOf('min') != -1;
}

// Fonctions astronomiques (copiées de astro.ts)
function getSunPosition(date, longitude) {
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

function getMidDay(date, longitude) {
    const eqt = getSunPosition(date, longitude).equation;
    const noon = mod(12 - eqt, 24);
    return noon;
}

function getAngleTime(date, location, angle, direction = 1) {
    const lat = location.latitude;
    const decl = getSunPosition(date, location.longitude).declination;
    const numerator = -sin(angle) - sin(lat) * sin(decl);
    const diff = arccos(numerator / (cos(lat) * cos(decl))) / 15;
    return getMidDay(date, location.longitude) + diff * direction;
}

function getAsrAngle(date, location, shadowFactor = 1) {
    const lat = location.latitude;
    const decl = getSunPosition(date, location.longitude).declination;
    return -arccot(shadowFactor + tan(Math.abs(lat - decl)));
}

// Fonction principale (copiée de astro.ts)
function computePrayerTimes(date, location, method = 'MWL') {
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
    
    const result = {};
    for (const [key, time] of Object.entries(times)) {
        const adjustedTime = time - lng / 15;
        const timestamp = utcTime + Math.floor(adjustedTime * 36e5);
        result[key] = new Date(timestamp);
    }

    return result;
}

// Fonction pour formater l'heure
function formatTime(date) {
    return date.toLocaleTimeString('fr-FR', { 
        timeZone: 'UTC',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    });
}

// Fonction pour calculer la différence en minutes
function timeDifference(time1, time2) {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    return Math.abs((h1 * 60 + m1) - (h2 * 60 + m2));
}

// Test des nouvelles fonctions
try {
    const times = computePrayerTimes(testDate, guediawayeLocation, 'MWL');
    
    const ourResults = {
        "Fajr": formatTime(times.fajr),
        "Sunrise": formatTime(times.sunrise),
        "Dhuhr": formatTime(times.dhuhr),
        "Asr": formatTime(times.asr),
        "Maghrib": formatTime(times.maghrib),
        "Isha": formatTime(times.isha)
    };

    console.log('📊 COMPARAISON AVEC NOUVELLES FONCTIONS:');
    console.log('┌─────────────┬──────────┬──────────┬──────────┬─────────┐');
    console.log('│   Prière    │ Attendu  │ Calculé  │ Différence│ Status  │');
    console.log('├─────────────┼──────────┼──────────┼──────────┼─────────┤');

    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let totalDifference = 0;
    let hasError = false;

    prayers.forEach(prayer => {
        const expected = expectedResults[prayer];
        const calculated = ourResults[prayer];
        const diff = timeDifference(expected, calculated);
        totalDifference += diff;
        
        const status = diff <= 2 ? '✅' : '❌';
        if (diff > 2) hasError = true;
        
        console.log(`│ ${prayer.padEnd(11)} │ ${expected}     │ ${calculated}     │ ${diff.toString().padStart(3)} min   │ ${status}     │`);
    });

    console.log('└─────────────┴──────────┴──────────┴──────────┴─────────┘');
    console.log(`\n📈 Différence totale: ${totalDifference} minutes`);
    console.log(`🎯 Précision: ${hasError ? '❌ Problème détecté' : '✅ Résultats conformes'}`);

    // Debug des coordonnées solaires
    console.log('\n🔬 DEBUG DES COORDONNÉES SOLAIRES:');
    const coords = getSunPosition(testDate, guediawayeLocation.longitude);
    console.log('Déclinaison du soleil:', coords.declination.toFixed(4), '°');
    console.log('Équation du temps:', coords.equation.toFixed(4), 'h');
    console.log('Midi solaire:', getMidDay(testDate, guediawayeLocation.longitude).toFixed(4), 'h');

    // Vérification de l'ordre chronologique
    console.log('\n⏰ VÉRIFICATION DE L\'ORDRE CHRONOLOGIQUE:');
    const timeArray = [
        { name: 'Fajr', time: times.fajr },
        { name: 'Sunrise', time: times.sunrise },
        { name: 'Dhuhr', time: times.dhuhr },
        { name: 'Asr', time: times.asr },
        { name: 'Maghrib', time: times.maghrib },
        { name: 'Isha', time: times.isha }
    ];

    let chronologicalOrder = true;
    for (let i = 0; i < timeArray.length - 1; i++) {
        if (timeArray[i].time >= timeArray[i + 1].time) {
            console.log(`❌ ${timeArray[i].name} (${formatTime(timeArray[i].time)}) >= ${timeArray[i + 1].name} (${formatTime(timeArray[i + 1].time)})`);
            chronologicalOrder = false;
        }
    }
    
    if (chronologicalOrder) {
        console.log('✅ Ordre chronologique respecté');
    }

    // Test des intervalles
    console.log('\n📅 TEST DES INTERVALLES:');
    const fajrEnd = times.sunrise;
    const dhuhrEnd = new Date(times.dhuhr);
    dhuhrEnd.setMinutes(dhuhrEnd.getMinutes() + 150);
    const asrEnd = times.maghrib;
    const maghribEnd = new Date(times.maghrib);
    maghribEnd.setMinutes(maghribEnd.getMinutes() + 20);
    const ishaEnd = times.fajr;

    console.log(`Fajr: ${formatTime(times.fajr)} - ${formatTime(fajrEnd)}`);
    console.log(`Dhuhr: ${formatTime(times.dhuhr)} - ${formatTime(dhuhrEnd)}`);
    console.log(`Asr: ${formatTime(times.asr)} - ${formatTime(asrEnd)}`);
    console.log(`Maghrib: ${formatTime(times.maghrib)} - ${formatTime(maghribEnd)}`);
    console.log(`Isha: ${formatTime(times.isha)} - ${formatTime(ishaEnd)}`);

} catch (error) {
    console.error('❌ Erreur lors du calcul:', error.message);
} 