import { Exercise, WorkoutType } from '@/types';

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

export function getExerciseById(id: string): Exercise | undefined {
  return DEFAULT_EXERCISES.find(e => e.id === id);
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return ids.map(id => getExerciseById(id)).filter((e): e is Exercise => e !== undefined);
}
