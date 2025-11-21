// Test de comparaison avec les résultats fournis
const { getPrayerSchedule } = require('../services/prayerTimes.ts');
const { getGuediawayeLocation } = require('../services/locationService.ts');

function testComparison() {
    console.log('🔍 Test de comparaison avec les résultats fournis\n');

    const guediawayeLocation = getGuediawayeLocation();
    const testDate = new Date('2025-08-03'); // Date spécifique fournie

    // Résultats de référence fournis
    const expectedResults = {
        "Fajr": "05:37",
        "Sunrise": "06:53", 
        "Dhuhr": "13:16",
        "Asr": "16:28",
        "Maghrib": "19:39",
        "Isha": "20:50"
    };

    console.log('📍 Coordonnées:', guediawayeLocation);
    console.log('📅 Date de test:', testDate.toISOString().split('T')[0]);
    console.log('🕌 Méthode: Muslim World League\n');

    try {
        const schedule = getPrayerSchedule({
            date: testDate,
            location: guediawayeLocation,
            method: 'MWL'
        });

        // Fonction pour formater l'heure en HH:MM
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

        // Calculs de notre code
        const ourResults = {
            "Fajr": formatTime(schedule.fajr.time),
            "Sunrise": formatTime(schedule.sunrise.time),
            "Dhuhr": formatTime(schedule.dhuhr.time),
            "Asr": formatTime(schedule.asr.time),
            "Maghrib": formatTime(schedule.maghrib.time),
            "Isha": formatTime(schedule.isha.time)
        };

        console.log('📊 COMPARAISON DES RÉSULTATS:');
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

        // Analyse détaillée des différences
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
            { name: 'Fajr', time: schedule.fajr.time },
            { name: 'Sunrise', time: schedule.sunrise.time },
            { name: 'Dhuhr', time: schedule.dhuhr.time },
            { name: 'Asr', time: schedule.asr.time },
            { name: 'Maghrib', time: schedule.maghrib.time },
            { name: 'Isha', time: schedule.isha.time }
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
}

testComparison(); 