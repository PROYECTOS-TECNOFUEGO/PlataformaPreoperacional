// src/components/PageContainer.tsx

import { Box } from '@mui/material';
import React from 'react';

/**
 * Props esperadas para el componente PageContainer.
 * - children: Contenido a renderizar dentro del contenedor.
 */
interface PageContainerProps {
  children: React.ReactNode;
}

/**
 * Componente reutilizable que actúa como contenedor para las páginas principales del sistema.
 * Se encarga de:
 * - Establecer un ancho máximo uniforme.
 * - Centrar el contenido horizontalmente.
 * - Aplicar padding y flexbox para disposición vertical.
 * - Adaptarse de forma responsiva a diferentes tamaños de pantalla.
 */
const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',                // Ocupa el 100% del ancho disponible
        maxWidth: '1200px',           // Limita el ancho máximo a 1200px para evitar estiramientos excesivos
        mx: 'auto',                   // Centra horizontalmente
        px: { xs: 2, sm: 3 },         // Padding horizontal: 16px en xs, 24px en sm+
        py: { xs: 2, sm: 3 },         // Padding vertical: igual que horizontal
        flexGrow: 1,                  // Permite que crezca para llenar el espacio vertical
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',      // Incluye padding en el cálculo del tamaño del box
      }}
    >
      {children}
    </Box>
  );
};

export default PageContainer;
