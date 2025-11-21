import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateObjectiveData, Objective, UpdateObjectiveData } from '../types';

const OBJECTIVES_STORAGE_KEY = 'objectives';

/**
 * Service pour gérer les objectifs
 */
export class ObjectiveService {
    /**
     * Récupère tous les objectifs
     */
    static async getAllObjectives(): Promise<Objective[]> {
        try {
            const objectivesJson = await AsyncStorage.getItem(OBJECTIVES_STORAGE_KEY);
            if (objectivesJson) {
                const objectives = JSON.parse(objectivesJson);
                // Convertir les dates string en objets Date
                return objectives.map((obj: any) => ({
                    ...obj,
                    dueDate: obj.dueDate ? new Date(obj.dueDate) : undefined,
                    createdAt: new Date(obj.createdAt),
                    updatedAt: new Date(obj.updatedAt),
                }));
            }
            return [];
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs:', error);
            throw new Error('Impossible de récupérer les objectifs');
        }
    }

    /**
     * Récupère les objectifs d'une mission spécifique
     */
    static async getObjectivesByMissionId(missionId: string): Promise<Objective[]> {
        try {
            const allObjectives = await this.getAllObjectives();
            return allObjectives.filter(objective => objective.missionId === missionId);
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs de la mission:', error);
            throw new Error('Impossible de récupérer les objectifs de la mission');
        }
    }

    /**
     * Récupère un objectif par son ID
     */
    static async getObjectiveById(id: string): Promise<Objective | null> {
        try {
            const allObjectives = await this.getAllObjectives();
            return allObjectives.find(objective => objective.id === id) || null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'objectif:', error);
            throw new Error('Impossible de récupérer l\'objectif');
        }
    }

    /**
     * Crée un nouvel objectif
     */
    static async createObjective(data: CreateObjectiveData): Promise<Objective> {
        try {
            const allObjectives = await this.getAllObjectives();

            const newObjective: Objective = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                missionId: data.missionId,
                title: data.title,
                description: data.description,
                dueDate: data.dueDate,
                termType: data.termType,
                isCompleted: false,
                isActive: false, // Désactivé par défaut
                successCriteria: data.successCriteria,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedObjectives = [...allObjectives, newObjective];
            await AsyncStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(updatedObjectives));

            return newObjective;
        } catch (error) {
            console.error('Erreur lors de la création de l\'objectif:', error);
            throw new Error('Impossible de créer l\'objectif');
        }
    }

    /**
     * Met à jour un objectif existant
     */
    static async updateObjective(id: string, data: UpdateObjectiveData): Promise<Objective | null> {
        try {
            const allObjectives = await this.getAllObjectives();
            const objectiveIndex = allObjectives.findIndex(obj => obj.id === id);

            if (objectiveIndex === -1) {
                return null;
            }

            const updatedObjective: Objective = {
                ...allObjectives[objectiveIndex],
                ...data,
                updatedAt: new Date(),
            };

            allObjectives[objectiveIndex] = updatedObjective;
            await AsyncStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(allObjectives));

            return updatedObjective;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'objectif:', error);
            throw new Error('Impossible de mettre à jour l\'objectif');
        }
    }

    /**
     * Supprime un objectif
     */
    static async deleteObjective(id: string): Promise<boolean> {
        try {
            const allObjectives = await this.getAllObjectives();
            const filteredObjectives = allObjectives.filter(obj => obj.id !== id);

            await AsyncStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(filteredObjectives));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'objectif:', error);
            throw new Error('Impossible de supprimer l\'objectif');
        }
    }

    /**
     * Marque un objectif comme terminé ou non terminé
     */
    static async toggleObjectiveCompletion(id: string): Promise<Objective | null> {
        try {
            const objective = await this.getObjectiveById(id);
            if (!objective) {
                return null;
            }

            return await this.updateObjective(id, { isCompleted: !objective.isCompleted });
        } catch (error) {
            console.error('Erreur lors du changement de statut de l\'objectif:', error);
            throw new Error('Impossible de changer le statut de l\'objectif');
        }
    }

    /**
     * Supprime tous les objectifs d'une mission
     */
    static async deleteObjectivesByMissionId(missionId: string): Promise<boolean> {
        try {
            const allObjectives = await this.getAllObjectives();
            const filteredObjectives = allObjectives.filter(obj => obj.missionId !== missionId);

            await AsyncStorage.setItem(OBJECTIVES_STORAGE_KEY, JSON.stringify(filteredObjectives));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression des objectifs de la mission:', error);
            throw new Error('Impossible de supprimer les objectifs de la mission');
        }
    }

    /**
     * Récupère les objectifs par type de terme
     */
    static async getObjectivesByTermType(termType: 'court' | 'moyen' | 'long'): Promise<Objective[]> {
        try {
            const allObjectives = await this.getAllObjectives();
            return allObjectives.filter(objective => objective.termType === termType);
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs par type:', error);
            throw new Error('Impossible de récupérer les objectifs par type');
        }
    }

    /**
     * Récupère les objectifs terminés
     */
    static async getCompletedObjectives(): Promise<Objective[]> {
        try {
            const allObjectives = await this.getAllObjectives();
            return allObjectives.filter(objective => objective.isCompleted);
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs terminés:', error);
            throw new Error('Impossible de récupérer les objectifs terminés');
        }
    }

    /**
     * Récupère les objectifs non terminés
     */
    static async getPendingObjectives(): Promise<Objective[]> {
        try {
            const allObjectives = await this.getAllObjectives();
            return allObjectives.filter(objective => !objective.isCompleted);
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs en attente:', error);
            throw new Error('Impossible de récupérer les objectifs en attente');
        }
    }

    /**
     * Efface tous les objectifs
     */
    static async clearAllObjectives(): Promise<void> {
        try {
            await AsyncStorage.removeItem(OBJECTIVES_STORAGE_KEY);
        } catch (error) {
            console.error('Erreur lors de la suppression de tous les objectifs:', error);
            throw new Error('Impossible de supprimer tous les objectifs');
        }
    }
} 