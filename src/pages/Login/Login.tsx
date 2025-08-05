
// src/pages/Login/Login.tsx
import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Icon } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoTecno from '../../assets/LogoTecno.png';  

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const success = await login(username, password);
  
  if (success) {
  navigate('/principal'); 

  } else {
    setError('Usuario o contraseña incorrectos');
  }
};

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        px: 2,
      }}
    >
      <Card
        elevation={6}
        sx={{
          width: isMobile ? '100%' : 400,
          maxWidth: 420,
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        <Box
          component="img"
          src={LogoTecno}
          alt="TecnoFuego"
          sx={{ height: 64, mb: 2, mx: 'auto' }}
        />

        <Typography variant="h5" fontWeight={600} mb={2}>
          Iniciar sesión
        </Typography>

        {/* Alerta de error */}
        <Collapse in={!!error} sx={{ mb: 2 }}>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </Collapse>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Usuario */}
          <TextField
            fullWidth
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>person</Icon>
                </InputAdornment>
              ),
            }}
          />

          {/* Contraseña */}
          <TextField
            fullWidth
            label="Contraseña"
            type={showPwd ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>lock</Icon>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPwd((prev) => !prev)}
                  >
                    <Icon>{showPwd ? 'visibility_off' : 'visibility'}</Icon>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Recordarme */}
          <FormControlLabel
            control={<Checkbox color="primary" />}
            label="Recuérdame"
            sx={{ mt: 1, mb: 2, display: 'flex', justifyContent: 'flex-start' }}
          />

          {/* Botón */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{ py: 1 }}
          >
            Entrar
          </Button>
        </Box>

        {/* Enlace olvidó contraseña (placeholder) */}
        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => alert('Funcionalidad pendiente')}
        >
          ¿Olvidaste tu contraseña?
        </Typography>
      </Card>
    </Box>
  );
};

export default Login;

