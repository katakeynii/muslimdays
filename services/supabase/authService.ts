import { supabase } from '../../lib/supabase/supabase/client';
import { Database } from '../../lib/supabase/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];

/**
 * Service d'authentification Supabase
 */
export class SupabaseAuthService {
    /**
     * Inscription d'un nouvel utilisateur
     */
    static async signUp(email: string, password: string, fullName?: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || '',
                    },
                },
            });

            if (error) {
                throw error;
            }

            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            throw error;
        }
    }

    /**
     * Connexion d'un utilisateur
     */
    static async signIn(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            return { user: data.user, session: data.session };
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            throw error;
        }
    }

    /**
     * Déconnexion de l'utilisateur
     */
    static async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw error;
            }
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
            throw error;
        }
    }

    /**
     * Récupère l'utilisateur actuellement connecté
     */
    static async getCurrentUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                throw error;
            }
            return user;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            throw error;
        }
    }

    /**
     * Récupère le profil de l'utilisateur
     */
    static async getProfile(userId: string): Promise<Profile | null> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null; // Not found
                }
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erreur lors de la récupération du profil:', error);
            throw error;
        }
    }

    /**
     * Met à jour le profil de l'utilisateur
     */
    static async updateProfile(userId: string, updates: Partial<Profile>) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                // @ts-expect-error - Type inference issue with Supabase client
                .update(updates)
                .eq('id', userId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            return data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            throw error;
        }
    }

    /**
     * Écoute les changements d'authentification
     */
    static onAuthStateChange(callback: (user: any) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(session?.user ?? null);
        });
    }
}

