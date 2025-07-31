// src/pages/Vehiculos/Vehiculos.tsx
import {
  Box,
  Card,
  Divider,
  Icon,
  InputBase,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useMemo, useState } from 'react';
import PageContainer from '../../components/Common/PageContainer';

interface Vehicle {
  id: number;
  placa: string;
  tipo: string;
  modelo: string;
  estado: 'Activo' | 'Mantenimiento' | 'Inactivo';
}

const vehiculosEjemplo: Vehicle[] = [
  { id: 1, placa: 'ABC123', tipo: 'Camión', modelo: 'Volvo FH', estado: 'Activo' },
  { id: 2, placa: 'XYZ789', tipo: 'Camioneta', modelo: 'Toyota Hilux', estado: 'Mantenimiento' },
  { id: 3, placa: 'LMN456', tipo: 'Sedán', modelo: 'Mazda 3', estado: 'Activo' },
  { id: 4, placa: 'DEF222', tipo: 'Camión', modelo: 'Scania R500', estado: 'Inactivo' },
  { id: 5, placa: 'GHI333', tipo: 'Camioneta', modelo: 'Ford Ranger', estado: 'Activo' },
  { id: 6, placa: 'JKL987', tipo: 'Sedán', modelo: 'Toyota Corolla', estado: 'Mantenimiento' },
];

const getEstadoColor = (estado: Vehicle['estado']) => {
  switch (estado) {
    case 'Activo': return 'green';
    case 'Mantenimiento': return 'orange';
    case 'Inactivo': return 'red';
    default: return 'gray';
  }
};

const Vehiculos = () => {
  const [busqueda, setBusqueda] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const vehiculosFiltrados = useMemo(() => {
    return vehiculosEjemplo.filter((vehiculo) =>
      vehiculo.placa.toLowerCase().includes(busqueda.toLowerCase())
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
          {/* Encabezado y búsqueda */}
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'flex-start' : 'center'}
            mb={2}
            gap={2}
          >
            <Typography variant="h6" fontWeight="bold">
              Vehículos
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
                placeholder="Buscar por placa"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                sx={{ ml: 1, flex: 1, fontSize: 14 }}
              />
            </Box>
          </Box>

          {/* Lista de vehículos */}
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
            {vehiculosFiltrados.length === 0 ? (
              <Typography color="text.secondary">No se encontraron vehículos.</Typography>
            ) : (
              vehiculosFiltrados.map((vehiculo, idx) => (
                <Box key={vehiculo.id}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    py={1.5}
                    flexDirection={isMobile ? 'column' : 'row'}
                    gap={1.5}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transition: 'background 0.2s',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: '#555' }}>directions_car</Icon>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">
                          {vehiculo.placa}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {vehiculo.tipo} · {vehiculo.modelo}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      px={1.5}
                      py={0.5}
                      sx={{
                        fontSize: 12,
                        borderRadius: 10,
                        backgroundColor: getEstadoColor(vehiculo.estado),
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      {vehiculo.estado}
                    </Box>
                  </Box>

                  {idx !== vehiculosFiltrados.length - 1 && (
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

export default Vehiculos;
