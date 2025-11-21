# 👆 Guide des interactions par swipe - Missions

## 🎯 Nouvelles interactions implémentées

### 📱 **Modification d'une mission**
- **Action** : Cliquer directement sur la carte de mission
- **Résultat** : Navigation vers l'écran d'édition
- **UX** : Interaction intuitive et rapide

### ⬅️ **Swipe vers la gauche pour les actions**
- **Action** : Glisser la carte vers la gauche
- **Seuil** : 80px pour déclencher l'affichage des actions
- **Résultat** : Affichage des boutons d'action en arrière-plan

## 🎨 Actions disponibles en swipe

### 🔄 **Toggle statut (Activer/Désactiver)**
- **Bouton** : Cercle orange (pause) / vert (play)
- **Action** : Active ou désactive la mission
- **Confirmation** : Alert de confirmation avant action
- **Couleur** : 
  - 🟠 Orange pour désactiver (mission active)
  - 🟢 Vert pour activer (mission inactive)

### 🗑️ **Supprimer**
- **Bouton** : Cercle rouge avec icône poubelle
- **Action** : Supprime définitivement la mission
- **Confirmation** : Alert de confirmation avant suppression
- **Couleur** : 🔴 Rouge

## 🔧 Fonctionnement technique

### ReanimatedSwipeable
```typescript
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const swipeableRef = useRef<any>(null);

const renderRightActions = () => {
    return (
        <View className="flex-row items-center justify-end h-full pr-4">
            {/* Boutons d'action */}
        </View>
    );
};
```

### Configuration ReanimatedSwipeable
```typescript
<Swipeable
    ref={swipeableRef}
    renderRightActions={renderRightActions}
    rightThreshold={40}
    overshootRight={false}
>
    {/* Contenu de la carte */}
</Swipeable>
```

### Fermeture automatique
```typescript
const handleAction = () => {
    // Exécuter l'action
    onAction();
    // Fermer le swipe
    swipeableRef.current?.close();
};
```

## 🎯 Indicateurs visuels

### Indicateur de swipe
- **Icône** : Chevron vers la gauche
- **Texte** : "Glissez pour les actions"
- **Position** : En bas à droite de la carte
- **Couleur** : Gris clair

### Boutons d'action
- **Forme** : Cercles de 48px de diamètre
- **Position** : En arrière-plan, alignés à droite
- **Espacement** : 8px entre les boutons
- **Couleurs** : 
  - Orange/vert pour toggle
  - Rouge pour suppression

## 📱 Utilisation

### 1. **Modifier une mission**
```
1. Cliquer sur la carte de mission
2. Navigation automatique vers l'édition
3. Modifier les champs
4. Sauvegarder
```

### 2. **Activer/Désactiver une mission**
```
1. Glisser la carte vers la gauche
2. Cliquer sur le bouton orange/vert
3. Confirmer l'action
4. La carte revient à sa position
```

### 3. **Supprimer une mission**
```
1. Glisser la carte vers la gauche
2. Cliquer sur le bouton rouge
3. Confirmer la suppression
4. La mission est supprimée
```

## 🎨 Design et animations

### Animations fluides
- **ReanimatedSwipeable** : Animations optimisées avec Reanimated 2
- **Performance native** : Animations fluides à 60fps
- **Fermeture automatique** : Retour à la position après action
- **Seuil configurable** : rightThreshold={40} pour déclencher l'action

### États visuels
- **Position normale** : Carte fermée
- **Actions visibles** : Carte ouverte avec boutons
- **Transition** : Animation native fluide

### Feedback utilisateur
- **Confirmation** : Alerts pour les actions destructives
- **Retour visuel** : Animation de retour
- **Indicateurs** : Icônes et couleurs explicites

## 🔧 Personnalisation

### Seuil de swipe
```typescript
rightThreshold={40} // Modifier cette valeur dans Swipeable
```

### Couleurs des boutons
```typescript
// Toggle status
className={`w-12 h-12 rounded-full ${
    mission.isActive ? 'bg-orange-500' : 'bg-green-500'
}`}

// Suppression
className="w-12 h-12 rounded-full bg-red-500"
```

### Configuration ReanimatedSwipeable
```typescript
<Swipeable
    ref={swipeableRef}
    renderRightActions={renderRightActions}
    rightThreshold={40}
    overshootRight={false}
    friction={2}
>
```

## 🚀 Avantages UX

### 1. **Interaction intuitive**
- Swipe naturel sur mobile
- Actions contextuelles
- Feedback immédiat

### 2. **Espace optimisé**
- Actions cachées par défaut
- Interface épurée
- Focus sur le contenu

### 3. **Sécurité**
- Confirmation pour les actions destructives
- Actions non accidentelles
- Retour visuel clair

### 4. **Performance**
- Animations natives
- Gestion optimisée des gestes
- Pas de re-renders inutiles

---

**Interactions swipe implémentées** ✅  
*Interface moderne et intuitive pour la gestion des missions* 