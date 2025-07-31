// src/pages/usuarios/usuarios.tsx
import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  Typography,
  InputBase,
  Divider,
  Icon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PageContainer from '../../components/Common/PageContainer';

interface UserItem {
  id: number;
  nombre: string;
  rol: 'Administrador' | 'Conductor' | 'Supervisor' | string;
  correo: string;
  estado: 'Activo' | 'Inactivo';
}

const usuariosEjemplo: UserItem[] = [
  { id: 1, nombre: 'Ricardo García', rol: 'Administrador', correo: 'ricardo@example.com', estado: 'Activo' },
  { id: 2, nombre: 'Laura Martínez', rol: 'Conductor', correo: 'laura@example.com', estado: 'Inactivo' },
  { id: 3, nombre: 'Carlos Torres', rol: 'Supervisor', correo: 'carlos@example.com', estado: 'Activo' },
  { id: 4, nombre: 'María López', rol: 'Conductor', correo: 'maria@example.com', estado: 'Activo' },
  { id: 5, nombre: 'Jorge Pérez', rol: 'Supervisor', correo: 'jorge@example.com', estado: 'Inactivo' },
  { id: 6, nombre: 'Ana Ruiz', rol: 'Administrador', correo: 'ana@example.com', estado: 'Activo' },
];

const getEstadoColor = (estado: string) => (estado === 'Activo' ? 'green' : 'red');

const getRolColor = (rol: string) => {
  switch (rol) {
    case 'Administrador': return '#e91e63';
    case 'Conductor': return '#3f51b5';
    case 'Supervisor': return '#9c27b0';
    default: return '#2196f3';
  }
};

const UsuariosPage: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const usuariosFiltrados = useMemo(() => {
    return usuariosEjemplo.filter(
      (usuario) =>
        usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        usuario.correo.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda]);

  return (
    <PageContainer>
      <Box display="flex" justifyContent="center" width="100%">
        <Card
          sx={{
            width: '100%',
            maxWidth: 960,
            p: isMobile ? 2 : 4,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          {/* Encabezado */}
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'flex-start' : 'center'}
            mb={2}
            gap={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Usuarios
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: 1,
                pl: 1,
                width: isMobile ? '100%' : 280,
                height: 36,
                backgroundColor: '#f9f9f9',
              }}
            >
              <Icon sx={{ fontSize: 20, color: '#666' }}>search</Icon>
              <InputBase
                placeholder="Buscar por nombre o correo"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
              />
            </Box>
          </Box>

          {/* Lista de usuarios */}
          <Box
            sx={{
              border: '1px solid #eee',
              borderRadius: 2,
              maxHeight: '50vh',
              overflowY: 'auto',
              px: 2,
              py: 1,
            }}
          >
            {usuariosFiltrados.length === 0 ? (
              <Typography color="text.secondary">No se encontraron usuarios.</Typography>
            ) : (
              usuariosFiltrados.map((usuario, idx) => (
                <Box key={usuario.id}>
                  <Box
                    display="flex"
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent="space-between"
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    py={1.5}
                    gap={1.5}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transition: 'background 0.2s',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: '#555' }}>person</Icon>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">
                          {usuario.nombre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {usuario.correo}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={1}>
                      <Box
                        px={1.5}
                        py={0.5}
                        sx={{
                          fontSize: 12,
                          borderRadius: 10,
                          backgroundColor: getRolColor(usuario.rol),
                          color: '#fff',
                        }}
                      >
                        {usuario.rol}
                      </Box>
                      <Box
                        px={1.5}
                        py={0.5}
                        sx={{
                          fontSize: 12,
                          borderRadius: 10,
                          backgroundColor: getEstadoColor(usuario.estado),
                          color: '#fff',
                        }}
                      >
                        {usuario.estado}
                      </Box>
                    </Box>
                  </Box>

                  {idx !== usuariosFiltrados.length - 1 && (
                    <Divider sx={{ ml: 5 }} />
                  )}
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default UsuariosPage;
