# 🔐 Guide d'authentification

Ce document explique comment fonctionne le système d'authentification de l'application MuslimDay.

## 📋 Vue d'ensemble

L'application utilise **Supabase Auth** pour gérer l'authentification des utilisateurs. Le système est intégré avec Expo Router pour protéger les routes et gérer la navigation.

## 🏗️ Structure

### Fichiers créés

1. **`contexts/AuthContext.tsx`**
   - Contexte React pour gérer l'état d'authentification
   - Fournit les fonctions `signIn`, `signUp`, `signOut`
   - Écoute les changements d'état d'authentification

2. **`app/(auth)/sign-in.tsx`**
   - Page de connexion
   - Formulaire avec email et mot de passe
   - Validation des champs
   - Affichage/masquage du mot de passe

3. **`app/(auth)/sign-up.tsx`**
   - Page d'inscription
   - Formulaire avec nom (optionnel), email et mot de passe
   - Confirmation du mot de passe
   - Validation de la force du mot de passe

4. **`app/(auth)/_layout.tsx`**
   - Layout pour les routes d'authentification
   - Stack navigator sans header

5. **`app/(tabs)/_layout.tsx`**
   - Layout pour les routes protégées
   - Contient le Drawer navigator
   - Bouton de déconnexion dans le drawer

6. **`app/_layout.tsx`** (modifié)
   - Layout racine avec protection des routes
   - Redirection automatique selon l'état d'authentification
   - Intègre `AuthProvider` et `RealmProvider`

## 🔒 Protection des routes

Les routes sont organisées en deux groupes :

### Routes publiques (`(auth)`)
- `/sign-in` - Connexion
- `/sign-up` - Inscription

### Routes protégées (`(tabs)`)
- `/` - Calendrier (page d'accueil)
- `/missions` - Missions
- `/objectives` - Objectifs
- `/actions` - Actions
- `/prayers` - Prières
- `/agenda` - Agenda

**Comportement :**
- Si l'utilisateur n'est **pas authentifié** et essaie d'accéder à une route protégée → redirection vers `/sign-in`
- Si l'utilisateur **est authentifié** et essaie d'accéder à une route d'auth → redirection vers `/`

## 🎯 Utilisation

### Dans un composant

```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
    const { user, signOut } = useAuth();

    if (!user) {
        return <Text>Non connecté</Text>;
    }

    return (
        <View>
            <Text>Connecté en tant que {user.email}</Text>
            <Button onPress={signOut} title="Déconnexion" />
        </View>
    );
}
```

### Fonctions disponibles

```typescript
const {
    user,        // User | null - Utilisateur actuel
    loading,     // boolean - État de chargement
    signIn,      // (email: string, password: string) => Promise<void>
    signUp,      // (email: string, password: string, fullName?: string) => Promise<void>
    signOut,     // () => Promise<void>
} = useAuth();
```

## ⚙️ Configuration

### Variables d'environnement

Assurez-vous d'avoir un fichier `.env` à la racine avec :

```env
EXPO_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

### Configuration Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Récupérez l'URL et la clé anonyme depuis les paramètres du projet
3. Ajoutez-les dans votre fichier `.env`

## 🎨 Interface utilisateur

### Page de connexion
- Champ email avec icône
- Champ mot de passe avec affichage/masquage
- Bouton de connexion
- Lien vers l'inscription

### Page d'inscription
- Champ nom complet (optionnel)
- Champ email
- Champ mot de passe avec validation
- Champ confirmation du mot de passe
- Bouton d'inscription
- Lien vers la connexion

### Drawer
- Affiche l'email de l'utilisateur connecté
- Bouton de déconnexion avec confirmation

## 🔄 Flux d'authentification

1. **Au démarrage de l'app :**
   - Vérification de la session existante
   - Si session valide → affichage de l'app
   - Si pas de session → redirection vers `/sign-in`

2. **Connexion :**
   - L'utilisateur saisit email/mot de passe
   - Appel à `signIn()`
   - Si succès → redirection vers `/`
   - Si erreur → affichage du message d'erreur

3. **Inscription :**
   - L'utilisateur saisit les informations
   - Appel à `signUp()`
   - Si succès → message de confirmation → redirection vers `/sign-in`
   - Si erreur → affichage du message d'erreur

4. **Déconnexion :**
   - Clic sur "Déconnexion" dans le drawer
   - Confirmation
   - Appel à `signOut()`
   - Redirection vers `/sign-in`

## 🛡️ Sécurité

- Les mots de passe sont stockés de manière sécurisée par Supabase
- Les sessions sont gérées automatiquement avec refresh token
- Les routes protégées sont inaccessibles sans authentification
- Les tokens sont stockés dans AsyncStorage (chiffrés)

## 🐛 Dépannage

### L'utilisateur n'est pas redirigé après connexion
- Vérifiez que les variables d'environnement sont correctement définies
- Vérifiez la console pour les erreurs Supabase

### Erreur "Missing Supabase environment variables"
- Vérifiez que le fichier `.env` existe
- Vérifiez que les variables commencent par `EXPO_PUBLIC_`
- Redémarrez le serveur Metro après modification du `.env`

### Les routes ne sont pas protégées
- Vérifiez que `AuthProvider` entoure bien l'application dans `_layout.tsx`
- Vérifiez que `RootLayoutNav` utilise bien `useAuth()`

## 📚 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Context API](https://react.dev/reference/react/useContext)

