import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  Radio,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  useMediaQuery,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';

import PageContainer from '../../components/Common/PageContainer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LoadingBackdrop from '../../components/Feedback/LoadingBackdrop';
import { useSnackbar } from '../../components/Feedback/SnackbarProvider';

import {
  DOCUMENTOS,
  CARROCERIA,
  ANTES_ENCENDER,
  BOTIQUIN_HERRAMIENTAS,
  VEHICULO_ENCENDIDO,
} from './constants';
import SeccionInspeccion from './SeccionInspeccion';
import type { SectionValues, RadioValue } from './types';

const Formulario: FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const { enqueue } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Navegación por pasos
  const [activeStep, setActiveStep] = useState(0);
  const steps = ['Datos', 'Resumen', 'Confirmación'];

  // ID del registro (si ya fue creado)
  const [registroId, setRegistroId] = useState<string | null>(null);

  // Para enlazar 2 formularios (principal / relevo)
  const [grupoId, setGrupoId] = useState<string>('');

  // Datos básicos
  const [conductor, setConductor] = useState('');
  const [placa, setPlaca] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [responsable, setResponsable] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [kmInicio, setKmInicio] = useState('');
  const [destino, setDestino] = useState('');
  const [fechaSoat, setFechaSoat] = useState('');
  const [fechaTecno, setFechaTecno] = useState('');
  const [inspector, setInspector] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Inspecciones
  const [documentos, setDocumentos] = useState<SectionValues>({});
  const [carroceria, setCarroceria] = useState<SectionValues>({});
  const [antesEncender, setAntesEncender] = useState<SectionValues>({});
  const [botiquin, setBotiquin] = useState<SectionValues>({});
  const [vehiculoEncendido, setVehiculoEncendido] = useState<SectionValues>({});

  // Errores
  const [errores, setErrores] = useState<Record<string, string>>({});

  // Relevo / etapa (se responde en Confirmación)
  const [tieneRelevo, setTieneRelevo] = useState<'si' | 'no'>('no');
  const [rolEtapa, setRolEtapa] = useState<'principal' | 'relevo'>('principal');

  const finalizarLabel = useMemo(() => {
    if (tieneRelevo === 'no') return 'Finalizar preoperacional';
    return rolEtapa === 'principal' ? 'Finalizar (principal)' : 'Finalizar (relevo)';
  }, [tieneRelevo, rolEtapa]);

  // Helpers
  const actualizarGrupo =
    (setter: React.Dispatch<React.SetStateAction<SectionValues>>) =>
    (item: string, value: RadioValue) =>
      setter((prev) => ({ ...prev, [item]: value }));

  // ✅ Validación básica SOLO para Guardar
  const validarBasico = (): boolean => {
    const err: Record<string, string> = {};
    if (!conductor.trim()) err.conductor = 'Campo requerido';
    if (!placa.trim()) err.placa = 'Campo requerido';
    setErrores((prev) => ({ ...prev, ...err }));
    return Object.keys(err).length === 0;
  };

  // ✅ Validación completa SOLO para Finalizar
  const validarCompleto = (): boolean => {
    const err: Record<string, string> = {};

    // Obligatorios fuertes
    if (!conductor.trim()) err.conductor = 'Campo requerido';
    if (!placa.trim()) err.placa = 'Campo requerido';
    if (!proyecto.trim()) err.proyecto = 'Campo requerido';
    if (!responsable.trim()) err.responsable = 'Campo requerido';
    if (!destino.trim()) err.destino = 'Campo requerido';
    if (!fechaInicio) err.fechaInicio = 'Campo requerido';
    if (!horaInicio) err.horaInicio = 'Campo requerido';
    if (!kmInicio.trim()) err.kmInicio = 'Campo requerido';
    if (!fechaSoat) err.fechaSoat = 'Campo requerido';
    if (!fechaTecno) err.fechaTecno = 'Campo requerido';
    if (!inspector.trim()) err.inspector = 'Campo requerido';

    const validarGrupo = (nombre: string, items: string[], valores: SectionValues) =>
      items.forEach((i) => {
        if (!valores[i]) err[`${nombre}.${i}`] = 'Seleccione';
      });

    validarGrupo('documentos', DOCUMENTOS, documentos);
    validarGrupo('carroceria', CARROCERIA, carroceria);
    validarGrupo('antesEncender', ANTES_ENCENDER, antesEncender);
    validarGrupo('botiquin', BOTIQUIN_HERRAMIENTAS, botiquin);
    validarGrupo('vehiculoEncendido', VEHICULO_ENCENDIDO, vehiculoEncendido);

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const estadosIniciales = () => {
    if (tieneRelevo === 'no') {
      return { estadoGeneral: 'En proceso', estadoPrincipal: 'En curso', estadoRelevo: 'No aplica' };
    }
    if (rolEtapa === 'principal') {
      return { estadoGeneral: 'En proceso', estadoPrincipal: 'En curso', estadoRelevo: 'Pendiente' };
    }
    return { estadoGeneral: 'En proceso', estadoPrincipal: 'Terminado', estadoRelevo: 'En curso' };
  };

  const estadosFinalizar = () => {
    if (tieneRelevo === 'no') {
      return { estadoGeneral: 'Finalizado', estadoPrincipal: 'Terminado', estadoRelevo: 'No aplica' };
    }
    if (rolEtapa === 'principal') {
      return {
        estadoGeneral: 'En proceso',
        estadoPrincipal: 'Terminado',
        estadoRelevo: 'Pendiente',
        banner: 'Primer conductor finalizó. Pendiente relevo.',
      };
    }
    return {
      estadoGeneral: 'Finalizado',
      estadoPrincipal: 'Terminado',
      estadoRelevo: 'Terminado',
      banner: 'Preoperacional finalizado. Se completaron ambas etapas.',
    };
  };

  const buildPayload = (extra: Record<string, any>) => ({
    grupoId: grupoId || undefined, // si viene, lo guarda; si no, backend puede generar
    conductor,
    placa,
    proyecto,
    responsable,
    fechaInicio,
    horaInicio,
    kmInicio,
    destino,
    fechaSoat,
    fechaTecno,
    inspector,
    observaciones,
    documentos,
    carroceria,
    antesEncender,
    botiquin,
    vehiculoEncendido,
    usuario: usuario?.username ?? 'anon',
    fecha: new Date().toISOString().split('T')[0],
    codigo: `F-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0')}`,
    tieneRelevo: tieneRelevo === 'si',
    rolEtapa, // 'principal' | 'relevo'
    ...extra,
  });

  // Guardar (validación ligera)
  const handleGuardar = async () => {
    if (!validarBasico()) {
      enqueue('Al menos completa Conductor y Placa para guardar.', 'warning');
      return;
    }
    try {
      setSaving(true);
      const estados = estadosIniciales();
      if (registroId) {
        const { data } = await axios.put(`${base}/formularios/${registroId}`, buildPayload(estados));
        setGrupoId(data?.grupoId || grupoId);
        enqueue('Formulario actualizado', 'success');
      } else {
        const { data } = await axios.post(`${base}/formularios`, buildPayload(estados));
        setRegistroId(data?.id ?? data?._id ?? null);
        setGrupoId(data?.grupoId || grupoId);
        enqueue('Formulario guardado', 'success');
      }
    } catch {
      enqueue('Error al guardar formulario', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Finalizar (validación completa)
  const handleFinalizar = async () => {
    if (!validarCompleto()) {
      enqueue('Faltan datos obligatorios del preoperacional.', 'warning');
      return;
    }
    try {
      setSaving(true);
      const estados = estadosFinalizar();
      if (registroId) {
        await axios.put(`${base}/formularios/${registroId}`, buildPayload(estados));
      } else {
        const { data } = await axios.post(`${base}/formularios`, buildPayload(estados));
        setRegistroId(data?.id ?? data?._id ?? null);
        setGrupoId(data?.grupoId || grupoId);
      }
      if ((estados as any).banner) enqueue((estados as any).banner, 'info');
      else enqueue('Preoperacional finalizado.', 'success');

      if (tieneRelevo === 'no' || rolEtapa === 'relevo') {
        navigate('/principal');
      }
    } catch {
      enqueue('Error al finalizar', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Autocompletar si rol conductor
  useEffect(() => {
    if (usuario?.rol === 'conductor') {
      axios
        .get(`${base}/perfil/${usuario.username}`)
        .then(({ data }) => {
          setConductor(data?.nombre ?? '');
          setFechaSoat(data?.vigenciaSoat ?? '');
          setFechaTecno(data?.vigenciaTecno ?? '');
        })
        .catch(() => enqueue('Error al cargar el perfil', 'error'));
    }
  }, [usuario]);

  // Render por pasos
  const Paso1 = (
    <>
      <Typography variant={isMobile ? 'h6' : 'h5'} fontWeight={700} color="primary" mb={3}>
        Información general del conductor principal
      </Typography>

      <Grid container spacing={2}>
        {[
          { label: 'Conductor *', value: conductor, set: setConductor, err: errores.conductor },
          { label: 'Placa *', value: placa, set: setPlaca, err: errores.placa },
          { label: 'Proyecto *', value: proyecto, set: setProyecto, err: errores.proyecto },
          { label: 'Ingeniero responsable *', value: responsable, set: setResponsable, err: errores.responsable },
          { label: 'Fecha inicio *', type: 'date', value: fechaInicio, set: setFechaInicio, err: errores.fechaInicio },
          { label: 'Hora inicio *', value: horaInicio, set: setHoraInicio, err: errores.horaInicio },
          { label: 'Kilometraje inicio *', value: kmInicio, set: setKmInicio, err: errores.kmInicio },
          { label: 'Destino *', value: destino, set: setDestino, err: errores.destino },
          { label: 'Vigencia SOAT *', type: 'date', value: fechaSoat, set: setFechaSoat, err: errores.fechaSoat },
          { label: 'Vigencia Tecno *', type: 'date', value: fechaTecno, set: setFechaTecno, err: errores.fechaTecno },
        ].map((f, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Typography fontWeight={600}>{f.label}</Typography>
            <TextField
              fullWidth
              type={f.type ?? 'text'}
              InputLabelProps={f.type === 'date' ? { shrink: true } : undefined}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              error={!!f.err}
              helperText={f.err}
            />
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <SeccionInspeccion
          titulo="Documentos"
          nombreEstado="documentos"
          items={DOCUMENTOS}
          valores={documentos}
          onChange={actualizarGrupo(setDocumentos)}
          errores={errores}
        />
        <SeccionInspeccion
          titulo="Inspección de la carrocería"
          nombreEstado="carroceria"
          items={CARROCERIA}
          valores={carroceria}
          onChange={actualizarGrupo(setCarroceria)}
          errores={errores}
        />
        <SeccionInspeccion
          titulo="Antes de encender el motor"
          nombreEstado="antesEncender"
          items={ANTES_ENCENDER}
          valores={antesEncender}
          onChange={actualizarGrupo(setAntesEncender)}
          errores={errores}
        />
        <SeccionInspeccion
          titulo="Botiquín y herramientas"
          nombreEstado="botiquin"
          items={BOTIQUIN_HERRAMIENTAS}
          valores={botiquin}
          onChange={actualizarGrupo(setBotiquin)}
          errores={errores}
        />
        <SeccionInspeccion
          titulo="Vehículo encendido"
          nombreEstado="vehiculoEncendido"
          items={VEHICULO_ENCENDIDO}
          valores={vehiculoEncendido}
          onChange={actualizarGrupo(setVehiculoEncendido)}
          errores={errores}
        />
      </Box>

      <Box mt={3}>
        <Typography fontWeight={600}>Inspector *</Typography>
        <TextField
          fullWidth
          value={inspector}
          onChange={(e) => setInspector(e.target.value)}
          error={!!errores.inspector}
          helperText={errores.inspector}
        />
      </Box>

      <Box mt={3}>
        <Typography fontWeight={600}>Observaciones</Typography>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />
      </Box>
    </>
  );

  const Paso2 = (
    <>
      <Typography variant="h6" fontWeight={700} mb={1}>
        Resumen
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Verifica que la información esté correcta antes de continuar.
      </Typography>

      <Grid container spacing={2}>
        {[
          ['Conductor', conductor],
          ['Placa', placa],
          ['Proyecto', proyecto],
          ['Responsable', responsable],
          ['Fecha inicio', fechaInicio],
          ['Hora inicio', horaInicio],
          ['KM inicio', kmInicio],
          ['Destino', destino],
        ].map(([k, v]) => (
          <Grid key={k} item xs={12} sm={6} md={4}>
            <Typography fontWeight={600}>{k}</Typography>
            <Typography>{v || '-'}</Typography>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography fontWeight={600} mb={1}>
        (Opcional) Asociar a preoperacional existente
      </Typography>
      <TextField
        fullWidth
        placeholder="Pega aquí el grupoId si esto es un relevo de un viaje ya creado"
        value={grupoId}
        onChange={(e) => setGrupoId(e.target.value)}
      />
    </>
  );

  const Paso3 = (
    <>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Confirmación
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl>
            <FormLabel>¿Tiene relevo?</FormLabel>
            <RadioGroup
              row
              value={tieneRelevo}
              onChange={(e) => setTieneRelevo(e.target.value as 'si' | 'no')}
            >
              <FormControlLabel value="no" control={<Radio />} label="No" />
              <FormControlLabel value="si" control={<Radio />} label="Sí" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {tieneRelevo === 'si' && (
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <FormLabel>Este formulario es del</FormLabel>
              <Select
                size="small"
                value={rolEtapa}
                onChange={(e) => setRolEtapa(e.target.value as 'principal' | 'relevo')}
              >
                <MenuItem value="principal">Principal</MenuItem>
                <MenuItem value="relevo">Relevo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}
      </Grid>

      <Box mt={3} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
        <Button variant="contained" onClick={handleGuardar} disabled={saving}>
          Guardar
        </Button>
        <Button variant="contained" color="secondary" onClick={handleFinalizar} disabled={saving}>
          {finalizarLabel}
        </Button>
        <Button variant="outlined" onClick={() => navigate('/principal')} disabled={saving}>
          Volver
        </Button>
      </Box>
    </>
  );

  const renderStep = () => {
    if (activeStep === 0) return Paso1;
    if (activeStep === 1) return Paso2;
    return Paso3;
  };

  return (
    <PageContainer>
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((l) => (
          <Step key={l}>
            <StepLabel>{l}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box display="flex" justifyContent="center">
        <Card elevation={4} sx={{ width: '100%', maxWidth: 1100, p: { xs: 2, sm: 3 }, borderRadius: 4 }}>
          {renderStep()}

          {/* Navegación de pasos (para 0 y 1) */}
          {activeStep < 2 && (
            <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
              <Button
                variant="outlined"
                onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                disabled={activeStep === 0 || saving}
              >
                Atrás
              </Button>
              <Button
                variant="contained"
                onClick={() => setActiveStep((s) => Math.min(2, s + 1))}
                disabled={saving}
              >
                Siguiente
              </Button>
            </Box>
          )}
        </Card>
      </Box>

      <LoadingBackdrop open={saving} />
    </PageContainer>
  );
};

export default Formulario;
