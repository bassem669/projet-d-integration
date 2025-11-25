# CourseModeration Platform

Une plateforme complète de gestion et modération de cours développée avec React.js, offrant des outils administratifs puissants pour la gestion des contenus éducatifs et des utilisateurs.

## 1. Fonctionnalités Principales

### 1.1 Tableau de Bord Administratif
- Vue d'ensemble complète avec métriques en temps réel
- Cartes de statistiques élégantes et impactantes
- Interface responsive adaptée à tous les appareils
- Design system cohérent à travers tout le panel admin

### 1.2 Modération des Cours
- Gestion multi-statuts : ALL, PENDING, APPROVED, REJECTED
- Filtres avancés par statut et recherche textuelle
- Actions rapides de modération en un clic
- Recalcul automatique des statistiques
- Interface de modération intuitive et efficace

### 1.3 Gestion des Utilisateurs
- Administration complète des profils utilisateurs
- Gestion des rôles avec mise à jour en temps réel
- Contrôle des statuts utilisateur (actif/inactif)
- Filtres avancés pour une gestion précise
- Actions administratives conformes aux spécifications US 5.3

## 2. Technologies Utilisées

### 2.1 Frontend
- React 18.2.0
- JavaScript ES6+
- Create React App 5.0.1
- CSS3 avec design system cohérent

### 2.2 Gestion d'état et Architecture
- React Hooks (useState, useEffect)
- Composants modulaires et réutilisables
- Architecture component-based

## 3. Installation

### 3.1 Prérequis
- Node.js (version 14.0.0 ou supérieure)
- npm ou yarn

### 3.2 Instructions d'installation

Étape 1 - Cloner le repository
```bash
git clone https://github.com/votre-username/coursemoderation-platform.git
cd coursemoderation-platform
```

Étape 2 - Installer les dépendances
```bash
npm install
```

Étape 3 - Démarrer l'application
```bash
npm start
```

L'application sera accessible sur http://localhost:3000

## 4. Scripts Disponibles

- `npm start` - Démarre l'application en mode développement
- `npm test` - Lance la suite de tests en mode watch interactif
- `npm run build` - Construit l'application pour la production
- `npm run eject` - Opération irréversible pour un contrôle total sur la configuration

## 5. Architecture du Projet

### 5.1 Structure des dossiers
```
src/
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminDashboard.css
│   │   ├── CourseModeration.jsx
│   │   └── UsersManagement.jsx
│   └── (autres pages...)
├── components/
├── utils/
├── assets/
└── styles/
```

### 5.2 Composants principaux
- AdminDashboard - Tableau de bord principal
- CourseModeration - Gestion de la modération des cours
- UsersManagement - Administration des utilisateurs

## 6. Design System

### 6.1 Palette de Couleurs
- Bleu Primaire: #1976d2 (Actions "Voir")
- Jaune/Orange: #ff9800 (Actions "Modifier")
- Vert: #4caf50 (Actions "Valider")
- Rouge: #f44336 (Actions "Refuser")
- Rouge Foncé: #d32f2f (Actions "Supprimer")

### 6.2 Composants d'Interface
- Cartes de Statistiques avec indicateurs visuels
- Badges de Statut avec codes couleur cohérents
- Tableaux Administratifs responsive avec actions contextuelles
- Boutons d'Action avec états hover élégants
- Barres de Recherche avec filtrage en temps réel

## 7. Responsive Design

### 7.1 Points de rupture
- Desktop (1200px+) - Layout complet avec sidebar fixe
- Laptop (992px - 1199px) - Interface optimisée
- Tablet (768px - 991px) - Navigation adaptative
- Mobile (< 768px) - Experience mobile-first

## 8. Fonctionnalités Détaillées

### 8.1 CourseModeration.jsx
- Récupération et affichage des cours
- Calcul automatique des statistiques
- Mise à jour des statuts en temps réel
- Système de filtres avancés
- Recherche textuelle performante

### 8.2 UsersManagement.jsx
- Chargement et affichage des utilisateurs
- Modification des rôles utilisateurs
- Basculer les statuts (actif/inactif)
- Suppression d'utilisateurs
- Filtres multi-critères
- Statistiques utilisateurs en temps réel

## 9. Déploiement

### 9.1 Build de Production
```bash
npm run build
```

### 9.2 Options de Déploiement
- Netlify - Drag & drop du dossier build
- Vercel - Intégration Git automatique
- AWS S3 + CloudFront - Solution scalable
- Serveur dédié - Service web classique

## 10. Tests

### 10.1 Commandes de test
```bash
# Lancer les tests
npm test

# Lancer les tests avec couverture
npm test -- --coverage
```

### 10.2 Métriques de Qualité
- Couverture de code : > 80% visée
- Performance Lighthouse : > 90/100
- Accessibilité : Conforme WCAG 2.1
- Temps de chargement : < 3s sur 3G

## 11. Contribution

### 11.1 Processus de contribution
1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

### 11.2 Standards de code
- Utiliser des noms significatifs pour les variables et fonctions
- Commenter le code complexe
- Maintenir la cohérence du style de code
- Tester les changements avant de soumettre

## 12. Dépannage

### 12.1 Problèmes courants
- Port 3000 occupé - L'application se déplace automatiquement sur le port suivant
- Dépendances manquantes - Exécuter `npm install` à nouveau
- Cache corrompu - Supprimer `node_modules` et `package-lock.json`, puis `npm install`

### 12.2 Erreurs de build
- `npm run build` échoue à minifier - Consulter la section troubleshooting de la documentation Create React App

## 13. Documentation

### 13.1 Liens importants
- Documentation Create React App
- Documentation React
- Code Splitting
- Analyzing the Bundle Size

## 14. Équipe

### 14.1 Membres de l'équipe
- Lead Developer : Votre Nom
- UI/UX Design : Équipe Design
- Testing : Équipe Qualité

## 15. Licence

### 15.1 Informations de licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

### 15.2 Remerciements
- L'équipe Create React App pour l'outil de bootstrap
- La communauté React pour les ressources et le support
- Tous les contributeurs qui ont participé au projet

---

**Version** : 1.0.0  
**Dernière mise à jour** : Décembre 2024  
**Support** : contact@votre-entreprise.com