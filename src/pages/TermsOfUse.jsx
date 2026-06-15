import React from "react";
import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";

export default function TermsOfUse() {
  return (
    <PageLayout>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat bg-fixed py-12 px-4 text-gray-200"
        style={{
          backgroundImage: "url('/bg-apocalipticos.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm -z-10" />

        <div className="max-w-4xl mx-auto bg-gray-900/80 border border-orange-500/30 rounded-2xl p-6 sm:p-10 shadow-2xl relative z-10">
          <Link
            to="/"
            className="inline-block mb-6 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
          >
            ← Voltar para o início
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2 font-rubik">
            Termos de Uso
          </h1>
          <p className="text-sm text-gray-400 mb-8">Última atualização: 14 de Junho de 2026</p>

          <div className="space-y-6 text-base leading-relaxed">
            <p>
              Bem-vindo(a) ao <strong>Apocalipticos</strong>! Estes Termos de Uso regulamentam o acesso e a utilização do nosso jogo e de todos os serviços relacionados. Ao criar uma conta, acessar ou jogar o Apocalipticos, você concorda expressamente em cumprir e estar vinculado a estes termos. Se você não concorda com qualquer parte destes termos, não deverá acessar ou jogar.
            </p>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">1. Aceitação dos Termos</h2>
              <p>Ao utilizar nosso jogo, você declara ter capacidade legal para aceitar estes termos. Caso seja menor de idade, declara ter obtido a permissão de seus pais ou responsáveis legais, que também deverão ler e concordar com este documento.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">2. Acesso ao Jogo e Conta de Usuário</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cadastro:</strong> Para acessar certas funcionalidades, pode ser necessário criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de acesso.</li>
                <li><strong>Responsabilidade:</strong> Todas as atividades realizadas através da sua conta são de sua inteira responsabilidade.</li>
                <li><strong>Encerramento:</strong> Reservamo-nos o direito de suspender, banir ou encerrar sua conta a qualquer momento, sem aviso prévio, caso seja detectada qualquer violação destes Termos de Uso.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">3. Regras de Conduta</h2>
              <p className="mb-2">O Apocalipticos é um ambiente focado na diversão e no respeito mútuo. Ao utilizar o jogo, você concorda em <strong>NÃO</strong>:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Utilizar <em>cheats</em>, <em>hacks</em>, <em>bots</em>, exploits, falhas do sistema ou qualquer software de terceiros não autorizado que modifique a experiência do jogo ou dê vantagens injustas.</li>
                <li>Assediar, ameaçar, ofender ou discriminar outros jogadores através de chat, nicks (nomes de usuário) ou qualquer outra forma de comunicação no jogo.</li>
                <li>Tentar invadir nossos servidores, realizar ataques de negação de serviço (DDoS) ou interferir no funcionamento adequado do jogo.</li>
                <li>Comercializar contas, itens do jogo ou qualquer recurso virtual por dinheiro real fora das plataformas oficiais permitidas.</li>
                <li>Fazer-se passar por desenvolvedores, moderadores ou administradores do jogo.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">4. Propriedade Intelectual</h2>
              <p>Todo o conteúdo presente no Apocalipticos, incluindo, mas não se limitando a: código-fonte, artes, gráficos, interfaces, músicas, sons, personagens, mecânicas e textos, são de propriedade exclusiva dos desenvolvedores do Apocalipticos e são protegidos por leis de direitos autorais e propriedade intelectual. Você não possui o direito de copiar, modificar, distribuir ou vender qualquer parte do jogo sem nossa autorização expressa.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">5. Disponibilidade do Serviço e Atualizações</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Fase de Desenvolvimento:</strong> O jogo pode estar sujeito a atualizações frequentes, testes e modificações de balanceamento. Contas e progressos podem ser resetados durante fases Beta ou de testes, se necessário.</li>
                <li><strong>Disponibilidade:</strong> Nos esforçamos para manter o jogo online, mas não garantimos que os servidores estarão disponíveis 100% do tempo. O jogo pode ficar offline para manutenções programadas ou problemas técnicos imprevistos.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">6. Limitação de Responsabilidade</h2>
              <p className="mb-2">Na extensão máxima permitida pela lei aplicável, os desenvolvedores do Apocalipticos não serão responsáveis por:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Perda de progresso, itens virtuais, dados da conta ou interrupções no serviço.</li>
                <li>Danos diretos, indiretos ou incidentais resultantes do uso ou da incapacidade de usar o jogo.</li>
                <li>Condutas ofensivas ou ilegais de terceiros dentro do ambiente do jogo.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">7. Modificações dos Termos</h2>
              <p>Podemos revisar e alterar estes Termos de Uso a qualquer momento. Quando isso ocorrer, atualizaremos a data de "Última atualização" no topo deste documento. O uso contínuo do jogo após as alterações indica sua concordância com os novos termos.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-orange-400 mb-2">8. Contato</h2>
              <p>Caso tenha dúvidas sobre estes Termos de Uso, encontre um bug, ou precise relatar o mau comportamento de um jogador, entre em contato com a equipe de desenvolvimento através dos canais oficiais do projeto.</p>
            </section>

            <hr className="border-gray-700 my-8" />
            <p className="italic text-gray-400 text-center">
              Ao jogar Apocalipticos, você reconhece que leu, compreendeu e concorda com todas as disposições estabelecidas nestes Termos de Uso.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
