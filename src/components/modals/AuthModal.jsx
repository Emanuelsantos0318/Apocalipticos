import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import MainButton from "../buttons/MainButton";
import { Mail, Lock, User, Calendar, LogIn, PlusCircle } from "lucide-react";
import { validateMinimumAge } from "../../utils/ageUtils";
import toast from "react-hot-toast";

export default function AuthModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup'
  const { login, signup, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    dataNascimento: "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "signup") {
        if (!validateMinimumAge(formData.dataNascimento, 18)) {
          // Nota: Permitindo cadastro para menores, mas o jogo bloqueia depois as salas +18.
          // Para cadastro geral, talvez seja bom confirmar 16+ ou 18+?
          // Vamos deixar livre por enquanto, mas avisar.
        }

        await signup(formData.email, formData.password, {
          nome: formData.nome,
          dataNascimento: formData.dataNascimento,
        });
        toast.success("Conta criada com sucesso!");
      } else {
        await login(formData.email, formData.password);
        toast.success("Login realizado!");
      }
      onClose();
    } catch (error) {
      console.error(error);
      let msg = "Erro ao processar solicitação.";
      if (error.code === "auth/email-already-in-use")
        msg = "Email já cadastrado.";
      if (error.code === "auth/wrong-password") msg = "Senha incorreta.";
      if (error.code === "auth/user-not-found") msg = "Usuário não encontrado.";
      if (error.code === "auth/weak-password") msg = "Senha muito fraca.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Conectado com Google!");
      onClose();
    } catch (error) {
      // Erro já tratado/logado no context
      toast.error("Erro no login com Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose} // Fecha ao clicar fora
    >
      <div
        className="relative bg-gray-900 border border-orange-500/30 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Impede fechar ao clicar dentro
      >
        {/* Header Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-4 text-center font-bold tracking-wide transition-colors ${
              activeTab === "login"
                ? "bg-orange-600/10 text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            ENTRAR
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-4 text-center font-bold tracking-wide transition-colors ${
              activeTab === "signup"
                ? "bg-orange-600/10 text-orange-500 border-b-2 border-orange-500"
                : "text-gray-400 hover:text-white"
            }`}
          >
            CADASTRAR
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-gray-900 font-bold py-3 rounded-xl mb-6 flex items-center justify-center gap-3 hover:bg-gray-100 transition-transform active:scale-95 disabled:opacity-50"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5 h-5"
              alt="Google"
            />
            {activeTab === "login"
              ? "Entrar com Google"
              : "Cadastrar com Google"}
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute w-full border-t border-gray-700"></div>
            <span className="relative bg-gray-900 px-3 text-sm text-gray-500 uppercase">
              Ou continue com email
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "signup" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold ml-1">
                    Nome de Jogador
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-orange-500 w-5 h-5" />
                    <input
                      type="text"
                      required
                      placeholder="Como quer ser chamado?"
                      className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                      value={formData.nome}
                      onChange={(e) =>
                        setFormData({ ...formData, nome: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold ml-1">
                    Data de Nascimento
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3.5 text-orange-500 w-5 h-5" />
                    <input
                      type="date"
                      required
                      className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition-all [color-scheme:dark]"
                      value={formData.dataNascimento}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataNascimento: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase font-bold ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-orange-500 w-5 h-5" />
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-gray-400 uppercase font-bold ml-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-orange-500 w-5 h-5" />
                <input
                  type="password"
                  required
                  placeholder="********"
                  minLength={6}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {activeTab === "login" ? (
                    <LogIn className="w-5 h-5" />
                  ) : (
                    <PlusCircle className="w-5 h-5" />
                  )}
                  {activeTab === "login" ? "ENTRAR" : "CRIAR CONTA"}
                </>
              )}
            </button>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors z-10"
        >
          <span className="sr-only">Fechar</span>✕
        </button>
      </div>
    </div>
  );
}
