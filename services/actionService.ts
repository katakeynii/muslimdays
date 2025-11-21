import AsyncStorage from '@react-native-async-storage/async-storage';
import { Action, CreateActionData, UpdateActionData } from '../types';

const ACTIONS_STORAGE_KEY = '@muslimday_actions';

/**
 * Service pour gérer les actions
 */
export class ActionService {
    /**
     * Récupère toutes les actions
     */
    static async getAllActions(): Promise<Action[]> {
        try {
            const actionsJson = await AsyncStorage.getItem(ACTIONS_STORAGE_KEY);
            if (!actionsJson) return [];

            const actions = JSON.parse(actionsJson);
            return actions.map((action: any) => ({
                ...action,
                datetime: new Date(action.datetime),
                createdAt: new Date(action.createdAt),
                updatedAt: new Date(action.updatedAt),
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des actions:', error);
            return [];
        }
    }

    /**
     * Récupère une action par son ID
     */
    static async getActionById(id: string): Promise<Action | null> {
        try {
            const actions = await this.getAllActions();
            const action = actions.find(a => a.id === id);
            return action || null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'action:', error);
            return null;
        }
    }

    /**
     * Crée une nouvelle action
     */
    static async createAction(data: CreateActionData): Promise<Action> {
        try {
            const actions = await this.getAllActions();
            const newAction: Action = {
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                ...data,
                isCompleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            actions.push(newAction);
            await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));

            return newAction;
        } catch (error) {
            console.error('Erreur lors de la création de l\'action:', error);
            throw new Error('Impossible de créer l\'action');
        }
    }

    /**
     * Met à jour une action existante
     */
    static async updateAction(id: string, data: UpdateActionData): Promise<Action | null> {
        try {
            const actions = await this.getAllActions();
            const actionIndex = actions.findIndex(a => a.id === id);

            if (actionIndex === -1) {
                return null;
            }

            const updatedAction: Action = {
                ...actions[actionIndex],
                ...data,
                updatedAt: new Date(),
            };

            actions[actionIndex] = updatedAction;
            await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));

            return updatedAction;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'action:', error);
            throw new Error('Impossible de mettre à jour l\'action');
        }
    }

    /**
     * Supprime une action
     */
    static async deleteAction(id: string): Promise<boolean> {
        try {
            const actions = await this.getAllActions();
            const filteredActions = actions.filter(a => a.id !== id);

            await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(filteredActions));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'action:', error);
            return false;
        }
    }

    /**
     * Marque une action comme accomplie ou non
     */
    static async toggleActionCompletion(id: string): Promise<Action | null> {
        try {
            const actions = await this.getAllActions();
            const actionIndex = actions.findIndex(a => a.id === id);

            if (actionIndex === -1) {
                return null;
            }

            const updatedAction: Action = {
                ...actions[actionIndex],
                isCompleted: !actions[actionIndex].isCompleted,
                updatedAt: new Date(),
            };

            actions[actionIndex] = updatedAction;
            await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(actions));

            return updatedAction;
        } catch (error) {
            console.error('Erreur lors du changement de statut de l\'action:', error);
            throw new Error('Impossible de changer le statut de l\'action');
        }
    }

    /**
     * Récupère les actions d'un objectif spécifique
     */
    static async getActionsByObjectiveId(objectiveId: string): Promise<Action[]> {
        try {
            const actions = await this.getAllActions();
            return actions.filter(a => a.linkedObjectiveId === objectiveId);
        } catch (error) {
            console.error('Erreur lors de la récupération des actions de l\'objectif:', error);
            return [];
        }
    }

    /**
     * Récupère les actions pour une date spécifique
     */
    static async getActionsByDate(date: Date): Promise<Action[]> {
        try {
            const actions = await this.getAllActions();
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);

            return actions.filter(action => {
                const actionDate = new Date(action.datetime);
                actionDate.setHours(0, 0, 0, 0);
                return actionDate.getTime() === targetDate.getTime();
            });
        } catch (error) {
            console.error('Erreur lors de la récupération des actions par date:', error);
            return [];
        }
    }

    /**
     * Récupère les actions accomplies
     */
    static async getCompletedActions(): Promise<Action[]> {
        try {
            const actions = await this.getAllActions();
            return actions.filter(a => a.isCompleted);
        } catch (error) {
            console.error('Erreur lors de la récupération des actions accomplies:', error);
            return [];
        }
    }

    /**
     * Récupère les actions non accomplies
     */
    static async getPendingActions(): Promise<Action[]> {
        try {
            const actions = await this.getAllActions();
            return actions.filter(a => !a.isCompleted);
        } catch (error) {
            console.error('Erreur lors de la récupération des actions en attente:', error);
            return [];
        }
    }

    /**
     * Supprime toutes les actions liées à un objectif
     */
    static async deleteActionsByObjectiveId(objectiveId: string): Promise<boolean> {
        try {
            const actions = await this.getAllActions();
            const filteredActions = actions.filter(a => a.linkedObjectiveId !== objectiveId);

            await AsyncStorage.setItem(ACTIONS_STORAGE_KEY, JSON.stringify(filteredActions));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression des actions de l\'objectif:', error);
            return false;
        }
    }

    /**
     * Efface toutes les actions
     */
    static async clearAllActions(): Promise<void> {
        try {
            await AsyncStorage.removeItem(ACTIONS_STORAGE_KEY);
        } catch (error) {
            console.error('Erreur lors de la suppression de toutes les actions:', error);
            throw new Error('Impossible de supprimer toutes les actions');
        }
    }
} 