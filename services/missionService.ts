import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateMissionData, Mission, UpdateMissionData } from '../types';

/**
 * Service de gestion des missions de vie
 */
export class MissionService {
    private static readonly MISSION_KEY = 'missions';

    /**
     * Récupère toutes les missions
     */
    static async getAllMissions(): Promise<Mission[]> {
        try {
            const missionsString = await AsyncStorage.getItem(this.MISSION_KEY);
            if (missionsString) {
                const missions = JSON.parse(missionsString) as Mission[];
                // Convertir les dates string en objets Date
                return missions.map(mission => ({
                    ...mission,
                    createdAt: new Date(mission.createdAt),
                    updatedAt: new Date(mission.updatedAt),
                }));
            }
            return [];
        } catch (error) {
            console.error('Erreur lors de la récupération des missions:', error);
            return [];
        }
    }

    /**
     * Récupère une mission par son ID
     */
    static async getMissionById(id: string): Promise<Mission | null> {
        try {
            const missions = await this.getAllMissions();
            return missions.find(mission => mission.id === id) || null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la mission:', error);
            return null;
        }
    }

    /**
     * Crée une nouvelle mission
     */
    static async createMission(data: CreateMissionData): Promise<Mission> {
        try {
            const missions = await this.getAllMissions();
            const newMission: Mission = {
                id: this.generateId(),
                title: data.title,
                description: data.description || '',
                vision: data.vision || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true,
            };

            missions.push(newMission);
            await AsyncStorage.setItem(this.MISSION_KEY, JSON.stringify(missions));
            return newMission;
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error);
            throw new Error('Impossible de créer la mission');
        }
    }

    /**
     * Met à jour une mission existante
     */
    static async updateMission(id: string, data: UpdateMissionData): Promise<Mission | null> {
        try {
            const missions = await this.getAllMissions();
            const missionIndex = missions.findIndex(mission => mission.id === id);

            if (missionIndex === -1) {
                return null;
            }

            const updatedMission: Mission = {
                ...missions[missionIndex],
                ...data,
                updatedAt: new Date(),
            };

            missions[missionIndex] = updatedMission;
            await AsyncStorage.setItem(this.MISSION_KEY, JSON.stringify(missions));
            return updatedMission;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la mission:', error);
            throw new Error('Impossible de mettre à jour la mission');
        }
    }

    /**
     * Supprime une mission
     */
    static async deleteMission(id: string): Promise<boolean> {
        try {
            const missions = await this.getAllMissions();
            const filteredMissions = missions.filter(mission => mission.id !== id);

            if (filteredMissions.length === missions.length) {
                return false; // Mission non trouvée
            }

            await AsyncStorage.setItem(this.MISSION_KEY, JSON.stringify(filteredMissions));
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la mission:', error);
            throw new Error('Impossible de supprimer la mission');
        }
    }

    /**
     * Active ou désactive une mission
     */
    static async toggleMissionStatus(id: string): Promise<Mission | null> {
        try {
            const missions = await this.getAllMissions();
            const missionIndex = missions.findIndex(mission => mission.id === id);

            if (missionIndex === -1) {
                return null;
            }

            const updatedMission: Mission = {
                ...missions[missionIndex],
                isActive: !missions[missionIndex].isActive,
                updatedAt: new Date(),
            };

            missions[missionIndex] = updatedMission;
            await AsyncStorage.setItem(this.MISSION_KEY, JSON.stringify(missions));
            return updatedMission;
        } catch (error) {
            console.error('Erreur lors du changement de statut de la mission:', error);
            throw new Error('Impossible de changer le statut de la mission');
        }
    }

    /**
     * Supprime toutes les missions
     */
    static async clearAllMissions(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.MISSION_KEY);
        } catch (error) {
            console.error('Erreur lors de la suppression de toutes les missions:', error);
            throw new Error('Impossible de supprimer toutes les missions');
        }
    }

    /**
     * Génère un ID unique pour une mission
     */
    private static generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
} 