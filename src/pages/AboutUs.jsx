import React from "react";
import { useNavigate } from "react-router-dom";
import { Github, MessageSquare, Flame, ShieldAlert } from "lucide-react";
import PageLayout from "../components/PageLayout";

export default function AboutUs() {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const authors = [
    {
      name: "Mateus Sanfer",
      github: "https://github.com/MateusSanfer",
      avatar: "https://avatars.githubusercontent.com/u/126841158?v=4",
      role: "Desenvolvedor Fullstack & Game Designer",
      bio: "Focado em criar interfaces fluidas, mecânicas envolventes e garantir que o caos do apocalipse seja visualmente impressionante e divertido.",
      character: {
        name: "Sanfer (O Barman)",
        ability: "Rodada da Casa (Força doses de punição aos oponentes)",
        quote: "O primeiro gole é por conta da casa. O segundo, do destino.",
        color: "from-pink-500/20 to-purple-500/10 border-pink-500/30",
        badge: "text-pink-400 bg-pink-950/40",
      },
    },
    {
      name: "Emanuel Santos",
      github: "https://github.com/Emanuelsantos0318",
      avatar: "https://avatars.githubusercontent.com/u/128701097?v=4",
      role: "Analista de TI & Mente Criativa",
      bio: "Responsável por criar a historia louca do mundo, as cartas e desenvolver a arquitetura em tempo real, sincronizar as salas do Firebase e garantir que as conexões não colapsem no meio da rodada.",
      character: {
        name: "Mentor (O Estrategista)",
        ability: "Plano Mestre (Altera a ordem dos turnos dos jogadores)",
        quote: "O caos é apenas uma ordem que você ainda não compreendeu.",
        color: "from-yellow-500/20 to-orange-500/10 border-yellow-500/30",
        badge: "text-yellow-400 bg-yellow-950/40",
      },
    },
  ];

  return (
    <PageLayout>
      <div className="min-h-screen w-full py-16 px-4 md:px-8 text-gray-200">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md -z-10" />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-12">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-semibold transition-colors mb-6 group cursor-pointer"
            >
              <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Voltar
            </button>

            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-4 font-rubik uppercase tracking-tight">
              Os Criadores do Caos
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Conheça os sobreviventes responsáveis por codificar, desenhar e dar vida ao universo de <strong>Apocalípticos</strong>.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {authors.map((author) => (
              <div
                key={author.name}
                className="bg-gray-950/80 border border-gray-800 hover:border-orange-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Perfil Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={author.avatar}
                      alt={author.name}
                      className="w-20 h-20 rounded-full border-2 border-orange-500/30 object-cover shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white font-rubik">{author.name}</h2>
                      <p className="text-sm text-orange-400 font-semibold">{author.role}</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                    {author.bio}
                  </p>

                  {/* Contraparte do Jogo */}
                  <div className={`bg-gradient-to-br ${author.character.color} border p-4 rounded-xl mb-6`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Alter ego no jogo
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">{author.character.name}</h3>
                    <p className="text-xs text-gray-300 mb-2">
                      <strong>Habilidade:</strong> {author.character.ability}
                    </p>
                    <p className="text-xs italic text-gray-400 border-l-2 border-white/20 pl-2 mt-2">
                      "{author.character.quote}"
                    </p>
                  </div>
                </div>

                {/* Ações */}
                <div className="pt-4 border-t border-gray-900 flex justify-between items-center">
                  <a
                    href={author.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-200"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Section */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
              Ajude a Melhorar o Jogo!
            </h3>
            <p className="text-sm sm:text-base text-gray-400 mb-6">
              Este jogo é um projeto independente em constante evolução. Se você encontrar problemas durante seus testes ou tiver ideias absurdas para novas cartas e mecânicas, entre no nosso servidor do Discord!
            </p>
            <a
              href="https://discord.gg/rQDJht6Hg4"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageSquare className="w-5 h-5" />
              Entrar no Discord Oficial
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
