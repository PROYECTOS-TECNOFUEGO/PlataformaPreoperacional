export type RadioValue = 'cumple' | 'noCumple' | 'noAplica';
export type SectionValues = Record<string, RadioValue>;

export type FormularioDraft = {
  conductor: string;
  placa: string;
  proyecto: string;
  responsable: string;
  fechaInicio: string;
  horaInicio: string;
  kmInicio: string;
  destino: string;
  fechaSoat: string;
  fechaTecno: string;
  inspector: string;
  observaciones: string;

  documentos: SectionValues;
  carroceria: SectionValues;
  antesEncender: SectionValues;
  botiquin: SectionValues;
  vehiculoEncendido: SectionValues;
};

export type Errors = Record<string, string>;
