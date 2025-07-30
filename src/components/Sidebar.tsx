// src/components/Sidebar.tsx
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Icon,
  Tooltip,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
}

const fullMenu = [
  { text: 'Configuracion', icon: 'settings', path: '/configuracion' },
  { text: 'Preoperacional', icon: 'analytics', action: 'Preoperacional' },
];

const PreoperacionalMenu = [
  { text: 'Dashboard', icon: 'home', path: '/dashboard' },
  { text: 'Reportes', icon: 'analytics', path: '/reportes' },
  { text: 'Usuarios', icon: 'group', path: '/usuarios' },
  { text: 'Vehiculos', icon: 'directions_car', path: '/vehiculos' },
  { text: 'Principal', icon: 'settings', path: '/principal' },
  { text: 'Volver', icon: 'arrow_back', action: 'volver' },
];

const Sidebar = ({ open }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [modoPrincipal, setModoPrincipal] = useState(false);

  const menuItems = modoPrincipal ? PreoperacionalMenu : fullMenu;

  const handleClick = (item: any) => {
    if (item.action === 'Preoperacional') {
      setModoPrincipal(true);
    } else if (item.action === 'volver') {
      setModoPrincipal(false);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <Box
      sx={{
        
        width: open ? 200 : 60,
        bgcolor: '#868282ff',
        height: '100vh',
        position: 'fixed',
        top: 64, 
        left: 0,
        transition: 'width 0.3s',
        boxShadow: 2,
        zIndex: 1200,
        overflowX: 'hidden',
      }}
    >
      <List>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;

          return (
            <ListItem
              key={item.text}
              disablePadding
              sx={{ justifyContent: open ? 'flex-start' : 'center' }}
            >
              <Tooltip title={!open ? item.text : ''} placement="right">
                <ListItemButton
                  onClick={() => handleClick(item)}
                  selected={selected}
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
                      color: selected ? 'primary.main' : 'inherit',
                    }}
                  >
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                  {open && <ListItemText primary={item.text} />}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
