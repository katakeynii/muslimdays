/**
 * Utilitaires pour le formatage et la gestion du temps
 */

/**
 * Formate une date en heure locale (HH:MM)
 */
export function formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

/**
 * Formate une date en format complet (HH:MM:SS)
 */
export function formatTimeWithSeconds(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
}

/**
 * Formate une date en format court (HH:MM)
 */
export function formatTimeShort(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Formate une durée en millisecondes en format lisible
 */
export function formatDuration(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;


    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Formate une durée en format court pour l'affichage
 */
export function formatDurationShort(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

/**
 * Vérifie si l'heure actuelle se trouve entre deux heures données
 */
export function isCurrentTimeBetween(start: Date, end: Date): boolean {
    const now = new Date();
    return now >= start && now <= end;
}

/**
 * Calcule la différence en minutes entre deux dates
 */
export function getMinutesDifference(date1: Date, date2: Date): number {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffMs / (1000 * 60));
}

/**
 * Calcule la différence en heures entre deux dates
 */
export function getHoursDifference(date1: Date, date2: Date): number {
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(diffMs / (1000 * 60 * 60));
}

/**
 * Formate une date en format français
 */
export function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Formate une date en format court
 */
export function formatDateShort(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Vérifie si deux dates sont le même jour
 */
export function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

/**
 * Obtient le nom du jour de la semaine en français
 */
export function getDayName(date: Date): string {
    const days = [
        'Dimanche',
        'Lundi',
        'Mardi',
        'Mercredi',
        'Jeudi',
        'Vendredi',
        'Samedi'
    ];
    return days[date.getDay()];
}

/**
 * Obtient le nom du mois en français
 */
export function getMonthName(date: Date): string {
    const months = [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre'
    ];
    return months[date.getMonth()];
}

/**
 * Convertit une date grégorienne en date islamique
 */
export function gregorianToIslamic(date: Date): { day: number; month: number; year: number } {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Algorithme de conversion approximatif
    const jd = Math.floor((365.25 * (year + 4716))) + Math.floor((30.6001 * (month + 1))) + day - 1524.5;
    const l = jd + 68569;
    const n = Math.floor((4 * l) / 146097);
    const l1 = l - Math.floor((146097 * n + 3) / 4);
    const i = Math.floor((4000 * (l1 + 1)) / 1461001);
    const l2 = l1 - Math.floor((1461 * i) / 4) + 31;
    const j = Math.floor((80 * l2) / 2447);
    const l3 = l2 - Math.floor((2447 * j) / 80);
    const l4 = Math.floor((j + 1) / 11);
    const l5 = l3 + 30 * l4;
    const l6 = Math.floor((l5 + 106) / 30);
    const l7 = Math.floor((l5 + 106) % 30);
    const l8 = Math.floor((l6 + 9) / 12);
    const l9 = l6 - 12 * l8;
    const l10 = l9 + 1;
    const l11 = l7 + 1;
    const l12 = l10 + 1;

    return {
        day: l11,
        month: l10,
        year: l12
    };
}

/**
 * Obtient le nom du mois islamique en français
 */
export function getIslamicMonthName(month: number): string {
    const months = [
        'Muharram',
        'Safar',
        'Rabi al-Awwal',
        'Rabi al-Thani',
        'Jumada al-Awwal',
        'Jumada al-Thani',
        'Rajab',
        'Sha\'ban',
        'Ramadan',
        'Shawwal',
        'Dhu al-Qadah',
        'Dhu al-Hijjah'
    ];
    return months[month - 1];
}

/**
 * Formate une date islamique
 */
export function formatIslamicDate(date: Date): string {
    const islamic = gregorianToIslamic(date);
    const monthName = getIslamicMonthName(islamic.month);
    return `${islamic.day} ${monthName} ${islamic.year}`;
}

/**
 * Calcule le temps restant pour une prière en cours
 * @param schedule - L'emploi du temps des prières
 * @param currentPrayer - La prière actuellement en cours
 * @returns Le temps restant en millisecondes, ou 0 si la prière n'est pas en cours
 */
export function getRemainingTime(schedule: any, currentPrayer: string | null): number {
    if (!currentPrayer) return 0;

    const now = new Date();
    const currentTime = now.getTime();

    // Obtenir l'heure de fin de l'intervalle de la prière actuelle
    let prayerEndTime: Date;

    switch (currentPrayer) {
        case 'fajr':
            // Fajr se termine au lever du soleil
            prayerEndTime = schedule.fajr.end;
            break;
        case 'sunrise':
            // Sunrise n'a pas d'intervalle propre, on utilise Dhuhr
            prayerEndTime = schedule.dhuhr.end;
            break;
        case 'dhuhr':
            // Dhuhr se termine 2h30 après son début
            prayerEndTime = schedule.dhuhr.end;
            break;
        case 'asr':
            // Asr se termine au coucher du soleil (Maghrib)
            prayerEndTime = schedule.asr.end;
            break;
        case 'maghrib':
            // Maghrib se termine 20 minutes après le coucher
            prayerEndTime = schedule.maghrib.end;
            break;
        case 'isha':
            // Isha se termine au Fajr du lendemain
            prayerEndTime = schedule.isha.end;
            break;
        default:
            return 0;
    }

    const timeRemaining = Math.max(0, prayerEndTime.getTime() - currentTime);
    return timeRemaining;
} 