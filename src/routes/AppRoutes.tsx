// src/routes/AppRoutes.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Componentes generales del layout y las páginas
import Layout from '../components/Layout/Layout';
import Dashboard from '../pages/Dashboard/Dashboard';
import Formulario from '../pages/Formulario/Formulario';
import Reportes from '../pages/Reportes/Reportes';
import Usuarios from '../pages/Usuarios/Usuarios';
import Vehiculos from '../pages/Vehiculos/Vehiculos';
import Principal from '../pages/Principal/Principal';
import Configuracion from '../pages/Configuracion/Configuracion';
import Login from '../pages/Login/Login';
import NoAutorizado from '../pages/NoAutorizado';
import RutaProtegida from './RutaProtegida'; // Componente para proteger rutas según el rol

/**
 * Componente principal que define las rutas de la aplicación.
 * Utiliza <RutaProtegida /> para restringir el acceso a ciertas rutas según el rol del usuario.
 */
export const AppRoutes = () => (
  <Routes>
    {/* Ruta pública para inicio de sesión */}
    <Route path="/login" element={<Login />} />

    {/* Ruta pública que se muestra cuando el usuario no tiene permisos */}
    <Route path="/no-autorizado" element={<NoAutorizado />} />

    {/* Rutas protegidas que requieren autenticación */}
    <Route path="/" element={<RutaProtegida element={<Layout />} />}>
      
      {/* Redirección automática a /dashboard cuando se accede a "/" */}
      <Route index element={<Navigate to="dashboard" />} />

      {/* Rutas disponibles por rol */}
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="principal" element={<Principal />} />
      <Route path="formulario" element={<Formulario />} />

      {/* Reportes accesible solo por admin y supervisor */}
      <Route
        path="reportes"
        element={
          <RutaProtegida rolesPermitidos={['admin', 'supervisor']} element={<Reportes />} />
        }
      />

      {/* Usuarios accesible solo por admin y supervisor */}
      <Route
        path="usuarios"
        element={
          <RutaProtegida rolesPermitidos={['admin', 'supervisor']} element={<Usuarios />} />
        }
      />

      {/* Vehículos (no restringido en esta versión, si se desea se puede proteger igual que usuarios) */}
      <Route path="vehiculos" element={<Vehiculos />} />

      {/* Configuración (libre o puede agregarse protección si se requiere) */}
      <Route path="configuracion" element={<Configuracion />} />
    </Route>

    {/* Ruta comodín que redirige a dashboard si la URL no existe */}
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);
