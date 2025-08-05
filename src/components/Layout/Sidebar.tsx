// src/components/Layout/Sidebar.tsx

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
  Tooltip,
  Collapse,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// Props que recibe el Sidebar: si está abierto o cerrado
interface SidebarProps {
  open: boolean;
}

const Sidebar = ({ open }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useAuth(); // Usuario autenticado
  const [preoperacionalOpen, setPreoperacionalOpen] = useState(true); // Control del colapso del menú

  // Función para navegar a una ruta
  const handleNavigation = (path?: string) => {
    if (path) navigate(path);
  };

  // Ítems del menú lateral, con su texto, ícono, ruta y roles permitidos
  const items = [
  { text: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['admin'] },
  { text: 'Principal', icon: 'layers', path: '/principal', roles: ['admin'] },
  { text: 'Formulario', icon: 'assignment', path: '/formulario', roles: ['admin', 'conductor'] },
  { text: 'Reportes', icon: 'bar_chart', path: '/reportes', roles: ['admin', 'supervisor'] },
  { text: 'Usuarios', icon: 'people', path: '/usuarios', roles: ['admin', 'supervisor'] },
  { text: 'Vehículos', icon: 'commute', path: '/vehiculos', roles: ['admin', 'supervisor'] },
];


  return (
    <Box
      sx={{
        width: open ? 200 : 60, // Ancho del sidebar expandido o contraído
        backgroundImage: 'linear-gradient(to bottom, rgba(116, 116, 116, 1), rgba(255, 255, 255,1))', // Color del sidebar.
        height: '100%',
        position: 'fixed',
        top: 64, // Espacio reservado para el header
        left: 0,
        transition: 'width 0.3s', // Transición suave al expandir/contraer
        boxShadow: 2,
        zIndex: 1200,
        overflowX: 'hidden',
      }}
    >
      <List>
        {/* Menú principal (padre): Preoperacional */}
        <ListItem disablePadding sx={{ justifyContent: open ? 'flex-start' : 'center' }}>
          <Tooltip title={!open ? 'Preoperacional' : ''} placement="right">
            <ListItemButton
              onClick={() => setPreoperacionalOpen(!preoperacionalOpen)}
              sx={{
                justifyContent: open ? 'flex-start' : 'center',
                px: open ? 2 : 1,
                py: 1.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <Icon sx={{ color: 'white' }}>description</Icon>
              </ListItemIcon>
              {open && <ListItemText primary="Preoperacional" sx={{ color: 'white' }} />}
            </ListItemButton>
          </Tooltip>
        </ListItem>

        {/* Submenús filtrados por el rol del usuario */}
        <Collapse in={preoperacionalOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {usuario &&
              items
                .filter((item) => item.roles.includes(usuario.rol)) // Solo mostrar ítems permitidos
                .map((item) => {
                  const selected = location.pathname === item.path; // Verificar si está activa la ruta
                  return (
                    <ListItem
                      key={item.text}
                      disablePadding
                      sx={{ justifyContent: open ? 'flex-start' : 'center' }}
                    >
                      <Tooltip title={!open ? item.text : ''} placement="right">
                        <ListItemButton
                          onClick={() => handleNavigation(item.path)}
                          selected={selected}
                          sx={{
                            justifyContent: open ? 'flex-start' : 'center',
                            px: open ? 4 : 1,
                            py: 1,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 2 : 'auto',
                              justifyContent: 'center',
                              color: selected ? 'primary.main' : 'inherit',
                            }}
                          >
                            <Icon>{item.icon}</Icon>
                          </ListItemIcon>
                         {open && <ListItemText primary={item.text} sx={{ color: 'white' }}/>}
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  );
                })}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default Sidebar;
