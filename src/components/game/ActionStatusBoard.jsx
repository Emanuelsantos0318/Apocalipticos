import React from "react";
import ChaosEventOverlay from "./chaos/ChaosEventOverlay";

export default function ActionStatusBoard({
  sala,
  jogadores,
  meuUid,
  gameActions,
  setCustomRole,
  setShowAbilityModal,
  isHost,
}) {
  return (
    <div className="mt-6 p-4 bg-yellow-900/40 border border-yellow-500/50 rounded-lg text-center backdrop-blur-sm">
      <p className="text-lg font-bold text-yellow-400 mb-2">
        {sala.statusAcao === "aguardando_penalidade"
          ? "Jogador aceitou a penalidade (bebida)."
          : "Aguardando confirmação..."}
      </p>

      {/* CHAOS EVENTS OVERLAY */}
      <ChaosEventOverlay
        sala={sala}
        jogadores={jogadores}
        meuUid={meuUid}
        gameActions={gameActions}
        setCustomRole={setCustomRole}
        setShowAbilityModal={setShowAbilityModal}
      />

      {/* STANDARD: Admin Confirmation */}
      {isHost && (
        <div className="flex justify-center gap-4 mt-4">
          {sala.statusAcao === "aguardando_penalidade" ? (
            <button
              onClick={gameActions.handleAdminConfirmPenalty}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
            >
              Confirmar (Bebeu)
            </button>
          ) : (
            <>
              <button
                onClick={gameActions.handleAdminConfirm}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
              >
                Confirmar{" "}
                {sala.cartaAtual?.tipo === "CAOS" ? "(Ativar)" : "(Cumpriu)"}
              </button>
              <button
                onClick={gameActions.handleAdminReject}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
              >
                {sala.cartaAtual?.tipo === "CAOS"
                  ? "Cancelar"
                  : "Rejeitar (Não Cumpriu)"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
