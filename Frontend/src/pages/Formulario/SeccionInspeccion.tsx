import type { FC } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Radio,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { OPCIONES } from './constants';
import type { SectionValues, RadioValue } from './types';

type Props = {
  titulo: string;
  nombreEstado: string;
  items: string[];
  valores: SectionValues;
  onChange: (item: string, value: RadioValue) => void;
  errores: Record<string, string>;
};

const SeccionInspeccion: FC<Props> = ({
  titulo,
  nombreEstado,
  items,
  valores,
  onChange,
  errores,
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
              {OPCIONES.map((op: typeof OPCIONES[number]) => (
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
                {OPCIONES.map((op: typeof OPCIONES[number]) => (
                  <TableCell key={op.value} align="center">
                    <Radio
                      color="primary"
                      checked={valores[item] === op.value}
                      onChange={() => onChange(item, op.value)}
                      inputProps={{ 'aria-label': `${item}: ${op.label}` }}
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {items.some((i) => errores[`${nombreEstado}.${i}`]) && (
        <Typography color="error.main" fontSize="0.9rem" mt={1}>
          Todos los ítems deben estar seleccionados
        </Typography>
      )}
    </AccordionDetails>
  </Accordion>
);

export default SeccionInspeccion;
