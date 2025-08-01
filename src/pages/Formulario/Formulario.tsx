import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Radio,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PageContainer from '../../components/Common/PageContainer';
import { useNavigate } from 'react-router-dom';

const DOCUMENTOS = [
  'Tarjeta de propiedad',
  'SOAT',
  'Tecno Mecánica',
  'Tarjeta/Chip suministro combustible',
  'Tag Flypass',
];
const CARROCERIA = [
  'Puertas y bisagras',
  'Parachoques',
  'Luces externas',
  'Espejos laterales',
  'Estado general de la pintura',
];

const ANTES_ENCENDER = [
  'Freno de mano',
  'Niveles de aceite',
  'Revisión visual de fugas',
  'Tablero de instrumentos',
  'Sonido anormal al encendido',
];
const FormularioPage: React.FC = () => {
  const [placa, setPlaca] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [destino, setDestino] = useState('');
  const [documentos, setDocumentos] = useState<Record<string, string>>({});
  const [errores, setErrores] = useState<Record<string, string>>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleDocChange = (doc: string, value: string) => {
    setDocumentos((prev) => ({ ...prev, [doc]: value }));
  };

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    if (!placa.trim()) nuevosErrores.placa = 'Campo obligatorio';
    if (!proyecto.trim()) nuevosErrores.proyecto = 'Campo obligatorio';
    if (!destino.trim()) nuevosErrores.destino = 'Campo obligatorio';
    DOCUMENTOS.forEach((doc) => {
      if (!documentos[doc]) nuevosErrores[doc] = 'Seleccione una opción';
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    console.log({ placa, proyecto, destino, documentos });
    alert('Formulario guardado correctamente');
  };

  return (
    <PageContainer>
    
      {/* CUERPO */}
      <Box display="flex" justifyContent="center">
        <Card
          sx={{
            width: '100%',
            maxWidth: 820,
            p: isMobile ? 2 : 4,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Información general del conductor principal
          </Typography>

          {/* PLACA */}
          <Box mb={2}>
            <Typography>1. Placa *</Typography>
            <TextField
              fullWidth
              value={placa}
              onChange={(e) => setPlaca(e.target.value)}
              error={!!errores.placa}
              helperText={errores.placa}
            />
          </Box>

          {/* DOCUMENTOS */}
          <Box mb={3}>
            <Typography>2. Seleccione *</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Sí</TableCell>
                  <TableCell align="center">No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DOCUMENTOS.map((doc) => (
                  <TableRow key={doc}>
                    <TableCell>{doc}</TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'si'}
                        onChange={() => handleDocChange(doc, 'si')}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'no'}
                        onChange={() => handleDocChange(doc, 'no')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {DOCUMENTOS.some((doc) => errores[doc]) && (
              <Typography color="error" fontSize="0.8rem" mt={1}>
                Todos los documentos deben estar seleccionados
              </Typography>
            )}
          </Box>

          {/* PROYECTO */}
          <Box mb={2}>
            <Typography>3. Proyecto *</Typography>
            <TextField
              fullWidth
              value={proyecto}
              onChange={(e) => setProyecto(e.target.value)}
              error={!!errores.proyecto}
              helperText={errores.proyecto}
            />
          </Box>

          {/* DESTINO */}
          <Box mb={4}>
            <Typography>4. Lugar destino *</Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              error={!!errores.destino}
              helperText={errores.destino}
            />
          </Box>

           {/* RESPONSABLE */}
          <Box mb={4}>
            <Typography>7. Ingeniero responsable *</Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              error={!!errores.destino}
              helperText={errores.destino}
            />
          </Box>

          
           {/* CONDUCTOR */}
          <Box mb={4}>
            <Typography>8. Conductor *</Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              error={!!errores.destino}
              helperText={errores.destino}
            />
          </Box>

          {/* CONDUCTOR */}
          <Box mb={4}>
            <Typography>11. Kilometraje al inicio de la jornad *</Typography>
            <TextField
              fullWidth
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              error={!!errores.destino}
              helperText={errores.destino}
            />
          </Box>

          {/* DOCUMENTOS */}
          <Box mb={3}>
            <Typography>12.Inspección de la carrocería
              *</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Sí</TableCell>
                  <TableCell align="center">No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DOCUMENTOS.map((doc) => (
                  <TableRow key={doc}>
                    <TableCell>{doc}</TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'si'}
                        onChange={() => handleDocChange(doc, 'si')}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'no'}
                        onChange={() => handleDocChange(doc, 'no')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {DOCUMENTOS.some((doc) => errores[doc]) && (
              <Typography color="error" fontSize="0.8rem" mt={1}>
                Todos los documentos deben estar seleccionados
              </Typography>
            )}
          </Box>
           {/* DOCUMENTOS */}
          <Box mb={3}>
            <Typography>13.Inspección antes de encender el motor 
              *</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Sí</TableCell>
                  <TableCell align="center">No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DOCUMENTOS.map((doc) => (
                  <TableRow key={doc}>
                    <TableCell>{doc}</TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'si'}
                        onChange={() => handleDocChange(doc, 'si')}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'no'}
                        onChange={() => handleDocChange(doc, 'no')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {DOCUMENTOS.some((doc) => errores[doc]) && (
              <Typography color="error" fontSize="0.8rem" mt={1}>
                Todos los documentos deben estar seleccionados
              </Typography>
            )}
          </Box>
             <Box mb={3}>
            <Typography>13.Inspección antes de encender el motor 
              *</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Sí</TableCell>
                  <TableCell align="center">No</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {DOCUMENTOS.map((doc) => (
                  <TableRow key={doc}>
                    <TableCell>{doc}</TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'si'}
                        onChange={() => handleDocChange(doc, 'si')}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Radio
                        checked={documentos[doc] === 'no'}
                        onChange={() => handleDocChange(doc, 'no')}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {DOCUMENTOS.some((doc) => errores[doc]) && (
              <Typography color="error" fontSize="0.8rem" mt={1}>
                Todos los documentos deben estar seleccionados
              </Typography>
            )}
          </Box>
          {/* BOTONES */}
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button variant="contained" onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="outlined" onClick={() => navigate('/principal')}>
              Volver
            </Button>
          </Box>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default FormularioPage;
