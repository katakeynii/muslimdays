# EPIC : Actions & Événements planifiés

## 📋 Vue d'ensemble

Cette EPIC implémente la gestion des actions et événements planifiés dans l'application **You Inc.**, permettant aux utilisateurs de créer, organiser et suivre leurs tâches quotidiennes et événements.

## 🎯 User Stories implémentées

### US05 – Créer une action liée à un objectif
- ✅ Formulaire complet avec titre, description, date/heure, durée
- ✅ Sélection d'un objectif associé (optionnel)
- ✅ Configuration de la récurrence (quotidienne, hebdomadaire, etc.)
- ✅ Validation des données

### US06 – Créer un événement libre
- ✅ Même formulaire que les actions liées
- ✅ Possibilité de créer des événements sans objectif associé
- ✅ Gestion des événements récurrents

### US07 – Marquer une action comme accomplie
- ✅ Checkbox interactive dans l'agenda
- ✅ Mise à jour en temps réel du statut
- ✅ Style visuel différent pour les actions accomplies

## 🏗️ Architecture technique

### Types de données
```typescript
interface Action {
    id: string;
    title: string;
    description?: string;
    datetime: Date;
    duration: number; // en minutes
    recurrence: RecurrenceType;
    linkedObjectiveId?: string;
    isCompleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';
```

### Services
- **ActionService** : Gestion CRUD des actions
- **ObjectiveService** : Mise à jour pour inclure `isActive` et `successCriteria`

### Hooks
- **useActions** : Hook personnalisé pour la gestion des actions
- **useObjectives** : Mise à jour pour inclure les nouveaux champs

### Composants
- **ActionCard** : Affichage d'une action dans l'agenda
- **ActionsButton** : Navigation vers l'agenda
- **CreateActionScreen** : Formulaire de création d'action
- **AgendaScreen** : Vue d'agenda par jour

## 📱 Écrans implémentés

### 1. Création d'action (`/actions/create`)
- Formulaire complet avec validation
- Sélection d'objectif associé
- Configuration de la récurrence
- Prévisualisation de l'action

### 2. Agenda (`/agenda`)
- Vue par jour avec navigation
- Mini-calendrier pour navigation rapide
- Affichage des actions du jour sélectionné
- Possibilité de marquer comme accompli

### 3. Édition d'objectif (`/objectives/edit`)
- Activation/désactivation d'objectif
- Gestion des critères de réussite
- Vue des actions liées
- Lien vers création d'action

## 🔄 Logique d'activation des objectifs

### Règles d'activation
1. **Par défaut** : Tous les objectifs sont créés avec `isActive: false`
2. **Activation manuelle** : L'utilisateur peut activer/désactiver via l'écran d'édition
3. **Critères de réussite** : Optionnels mais recommandés pour l'activation
4. **Actions liées** : Peuvent être ajoutées même si l'objectif est désactivé

### Workflow recommandé
1. Créer un objectif (désactivé par défaut)
2. Définir les critères de réussite
3. Créer des actions liées
4. Activer l'objectif pour commencer le suivi

## 🎨 Interface utilisateur

### Design System
- **Actions liées** : Bordure bleue (`border-blue-500`)
- **Événements libres** : Bordure verte (`border-green-500`)
- **Actions accomplies** : Opacité réduite et texte barré
- **Indicateurs visuels** : Icônes pour la récurrence et le type

### Navigation
- Bouton "Agenda" sur l'écran d'accueil
- Navigation directe vers création d'action depuis l'agenda
- Lien vers objectif depuis les actions liées

## 📊 Fonctionnalités avancées

### Récurrence
- **Aucune** : Action unique
- **Quotidienne** : Répétition chaque jour
- **Hebdomadaire** : Répétition chaque semaine
- **Mensuelle** : Répétition chaque mois
- **Annuelle** : Répétition chaque année

### Durée
- Options prédéfinies : 15min, 30min, 45min, 1h, 1h30, 2h, 3h, 4h
- Affichage formaté : "1h30" pour 90 minutes

### Tri et filtrage
- Actions triées par heure dans l'agenda
- Filtrage par date sélectionnée
- Distinction visuelle entre types d'actions

## 🔧 Configuration et déploiement

### Dépendances ajoutées
- `date-fns` : Manipulation des dates
- `@react-native-community/datetimepicker` : Sélecteurs de date/heure

### Stockage
- AsyncStorage pour la persistance locale
- Clés de stockage : `@muslimday_actions`

## 🚀 Prochaines étapes

### Améliorations possibles
1. **Notifications** : Rappels pour les actions
2. **Statistiques** : Suivi des accomplissements
3. **Import/Export** : Synchronisation avec d'autres calendriers
4. **Collaboration** : Actions partagées entre utilisateurs
5. **Templates** : Actions prédéfinies réutilisables

### Optimisations
1. **Performance** : Pagination pour les actions nombreuses
2. **Recherche** : Filtrage par titre ou description
3. **Vues multiples** : Vue semaine, mois
4. **Drag & Drop** : Réorganisation des actions

## 📝 Notes de développement

### Bonnes pratiques
- Validation côté client et serveur
- Gestion d'erreurs robuste
- Interface responsive et accessible
- Code modulaire et réutilisable

### Tests
- Tests unitaires pour les services
- Tests d'intégration pour les hooks
- Tests E2E pour les workflows complets

---

**Statut** : ✅ Implémenté et fonctionnel  
**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024 