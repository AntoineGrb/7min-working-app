export default function ExerciseDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold">Détail exercice</h1>
      <p className="text-gray-400">ID: {params.id} - À implémenter en Phase 3</p>
    </div>
  );
}
