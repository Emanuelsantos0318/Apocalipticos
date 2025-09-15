import React from 'react'; // Adicione esta linha
import { useRouteError, Link } from 'react-router-dom';
import MainButton from '../components/buttons/MainButton';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  // Determina o tipo de erro
  let errorMessage = 'Ocorreu um erro inesperado';
  let errorCode = '500';
  
  if (error.status === 404) {
    errorMessage = 'Página não encontrada';
    errorCode = '404';
  } else if (error.status === 403) {
    errorMessage = 'Acesso não autorizado';
    errorCode = '403';
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="text-9xl font-bold text-red-500">{errorCode}</div>
        <h1 className="text-3xl font-bold">{errorMessage}</h1>
        
        {import.meta.env.DEV && (
          <div className="bg-gray-800 p-4 rounded-lg text-left">
            <p className="font-mono text-sm text-red-400">
              {error.statusText || error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-xs overflow-x-auto">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        <Link to="/">
          <MainButton theme="primary" className="mt-8">
            Voltar para a Página Inicial
          </MainButton>
        </Link>
      </div>
    </div>
  );
}