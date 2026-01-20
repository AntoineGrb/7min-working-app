import { Exercise, WorkoutType } from '@/types';

export const DEFAULT_EXERCISES: Exercise[] = [
  // Exercices existants (niveau facile/moyen)
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    description: "1. Debout, pieds joints, bras le long du corps\n2. Sauter en écartant les jambes et lever les bras au-dessus de la tête\n3. Revenir en position initiale en sautant\n4. Répéter de façon continue et rythmée\n\n⚠️ Point clé : Reste léger sur la pointe des pieds (amorti), ne frappe pas le sol avec les talons (tes voisins te remercieront)",
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
    description: "1. Position planche, mains écartées largeur d'épaules\n2. Corps aligné de la tête aux pieds, abdos gainés\n3. Descendre en pliant les coudes jusqu'à frôler le sol\n4. Pousser pour remonter bras tendus\n5. Garder le dos droit tout au long du mouvement\n\n⚠️ Point clé : Coudes à 45° par rapport au corps (flèche), pas à 90° (forme de T) pour protéger les épaules. Si tu bloques à 5-6 reps propres, finis la série sur les genoux.",
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
    description: "1. Debout, pieds écartés largeur d'épaules\n2. Descendre en poussant les fesses vers l'arrière\n3. Cuisses parallèles au sol, genoux au-dessus des orteils\n4. Remonter en poussant sur les talons\n5. Garder le dos droit\n\n⚠️ Point clé : Les talons ne décollent jamais du sol. Les genoux suivent la direction des orteils.",
    icon: "🦵",
    difficulty: "easy",
    muscleGroups: ["jambes", "fessiers"]
  },
  {
    id: "triceps-dips",
    name: "Triceps Dips",
    description: "1. Mains sur le bord d'une chaise, doigts vers l'avant\n2. Fesses devant la chaise, jambes tendues ou pliées\n3. Descendre en pliant les coudes vers l'arrière\n4. Remonter en poussant sur les bras\n5. Coudes restent proches du corps\n\n⚠️ Point clé : Ne descends pas trop bas (pas de douleur à l'avant de l'épaule)",
    icon: "🪑",
    difficulty: "medium",
    muscleGroups: ["bras", "triceps"]
  },
  {
    id: "plank",
    name: "Planche (Plank)",
    description: "1. Position de pompe mais sur les avant-bras\n2. Corps parfaitement aligné de la tête aux talons\n3. Abdos et fessiers contractés\n4. Ne pas lever ni baisser les hanches\n5. Respirer normalement et maintenir\n\n⚠️ Point clé : 45 secondes propre valent mieux que 2 minutes le dos creusé",
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
  },

  // 📂 SLOT 1 : Bas du corps (Cuisses & Fessiers)
  // Le moteur. On cherche la stabilité et l'endurance musculaire.

  {
    id: "squat-air",
    name: "Squat Air (Le Classique)",
    description: "1. Pieds largeur d'épaules, orteils légèrement ouverts\n2. Descends les fesses vers l'arrière et le bas, comme pour t'asseoir\n3. Garde le dos droit\n4. Descends jusqu'à ce que les cuisses soient parallèles au sol\n5. Remonte en poussant sur les talons\n\n⚠️ Points clés :\n• Les talons ne décollent jamais du sol\n• Les genoux suivent la direction des orteils",
    icon: "🦵",
    difficulty: "medium",
    muscleGroups: ["jambes", "fessiers", "quadriceps"]
  },
  {
    id: "fentes-arriere-alternees",
    name: "Fentes Arrière Alternées",
    description: "1. Debout, fais un grand pas en arrière\n2. Pose le genou arrière vers le sol (sans le cogner)\n3. Remonte en poussant sur le talon de la jambe avant\n4. Alterne gauche/droite\n\n💡 Pourquoi intermédiaire : Plus facile à contrôler pour le genou que la fente avant, mais demande un bon équilibre.",
    icon: "🦿",
    difficulty: "medium",
    muscleGroups: ["jambes", "fessiers", "quadriceps"]
  },
  {
    id: "fentes-laterales",
    name: "Fentes Latérales",
    description: "1. Départ pieds joints\n2. Grand pas sur le côté\n3. Fléchis une jambe en gardant l'autre tendue\n4. Le dos reste plat\n5. Reviens au centre et change de côté\n\n🎾 Intérêt Padel : Renforce les adducteurs et prépare aux déplacements latéraux typiques du padel.",
    icon: "↔️",
    difficulty: "medium",
    muscleGroups: ["jambes", "adducteurs", "fessiers"]
  },

  // 📂 SLOT 2 : Poussée (Pecs, Épaules, Triceps)
  // Développement du haut du corps.

  {
    id: "pompes-classiques",
    name: "Pompes Classiques",
    description: "1. Mains au sol un peu plus larges que les épaules\n2. Corps gainé en planche (une ligne droite tête-talons)\n3. Descends la poitrine à 5cm du sol\n4. Remonte bras tendus\n\n⚠️ Points clés :\n• Coudes à 45° par rapport au corps (flèche), pas à 90° (forme de T) pour protéger les épaules\n• Si tu bloques à 5-6 reps propres, finis la série sur les genoux",
    icon: "💪",
    difficulty: "medium",
    muscleGroups: ["poitrine", "épaules", "triceps"]
  },
  {
    id: "dips-chaise",
    name: "Dips sur Chaise (Jambes fléchies)",
    description: "1. Mains sur le bord d'une chaise/canapé stable, dos proche de la chaise\n2. Jambes fléchies à 90° devant toi, pieds à plat\n3. Descends les fesses vers le sol en pliant les bras\n4. Remonte en poussant sur les mains\n\n⚠️ Point clé : Ne descends pas trop bas (pas de douleur à l'avant de l'épaule)",
    icon: "🪑",
    difficulty: "medium",
    muscleGroups: ["triceps", "poitrine", "épaules"]
  },
  {
    id: "shoulder-taps",
    name: "Shoulder Taps (Gainage bras tendus)",
    description: "1. Position de pompes haute (bras tendus)\n2. Sans bouger le bassin, viens toucher ton épaule gauche avec ta main droite\n3. Repose la main, puis touche l'épaule droite avec la main gauche\n4. Alterne de façon continue\n\n💡 Pourquoi intermédiaire : Ça brûle les épaules et oblige à un gainage anti-rotation intense.",
    icon: "👋",
    difficulty: "medium",
    muscleGroups: ["épaules", "core", "abdos"]
  },

  // 📂 SLOT 3 : Tirage & Posture (Dos)
  // Indispensable pour compenser la position assise de développeur.

  {
    id: "superman-dynamique",
    name: "Superman Dynamique",
    description: "1. Allongé sur le ventre, bras tendus devant\n2. Décolle simultanément le buste (bras) et les jambes\n3. Contracte fessiers et lombaires\n4. Tiens 1 seconde en haut\n5. Redescends sans tout relâcher\n\n⚠️ Point clé : Regarde le sol pour ne pas casser la nuque\n💼 Indispensable pour compenser la position assise de développeur",
    icon: "🦸",
    difficulty: "medium",
    muscleGroups: ["dos", "lombaires", "fessiers"]
  },
  {
    id: "oiseau-sol",
    name: "L'Oiseau au sol (T-Raises)",
    description: "1. Allongé sur le ventre, bras en croix sur les côtés (pouces vers le ciel)\n2. Décolle les bras le plus haut possible\n3. Resserre les omoplates l'une contre l'autre\n4. Maintiens 1-2 secondes en haut\n5. Redescends contrôlé\n\n💡 Option Matériel : Prends tes haltères de 1kg ici, c'est suffisant pour sentir le haut du dos brûler.",
    icon: "🦅",
    difficulty: "medium",
    muscleGroups: ["dos", "épaules", "trapèzes"]
  },
  {
    id: "tirage-porte",
    name: "Tirage Porte (Door Frame Rows)",
    description: "1. Debout face à l'encadrement d'une porte ouverte\n2. Attrape le cadre de chaque côté\n3. Place tes pieds proches du cadre et penche-toi en arrière (bras tendus)\n4. Tire pour ramener ta poitrine entre tes mains\n5. Contrôle la descente\n\n⚠️ Point clé : Plus tes pieds sont avancés, plus c'est dur. C'est le seul \"vrai\" tirage sans barre de traction.",
    icon: "🚪",
    difficulty: "medium",
    muscleGroups: ["dos", "biceps", "avant-bras"]
  },

  // 📂 SLOT 4 : Cardio & Agilité
  // Faire monter le cœur pour la dépense calorique.

  {
    id: "mountain-climbers",
    name: "Mountain Climbers (Rythme moyen)",
    description: "1. Position de pompes (bras tendus)\n2. Ramène un genou vers la poitrine\n3. Change rapidement de jambe\n4. Maintiens un rythme régulier\n\n⚠️ Niveau intermédiaire : Garde un rythme régulier \"1-2, 1-2\" sans faire rebondir les fesses vers le ciel.",
    icon: "⛰️",
    difficulty: "medium",
    muscleGroups: ["cardio", "abdos", "épaules"]
  },
  {
    id: "skater-jumps",
    name: "Skater Jumps (Sauts de patineur)",
    description: "1. Petit saut latéral d'un pied sur l'autre\n2. Croise la jambe libre derrière\n3. Balance les bras pour l'équilibre\n4. Maintiens un rythme fluide\n\n🎾 Intérêt Padel : Excellent pour la coordination et les appuis latéraux.",
    icon: "⛸️",
    difficulty: "medium",
    muscleGroups: ["cardio", "jambes", "équilibre"]
  },

  // 📂 SLOT 5 : Sangle Abdominale (Core)
  // Pas que les abdos "tablette", mais la ceinture complète.

  {
    id: "planche-classique",
    name: "Planche Classique (Sur avant-bras)",
    description: "1. Coudes sous les épaules\n2. Corps aligné en ligne droite\n3. Serre fort les fessiers\n4. Rentre le ventre (aspire le nombril)\n5. Respire normalement\n\n⏱️ Durée cible : 45 secondes propre valent mieux que 2 minutes le dos creusé.",
    icon: "📏",
    difficulty: "medium",
    muscleGroups: ["core", "abdos", "épaules"]
  },
  {
    id: "russian-twist",
    name: "Russian Twist (Avec haltères 1kg)",
    description: "1. Assis, jambes fléchies décollées du sol (équilibre sur les fesses)\n2. Tiens ton haltère à deux mains\n3. Touche le sol à droite puis à gauche en tournant les épaules\n4. Le mouvement vient des épaules, pas juste des bras\n\n⚠️ Point clé : Ce sont les épaules qui tournent, pas juste les bras.",
    icon: "🔄",
    difficulty: "medium",
    muscleGroups: ["obliques", "abdos", "core"]
  },
  {
    id: "dead-bug",
    name: "Dead Bug",
    description: "1. Allongé sur le dos, bras tendus vers le plafond\n2. Jambes en chaise renversée (90°)\n3. Tends la jambe droite et le bras gauche vers le sol (sans toucher)\n4. Reviens au centre, puis inverse\n5. Alterne de façon contrôlée\n\n⚠️ Point clé : Le bas du dos doit rester \"collé/vissé\" au sol. S'il décolle, descends la jambe moins bas.",
    icon: "🐛",
    difficulty: "medium",
    muscleGroups: ["abdos", "core", "stabilisateurs"]
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