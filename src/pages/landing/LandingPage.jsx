import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";

const CHARACTERS = [
  {
    id: "seringa",
    name: "Seringa (A Médica)",
    role: "Curar (+1 PV)",
    realName: "Ítala Santos",
    fardo: "A Doutora do Happy Hour",
    color: "text-blue-400",
    bg: "bg-blue-900/20",
    border: "border-blue-500/30",
    icon: "🩺",
    image: "/assets/characters/medica_Itala.webp",
    ability: {
      name: "Triagem de Emergência",
      effect:
        "Recupera 1 PV de si mesmo ou de um aliado. Se usado em si mesmo, custa 2 goles.",
      cost: "2 Goles",
      cooldown: "2 Turnos",
    },
    lore: `Ítala era o prodígio da medicina na Capital. No dia do impacto, ela estava no comando do maior hospital do continente. Quando os recursos acabaram e a névoa invadiu os corredores, Ítala não buscou milagres; ela aplicou a 'Lógica de Ferro'. Ela trancou as alas C e D — onde estavam centenas de crianças e idosos — para economizar oxigênio para os cirurgiões e políticos na Ala A.

Ítala passou a quarentena inteira distribuindo álcool em gel e fazendo triagem de quem podia entrar nos bunkers.

Ela ainda ouve o som das mãos batendo nas portas de vidro temperado. Hoje, ela usa sua habilidade de cura não por compaixão, mas por uma dívida impagável. Ela cansou de ser séria. Agora, usa seus conhecimentos químicos para criar as misturas mais fortes do Bar. Ela ainda cura as pessoas, mas com aquele deboche de quem já viu gente reclamando de 'gripe de radiação'.`,
    quote:
      "Eu já escolhi quem vive uma vez. Não me faça ter que escolher de novo.",
  },
  {
    id: "sombra",
    name: "Sombra (A Assassina)",
    role: "Dano Fatal (2 PV)",
    realName: "Helena Brandão",
    fardo: "A Rainha dos Segredos",
    color: "text-purple-400",
    bg: "bg-purple-900/20",
    border: "border-purple-500/30",
    icon: "🔪",
    image: "/assets/characters/assassina.webp",
    ability: {
      name: "Golpe Silencioso",
      effect:
        "Causa 2 PV de dano a um alvo. Se o alvo beber, o dano aumenta para 3 PV.",
      cost: "3 Goles",
      cooldown: "3 Turnos",
    },
    lore: `Helena era a "síndica" do bunker mais populoso. Ela não era uma assassina; ela era uma mãe. No caos do Colapso, ela perdeu sua filha, Maya, entre os destroços de uma estação de trem. Ela passou anos caçando entre as sombras, não por dinheiro, mas por qualquer rastro dela. No caminho, ela se tornou uma lâmina perfeita.

Ela sabe quem furou a quarentena, quem roubou o estoque de suprimentos e quem traiu quem. Ela não mata mais por necessidade, ela "elimina" a concorrência social. Roubar PV para ela é como ganhar uma discussão no grupo do WhatsApp do apocalipse.`,
    quote: "Não é pessoal. É sobrevivência.",
  },
  {
    id: "mentor",
    name: "Mentor (O Estrategista)",
    role: "Alterar Ordem",
    realName: "Elias Thorne",
    fardo: "O Arquiteto do Rolê",
    color: "text-yellow-400",
    bg: "bg-yellow-900/20",
    border: "border-yellow-500/30",
    icon: "🧠",
    image: "/assets/characters/estrategista_Emanuel.webp",
    ability: {
      name: "Plano Mestre",
      effect:
        "Inverte a ordem dos turnos ou força um jogador específico a jogar agora.",
      cost: "2 Goles",
      cooldown: "4 Turnos",
    },
    lore: `Elias desenhou as cidades que hoje estão em ruínas. Ele era o arquiteto chefe do governo e avisou, com meses de antecedência, que os bunkers eram insuficientes e que o Projeto Aurora era instável. Chamaram-no de histérico. No dia do Colapso, ele assistiu de seu terraço blindado enquanto as pontes que ele projetou se tornavam armadilhas mortais.

Elias projetou os bunkers, mas agora ele projeta as melhores festas. Ele é obcecado por "Protocolos de Diversão". Para ele, o jogo é uma estrutura que precisa de ordem. Se você sair da vez dele, ele vai considerar isso uma infração gravíssima de segurança sanitária.`,
    quote: "O caos é apenas uma ordem que você ainda não compreendeu.",
  },
  {
    id: "faisca",
    name: "Faísca (A Incendiária)",
    role: "Caos Dobrado",
    realName: "Clara Solis",
    fardo: "A Diva da Pirotecnia",
    color: "text-orange-400",
    bg: "bg-orange-900/20",
    border: "border-orange-500/30",
    icon: "🔥",
    image: "/assets/characters/incendiaria.webp",
    ability: {
      name: "Caos Controlado",
      effect:
        "Dobra o efeito da próxima carta jogada na mesa. Se for vermelha, triplica.",
      cost: "3 Goles",
      cooldown: "3 Turnos",
    },
    lore: `Clara cresceu no escuro, em um abrigo subterrâneo que falhou pouco depois do Colapso. O frio das profundezas matou sua família, um por um. Quando ela finalmente emergiu, a luz do sol vermelho foi a coisa mais linda que já viu.

Para Clara, o fogo é vida. Ela queima tudo o que é velho porque acredita que as ruínas impedem o novo mundo de nascer. No Bar Apocalíptico, ela é quem traz o show: lança-chamas e desafios que fazem todo mundo "suar sangue". Se não tiver fogo, não é festa.`,
    quote:
      "Se não tiver fogo, não é festa. Amo ver o mundo queimar no copo de vodca.",
  },
  {
    id: "lazaro",
    name: "Lázaro (O Sobrevivente)",
    role: "Imortalidade",
    realName: "Jorge Silva",
    fardo: "O 'Tiozinho' da Mesa 7",
    color: "text-green-400",
    bg: "bg-green-900/20",
    border: "border-green-500/30",
    icon: "☠️",
    image: "/assets/characters/sobrevivente.webp",
    ability: {
      name: "Último Fôlego",
      effect:
        "Se o PV chegar a 0, jogue uma moeda. Cara: recupera 1 PV. Coroa: Game Over.",
      cost: "Passiva",
      cooldown: "1x por jogo",
    },
    lore: `Jorge é o personagem mais trágico porque ele é o mais comum. Ele estava com uma cerveja na mão quando a Nevoa Rubra surgiu. Ele sobreviveu ao Colapso por puro azar. Viu amigos morrerem, cidades caírem, e simplesmente... continuou acordando.

Ele carrega as memórias do "mundo de antes" — o gosto de um café real, o som de uma chuva que não queima. Ele joga porque é a única coisa que restou. Cada dose é um brinde aos que já se foram.`,
    quote: "Já morreu mil vezes. Só esqueceram de cavar a cova.",
  },
  {
    id: "sanfer",
    name: "Sanfer (O Barman)",
    role: "Forçar Dose",
    realName: "Sanfer",
    fardo: "O Encantador de Bêbados",
    color: "text-pink-400",
    bg: "bg-pink-900/20",
    border: "border-pink-500/30",
    icon: "🍸",
    image: "/assets/characters/barman_Mateus.webp",
    ability: {
      name: "Rodada da Casa",
      effect: "Obriga um jogador a beber 2 doses. Se recusar, perde 2 PV.",
      cost: "2 Goles",
      cooldown: "2 Turnos",
    },
    lore: `Sanfer era o dono do bar "O Ponto Final" antes do Colapso. Ele transformou o porão em um santuário de destilação clandestina. Ele sobreviveu porque todos precisavam de um copo para aguentar o isolamento.

Ele é o único que sabe as doses exatas para fazer alguém falar a verdade ou esquecer o próprio nome. "O mundo acabou, mas o atendimento continua padrão."`,
    quote: "O primeiro gole é por conta da casa. O segundo, do destino.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCharIndex, setActiveCharIndex] = React.useState(0);
  const activeChar = CHARACTERS[activeCharIndex];

  const handlePlayClick = () => {
    if (user) {
      navigate("/app");
    } else {
      navigate("/app"); // Mesmo se não logado, vai pra Home/Dashboard onde tem o Modal de Login
    }
  };

  const handleHowToPlayClick = () => {
    const element = document.getElementById("how-to-play");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
        <div className="h-10 md:h-16 flex items-center gap-2">
          <img
            src="/logo-apocalipticos.svg"
            width="64"
            height="64"
            alt="APOCALÍPTICOS"
            className="h-full w-auto object-contain drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] scale-110 md:scale-150 origin-left p-1 md:p-2"
          />
          <div className="ml-4 hidden md:block">
            <h1 className="text-2xl font-bold font-rubik text-orange-500 p-2 text-shadow-[0_0_15px_rgba(220,164,52,0.6)]">
              APOCALÍPTICOS
            </h1>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handlePlayClick}
            className="px-4 py-2 text-sm md:text-base md:px-6 md:py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)]"
          >
            JOGAR AGORA
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-25 pb-12">
        {/* Background Effect */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 mt-6 tracking-tighter drop-shadow-2xl leading-tight">
              <span className="block text-white mb-2">
                O mundo acabou… mas a sede não.
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 block">
                No bar dos Doidos a gente bebe e dá risada…
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            O Drinking Game definitivo para o apocalipse. Cartas insanas, RPG
            tático e caos social. Você tem estômago para sobreviver?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <button
              onClick={handlePlayClick}
              className="px-8 py-4 md:px-12 md:py-6 bg-red-600 hover:bg-red-700 text-white text-lg md:text-2xl font-black rounded-xl transition-transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.6)]"
            >
              COMEÇAR O CAOS
            </button>
            <button
              onClick={handleHowToPlayClick}
              className="px-8 py-4 md:px-12 md:py-6 bg-transparent border-2 border-white/20 hover:border-white text-white text-lg md:text-2xl font-bold rounded-xl transition-colors"
            >
              COMO JOGAR
            </button>
          </motion.div>
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 text-white uppercase tracking-tighter">
              O Colapso <span className="text-red-600">Rubro</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Como o mundo acabou e por que estamos bebendo sobre suas cinzas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: A Grande Traição (Project Aurora) */}
            <div className="bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-red-900/50 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🚀
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                A Grande Traição
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Não foi uma guerra de nações, foi de egos. O{" "}
                <strong>"Projeto Aurora"</strong> falhou na Groenlândia e ogivas
                químicas detonaram na atmosfera. A{" "}
                <span className="text-red-400 font-bold">Névoa Rubra</span>{" "}
                nasceu: um nevoeiro denso e semiconsciente que devora a
                respiração e a sanidade.
              </p>
            </div>

            {/* Card 2: Pós-Quarentena (Isolation) */}
            <div className="bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-yellow-900/50 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🏚️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Pós-Quarentena Rubra
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Décadas trancados em bunkers de <strong>4x4 metros</strong>.
                Expulsos pelo tédio e pela loucura, os sobreviventes saíram para
                as ruínas. Cidades dissolveram, governos caíram. O silêncio só é
                quebrado pelos gritos de quem respira a névoa sem proteção.
              </p>
            </div>

            {/* Card 3: O Bar Apocalíptico (Sanctuary) */}
            <div className="bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-green-900/50 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🍺
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                O Bar Apocalíptico
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Uma <strong>Zona Neutra</strong> onde generais e saqueadores
                compartilham o mesmo balcão. Aqui, a moeda não é dinheiro, mas
                histórias e sanidade. É o único lugar onde a música toca mais
                alto que as explosões nucleares distantes.
              </p>
            </div>

            {/* Card 4: Os Apocalípticos (Resistance) - NEW */}
            <div className="bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-purple-900/50 transition-colors group lg:col-span-2">
              <div className="text-4xl mb-4 group-hover:scale-105 transition-transform duration-300">
                ☢️
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Os Apocalípticos
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Somos aqueles que desenvolveram resistência à névoa, mas a um
                custo alto: dependência química constante. Precisamos de álcool
                e poções para impedir que a névoa invada nossas mentes. Cada
                rodada não é jogo, é um{" "}
                <strong>teste de sanidade, coragem e sobrevivência</strong>.
              </p>
            </div>

            {/* Card 5: O Protocolo (The Cure) */}
            <div className="bg-gray-900/50 p-6 md:p-8 rounded-2xl border border-gray-800 hover:border-blue-900/50 transition-colors group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                🥃
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Protocolo de Sanidade
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                O álcool é o único anestésico para almas quebradas.{" "}
                <span className="text-gray-200 italic">
                  "Beber não é festa, é o preço para continuar vivo. Se estamos
                  vivos, vamos em busca da felicidade, nem que seja no fundo de
                  uma garrafa."
                </span>{" "}
              </p>
            </div>
          </div>

          {/* Destaque / Quote */}
          <div className="mt-16 bg-gradient-to-r from-red-900/20 to-black p-8 rounded-3xl border border-red-900/30 text-center relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-xl md:text-2xl font-serif italic text-gray-300 mb-4">
                "Se a névoa não te matar, o fígado resolve. Então por que não
                curtir com os amigos?"
              </p>
              <p className="text-red-500 font-bold tracking-widest text-xs uppercase">
                — Lema dos Apocalípticos
              </p>
            </div>
            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-[80px]"></div>
          </div>
        </div>
      </section>

      {/* CHARACTERS SECTION */}
      <section className="py-24 bg-gray-900 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              AS LENDAS DO{" "}
              <span className="text-red-600">BAR APOCALÍPTICO</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Escolha seu papel no fim do mundo. Cada lenda carrega um fardo e
              uma maldição. Qual será a sua?
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* CHARACTER SELECTION LIST (Mobile: Horizontal Scroll, Desktop: Vertical List) */}
            <div className="w-full lg:w-1/3 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {CHARACTERS.map((char, index) => (
                <button
                  key={char.id}
                  onClick={() => setActiveCharIndex(index)}
                  className={`flex-shrink-0 lg:w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 text-left group ${
                    activeCharIndex === index
                      ? `bg-gray-800 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] scale-[1.02]`
                      : "bg-gray-900/50 border-gray-800 hover:bg-gray-800 hover:border-gray-700"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${char.bg} ${char.color}`}
                  >
                    {char.icon}
                  </div>
                  <div className="min-w-max">
                    <h3
                      className={`font-bold ${
                        activeCharIndex === index
                          ? "text-white"
                          : "text-gray-400 group-hover:text-gray-200"
                      }`}
                    >
                      {char.name}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                      {char.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* CHARACTER DETAIL VIEW */}
            <div className="w-full lg:w-2/3">
              <div className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
                {/* Background Texture */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2">
                  {/* LEFT: IMAGE */}
                  <div className="h-[400px] md:h-auto relative overflow-hidden group">
                    <div
                      className={`absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-transparent to-transparent z-10`}
                    ></div>
                    <img
                      src={activeChar.image}
                      alt={activeChar.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://api.dicebear.com/9.x/avataaars/svg?seed=${activeChar.id}`;
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute bottom-4 left-4 z-20 md:hidden">
                      <span
                        className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 ${activeChar.bg} ${activeChar.color} border ${activeChar.border}`}
                      >
                        {activeChar.role}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: DETAILS */}
                  <div className="p-6 md:p-8 flex flex-col h-full bg-gray-800/90 backdrop-blur-sm">
                    <div className="mb-6">
                      <div className="hidden md:flex items-center gap-3 mb-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider ${activeChar.bg} ${activeChar.color} border ${activeChar.border}`}
                        >
                          {activeChar.role}
                        </span>
                        <span className="text-gray-500 text-xs font-mono uppercase">
                          // {activeChar.realName}
                        </span>
                      </div>

                      <h3 className="text-3xl font-black text-white mb-2 leading-tight">
                        {activeChar.name.split(" ")[0]}{" "}
                        <span className="text-gray-500 font-medium text-lg block sm:inline">
                          {activeChar.name.substring(
                            activeChar.name.indexOf(" "),
                          )}
                        </span>
                      </h3>
                      <p className="text-red-400 font-medium italic text-sm mb-4">
                        "{activeChar.fardo}"
                      </p>

                      <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeChar.lore.split("\n\n").map((paragraph, idx) => (
                          <p key={idx} className="mb-3 last:mb-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-700">
                      <div className="mb-3">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          {activeChar.icon} Habilidade Especial
                        </h4>
                        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white text-sm">
                              {activeChar.ability.name}
                            </span>
                            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">
                              {activeChar.ability.cost}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 leading-snug">
                            {activeChar.ability.effect}
                          </p>
                        </div>
                      </div>

                      <p className="text-center text-sm italic text-gray-500 font-serif">
                        "{activeChar.quote}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW TO PLAY SECTION */}
      <section
        className="py-24 bg-black px-6 border-t border-gray-900"
        id="how-to-play"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-black mb-16">COMO SOBREVIVER?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-gray-800 to-red-900 -z-10"></div>

            <div className="relative">
              <div className="w-24 h-24 bg-gray-900 border-2 border-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_20px_rgba(220,38,38,0.3)] z-10">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Crie a Sala</h3>
              <p className="text-gray-500 text-sm">
                Monte o bunker. Defina o nível de toxicidade (Normal ou +18).
              </p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-gray-900 border-2 border-yellow-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_20px_rgba(202,138,4,0.3)] z-10">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Escolha sua Lenda</h3>
              <p className="text-gray-500 text-sm">
                Médico, Assassino ou Barman? Sua habilidade define sua
                estratégia.
              </p>
            </div>

            <div className="relative">
              <div className="w-24 h-24 bg-gray-900 border-2 border-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-[0_0_20px_rgba(22,163,74,0.3)] z-10">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Sobreviva</h3>
              <p className="text-gray-500 text-sm">
                Cumpra desafios, traia amigos e mantenha seu HP acima de zero.
              </p>
            </div>
          </div>

          <div className="mt-16">
            <button
              onClick={handlePlayClick}
              className="px-8 py-4 md:px-10 md:py-5 bg-white text-black hover:bg-gray-200 font-black text-lg md:text-xl rounded-full transition-transform hover:scale-105"
            >
              ENTRAR NO BUNKER
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 bg-black">
        <p>&copy; 2026 Apocalípticos. Beba com moderação (ou não).</p>
      </footer>
    </div>
  );
}
