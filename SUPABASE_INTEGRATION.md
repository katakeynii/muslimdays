# Intégration Supabase - MuslimDay

Ce document explique comment l'application mobile utilise Supabase pour synchroniser les données avec la version web.

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

**Important** : Ne commitez jamais le fichier `.env` dans Git. Il est déjà dans `.gitignore`.

### Installation

Les dépendances Supabase sont déjà installées :
- `@supabase/supabase-js` - Client Supabase
- `@react-native-async-storage/async-storage` - Stockage pour l'authentification

## Architecture

### Services Supabase

Les services Supabase sont dans `services/supabase/` :

- **`missionService.ts`** - Gestion des missions
- **`objectiveService.ts`** - Gestion des objectifs
- **`actionService.ts`** - Gestion des actions
- **`authService.ts`** - Authentification

### Mapping des données

Les services convertissent automatiquement entre :
- **Format Supabase** (snake_case) : `user_id`, `mission_id`, `created_at`
- **Format Application** (camelCase) : `userId`, `missionId`, `createdAt`

### Hooks

Les hooks existants (`useMissions`, `useObjectives`, `useActions`) utilisent maintenant les services Supabase au lieu de Realm/AsyncStorage.

## Authentification

### Inscription

```typescript
import { SupabaseAuthService } from '../services/supabase/authService';

await SupabaseAuthService.signUp('email@example.com', 'password', 'Nom Complet');
```

### Connexion

```typescript
await SupabaseAuthService.signIn('email@example.com', 'password');
```

### Déconnexion

```typescript
await SupabaseAuthService.signOut();
```

### Écouter les changements d'authentification

```typescript
useEffect(() => {
  const { data: { subscription } } = SupabaseAuthService.onAuthStateChange((user) => {
    if (user) {
      console.log('Utilisateur connecté:', user);
    } else {
      console.log('Utilisateur déconnecté');
    }
  });

  return () => subscription.unsubscribe();
}, []);
```

## Structure des données

### Missions

```typescript
interface Mission {
  id: string;
  title: string;
  description?: string;
  vision?: string; // success_vision dans Supabase
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean; // active dans Supabase
}
```

### Objectives

```typescript
interface Objective {
  id: string;
  missionId: string; // mission_id dans Supabase
  title: string;
  description?: string;
  dueDate?: Date; // deadline dans Supabase
  termType: 'court' | 'moyen' | 'long'; // term_type dans Supabase
  isCompleted: boolean; // completed dans Supabase
  isActive: boolean; // active dans Supabase
  successCriteria?: string; // success_criteria (JSONB) dans Supabase
  createdAt: Date;
  updatedAt: Date;
}
```

### Actions

```typescript
interface Action {
  id: string;
  title: string;
  description?: string;
  datetime: Date; // date + start_time dans Supabase
  duration: number; // en minutes
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  linkedObjectiveId?: string; // objective_id dans Supabase
  isCompleted: boolean; // vérifié via occurrences
  createdAt: Date;
  updatedAt: Date;
}
```

## Row Level Security (RLS)

Toutes les tables utilisent RLS. L'utilisateur ne peut accéder qu'à ses propres données :
- Missions : filtrées par `user_id`
- Objectives : filtrées via les missions de l'utilisateur
- Actions : filtrées par `user_id`

## Synchronisation

Les données sont synchronisées en temps réel avec Supabase. Les changements sont automatiquement reflétés dans l'application grâce aux hooks React.

## Migration depuis Realm/AsyncStorage

Les anciens services (`services/missionService.ts`, etc.) utilisent AsyncStorage et sont toujours présents mais ne sont plus utilisés. Les hooks pointent maintenant vers `services/supabase/`.

Pour migrer les données existantes :
1. Exporter les données depuis AsyncStorage
2. Les importer dans Supabase via l'API

## Notes importantes

- **Authentification requise** : Toutes les opérations nécessitent un utilisateur authentifié
- **Gestion des erreurs** : Les services lancent des erreurs qu'il faut gérer dans les composants
- **Types** : Les types TypeScript sont générés depuis le schéma Supabase dans `lib/supabase/types/database.ts`

