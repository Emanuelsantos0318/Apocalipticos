import React from 'react'; // Adicione esta linha

/**
 * Botão principal da aplicação, usado para navegação e ações de destaque.
 *
 * @param {object} props - As propriedades do componente.
 * @param {React.ReactNode} props.children - Conteúdo exibido dentro do botão (texto, ícones ou outros elementos React).
 * @param {function} props.onClick - Função chamada quando o botão é clicado.
 * @param {'primary'|'secondary'} props.theme - Define o tema visual do botão (ex: 'primary' para azul, 'secondary' para cinza).
 * @param {string} [props.className] - Classes CSS adicionais para customizar o estilo do botão (opcional).
 * @returns {JSX.Element} O componente do botão renderizado.
 */

export default function MainButton({ children, onClick, theme, className }) {
  return (
    <button 
      onClick={onClick}
      className={`${className} px-4 py-2 rounded transition-colors ${
        theme === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : 
        theme === 'secondary' ? 'bg-gray-600 hover:bg-gray-700' :
        'bg-gray-500 hover:bg-gray-600'
      }`}
    >
      {children}
    </button>
  );
}