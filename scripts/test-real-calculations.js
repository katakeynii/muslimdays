// Test avec nos vraies formules de calcul
// Version JavaScript des formules astronomiques

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

console.log('🔍 Test avec nos vraies formules de calcul\n');
console.log('📍 Coordonnées:', guediawayeLocation);
console.log('📅 Date de test:', testDate.toISOString().split('T')[0]);
console.log('🕌 Méthode: Muslim World League\n');

// Fonctions utilitaires
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Calcul du jour julien
function getJulianDate(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    const ut = hour + minute / 60 + second / 3600;

    let jd = 367 * year;
    jd -= Math.floor((7 * (year + Math.floor((month + 9) / 12))) / 4);
    jd += Math.floor((275 * month) / 9);
    jd += day;
    jd += 1721013.5;
    jd += ut / 24;

    return jd;
}

// Calcul des coordonnées solaires
function getSunCoordinates(date) {
    const jd = getJulianDate(date);
    const d = jd - 2451545.0;

    const g = 357.529 + 0.98560028 * d;
    const gRad = toRadians(g);

    const q = 280.459 + 0.98564736 * d;
    const l = q + 1.915 * Math.sin(gRad) + 0.020 * Math.sin(2 * gRad);
    const lRad = toRadians(l);

    const e = 23.439 - 0.00000036 * d;
    const eRad = toRadians(e);

    const declination = Math.asin(Math.sin(eRad) * Math.sin(lRad));
    const ra = Math.atan2(Math.cos(eRad) * Math.sin(lRad), Math.cos(lRad));
    const equationOfTime = (q / 15) - (toDegrees(ra) / 15);

    return {
        declination: toDegrees(declination),
        equationOfTime
    };
}

// Calcul de l'heure d'une prière pour un angle donné
function getPrayerTimeAtAngle(date, location, angle, isAfternoon = false) {
    const coords = getSunCoordinates(date);
    const latRad = toRadians(location.latitude);
    const declRad = toRadians(coords.declination);
    const angleRad = toRadians(angle);

    const cosH = (-Math.sin(angleRad) - Math.sin(latRad) * Math.sin(declRad)) /
        (Math.cos(latRad) * Math.cos(declRad));

    if (Math.abs(cosH) > 1) {
        throw new Error(`Angle invalide pour la latitude ${location.latitude}°`);
    }

    const h = toDegrees(Math.acos(cosH));

    let time = 12;
    if (isAfternoon) {
        time += h / 15;
    } else {
        time -= h / 15;
    }

    time -= location.longitude / 15;
    time += coords.equationOfTime;

    if (location.timezone !== undefined) {
        time += location.timezone;
    }

    while (time < 0) time += 24;
    while (time >= 24) time -= 24;

    const result = new Date(date);
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    const seconds = Math.floor(((time - hours) * 60 - minutes) * 60);

    result.setHours(hours, minutes, seconds, 0);
    return result;
}

// Calcul de Dhuhr
function getDhuhrTime(date, location) {
    const coords = getSunCoordinates(date);

    let time = 12;
    time -= location.longitude / 15;
    time += coords.equationOfTime;

    if (location.timezone !== undefined) {
        time += location.timezone;
    }

    while (time < 0) time += 24;
    while (time >= 24) time -= 24;

    const result = new Date(date);
    const hours = Math.floor(time);
    const minutes = Math.floor((time - hours) * 60);
    const seconds = Math.floor(((time - hours) * 60 - minutes) * 60);

    result.setHours(hours, minutes, seconds, 0);
    return result;
}

// Calcul d'Asr (méthode simplifiée)
function getAsrTime(date, location, shadowFactor = 1) {
    const dhuhrTime = getDhuhrTime(date, location);
    const coords = getSunCoordinates(date);
    
    const baseInterval = 2.5; // heures de base
    const latitudeAdjustment = Math.abs(location.latitude) * 0.02;
    const declinationAdjustment = Math.abs(coords.declination) * 0.01;
    
    const totalInterval = baseInterval + latitudeAdjustment + declinationAdjustment;
    const intervalMinutes = totalInterval * 60;
    
    const asrTime = new Date(dhuhrTime);
    asrTime.setMinutes(asrTime.getMinutes() + intervalMinutes);
    
    return asrTime;
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

// Calculs avec nos vraies formules
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

    console.log('📊 COMPARAISON AVEC NOS VRAIES FORMULES:');
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

    // Analyse détaillée
    console.log('\n🔍 ANALYSE DÉTAILLÉE:');
    prayers.forEach(prayer => {
        const expected = expectedResults[prayer];
        const calculated = ourResults[prayer];
        const diff = timeDifference(expected, calculated);
        
        if (diff > 2) {
            console.log(`⚠️  ${prayer}: Différence de ${diff} minutes (${expected} vs ${calculated})`);
        }
    });

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

} catch (error) {
    console.error('❌ Erreur lors du calcul:', error.message);
} 