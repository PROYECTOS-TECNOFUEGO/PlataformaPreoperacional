import { useMemo, useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  Icon,
  InputAdornment,
  TextField,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  Button,
  Tooltip,
  Hidden,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../components/Common/PageContainer';
import axios from 'axios';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';

interface PrincipalItem {
  id: string;
  codigo: string;
  placa: string;
  conductor: string;
  fecha: string;
}

const PrincipalPage: FC = () => {
  const [search, setSearch] = useState('');
  const [dataSource, setDataSource] = useState<PrincipalItem[]>([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    axios.get('http://localhost:3000/api/formularios')
      .then(res => {
        const registros = res.data.map((item: any) => ({
          id: item.id || item.codigo || '',
          codigo: item.codigo || 'Sin código',
          placa: item.placa || 'Desconocida',
          conductor: item.conductor || 'Sin nombre',
          fecha: item.fecha || new Date().toISOString().split('T')[0]
        }));
        setDataSource(registros);
      })
      .catch(err => {
        console.error('Error al cargar formularios:', err);
      });
  }, []);

  const filteredData = useMemo(() => {
    const term = search.toLowerCase();
    return dataSource.filter((item) =>
      item.codigo.toLowerCase().includes(term) ||
      item.placa.toLowerCase().includes(term) ||
      item.conductor.toLowerCase().includes(term)
    );
  }, [search, dataSource]);

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
              flexDirection: isMobile ? 'column' : 'row',
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
                  {!isMobile && <TableCell><strong>Placa</strong></TableCell>}
                  {!isMobile && <TableCell><strong>Conductor</strong></TableCell>}
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.codigo}</TableCell>
                    {!isMobile && <TableCell>{row.placa}</TableCell>}
                    {!isMobile && <TableCell>{row.conductor}</TableCell>}
                    <TableCell>{row.fecha}</TableCell>
                    <TableCell>
                      <Box
                        display="flex"
                        gap={0.5}
                        flexWrap="wrap"
                        justifyContent={isMobile ? 'center' : 'flex-start'}
                      >
                        <Tooltip title="Ver">
                          <IconButton
                            onClick={() => navigate(`/ver/${row.id}`)}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                              },
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => navigate(`/editar/${row.id}`)}
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Imprimir">
                          <IconButton
                            sx={{
                              color: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                              },
                            }}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={isMobile ? 3 : 5}>
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
