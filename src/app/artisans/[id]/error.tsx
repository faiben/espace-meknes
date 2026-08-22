"use client";

export default function ArtisanError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">⚠️</p>
      <p className="text-navy-500 text-lg mb-2">Erreur lors du chargement</p>
      <p className="text-sm text-navy-400 mb-4">{error.message}</p>
      <button onClick={reset} className="text-primary-600 hover:text-primary-700 font-medium">
        Réessayer
      </button>
    </div>
  );
}
