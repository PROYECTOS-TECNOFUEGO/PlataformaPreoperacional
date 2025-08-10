import { useEffect, useState } from 'react';
import type { FC } from 'react';
import {
  Card,
  Typography,
  Grid,
  TextField,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import PageContainer from '../../components/Common/PageContainer';
import PageHeader from '../../components/Common/PageHeader';
import EmptyState from '../../components/Common/EmptyState';
import LoadingBackdrop from '../../components/Feedback/LoadingBackdrop';
import { useSnackbar } from '../../components/Feedback/SnackbarProvider';

const FormularioEditarPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueue } = useSnackbar();

  const [formulario, setFormulario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${base}/formularios/${id}`)
      .then((res) => setFormulario(res.data))
      .catch(() => enqueue('Error al cargar el formulario', 'error'))
      .finally(() => setLoading(false));
  }, [id, base, enqueue]);

  const handleChangeSeccion = (seccion: string, campo: string, valor: string) => {
    setFormulario((prev: any) => ({
      ...prev,
      [seccion]: {
        ...prev?.[seccion],
        [campo]: valor,
      },
    }));
  };

  const handleGuardar = () => {
    setLoading(true);
    axios
      .put(`${base}/formularios/${id}`, formulario)
      .then(() => {
        enqueue('Formulario actualizado', 'success');
        navigate('/principal');
      })
      .catch(() => enqueue('Error al guardar el formulario', 'error'))
      .finally(() => setLoading(false));
  };

  const renderSeccionEditable = (
    titulo: string,
    seccion: string,
    data: Record<string, string>
  ) => (
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
                value={value ?? ''}
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
      <PageHeader
        title="Editar Formulario"
        actions={
          <>
            <Tooltip title="Volver a principal">
              <IconButton onClick={() => navigate('/principal')}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Guardar cambios">
              <IconButton onClick={handleGuardar} disabled={!formulario}>
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </>
        }
      />

      <Card sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1000, mx: 'auto', borderRadius: 2 }}>
        {!loading && !formulario ? (
          <EmptyState text="Formulario no encontrado." />
        ) : (
          formulario && (
            <>
              {/* Estados (solo visuales) */}
              <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
                {formulario.estadoGeneral && (
                  <Chip label={`Estado: ${formulario.estadoGeneral}`} color="primary" />
                )}
                {formulario.estadoPrincipal && (
                  <Chip label={`Principal: ${formulario.estadoPrincipal}`} variant="outlined" />
                )}
                {formulario.estadoRelevo && (
                  <Chip label={`Relevo: ${formulario.estadoRelevo}`} variant="outlined" />
                )}
                {typeof formulario.tieneRelevo === 'boolean' && (
                  <Chip
                    label={formulario.tieneRelevo ? 'Con relevo' : 'Sin relevo'}
                    color={formulario.tieneRelevo ? 'secondary' : 'default'}
                    variant={formulario.tieneRelevo ? 'filled' : 'outlined'}
                  />
                )}
                {formulario.rolEtapa && <Chip label={`Etapa: ${formulario.rolEtapa}`} />}
              </Stack>

              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Conductor"
                    value={formulario.conductor ?? ''}
                    fullWidth
                    onChange={(e) =>
                      setFormulario({ ...formulario, conductor: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Placa"
                    value={formulario.placa ?? ''}
                    fullWidth
                    onChange={(e) => setFormulario({ ...formulario, placa: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha"
                    value={formulario.fecha ?? ''}
                    fullWidth
                    onChange={(e) => setFormulario({ ...formulario, fecha: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Código" value={formulario.codigo ?? ''} fullWidth InputProps={{ readOnly: true }} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {formulario.documentos &&
                renderSeccionEditable('Documentos', 'documentos', formulario.documentos)}
              {formulario.carroceria &&
                renderSeccionEditable('Carrocería', 'carroceria', formulario.carroceria)}
              {formulario.antesEncender &&
                renderSeccionEditable('Antes de Encender', 'antesEncender', formulario.antesEncender)}
              {formulario.botiquin &&
                renderSeccionEditable('Botiquín y Herramientas', 'botiquin', formulario.botiquin)}
              {formulario.vehiculoEncendido &&
                renderSeccionEditable('Vehículo Encendido', 'vehiculoEncendido', formulario.vehiculoEncendido)}

              <Divider sx={{ my: 2 }} />

              <Typography fontWeight="bold" gutterBottom>
                Observaciones
              </Typography>
              <TextField
                multiline
                fullWidth
                rows={3}
                value={formulario.observaciones ?? ''}
                onChange={(e) => setFormulario({ ...formulario, observaciones: e.target.value })}
              />
            </>
          )
        )}
      </Card>

      <LoadingBackdrop open={loading} />
    </PageContainer>
  );
};

export default FormularioEditarPage;
