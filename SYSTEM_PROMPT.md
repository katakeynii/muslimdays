# 🎯 System Prompt - MuslimDay : Missions, Objectifs et Actions

## Vue d'ensemble

**MuslimDay** est une application de gestion de vie personnelle qui permet aux utilisateurs d'organiser leur vie comme une entreprise. Le système repose sur quatre entités principales : les **Missions**, les **Objectifs**, les **Key Results** et les **Actions**.

Une **Mission** représente une grande orientation de vie (ex: "Devenir un meilleur musulman", "Construire ma carrière"). Chaque mission peut avoir plusieurs **Objectifs** qui la décomposent en étapes concrètes (ex: "Lire le Coran en 1 an", "Obtenir une promotion"). Chaque objectif possède 3 à 4 **Key Results** (résultats clés) qui mesurent son atteinte selon des critères SMART. Enfin, chaque objectif peut avoir plusieurs **Actions** planifiées dans le temps pour l'atteindre (ex: "Lire 5 pages chaque matin à 6h"). Les actions accomplies mettent à jour automatiquement les Key Results associés, permettant d'évaluer en temps réel si l'objectif est atteint.

---

## Missions

Une mission est la vision globale de ce que l'utilisateur veut accomplir dans sa vie. Elle contient un titre obligatoire, une description optionnelle et une vision de réussite optionnelle. Chaque mission peut être activée ou désactivée. Les missions actives sont celles sur lesquelles l'utilisateur travaille actuellement.

**Fonctionnalités** : Créer, modifier, supprimer, activer/désactiver une mission. Lister toutes les missions avec séparation visuelle entre actives et inactives.

---

## Objectifs

Un objectif est une cible concrète liée à une mission. Il permet de décomposer une mission en étapes mesurables. Chaque objectif doit être lié à une mission et possède un type de terme (court, moyen ou long terme). Un objectif peut avoir une échéance estimée et des critères de réussite.

**Règles importantes** : Un objectif est créé désactivé par défaut. L'utilisateur doit l'activer manuellement après avoir défini ses critères de réussite. Un objectif peut être marqué comme terminé une fois accompli. L'atteinte d'un objectif est évaluée automatiquement en fonction de ses Key Results.

**Fonctionnalités** : Créer un objectif pour une mission, modifier, supprimer, activer/désactiver, marquer comme terminé. Filtrer les objectifs par mission, par type de terme (court/moyen/long), par statut (terminé/en cours).

---

## Key Results (Résultats Clés)

Un Key Result est un indicateur de mesure qui permet de savoir si un objectif est atteint ou non. Chaque objectif peut avoir au maximum 3 à 4 Key Results. Ensemble, ces Key Results déterminent si l'objectif est réussi.

### Critères SMART

Chaque Key Result doit respecter les critères SMART :

- **Specific (Spécifique)** : Énonce clairement le résultat attendu.
- **Measurable (Mesurable)** : Possède une métrique et un nombre pour suivre la progression.
- **Achievable (Atteignable)** : Est une cible réaliste pour la période de temps donnée.
- **Relevant (Pertinent)** : S'aligne avec l'objectif global.
- **Time-bound (Temporellement défini)** : Possède une échéance spécifique, généralement la fin du cycle de l'objectif ou une période propre au Key Result.

### Période de mesure

Chaque Key Result possède une période de temps pour sa mesure. Cette période peut être héritée de l'échéance de l'objectif parent, ou être spécifique au Key Result lui-même. C'est dans cette période que les valeurs du Key Result sont calculées et suivies.

### Types de calcul

Les Key Results peuvent être calculés de deux manières principales :

**1. Taux d'accomplissement** : Le Key Result mesure le pourcentage d'accomplissement d'actions par rapport au nombre total d'occurrences disponibles dans la période de temps. Par exemple, si une action récurrente quotidienne a 30 occurrences possibles dans le mois et que 25 ont été accomplies, le taux est de 83%.

**2. Assiduité (Streak)** : Le Key Result mesure la longueur de la séquence continue d'accomplissement d'actions dans la période définie. Par exemple, un streak de 15 jours consécutifs où l'action a été accomplie.

### Relation avec les Actions

Il existe une relation bidirectionnelle entre les Actions et les Key Results : une action accomplie peut impacter la valeur d'un ou plusieurs Key Results qui lui sont associés. Cette relation permet de calculer automatiquement la progression des Key Results en fonction des accomplissements d'actions.

Lorsqu'une action est marquée comme accomplie, le système met à jour automatiquement tous les Key Results qui lui sont liés. Cette mise à jour peut affecter le taux d'accomplissement, le streak, ou d'autres métriques selon le type de Key Result.

### Évaluation de l'objectif

Un objectif est considéré comme atteint lorsque tous ses Key Results ont atteint leur valeur cible dans la période définie. Le système calcule automatiquement la progression de chaque Key Result et détermine si l'objectif global est réussi ou non.

---

## Actions

Une action est une tâche concrète planifiée dans le temps avec une date, une heure et une durée. Une action peut être liée à un objectif (pour contribuer à l'atteindre) ou être un événement libre (sans objectif associé). Chaque action peut être récurrente (quotidienne, hebdomadaire, mensuelle, annuelle) ou unique.

**Occurrences** : Les actions récurrentes génèrent des occurrences dans le temps. Chaque occurrence peut être accomplie individuellement. Le système calcule automatiquement le nombre d'occurrences disponibles dans une période donnée pour permettre le calcul des Key Results basés sur le taux d'accomplissement.

**Impact sur les Key Results** : Lorsqu'une action est marquée comme accomplie, elle met à jour automatiquement tous les Key Results qui lui sont associés. Une même action peut contribuer à plusieurs Key Results différents, permettant une mesure multidimensionnelle de la progression vers l'objectif.

**Fonctionnalités** : Créer une action (liée à un objectif ou libre), modifier, supprimer, marquer comme accomplie. Voir les actions dans un agenda par jour. Filtrer les actions par date, par objectif, par statut (accomplie/en attente).

---

## Relations entre les entités

La hiérarchie est la suivante : **Mission → Objectif → Key Results → Actions**. Une mission peut avoir plusieurs objectifs. Chaque objectif peut avoir 3 à 4 Key Results maximum pour mesurer son atteinte. Chaque Key Result peut être lié à une ou plusieurs actions pour calculer sa valeur. Une action peut aussi exister sans objectif (événement libre).

**Relation Actions ↔ Key Results** : Une action peut être associée à plusieurs Key Results différents. Lorsqu'une action est accomplie, elle met à jour automatiquement tous les Key Results qui lui sont liés. Cette relation permet de calculer la progression des Key Results en temps réel selon les accomplissements d'actions.

**Règles de suppression** : La suppression d'une mission ne supprime pas automatiquement ses objectifs. La suppression d'un objectif ne supprime pas automatiquement ses Key Results ni ses actions. Si l'utilisateur veut supprimer une mission avec tous ses objectifs, il doit le faire manuellement.

---

## Workflow utilisateur recommandé

1. L'utilisateur crée une mission avec un titre et une description.
2. Il crée des objectifs pour cette mission, en définissant le type de terme et les critères de réussite.
3. Pour chaque objectif, il définit 3 à 4 Key Results selon les critères SMART, avec leur période de mesure et leur valeur cible.
4. Il crée des actions planifiées pour chaque objectif actif et les associe aux Key Results pertinents.
5. Il active les objectifs sur lesquels il veut travailler.
6. Il marque les actions comme accomplies au fur et à mesure, ce qui met à jour automatiquement les Key Results associés.
7. Le système calcule automatiquement la progression des Key Results et détermine si l'objectif est atteint.
8. Une fois tous les objectifs d'une mission terminés, il peut désactiver ou supprimer la mission.

---

## États et statuts

**Missions** : Actives ou inactives. Une mission inactive peut toujours être modifiée mais n'apparaît pas dans les vues principales.

**Objectifs** : Actifs ou inactifs, terminés ou en cours. Un objectif doit être activé pour être suivi. Un objectif terminé reste visible mais est marqué différemment.

**Actions** : Accomplies ou en attente. Une action accomplie reste visible dans l'agenda mais avec un style différent (opacité réduite, texte barré).

---

## Design et affichage

Les objectifs sont affichés avec des couleurs différentes selon leur type de terme : vert pour court terme, jaune pour moyen terme, bleu pour long terme. Les actions liées à un objectif ont une bordure bleue, les événements libres ont une bordure verte. Les éléments complétés sont affichés avec une opacité réduite et un texte barré.

---

## Stockage et persistance

Toutes les données sont stockées localement sur l'appareil de l'utilisateur. Les missions, objectifs et actions sont sauvegardées automatiquement lors de chaque modification. Aucune synchronisation cloud n'est implémentée actuellement.

---

## Points d'attention

- Un objectif ne peut pas exister sans mission. La suppression d'une mission laisse ses objectifs orphelins (à gérer manuellement).
- Un objectif est créé désactivé par défaut. L'utilisateur doit l'activer pour commencer à le suivre.
- Un objectif doit avoir entre 1 et 4 Key Results pour être correctement mesuré.
- Les Key Results doivent respecter les critères SMART et avoir une période de mesure claire.
- Les actions peuvent exister sans objectif (événements libres), mais pour contribuer à un objectif, elles doivent être associées à au moins un Key Result.
- La récurrence des actions génère des occurrences qui sont utilisées pour calculer les Key Results basés sur le taux d'accomplissement.
- Lorsqu'une action est accomplie, tous les Key Results qui lui sont associés sont mis à jour automatiquement.
- L'atteinte d'un objectif est déterminée automatiquement lorsque tous ses Key Results atteignent leur valeur cible.
