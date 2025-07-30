// src/pages/Vehiculos.tsx
import {
  Box,
  Card,
  Divider,
  Icon,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';

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
    case 'Activo':
      return 'green';
    case 'Mantenimiento':
      return 'orange';
    case 'Inactivo':
      return 'red';
    default:
      return 'gray';
  }
};

const Vehiculos = () => {
  const [busqueda, setBusqueda] = useState('');

  const vehiculosFiltrados = useMemo(() => {
    return vehiculosEjemplo.filter((vehiculo) =>
      vehiculo.placa.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10, }}>
      <Card
        sx={{
            
          width: '100%',
          maxWidth: 910,
          p: 4,
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        {/* Encabezado y barra de búsqueda */}
        <Box
          sx={{
            
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            flexWrap: 'wrap',
            gap: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Vehículos
          </Typography>

          <TextField
            size="small"
            placeholder="Buscar por placa"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon color="action">search</Icon>
                </InputAdornment>
              ),
            }}
            sx={{ width: 260 }}
          />
        </Box>

        {/* Lista de vehículos */}
        <Box
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: 2,
            p: 2,
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {vehiculosFiltrados.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No se encontraron vehículos.
            </Typography>
          ) : (
            <List disablePadding>
              {vehiculosFiltrados.map((vehiculo, idx) => (
                <Box key={vehiculo.id}>
                  <ListItem>
                    <ListItemIcon>
                      <Icon color="primary">directions_car</Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography fontWeight="bold">
                          {vehiculo.placa}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            <strong>Tipo:</strong> {vehiculo.tipo} &nbsp;&nbsp;
                          </Typography>
                          <Typography variant="body2" component="span">
                            <strong>Modelo:</strong> {vehiculo.modelo} &nbsp;&nbsp;
                          </Typography>
                          <Typography
                            variant="body2"
                            component="span"
                            sx={{ color: getEstadoColor(vehiculo.estado), fontWeight: 'bold' }}
                          >
                            {vehiculo.estado}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {idx < vehiculosFiltrados.length - 1 && (
                    <Divider sx={{ ml: 7 }} />
                  )}
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Card>
    </Box>
  );
};

export default Vehiculos;
