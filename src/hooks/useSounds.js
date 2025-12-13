import { useMemo, useState, useEffect } from "react";

export function useSounds() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
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

  // Controle da música de fundo
  const toggleHomeMusic = () => {
    const som = sons.musicaTema;
    if (isMusicPlaying) {
      som.pause();
      setIsMusicPlaying(false);
    } else {
      som.play().catch(() => {});
      setIsMusicPlaying(true);
    }
  };

  // Parar a música ao sair da Home
  useEffect(() => {
    return () => sons.musicaTema.pause();
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
    playHome: () => play("musicaTema"),
    stopHome: () => stop("musicaTema"),
    toggleHomeMusic,
    isMusicPlaying,
  };
}
