const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const sinDeg = (d) => Math.sin(d * DEG_TO_RAD);
const cosDeg = (d) => Math.cos(d * DEG_TO_RAD);
const tanDeg = (d) => Math.tan(d * DEG_TO_RAD);
const arcsinDeg = (x) => Math.asin(x) * RAD_TO_DEG;
const arccosDeg = (x) => Math.acos(x) * RAD_TO_DEG;
const arctanDeg = (x) => Math.atan(x) * RAD_TO_DEG;

class SolarCalculator {
    static getJulianDate(date) {
        const Y = date.getUTCFullYear();
        const M = date.getUTCMonth() + 1;
        const D = date.getUTCDate();
        const UT = date.getUTCHours() + date.getUTCMinutes() / 60;

        let A = Math.floor((14 - M) / 12);
        let y = Y + 4800 - A;
        let m = M + 12 * A - 3;

        return D + Math.floor((153 * m + 2) / 5) + 365 * y
            + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + UT / 24;
    }

    static getSunCoordinates(julianDate) {
        const D = julianDate - 2451545.0;
        const g = 357.529 + 0.98560028 * D; // mean anomaly
        const q = 280.459 + 0.98564736 * D; // mean longitude
        const L = q + 1.915 * sinDeg(g) + 0.020 * sinDeg(2 * g); // ecliptic longitude
        const e = 23.439 - 0.00000036 * D; // obliquity

        const RA = arctanDeg(cosDeg(e) * sinDeg(L) / cosDeg(L));
        const decl = arcsinDeg(sinDeg(e) * sinDeg(L));

        const EqT = q / 15 - RA / 15; // in hours

        return { decl, EqT };
    }
}

class PrayerTimeCalculator {
    constructor(latitude, longitude, timezone) {
        this.lat = latitude;
        this.lng = longitude;
        this.tz = timezone;
    }

    getTimeAtAngle(angle, decl, EqT, isMorning = true) {
        const H = arccosDeg(
            (-sinDeg(angle) - sinDeg(this.lat) * sinDeg(decl)) /
            (cosDeg(this.lat) * cosDeg(decl))
        );

        return 12 + (isMorning ? -H : H) / 15 - this.lng / 15 + EqT;
    }

    getAsrTime(decl, EqT, factor = 1) {
        const angle = arccosDeg(
            (sinDeg(Math.atan(1 / (factor + tanDeg(Math.abs(this.lat - decl))))))
        );

        return this.getTimeAtAngle(angle, decl, EqT, false);
    }

    calculate(date) {
        const JD = SolarCalculator.getJulianDate(date);
        const { decl, EqT } = SolarCalculator.getSunCoordinates(JD);

        const times = {
            fajr: this.getTimeAtAngle(18, decl, EqT, true),
            sunrise: this.getTimeAtAngle(0.833, decl, EqT, true),
            dhuhr: 12 - this.lng / 15 + EqT,
            asr: this.getAsrTime(decl, EqT, 1),
            maghrib: this.getTimeAtAngle(0.833, decl, EqT, false),
            isha: this.getTimeAtAngle(17, decl, EqT, false)
        };

        return this.formatTimes(times, date);
    }

    formatTimes(times, date) {
        const toTime = (floatHour) => {
            const h = Math.floor(floatHour);
            const m = Math.floor((floatHour - h) * 60);
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        return Object.fromEntries(
            Object.entries(times).map(([key, value]) => [key, toTime((value + this.tz) % 24)])
        );
    }
}
const latitude = 14.7167;  // Dakar
const longitude = -17.4677;
const timezone = 0;  // UTC (corriger selon ton besoin)

const calc = new PrayerTimeCalculator(latitude, longitude, timezone);
const today = new Date(); // date du jour

const prayerTimes = calc.calculate(today);
console.log("Heures de prière (MWL) à Dakar :");
console.log(prayerTimes);
