// src/services/perfilService.tsx

import axios from 'axios';

const API_URL = 'http://localhost:3000/api/perfil';

export const getPerfilConductor = async (username: string) => {
  const res = await axios.get(`${API_URL}/${username}`);
  return res.data;
};
