import { supabase } from '../../lib/supabase/supabase/client';
import { Database } from '../../lib/supabase/types/database';
import { CreateMissionData, Mission, UpdateMissionData } from '../../types';

type MissionRow = Database['public']['Tables']['missions']['Row'];
type MissionInsert = Database['public']['Tables']['missions']['Insert'];
type MissionUpdate = Database['public']['Tables']['missions']['Update'];

/**
 * Convertit une mission Supabase (snake_case) en Mission (camelCase)
 */
function mapMissionFromSupabase(row: MissionRow): Mission {
    return {
        id: row.id,
        title: row.title,
        description: row.description || undefined,
        vision: row.success_vision || undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        isActive: row.active,
    };
}

/**
 * Convertit CreateMissionData en format Supabase
 */
function mapMissionToSupabase(data: CreateMissionData, userId: string): MissionInsert {
    return {
        user_id: userId,
        title: data.title,
        description: data.description || null,
        success_vision: data.vision || null,
        active: true,
    };
}

/**
 * Convertit UpdateMissionData en format Supabase
 */
function mapMissionUpdateToSupabase(data: UpdateMissionData): MissionUpdate {
    const update: MissionUpdate = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description || null;
    if (data.vision !== undefined) update.success_vision = data.vision || null;
    return update;
}

/**
 * Service de gestion des missions avec Supabase
 */
export class SupabaseMissionService {
    /**
     * Récupère toutes les missions de l'utilisateur connecté
     */
    static async getAllMissions(): Promise<Mission[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return (data || []).map(mapMissionFromSupabase);
        } catch (error) {
            console.error('Erreur lors de la récupération des missions:', error);
            throw error;
        }
    }

    /**
     * Récupère une mission par son ID
     */
    static async getMissionById(id: string): Promise<Mission | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data ? mapMissionFromSupabase(data) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de la mission:', error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle mission
     */
    static async createMission(data: CreateMissionData): Promise<Mission> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const insertData = mapMissionToSupabase(data, user.id);

            const { data: newMission, error } = await supabase
                .from('missions')
                // @ts-expect-error - Type inference issue with Supabase client
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return mapMissionFromSupabase(newMission);
        } catch (error) {
            console.error('Erreur lors de la création de la mission:', error);
            throw error;
        }
    }

    /**
     * Met à jour une mission existante
     */
    static async updateMission(id: string, data: UpdateMissionData): Promise<Mission | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const updateData = mapMissionUpdateToSupabase(data);

            const { data: updatedMission, error } = await supabase
                .from('missions')
                // @ts-expect-error - Type inference issue with Supabase client
                .update(updateData)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return updatedMission ? mapMissionFromSupabase(updatedMission) : null;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la mission:', error);
            throw error;
        }
    }

    /**
     * Supprime une mission
     */
    static async deleteMission(id: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { error } = await supabase
                .from('missions')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de la mission:', error);
            throw error;
        }
    }

    /**
     * Active ou désactive une mission
     */
    static async toggleMissionStatus(id: string): Promise<Mission | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Récupérer la mission actuelle
            const current = await this.getMissionById(id);
            if (!current) {
                return null;
            }

            // Inverser le statut
            const { data: updatedMission, error } = await supabase
                .from('missions')
                // @ts-expect-error - Type inference issue with Supabase client
                .update({ active: !current.isActive })
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return updatedMission ? mapMissionFromSupabase(updatedMission) : null;
        } catch (error) {
            console.error('Erreur lors du changement de statut de la mission:', error);
            throw error;
        }
    }

    /**
     * Supprime toutes les missions de l'utilisateur
     */
    static async clearAllMissions(): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { error } = await supabase
                .from('missions')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de toutes les missions:', error);
            throw error;
        }
    }
}

