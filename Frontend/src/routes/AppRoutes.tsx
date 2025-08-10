import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes generales
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Formulario from '../pages/Formulario/Formulario';
import Reportes from '../pages/Reportes/Reportes';
import Usuarios from '../pages/Usuarios/Usuarios';
import Vehiculos from '../pages/Vehiculos/Vehiculos';
import Principal from '../pages/Principal/Principal';
import Configuracion from '../pages/Configuracion/Configuracion';
// import Login from '../pages/Login/Login';
// import NoAutorizado from '../pages/NoAutorizado';
// import RutaProtegida from './RutaProtegida';

// Nuevas páginas de formulario
import FormularioVerPage from '../pages/Formulario/FormularioVerPage';
import FormularioEditarPage from '../pages/Formulario/FormularioEditarPage';

export const AppRoutes = () => (
  <Routes>
    {/* 🔒 Desactivado temporalmente para dejar todo público */}
    {/* <Route path="/login" element={<Login />} />
    <Route path="/no-autorizado" element={<NoAutorizado />} /> */}

    {/* ✅ Rutas públicas dentro del Layout */}
    <Route path="/" element={<Layout />}>
      {/* Landing sin login */}
      <Route index element={<Navigate to="principal" replace />} />

      <Route path="dashboard" element={<Dashboard />} />
      <Route path="principal" element={<Principal />} />
      <Route path="formulario" element={<Formulario />} />
      <Route path="ver/:id" element={<FormularioVerPage />} />
      <Route path="editar/:id" element={<FormularioEditarPage />} />
      {/* Antes estaban protegidas por rol; ahora públicas */}
      <Route path="reportes" element={<Reportes />} />
      <Route path="usuarios" element={<Usuarios />} />
      <Route path="vehiculos" element={<Vehiculos />} />
      <Route path="configuracion" element={<Configuracion />} />
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/principal" replace />} />
  </Routes>
);
