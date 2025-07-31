// src/pages/principal/principal.tsx
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Common/PageContainer';

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
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return dataSource.filter((item) =>
      item.codigo.toLowerCase().includes(term) ||
      item.placa.toLowerCase().includes(term) ||
      item.conductor.toLowerCase().includes(term)
    );
  }, [search]);

  return (
    <PageContainer>
      <Box display="flex" justifyContent="center">
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
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Buscar registros
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
              sx={{ width: isMobile ? '100%' : 260 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/formulario')}
              sx={{ minWidth: 100 }}
            >
              Nuevo
            </Button>
          </Box>

          {/* Tabla */}
          <TableContainer component={Paper} elevation={0}>
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
                      <Box display="flex" gap={1}>
                        <Button size="small" onClick={() => console.log('Print', row.key)}>
                          <Icon>print</Icon>
                        </Button>
                        <Button size="small" onClick={() => console.log('Approve', row.key)}>
                          <Icon>check</Icon>
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography align="center" color="text.secondary">
                        No se encontraron registros.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default PrincipalPage;
