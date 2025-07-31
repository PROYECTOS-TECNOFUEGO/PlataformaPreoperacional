// src/pages/NoAutorizado.tsx

import React from 'react';
import { Typography, Box } from '@mui/material';
import PageContainer from '../components/Common/PageContainer';

/**
 * Página que se muestra cuando un usuario intenta acceder a una ruta
 * protegida para la cual no tiene permisos (según su rol).
 * 
 * Utiliza el componente PageContainer para mantener la estructura de layout.
 */

const NoAutorizado = () => {
  return (
    <PageContainer>
      <Box textAlign="center" mt={10}>
        {/* Mensaje principal de error */}
        <Typography variant="h4" color="error" gutterBottom>
          🚫 Acceso no autorizado
        </Typography>
        
        {/* Mensaje explicativo adicional */}
        <Typography variant="subtitle1">
          No tienes permiso para acceder a esta sección.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default NoAutorizado;
