import { supabase } from '../../lib/supabase/supabase/client';
import { Database } from '../../lib/supabase/types/database';
import { CreateObjectiveData, Objective, ObjectiveTermType, UpdateObjectiveData } from '../../types';

type ObjectiveRow = Database['public']['Tables']['objectives']['Row'];
type ObjectiveInsert = Database['public']['Tables']['objectives']['Insert'];
type ObjectiveUpdate = Database['public']['Tables']['objectives']['Update'];

/**
 * Convertit un objectif Supabase (snake_case) en Objective (camelCase)
 */
function mapObjectiveFromSupabase(row: ObjectiveRow): Objective {
    return {
        id: row.id,
        missionId: row.mission_id,
        title: row.title,
        description: row.description || undefined,
        dueDate: row.deadline ? new Date(row.deadline) : undefined,
        termType: row.term_type,
        isCompleted: row.completed,
        isActive: row.active,
        successCriteria: row.success_criteria ? JSON.stringify(row.success_criteria) : undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}

/**
 * Convertit CreateObjectiveData en format Supabase
 */
function mapObjectiveToSupabase(data: CreateObjectiveData): ObjectiveInsert {
    return {
        mission_id: data.missionId,
        title: data.title,
        description: data.description || null,
        term_type: data.termType,
        deadline: data.dueDate ? data.dueDate.toISOString() : null,
        success_criteria: data.successCriteria ? JSON.parse(data.successCriteria) : null,
        active: false,
        completed: false,
    };
}

/**
 * Convertit UpdateObjectiveData en format Supabase
 */
function mapObjectiveUpdateToSupabase(data: UpdateObjectiveData): ObjectiveUpdate {
    const update: ObjectiveUpdate = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.description !== undefined) update.description = data.description || null;
    if (data.termType !== undefined) update.term_type = data.termType;
    if (data.dueDate !== undefined) update.deadline = data.dueDate ? data.dueDate.toISOString() : null;
    if (data.isCompleted !== undefined) update.completed = data.isCompleted;
    if (data.isActive !== undefined) update.active = data.isActive;
    if (data.successCriteria !== undefined) {
        update.success_criteria = data.successCriteria ? JSON.parse(data.successCriteria) : null;
    }
    return update;
}

/**
 * Service de gestion des objectifs avec Supabase
 */
export class SupabaseObjectiveService {
    /**
     * Récupère tous les objectifs de l'utilisateur connecté
     */
    static async getAllObjectives(): Promise<Objective[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Récupérer les objectifs via les missions de l'utilisateur
            const { data: missions } = await supabase
                .from('missions')
                .select('id')
                .eq('user_id', user.id);

            if (!missions || missions.length === 0) {
                return [];
            }

            const missionIds = missions.map(m => m.id);

            const { data, error } = await supabase
                .from('objectives')
                .select('*')
                .in('mission_id', missionIds)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return (data || []).map(mapObjectiveFromSupabase);
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs:', error);
            throw error;
        }
    }

    /**
     * Récupère un objectif par son ID
     */
    static async getObjectiveById(id: string): Promise<Objective | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Vérifier que l'objectif appartient à une mission de l'utilisateur
            const { data, error } = await supabase
                .from('objectives')
                .select(`
                    *,
                    missions!inner(user_id)
                `)
                .eq('id', id)
                .eq('missions.user_id', user.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data ? mapObjectiveFromSupabase(data) : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'objectif:', error);
            throw error;
        }
    }

    /**
     * Récupère les objectifs d'une mission spécifique
     */
    static async getObjectivesByMissionId(missionId: string): Promise<Objective[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Vérifier que la mission appartient à l'utilisateur
            const { data: mission } = await supabase
                .from('missions')
                .select('id')
                .eq('id', missionId)
                .eq('user_id', user.id)
                .single();

            if (!mission) {
                return [];
            }

            const { data, error } = await supabase
                .from('objectives')
                .select('*')
                .eq('mission_id', missionId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return (data || []).map(mapObjectiveFromSupabase);
        } catch (error) {
            console.error('Erreur lors de la récupération des objectifs:', error);
            throw error;
        }
    }

    /**
     * Crée un nouvel objectif
     */
    static async createObjective(data: CreateObjectiveData): Promise<Objective> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Vérifier que la mission appartient à l'utilisateur
            const { data: mission } = await supabase
                .from('missions')
                .select('id')
                .eq('id', data.missionId)
                .eq('user_id', user.id)
                .single();

            if (!mission) {
                throw new Error('Mission non trouvée ou non autorisée');
            }

            const insertData = mapObjectiveToSupabase(data);

            const { data: newObjective, error } = await supabase
                .from('objectives')
                // @ts-expect-error - Type inference issue with Supabase client
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return mapObjectiveFromSupabase(newObjective);
        } catch (error) {
            console.error('Erreur lors de la création de l\'objectif:', error);
            throw error;
        }
    }

    /**
     * Met à jour un objectif existant
     */
    static async updateObjective(id: string, data: UpdateObjectiveData): Promise<Objective | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Vérifier que l'objectif appartient à une mission de l'utilisateur
            const current = await this.getObjectiveById(id);
            if (!current) {
                return null;
            }

            const updateData = mapObjectiveUpdateToSupabase(data);

            const { data: updatedObjective, error } = await supabase
                .from('objectives')
                // @ts-expect-error - Type inference issue with Supabase client
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return updatedObjective ? mapObjectiveFromSupabase(updatedObjective) : null;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'objectif:', error);
            throw error;
        }
    }

    /**
     * Supprime un objectif
     */
    static async deleteObjective(id: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Vérifier que l'objectif appartient à une mission de l'utilisateur
            const current = await this.getObjectiveById(id);
            if (!current) {
                return false;
            }

            const { error } = await supabase
                .from('objectives')
                .delete()
                .eq('id', id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'objectif:', error);
            throw error;
        }
    }

    /**
     * Marque un objectif comme terminé ou non terminé
     */
    static async toggleObjectiveCompletion(id: string): Promise<Objective | null> {
        try {
            const current = await this.getObjectiveById(id);
            if (!current) {
                return null;
            }

            return await this.updateObjective(id, { isCompleted: !current.isCompleted });
        } catch (error) {
            console.error('Erreur lors du changement de statut de l\'objectif:', error);
            throw error;
        }
    }

    /**
     * Supprime tous les objectifs d'une mission
     */
    static async deleteObjectivesByMissionId(missionId: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            // Vérifier que la mission appartient à l'utilisateur
            const { data: mission } = await supabase
                .from('missions')
                .select('id')
                .eq('id', missionId)
                .eq('user_id', user.id)
                .single();

            if (!mission) {
                return false;
            }

            const { error } = await supabase
                .from('objectives')
                .delete()
                .eq('mission_id', missionId);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression des objectifs:', error);
            throw error;
        }
    }

    /**
     * Supprime tous les objectifs de l'utilisateur
     */
    static async clearAllObjectives(): Promise<void> {
        try {
            const objectives = await this.getAllObjectives();
            if (objectives.length === 0) {
                return;
            }

            const objectiveIds = objectives.map(obj => obj.id);
            const { error } = await supabase
                .from('objectives')
                .delete()
                .in('id', objectiveIds);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de tous les objectifs:', error);
            throw error;
        }
    }
}

