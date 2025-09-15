// import { useNavigate } from 'react-router-dom';
// function MyComponent() {
  //   const navigate = useNavigate();
  
  //   const handleError = () => {
    //     navigate('/error', { state: { 
      //       status: 404,
      //       message: 'Recurso não encontrado' 
      //     }});
      //   };
      // }
import React from 'react';
export default function LoadingScreen({ theme = 'default' }) {
    const themes = {
      apocalypse: 'bg-gray-900 text-red-500',
      default: 'bg-white text-black'
    };
  
    return (
      <div className={`${themes[theme]} fixed inset-0 flex items-center justify-center`}>
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-20 h-20 bg-current rounded-full mb-4"></div>
          <p className="text-xl font-bold">Carregando o apocalipse...</p>
        </div>
      </div>
    );
  }