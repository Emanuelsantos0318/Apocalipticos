import { useMemo, useState, useEffect } from "react";

export function useSounds() {
  // Estado para rastrear QUAL música de fundo está tocando (null se nenhuma)
  const [playingBgMusic, setPlayingBgMusic] = useState(null);

  // useMemo garante que os objetos Audio não sejam recriados a cada render
  const sons = useMemo(
    () => ({
      remover: new Audio("/sounds/vai-carnica.mp3"),
      marcarPronto: new Audio("/sounds/tem-certeza.mp3"),
      desmarcarPronto: new Audio("/sounds/vou-nada.mp3"),
      comecar: new Audio("/sounds/comecar.mp3"),
      erro: new Audio("/sounds/erro.mp3"),
      entrar: new Audio("/sounds/entrar.mp3"),
      sair: new Audio("/sounds/sair.mp3"),
      musicaTema: Object.assign(new Audio("/sounds/bar-dos-doidos-blues2.mp3"), {
        loop: true,
        volume: 0.5,
      }),
      musicaJogo: Object.assign(new Audio("/sounds/bar-dos-doidos.mp3"), {
        loop: true,
        volume: 0.5,
      }),
    }),
    []
  );

  const play = (tipo) => {
    const som = sons[tipo];
    if (som) {
      som.currentTime = 0; // reseta se estiver no meio
      som.play().catch((err) => {
        console.warn(`Erro ao reproduzir som '${tipo}':`, err);
      });
    }
  };

  const stop = (tipo) => {
    const som = sons[tipo];
    if (som) som.pause();
  };

  // Funções específicas para músicas de fundo para manter o estado sincronizado
  // Agora só define o estado se realmente conseguir tocar
  const playBg = (tipo) => {
    const som = sons[tipo];
    if (som) {
      som.play()
        .then(() => setPlayingBgMusic(tipo))
        .catch((err) => console.warn(`Erro ao tocar ${tipo}:`, err));
    }
  };

  const stopBg = (tipo) => {
    const som = sons[tipo];
    if (som) {
      som.pause();
      // Só limpa o estado se a música que parou era a que estava tocando
      setPlayingBgMusic((prev) => (prev === tipo ? null : prev));
    }
  };

  // Togle genérico para músicas de fundo
  const toggleMusic = (tipo) => {
    const som = sons[tipo];
    if (!som) return;

    if (playingBgMusic === tipo) {
      // Se já está tocando essa, para
      som.pause();
      setPlayingBgMusic(null);
    } else {
      // Se estava tocando OUTRA, para a outra antes?
      // Por comportamento padrão, vamos parar qualquer outra música de fundo ativa
      if (playingBgMusic && sons[playingBgMusic]) {
        sons[playingBgMusic].pause();
      }
      
      som.play()
        .then(() => setPlayingBgMusic(tipo))
        .catch(() => {});
    }
  };

  // Parar qualquer música ao desmontar (opcional, ou manter cleanup do useEffect em pages)
  useEffect(() => {
    return () => {
      // sons.musicaTema.pause(); 
    };
  }, [sons]);

  return {
    playMarcarPronto: () => play("marcarPronto"),
    stopMarcarPronto: () => stop("marcarPronto"),
    playDesmarcarPronto: () => play("desmarcarPronto"),
    stopDesmarcarPronto: () => stop("desmarcarPronto"),
    playRemover: () => play("remover"),
    playComecar: () => play("comecar"),
    playErro: () => play("erro"),
    playEntrar: () => play("entrar"),
    playSair: () => play("sair"),
    
    // Controles de Música de Fundo
    playHome: () => playBg("musicaTema"),
    stopHome: () => stopBg("musicaTema"),
    playJogo: () => playBg("musicaJogo"),
    stopJogo: () => stopBg("musicaJogo"),
    
    toggleMusic,
    playingBgMusic, // Exporta quem está tocando
  };
}
