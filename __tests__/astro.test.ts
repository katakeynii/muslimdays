import {
    getAsrTime,
    getDhuhrTime,
    getFajrTime,
    getIshaTime,
    getJulianDate,
    getMaghribTime,
    getPrayerTimeAtAngle,
    getSunCoordinates,
    getSunriseTime,
    getSunsetTime,
} from '../lib/astro';

describe('Calculs astronomiques', () => {
    const testDate = new Date('2024-01-15T12:00:00Z');
    const testLocation = { latitude: 48.8566, longitude: 2.3522 }; // Paris

    describe('getJulianDate', () => {
        it('devrait calculer correctement le jour julien', () => {
            const jd = getJulianDate(testDate);
            expect(jd).toBeCloseTo(2460326.0, 1);
        });
    });

    describe('getSunCoordinates', () => {
        it('devrait retourner des coordonnées solaires valides', () => {
            const coords = getSunCoordinates(testDate);

            expect(coords.declination).toBeDefined();
            expect(coords.equationOfTime).toBeDefined();
            expect(typeof coords.declination).toBe('number');
            expect(typeof coords.equationOfTime).toBe('number');

            // La déclinaison doit être entre -23.5 et 23.5 degrés
            expect(coords.declination).toBeGreaterThanOrEqual(-23.5);
            expect(coords.declination).toBeLessThanOrEqual(23.5);
        });
    });

    describe('getPrayerTimeAtAngle', () => {
        it('devrait calculer l\'heure de prière pour un angle donné', () => {
            const prayerTime = getPrayerTimeAtAngle(testDate, testLocation, 18, false);

            expect(prayerTime).toBeInstanceOf(Date);
            expect(prayerTime.getTime()).toBeGreaterThan(0);
        });

        it('devrait gérer les angles invalides', () => {
            expect(() => {
                getPrayerTimeAtAngle(testDate, { latitude: 90, longitude: 0 }, 18, false);
            }).toThrow();
        });
    });

    describe('getFajrTime', () => {
        it('devrait calculer l\'heure de Fajr', () => {
            const fajrTime = getFajrTime(testDate, testLocation, 18);

            expect(fajrTime).toBeInstanceOf(Date);
            expect(fajrTime.getHours()).toBeGreaterThanOrEqual(0);
            expect(fajrTime.getHours()).toBeLessThan(12); // Fajr est toujours le matin
        });
    });

    describe('getDhuhrTime', () => {
        it('devrait calculer l\'heure de Dhuhr (midi solaire)', () => {
            const dhuhrTime = getDhuhrTime(testDate, testLocation);

            expect(dhuhrTime).toBeInstanceOf(Date);
            expect(dhuhrTime.getHours()).toBeGreaterThanOrEqual(11);
            expect(dhuhrTime.getHours()).toBeLessThanOrEqual(13); // Dhuhr est proche de midi
        });
    });

    describe('getAsrTime', () => {
        it('devrait calculer l\'heure d\'Asr', () => {
            const asrTime = getAsrTime(testDate, testLocation, 1);

            expect(asrTime).toBeInstanceOf(Date);
            expect(asrTime.getHours()).toBeGreaterThan(12); // Asr est après midi
        });
    });

    describe('getMaghribTime', () => {
        it('devrait calculer l\'heure de Maghrib', () => {
            const maghribTime = getMaghribTime(testDate, testLocation, 0.833);

            expect(maghribTime).toBeInstanceOf(Date);
            expect(maghribTime.getHours()).toBeGreaterThan(12); // Maghrib est l'après-midi/soir
        });
    });

    describe('getIshaTime', () => {
        it('devrait calculer l\'heure d\'Isha avec un angle', () => {
            const maghribTime = getMaghribTime(testDate, testLocation, 0.833);
            const ishaTime = getIshaTime(testDate, testLocation, maghribTime, 17);

            expect(ishaTime).toBeInstanceOf(Date);
            expect(ishaTime.getTime()).toBeGreaterThan(maghribTime.getTime());
        });

        it('devrait calculer l\'heure d\'Isha avec un intervalle', () => {
            const maghribTime = getMaghribTime(testDate, testLocation, 0.833);
            const ishaTime = getIshaTime(testDate, testLocation, maghribTime, undefined, 90);

            expect(ishaTime).toBeInstanceOf(Date);
            expect(ishaTime.getTime()).toBeGreaterThan(maghribTime.getTime());
        });
    });

    describe('getSunriseTime et getSunsetTime', () => {
        it('devrait calculer les heures de lever et coucher du soleil', () => {
            const sunriseTime = getSunriseTime(testDate, testLocation);
            const sunsetTime = getSunsetTime(testDate, testLocation);

            expect(sunriseTime).toBeInstanceOf(Date);
            expect(sunsetTime).toBeInstanceOf(Date);
            expect(sunriseTime.getTime()).toBeLessThan(sunsetTime.getTime());
        });
    });
}); 