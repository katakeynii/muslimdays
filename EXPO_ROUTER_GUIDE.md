# 🚀 Guide d'utilisation des Missions avec Expo Router

## 📱 Structure des fichiers Expo Router

```
app/
├── _layout.tsx                    # Layout principal avec drawer
├── index.tsx                      # Écran principal (calendrier)
└── missions/                      # Dossier des missions
    ├── _layout.tsx               # Layout spécifique aux missions
    ├── index.tsx                 # Écran principal des missions
    ├── create.tsx                # Création de mission
    └── edit.tsx                  # Édition de mission
```

## 🎯 Navigation implémentée

### 1. **Accès depuis le drawer**
- Ouvrir le drawer → "Mes Missions"
- Route : `/missions`

### 2. **Accès depuis l'écran principal**
- Bouton "Mes Missions" dans le calendrier
- Route : `/missions`

### 3. **Navigation interne**
- **Créer** : `/missions/create` (modal)
- **Éditer** : `/missions/edit?missionId=123`
- **Retour** : Navigation automatique avec `router.back()`

## 🔧 Configuration Expo Router

### Layout principal (`app/_layout.tsx`)
```typescript
<Drawer.Screen name="missions" options={{
    drawerLabel: 'Mes Missions',
    drawerIcon: () => <Ionicons name="flag" size={24} color="#374151" />,
    headerTitle: 'Mes Missions de Vie',
}} />
```

### Layout des missions (`app/missions/_layout.tsx`)
```typescript
<Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="create" options={{ 
        presentation: 'modal',
        headerShown: false 
    }} />
    <Stack.Screen name="edit" options={{ headerShown: false }} />
</Stack>
```

## 📱 Écrans créés

### 1. **Écran principal** (`app/missions/index.tsx`)
- Liste des missions avec pull-to-refresh
- Bouton de création
- Navigation vers édition
- Gestion des états vides

### 2. **Création** (`app/missions/create.tsx`)
- Formulaire modal
- Validation en temps réel
- Conseils UX intégrés
- Gestion des modifications non sauvegardées

### 3. **Édition** (`app/missions/edit.tsx`)
- Récupération de la mission via `useLocalSearchParams`
- Formulaire pré-rempli
- Détection des changements
- Actions de suppression

## 🎨 Composants d'intégration

### MissionsButton (`components/MissionsButton.tsx`)
```typescript
import { useRouter } from 'expo-router';

const MissionsButton = () => {
    const router = useRouter();
    
    return (
        <TouchableOpacity onPress={() => router.push('/missions')}>
            <Text>Mes Missions</Text>
        </TouchableOpacity>
    );
};
```

## 🔄 Gestion de l'état

### Hook useMissions
```typescript
const {
    missions,
    loading,
    error,
    createMission,
    updateMission,
    deleteMission,
    toggleMissionStatus,
} = useMissions();
```

### Persistance AsyncStorage
- Clé : `'missions'`
- Format : JSON stringifié
- Gestion d'erreurs robuste

## 🚀 Utilisation

### 1. **Démarrer l'application**
```bash
npm start
# ou
expo start
```

### 2. **Accéder aux missions**
- **Via drawer** : Menu → "Mes Missions"
- **Via bouton** : Clic sur "Mes Missions" dans le calendrier

### 3. **Créer une mission**
1. Clic sur le bouton "+" (floating action button)
2. Remplir le formulaire
3. Validation automatique
4. Sauvegarde et retour

### 4. **Modifier une mission**
1. Clic sur l'icône crayon
2. Modification des champs
3. Détection des changements
4. Sauvegarde

### 5. **Supprimer une mission**
1. Clic sur l'icône poubelle
2. Confirmation
3. Suppression

## 🎯 Fonctionnalités Expo Router

### Navigation automatique
- `router.push('/missions')` : Navigation vers les missions
- `router.push('/missions/create')` : Création en modal
- `router.back()` : Retour automatique

### Paramètres d'URL
```typescript
// Dans edit.tsx
const { missionId } = useLocalSearchParams();
const mission = getMissionById(missionId as string);
```

### Présentation modale
```typescript
// Dans _layout.tsx
<Stack.Screen name="create" options={{
    presentation: 'modal',
    headerShown: false,
}} />
```

## 🔧 Personnalisation

### Couleurs du thème
- **Primaire** : `blue-500` (#3b82f6)
- **Succès** : `green-500` (#16a34a)
- **Attention** : `orange-500` (#ea580c)
- **Danger** : `red-500` (#dc2626)

### Styles NativeWind
- Classes Tailwind CSS
- Responsive design
- États interactifs

## 📱 Test de l'intégration

### 1. **Test de navigation**
```bash
# Démarrer l'app
npm start

# Tester les routes
/missions          # Liste des missions
/missions/create   # Création
/missions/edit     # Édition
```

### 2. **Test des fonctionnalités**
- ✅ Création de mission
- ✅ Modification de mission
- ✅ Suppression avec confirmation
- ✅ Toggle statut actif/inactif
- ✅ Persistance locale
- ✅ Pull-to-refresh

### 3. **Test de persistance**
- Créer des missions
- Fermer l'application
- Relancer
- Vérifier la persistance

## 🎉 Avantages Expo Router

### 1. **Navigation native**
- Transitions fluides
- Gestion automatique du back
- Paramètres d'URL

### 2. **Structure claire**
- Organisation par dossiers
- Layouts imbriqués
- Configuration centralisée

### 3. **Performance**
- Chargement lazy
- Optimisation automatique
- Gestion d'état efficace

### 4. **Développement**
- Hot reload
- TypeScript support
- Debugging facile

---

**Intégration Expo Router terminée** ✅  
*Prêt pour la production avec navigation native* 