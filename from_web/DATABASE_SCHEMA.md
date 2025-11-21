# Documentation du Schéma de Base de Données - YouInc.com

Cette documentation décrit le schéma complet de la base de données Supabase utilisée par l'application web et mobile.

## Vue d'ensemble

La base de données est organisée en deux modules principaux :
- **Module A : Blog YouInc** - Système de blog avec articles, commentaires et newsletter
- **Module B : MuslimDay Life System** - Système de gestion de missions, objectifs et actions

---

## Module A : Blog YouInc

### Table `profiles`

Table principale des profils utilisateurs (étend `auth.users` de Supabase).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, REFERENCES `auth.users(id)` ON DELETE CASCADE | Identifiant unique (même que `auth.users`) |
| `email` | TEXT | | Email de l'utilisateur |
| `full_name` | TEXT | | Nom complet de l'utilisateur |
| `avatar_url` | TEXT | | URL de l'avatar |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- Index automatique sur `id` (clé primaire)

**Relations :**
- `profiles.id` → `auth.users.id` (1:1)
- `profiles.id` ← `posts.author_id` (1:N)
- `profiles.id` ← `comments.author_id` (1:N)
- `profiles.id` ← `comment_likes.user_id` (1:N)
- `profiles.id` ← `subscriptions.user_id` (1:N)
- `profiles.id` ← `missions.user_id` (1:N)
- `profiles.id` ← `actions.user_id` (1:N)

---

### Table `posts`

Table des articles de blog.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `author_id` | UUID | NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE | Auteur de l'article |
| `title` | TEXT | NOT NULL | Titre de l'article |
| `slug` | TEXT | NOT NULL, UNIQUE | Slug URL unique |
| `excerpt` | TEXT | | Résumé de l'article |
| `content` | TEXT | NOT NULL | Contenu complet de l'article |
| `cover_url` | TEXT | | URL de l'image de couverture |
| `published_at` | TIMESTAMPTZ | | Date de publication (NULL = brouillon) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- `idx_posts_author_id` sur `author_id`
- `idx_posts_published_at` sur `published_at` (WHERE published_at IS NOT NULL)
- `idx_posts_slug` sur `slug` (UNIQUE)

**Relations :**
- `posts.author_id` → `profiles.id` (N:1)
- `posts.id` ← `comments.post_id` (1:N)

---

### Table `comments`

Table des commentaires sur les articles.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `post_id` | UUID | NOT NULL, REFERENCES `posts(id)` ON DELETE CASCADE | Article commenté |
| `author_id` | UUID | NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE | Auteur du commentaire |
| `content` | TEXT | NOT NULL | Contenu du commentaire |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- `idx_comments_post_id` sur `post_id`
- `idx_comments_author_id` sur `author_id`

**Relations :**
- `comments.post_id` → `posts.id` (N:1)
- `comments.author_id` → `profiles.id` (N:1)
- `comments.id` ← `comment_likes.comment_id` (1:N)

---

### Table `comment_likes`

Table de liaison pour les likes sur les commentaires.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `comment_id` | UUID | NOT NULL, REFERENCES `comments(id)` ON DELETE CASCADE | Commentaire liké |
| `user_id` | UUID | NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE | Utilisateur qui a liké |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |

**Contraintes :**
- UNIQUE(`comment_id`, `user_id`) - Un utilisateur ne peut liker qu'une fois un commentaire

**Index :**
- `idx_comment_likes_comment_id` sur `comment_id`
- `idx_comment_likes_user_id` sur `user_id`

**Relations :**
- `comment_likes.comment_id` → `comments.id` (N:1)
- `comment_likes.user_id` → `profiles.id` (N:1)

---

### Table `subscriptions`

Table des abonnements à la newsletter.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `email` | TEXT | NOT NULL, UNIQUE | Email de l'abonné |
| `user_id` | UUID | REFERENCES `profiles(id)` ON DELETE SET NULL | Utilisateur associé (optionnel) |
| `subscribed_at` | TIMESTAMPTZ | DEFAULT NOW() | Date d'abonnement |
| `active` | BOOLEAN | DEFAULT TRUE | Statut actif/inactif |

**Index :**
- `idx_subscriptions_email` sur `email` (UNIQUE)
- `idx_subscriptions_user_id` sur `user_id`

**Relations :**
- `subscriptions.user_id` → `profiles.id` (N:1, optionnel)

---

## Module B : MuslimDay Life System

### Table `missions`

Table des missions utilisateur (niveau supérieur de la hiérarchie).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `user_id` | UUID | NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE | Propriétaire de la mission |
| `title` | TEXT | NOT NULL | Titre de la mission |
| `description` | TEXT | | Description de la mission |
| `success_vision` | TEXT | | Vision de succès |
| `active` | BOOLEAN | DEFAULT TRUE | Mission active/inactive |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- `idx_missions_user_id` sur `user_id`
- `idx_missions_active` sur `active`

**Relations :**
- `missions.user_id` → `profiles.id` (N:1)
- `missions.id` ← `objectives.mission_id` (1:N)

---

### Table `objectives`

Table des objectifs associés aux missions.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `mission_id` | UUID | NOT NULL, REFERENCES `missions(id)` ON DELETE CASCADE | Mission parente |
| `title` | TEXT | NOT NULL | Titre de l'objectif |
| `description` | TEXT | | Description de l'objectif |
| `term_type` | TEXT | NOT NULL, CHECK IN ('court', 'moyen', 'long') | Type de terme |
| `deadline` | TIMESTAMPTZ | | Date limite |
| `success_criteria` | JSONB | | Critères de succès (JSON) |
| `active` | BOOLEAN | DEFAULT FALSE | Objectif actif/inactif |
| `completed` | BOOLEAN | DEFAULT FALSE | Objectif complété (auto) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- `idx_objectives_mission_id` sur `mission_id`
- `idx_objectives_active` sur `active`
- `idx_objectives_completed` sur `completed`

**Relations :**
- `objectives.mission_id` → `missions.id` (N:1)
- `objectives.id` ← `key_results.objective_id` (1:N)
- `objectives.id` ← `actions.objective_id` (1:N, optionnel)

---

### Table `key_results`

Table des résultats clés (Key Results) associés aux objectifs.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `objective_id` | UUID | NOT NULL, REFERENCES `objectives(id)` ON DELETE CASCADE | Objectif parent |
| `title` | TEXT | NOT NULL | Titre du résultat clé |
| `description` | TEXT | | Description |
| `target_value` | NUMERIC | NOT NULL | Valeur cible |
| `current_value` | NUMERIC | DEFAULT 0 | Valeur actuelle (calculée) |
| `start_date` | DATE | NOT NULL | Date de début |
| `end_date` | DATE | NOT NULL | Date de fin |
| `kr_type` | TEXT | NOT NULL, CHECK IN ('completion_rate', 'streak') | Type de KR |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- `idx_key_results_objective_id` sur `objective_id`

**Relations :**
- `key_results.objective_id` → `objectives.id` (N:1)
- `key_results.id` ← `action_key_results.key_result_id` (1:N)

**Types de KR :**
- `completion_rate` : Taux de complétion (pourcentage)
- `streak` : Série de jours consécutifs

---

### Table `actions`

Table des actions utilisateur.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `user_id` | UUID | NOT NULL, REFERENCES `profiles(id)` ON DELETE CASCADE | Propriétaire de l'action |
| `objective_id` | UUID | REFERENCES `objectives(id)` ON DELETE SET NULL | Objectif associé (optionnel) |
| `title` | TEXT | NOT NULL | Titre de l'action |
| `date` | DATE | | Date de l'action |
| `start_time` | TIME | | Heure de début |
| `duration` | INTEGER | | Durée en minutes |
| `recurrence` | TEXT | DEFAULT 'none', CHECK IN ('none', 'daily', 'weekly', 'monthly', 'yearly') | Type de récurrence |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Index :**
- `idx_actions_user_id` sur `user_id`
- `idx_actions_objective_id` sur `objective_id`
- `idx_actions_date` sur `date`

**Relations :**
- `actions.user_id` → `profiles.id` (N:1)
- `actions.objective_id` → `objectives.id` (N:1, optionnel)
- `actions.id` ← `action_key_results.action_id` (1:N)
- `actions.id` ← `occurrences.action_id` (1:N)

---

### Table `action_key_results`

Table de liaison many-to-many entre actions et résultats clés.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `action_id` | UUID | NOT NULL, REFERENCES `actions(id)` ON DELETE CASCADE | Action |
| `key_result_id` | UUID | NOT NULL, REFERENCES `key_results(id)` ON DELETE CASCADE | Résultat clé |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |

**Contraintes :**
- UNIQUE(`action_id`, `key_result_id`) - Une action ne peut être liée qu'une fois à un KR

**Index :**
- `idx_action_key_results_action_id` sur `action_id`
- `idx_action_key_results_key_result_id` sur `key_result_id`

**Relations :**
- `action_key_results.action_id` → `actions.id` (N:1)
- `action_key_results.key_result_id` → `key_results.id` (N:1)

---

### Table `occurrences`

Table des occurrences pour les actions récurrentes.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Identifiant unique |
| `action_id` | UUID | NOT NULL, REFERENCES `actions(id)` ON DELETE CASCADE | Action parente |
| `date` | DATE | NOT NULL | Date de l'occurrence |
| `status` | TEXT | DEFAULT 'pending', CHECK IN ('pending', 'completed') | Statut |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Date de mise à jour (auto) |

**Contraintes :**
- UNIQUE(`action_id`, `date`) - Une occurrence unique par action et date

**Index :**
- `idx_occurrences_action_id` sur `action_id`
- `idx_occurrences_date` sur `date`
- `idx_occurrences_status` sur `status`

**Relations :**
- `occurrences.action_id` → `actions.id` (N:1)

---

## Diagramme des Relations

```
auth.users (Supabase)
    ↓ (1:1)
profiles
    ↓ (1:N)
    ├── posts
    │   └── comments
    │       └── comment_likes
    ├── subscriptions
    ├── missions
    │   └── objectives
    │       ├── key_results ←→ actions (via action_key_results)
    │       └── actions
    │           └── occurrences
    └── actions
        └── occurrences
```

---

## Fonctions et Triggers

### Fonctions

1. **`handle_new_user()`**
   - Crée automatiquement un profil lors de l'inscription
   - Auto-abonne l'utilisateur à la newsletter

2. **`update_updated_at_column()`**
   - Met à jour automatiquement le champ `updated_at` sur les tables

3. **`calculate_completion_rate(kr_id UUID)`**
   - Calcule le taux de complétion pour un Key Result de type `completion_rate`

4. **`calculate_streak(kr_id UUID)`**
   - Calcule la série de jours consécutifs pour un Key Result de type `streak`

5. **`update_key_result_on_occurrence_change()`**
   - Met à jour automatiquement `current_value` des Key Results quand une occurrence change

6. **`check_objective_completion(obj_id UUID)`**
   - Vérifie et met à jour le statut `completed` d'un objectif quand tous ses KR atteignent leur cible

### Triggers

- **`on_auth_user_created`** : Crée le profil à l'inscription
- **`update_*_updated_at`** : Met à jour `updated_at` sur toutes les tables
- **`update_kr_on_occurrence_change`** : Met à jour les KR quand les occurrences changent
- **`update_objective_on_kr_change`** : Met à jour les objectifs quand les KR changent

---

## Row Level Security (RLS)

Toutes les tables ont RLS activé avec les politiques suivantes :

### Profiles
- ✅ Lecture : Tous les utilisateurs peuvent voir tous les profils
- ✅ Modification : Uniquement son propre profil
- ✅ Insertion : Uniquement son propre profil

### Posts
- ✅ Lecture : Articles publiés (public) OU ses propres articles
- ✅ Création/Modification/Suppression : Uniquement ses propres articles

### Comments
- ✅ Lecture : Commentaires sur articles publiés OU ses propres commentaires
- ✅ Création : Utilisateurs authentifiés
- ✅ Suppression : Uniquement ses propres commentaires

### Comment Likes
- ✅ Lecture : Public
- ✅ Création/Suppression : Uniquement ses propres likes

### Subscriptions
- ✅ Création : Public (pour s'abonner)
- ✅ Lecture : Ses propres abonnements

### Missions, Objectives, Key Results, Actions, Occurrences
- ✅ Toutes les opérations : Uniquement ses propres données

---

## Types TypeScript

Les types TypeScript sont définis dans `lib/types/database.ts`. Voici un résumé :

### Structure principale

```typescript
export interface Database {
  public: {
    Tables: {
      profiles: { Row: {...}, Insert: {...}, Update: {...} }
      posts: { Row: {...}, Insert: {...}, Update: {...} }
      comments: { Row: {...}, Insert: {...}, Update: {...} }
      comment_likes: { Row: {...}, Insert: {...}, Update: {...} }
      subscriptions: { Row: {...}, Insert: {...}, Update: {...} }
      missions: { Row: {...}, Insert: {...}, Update: {...} }
      objectives: { Row: {...}, Insert: {...}, Update: {...} }
      key_results: { Row: {...}, Insert: {...}, Update: {...} }
      actions: { Row: {...}, Insert: {...}, Update: {...} }
      action_key_results: { Row: {...}, Insert: {...}, Update: {...} }
      occurrences: { Row: {...}, Insert: {...}, Update: {...} }
    }
  }
}
```

### Types de données importants

- **UUID** : `string` en TypeScript
- **TIMESTAMPTZ** : `string` (format ISO 8601)
- **DATE** : `string` (format YYYY-MM-DD)
- **TIME** : `string` (format HH:MM:SS)
- **JSONB** : `Json` (type personnalisé)
- **ENUM** : Types union TypeScript (ex: `'court' | 'moyen' | 'long'`)

### Exemple d'utilisation

```typescript
import { Database } from '@/lib/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']
type PostInsert = Database['public']['Tables']['posts']['Insert']
type PostUpdate = Database['public']['Tables']['posts']['Update']
```

---

## Notes pour l'Application Mobile

### Authentification
- Utiliser Supabase Auth pour l'authentification
- Le profil est créé automatiquement à l'inscription via trigger

### Permissions
- Toutes les tables utilisent RLS
- L'utilisateur ne peut accéder qu'à ses propres données (sauf profils et posts publiés)

### Requêtes recommandées
- Utiliser les index pour optimiser les requêtes
- Les colonnes `created_at` et `updated_at` sont automatiquement gérées
- Les calculs de Key Results sont automatiques via triggers

### Synchronisation
- Les triggers garantissent la cohérence des données
- Les valeurs calculées (`current_value`, `completed`) sont mises à jour automatiquement

---

## Migration

Le schéma est défini dans :
- `supabase/migrations/001_initial_schema.sql` - Schéma initial complet
- `supabase/migrations/002_add_post_cover.sql` - Ajout de `cover_url` aux posts

Pour appliquer les migrations :
```bash
supabase db push
```

---

## Support

Pour toute question sur le schéma, référez-vous à :
- Le fichier SQL de migration : `supabase/migrations/001_initial_schema.sql`
- Les types TypeScript : `lib/types/database.ts`

