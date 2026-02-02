'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSessions } from '@/lib/storage';
import { WorkoutSession } from '@/types';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  // Grouper les séances par date (jour uniquement)
  const getSessionsByDate = () => {
    const grouped = new Map<string, WorkoutSession[]>();

    sessions
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .forEach(session => {
        const date = new Date(session.completedAt);
        const dateKey = date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });

        if (!grouped.has(dateKey)) {
          grouped.set(dateKey, []);
        }
        grouped.get(dateKey)!.push(session);
      });

    return grouped;
  };

  const sessionsByDate = getSessionsByDate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 bg-gray-900 border-b border-gray-800 px-4 py-4 flex items-center gap-4">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold flex-1">Historique</h1>
      </header>

      {/* Content */}
      <main className="p-4 max-w-lg mx-auto">
        {sessionsByDate.size === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Aucune séance réalisée pour le moment</p>
            <Link
              href="/"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Commencer une séance
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from(sessionsByDate.entries()).map(([date, dateSessions]) => (
              <div
                key={date}
                className="bg-gray-800 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-medium">{date}</p>
                    <p className="text-sm text-gray-400">
                      {dateSessions.length === 1
                        ? 'Séance réalisée'
                        : `${dateSessions.length} séances réalisées`}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {dateSessions.map(s => s.workoutName).join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
