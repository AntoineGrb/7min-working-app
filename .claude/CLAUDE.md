# CLAUDE.md - 7min Workout App

## 🎯 Résumé du projet

Application PWA minimaliste de musculation type "7 minutes workout". Usage personnel uniquement.

**Stack technique** : Next.js 14 (App Router) + TypeScript + Tailwind CSS + localStorage

**Objectif** : Application fonctionnelle, simple, utilisable sur mobile comme une app native.

---

## 📁 Structure du projet

```
/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service Worker basique
│   ├── icons/                 # Icônes PWA (192x192, 512x512)
│   └── sounds/
│       ├── beep-start.mp3     # Bip début exercice
│       ├── beep-end.mp3       # Bip fin exercice
│       └── complete.mp3       # Son fin de séance
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout principal + PWA meta tags
│   │   ├── page.tsx           # Accueil
│   │   ├── exercises/
│   │   │   ├── page.tsx       # Liste des exercices
│   │   │   └── [id]/page.tsx  # Détail d'un exercice
│   │   ├── workouts/
│   │   │   ├── page.tsx       # Liste des séances
│   │   │   ├── new/page.tsx   # Création de séance
│   │   │   └── [id]/page.tsx  # Détail/édition séance
│   │   └── play/
│   │       └── [id]/page.tsx  # Player de séance
│   ├── components/
│   │   ├── Timer.tsx          # Composant chronomètre
│   │   ├── ExerciseCard.tsx   # Carte exercice (liste)
│   │   ├── WorkoutCard.tsx    # Carte séance (liste)
│   │   └── ProgressDots.tsx   # Indicateur de progression
│   ├── lib/
│   │   ├── exercises-data.ts  # Données statiques des exercices
│   │   ├── storage.ts         # Abstraction localStorage
│   │   ├── audio.ts           # Gestion des sons
│   │   └── wake-lock.ts       # API Wake Lock
│   └── types/
│       └── index.ts           # Types TypeScript
├── CLAUDE.md                  # Ce fichier
├── PRD.md                     # Features et tâches détaillées
└── package.json
```

---

## 🔧 Configuration et conventions

### Commandes

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Linter
npm run lint
```

### Conventions de code

- **TypeScript strict** : activer `strict: true` dans tsconfig
- **Composants** : fonctionnels avec hooks, pas de classes
- **Nommage** :
  - Composants : PascalCase (`ExerciseCard.tsx`)
  - Fichiers utilitaires : kebab-case (`exercises-data.ts`)
  - Types/Interfaces : PascalCase avec préfixe I pour interfaces (`IExercise` ou juste `Exercise`)
- **Imports** : utiliser les alias `@/` pour `src/`
- **Pas de `any`** : typer explicitement tout

### Tailwind - Classes récurrentes

```
Fond principal : bg-gray-900
Cartes : bg-gray-800 rounded-xl
Boutons primaires : bg-green-600 hover:bg-green-700
Texte secondaire : text-gray-400
Couleur exercice : bg-red-600
Couleur repos : bg-blue-600
Couleur démarrage : bg-green-600
```

---

## 📊 Modèles de données

### Types (src/types/index.ts)

```typescript
export interface Exercise {
  id: string;
  name: string;
  description: string;       // Instructions détaillées
  icon: string;              // Emoji pour V1
  imageUrl?: string;         // URL image (V2)
  difficulty: 'easy' | 'medium' | 'hard';
  muscleGroups: string[];
}

export interface WorkoutType {
  id: string;
  name: string;
  isDefault: boolean;
  exerciseDuration: number;  // secondes
  restDuration: number;      // secondes
  countdownDuration: number; // secondes (défaut: 10)
  exerciseIds: string[];     // IDs des exercices dans l'ordre
  color?: string;            // Couleur personnalisée (optionnel)
  createdAt: string;         // ISO date
}

export interface WorkoutSession {
  id: string;
  workoutTypeId: string;
  workoutName: string;
  completedAt: string;       // ISO date
  duration: number;          // durée totale en secondes
  exercisesCompleted: number;
  exercisesTotal: number;
}

// État du player
export interface PlayerState {
  status: 'countdown' | 'exercise' | 'rest' | 'paused' | 'complete';
  currentExerciseIndex: number;
  timeRemaining: number;
  totalElapsed: number;
}
```

### Clés localStorage

```typescript
const STORAGE_KEYS = {
  WORKOUT_TYPES: 'workout-types',
  SESSIONS: 'workout-sessions',  // V2
} as const;
```

Note : Les exercices sont en données statiques, pas en localStorage.

---

## 🏋️ Exercices par défaut

Les 12 exercices du 7-minute workout classique (ordre officiel) :

```typescript
export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    description: "1. Debout, pieds joints, bras le long du corps\n2. Sauter en écartant les jambes et lever les bras au-dessus de la tête\n3. Revenir en position initiale en sautant\n4. Répéter de façon continue et rythmée",
    icon: "🏃",
    difficulty: "easy",
    muscleGroups: ["cardio", "jambes"]
  },
  {
    id: "wall-sit",
    name: "Wall Sit (Chaise)",
    description: "1. Dos plaqué contre un mur\n2. Descendre jusqu'à ce que les cuisses soient parallèles au sol\n3. Genoux à 90°, comme assis sur une chaise invisible\n4. Maintenir la position sans bouger",
    icon: "🪑",
    difficulty: "medium",
    muscleGroups: ["jambes", "quadriceps"]
  },
  {
    id: "push-ups",
    name: "Push-ups (Pompes)",
    description: "1. Position planche, mains écartées largeur d'épaules\n2. Corps aligné de la tête aux pieds, abdos gainés\n3. Descendre en pliant les coudes jusqu'à frôler le sol\n4. Pousser pour remonter bras tendus\n5. Garder le dos droit tout au long du mouvement",
    icon: "💪",
    difficulty: "medium",
    muscleGroups: ["poitrine", "bras", "épaules"]
  },
  {
    id: "crunches",
    name: "Crunches (Abdominaux)",
    description: "1. Allongé sur le dos, genoux pliés, pieds au sol\n2. Mains derrière la tête ou croisées sur la poitrine\n3. Contracter les abdos pour décoller les épaules du sol\n4. Ne pas tirer sur la nuque\n5. Redescendre lentement",
    icon: "🔥",
    difficulty: "easy",
    muscleGroups: ["abdos"]
  },
  {
    id: "step-ups",
    name: "Step-up (Montée sur chaise)",
    description: "1. Face à une chaise ou marche stable\n2. Monter un pied sur la chaise, pousser pour monter\n3. Redescendre de manière contrôlée\n4. Alterner les jambes à chaque répétition",
    icon: "⬆️",
    difficulty: "easy",
    muscleGroups: ["jambes", "fessiers"]
  },
  {
    id: "squats",
    name: "Squats",
    description: "1. Debout, pieds écartés largeur d'épaules\n2. Descendre en poussant les fesses vers l'arrière\n3. Cuisses parallèles au sol, genoux au-dessus des orteils\n4. Remonter en poussant sur les talons\n5. Garder le dos droit",
    icon: "🦵",
    difficulty: "easy",
    muscleGroups: ["jambes", "fessiers"]
  },
  {
    id: "triceps-dips",
    name: "Triceps Dips",
    description: "1. Mains sur le bord d'une chaise, doigts vers l'avant\n2. Fesses devant la chaise, jambes tendues ou pliées\n3. Descendre en pliant les coudes vers l'arrière\n4. Remonter en poussant sur les bras\n5. Coudes restent proches du corps",
    icon: "🪑",
    difficulty: "medium",
    muscleGroups: ["bras", "triceps"]
  },
  {
    id: "plank",
    name: "Planche (Plank)",
    description: "1. Position de pompe mais sur les avant-bras\n2. Corps parfaitement aligné de la tête aux talons\n3. Abdos et fessiers contractés\n4. Ne pas lever ni baisser les hanches\n5. Respirer normalement et maintenir",
    icon: "📏",
    difficulty: "hard",
    muscleGroups: ["core", "abdos", "épaules"]
  },
  {
    id: "high-knees",
    name: "High Knees (Genoux hauts)",
    description: "1. Debout, courir sur place\n2. Lever les genoux le plus haut possible (niveau hanches)\n3. Balancer les bras naturellement\n4. Maintenir un rythme rapide et régulier",
    icon: "🏃",
    difficulty: "medium",
    muscleGroups: ["cardio", "jambes"]
  },
  {
    id: "lunges",
    name: "Lunges (Fentes)",
    description: "1. Debout, faire un grand pas en avant\n2. Descendre jusqu'à ce que les deux genoux soient à 90°\n3. Genou arrière proche du sol sans le toucher\n4. Remonter et alterner les jambes\n5. Garder le buste droit",
    icon: "🦿",
    difficulty: "medium",
    muscleGroups: ["jambes", "fessiers"]
  },
  {
    id: "push-up-rotation",
    name: "Push-up Rotation",
    description: "1. Faire une pompe classique\n2. En remontant, pivoter le corps sur le côté\n3. Lever un bras vers le ciel, corps en T\n4. Revenir en position pompe\n5. Alterner les côtés à chaque pompe",
    icon: "🔄",
    difficulty: "hard",
    muscleGroups: ["poitrine", "épaules", "core"]
  },
  {
    id: "side-plank",
    name: "Side Plank (Planche latérale)",
    description: "1. Allongé sur le côté, appui sur l'avant-bras\n2. Lever les hanches pour aligner le corps\n3. Maintenir la position, corps droit\n4. Changer de côté à mi-temps (15s chaque côté)",
    icon: "📐",
    difficulty: "hard",
    muscleGroups: ["core", "obliques"]
  }
];
```

### Séance par défaut

```typescript
export const DEFAULT_WORKOUT: WorkoutType = {
  id: "default-7min",
  name: "7min Classique",
  isDefault: true,
  exerciseDuration: 30,
  restDuration: 10,
  countdownDuration: 10,
  exerciseIds: DEFAULT_EXERCISES.map(e => e.id),
  createdAt: new Date().toISOString()
};
```

---

## 🔊 Audio

### Fichiers nécessaires

Placer dans `/public/sounds/` :
- `beep-start.mp3` : court bip aigu (début exercice)
- `beep-end.mp3` : double bip (fin exercice)
- `complete.mp3` : son de victoire/accomplissement

### Gestion audio (src/lib/audio.ts)

```typescript
class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private unlocked = false;

  // Appeler au premier tap utilisateur
  unlock() {
    if (this.unlocked) return;
    const silent = new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10...');
    silent.play().then(() => {
      this.unlocked = true;
    }).catch(() => {});
  }

  preload(name: string, src: string) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    this.sounds.set(name, audio);
  }

  play(name: string) {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }
}

export const audioManager = new AudioManager();
```

---

## 📱 PWA Configuration

### manifest.json

```json
{
  "name": "7min Workout",
  "short_name": "7min",
  "description": "Application de musculation rapide",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#111827",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker basique (sw.js)

```javascript
const CACHE_NAME = '7min-v1';
const urlsToCache = ['/', '/exercises', '/workouts'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

## 💡 Points techniques importants

### 1. Wake Lock (garder l'écran allumé)

```typescript
// src/lib/wake-lock.ts
export async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      const wakeLock = await navigator.wakeLock.request('screen');
      return wakeLock;
    } catch (err) {
      console.log('Wake Lock non supporté ou refusé');
    }
  }
  return null;
}
```

### 2. Timer précis

Utiliser `requestAnimationFrame` ou `setInterval` avec correction de drift :

```typescript
// Pas juste setInterval(fn, 1000) qui drift
// Calculer le temps réel écoulé à chaque tick
```

### 3. Gestion du state du Player

Le player doit gérer :
- Pause/Resume
- Quitter en cours de séance (confirmation)
- Passage auto exercice → repos → exercice
- Sauvegarde à la fin

### 4. Export/Import JSON

Prévoir une fonction dans les settings :

```typescript
export function exportData(): string {
  return JSON.stringify({
    workouts: getWorkoutTypes(),
    sessions: getSessions(),
    exportedAt: new Date().toISOString()
  });
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json);
    // Valider et importer
    return true;
  } catch {
    return false;
  }
}
```

---

## ✅ Checklist de validation

Avant de considérer le projet terminé, vérifier :

- [ ] L'app se lance sans erreur (`npm run dev`)
- [ ] La navigation fonctionne entre toutes les pages
- [ ] On peut consulter tous les exercices
- [ ] On peut créer une séance personnalisée
- [ ] Le player fonctionne du début à la fin
- [ ] Les sons fonctionnent sur mobile (après premier tap)
- [ ] L'écran reste allumé pendant une séance
- [ ] L'app est installable en PWA sur mobile
- [ ] Les données persistent après refresh
- [ ] Le design est lisible et utilisable sur mobile (375px min)

---

## 🚫 Ce qu'il ne faut PAS faire

- Pas de base de données externe
- Pas de backend/API
- Pas de système d'authentification
- Pas de dépendances inutiles (garder le projet léger)
- Pas d'over-engineering : c'est un projet perso, pas une app commerciale
- Pas de tests automatisés pour la V1 (on valide manuellement)

---

## 📝 Notes pour Claude Code

1. **Lire PRD.md** avant de commencer pour voir les tâches détaillées
2. **Commencer par le setup** : Next.js, Tailwind, structure de fichiers
3. **Itérer feature par feature** en suivant l'ordre du PRD
4. **Tester sur mobile** (ou Chrome DevTools mobile view) régulièrement
5. **Commiter** après chaque feature fonctionnelle
6. Si bloqué sur un choix technique, prendre l'option **la plus simple**
