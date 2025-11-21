// Test avec les formules basées sur prayTime.js
// Version JavaScript des nouvelles formules astronomiques

// Coordonnées de Guédiawaye
const guediawayeLocation = {
    latitude: 14.7761,
    longitude: -17.3666,
    timezone: 0
};

// Date de test
const testDate = new Date('2025-08-03');

// Résultats de référence fournis
const expectedResults = {
    "Fajr": "05:37",
    "Sunrise": "06:53", 
    "Dhuhr": "13:16",
    "Asr": "16:28",
    "Maghrib": "19:39",
    "Isha": "20:50"
};

console.log('🔍 Test avec formules basées sur prayTime.js\n');
console.log('📍 Coordonnées:', guediawayeLocation);
console.log('📅 Date de test:', testDate.toISOString().split('T')[0]);
console.log('🕌 Méthode: Muslim World League\n');

// Fonctions utilitaires (basées sur prayTime.js)
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

// Calcul de la position du soleil (basé sur prayTime.js)
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

// Calcul du midi solaire
function getMidDay(date, longitude) {
    const eqt = getSunPosition(date, longitude).equation;
    const noon = mod(12 - eqt, 24);
    return noon;
}

// Calcul de l'heure quand le soleil atteint un angle spécifique
function getAngleTime(date, location, angle, direction = 1) {
    const lat = location.latitude;
    const decl = getSunPosition(date, location.longitude).declination;
    const numerator = -sin(angle) - sin(lat) * sin(decl);
    const diff = arccos(numerator / (cos(lat) * cos(decl))) / 15;
    return getMidDay(date, location.longitude) + diff * direction;
}

// Calcul de l'angle pour Asr
function getAsrAngle(date, location, shadowFactor = 1) {
    const lat = location.latitude;
    const decl = getSunPosition(date, location.longitude).declination;
    return -arccot(shadowFactor + tan(Math.abs(lat - decl)));
}

// Calcul de l'heure d'une prière
function getPrayerTimeAtAngle(date, location, angle, isAfternoon = false) {
    const direction = isAfternoon ? 1 : -1;
    const time = getAngleTime(date, location, angle, direction);
    
    // Conversion en Date
    const utcTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const timestamp = utcTime + Math.floor(time * 36e5);
    
    return new Date(timestamp);
}

// Calcul de Dhuhr
function getDhuhrTime(date, location) {
    const time = getMidDay(date, location.longitude);
    
    // Conversion en Date
    const utcTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
    const timestamp = utcTime + Math.floor(time * 36e5);
    
    return new Date(timestamp);
}

// Calcul d'Asr
function getAsrTime(date, location, shadowFactor = 1) {
    const angle = getAsrAngle(date, location, shadowFactor);
    return getPrayerTimeAtAngle(date, location, angle, true);
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

// Calculs avec les nouvelles formules
try {
    const fajrTime = getPrayerTimeAtAngle(testDate, guediawayeLocation, 18, false);
    const sunriseTime = getPrayerTimeAtAngle(testDate, guediawayeLocation, 0.833, false);
    const dhuhrTime = getDhuhrTime(testDate, guediawayeLocation);
    const asrTime = getAsrTime(testDate, guediawayeLocation, 1);
    const maghribTime = getPrayerTimeAtAngle(testDate, guediawayeLocation, 0.833, true);
    const ishaTime = getPrayerTimeAtAngle(testDate, guediawayeLocation, 17, true);

    const ourResults = {
        "Fajr": formatTime(fajrTime),
        "Sunrise": formatTime(sunriseTime),
        "Dhuhr": formatTime(dhuhrTime),
        "Asr": formatTime(asrTime),
        "Maghrib": formatTime(maghribTime),
        "Isha": formatTime(ishaTime)
    };

    console.log('📊 COMPARAISON AVEC FORMULES PRAYTIME.JS:');
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
    const times = [
        { name: 'Fajr', time: fajrTime },
        { name: 'Sunrise', time: sunriseTime },
        { name: 'Dhuhr', time: dhuhrTime },
        { name: 'Asr', time: asrTime },
        { name: 'Maghrib', time: maghribTime },
        { name: 'Isha', time: ishaTime }
    ];

    let chronologicalOrder = true;
    for (let i = 0; i < times.length - 1; i++) {
        if (times[i].time >= times[i + 1].time) {
            console.log(`❌ ${times[i].name} (${formatTime(times[i].time)}) >= ${times[i + 1].name} (${formatTime(times[i + 1].time)})`);
            chronologicalOrder = false;
        }
    }
    
    if (chronologicalOrder) {
        console.log('✅ Ordre chronologique respecté');
    }

    // Analyse détaillée
    console.log('\n🔍 ANALYSE DÉTAILLÉE:');
    prayers.forEach(prayer => {
        const expected = expectedResults[prayer];
        const calculated = ourResults[prayer];
        const diff = timeDifference(expected, calculated);
        
        if (diff > 2) {
            console.log(`⚠️  ${prayer}: Différence de ${diff} minutes (${expected} vs ${calculated})`);
        } else {
            console.log(`✅ ${prayer}: Différence de ${diff} minutes - Conforme`);
        }
    });

} catch (error) {
    console.error('❌ Erreur lors du calcul:', error.message);
} 