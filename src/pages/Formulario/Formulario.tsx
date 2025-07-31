import React, { useMemo, useState } from 'react';
import {
  Box,
  Card,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  FormControl,
  FormLabel,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PageContainer from '../../components/Common/PageContainer';
import { useNavigate } from 'react-router-dom'; // 👈 Importa useNavigate

const CHECK_LABELS = [
  'Revisión de luces',
  'Estado de llantas',
  'Documentación vigente',
];

type CheckValue = 'cumple' | 'noCumple' | '';

const FormularioPage: React.FC = () => {
  const initialChecks = useMemo<CheckValue[]>(
    () => CHECK_LABELS.map(() => ''),
    []
  );

  const [conductor, setConductor] = useState('');
  const [vehiculo, setVehiculo] = useState('');
  const [checks, setChecks] = useState<CheckValue[]>(initialChecks);
  const [errores, setErrores] = useState<{ [key: string]: string }>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const navigate = useNavigate(); // 👈 Inicializa el hook

  const validar = () => {
    const nuevosErrores: { [key: string]: string } = {};
    if (!conductor.trim()) nuevosErrores.conductor = 'Ingrese los datos del conductor';
    if (!vehiculo.trim()) nuevosErrores.vehiculo = 'Ingrese los datos del vehículo';
    checks.forEach((valor, idx) => {
      if (!valor) nuevosErrores[`check_${idx}`] = 'Seleccione una opción';
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    console.log({ conductor, vehiculo, checks });
    alert('Formulario guardado (mock)');
  };

  const handleCheckChange = (index: number, value: CheckValue) => {
    const nuevos = [...checks];
    nuevos[index] = value;
    setChecks(nuevos);
  };

  return (
    <PageContainer>
      <Box display="flex" justifyContent="center">
        <Card
          sx={{
            width: '100%',
            maxWidth: 720,
            p: isMobile ? 2 : 4,
            borderRadius: 3,
            boxShadow: 4,
          }}
        >
          <Typography variant="h6" fontWeight="bold" textAlign="center" mb={3}>
            Formulario Preoperacional
          </Typography>

          {/* Datos conductor */}
          <Box mb={2}>
            <TextField
              label="Datos del Conductor"
              multiline
              minRows={3}
              fullWidth
              value={conductor}
              onChange={(e) => setConductor(e.target.value)}
              error={!!errores.conductor}
              helperText={errores.conductor}
            />
          </Box>

          {/* Datos vehículo */}
          <Box mb={3}>
            <TextField
              label="Datos del Vehículo"
              multiline
              minRows={3}
              fullWidth
              value={vehiculo}
              onChange={(e) => setVehiculo(e.target.value)}
              error={!!errores.vehiculo}
              helperText={errores.vehiculo}
            />
          </Box>

          {/* Controles */}
          {CHECK_LABELS.map((label, index) => (
            <Box mb={2} key={index}>
              <FormControl component="fieldset" error={!!errores[`check_${index}`]} fullWidth>
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup
                  row
                  value={checks[index]}
                  onChange={(e) => handleCheckChange(index, e.target.value as CheckValue)}
                >
                  <FormControlLabel value="cumple" control={<Radio />} label="Cumple" />
                  <FormControlLabel value="noCumple" control={<Radio />} label="No cumple" />
                </RadioGroup>
                {errores[`check_${index}`] && (
                  <Typography color="error" variant="caption">
                    {errores[`check_${index}`]}
                  </Typography>
                )}
              </FormControl>
            </Box>
          ))}

          {/* Botones */}
          <Box display="flex" justifyContent="center" mt={4} gap={2} flexWrap="wrap">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Guardar
            </Button>
            <Button variant="outlined" onClick={() => alert('Formulario enviado (prueba)')}>
              Enviar
            </Button>
            <Button variant="text" color="primary" onClick={() => navigate('/principal')}>
              Volver
            </Button>
          </Box>
        </Card>
      </Box>
    </PageContainer>
  );
};

export default FormularioPage;
