export default function PlayPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold">Player</h1>
      <p className="text-gray-400">Séance ID: {params.id} - À implémenter en Phase 5</p>
    </div>
  );
}
