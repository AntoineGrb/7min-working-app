# PRD.md - 7min Workout App

## Vue d'ensemble

**Projet** : Application PWA de musculation type "7 minutes workout"
**Usage** : Personnel uniquement
**Stack** : Next.js 14 + TypeScript + Tailwind CSS + localStorage

---

## Phases de développement

Le projet est découpé en 6 phases à réaliser dans l'ordre. Chaque phase doit être **complète et testée** avant de passer à la suivante.

---

## Phase 1 : Setup & Foundation

### Objectif
Mettre en place le projet avec toute la configuration nécessaire.

### Tâches

#### 1.1 Initialisation du projet
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

#### 1.2 Structure des dossiers
Créer l'arborescence complète :
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── exercises/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── workouts/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   └── play/
│       └── [id]/page.tsx
├── components/
├── lib/
└── types/
```

#### 1.3 Configuration Tailwind
Ajouter dans `tailwind.config.ts` :
```typescript
theme: {
  extend: {
    colors: {
      exercise: '#dc2626',  // red-600
      rest: '#2563eb',      // blue-600
      countdown: '#16a34a', // green-600
    }
  }
}
```

#### 1.4 Types de base
Créer `src/types/index.ts` avec tous les types définis dans CLAUDE.md.

#### 1.5 Layout principal
`src/app/layout.tsx` :
- Meta tags pour PWA
- Police système (pas de custom font)
- Fond sombre par défaut

### Validation Phase 1
- [ ] `npm run dev` fonctionne
- [ ] `npm run build` sans erreur
- [ ] Structure des dossiers créée
- [ ] Types compilent sans erreur

---

## Phase 2 : Données & Storage

### Objectif
Mettre en place les données des exercices et la couche de persistance.

### Tâches

#### 2.1 Données des exercices
Créer `src/lib/exercises-data.ts` avec les 12 exercices du 7min workout (voir CLAUDE.md pour le contenu complet).

#### 2.2 Séance par défaut
Dans le même fichier ou séparé, définir `DEFAULT_WORKOUT`.

#### 2.3 Couche storage
Créer `src/lib/storage.ts` :

```typescript
const STORAGE_KEYS = {
  WORKOUT_TYPES: 'workout-types',
  SESSIONS: 'workout-sessions',
} as const;

// Workout Types
export function getWorkoutTypes(): WorkoutType[] {
  if (typeof window === 'undefined') return [DEFAULT_WORKOUT];
  const stored = localStorage.getItem(STORAGE_KEYS.WORKOUT_TYPES);
  if (!stored) return [DEFAULT_WORKOUT];
  return JSON.parse(stored);
}

export function saveWorkoutType(workout: WorkoutType): void {
  const workouts = getWorkoutTypes();
  const index = workouts.findIndex(w => w.id === workout.id);
  if (index >= 0) {
    workouts[index] = workout;
  } else {
    workouts.push(workout);
  }
  localStorage.setItem(STORAGE_KEYS.WORKOUT_TYPES, JSON.stringify(workouts));
}

export function deleteWorkoutType(id: string): void {
  const workouts = getWorkoutTypes().filter(w => w.id !== id && !w.isDefault);
  localStorage.setItem(STORAGE_KEYS.WORKOUT_TYPES, JSON.stringify(workouts));
}

// Sessions (V2, mais préparer la structure)
export function getSessions(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return stored ? JSON.parse(stored) : [];
}

export function saveSession(session: WorkoutSession): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

// Export/Import
export function exportAllData(): string {
  return JSON.stringify({
    workouts: getWorkoutTypes(),
    sessions: getSessions(),
    exportedAt: new Date().toISOString(),
    version: '1.0'
  }, null, 2);
}

export function importData(json: string): { success: boolean; error?: string } {
  try {
    const data = JSON.parse(json);
    if (data.workouts) {
      localStorage.setItem(STORAGE_KEYS.WORKOUT_TYPES, JSON.stringify(data.workouts));
    }
    if (data.sessions) {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: 'Format JSON invalide' };
  }
}
```

#### 2.4 Helper pour accéder aux exercices
```typescript
// src/lib/exercises-data.ts
export function getExerciseById(id: string): Exercise | undefined {
  return DEFAULT_EXERCISES.find(e => e.id === id);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids.map(id => getExerciseById(id)).filter(Boolean) as Exercise[];
}
```

### Validation Phase 2
- [ ] `getWorkoutTypes()` retourne au moins la séance par défaut
- [ ] `saveWorkoutType()` persiste après refresh
- [ ] `deleteWorkoutType()` ne supprime pas la séance par défaut
- [ ] Export/Import fonctionnent (tester en console)

---

## Phase 3 : Pages de consultation

### Objectif
Afficher la liste et le détail des exercices et des séances.

### Tâches

#### 3.1 Page d'accueil
`src/app/page.tsx` :
- Header avec titre "7min Workout"
- Bouton principal "Lancer séance classique" (vert, gros)
- Deux cartes : "Mes séances" et "Exercices"
- Design dark mode

#### 3.2 Composant ExerciseCard
`src/components/ExerciseCard.tsx` :
- Affiche icône, nom, difficulté, groupes musculaires
- Cliquable (navigation vers détail)

#### 3.3 Liste des exercices
`src/app/exercises/page.tsx` :
- Header avec bouton retour
- Liste scrollable des 12 exercices
- Utilise ExerciseCard

#### 3.4 Détail d'un exercice
`src/app/exercises/[id]/page.tsx` :
- Grande icône/emoji
- Nom, difficulté, groupes musculaires
- Description détaillée formatée
- Bouton retour

#### 3.5 Composant WorkoutCard
`src/components/WorkoutCard.tsx` :
- Nom, nombre d'exercices, durées
- Badge "Par défaut" si applicable
- Cliquable

#### 3.6 Liste des séances
`src/app/workouts/page.tsx` :
- Header avec bouton retour et bouton "+"
- Liste des séances (défaut + personnalisées)

#### 3.7 Détail d'une séance
`src/app/workouts/[id]/page.tsx` :
- Infos de la séance
- Liste des exercices de la séance
- Bouton "Lancer cette séance"
- Bouton "Supprimer" (si pas défaut)

### Validation Phase 3
- [ ] Navigation fluide entre toutes les pages
- [ ] Les 12 exercices s'affichent correctement
- [ ] Le détail de chaque exercice est lisible
- [ ] La séance par défaut apparaît dans la liste
- [ ] Les liens "Lancer séance" pointent vers /play/[id]

---

## Phase 4 : Création de séance personnalisée

### Objectif
Permettre de créer une nouvelle séance en choisissant les exercices.

### Tâches

#### 4.1 Page de création
`src/app/workouts/new/page.tsx` :
- Input pour le nom de la séance
- Inputs pour durée exercice (défaut 30s)
- Inputs pour durée repos (défaut 10s)
- Liste des exercices avec checkboxes
- Compteur d'exercices sélectionnés
- Bouton "Créer" (disabled si nom vide ou 0 exo)
- Bouton "Annuler"

#### 4.2 Logique de sélection
- État local pour les exercices sélectionnés
- Réordonner les exercices sélectionnés (drag & drop optionnel, sinon ordre de sélection)
- Validation : au moins 1 exercice

#### 4.3 Sauvegarde
- Générer un ID unique (ex: `custom-${Date.now()}`)
- Sauvegarder via `saveWorkoutType()`
- Rediriger vers la liste des séances

### Validation Phase 4
- [ ] On peut créer une séance avec un nom personnalisé
- [ ] On peut sélectionner/désélectionner des exercices
- [ ] La séance créée apparaît dans la liste
- [ ] La séance persiste après refresh
- [ ] On peut supprimer une séance personnalisée

---

## Phase 5 : Player de séance (CŒUR DE L'APP)

### Objectif
Implémenter le player qui enchaîne les exercices avec chrono et sons.

### Tâches

#### 5.1 Fichiers audio
Créer/placer dans `public/sounds/` :
- `beep-start.mp3`
- `beep-end.mp3`
- `complete.mp3`

Note : Utiliser des sons courts, libres de droits. Possibilité de les générer ou les télécharger sur freesound.org.

#### 5.2 AudioManager
`src/lib/audio.ts` :
- Préchargement des sons
- Méthode unlock() pour débloquer l'audio mobile
- Méthode play(soundName)

#### 5.3 WakeLock
`src/lib/wake-lock.ts` :
- Fonction requestWakeLock()
- Fonction releaseWakeLock()

#### 5.4 Composant Timer
`src/components/Timer.tsx` :
- Affichage gros chiffres (text-8xl ou plus)
- Props : `seconds`, `totalSeconds` (pour la progress bar optionnelle)

#### 5.5 Composant ProgressDots
`src/components/ProgressDots.tsx` :
- Points indiquant la progression dans la séance
- Props : `total`, `current`

#### 5.6 Page Player
`src/app/play/[id]/page.tsx` :

**États du player :**
1. `countdown` : Compte à rebours initial (fond vert)
2. `exercise` : Exercice en cours (fond rouge)
3. `rest` : Repos entre exercices (fond bleu)
4. `paused` : En pause (overlay sombre)
5. `complete` : Séance terminée (fond vert gradient)

**Structure de la page :**
```typescript
'use client';

import { useState, useEffect, useCallback } from 'react';
// ... imports

export default function PlayPage({ params }: { params: { id: string } }) {
  const [state, setState] = useState<PlayerState>({
    status: 'countdown',
    currentExerciseIndex: 0,
    timeRemaining: 10, // countdown duration
    totalElapsed: 0,
  });

  const workout = getWorkoutTypeById(params.id);
  const exercises = getExercisesByIds(workout.exerciseIds);

  // Timer effect
  useEffect(() => {
    if (state.status === 'paused' || state.status === 'complete') return;

    const interval = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          // Transition logic
          return handleTransition(prev);
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.status]);

  // ... reste de la logique
}
```

**Logique de transition :**
- `countdown` → `exercise` (premier exercice)
- `exercise` → `rest` (si pas dernier exercice) ou `complete`
- `rest` → `exercise` (exercice suivant)

**UI par état :**

| État | Fond | Contenu principal | Actions |
|------|------|-------------------|---------|
| countdown | bg-green-600 | Timer + "Prochain: [nom]" | Bouton X (quitter) |
| exercise | bg-red-600 | Nom + icône + Timer | Pause, X |
| rest | bg-blue-600 | Timer + aperçu prochain | Pause, X |
| paused | Overlay sombre | "En pause" | Reprendre, Quitter |
| complete | Gradient vert | Stats + 🎉 | Accueil, Refaire |

**Sons à jouer :**
- Fin countdown : beep-start
- Début exercice (après repos) : beep-start
- Fin exercice : beep-end
- Séance complète : complete

#### 5.7 Gestion du quitter
- Confirmation avant de quitter en cours de séance
- "Voulez-vous vraiment quitter ?" avec Oui/Non

#### 5.8 Écran de fin
- Durée totale
- Exercices complétés
- Bouton "Retour accueil"
- Bouton "Refaire"
- Sauvegarder la session (pour V2)

### Validation Phase 5
- [ ] Le countdown démarre et passe à l'exercice
- [ ] Les exercices s'enchaînent avec le repos
- [ ] Le timer est précis (pas de drift visible)
- [ ] Les sons fonctionnent (tester sur mobile après tap)
- [ ] L'écran reste allumé (Wake Lock)
- [ ] La pause fonctionne correctement
- [ ] L'écran de fin affiche les bonnes stats
- [ ] On peut quitter avec confirmation

---

## Phase 6 : PWA & Polish

### Objectif
Rendre l'app installable et peaufiner l'expérience.

### Tâches

#### 6.1 Manifest PWA
`public/manifest.json` avec les bonnes infos (voir CLAUDE.md).

#### 6.2 Icônes
Créer ou générer des icônes :
- `public/icons/icon-192.png`
- `public/icons/icon-512.png`

Suggestion : icône simple avec emoji 💪 ou texte "7"

#### 6.3 Service Worker
`public/sw.js` basique pour le cache offline.

#### 6.4 Enregistrement du SW
Dans `src/app/layout.tsx` :
```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}, []);
```

#### 6.5 Meta tags
Dans `src/app/layout.tsx`, ajouter :
```html
<meta name="theme-color" content="#16a34a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/icons/icon-192.png" />
```

#### 6.6 Responsive check
- Tester sur différentes tailles (375px, 390px, 414px)
- S'assurer que les gros chiffres du timer sont lisibles
- Vérifier les boutons sont assez gros pour le tactile (min 44x44px)

#### 6.7 Export/Import (Settings basique)
Ajouter un lien/bouton discret quelque part (accueil ou menu) pour :
- Exporter les données en JSON (téléchargement)
- Importer un fichier JSON

### Validation Phase 6
- [ ] L'app peut être installée sur Android (Chrome)
- [ ] L'app peut être ajoutée à l'écran d'accueil iOS
- [ ] L'app fonctionne offline (pages en cache)
- [ ] L'export JSON fonctionne
- [ ] L'import JSON restaure les données

---

## Checklist finale globale

### Fonctionnel
- [ ] Accueil avec quick start
- [ ] Liste des exercices consultable
- [ ] Détail de chaque exercice
- [ ] Liste des séances
- [ ] Création de séance personnalisée
- [ ] Suppression de séance personnalisée
- [ ] Player complet (countdown → exercices → repos → fin)
- [ ] Pause/Resume pendant la séance
- [ ] Confirmation avant quitter
- [ ] Sons fonctionnels
- [ ] Écran reste allumé
- [ ] Données persistantes

### Technique
- [ ] Build sans erreur
- [ ] Pas de warning TypeScript
- [ ] PWA installable
- [ ] Fonctionne offline
- [ ] Export/Import données

### UX
- [ ] UI lisible sur mobile
- [ ] Boutons assez gros
- [ ] Timer visible de loin
- [ ] Couleurs de fond distinctes par état
- [ ] Navigation intuitive

---

## Notes pour Claude Code

1. **Réaliser les phases dans l'ordre** - ne pas sauter d'étapes
2. **Valider chaque phase** avant de passer à la suivante
3. **Tester sur mobile** (ou Chrome DevTools device mode) régulièrement
4. **En cas de doute** : choisir la solution la plus simple
5. **Commiter après chaque phase** avec un message clair

### Commandes Git suggérées
```bash
git init
git add .
git commit -m "Phase 1: Setup & Foundation"
# ... après chaque phase
```

### Si bloqué
- Relire CLAUDE.md pour les specs techniques
- Vérifier que les types sont corrects
- S'assurer que le localStorage fonctionne (pas en SSR)
- Pour les sons : vérifier le unlock() au premier tap
