import { supabase } from '../../lib/supabase/supabase/client';
import { Database } from '../../lib/supabase/types/database';
import { Action, CreateActionData, RecurrenceType, UpdateActionData } from '../../types';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';

type ActionRow = Database['public']['Tables']['actions']['Row'];
type ActionInsert = Database['public']['Tables']['actions']['Insert'];
type ActionUpdate = Database['public']['Tables']['actions']['Update'];
type OccurrenceRow = Database['public']['Tables']['occurrences']['Row'];

/**
 * Convertit une action Supabase (snake_case) en Action (camelCase)
 */
function mapActionFromSupabase(row: ActionRow): Action {
    // Combiner date et start_time pour créer datetime
    let datetime = new Date();
    if (row.date) {
        datetime = new Date(row.date);
        if (row.start_time) {
            const [hours, minutes] = row.start_time.split(':').map(Number);
            datetime.setHours(hours, minutes, 0, 0);
        }
    }

    return {
        id: row.id,
        title: row.title,
        description: undefined, // Pas dans le schéma Supabase
        datetime,
        duration: row.duration || 0,
        recurrence: row.recurrence,
        linkedObjectiveId: row.objective_id || undefined,
        isCompleted: false, // Vérifier via occurrences
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
    };
}

/**
 * Convertit CreateActionData en format Supabase
 */
function mapActionToSupabase(data: CreateActionData, userId: string): ActionInsert {
    const dateStr = data.datetime ? format(data.datetime, 'yyyy-MM-dd') : null;
    const timeStr = data.datetime ? format(data.datetime, 'HH:mm:ss') : null;

    return {
        user_id: userId,
        objective_id: data.linkedObjectiveId || null,
        title: data.title,
        date: dateStr,
        start_time: timeStr,
        duration: data.duration,
        recurrence: data.recurrence,
    };
}

/**
 * Convertit UpdateActionData en format Supabase
 */
function mapActionUpdateToSupabase(data: UpdateActionData): ActionUpdate {
    const update: ActionUpdate = {};
    if (data.title !== undefined) update.title = data.title;
    if (data.objective_id !== undefined) update.objective_id = data.linkedObjectiveId || null;
    if (data.datetime !== undefined) {
        update.date = data.datetime ? format(data.datetime, 'yyyy-MM-dd') : null;
        update.start_time = data.datetime ? format(data.datetime, 'HH:mm:ss') : null;
    }
    if (data.duration !== undefined) update.duration = data.duration;
    if (data.recurrence !== undefined) update.recurrence = data.recurrence;
    return update;
}

/**
 * Génère les occurrences pour une action récurrente
 */
function generateOccurrences(startDate: Date, recurrence: RecurrenceType, days: number = 90): Date[] {
    const occurrences: Date[] = [];
    let current = new Date(startDate);

    while (occurrences.length < days && current <= new Date(Date.now() + days * 24 * 60 * 60 * 1000)) {
        occurrences.push(new Date(current));

        switch (recurrence) {
            case 'daily':
                current = addDays(current, 1);
                break;
            case 'weekly':
                current = addWeeks(current, 1);
                break;
            case 'monthly':
                current = addMonths(current, 1);
                break;
            case 'yearly':
                current = addYears(current, 1);
                break;
            default:
                return occurrences; // Pour 'none', on retourne juste la première date
        }
    }

    return occurrences;
}

/**
 * Service de gestion des actions avec Supabase
 */
export class SupabaseActionService {
    /**
     * Récupère toutes les actions de l'utilisateur connecté
     */
    static async getAllActions(): Promise<Action[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { data, error } = await supabase
                .from('actions')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            // Pour chaque action, vérifier si elle est complétée via les occurrences
            const actions = await Promise.all(
                (data || []).map(async (action) => {
                    const mapped = mapActionFromSupabase(action);
                    
                    // Vérifier le statut de complétion via les occurrences
                    if (action.date) {
                        const { data: occurrences } = await supabase
                            .from('occurrences')
                            .select('status')
                            .eq('action_id', action.id)
                            .eq('date', format(new Date(action.date), 'yyyy-MM-dd'))
                            .single();

                        if (occurrences) {
                            mapped.isCompleted = occurrences.status === 'completed';
                        }
                    }

                    return mapped;
                })
            );

            return actions;
        } catch (error) {
            console.error('Erreur lors de la récupération des actions:', error);
            throw error;
        }
    }

    /**
     * Récupère une action par son ID
     */
    static async getActionById(id: string): Promise<Action | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { data, error } = await supabase
                .from('actions')
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

            if (!data) return null;

            const mapped = mapActionFromSupabase(data);
            
            // Vérifier le statut de complétion
            if (data.date) {
                const { data: occurrence } = await supabase
                    .from('occurrences')
                    .select('status')
                    .eq('action_id', id)
                    .eq('date', format(new Date(data.date), 'yyyy-MM-dd'))
                    .single();

                if (occurrence) {
                    mapped.isCompleted = occurrence.status === 'completed';
                }
            }

            return mapped;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'action:', error);
            throw error;
        }
    }

    /**
     * Récupère les actions d'un objectif spécifique
     */
    static async getActionsByObjectiveId(objectiveId: string): Promise<Action[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { data, error } = await supabase
                .from('actions')
                .select('*')
                .eq('user_id', user.id)
                .eq('objective_id', objectiveId)
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            return (data || []).map(mapActionFromSupabase);
        } catch (error) {
            console.error('Erreur lors de la récupération des actions:', error);
            throw error;
        }
    }

    /**
     * Récupère les actions pour une date spécifique
     */
    static async getActionsByDate(date: Date): Promise<Action[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const dateStr = format(date, 'yyyy-MM-dd');

            // Récupérer les actions avec date exacte
            const { data: directActions, error: directError } = await supabase
                .from('actions')
                .select('*')
                .eq('user_id', user.id)
                .eq('date', dateStr);

            if (directError) {
                throw directError;
            }

            // Récupérer les actions récurrentes avec occurrences pour cette date
            const { data: occurrences, error: occError } = await supabase
                .from('occurrences')
                .select(`
                    *,
                    actions!inner(*)
                `)
                .eq('date', dateStr)
                .eq('actions.user_id', user.id);

            if (occError) {
                throw occError;
            }

            const actions: Action[] = [];

            // Ajouter les actions directes
            if (directActions) {
                actions.push(...directActions.map(mapActionFromSupabase));
            }

            // Ajouter les actions récurrentes
            if (occurrences) {
                const recurringActions = occurrences
                    .filter(occ => occ.actions)
                    .map(occ => {
                        const action = mapActionFromSupabase(occ.actions as ActionRow);
                        action.isCompleted = occ.status === 'completed';
                        return action;
                    });
                actions.push(...recurringActions);
            }

            return actions;
        } catch (error) {
            console.error('Erreur lors de la récupération des actions:', error);
            throw error;
        }
    }

    /**
     * Crée une nouvelle action
     */
    static async createAction(data: CreateActionData): Promise<Action> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const insertData = mapActionToSupabase(data, user.id);

            const { data: newAction, error } = await supabase
                .from('actions')
                // @ts-expect-error - Type inference issue with Supabase client
                .insert(insertData)
                .select()
                .single();

            if (error) {
                throw error;
            }

            // Générer les occurrences si l'action est récurrente
            if (data.recurrence !== 'none' && data.datetime) {
                const occurrences = generateOccurrences(data.datetime, data.recurrence, 90);
                const occurrenceData = occurrences.map((date) => ({
                    action_id: newAction.id,
                    date: format(date, 'yyyy-MM-dd'),
                    status: 'pending' as const,
                }));

                // @ts-expect-error - Type inference issue with Supabase client
                await supabase.from('occurrences').insert(occurrenceData);
            } else if (data.datetime) {
                // Une seule occurrence pour une action non récurrente
                // @ts-expect-error - Type inference issue with Supabase client
                await supabase.from('occurrences').insert({
                    action_id: newAction.id,
                    date: format(data.datetime, 'yyyy-MM-dd'),
                    status: 'pending' as const,
                });
            }

            return mapActionFromSupabase(newAction);
        } catch (error) {
            console.error('Erreur lors de la création de l\'action:', error);
            throw error;
        }
    }

    /**
     * Met à jour une action existante
     */
    static async updateAction(id: string, data: UpdateActionData): Promise<Action | null> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const updateData = mapActionUpdateToSupabase(data);

            const { data: updatedAction, error } = await supabase
                .from('actions')
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

            return updatedAction ? mapActionFromSupabase(updatedAction) : null;
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'action:', error);
            throw error;
        }
    }

    /**
     * Supprime une action
     */
    static async deleteAction(id: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { error } = await supabase
                .from('actions')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'action:', error);
            throw error;
        }
    }

    /**
     * Marque une action comme accomplie ou non
     */
    static async toggleActionCompletion(id: string): Promise<Action | null> {
        try {
            const action = await this.getActionById(id);
            if (!action || !action.datetime) {
                return null;
            }

            const dateStr = format(action.datetime, 'yyyy-MM-dd');

            // Récupérer ou créer l'occurrence
            const { data: existingOcc } = await supabase
                .from('occurrences')
                .select('*')
                .eq('action_id', id)
                .eq('date', dateStr)
                .single();

            const newStatus = action.isCompleted ? 'pending' : 'completed';

            if (existingOcc) {
                // Mettre à jour l'occurrence existante
                // @ts-expect-error - Type inference issue with Supabase client
                const { error } = await supabase
                    .from('occurrences')
                    .update({ status: newStatus })
                    .eq('id', existingOcc.id);

                if (error) {
                    throw error;
                }
            } else {
                // Créer une nouvelle occurrence
                // @ts-expect-error - Type inference issue with Supabase client
                const { error } = await supabase
                    .from('occurrences')
                    .insert({
                        action_id: id,
                        date: dateStr,
                        status: newStatus,
                    });

                if (error) {
                    throw error;
                }
            }

            // Récupérer l'action mise à jour
            return await this.getActionById(id);
        } catch (error) {
            console.error('Erreur lors du changement de statut de l\'action:', error);
            throw error;
        }
    }

    /**
     * Supprime toutes les actions liées à un objectif
     */
    static async deleteActionsByObjectiveId(objectiveId: string): Promise<boolean> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { error } = await supabase
                .from('actions')
                .delete()
                .eq('user_id', user.id)
                .eq('objective_id', objectiveId);

            if (error) {
                throw error;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression des actions:', error);
            throw error;
        }
    }

    /**
     * Supprime toutes les actions de l'utilisateur
     */
    static async clearAllActions(): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Utilisateur non authentifié');
            }

            const { error } = await supabase
                .from('actions')
                .delete()
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Erreur lors de la suppression de toutes les actions:', error);
            throw error;
        }
    }
}

