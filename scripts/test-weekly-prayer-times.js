// Test des calculs de prière sur une semaine complète
console.log('🧪 Test des calculs de prière sur une semaine complète\n');

// Coordonnées de Dakar
const location = {
    latitude: 14.7167,
    longitude: -17.4677,
    timezone: 0
};

// Résultats attendus pour la semaine
const expectedWeeklyResults = [
    {
        "date": "2025-08-04",
        "fajr": "05:31",
        "sunrise": "06:53",
        "dhuhr": "13:16",
        "asr": "16:28",
        "maghrib": "19:39",
        "isha": "20:52"
    },
    {
        "date": "2025-08-05",
        "fajr": "05:31",
        "sunrise": "06:53",
        "dhuhr": "13:16",
        "asr": "16:27",
        "maghrib": "19:38",
        "isha": "20:51"
    },
    {
        "date": "2025-08-06",
        "fajr": "05:32",
        "sunrise": "06:53",
        "dhuhr": "13:16",
        "asr": "16:27",
        "maghrib": "19:38",
        "isha": "20:50"
    },
    {
        "date": "2025-08-07",
        "fajr": "05:32",
        "sunrise": "06:53",
        "dhuhr": "13:16",
        "asr": "16:26",
        "maghrib": "19:38",
        "isha": "20:50"
    },
    {
        "date": "2025-08-08",
        "fajr": "05:32",
        "sunrise": "06:54",
        "dhuhr": "13:15",
        "asr": "16:25",
        "maghrib": "19:37",
        "isha": "20:49"
    },
    {
        "date": "2025-08-09",
        "fajr": "05:33",
        "sunrise": "06:54",
        "dhuhr": "13:15",
        "asr": "16:24",
        "maghrib": "19:37",
        "isha": "20:49"
    },
    {
        "date": "2025-08-10",
        "fajr": "05:33",
        "sunrise": "06:54",
        "dhuhr": "13:15",
        "asr": "16:23",
        "maghrib": "19:36",
        "isha": "20:48"
    }
];

console.log('📍 Localisation: Dakar, Sénégal');
console.log('🕌 Méthode: Muslim World League (MWL)');
console.log('📅 Période: 4-10 août 2025\n');

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

// Test des calculs pour chaque jour
console.log('📊 RÉSULTATS HEBDOMADAIRES:');
console.log('┌─────────────┬──────────┬──────────┬──────────┬──────────┬──────────┬──────────┬─────────┐');
console.log('│    Date     │   Fajr   │ Sunrise  │  Dhuhr   │    Asr   │ Maghrib  │   Isha   │ Status  │');
console.log('├─────────────┼──────────┼──────────┼──────────┼──────────┼──────────┼──────────┼─────────┤');

let totalDifferences = 0;
let totalTests = 0;
let hasAnyError = false;

expectedWeeklyResults.forEach((expected, index) => {
    const testDate = new Date(expected.date);
    const times = computePrayerTimes(testDate, location, 'MWL');
    
    const calculated = {
        fajr: formatTime(times.fajr),
        sunrise: formatTime(times.sunrise),
        dhuhr: formatTime(times.dhuhr),
        asr: formatTime(times.asr),
        maghrib: formatTime(times.maghrib),
        isha: formatTime(times.isha)
    };
    
    // Calcul des différences
    const differences = {
        fajr: timeDifference(expected.fajr, calculated.fajr),
        sunrise: timeDifference(expected.sunrise, calculated.sunrise),
        dhuhr: timeDifference(expected.dhuhr, calculated.dhuhr),
        asr: timeDifference(expected.asr, calculated.asr),
        maghrib: timeDifference(expected.maghrib, calculated.maghrib),
        isha: timeDifference(expected.isha, calculated.isha)
    };
    
    const dayTotalDiff = Object.values(differences).reduce((sum, diff) => sum + diff, 0);
    totalDifferences += dayTotalDiff;
    totalTests += 6;
    
    const hasError = Object.values(differences).some(diff => diff > 2);
    if (hasError) hasAnyError = true;
    
    const status = hasError ? '❌' : '✅';
    
    console.log(`│ ${expected.date} │ ${calculated.fajr}     │ ${calculated.sunrise}     │ ${calculated.dhuhr}     │ ${calculated.asr}     │ ${calculated.maghrib}     │ ${calculated.isha}     │ ${status}     │`);
});

console.log('└─────────────┴──────────┴──────────┴──────────┴──────────┴──────────┴──────────┴─────────┘');

// Résumé des résultats
console.log(`\n📈 RÉSUMÉ DES RÉSULTATS:`);
console.log(`Total des différences: ${totalDifferences} minutes`);
console.log(`Nombre de tests: ${totalTests}`);
console.log(`Différence moyenne: ${(totalDifferences / totalTests).toFixed(2)} minutes`);
console.log(`Précision globale: ${hasAnyError ? '❌ Problèmes détectés' : '✅ Tous les résultats conformes'}`);

// Analyse détaillée des erreurs
if (hasAnyError) {
    console.log('\n🔍 ANALYSE DÉTAILLÉE DES ERREURS:');
    expectedWeeklyResults.forEach((expected, index) => {
        const testDate = new Date(expected.date);
        const times = computePrayerTimes(testDate, location, 'MWL');
        
        const calculated = {
            fajr: formatTime(times.fajr),
            sunrise: formatTime(times.sunrise),
            dhuhr: formatTime(times.dhuhr),
            asr: formatTime(times.asr),
            maghrib: formatTime(times.maghrib),
            isha: formatTime(times.isha)
        };
        
        const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
        const hasDayError = prayers.some(prayer => {
            const diff = timeDifference(expected[prayer], calculated[prayer]);
            return diff > 2;
        });
        
        if (hasDayError) {
            console.log(`\n📅 ${expected.date}:`);
            prayers.forEach(prayer => {
                const diff = timeDifference(expected[prayer], calculated[prayer]);
                if (diff > 2) {
                    console.log(`  ⚠️  ${prayer.toUpperCase()}: ${expected[prayer]} vs ${calculated[prayer]} (diff: ${diff} min)`);
                } else {
                    console.log(`  ✅ ${prayer.toUpperCase()}: ${expected[prayer]} vs ${calculated[prayer]} (diff: ${diff} min)`);
                }
            });
        }
    });
}

// Test de l'ordre chronologique pour chaque jour
console.log('\n⏰ VÉRIFICATION DE L\'ORDRE CHRONOLOGIQUE:');
let chronologicalErrors = 0;

expectedWeeklyResults.forEach((expected, index) => {
    const testDate = new Date(expected.date);
    const times = computePrayerTimes(testDate, location, 'MWL');
    
    const timeArray = [
        { name: 'Fajr', time: times.fajr },
        { name: 'Sunrise', time: times.sunrise },
        { name: 'Dhuhr', time: times.dhuhr },
        { name: 'Asr', time: times.asr },
        { name: 'Maghrib', time: times.maghrib },
        { name: 'Isha', time: times.isha }
    ];
    
    let dayChronologicalOrder = true;
    for (let i = 0; i < timeArray.length - 1; i++) {
        if (timeArray[i].time >= timeArray[i + 1].time) {
            console.log(`❌ ${expected.date} - ${timeArray[i].name} (${formatTime(timeArray[i].time)}) >= ${timeArray[i + 1].name} (${formatTime(timeArray[i + 1].time)})`);
            dayChronologicalOrder = false;
            chronologicalErrors++;
        }
    }
    
    if (dayChronologicalOrder) {
        console.log(`✅ ${expected.date} - Ordre chronologique respecté`);
    }
});

if (chronologicalErrors === 0) {
    console.log('\n🎉 Tous les jours respectent l\'ordre chronologique !');
} else {
    console.log(`\n⚠️  ${chronologicalErrors} erreurs d'ordre chronologique détectées`);
}

console.log('\n🎯 Test hebdomadaire terminé !'); 