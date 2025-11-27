import { CARD_TYPES } from "../../constants/constants";

export default function PlayerActions({ onComplete, onPenalidade, cardType }) {
  const renderButtons = () => {
    switch (cardType) {
      case CARD_TYPES.TRUTH:
        return (
          <>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
            >
              Respondi
            </button>
            <button
              onClick={onPenalidade}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
            >
              Recusar (Beber)
            </button>
          </>
        );
      case CARD_TYPES.DARE:
        return (
          <>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold"
            >
              Desafio Aceito
            </button>
            <button
              onClick={onPenalidade}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold"
            >
              Recusar (Beber)
            </button>
          </>
        );
      case CARD_TYPES.NEVER:
        return (
          <>
            <button
              onClick={onComplete}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold"
            >
              Eu Já! (Beber)
            </button>
            <button
              onClick={onPenalidade}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-bold"
            >
              Eu Nunca
            </button>
          </>
        );
      case CARD_TYPES.FRIENDS:
      case CARD_TYPES.DECISIONS:
        return (
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
          >
            Próximo
          </button>
        );
      default:
        return (
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
          >
            Confirmar Ação
          </button>
        );
    }
  };

  return (
    <div className="flex justify-center gap-4 mb-6 flex-wrap">
      {renderButtons()}
    </div>
  );
}