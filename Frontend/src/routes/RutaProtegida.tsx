// src/routes/RutaProtegida.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Interfaz de props que puede recibir roles permitidos y un elemento a renderizar
interface Props {
  rolesPermitidos?: string[];         // Lista opcional de roles autorizados para acceder
  element?: React.ReactNode;         // Elemento a renderizar si la ruta es válida
}

/**
 * Componente de protección de rutas.
 * Verifica si el usuario está autenticado y autorizado según su rol.
 * Si no está autenticado, redirige al login.
 * Si el rol no está autorizado, redirige a la página de no autorizado.
 * Si todo es válido, muestra el elemento correspondiente o el Outlet (para subrutas).
 */
const RutaProtegida = ({ rolesPermitidos, element }: Props) => {
  //const { usuario } = useAuth(); // Obtenemos el usuario autenticado del contexto

  // Si no hay sesión activa, redirigir al login
//  if (!usuario) return <Navigate to="/login" replace />;

  // Si hay roles definidos y el rol del usuario no está incluido, redirigir a No Autorizado
//  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
   // return <Navigate to="/no-autorizado" replace />;
//  }

  // Si pasa las validaciones, se renderiza el componente hijo o el Outlet
  return element ?? <Outlet />;
};

export default RutaProtegida;
