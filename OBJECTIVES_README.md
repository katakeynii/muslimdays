# 📋 EPIC : Objectifs par mission - Documentation

## 🎯 Vue d'ensemble

Cette EPIC implémente la gestion complète des objectifs dans l'application **You Inc.**, permettant aux utilisateurs de créer, gérer et suivre leurs objectifs de vie liés à leurs missions.

## 📚 User Stories implémentées

### ✅ US03 – Ajouter un objectif à une mission
- **Fonctionnalité** : Création d'objectifs liés à des missions existantes
- **Champs requis** : titre, description, échéance estimée, type d'objectif (court/moyen/long terme)
- **Implémentation** : Écran de création avec formulaire complet et validation

### ✅ US04 – Voir tous mes objectifs dans une vue synthétique
- **Fonctionnalité** : Vue globale regroupant tous les objectifs par mission
- **Filtres disponibles** : par mission, par horizon temporel, par statut de complétion
- **Implémentation** : Écran principal avec statistiques et filtres dynamiques

## 🏗️ Architecture technique

### 📁 Structure des fichiers

```
app/
├── objectives/
│   ├── _layout.tsx          # Layout de navigation pour les objectifs
│   ├── index.tsx            # Écran principal des objectifs (US04)
│   ├── create.tsx           # Écran de création d'objectif (US03)
│   └── edit.tsx             # Écran de modification d'objectif
├── missions/
│   └── ...                  # Écrans existants des missions

components/
├── ObjectiveCard.tsx        # Composant d'affichage d'un objectif
├── ObjectivesButton.tsx     # Bouton d'accès aux objectifs
└── MissionCard.tsx          # Modifié pour inclure le bouton "Ajouter un objectif"

services/
└── objectiveService.ts      # Service de gestion des objectifs avec AsyncStorage

hooks/
├── useObjectives.ts         # Hook personnalisé pour la gestion des objectifs
└── index.ts                 # Export des hooks

types/
└── index.d.ts               # Types TypeScript pour les objectifs
```

### 🔧 Services et hooks

#### `ObjectiveService`
- **CRUD complet** : Création, lecture, mise à jour, suppression
- **Filtrage** : Par mission, par type de terme, par statut
- **Persistance** : AsyncStorage pour la sauvegarde locale
- **Méthodes principales** :
  - `getAllObjectives()` : Récupère tous les objectifs
  - `getObjectivesByMissionId()` : Filtre par mission
  - `createObjective()` : Crée un nouvel objectif
  - `updateObjective()` : Met à jour un objectif
  - `deleteObjective()` : Supprime un objectif
  - `toggleObjectiveCompletion()` : Marque comme terminé/non terminé

#### `useObjectives`
- **État global** : Gestion de l'état des objectifs
- **Actions** : Méthodes pour interagir avec les objectifs
- **Getters** : Méthodes de filtrage et de récupération
- **Gestion d'erreurs** : États de loading et d'erreur

### 🎨 Composants UI

#### `ObjectiveCard`
- **Affichage** : Titre, description, échéance, type de terme
- **Actions** : Toggle de complétion, édition, suppression
- **Design** : Couleurs différenciées par type de terme
- **Responsive** : Adaptation aux différentes tailles d'écran

#### `ObjectivesScreen` (index.tsx)
- **Statistiques** : Total, terminés, en cours
- **Filtres** : Par mission, par horizon temporel, par statut
- **Liste** : Affichage des objectifs avec pull-to-refresh
- **Navigation** : Accès à la création d'objectifs

#### `CreateObjectiveScreen`
- **Formulaire** : Tous les champs requis et optionnels
- **Validation** : Vérification des champs obligatoires
- **Sélection de mission** : Interface intuitive pour choisir la mission
- **Date picker** : Sélection d'échéance optionnelle

## 🎨 Design et UX

### Couleurs par type de terme
- **Court terme** : Vert (`bg-green-100`, `text-green-800`)
- **Moyen terme** : Jaune (`bg-yellow-100`, `text-yellow-800`)
- **Long terme** : Bleu (`bg-blue-100`, `text-blue-800`)

### Icônes
- **Court terme** : `flash` (éclair)
- **Moyen terme** : `time` (horloge)
- **Long terme** : `calendar` (calendrier)

### Interactions
- **Swipe** : Actions sur les cartes d'objectifs
- **Tap** : Navigation et sélection
- **Pull-to-refresh** : Actualisation des données
- **Modal** : Création et édition d'objectifs

## 🔄 Flux de navigation

```
Accueil (/) 
├── Bouton "Mes Objectifs" → /objectives
│   ├── Liste des objectifs avec filtres
│   ├── Bouton "+" → /objectives/create
│   └── Clic sur objectif → /objectives/edit?id=...
└── Bouton "Mes Missions" → /missions
    └── Clic sur "Ajouter un objectif" → /objectives/create?missionId=...
```

## 📊 Fonctionnalités avancées

### Filtrage intelligent
- **Filtre par mission** : Sélection d'une mission spécifique
- **Filtre par horizon** : Court, moyen, long terme
- **Filtre par statut** : Afficher/masquer les terminés
- **Combinaison** : Filtres multiples actifs simultanément

### Statistiques en temps réel
- **Total d'objectifs** : Nombre total d'objectifs créés
- **Objectifs terminés** : Nombre d'objectifs accomplis
- **Objectifs en cours** : Nombre d'objectifs en cours
- **Progression** : Affichage du ratio terminés/total

### Validation et gestion d'erreurs
- **Validation côté client** : Vérification des champs obligatoires
- **Gestion d'erreurs** : Messages d'erreur explicites
- **États de loading** : Indicateurs visuels pendant les opérations
- **Fallbacks** : Gestion des cas d'erreur (pas de données, etc.)

## 🚀 Utilisation

### Créer un objectif
1. Accéder à `/objectives` ou depuis une mission
2. Cliquer sur le bouton "+"
3. Sélectionner la mission associée
4. Remplir le titre (obligatoire)
5. Ajouter une description (optionnel)
6. Choisir l'horizon temporel
7. Définir une échéance (optionnel)
8. Valider la création

### Gérer les objectifs
1. **Voir tous les objectifs** : Accéder à `/objectives`
2. **Filtrer** : Utiliser les filtres en haut de l'écran
3. **Marquer comme terminé** : Taper sur la checkbox
4. **Modifier** : Taper sur l'icône crayon
5. **Supprimer** : Taper sur l'icône poubelle

### Intégration avec les missions
- **Depuis une mission** : Bouton "Ajouter un objectif" dans chaque carte de mission
- **Création pré-remplie** : La mission est automatiquement sélectionnée
- **Navigation fluide** : Retour facile vers la mission d'origine

## 🔧 Configuration et personnalisation

### Ajouter un nouveau type de terme
1. Modifier le type `ObjectiveTermType` dans `types/index.d.ts`
2. Ajouter les couleurs et icônes dans `ObjectiveCard.tsx`
3. Mettre à jour les labels dans les écrans de création/édition

### Modifier les couleurs
- **ObjectiveCard** : Fonctions `getTermTypeColor()` et `getTermTypeIcon()`
- **Écrans** : Classes Tailwind CSS personnalisables
- **Thème** : Cohérence avec le design system de l'application

## 📈 Évolutions futures

### Fonctionnalités potentielles
- **Sous-objectifs** : Hiérarchie d'objectifs
- **Progression** : Pourcentage de progression par objectif
- **Rappels** : Notifications pour les échéances
- **Partage** : Partage d'objectifs avec d'autres utilisateurs
- **Analytics** : Statistiques détaillées et graphiques
- **Export** : Export des objectifs en PDF/CSV

### Améliorations techniques
- **Synchronisation** : Sync avec un backend
- **Offline** : Mode hors ligne amélioré
- **Performance** : Optimisation des requêtes et du rendu
- **Tests** : Couverture de tests unitaires et d'intégration

## ✅ Tests et validation

### Tests manuels effectués
- ✅ Création d'objectifs avec tous les champs
- ✅ Modification d'objectifs existants
- ✅ Suppression d'objectifs
- ✅ Filtrage par mission et type de terme
- ✅ Toggle de complétion
- ✅ Navigation entre les écrans
- ✅ Gestion des erreurs
- ✅ Validation des formulaires

### Points d'attention
- **Performance** : Gestion de grandes listes d'objectifs
- **Accessibilité** : Support des lecteurs d'écran
- **Internationalisation** : Support multilingue
- **Sécurité** : Validation des données côté serveur (futur)

---

**Implémentation complète et fonctionnelle de l'EPIC "Objectifs par mission" ✅** 