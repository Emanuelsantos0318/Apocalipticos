import React from "react";

export default function DictatorControls({
  activeEvents,
  meuUid,
  onOpenAbilityModal,
}) {
  const isDictator = activeEvents?.some(
    (e) => e.id === "ORGULHO" && e.owner === meuUid,
  );

  if (!isDictator) return null;

  return (
    <button
      onClick={() => {
        onOpenAbilityModal({
          id: "ditador",
          name: "Ditador Supremo",
          icon: "👑",
          image:
            "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&auto=format&fit=crop&q=60",
          ability: {
            name: "Aplicar Multa",
            effect: "Puna quem desobeder suas regras! (Tira 5 Pontos de Vida)",
            cost: "Gratuito",
          },
          needsTarget: true,
        });
      }}
      className="fixed bottom-24 left-4 z-40 bg-yellow-600 hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg border-2 border-yellow-300 animate-bounce flex items-center gap-2 font-bold uppercase tracking-wider"
      title="APLICAR MULTA DO DITADOR"
    >
      <span className="text-xl">👑</span>
      <span className="hidden md:inline">Multar</span>
    </button>
  );
}
