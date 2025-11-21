# 🔗 Guide d'intégration des Missions

## 📱 Intégration dans l'application existante

### 1. Ajout dans le Drawer Navigation

Modifiez `app/_layout.tsx` pour ajouter l'écran des missions :

```typescript
import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

export default function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                initialRouteName="index"
                screenOptions={({ navigation }) => ({
                    // ... options existantes
                })}
                drawerContent={CustomDrawerContent}
            >
                <Drawer.Screen name="index" options={{
                    drawerLabel: 'Calendrier',
                    drawerIcon: () => <Ionicons name="calendar" size={24} color="#374151" />,
                    headerTitle: 'Calendrier',
                }} />
                
                {/* Nouvel écran des missions */}
                <Drawer.Screen name="missions" options={{
                    drawerLabel: 'Mes Missions',
                    drawerIcon: () => <Ionicons name="flag" size={24} color="#374151" />,
                    headerTitle: 'Mes Missions de Vie',
                }} />
            </Drawer>
        </GestureHandlerRootView>
    );
}
```

### 2. Création des écrans de navigation

Créez les fichiers suivants dans le dossier `app/` :

#### `app/missions.tsx` (Écran principal)
```typescript
import React from 'react';
import { View } from 'react-native';
import { MissionsScreen } from '../screens/MissionsScreen';
import { useRouter } from 'expo-router';

export default function MissionsPage() {
    const router = useRouter();
    
    const navigation = {
        navigate: (screen: string, params?: any) => {
            if (screen === 'CreateMission') {
                router.push('/missions/create');
            } else if (screen === 'EditMission') {
                router.push({
                    pathname: '/missions/edit',
                    params: { missionId: params.mission.id }
                });
            }
        },
        goBack: () => router.back(),
    };

    return (
        <View style={{ flex: 1 }}>
            <MissionsScreen navigation={navigation} />
        </View>
    );
}
```

#### `app/missions/create.tsx` (Création)
```typescript
import React from 'react';
import { View } from 'react-native';
import { CreateMissionScreen } from '../../screens/CreateMissionScreen';
import { useRouter } from 'expo-router';

export default function CreateMissionPage() {
    const router = useRouter();
    
    const navigation = {
        goBack: () => router.back(),
    };

    return (
        <View style={{ flex: 1 }}>
            <CreateMissionScreen navigation={navigation} />
        </View>
    );
}
```

#### `app/missions/edit.tsx` (Édition)
```typescript
import React from 'react';
import { View } from 'react-native';
import { EditMissionScreen } from '../../screens/EditMissionScreen';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMissions } from '../../hooks/useMissions';

export default function EditMissionPage() {
    const router = useRouter();
    const { missionId } = useLocalSearchParams();
    const { getMissionById } = useMissions();
    
    const mission = getMissionById(missionId as string);
    
    if (!mission) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Mission non trouvée</Text>
            </View>
        );
    }
    
    const navigation = {
        goBack: () => router.back(),
    };

    return (
        <View style={{ flex: 1 }}>
            <EditMissionScreen 
                navigation={navigation} 
                route={{ params: { mission } }}
            />
        </View>
    );
}
```

### 3. Intégration dans le HomeScreen

Ajoutez un bouton d'accès rapide aux missions dans `screens/HomeScreen.tsx` :

```typescript
import { useRouter } from 'expo-router';

export const HomeScreen = () => {
    const router = useRouter();
    
    const handleMissionsPress = () => {
        router.push('/missions');
    };
    
    return (
        <View>
            {/* Contenu existant */}
            
            {/* Bouton d'accès aux missions */}
            <TouchableOpacity
                onPress={handleMissionsPress}
                className="bg-blue-500 p-4 rounded-lg mt-4"
            >
                <View className="flex-row items-center">
                    <Ionicons name="flag" size={24} color="white" />
                    <Text className="text-white font-semibold ml-2">
                        Gérer mes missions
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
```

## 🎯 Utilisation des composants

### Hook useMissions

```typescript
import { useMissions } from '../hooks/useMissions';

const MyComponent = () => {
    const {
        missions,
        loading,
        error,
        createMission,
        updateMission,
        deleteMission,
        toggleMissionStatus,
    } = useMissions();
    
    // Utilisation...
};
```

### Composant MissionCard

```typescript
import { MissionCard } from '../components/MissionCard';

const MissionList = () => {
    const handleEdit = (mission) => {
        // Navigation vers l'édition
    };
    
    const handleDelete = (id) => {
        // Suppression
    };
    
    const handleToggle = (id) => {
        // Toggle statut
    };
    
    return (
        <MissionCard
            mission={mission}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggle}
        />
    );
};
```

## 🔧 Configuration

### 1. Vérification des dépendances

Assurez-vous que toutes les dépendances sont installées :

```bash
npm install @react-native-async-storage/async-storage
```

### 2. Types TypeScript

Les types sont déjà définis dans `types/index.d.ts` et exportés.

### 3. Styles NativeWind

Les styles utilisent NativeWind qui est déjà configuré dans le projet.

## 🚀 Test de l'intégration

### 1. Test de navigation

```bash
# Démarrer l'application
npm start

# Naviguer vers les missions
# Ouvrir le drawer et cliquer sur "Mes Missions"
```

### 2. Test des fonctionnalités

1. **Créer une mission** : Bouton "+" → Formulaire → Validation
2. **Modifier une mission** : Clic sur l'icône crayon → Édition
3. **Supprimer une mission** : Clic sur l'icône poubelle → Confirmation
4. **Toggle statut** : Clic sur l'icône play/pause

### 3. Test de persistance

- Créer des missions
- Fermer l'application
- Relancer l'application
- Vérifier que les missions sont toujours présentes

## 📝 Notes importantes

### Compatibilité
- ✅ Expo managed workflow
- ✅ React Navigation v6
- ✅ TypeScript strict
- ✅ NativeWind v4

### Performance
- Les données sont chargées de manière asynchrone
- Optimisation des re-renders avec useCallback
- Gestion d'état locale avec AsyncStorage

### Sécurité
- Validation des données côté client
- Gestion des erreurs robuste
- Confirmation pour les actions destructives

---

**Intégration prête** ✅  
*Suivez ce guide pour intégrer les missions dans votre application* 