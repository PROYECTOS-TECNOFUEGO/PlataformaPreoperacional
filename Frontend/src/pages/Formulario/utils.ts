// src/pages/Formulario/utils.ts
import {
  DOCUMENTOS,
  CARROCERIA,
  ANTES_ENCENDER,
  BOTIQUIN_HERRAMIENTAS,
  VEHICULO_ENCENDIDO,
} from './constants.ts';
import type { FormularioDraft, Errors } from './types.ts'
const required = (v: string) => v != null && String(v).trim() !== '';

export function validateDraft(draft: FormularioDraft) {
  const errors: Errors = {};

  if (!required(draft.conductor)) errors.conductor = 'Campo requerido';
  if (!required(draft.placa)) errors.placa = 'Campo requerido';
  if (!required(draft.proyecto)) errors.proyecto = 'Campo requerido';
  if (!required(draft.responsable)) errors.responsable = 'Campo requerido';
  if (!required(draft.fechaInicio)) errors.fechaInicio = 'Campo requerido';
  if (!required(draft.horaInicio)) errors.horaInicio = 'Campo requerido';
  if (!required(draft.kmInicio)) errors.kmInicio = 'Campo requerido';
  if (!required(draft.destino)) errors.destino = 'Campo requerido';
  if (!required(draft.fechaSoat)) errors.fechaSoat = 'Campo requerido';
  if (!required(draft.fechaTecno)) errors.fechaTecno = 'Campo requerido';
  if (!required(draft.inspector)) errors.inspector = 'Campo requerido';

  const checkGroup = (name: string, items: string[], values: Record<string, string>) => {
    items.forEach((i) => {
      if (!values[i]) errors[`${name}.${i}`] = 'Seleccione';
    });
  };

  checkGroup('documentos', DOCUMENTOS, draft.documentos);
  checkGroup('carroceria', CARROCERIA, draft.carroceria);
  checkGroup('antesEncender', ANTES_ENCENDER, draft.antesEncender);
  checkGroup('botiquin', BOTIQUIN_HERRAMIENTAS, draft.botiquin);
  checkGroup('vehiculoEncendido', VEHICULO_ENCENDIDO, draft.vehiculoEncendido);

  return { valid: Object.keys(errors).length === 0, errors };
}

export function buildPayload(draft: FormularioDraft, username?: string) {
  const today = new Date().toISOString().split('T')[0];
  const codigo = `F-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  return { ...draft, usuario: username ?? 'anon', fecha: today, codigo };
}
