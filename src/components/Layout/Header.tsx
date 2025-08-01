// src/components/Layout/Header.tsx

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Icon,
  Box,
  Menu,
  MenuItem,
} 
from '@mui/material';
import { useAuth } from '../../context/AuthContext'; // Hook para acceder al usuario y funciones de autenticación
import { useNavigate } from 'react-router-dom';
import LogoTecno from '../../assets/LogoTecno.png'; // Logo institucional

// Props que recibe el componente desde Layout
interface HeaderProps {
  toggleSidebar: () => void;     // Función para abrir/cerrar el Sidebar
  sidebarOpen: boolean;          // Estado actual del Sidebar
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  const { usuario, logout } = useAuth(); // Datos del usuario logueado y función de logout
  const navigate = useNavigate();

  // Estado para anclar el menú desplegable del perfil
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Abre el menú del usuario
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Cierra el menú
  const handleMenuClose = () => setAnchorEl(null);

  // Cierra sesión del usuario
  const handleLogout = () => {
    logout();              // Borra token y estado
    handleMenuClose();     // Cierra el menú
    navigate('/login');    // Redirecciona al login
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1, // Asegura que esté por encima del sidebar
        backgroundImage: 'linear-gradient(to right, #ff3131, #ff914d)', // Gradiente rojo-anaranjado
        height: '64px',
      }}
    >
      <Toolbar
        sx={{
          minHeight: '64px',
          px: 2,
          display: 'flex',
          flexWrap: 'wrap', // Permite responsividad
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Logo + Título + Botón de menú */}
        <Box
          display="flex"
          alignItems="center"
          minWidth={0}
          sx={{ flexShrink: 1, overflow: 'hidden' }}
        >
          {/* Botón de abrir/cerrar sidebar */}
          <IconButton color="inherit" onClick={toggleSidebar} sx={{ mr: 1 }}>
            <Icon>{sidebarOpen ? 'chevron_left' : 'menu'}</Icon>
          </IconButton>

          {/* Logo de la empresa */}
          <Box
            component="img"
            src={LogoTecno}
            alt="Logo Tecno Fuego"
            sx={{ height: 40, mr: 2, flexShrink: 0 }}
          />

          {/* Nombre de la plataforma */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '300px', // Limita el espacio para evitar colapsos
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Plataforma Preoperacional
          </Typography>
        </Box>

        {/* Nombre de usuario + Rol + Menú desplegable */}
        <Box display="flex" alignItems="center" gap={1} sx={{ mt: { xs: 1, sm: 0 } }}>
          <Typography
            variant="body1"
            noWrap
            sx={{ fontSize: { xs: '0.85rem', sm: '1rem' } }}
          >
            {usuario?.username} ({usuario?.rol})
          </Typography>

          {/* Botón de ícono de perfil */}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Icon>account_circle</Icon>
          </IconButton>

          {/* Menú desplegable de perfil */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Mi perfil</MenuItem>
            <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
