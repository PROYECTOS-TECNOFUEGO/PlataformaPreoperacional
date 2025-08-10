// src/App.tsx

import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './routes/AppRoutes';

/**
 * Componente principal de la aplicación.
 * Encapsula el sistema de rutas dentro de un Router.
 * Define la estructura de navegación utilizando <AppRoutes />.
 */
function App() {
  return (
    <Router>
      {/* Se gestionan todas las rutas de la aplicación desde este componente */}
      <AppRoutes />
    </Router>
  );
}

export default App;
