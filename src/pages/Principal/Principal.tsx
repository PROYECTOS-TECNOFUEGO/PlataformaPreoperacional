// src/pages/principal/index.tsx
import React, { useMemo, useState } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  Icon,
  InputAdornment,
  TextField,
  Typography,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

interface PrincipalItem {
  key: string;
  codigo: string;
  placa: string;
  conductor: string;
  fecha: string;
}

const dataSource: PrincipalItem[] = [
  { key: '1', codigo: 'F-001', placa: 'ABC123', conductor: 'Juan Pérez', fecha: '2025-07-29' },
  { key: '2', codigo: 'F-002', placa: 'XYZ789', conductor: 'Ana Gómez', fecha: '2025-07-28' },
  { key: '3', codigo: 'F-003', placa: 'LMN456', conductor: 'Carlos Ruiz', fecha: '2025-07-28' },
  { key: '4', codigo: 'F-004', placa: 'DEF222', conductor: 'Luis Ángel', fecha: '2025-07-27' },
];

const PrincipalPage: FC = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate(); // 👈 Inicializar hook

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return dataSource.filter((item) =>
      item.codigo.toLowerCase().includes(term) ||
      item.placa.toLowerCase().includes(term) ||
      item.conductor.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
      <Card
        sx={{
          width: '100%',
          maxWidth: 910,
          p: 4,
          borderRadius: 4,
          boxShadow: 4,
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Buscar
          </Typography>

          <TextField
            placeholder="Buscar..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
              ),
            }}
            sx={{ width: 240 }}
          />

          {/* Botón para ir al formulario */}
          <Button variant="contained" color="primary" onClick={() => navigate('/formulario')}>
            Nuevo
          </Button>
        </Box>

        {/* Tabla */}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Código</strong></TableCell>
                <TableCell><strong>Placa</strong></TableCell>
                <TableCell><strong>Conductor</strong></TableCell>
                <TableCell><strong>Fecha</strong></TableCell>
                <TableCell><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>{row.codigo}</TableCell>
                  <TableCell>{row.placa}</TableCell>
                  <TableCell>{row.conductor}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => console.log('Print', row.key)}>
                      <Icon>print</Icon>
                    </Button>
                    <Button size="small" onClick={() => console.log('Approve', row.key)}>
                      <Icon>check</Icon>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default PrincipalPage;
