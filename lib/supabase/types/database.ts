export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          author_id: string
          title: string
          slug: string
          excerpt: string | null
          content: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id: string
          title: string
          slug: string
          excerpt?: string | null
          content: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          author_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          author_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          author_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          email: string
          user_id: string | null
          subscribed_at: string
          active: boolean
        }
        Insert: {
          id?: string
          email: string
          user_id?: string | null
          subscribed_at?: string
          active?: boolean
        }
        Update: {
          id?: string
          email?: string
          user_id?: string | null
          subscribed_at?: string
          active?: boolean
        }
      }
      missions: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          success_vision: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          success_vision?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          success_vision?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      objectives: {
        Row: {
          id: string
          mission_id: string
          title: string
          description: string | null
          term_type: 'court' | 'moyen' | 'long'
          deadline: string | null
          success_criteria: Json | null
          active: boolean
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          title: string
          description?: string | null
          term_type: 'court' | 'moyen' | 'long'
          deadline?: string | null
          success_criteria?: Json | null
          active?: boolean
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          title?: string
          description?: string | null
          term_type?: 'court' | 'moyen' | 'long'
          deadline?: string | null
          success_criteria?: Json | null
          active?: boolean
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      key_results: {
        Row: {
          id: string
          objective_id: string
          title: string
          description: string | null
          target_value: number
          current_value: number
          start_date: string
          end_date: string
          kr_type: 'completion_rate' | 'streak'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          objective_id: string
          title: string
          description?: string | null
          target_value: number
          current_value?: number
          start_date: string
          end_date: string
          kr_type: 'completion_rate' | 'streak'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          objective_id?: string
          title?: string
          description?: string | null
          target_value?: number
          current_value?: number
          start_date?: string
          end_date?: string
          kr_type?: 'completion_rate' | 'streak'
          created_at?: string
          updated_at?: string
        }
      }
      actions: {
        Row: {
          id: string
          user_id: string
          objective_id: string | null
          title: string
          date: string | null
          start_time: string | null
          duration: number | null
          recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          objective_id?: string | null
          title: string
          date?: string | null
          start_time?: string | null
          duration?: number | null
          recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          objective_id?: string | null
          title?: string
          date?: string | null
          start_time?: string | null
          duration?: number | null
          recurrence?: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'
          created_at?: string
          updated_at?: string
        }
      }
      action_key_results: {
        Row: {
          id: string
          action_id: string
          key_result_id: string
          created_at: string
        }
        Insert: {
          id?: string
          action_id: string
          key_result_id: string
          created_at?: string
        }
        Update: {
          id?: string
          action_id?: string
          key_result_id?: string
          created_at?: string
        }
      }
      occurrences: {
        Row: {
          id: string
          action_id: string
          date: string
          status: 'pending' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          action_id: string
          date: string
          status?: 'pending' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          action_id?: string
          date?: string
          status?: 'pending' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

