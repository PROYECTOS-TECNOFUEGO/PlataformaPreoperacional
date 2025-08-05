import axios from 'axios';

const API_URL = 'http://localhost:3000/api/formularios';

export const guardarFormulario = async (data: any) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const obtenerFormularios = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};
