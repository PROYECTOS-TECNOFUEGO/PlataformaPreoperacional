import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Grid,
  TextField,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageContainer from '../../components/Common/PageContainer';

const FormularioEditarPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/formularios/${id}`)
      .then(res => {
        setFormulario(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar el formulario:', err);
        setLoading(false);
      });
  }, [id]);

  const handleChangeSeccion = (seccion: string, campo: string, valor: string) => {
    setFormulario((prev: any) => ({
      ...prev,
      [seccion]: {
        ...prev[seccion],
        [campo]: valor,
      },
    }));
  };

  const handleGuardar = () => {
    axios.put(`http://localhost:3000/api/formularios/${id}`, formulario)
      .then(() => {
        alert('Formulario actualizado correctamente');
        navigate('/principal');
      })
      .catch(err => {
        console.error('Error al actualizar el formulario:', err);
        alert('Error al guardar el formulario');
      });
  };

  if (loading) {
    return (
      <PageContainer>
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (!formulario) {
    return (
      <PageContainer>
        <Typography variant="h6" color="error" align="center" mt={5}>
          Formulario no encontrado.
        </Typography>
      </PageContainer>
    );
  }

  const renderSeccionEditable = (titulo: string, seccion: string, data: Record<string, string>) => (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight="bold">{titulo}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {Object.entries(data).map(([key, value]) => (
            <Grid item xs={12} sm={6} key={key}>
              <TextField
                label={key}
                value={value}
                fullWidth
                onChange={(e) => handleChangeSeccion(seccion, key, e.target.value)}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <PageContainer>
      <Card sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Editar Formulario
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Conductor"
              value={formulario.conductor || ''}
              fullWidth
              onChange={(e) => setFormulario({ ...formulario, conductor: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Placa"
              value={formulario.placa || ''}
              fullWidth
              onChange={(e) => setFormulario({ ...formulario, placa: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha"
              value={formulario.fecha || ''}
              fullWidth
              onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código"
              value={formulario.codigo || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {formulario.documentos && renderSeccionEditable('Documentos', 'documentos', formulario.documentos)}
        {formulario.carroceria && renderSeccionEditable('Carrocería', 'carroceria', formulario.carroceria)}
        {formulario.antesEncender && renderSeccionEditable('Antes de Encender', 'antesEncender', formulario.antesEncender)}
        {formulario.botiquin && renderSeccionEditable('Botiquín y Herramientas', 'botiquin', formulario.botiquin)}
        {formulario.vehiculoEncendido && renderSeccionEditable('Vehículo Encendido', 'vehiculoEncendido', formulario.vehiculoEncendido)}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight="bold" gutterBottom>
          Observaciones
        </Typography>
        <TextField
          multiline
          fullWidth
          rows={3}
          value={formulario.observaciones || ''}
          onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
        />
      </Card>

      {/* Icon Buttons */}
      <Box display="flex" justifyContent="center" gap={4} mt={3}>
        <Tooltip title="Volver a principal">
          <IconButton
            color="primary"
            onClick={() => navigate('/principal')}
            sx={{ border: '1px solid #FF4D2E', p: 1.5 }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Guardar cambios">
          <IconButton
            color="primary"
            onClick={handleGuardar}
            sx={{
              backgroundColor: '#FF4D2E',
              color: 'white',
              '&:hover': { backgroundColor: '#e54324' },
              p: 1.5,
            }}
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </PageContainer>
  );
};

export default FormularioEditarPage;
