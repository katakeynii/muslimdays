import { getGuediawayeLocation } from '../services/locationService';
import { getPrayerSchedule } from '../services/prayerTimes';

describe('Calculs des heures de prière pour Guédiawaye', () => {
    const guediawayeLocation = getGuediawayeLocation();
    const testDate = new Date('2025-01-15'); // Date fixe pour les tests

    test('devrait calculer les heures de prière avec la méthode MWL', () => {
        const schedule = getPrayerSchedule({
            date: testDate,
            location: guediawayeLocation,
            method: 'MWL'
        });

        // Vérifications de base
        expect(schedule.fajr.time).toBeInstanceOf(Date);
        expect(schedule.sunrise.time).toBeInstanceOf(Date);
        expect(schedule.dhuhr.time).toBeInstanceOf(Date);
        expect(schedule.asr.time).toBeInstanceOf(Date);
        expect(schedule.maghrib.time).toBeInstanceOf(Date);
        expect(schedule.isha.time).toBeInstanceOf(Date);

        // Vérifier que Fajr est avant le lever du soleil
        expect(schedule.fajr.time.getTime()).toBeLessThan(schedule.sunrise.time.getTime());

        // Vérifier que le lever du soleil est avant Dhuhr
        expect(schedule.sunrise.time.getTime()).toBeLessThan(schedule.dhuhr.time.getTime());

        // Vérifier que Dhuhr est avant Asr
        expect(schedule.dhuhr.time.getTime()).toBeLessThan(schedule.asr.time.getTime());

        // Vérifier que Asr est avant Maghrib
        expect(schedule.asr.time.getTime()).toBeLessThan(schedule.maghrib.time.getTime());

        // Vérifier que Maghrib est avant Isha
        expect(schedule.maghrib.time.getTime()).toBeLessThan(schedule.isha.time.getTime());

        // Vérifier les plages horaires - CONTRAINTES AJOUTÉES
        expect(schedule.fajr.start.getTime()).toBeLessThanOrEqual(schedule.fajr.end.getTime());
        expect(schedule.dhuhr.start.getTime()).toBeLessThanOrEqual(schedule.dhuhr.end.getTime());
        expect(schedule.asr.start.getTime()).toBeLessThanOrEqual(schedule.asr.end.getTime());
        expect(schedule.maghrib.start.getTime()).toBeLessThanOrEqual(schedule.maghrib.end.getTime());
        expect(schedule.isha.start.getTime()).toBeLessThanOrEqual(schedule.isha.end.getTime());

        // Vérifier que les heures de prière sont dans leurs plages respectives
        expect(schedule.fajr.time.getTime()).toBeGreaterThanOrEqual(schedule.fajr.start.getTime());
        expect(schedule.fajr.time.getTime()).toBeLessThanOrEqual(schedule.fajr.end.getTime());

        expect(schedule.dhuhr.time.getTime()).toBeGreaterThanOrEqual(schedule.dhuhr.start.getTime());
        expect(schedule.dhuhr.time.getTime()).toBeLessThanOrEqual(schedule.dhuhr.end.getTime());

        expect(schedule.asr.time.getTime()).toBeGreaterThanOrEqual(schedule.asr.start.getTime());
        expect(schedule.asr.time.getTime()).toBeLessThanOrEqual(schedule.asr.end.getTime());

        expect(schedule.maghrib.time.getTime()).toBeGreaterThanOrEqual(schedule.maghrib.start.getTime());
        expect(schedule.maghrib.time.getTime()).toBeLessThanOrEqual(schedule.maghrib.end.getTime());

        expect(schedule.isha.time.getTime()).toBeGreaterThanOrEqual(schedule.isha.start.getTime());
        expect(schedule.isha.time.getTime()).toBeLessThanOrEqual(schedule.isha.end.getTime());
    });

    test('devrait calculer des heures différentes avec différentes méthodes', () => {
        const mwlSchedule = getPrayerSchedule({
            date: testDate,
            location: guediawayeLocation,
            method: 'MWL'
        });

        const isnaSchedule = getPrayerSchedule({
            date: testDate,
            location: guediawayeLocation,
            method: 'ISNA'
        });

        // Les heures devraient être différentes entre MWL et ISNA
        expect(mwlSchedule.fajr.time.getTime()).not.toBe(isnaSchedule.fajr.time.getTime());
        expect(mwlSchedule.isha.time.getTime()).not.toBe(isnaSchedule.isha.time.getTime());
    });

    test('devrait gérer le fuseau horaire correctement', () => {
        const schedule = getPrayerSchedule({
            date: testDate,
            location: guediawayeLocation,
            method: 'MWL'
        });

        // Vérifier que les heures sont dans le bon fuseau horaire (UTC pour le Sénégal)
        const fajrHour = schedule.fajr.time.getUTCHours();
        const sunriseHour = schedule.sunrise.time.getUTCHours();
        const dhuhrHour = schedule.dhuhr.time.getUTCHours();
        const asrHour = schedule.asr.time.getUTCHours();
        const maghribHour = schedule.maghrib.time.getUTCHours();
        const ishaHour = schedule.isha.time.getUTCHours();

        // Fajr devrait être tôt le matin (entre 4h et 7h UTC)
        expect(fajrHour).toBeGreaterThanOrEqual(4);
        expect(fajrHour).toBeLessThan(8);

        // Lever du soleil devrait être le matin (entre 6h et 8h UTC)
        expect(sunriseHour).toBeGreaterThanOrEqual(6);
        expect(sunriseHour).toBeLessThan(9);

        // Dhuhr devrait être vers midi (entre 11h et 14h UTC)
        expect(dhuhrHour).toBeGreaterThanOrEqual(11);
        expect(dhuhrHour).toBeLessThan(15);

        // Asr devrait être l'après-midi (entre 14h et 18h UTC)
        expect(asrHour).toBeGreaterThanOrEqual(14);
        expect(asrHour).toBeLessThan(19);

        // Maghrib devrait être le soir (entre 18h et 21h UTC)
        expect(maghribHour).toBeGreaterThanOrEqual(18);
        expect(maghribHour).toBeLessThan(22);

        // Isha devrait être le soir/nuit (entre 19h et 23h UTC)
        expect(ishaHour).toBeGreaterThanOrEqual(19);
        expect(ishaHour).toBeLessThan(24);
    });

    test('devrait avoir des plages horaires logiques et cohérentes', () => {
        const schedule = getPrayerSchedule({
            date: testDate,
            location: guediawayeLocation,
            method: 'MWL'
        });

        // Vérifier que les plages ne se chevauchent pas de manière illogique
        // Fajr se termine au lever du soleil
        expect(schedule.fajr.end.getTime()).toBe(schedule.sunrise.time.getTime());

        // Dhuhr se termine au début d'Asr
        expect(schedule.dhuhr.end.getTime()).toBe(schedule.asr.start.getTime());

        // Asr se termine au coucher du soleil (Maghrib)
        expect(schedule.asr.end.getTime()).toBe(schedule.maghrib.start.getTime());

        // Maghrib se termine 20 minutes après son début
        const maghribDuration = schedule.maghrib.end.getTime() - schedule.maghrib.start.getTime();
        expect(maghribDuration).toBe(20 * 60 * 1000); // 20 minutes en millisecondes

        // Isha commence à la fin de Maghrib et se termine à Fajr du lendemain
        expect(schedule.isha.start.getTime()).toBe(schedule.maghrib.end.getTime());
    });

    test('devrait valider les heures d\'Asr pour différentes méthodes', () => {
        const methods = ['MWL', 'ISNA', 'JAFARI'];

        methods.forEach(method => {
            const schedule = getPrayerSchedule({
                date: testDate,
                location: guediawayeLocation,
                method: method
            });

            const asrHour = schedule.asr.time.getUTCHours();
            const asrMinutes = schedule.asr.time.getUTCMinutes();

            // Asr doit être l'après-midi (entre 14h et 18h UTC)
            expect(asrHour).toBeGreaterThanOrEqual(14);
            expect(asrHour).toBeLessThan(19);

            // Vérifier que l'heure d'Asr est logique (pas 22h48!)
            expect(asrHour).toBeLessThan(22);

            console.log(`${method} Asr: ${asrHour.toString().padStart(2, '0')}:${asrMinutes.toString().padStart(2, '0')}`);
        });
    });
}); 