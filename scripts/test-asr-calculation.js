// Script de test spécifique pour le calcul d'Asr
const { getPrayerSchedule } = require('../services/prayerTimes.ts');
const { getGuediawayeLocation } = require('../services/locationService.ts');

function testAsrCalculation() {
    console.log('🕌 Test spécifique du calcul d\'Asr pour Guédiawaye\n');

    const guediawayeLocation = getGuediawayeLocation();
    const today = new Date();

    console.log('📍 Coordonnées:', guediawayeLocation);
    console.log('📅 Date:', today.toLocaleDateString('fr-FR'));
    console.log('');

    const methods = ['MWL', 'ISNA', 'UMM_AL_QURA', 'EGYPT', 'MAKKAH', 'KARACHI', 'TEHRAN', 'JAFARI'];

    methods.forEach(method => {
        try {
            const schedule = getPrayerSchedule({
                date: today,
                location: guediawayeLocation,
                method: method
            });

            const asrTime = schedule.asr.time;
            const asrHour = asrTime.getUTCHours();
            const asrMinutes = asrTime.getUTCMinutes();
            const asrTimeStr = `${asrHour.toString().padStart(2, '0')}:${asrMinutes.toString().padStart(2, '0')}`;

            // Vérification de la validité
            const isValid = asrHour >= 14 && asrHour < 19;
            const status = isValid ? '✅' : '❌';

            console.log(`${status} ${method}: Asr ${asrTimeStr} UTC`);

            if (!isValid) {
                console.log(`   ⚠️  Heure invalide: ${asrTimeStr} (devrait être entre 14h et 19h UTC)`);
            }

        } catch (error) {
            console.log(`❌ ${method}: Erreur - ${error.message}`);
        }
    });

    console.log('\n📊 Détails du calcul MWL:');
    try {
        const mwlSchedule = getPrayerSchedule({
            date: today,
            location: guediawayeLocation,
            method: 'MWL'
        });

        console.log('Dhuhr:', mwlSchedule.dhuhr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Asr:', mwlSchedule.asr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Maghrib:', mwlSchedule.maghrib.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));

        // Vérifier l'ordre chronologique
        const dhuhrTime = mwlSchedule.dhuhr.time.getTime();
        const asrTime = mwlSchedule.asr.time.getTime();
        const maghribTime = mwlSchedule.maghrib.time.getTime();

        console.log('\n🔍 Vérifications:');
        console.log('Dhuhr < Asr:', dhuhrTime < asrTime ? '✅' : '❌');
        console.log('Asr < Maghrib:', asrTime < maghribTime ? '✅' : '❌');

        // Calculer les intervalles
        const dhuhrToAsr = (asrTime - dhuhrTime) / (1000 * 60); // en minutes
        const asrToMaghrib = (maghribTime - asrTime) / (1000 * 60); // en minutes

        console.log(`Intervalle Dhuhr → Asr: ${dhuhrToAsr.toFixed(1)} minutes`);
        console.log(`Intervalle Asr → Maghrib: ${asrToMaghrib.toFixed(1)} minutes`);

    } catch (error) {
        console.error('❌ Erreur lors du calcul MWL:', error.message);
    }
}

// Exécuter le test
testAsrCalculation(); 