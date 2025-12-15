import React, { useLayoutEffect } from 'react';
import AppRoutes from './AppRoutes';
import { useTheme } from './contexts/ThemeContext';
import './App.css';

function App() {
  const { theme } = useTheme();

  // useLayoutEffect para sincronizar o atributo data-theme com o estado do tema
  // antes que o navegador pinte a tela.
  useLayoutEffect(() => {
    // document.documentElement se refere à tag <html>
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]); // Roda sempre que o tema mudar

  return <AppRoutes />;
}

export default App;
