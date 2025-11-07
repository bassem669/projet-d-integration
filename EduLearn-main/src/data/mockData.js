// src/data/mockData.js

export const categories = [
  { id: 'tous', name: 'Tous les cours', count: 12 },
  { id: 'en-cours', name: 'En cours', count: 5 },
  { id: 'termines', name: 'Terminés', count: 3 },
  { id: 'nouveaux', name: 'Nouveaux', count: 4 },
  { id: 'favoris', name: 'Favoris', count: 2 }
];

export const allCourses = [
  {
    id: 1,
    title: "Introduction à la Programmation Python",
    description: "Maîtrisez les bases de la programmation avec Python. Variables, boucles, fonctions et premiers projets.",
    category: "en-cours",
    progress: 65,
    duration: "15h",
    lessons: 24,
    level: "Débutant",
    instructor: "Dr. Marie Martin",
    rating: 4.8,
    students: 1247,
    image: "🐍",
    isFavorite: true,
    lastAccessed: "Il y a 2 jours",
    contenu: `
# Chapitre 1 : Les bases de Python

## Variables et types de données
- Nombres entiers et flottants
- Chaînes de caractères
- Listes et dictionnaires
- Opérations de base

## Structures de contrôle
- Conditions if/elif/else
- Boucles for et while
- Compréhensions de listes

## Fonctions
- Définition de fonctions
- Paramètres et valeurs de retour
- Portée des variables
    `,
    ressources: [
      { id: 1, nom: "Support de cours PDF", type: "pdf", taille: "2.3 MB" },
      { id: 2, nom: "Exercices pratiques", type: "doc", taille: "1.1 MB" },
      { id: 3, nom: "Vidéo d'introduction", type: "video", taille: "15.2 MB" }
    ]
  },
  {
    id: 2,
    title: "Mathématiques Avancées pour l'Ingénierie",
    description: "Algèbre linéaire, calcul différentiel et intégral avec applications pratiques en ingénierie.",
    category: "en-cours",
    progress: 40,
    duration: "30h",
    lessons: 42,
    level: "Intermédiaire",
    instructor: "Prof. Alain Dubois",
    rating: 4.6,
    students: 856,
    image: "🧮",
    isFavorite: false,
    lastAccessed: "Il y a 5 jours",
    contenu: `
# Mathématiques Avancées

## Algèbre Linéaire
- Vecteurs et espaces vectoriels
- Matrices et déterminants
- Systèmes d'équations linéaires
- Valeurs propres et vecteurs propres

## Calcul Différentiel
- Dérivées partielles
- Gradient et divergence
- Théorème de Taylor multivarié
- Optimisation avec contraintes

## Calcul Intégral
- Intégrales multiples
- Changement de variables
- Théorèmes de Green, Stokes et Gauss
- Applications physiques
    `,
    ressources: [
      { id: 1, nom: "Cours d'algèbre linéaire", type: "pdf", taille: "3.1 MB" },
      { id: 2, nom: "Problèmes résolus", type: "pdf", taille: "2.8 MB" }
    ]
  },
  {
    id: 3,
    title: "Histoire de l'Art Moderne",
    description: "Explorez les mouvements artistiques du 20ème siècle de l'impressionnisme au contemporain.",
    category: "en-cours",
    progress: 20,
    duration: "20h",
    lessons: 18,
    level: "Débutant",
    instructor: "Dr. Sophie Lambert",
    rating: 4.9,
    students: 2103,
    image: "🎨",
    isFavorite: true,
    lastAccessed: "Aujourd'hui",
    contenu: `
# Histoire de l'Art Moderne

## L'Impressionnisme (1870-1890)
- Claude Monet et les peintres de la lumière
- La révolution de la peinture en plein air
- Techniques et sujets impressionnistes

## Le Cubisme (1907-1914)
- Pablo Picasso et Georges Braque
- La déconstruction de la perspective
- Influence sur l'art abstrait

## Le Surréalisme (1924-1966)
- André Breton et le manifeste surréaliste
- L'automatisme et l'inconscient
- Salvador Dalí et René Magritte

## L'Expressionnisme Abstrait
- Jackson Pollock et l'action painting
- Mark Rothko et les champs de couleur
- L'école de New York
    `,
    ressources: [
      { id: 1, nom: "Catalogue des œuvres", type: "pdf", taille: "4.2 MB" },
      { id: 2, nom: "Timeline interactif", type: "doc", taille: "1.5 MB" },
      { id: 3, nom: "Galerie virtuelle", type: "video", taille: "25.7 MB" }
    ]
  },
  {
    id: 4,
    title: "Développement Web Full Stack",
    description: "Apprenez à créer des applications web complètes avec HTML, CSS, JavaScript et Node.js.",
    category: "nouveaux",
    progress: 0,
    duration: "40h",
    lessons: 56,
    level: "Intermédiaire",
    instructor: "M. Thomas Leroy",
    rating: 4.7,
    students: 3120,
    image: "💻",
    isFavorite: false,
    lastAccessed: "Jamais",
    contenu: `
# Développement Web Full Stack

## Frontend Foundation
- HTML5 sémantique
- CSS3 avancé (Flexbox, Grid)
- JavaScript ES6+
- Accessibilité web

## Frontend Moderne
- React.js et composants
- Gestion d'état avec Redux
- Routing avec React Router
- Tests unitaires

## Backend Development
- Node.js et Express.js
- Bases de données (MongoDB, PostgreSQL)
- API RESTful
- Authentification et sécurité

## Déploiement et DevOps
- Conteneurisation avec Docker
- CI/CD pipelines
- Services cloud (AWS, Vercel)
- Monitoring et performance
    `,
    ressources: [
      { id: 1, nom: "Guide de référence", type: "pdf", taille: "5.1 MB" },
      { id: 2, nom: "Projet final", type: "zip", taille: "8.3 MB" },
      { id: 3, nom: "API documentation", type: "doc", taille: "2.2 MB" }
    ]
  },
  {
    id: 5,
    title: "Data Science Fundamentals",
    description: "Introduction aux données, statistiques et machine learning avec Python et pandas.",
    category: "nouveaux",
    progress: 0,
    duration: "35h",
    lessons: 48,
    level: "Intermédiaire",
    instructor: "Dr. Pierre Moreau",
    rating: 4.8,
    students: 1895,
    image: "📊",
    isFavorite: false,
    lastAccessed: "Jamais",
    contenu: `
# Data Science Fundamentals

## Préparation des Données
- Nettoyage et prétraitement
- Gestion des valeurs manquantes
- Feature engineering
- Normalisation et standardisation

## Analyse Statistique
- Statistiques descriptives
- Tests d'hypothèses
- Corrélations et régressions
- Analyse de variance

## Machine Learning
- Algorithmes supervisés
- Algorithmes non-supervisés
- Validation croisée
- Métriques d'évaluation

## Visualisation
- Matplotlib et Seaborn
- Plotly pour l'interactivité
- Tableaux de bord
- Storytelling avec les données
    `,
    ressources: [
      { id: 1, nom: "Jeux de données", type: "zip", taille: "12.4 MB" },
      { id: 2, nom: "Notebooks Jupyter", type: "zip", taille: "6.8 MB" },
      { id: 3, nom: "Librairies Python", type: "doc", taille: "1.9 MB" }
    ]
  },
  {
    id: 6,
    title: "Anglais des Affaires",
    description: "Perfectionnez votre anglais professionnel pour le monde des affaires international.",
    category: "termines",
    progress: 100,
    duration: "25h",
    lessons: 32,
    level: "Intermédiaire",
    instructor: "Mme. Jennifer Smith",
    rating: 4.9,
    students: 4287,
    image: "🇬🇧",
    isFavorite: true,
    lastAccessed: "Il y a 1 mois",
    contenu: `
# Anglais des Affaires

## Communication Professionnelle
- Rédaction d'emails formels
- Présentations d'entreprise
- Réunions et conférences calls
- Négociations commerciales

## Vocabulaire Spécialisé
- Terminologie financière
- Jargon du marketing
- Expressions du management
- Vocabulaire technique

## Culture d'Entreprise
- Différences culturelles
- Étiquette professionnelle
- Réseautage international
- Gestion des conflits

## Compétences Avancées
- Présentations persuasives
- Rapports détaillés
- Communication interculturelle
- Leadership en anglais
    `,
    ressources: [
      { id: 1, nom: "Guide de conversation", type: "pdf", taille: "3.7 MB" },
      { id: 2, nom: "Audio exercises", type: "zip", taille: "18.9 MB" },
      { id: 3, nom: "Business vocabulary", type: "doc", taille: "2.1 MB" }
    ]
  }
];

export const userData = {
  name: "Nom Prénom",
  profileInitials: "NP"
};

export const badges = [
  { id: 1, name: "Débutant", icon: "⭐" },
  { id: 2, name: "Assidu", icon: "🔥" },
  { id: 3, name: "Curieux", icon: "🔍" },
  { id: 4, name: "Persévérant", icon: "💪" },
  { id: 5, name: "Rapide", icon: "⚡" },
  { id: 6, name: "Expert", icon: "🏆" }
];