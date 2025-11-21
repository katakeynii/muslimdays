// Test simple des calculs de prière
console.log('🧪 Test simple des calculs de prière\n');

// Coordonnées de Guédiawaye
const location = {
    latitude: 14.7761,
    longitude: -17.3666,
    timezone: 0
};

// Date de test
const testDate = new Date('2025-08-03');

// Résultats attendus
const expectedResults = {
    "Fajr": "05:37",
    "Sunrise": "06:53", 
    "Dhuhr": "13:16",
    "Asr": "16:28",
    "Maghrib": "19:39",
    "Isha": "20:50"
};

console.log('📍 Localisation:', location);
console.log('📅 Date:', testDate.toISOString().split('T')[0]);
console.log('🕌 Méthode: Muslim World League\n');

// Fonctions de calcul (copiées de astro.ts)
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

function computePrayerTimes(date, location, method = 'MWL') {
    const params = { ...METHODS.defaults, ...METHODS[method] };
    const horizon = 0.833;

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

// Test des calculs
try {
    const times = computePrayerTimes(testDate, location, 'MWL');
    
    const formatTime = (date) => {
        return date.toLocaleTimeString('fr-FR', { 
            timeZone: 'UTC',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };
    
    const ourResults = {
        "Fajr": formatTime(times.fajr),
        "Sunrise": formatTime(times.sunrise),
        "Dhuhr": formatTime(times.dhuhr),
        "Asr": formatTime(times.asr),
        "Maghrib": formatTime(times.maghrib),
        "Isha": formatTime(times.isha)
    };

    console.log('📊 RÉSULTATS DES CALCULS:');
    console.log('┌─────────────┬──────────┬──────────┬─────────┐');
    console.log('│   Prière    │ Attendu  │ Calculé  │ Status  │');
    console.log('├─────────────┼──────────┼──────────┼─────────┤');

    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let totalDifference = 0;
    let hasError = false;

    prayers.forEach(prayer => {
        const expected = expectedResults[prayer];
        const calculated = ourResults[prayer];
        const diff = Math.abs((parseInt(expected.split(':')[0]) * 60 + parseInt(expected.split(':')[1])) - 
                             (parseInt(calculated.split(':')[0]) * 60 + parseInt(calculated.split(':')[1])));
        totalDifference += diff;
        
        const status = diff <= 2 ? '✅' : '❌';
        if (diff > 2) hasError = true;
        
        console.log(`│ ${prayer.padEnd(11)} │ ${expected}     │ ${calculated}     │ ${status}     │`);
    });

    console.log('└─────────────┴──────────┴──────────┴─────────┘');
    console.log(`\n📈 Différence totale: ${totalDifference} minutes`);
    console.log(`🎯 Précision: ${hasError ? '❌ Problème détecté' : '✅ Résultats conformes'}`);

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

    console.log('\n🎉 Test terminé avec succès !');

} catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
} 