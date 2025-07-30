// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/Layout';

import Dashboard from '../pages/Dashboard/Dashboard';
import Formulario from '../pages/Formulario/Formulario';
import Reportes from '../pages/Reportes/Reportes';
import Usuarios from '../pages/Usuarios/Usuarios';
import Vehiculos from '../pages/Vehiculos/Vehiculos';
import Principal from '../pages/Principal/Principal.tsx';
import Configuracion from '../pages/Configuracion/Configuracion';
export const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/Principal" element={<Principal />} />
      <Route path="/formulario" element={<Formulario />} />
      <Route path="/reportes" element={<Reportes />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/vehiculos" element={<Vehiculos />} />
      <Route path="/configuracion" element={<Configuracion />} />
    </Routes>
  </Layout>
);
