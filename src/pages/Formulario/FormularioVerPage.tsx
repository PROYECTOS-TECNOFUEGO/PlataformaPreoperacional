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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PageContainer from '../../components/Common/PageContainer';

const FormularioVerPage = () => {
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

  const renderSeccion = (titulo: string, data: Record<string, string>) => (
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
                InputProps={{ readOnly: true }}
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
          Ver Formulario
        </Typography>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Conductor"
              value={formulario.conductor || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Placa"
              value={formulario.placa || ''}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Fecha"
              value={formulario.fecha || ''}
              fullWidth
              InputProps={{ readOnly: true }}
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

        {formulario.documentos && renderSeccion('Documentos', formulario.documentos)}
        {formulario.carroceria && renderSeccion('Carrocería', formulario.carroceria)}
        {formulario.antesEncender && renderSeccion('Antes de Encender', formulario.antesEncender)}
        {formulario.botiquin && renderSeccion('Botiquín y Herramientas', formulario.botiquin)}
        {formulario.vehiculoEncendido && renderSeccion('Vehículo Encendido', formulario.vehiculoEncendido)}

        {formulario.observaciones && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography fontWeight="bold" gutterBottom>
              Observaciones
            </Typography>
            <TextField
              multiline
              fullWidth
              rows={3}
              value={formulario.observaciones}
              InputProps={{ readOnly: true }}
            />
          </>
        )}
      </Card>

      {/* Botón Volver con icono */}
      <Box display="flex" justifyContent="center" mt={3}>
        <Tooltip title="Volver a principal">
          <IconButton
            color="primary"
            onClick={() => navigate('/principal')}
            sx={{
              border: '1px solid #FF4D2E',
              p: 1.5,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </PageContainer>
  );
};

export default FormularioVerPage;
