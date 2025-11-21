// Script de test pour vérifier les calculs de prière
const { getPrayerSchedule } = require('../services/prayerTimes.ts');
const { getGuediawayeLocation } = require('../services/locationService.ts');

function testPrayerCalculations() {
    console.log('🕌 Test des calculs de prière pour Guédiawaye\n');

    const guediawayeLocation = getGuediawayeLocation();
    const today = new Date();

    console.log('📍 Coordonnées:', guediawayeLocation);
    console.log('📅 Date:', today.toLocaleDateString('fr-FR'));
    console.log('⏰ Heure actuelle:', today.toLocaleTimeString('fr-FR'));
    console.log('');

    try {
        // Test avec méthode MWL
        const schedule = getPrayerSchedule({
            date: today,
            location: guediawayeLocation,
            method: 'MWL'
        });

        console.log('🕐 HEURES DE PRIÈRE (MWL):');
        console.log('Fajr:', schedule.fajr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Lever du soleil:', schedule.sunrise.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Dhuhr:', schedule.dhuhr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Asr:', schedule.asr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Maghrib:', schedule.maghrib.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Isha:', schedule.isha.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));

        console.log('\n📊 PLAGES HORAIRES:');
        console.log('Fajr:', 
            schedule.fajr.start.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }), 
            '-', 
            schedule.fajr.end.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })
        );
        console.log('Dhuhr:', 
            schedule.dhuhr.start.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }), 
            '-', 
            schedule.dhuhr.end.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })
        );
        console.log('Asr:', 
            schedule.asr.start.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }), 
            '-', 
            schedule.asr.end.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })
        );
        console.log('Maghrib:', 
            schedule.maghrib.start.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }), 
            '-', 
            schedule.maghrib.end.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })
        );
        console.log('Isha:', 
            schedule.isha.start.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }), 
            '-', 
            schedule.isha.end.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })
        );

        // Test avec différentes méthodes
        console.log('\n🔄 COMPARAISON DES MÉTHODES:');
        const methods = ['MWL', 'ISNA', 'UMM_AL_QURA'];
        
        methods.forEach(method => {
            try {
                const methodSchedule = getPrayerSchedule({
                    date: today,
                    location: guediawayeLocation,
                    method: method
                });
                
                console.log(`${method}: Fajr ${methodSchedule.fajr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })} | Isha ${methodSchedule.isha.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' })}`);
            } catch (error) {
                console.log(`${method}: ❌ Erreur - ${error.message}`);
            }
        });

        // Vérifications de cohérence
        console.log('\n✅ VÉRIFICATIONS DE COHÉRENCE:');
        console.log('Fajr < Sunrise:', schedule.fajr.time < schedule.sunrise.time ? '✅' : '❌');
        console.log('Sunrise < Dhuhr:', schedule.sunrise.time < schedule.dhuhr.time ? '✅' : '❌');
        console.log('Dhuhr < Asr:', schedule.dhuhr.time < schedule.asr.time ? '✅' : '❌');
        console.log('Asr < Maghrib:', schedule.asr.time < schedule.maghrib.time ? '✅' : '❌');
        console.log('Maghrib < Isha:', schedule.maghrib.time < schedule.isha.time ? '✅' : '❌');

    } catch (error) {
        console.error('❌ Erreur lors du calcul:', error.message);
    }
}

// Exécuter le test
testPrayerCalculations(); 