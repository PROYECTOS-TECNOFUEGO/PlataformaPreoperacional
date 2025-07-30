// src/components/Header.tsx
import { AppBar, Toolbar, Typography, IconButton, Icon } from '@mui/material';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

const Header = ({ toggleSidebar, sidebarOpen }: HeaderProps) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: 1300,backgroundImage: 'linear-gradient(to right, #ff3131, #ff914d )' }}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <Icon>{sidebarOpen ? 'chevron_left' : 'menu'}</Icon>
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Plataforma Preoperacional
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
