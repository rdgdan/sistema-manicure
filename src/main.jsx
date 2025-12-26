// Importe os estilos do Mantine primeiro para que possam ser sobrescritos
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Modal from 'react-modal';

import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import './index.css';

// Define o elemento raiz da aplicação para o react-modal
Modal.setAppElement('#root');

const root = ReactDOM.createRoot(document.getElementById('root'));

// Crie um tema customizado para o Mantine
const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'violet',
  colors: {
    violet: [
      "#f2eafa",
      "#d9c1f1",
      "#bf99e8",
      "#a471e0",
      "#8a4ad8",
      "#7023d0",
      "#5c1bbf", // Cor principal
      "#4e14a6",
      "#41108d",
      "#340c74"
    ]
  },
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  headings: {
    fontFamily: 'Roboto Slab, serif',
  },
});

// Renderiza a aplicação com a hierarquia de Providers
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications position="top-right" zIndex={1000} />
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <SidebarProvider>
              <App />
            </SidebarProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </MantineProvider>
  </React.StrictMode>
);
