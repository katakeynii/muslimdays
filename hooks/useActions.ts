import { useCallback, useEffect, useState } from 'react';
import { ActionService } from '../services/supabase';
import { Action, CreateActionData, UpdateActionData } from '../types';

/**
 * Hook personnalisé pour gérer les actions
 */
export const useActions = () => {
    const [actions, setActions] = useState<Action[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charge toutes les actions
     */
    const loadActions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allActions = await ActionService.getAllActions();
            setActions(allActions);
        } catch (err) {
            setError('Erreur lors du chargement des actions');
            console.error('Erreur dans loadActions:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crée une nouvelle action
     */
    const createAction = useCallback(async (data: CreateActionData): Promise<Action | null> => {
        try {
            setError(null);
            const newAction = await ActionService.createAction(data);
            setActions(prev => [...prev, newAction]);
            return newAction;
        } catch (err) {
            setError('Erreur lors de la création de l\'action');
            console.error('Erreur dans createAction:', err);
            return null;
        }
    }, []);

    /**
     * Met à jour une action existante
     */
    const updateAction = useCallback(async (id: string, data: UpdateActionData): Promise<Action | null> => {
        try {
            setError(null);
            const updatedAction = await ActionService.updateAction(id, data);
            if (updatedAction) {
                setActions(prev =>
                    prev.map(action =>
                        action.id === id ? updatedAction : action
                    )
                );
            }
            return updatedAction;
        } catch (err) {
            setError('Erreur lors de la mise à jour de l\'action');
            console.error('Erreur dans updateAction:', err);
            return null;
        }
    }, []);

    /**
     * Supprime une action
     */
    const deleteAction = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const success = await ActionService.deleteAction(id);
            if (success) {
                setActions(prev => prev.filter(action => action.id !== id));
            }
            return success;
        } catch (err) {
            setError('Erreur lors de la suppression de l\'action');
            console.error('Erreur dans deleteAction:', err);
            return false;
        }
    }, []);

    /**
     * Marque une action comme accomplie ou non
     */
    const toggleActionCompletion = useCallback(async (id: string): Promise<Action | null> => {
        try {
            setError(null);
            const updatedAction = await ActionService.toggleActionCompletion(id);
            if (updatedAction) {
                setActions(prev =>
                    prev.map(action =>
                        action.id === id ? updatedAction : action
                    )
                );
            }
            return updatedAction;
        } catch (err) {
            setError('Erreur lors du changement de statut de l\'action');
            console.error('Erreur dans toggleActionCompletion:', err);
            return null;
        }
    }, []);

    /**
     * Récupère une action par son ID
     */
    const getActionById = useCallback((id: string): Action | undefined => {
        return actions.find(action => action.id === id);
    }, [actions]);

    /**
     * Récupère les actions d'un objectif spécifique
     */
    const getActionsByObjectiveId = useCallback((objectiveId: string): Action[] => {
        return actions.filter(action => action.linkedObjectiveId === objectiveId);
    }, [actions]);

    /**
     * Récupère les actions pour une date spécifique
     */
    const getActionsByDate = useCallback(async (date: Date): Promise<Action[]> => {
        try {
            return await ActionService.getActionsByDate(date);
        } catch (err) {
            console.error('Erreur dans getActionsByDate:', err);
            // Fallback sur le filtrage local si la requête échoue
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);
            return actions.filter(action => {
                const actionDate = new Date(action.datetime);
                actionDate.setHours(0, 0, 0, 0);
                return actionDate.getTime() === targetDate.getTime();
            });
        }
    }, [actions]);

    /**
     * Récupère les actions accomplies
     */
    const getCompletedActions = useCallback((): Action[] => {
        return actions.filter(action => action.isCompleted);
    }, [actions]);

    /**
     * Récupère les actions non accomplies
     */
    const getPendingActions = useCallback((): Action[] => {
        return actions.filter(action => !action.isCompleted);
    }, [actions]);

    /**
     * Récupère les actions libres (non liées à un objectif)
     */
    const getFreeActions = useCallback((): Action[] => {
        return actions.filter(action => !action.linkedObjectiveId);
    }, [actions]);

    /**
     * Supprime toutes les actions liées à un objectif
     */
    const deleteActionsByObjectiveId = useCallback(async (objectiveId: string): Promise<boolean> => {
        try {
            setError(null);
            const success = await ActionService.deleteActionsByObjectiveId(objectiveId);
            if (success) {
                setActions(prev => prev.filter(action => action.linkedObjectiveId !== objectiveId));
            }
            return success;
        } catch (err) {
            setError('Erreur lors de la suppression des actions de l\'objectif');
            console.error('Erreur dans deleteActionsByObjectiveId:', err);
            return false;
        }
    }, []);

    /**
     * Efface toutes les actions
     */
    const clearAllActions = useCallback(async (): Promise<void> => {
        try {
            setError(null);
            await ActionService.clearAllActions();
            setActions([]);
        } catch (err) {
            setError('Erreur lors de la suppression de toutes les actions');
            console.error('Erreur dans clearAllActions:', err);
        }
    }, []);

    // Charge les actions au montage du composant
    useEffect(() => {
        loadActions();
    }, [loadActions]);

    return {
        // État
        actions,
        loading,
        error,

        // Actions
        loadActions,
        createAction,
        updateAction,
        deleteAction,
        toggleActionCompletion,
        deleteActionsByObjectiveId,
        clearAllActions,

        // Getters
        getActionById,
        getActionsByObjectiveId,
        getActionsByDate,
        getCompletedActions,
        getPendingActions,
        getFreeActions,
    };
}; 