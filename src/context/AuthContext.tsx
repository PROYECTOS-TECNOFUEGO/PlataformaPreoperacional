import React, { createContext, useContext, useState, useEffect } from 'react';

// Interfaz básica de usuario sin password
interface Usuario {
  username: string;
  rol: 'admin' | 'supervisor' | 'conductor';
}

// Interfaz interna con password
type UsuarioConPassword = Usuario & { password: string };

// Contexto de autenticación
interface AuthContextProps {
  usuario: Usuario | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  usuario: null,
  login: () => false,
  logout: () => {},
});

// Proveedor de contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const usuariosDeEjemplo: UsuarioConPassword[] = [
    { username: 'admin', rol: 'admin', password: '1234' },
    { username: 'supervisor', rol: 'supervisor', password: '1234' },
    { username: 'conductor', rol: 'conductor', password: '1234' },
  ];

  // Restaurar sesión desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) setUsuario(JSON.parse(storedUser));
  }, []);

  // Login simulado
  const login = (username: string, password: string): boolean => {
    const encontrado = usuariosDeEjemplo.find(
      (u) => u.username === username && u.password === password
    );
    if (encontrado) {
      const userData: Usuario = {
        username: encontrado.username,
        rol: encontrado.rol,
      };
      setUsuario(userData);
      localStorage.setItem('usuario', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  // Cerrar sesión
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);
