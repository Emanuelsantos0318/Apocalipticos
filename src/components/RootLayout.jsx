import React from 'react';
import { useNavigation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from './LoadingScreen';

export default function RootLayout() {
  const { loading } = useAuth();
  const navigation = useNavigation();

  return (
    <>
      {(loading || navigation.state === 'loading') && (
        <LoadingScreen theme="apocalypse" />
      )}
      <Outlet />
    </>
  );
}