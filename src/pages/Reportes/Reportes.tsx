// src/pages/reportes/index.tsx
import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  InputBase,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Icon,
  Paper,
} from '@mui/material';

interface Reporte {
  key: string;
  codigo: string;
  placa: string;
  conductor: string;
  fecha: string; // ISO string
  observaciones: string;
}

const mockReportes: Reporte[] = [
  {
    key: '1',
    codigo: 'R‑001',
    placa: 'ABC123',
    conductor: 'Juan Pérez',
    fecha: '2025-05-21',
    observaciones: 'Todo correcto',
  },
  {
    key: '2',
    codigo: 'R‑002',
    placa: 'XYZ789',
    conductor: 'Ana Gómez',
    fecha: '2025-05-22',
    observaciones: 'Neumático bajo',
  },
  {
    key: '3',
    codigo: 'R‑003',
    placa: 'LMN456',
    conductor: 'Carlos Ruiz',
    fecha: '2025-05-23',
    observaciones: 'Falta extintor',
  },
];

const ReportesPage: React.FC = () => {
  const [fechaInicio, setFechaInicio] = useState('2025-05-21');
  const [fechaFin, setFechaFin] = useState('2025-05-23');
  const [busqueda, setBusqueda] = useState('');

  const dataFiltrada = useMemo(() => {
    return mockReportes.filter((r) => {
      const fechaValida =
        (!fechaInicio || r.fecha >= fechaInicio) &&
        (!fechaFin || r.fecha <= fechaFin);

      const term = busqueda.toLowerCase();
      const coincide =
        r.codigo.toLowerCase().includes(term) ||
        r.placa.toLowerCase().includes(term) ||
        r.conductor.toLowerCase().includes(term) ||
        r.observaciones.toLowerCase().includes(term);

      return fechaValida && coincide;
    });
  }, [fechaInicio, fechaFin, busqueda]);

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
        {/* Título */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Reportes
        </Typography>

        {/* Filtros */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={2}
          alignItems="center"
          mb={2}
        >
          <Box display="flex" flexDirection="column">
            <label htmlFor="fechaInicio" style={{ fontSize: 12 }}>
              Desde:
            </label>
            <input
              type="date"
              id="fechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 14,
              }}
            />
          </Box>

          <Box display="flex" flexDirection="column">
            <label htmlFor="fechaFin" style={{ fontSize: 12 }}>
              Hasta:
            </label>
            <input
              type="date"
              id="fechaFin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{
                padding: '6px 8px',
                borderRadius: 4,
                border: '1px solid #ccc',
                fontSize: 14,
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #ccc',
              borderRadius: 1,
              pl: 1,
              width: 260,
              height: 36,
              backgroundColor: '#f9f9f9',
            }}
          >
            <Icon sx={{ fontSize: 20, color: '#666' }}>search</Icon>
            <InputBase
              placeholder="Buscar por texto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              sx={{ ml: 2, flex: 1, fontSize: 14 }}
            />
          </Box>
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
                <TableCell><strong>Observaciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFiltrada.map((reporte) => (
                <TableRow key={reporte.key}>
                  <TableCell>{reporte.codigo}</TableCell>
                  <TableCell>{reporte.placa}</TableCell>
                  <TableCell>{reporte.conductor}</TableCell>
                  <TableCell>{reporte.fecha}</TableCell>
                  <TableCell>{reporte.observaciones}</TableCell>
                </TableRow>
              ))}
              {dataFiltrada.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" align="center">
                      No se encontraron resultados.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default ReportesPage;
