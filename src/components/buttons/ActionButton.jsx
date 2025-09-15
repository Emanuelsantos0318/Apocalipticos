// components/buttons/ActionButton.jsx
import React from "react"; // Adicione esta linha

/**
 * Um botão de ação reutilizável com diferentes temas visuais.
 * Ideal para ações primárias em formulários, modais e outras interações.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - O conteúdo do botão (texto, ícone, etc.).
 * @param {function} props.onClick - A função a ser chamada no clique do botão.
 * @param {boolean} [props.disabled=false] - Controla se o botão está desabilitado. É opcional.
 * @param {'primary' | 'ready' | 'not-ready' | 'danger'} props.theme - Define o estilo visual do botão.
 * @returns {JSX.Element} O componente do botão renderizado.
 */

export default function ActionButton({ children, onClick, disabled, theme }) {
  const baseClasses =
    "px-6 py-3 rounded-lg font-medium transition-colors w-full";

  const themeClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    disabled: "bg-gray-600 text-gray-400 cursor-not-allowed",
    ready: "bg-green-600 hover:bg-green-700 text-white",
    "not-ready": "bg-yellow-600 hover:bg-yellow-700 text-white",
    danger: "bg-red-500 hover:bg-red-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${themeClasses[theme]}`}
    >
      {children}
    </button>
  );
}
