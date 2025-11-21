import { useCallback, useEffect, useState } from 'react';
import { ObjectiveService } from '../services/supabase';
import { CreateObjectiveData, Objective, ObjectiveTermType, UpdateObjectiveData } from '../types';

/**
 * Hook personnalisé pour gérer les objectifs
 */
export const useObjectives = () => {
    const [objectives, setObjectives] = useState<Objective[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charge tous les objectifs
     */
    const loadObjectives = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allObjectives = await ObjectiveService.getAllObjectives();
            setObjectives(allObjectives);
        } catch (err) {
            setError('Erreur lors du chargement des objectifs');
            console.error('Erreur dans loadObjectives:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crée un nouvel objectif
     */
    const createObjective = useCallback(async (data: CreateObjectiveData): Promise<Objective | null> => {
        try {
            setError(null);
            const newObjective = await ObjectiveService.createObjective(data);
            setObjectives(prev => [...prev, newObjective]);
            return newObjective;
        } catch (err) {
            setError('Erreur lors de la création de l\'objectif');
            console.error('Erreur dans createObjective:', err);
            return null;
        }
    }, []);

    /**
     * Met à jour un objectif existant
     */
    const updateObjective = useCallback(async (id: string, data: UpdateObjectiveData): Promise<Objective | null> => {
        try {
            setError(null);
            const updatedObjective = await ObjectiveService.updateObjective(id, data);
            if (updatedObjective) {
                setObjectives(prev =>
                    prev.map(objective =>
                        objective.id === id ? updatedObjective : objective
                    )
                );
            }
            return updatedObjective;
        } catch (err) {
            setError('Erreur lors de la mise à jour de l\'objectif');
            console.error('Erreur dans updateObjective:', err);
            return null;
        }
    }, []);

    /**
     * Supprime un objectif
     */
    const deleteObjective = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const success = await ObjectiveService.deleteObjective(id);
            if (success) {
                setObjectives(prev => prev.filter(objective => objective.id !== id));
            }
            return success;
        } catch (err) {
            setError('Erreur lors de la suppression de l\'objectif');
            console.error('Erreur dans deleteObjective:', err);
            return false;
        }
    }, []);

    /**
     * Marque un objectif comme terminé ou non terminé
     */
    const toggleObjectiveCompletion = useCallback(async (id: string): Promise<Objective | null> => {
        try {
            setError(null);
            const updatedObjective = await ObjectiveService.toggleObjectiveCompletion(id);
            if (updatedObjective) {
                setObjectives(prev =>
                    prev.map(objective =>
                        objective.id === id ? updatedObjective : objective
                    )
                );
            }
            return updatedObjective;
        } catch (err) {
            setError('Erreur lors du changement de statut de l\'objectif');
            console.error('Erreur dans toggleObjectiveCompletion:', err);
            return null;
        }
    }, []);

    /**
     * Récupère un objectif par son ID
     */
    const getObjectiveById = useCallback((id: string): Objective | undefined => {
        return objectives.find(objective => objective.id === id);
    }, [objectives]);

    /**
     * Récupère les objectifs d'une mission spécifique
     */
    const getObjectivesByMissionId = useCallback((missionId: string): Objective[] => {
        return objectives.filter(objective => objective.missionId === missionId);
    }, [objectives]);

    /**
     * Récupère les objectifs par type de terme
     */
    const getObjectivesByTermType = useCallback((termType: ObjectiveTermType): Objective[] => {
        return objectives.filter(objective => objective.termType === termType);
    }, [objectives]);

    /**
     * Récupère les objectifs terminés
     */
    const getCompletedObjectives = useCallback((): Objective[] => {
        return objectives.filter(objective => objective.isCompleted);
    }, [objectives]);

    /**
     * Récupère les objectifs non terminés
     */
    const getPendingObjectives = useCallback((): Objective[] => {
        return objectives.filter(objective => !objective.isCompleted);
    }, [objectives]);

    /**
     * Supprime tous les objectifs d'une mission
     */
    const deleteObjectivesByMissionId = useCallback(async (missionId: string): Promise<boolean> => {
        try {
            setError(null);
            const success = await ObjectiveService.deleteObjectivesByMissionId(missionId);
            if (success) {
                setObjectives(prev => prev.filter(objective => objective.missionId !== missionId));
            }
            return success;
        } catch (err) {
            setError('Erreur lors de la suppression des objectifs de la mission');
            console.error('Erreur dans deleteObjectivesByMissionId:', err);
            return false;
        }
    }, []);

    /**
     * Efface tous les objectifs
     */
    const clearAllObjectives = useCallback(async (): Promise<void> => {
        try {
            setError(null);
            await ObjectiveService.clearAllObjectives();
            setObjectives([]);
        } catch (err) {
            setError('Erreur lors de la suppression de tous les objectifs');
            console.error('Erreur dans clearAllObjectives:', err);
        }
    }, []);

    // Charge les objectifs au montage du composant
    useEffect(() => {
        loadObjectives();
    }, [loadObjectives]);

    return {
        // État
        objectives,
        loading,
        error,

        // Actions
        loadObjectives,
        createObjective,
        updateObjective,
        deleteObjective,
        toggleObjectiveCompletion,
        deleteObjectivesByMissionId,
        clearAllObjectives,

        // Getters
        getObjectiveById,
        getObjectivesByMissionId,
        getObjectivesByTermType,
        getCompletedObjectives,
        getPendingObjectives,
    };
}; 