// src/components/Layout/Layout.tsx
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const drawerWidth = sidebarOpen ? 200 : 60;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

      {/* Contenedor principal debajo del Header */}
      <Box sx={{ display: 'flex', flex: 1, pt: 8 }}>
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} />

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pl: 2,
            pr: 2,
            ml: `${drawerWidth}px`,
            transition: 'margin-left 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flex: 1 }}>{children}</Box>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};
