/* -------------------------------------------------------------------------- *
 *  src/pages/Formulario/FormularioPage.tsx
 *  Formulario de inspección pre-operacional de vehículos
 *  -------------------------------------------------------------------------
 *  • Paso 1 de un proceso multi-step (Datos → Relevo → Confirmación)
 *  • Guarda la información vía POST   /api/formularios
 *  • Autorrellena ciertos campos si el rol es "conductor" (perfil propio)
 * -------------------------------------------------------------------------- */

import React, { useState, useEffect } from 'react';
import {
  Box, Card, Typography, TextField, Radio, Button,
  Table, TableBody, TableCell, TableRow, TableHead, TableContainer,
  Grid, Accordion, AccordionSummary, AccordionDetails,
  Stepper, Step, StepLabel,
  useTheme, useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PageContainer  from '../../components/Common/PageContainer';
import { useNavigate } from 'react-router-dom';
import axios         from 'axios';
import { useAuth }   from '../../context/AuthContext';

/* -------------------------------------------------------------------------- */
/*  Catálogos de ítems a inspeccionar                                          */
/* -------------------------------------------------------------------------- */
const DOCUMENTOS = [
  'Tarjeta de propiedad', 'SOAT', 'Tecno Mecánica',
  'Tarjeta/Chip suministro combustible', 'Tag Flypass',
];

const CARROCERIA = [
  'Cadena eje cardan disponible y en buen estado', 'Barra antivuelco',
  /* …resto… */ 'Indicadores de tuerca y/o tuercas ajustadas',
];

const ANTES_ENCENDER = [
  'Aseo cabina', 'Testigos apagados (Aceite, motor, airbags)',
  /* …resto… */ 'Freno de parqueo operativo',
];

const BOTIQUIN_HERRAMIENTAS = [
  'Botiquín con: Antisépticos, elemento de corte, algodón, gasa estéril, esparadrapo, vendas adhesivas, venda elástica, jabón',
  /* …resto… */ 'Linterna',
];

const VEHICULO_ENCENDIDO = [
  'Nivel de combustible suficiente', 'Sistema de tracción 4x4',
  /* …resto… */ 'Aire acondicionado operativo',
];

/** Opciones de radio para cada ítem de inspección */
const OPCIONES = [
  { label: 'Cumple',   value: 'cumple'   },
  { label: 'No cumple', value: 'noCumple'},
  { label: 'No aplica', value: 'noAplica'},
] as const;

/* -------------------------------------------------------------------------- */
/*  Sección reutilizable de inspección con Accordion + Tabla                   */
/* -------------------------------------------------------------------------- */
interface SeccionInspeccionProps {
  titulo:       string;
  nombreEstado: string;
  items:        string[];
  valores:      Record<string, string>;
  onChange:     (item: string, value: string) => void;
  errores:      Record<string, string>;
}

/** Renderiza una lista de ítems con radios “Cumple / No cumple / No aplica” */
const SeccionInspeccion: React.FC<SeccionInspeccionProps> = ({
  titulo, nombreEstado, items, valores, onChange, errores,
}) => (
  <Accordion defaultExpanded disableGutters sx={{ mb: 2 }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography fontWeight={600}>{titulo} *</Typography>
    </AccordionSummary>

    <AccordionDetails sx={{ pt: 0 }}>
      <TableContainer>
        <Table size="small" sx={{ minWidth: 520 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Ítem</TableCell>
              {OPCIONES.map((op) => (
                <TableCell key={op.value} align="center" sx={{ fontWeight: 600 }}>
                  {op.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item} hover>
                <TableCell sx={{ width: '40%', fontWeight: 500 }}>{item}</TableCell>
                {OPCIONES.map((op) => (
                  <TableCell key={op.value} align="center">
                    <Radio
                      color="primary"
                      checked={valores[item] === op.value}
                      onChange={() => onChange(item, op.value)}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Validación a nivel de grupo */}
      {items.some((i) => errores[`${nombreEstado}.${i}`]) && (
        <Typography color="error.main" fontSize="0.9rem" mt={1}>
          Todos los ítems deben estar seleccionados
        </Typography>
      )}
    </AccordionDetails>
  </Accordion>
);

/* -------------------------------------------------------------------------- */
/*                          Página principal del formulario                    */
/* -------------------------------------------------------------------------- */
const FormularioPage: React.FC = () => {
  /* ---------- Hooks de utilidades ---------- */
  const theme     = useTheme();
  const isMobile  = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate  = useNavigate();
  const { usuario } = useAuth();         // Para autocompletar si es conductor

  /* ---------- Estados de datos básicos ---------- */
  const [conductor,     setConductor]   = useState('');
  const [placa,         setPlaca]       = useState('');
  const [proyecto,      setProyecto]    = useState('');
  const [responsable,   setResponsable] = useState('');
  const [fechaInicio,   setFechaInicio] = useState('');
  const [horaInicio,    setHoraInicio]  = useState('');
  const [kmInicio,      setKmInicio]    = useState('');
  const [destino,       setDestino]     = useState('');
  const [fechaSoat,     setFechaSoat]   = useState('');
  const [fechaTecno,    setFechaTecno]  = useState('');
  const [inspector,     setInspector]   = useState('');
  const [observaciones, setObservaciones] = useState('');

  /* ---------- Estados de inspección (grupos) ---------- */
  const [documentos,        setDocumentos]        = useState<Record<string,string>>({});
  const [carroceria,        setCarroceria]        = useState<Record<string,string>>({});
  const [antesEncender,     setAntesEncender]     = useState<Record<string,string>>({});
  const [botiquin,          setBotiquin]          = useState<Record<string,string>>({});
  const [vehiculoEncendido, setVehiculoEncendido] = useState<Record<string,string>>({});

  /* ---------- Estado de errores ---------- */
  const [errores, setErrores] = useState<Record<string,string>>({});

  /* ---------- Helpers genéricos ---------- */
  /** Devuelve una función que actualiza un grupo de radios (spread). */
  const actualizarGrupo =
    (setter: React.Dispatch<React.SetStateAction<Record<string,string>>>) =>
    (item: string, value: string) =>
      setter((prev) => ({ ...prev, [item]: value }));

  /** Valida campos obligatorios y grupos; devuelve TRUE si todo ok */
  const validar = (): boolean => {
    const err: Record<string,string> = {};

    // Campos de texto / fecha obligatorios
    if (!conductor.trim())   err.conductor   = 'Campo requerido';
    if (!placa.trim())       err.placa       = 'Campo requerido';
    if (!proyecto.trim())    err.proyecto    = 'Campo requerido';
    if (!responsable.trim()) err.responsable = 'Campo requerido';
    if (!destino.trim())     err.destino     = 'Campo requerido';
    if (!fechaInicio)        err.fechaInicio = 'Campo requerido';
    if (!horaInicio)         err.horaInicio  = 'Campo requerido';
    if (!kmInicio.trim())    err.kmInicio    = 'Campo requerido';
    if (!fechaSoat)          err.fechaSoat   = 'Campo requerido';
    if (!fechaTecno)         err.fechaTecno  = 'Campo requerido';
    if (!inspector.trim())   err.inspector   = 'Campo requerido';

    // Helper local para radios
    const validarGrupo = (
      nombre: string,
      items: string[],
      valores: Record<string,string>,
    ) => items.forEach((i) => {
      if (!valores[i]) err[`${nombre}.${i}`] = 'Seleccione';
    });

    validarGrupo('documentos',        DOCUMENTOS,        documentos);
    validarGrupo('carroceria',        CARROCERIA,        carroceria);
    validarGrupo('antesEncender',     ANTES_ENCENDER,    antesEncender);
    validarGrupo('botiquin',          BOTIQUIN_HERRAMIENTAS, botiquin);
    validarGrupo('vehiculoEncendido', VEHICULO_ENCENDIDO, vehiculoEncendido);

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  /* ---------- Envío de formulario ---------- */
  const handleSubmit = async () => {
    if (!validar()) return;

    const payload = {
      conductor, placa, proyecto, responsable,
      fechaInicio, horaInicio, kmInicio, destino,
      fechaSoat, fechaTecno, inspector, observaciones,
      documentos, carroceria, antesEncender, botiquin, vehiculoEncendido,
      usuario: usuario?.username ?? 'anon',                 // quién lo creó
      fecha:   new Date().toISOString().split('T')[0],      // AAAA-MM-DD
      codigo:  `F-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`,
    };

    try {
      await axios.post('http://localhost:3000/api/formularios', payload);
      navigate('/principal');
    } catch {
      alert('Error al guardar formulario');
    }
  };

  /* ---------- Autocompletar conductor (si rol === 'conductor') ---------- */
  useEffect(() => {
    if (usuario?.rol === 'conductor') {
      axios.get(`http://localhost:3000/api/perfil/${usuario.username}`)
        .then(({ data }) => {
          setConductor (data.nombre       ?? '');
         
          setFechaSoat (data.vigenciaSoat ?? '');
          setFechaTecno(data.vigenciaTecno?? '');
        })
        .catch((err) => console.error('Error cargando perfil:', err));
    }
  }, [usuario]);

  /* ---------------------------------------------------------------------- *
   *  Render (Stepper + Card con formulario + botones)                      *
   * ---------------------------------------------------------------------- */
  return (
    <PageContainer>
      {/* Paso 1 de 3 */}
      <Stepper activeStep={0} alternativeLabel sx={{ mb: 3 }}>
        {['Datos', 'Relevo', 'Confirmación'].map((l) => (
          <Step key={l}><StepLabel>{l}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Card centrado */}
      <Box display="flex" justifyContent="center">
        <Card elevation={4}
          sx={{ width:'100%', maxWidth:1100, p:{xs:2,sm:3}, borderRadius:4 }}
        >
          {/* ---------- Datos básicos ---------- */}
          <Typography
            variant={isMobile ? 'h6':'h5'}
            fontWeight={700}
            color="primary"
            mb={3}
          >
            Información general del conductor principal
          </Typography>

          {/* Render dinámico de campos (evita repetición) */}
          <Grid container spacing={2}>
            {[
              { label:'Conductor *',               value:conductor,   set:setConductor,   err:errores.conductor },
              { label:'Placa *',                   value:placa,       set:setPlaca,       err:errores.placa },
              { label:'Proyecto *',                value:proyecto,    set:setProyecto,    err:errores.proyecto },
              { label:'Ingeniero responsable *',   value:responsable, set:setResponsable, err:errores.responsable },
              { label:'Fecha inicio *', type:'date', value:fechaInicio, set:setFechaInicio, err:errores.fechaInicio },
              { label:'Hora inicio *',             value:horaInicio,  set:setHoraInicio,  err:errores.horaInicio },
              { label:'Kilometraje inicio *',      value:kmInicio,    set:setKmInicio,    err:errores.kmInicio },
              { label:'Destino *',                value:destino,     set:setDestino,     err:errores.destino },
              { label:'Vigencia SOAT *', type:'date', value:fechaSoat,set:setFechaSoat,   err:errores.fechaSoat },
              { label:'Vigencia Tecnomecánica *', type:'date', value:fechaTecno, set:setFechaTecno, err:errores.fechaTecno },
            ].map((f, i) => (
              <Grid item xs={12} md={6} key={i}>
                <Typography fontWeight={600}>{f.label}</Typography>
                <TextField
                  fullWidth
                  type={f.type ?? 'text'}
                  InputLabelProps={f.type === 'date' ? { shrink:true }:undefined}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  error={!!f.err}
                  helperText={f.err}
                />
              </Grid>
            ))}
          </Grid>

          {/* ---------- Secciones de inspección ---------- */}
          <Box mt={4}>
            <SeccionInspeccion titulo="Documentos"               nombreEstado="documentos"        items={DOCUMENTOS}        valores={documentos}        onChange={actualizarGrupo(setDocumentos)}        errores={errores} />
            <SeccionInspeccion titulo="Inspección de la carrocería" nombreEstado="carroceria"        items={CARROCERIA}        valores={carroceria}        onChange={actualizarGrupo(setCarroceria)}        errores={errores} />
            <SeccionInspeccion titulo="Antes de encender el motor"  nombreEstado="antesEncender"     items={ANTES_ENCENDER}    valores={antesEncender}     onChange={actualizarGrupo(setAntesEncender)}     errores={errores} />
            <SeccionInspeccion titulo="Botiquín y herramientas"     nombreEstado="botiquin"          items={BOTIQUIN_HERRAMIENTAS} valores={botiquin}          onChange={actualizarGrupo(setBotiquin)}          errores={errores} />
            <SeccionInspeccion titulo="Vehículo encendido"         nombreEstado="vehiculoEncendido" items={VEHICULO_ENCENDIDO} valores={vehiculoEncendido} onChange={actualizarGrupo(setVehiculoEncendido)} errores={errores} />
          </Box>

          {/* ---------- Inspector + Observaciones ---------- */}
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
              fullWidth multiline minRows={3}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </Box>

          {/* ---------- Botones ---------- */}
          <Box mt={4} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
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
