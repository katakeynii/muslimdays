# 🕌 MuslimDay - Heures de Prière

Application mobile React Native pour afficher les heures de prière musulmanes avec précision astronomique.

## ✨ Fonctionnalités

- **Calculs astronomiques précis** : Utilise les formules astronomiques standard pour calculer les heures de prière
- **Géolocalisation automatique** : Récupère votre position pour des calculs précis
- **8 méthodes de calcul** : Support de différentes méthodes (MWL, ISNA, Umm al-Qura, etc.)
- **Interface moderne** : Design élégant avec NativeWind (TailwindCSS)
- **Plages horaires** : Affiche les plages valides pour chaque prière
- **Prière active** : Mise en évidence de la prière en cours
- **Stockage local** : Sauvegarde des préférences utilisateur
- **Mode hors ligne** : Fonctionne sans connexion internet

## 🕐 Prières Supportées

- **Fajr** : Prière de l'aube
- **Sunrise** : Lever du soleil
- **Dhuhr** : Prière de midi
- **Asr** : Prière de l'après-midi
- **Maghrib** : Prière du coucher du soleil
- **Isha** : Prière de la nuit

## 🔢 Méthodes de Calcul

| Méthode         | Fajr  | Isha   | Description                      |
| --------------- | ----- | ------ | -------------------------------- |
| **MWL**         | 18°   | 17°    | Muslim World League              |
| **ISNA**        | 15°   | 15°    | Islamic Society of North America |
| **Umm al-Qura** | 18.5° | 90min  | Umm al-Qura University, Makkah   |
| **Egypt**       | 19.5° | 17.5°  | Egyptian General Authority       |
| **Makkah**      | 18.5° | 120min | Umm al-Qura University (New)     |
| **Karachi**     | 18°   | 18°    | University of Islamic Sciences   |
| **Tehran**      | 17.7° | 14°    | Institute of Geophysics          |
| **Jafari**      | 16°   | 14°    | Shia Ithna Ashari                |

## 🛠️ Technologies

- **React Native** avec **Expo**
- **TypeScript** pour la sécurité des types
- **NativeWind** (TailwindCSS) pour le styling
- **expo-location** pour la géolocalisation
- **AsyncStorage** pour le stockage local
- **Calculs astronomiques** personnalisés

## 📱 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Expo CLI
- Un appareil mobile ou émulateur

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd MuslimDay
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer l'application**
   ```bash
   npm start
   ```

4. **Scanner le QR code** avec l'application Expo Go sur votre mobile

## 🏗️ Architecture

```
MuslimDay/
├── constants/
│   └── methods.ts          # Méthodes de calcul des prières
├── lib/
│   └── astro.ts            # Calculs astronomiques
├── services/
│   ├── prayerTimes.ts      # Service principal des heures
│   ├── locationService.ts  # Service de géolocalisation
│   └── storageService.ts   # Service de stockage local
├── components/
│   ├── PrayerCard.tsx      # Carte d'affichage d'une prière
│   ├── MethodSelector.tsx  # Sélecteur de méthode
│   └── CurrentTimeDisplay.tsx # Affichage de l'heure actuelle
├── screens/
│   └── HomeScreen.tsx      # Écran principal
├── utils/
│   └── time.ts             # Utilitaires de formatage
└── App.tsx                 # Point d'entrée
```

## 🔬 Calculs Astronomiques

L'application utilise les formules astronomiques standard :

### Jour Julien
```
JD = 367 × Y - ⌊(7 × (Y + ⌊(M + 9)/12⌋))/4⌋ + ⌊(275 × M)/9⌋ + D + 1721013.5 + UT/24
```

### Coordonnées Solaires
- **Déclinaison** : Position du soleil par rapport à l'équateur
- **Équation du temps** : Différence entre temps solaire et temps civil

### Heure d'une Prière
```
cos(H) = ( -sin(h) - sin(φ) × sin(δ) ) / (cos(φ) × cos(δ))
T = 12 ± H/15 - λ/15 + EqT
```

Où :
- `H` = angle horaire
- `φ` = latitude
- `λ` = longitude
- `h` = angle solaire pour la prière

## 🎨 Interface Utilisateur

- **Design moderne** avec des couleurs douces
- **Animations fluides** pour une meilleure expérience
- **Responsive** pour tous les écrans
- **Accessibilité** prise en compte
- **Mode sombre** (à venir)

## 📊 Plages Horaire

Chaque prière a une plage horaire valide :

| Prière      | Début             | Fin               |
| ----------- | ----------------- | ----------------- |
| **Fajr**    | Angle Fajr        | Lever du soleil   |
| **Dhuhr**   | Zénith            | Ombre = 1× taille |
| **Asr**     | Fin Dhuhr         | Coucher du soleil |
| **Maghrib** | Coucher du soleil | Fin lueur rouge   |
| **Isha**    | Fin Maghrib       | Avant Fajr        |

## 🔧 Configuration

### Variables d'environnement

Aucune variable d'environnement requise pour le moment.

### Permissions

L'application demande les permissions suivantes :
- **Localisation** : Pour calculer les heures précises selon votre position

## 🚀 Déploiement

### Build pour production

```bash
# Pour Android
expo build:android

# Pour iOS
expo build:ios
```

### Publication sur les stores

```bash
# Publier sur Expo
expo publish
```

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Formules astronomiques basées sur les travaux de l'US Naval Observatory
- Méthodes de calcul des différentes organisations islamiques
- Communauté React Native et Expo

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**MuslimDay** - Vos heures de prière, calculées avec précision astronomique 🌙 