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
import { useMemo, useState, useEffect } from 'react';
import PageContainer from '../../components/Common/PageContainer';
import axios from 'axios';

interface Vehicle {
  id: number;
  placa: string;
  tipo: string;
  modelo: string;
  estado: 'Activo' | 'Mantenimiento' | 'Inactivo';
}

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
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('http://localhost:3000/api/vehiculos')
      .then((res) => {
        const vehiculosConId = res.data.map((v: any, i: number) => ({
          id: i + 1,
          placa: v.placa,
          tipo: v.tipo,
          modelo: v.modelo,
          estado: v.estado,
        }));
        setVehiculos(vehiculosConId);
      })
      .catch((err) => {
        console.error('Error al cargar vehículos:', err);
      });
  }, []);

  const vehiculosFiltrados = useMemo(() => {
    return vehiculos.filter((vehiculo) =>
      vehiculo.placa.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, vehiculos]);

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
