import React from 'react'; // Adicione esta linha
export default function MainButton({ 
    children, 
    onClick, 
    icon, 
    theme = 'default' 
  }) {
    const themes = {
      apocalypse: 'bg-green-700 hover:bg-green-800',
      fire: 'bg-orange-600 hover:bg-orange-700',
      default: 'bg-indigo-600 hover:bg-indigo-700'
    };
  
    return (
      <button
        onClick={onClick}
        className={`${themes[theme]} text-white font-bold py-3 px-6 rounded-lg 
        transition-all flex items-center justify-center gap-2 shadow-lg
        hover:scale-105 transform`}
      >
        {icon && <span className="text-xl">{icon}</span>}
        {children}
      </button>
    );
  }