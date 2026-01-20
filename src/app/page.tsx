import Link from "next/link";
import SettingsPanel from "@/components/SettingsPanel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col">
      {/* Header */}
      <header className="text-center py-8 relative">
        <div className="absolute right-0 top-8">
          <SettingsPanel />
        </div>
        <h1 className="text-3xl font-bold">7min Workout</h1>
        <p className="text-gray-400 mt-2">Votre séance rapide quotidienne</p>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-6 max-w-md mx-auto w-full">
        {/* Bouton principal */}
        <Link
          href="/play/default-7min"
          className="bg-green-600 hover:bg-green-700 text-white text-xl font-semibold py-6 px-8 rounded-xl text-center transition-colors"
        >
          Lancer séance classique
        </Link>

        {/* Cartes de navigation */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Link
            href="/workouts"
            className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-colors"
          >
            <span className="text-3xl block mb-2">📋</span>
            <span className="font-medium">Mes séances</span>
          </Link>

          <Link
            href="/exercises"
            className="bg-gray-800 hover:bg-gray-700 rounded-xl p-6 text-center transition-colors"
          >
            <span className="text-3xl block mb-2">💪</span>
            <span className="font-medium">Exercices</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 text-sm">
        7min Workout v1.0
      </footer>
    </div>
  );
}
