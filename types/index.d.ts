/**
 * Types globaux pour l'application MuslimDay
 */

declare global {
    // Types pour les prières
    type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

    // Types pour les méthodes de calcul
    type MethodKey = 'MWL' | 'ISNA' | 'UMM_AL_QURA' | 'EGYPT' | 'MAKKAH' | 'KARACHI' | 'TEHRAN' | 'JAFARI';

    // Interface pour les coordonnées géographiques
    interface Coordinates {
        latitude: number;
        longitude: number;
    }

    // Interface pour les informations de localisation
    interface LocationInfo {
        coordinates: Coordinates;
        cityName: string;
        country?: string;
    }

    // Interface pour les paramètres de calcul
    interface CalculationParams {
        date: Date;
        location: Coordinates;
        method: MethodKey;
    }

    // Interface pour les résultats de calcul
    interface CalculationResult {
        success: boolean;
        data?: any;
        error?: string;
    }

    // Types pour les missions de vie
    interface Mission {
        id: string;
        title: string;
        description?: string;
        vision?: string;
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
    }

    // Interface pour créer une nouvelle mission
    interface CreateMissionData {
        title: string;
        description?: string;
        vision?: string;
    }

    // Interface pour mettre à jour une mission
    interface UpdateMissionData {
        title?: string;
        description?: string;
        vision?: string;
    }

    // Types pour les objectifs
    type ObjectiveTermType = 'court' | 'moyen' | 'long';

    // Types pour la récurrence des actions
    type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

    interface Objective {
        id: string;
        missionId: string;
        title: string;
        description?: string;
        dueDate?: Date;
        termType: ObjectiveTermType;
        isCompleted: boolean;
        isActive: boolean; // Nouveau: indique si l'objectif est activé
        successCriteria?: string; // Nouveau: critères de réussite
        createdAt: Date;
        updatedAt: Date;
    }

    // Interface pour créer un nouvel objectif
    interface CreateObjectiveData {
        missionId: string;
        title: string;
        description?: string;
        dueDate?: Date;
        termType: ObjectiveTermType;
        successCriteria?: string;
    }

    // Interface pour mettre à jour un objectif
    interface UpdateObjectiveData {
        title?: string;
        description?: string;
        dueDate?: Date;
        termType?: ObjectiveTermType;
        isCompleted?: boolean;
        isActive?: boolean;
        successCriteria?: string;
    }

    // Types pour les actions
    interface Action {
        id: string;
        title: string;
        description?: string;
        datetime: Date;
        duration: number; // en minutes
        recurrence: RecurrenceType;
        linkedObjectiveId?: string; // optionnel
        isCompleted: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    // Interface pour créer une nouvelle action
    interface CreateActionData {
        title: string;
        description?: string;
        datetime: Date;
        duration: number;
        recurrence: RecurrenceType;
        linkedObjectiveId?: string;
    }

    // Interface pour mettre à jour une action
    interface UpdateActionData {
        title?: string;
        description?: string;
        datetime?: Date;
        duration?: number;
        recurrence?: RecurrenceType;
        linkedObjectiveId?: string;
        isCompleted?: boolean;
    }
}

// Export des types pour les missions, objectifs et actions
export type { Action, CreateActionData, CreateMissionData, CreateObjectiveData, Mission, Objective, ObjectiveTermType, RecurrenceType, UpdateActionData, UpdateMissionData, UpdateObjectiveData };

export { };

