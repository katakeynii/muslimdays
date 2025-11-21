// Test rapide pour vérifier les corrections
const { getPrayerSchedule } = require('../services/prayerTimes.ts');
const { getGuediawayeLocation } = require('../services/locationService.ts');

function quickTest() {
    console.log('🚀 Test rapide des corrections\n');

    const guediawayeLocation = getGuediawayeLocation();
    const today = new Date();

    try {
        const schedule = getPrayerSchedule({
            date: today,
            location: guediawayeLocation,
            method: 'MWL'
        });

        console.log('🕐 HEURES CORRIGÉES:');
        console.log('Fajr:', schedule.fajr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Sunrise:', schedule.sunrise.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Dhuhr:', schedule.dhuhr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Asr:', schedule.asr.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Maghrib:', schedule.maghrib.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));
        console.log('Isha:', schedule.isha.time.toLocaleTimeString('fr-FR', { timeZone: 'UTC' }));

        console.log('\n📊 PLAGES HORAIRES CORRIGÉES:');
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

        // Vérifications critiques
        console.log('\n✅ VÉRIFICATIONS CRITIQUES:');
        
        const asrHour = schedule.asr.time.getUTCHours();
        console.log('Asr heure logique (14h-19h):', asrHour >= 14 && asrHour < 19 ? '✅' : '❌');
        
        const dhuhrStart = schedule.dhuhr.start.getTime();
        const dhuhrEnd = schedule.dhuhr.end.getTime();
        console.log('Dhuhr plage logique (début < fin):', dhuhrStart < dhuhrEnd ? '✅' : '❌');
        
        const asrStart = schedule.asr.start.getTime();
        const asrEnd = schedule.asr.end.getTime();
        console.log('Asr plage logique (début < fin):', asrStart < asrEnd ? '✅' : '❌');
        
        console.log('Dhuhr < Asr:', schedule.dhuhr.time < schedule.asr.time ? '✅' : '❌');
        console.log('Asr < Maghrib:', schedule.asr.time < schedule.maghrib.time ? '✅' : '❌');

    } catch (error) {
        console.error('❌ Erreur:', error.message);
    }
}

quickTest(); 