// src/main.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider } from './context/AuthContext'; // Proveedor de contexto de autenticación

/**
 * Punto de entrada principal del frontend.
 * Se encarga de renderizar el componente <App /> en el DOM,
 * aplicando el tema global de Material UI y envolviendo toda la aplicación
 * con el proveedor de autenticación.
 */

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Se aplica el tema personalizado de Material UI */}
    <ThemeProvider theme={theme}>
      {/* Se aplica un estilo base global para normalizar estilos */}
      <CssBaseline />
      {/* Proveedor de autenticación que expone el contexto a toda la app */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
