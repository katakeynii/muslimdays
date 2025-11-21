// Test simple de l'application avec les nouvelles fonctions
console.log('🧪 Test de l\'application MuslimDay\n');

// Simulation des coordonnées de Guédiawaye
const location = {
    latitude: 14.7761,
    longitude: -17.3666,
    timezone: 0
};

// Date de test
const testDate = new Date('2025-08-03');

console.log('📍 Localisation:', location);
console.log('📅 Date:', testDate.toISOString().split('T')[0]);
console.log('🕌 Méthode: Muslim World League\n');

// Test des fonctions principales
try {
    // Import des fonctions (simulation)
    const { getCompletePrayerSchedule } = require('../lib/astro.ts');
    
    console.log('✅ Import des fonctions réussi');
    
    // Calcul de l'emploi du temps
    const schedule = getCompletePrayerSchedule(testDate, location, 'MWL');
    
    console.log('✅ Calcul de l\'emploi du temps réussi\n');
    
    // Affichage des résultats
    console.log('📊 EMPLOI DU TEMPS DES PRIÈRES:');
    console.log('┌─────────────┬──────────┬──────────┬──────────┐');
    console.log('│   Prière    │   Heure  │   Début  │    Fin   │');
    console.log('├─────────────┼──────────┼──────────┼──────────┤');
    
    const formatTime = (date) => {
        return date.toLocaleTimeString('fr-FR', { 
            timeZone: 'UTC',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
    };
    
    const prayers = [
        { name: 'Fajr', data: schedule.fajr },
        { name: 'Sunrise', data: schedule.sunrise },
        { name: 'Dhuhr', data: schedule.dhuhr },
        { name: 'Asr', data: schedule.asr },
        { name: 'Maghrib', data: schedule.maghrib },
        { name: 'Isha', data: schedule.isha }
    ];
    
    prayers.forEach(prayer => {
        if (prayer.name === 'Sunrise') {
            console.log(`│ ${prayer.name.padEnd(11)} │ ${formatTime(prayer.data.time).padEnd(8)} │   --      │   --      │`);
        } else {
            console.log(`│ ${prayer.name.padEnd(11)} │ ${formatTime(prayer.data.time).padEnd(8)} │ ${formatTime(prayer.data.start).padEnd(8)} │ ${formatTime(prayer.data.end).padEnd(8)} │`);
        }
    });
    
    console.log('└─────────────┴──────────┴──────────┴──────────┘');
    
    // Vérification de l'ordre chronologique
    console.log('\n⏰ VÉRIFICATION DE L\'ORDRE CHRONOLOGIQUE:');
    let chronologicalOrder = true;
    for (let i = 0; i < prayers.length - 1; i++) {
        const current = prayers[i].data.time;
        const next = prayers[i + 1].data.time;
        if (current >= next) {
            console.log(`❌ ${prayers[i].name} (${formatTime(current)}) >= ${prayers[i + 1].name} (${formatTime(next)})`);
            chronologicalOrder = false;
        }
    }
    
    if (chronologicalOrder) {
        console.log('✅ Ordre chronologique respecté');
    }
    
    console.log('\n🎉 Test terminé avec succès !');
    
} catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    console.error('Stack trace:', error.stack);
} 