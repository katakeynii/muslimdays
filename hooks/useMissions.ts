import { useCallback, useEffect, useState } from 'react';
import { MissionService } from '../services/supabase';
import { CreateMissionData, Mission, UpdateMissionData } from '../types';

/**
 * Hook personnalisé pour gérer les missions de vie
 */
export const useMissions = () => {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charge toutes les missions
     */
    const loadMissions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const allMissions = await MissionService.getAllMissions();
            setMissions(allMissions);
        } catch (err) {
            setError('Erreur lors du chargement des missions');
            console.error('Erreur dans loadMissions:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crée une nouvelle mission
     */
    const createMission = useCallback(async (data: CreateMissionData): Promise<Mission | null> => {
        try {
            setError(null);
            const newMission = await MissionService.createMission(data);
            setMissions(prev => [...prev, newMission]);
            return newMission;
        } catch (err) {
            setError('Erreur lors de la création de la mission');
            console.error('Erreur dans createMission:', err);
            return null;
        }
    }, []);

    /**
     * Met à jour une mission existante
     */
    const updateMission = useCallback(async (id: string, data: UpdateMissionData): Promise<Mission | null> => {
        try {
            setError(null);
            const updatedMission = await MissionService.updateMission(id, data);
            if (updatedMission) {
                setMissions(prev =>
                    prev.map(mission =>
                        mission.id === id ? updatedMission : mission
                    )
                );
            }
            return updatedMission;
        } catch (err) {
            setError('Erreur lors de la mise à jour de la mission');
            console.error('Erreur dans updateMission:', err);
            return null;
        }
    }, []);

    /**
     * Supprime une mission
     */
    const deleteMission = useCallback(async (id: string): Promise<boolean> => {
        try {
            setError(null);
            const success = await MissionService.deleteMission(id);
            if (success) {
                setMissions(prev => prev.filter(mission => mission.id !== id));
            }
            return success;
        } catch (err) {
            setError('Erreur lors de la suppression de la mission');
            console.error('Erreur dans deleteMission:', err);
            return false;
        }
    }, []);

    /**
     * Active ou désactive une mission
     */
    const toggleMissionStatus = useCallback(async (id: string): Promise<Mission | null> => {
        try {
            setError(null);
            const updatedMission = await MissionService.toggleMissionStatus(id);
            if (updatedMission) {
                setMissions(prev =>
                    prev.map(mission =>
                        mission.id === id ? updatedMission : mission
                    )
                );
            }
            return updatedMission;
        } catch (err) {
            setError('Erreur lors du changement de statut de la mission');
            console.error('Erreur dans toggleMissionStatus:', err);
            return null;
        }
    }, []);

    /**
     * Récupère une mission par son ID
     */
    const getMissionById = useCallback((id: string): Mission | undefined => {
        return missions.find(mission => mission.id === id);
    }, [missions]);

    /**
     * Récupère les missions actives
     */
    const getActiveMissions = useCallback((): Mission[] => {
        return missions.filter(mission => mission.isActive);
    }, [missions]);

    /**
     * Récupère les missions inactives
     */
    const getInactiveMissions = useCallback((): Mission[] => {
        return missions.filter(mission => !mission.isActive);
    }, [missions]);

    /**
     * Efface toutes les missions
     */
    const clearAllMissions = useCallback(async (): Promise<void> => {
        try {
            setError(null);
            await MissionService.clearAllMissions();
            setMissions([]);
        } catch (err) {
            setError('Erreur lors de la suppression de toutes les missions');
            console.error('Erreur dans clearAllMissions:', err);
        }
    }, []);

    // Charge les missions au montage du composant
    useEffect(() => {
        loadMissions();
    }, [loadMissions]);

    return {
        // État
        missions,
        loading,
        error,

        // Actions
        loadMissions,
        createMission,
        updateMission,
        deleteMission,
        toggleMissionStatus,
        clearAllMissions,

        // Getters
        getMissionById,
        getActiveMissions,
        getInactiveMissions,
    };
}; 