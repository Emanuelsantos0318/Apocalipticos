import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";

export function useRPG(codigo, sala = null) {
  /**
   * Aplica Dano a um alvo.
   * @param {string} targetUid - UID do jogador alvo
   * @param {number} amount - Quantidade de Dano
   * @param {boolean} isCriticalMultiplier - Se deve aplicar multiplicador de critico (padrão true)
   * @param {boolean} propagate - Se deve propagar o dano para parceiros (Luxúria)
   */
  const takeDamage = async (
    targetUid,
    amount,
    isCriticalMultiplier = true,
    propagate = true,
  ) => {
    if (!codigo || !targetUid) return;

    try {
      const playerRef = doc(db, "salas", codigo, "jogadores", targetUid);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) return;

      const data = playerSnap.data();
      const isCritical = data.isCritical || false;

      // Se estiver em modo crítico, dano é dobrado (se flag permitir)
      const finalDamage =
        isCritical && isCriticalMultiplier ? amount * 2 : amount;

      // Novo HP (Mínimo 0)
      let newHp = Math.max(0, (data.hp ?? 30) - finalDamage);
      let newIsCritical = newHp === 0;
      const updates = {};

      // Lógica SOBREVIVENTE: Último Fôlego
      if (newHp <= 0 && data.role === "sobrevivente" && !data.roleUsed) {
        newHp = 1;
        newIsCritical = false; // 1 HP ainda é vivo
        updates.roleUsed = true;
        toast.success("💀 Sobrevivente ativou ÚLTIMO FÔLEGO!", {
          duration: 4000,
        });
      }

      updates.hp = newHp;
      updates.isCritical = newIsCritical;

      await updateDoc(playerRef, updates);

      if (finalDamage > 0) {
        toast.error(`-${finalDamage} HP! ${isCritical ? "(CRÍTICO!)" : ""}`);
      }

      // --- PROPAGAÇÃO DE DANO (LUXÚRIA) ---
      if (propagate && sala?.activeEvents) {
        const lustEvent = sala.activeEvents.find((e) => e.id === "LUXURIA");
        if (lustEvent && lustEvent.linkedTo) {
          const { owner, linkedTo } = lustEvent;
          let partnerUid = null;

          if (targetUid === owner) partnerUid = linkedTo;
          if (targetUid === linkedTo) partnerUid = owner;

          if (partnerUid) {
            // Delay pequeno para efeito dramático
            setTimeout(() => {
              toast("💔 O Pacto da Luxúria exige sacrifício compartilhado...", {
                icon: "💋",
              });
              takeDamage(partnerUid, amount, isCriticalMultiplier, false); // False para evitar loop
            }, 1500);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao aplicar dano:", error);
    }
  };

  /**
   * Cura um alvo.
   * @param {string} targetUid - UID do alvo
   * @param {number} amount - Quantidade de Cura
   */
  const heal = async (targetUid, amount) => {
    if (!codigo || !targetUid) return;

    try {
      const playerRef = doc(db, "salas", codigo, "jogadores", targetUid);
      const playerSnap = await getDoc(playerRef);

      if (!playerSnap.exists()) return;
      const data = playerSnap.data();

      const maxHp = data.maxHp || 30;
      const currentHp = data.hp || 0;

      // Cura não ultrapassa MaxHP
      let newHp = currentHp + amount;
      if (newHp > maxHp) newHp = maxHp;

      // Se HP ficar positivo, sai do crítico
      const newIsCritical = newHp <= 0;

      await updateDoc(playerRef, {
        hp: newHp,
        isCritical: newIsCritical,
      });

      toast.success(`+${amount} HP!`);
    } catch (error) {
      console.error("Erro ao curar:", error);
    }
  };

  /**
   * Reseta stats de RPG para novo jogo
   */
  const resetRPG = async (jogadoresUids) => {
    // Implementado dentro do resetGameData no useGameActions geralmente,
    // mas pode ser útil ter aqui.
  };

  /**
   * Usa a habilidade especial da classe.
   * @param {string} casterUid - UID de quem usa
   * @param {string} roleId - ID da classe (medico, assassino, etc)
   * @param {string} targetUid - UID do alvo (opcional)
   */
  const useAbility = async (casterUid, roleId, targetUid = null) => {
    if (!codigo || !casterUid) return;

    try {
      const casterRef = doc(db, "salas", codigo, "jogadores", casterUid);

      // --- CHECK FOR BETRAYAL (TRAIÇÃO - LUXÚRIA) ---
      if (sala?.activeEvents && targetUid && targetUid !== casterUid) {
        const lustEvent = sala.activeEvents.find((e) => e.id === "LUXURIA");
        if (
          lustEvent &&
          lustEvent.linkedTo &&
          ((lustEvent.owner === casterUid &&
            lustEvent.linkedTo === targetUid) ||
            (lustEvent.owner === targetUid && lustEvent.linkedTo === casterUid))
        ) {
          // Hostile roles that trigger betrayal
          if (
            ["assassino", "incendiaria", "barman", "carrasco"].includes(roleId)
          ) {
            toast("💔 TRAIÇÃO DETECTADA! O Pacto foi quebrado!", {
              icon: "🔪",
              duration: 5000,
            });

            // 1. Apply Penalty (2 Doses = 10 HP) to BOTH
            await takeDamage(casterUid, 10, false, false);
            await takeDamage(targetUid, 10, false, false);

            // 2. Break the Bond (Update activeEvents remove linkedTo)
            // We need gameActions context or update activeEvents directly here?
            // useRPG is inside useGameActions usually, but updateDoc on room works.
            // We need to find the event index.
            const newEvents = sala.activeEvents.map((e) => {
              if (e.id === "LUXURIA") {
                const { linkedTo, ...rest } = e; // Remove linkedTo
                return rest;
              }
              return e;
            });
            await updateDoc(doc(db, "salas", codigo), {
              activeEvents: newEvents,
            });

            return; // Stop standard ability execution
          }
        }
      }

      switch (roleId) {
        case "medico":
          // Cura 1 PV, Custo: Médico bebe 1, Paciente bebe 1
          if (!targetUid) return toast.error("Selecione um alvo para curar!");
          await heal(targetUid, 1);
          await updateDoc(casterRef, { "stats.bebidas": increment(1) }); // Médico bebe

          if (targetUid !== casterUid) {
            const targetRef = doc(db, "salas", codigo, "jogadores", targetUid);
            await updateDoc(targetRef, { "stats.bebidas": increment(1) }); // Paciente bebe
          }
          toast.success("Habilidade usada: Tratamento de Risco!");
          break;

        case "assassino":
          // Rouba 2 PV, Custo: Assassino bebe 2
          if (!targetUid) return toast.error("Selecione um alvo para atacar!");
          await takeDamage(targetUid, 2);
          await updateDoc(casterRef, {
            "stats.bebidas": increment(2),
            roleUsed: true, // Marca uso único
          });
          toast.success("Habilidade usada: Roubo de Sangue!");
          break;

        case "estrategista":
          // Escolhe o próximo jogador! (Override)
          if (!targetUid) return toast.error("Selecione quem será o próximo!");

          await updateDoc(doc(db, "salas", codigo), {
            nextPlayerOverride: targetUid,
          });
          await updateDoc(casterRef, { "stats.bebidas": increment(1) });
          toast.success("Estrategista definiu o próximo turno! 🧠");
          break;

        case "incendiaria":
          // Força jogador a jogar AGORA e com punição dobrada
          if (!targetUid) return toast.error("Selecione quem vai queimar!");

          await updateDoc(doc(db, "salas", codigo), {
            jogadorAtual: targetUid, // Troca IMEDIATA de turno
            "config.punicaoDobrada": true,
          });
          await updateDoc(casterRef, { "stats.bebidas": increment(2) });
          toast.success("Incendiária botou fogo no jogo! 🔥");
          break;

        case "barman":
          // Força um jogador a repetir o último desafio ou beber o dobro da punição atual.
          // Tem que mostrar o ultimo desafio que o jogador fez.
          if (!targetUid)
            return toast.error("Selecione quem vai repetir o último desafio!");
          await updateDoc(doc(db, "salas", codigo), {
            jogadorAtual: targetUid,
            "config.punicaoDobrada": true,
          });
          await updateDoc(casterRef, { "stats.bebidas": increment(2) });
          toast.success("Barman botou fogo no jogo! 🔥");
          break;

        default:
          toast.error("Habilidade desconhecida.");
      }
    } catch (error) {
      console.error("Erro ao usar habilidade:", error);
      toast.error("Erro ao ativar habilidade.");
    }
  };

  return {
    takeDamage,
    heal,
    useAbility,
  };
}
