import React, { useState, useMemo, useEffect } from 'react';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Card,
  Typography,
  InputBase,
  Divider,
  Icon,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import PageContainer from '../../components/Common/PageContainer';

interface UserItem {
  username: string;
  password: string;
  rol: 'admin' | 'conductor' | 'supervisor' | string;
}

const UsuariosPage: React.FC = () => {
  const [usuarios, setUsuarios] = useState<UserItem[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<UserItem>({ username: '', password: '', rol: 'conductor' });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 🔄 Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    axios.get('http://localhost:3000/api/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Error al cargar usuarios:', err));
  };

  // 🧠 Filtrar usuarios por búsqueda
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(busqueda.toLowerCase()) ||
        u.rol.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [busqueda, usuarios]);

  // ➕ Abrir modal para crear usuario
  const abrirModalCrear = () => {
    setUsuarioActual({ username: '', password: '', rol: 'conductor' });
    setModoEdicion(false);
    setModalAbierto(true);
  };

  // 📝 Abrir modal para editar usuario
  const abrirModalEditar = (usuario: UserItem) => {
    setUsuarioActual(usuario);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  // 💾 Guardar (crear o editar)
  const guardarUsuario = () => {
    if (modoEdicion) {
      axios.put(`http://localhost:3000/api/usuarios/${usuarioActual.username}`, usuarioActual)
        .then(() => {
          setModalAbierto(false);
          cargarUsuarios();
        });
    } else {
      axios.post('http://localhost:3000/api/usuarios', usuarioActual)
        .then(() => {
          setModalAbierto(false);
          cargarUsuarios();
        });
    }
  };

  // 🗑️ Eliminar
  const eliminarUsuario = (username: string) => {
    if (confirm(`¿Seguro que deseas eliminar a ${username}?`)) {
      axios.delete(`http://localhost:3000/api/usuarios/${username}`)
        .then(() => cargarUsuarios());
    }
  };

  return (
    <PageContainer>
      <Box display="flex" justifyContent="center" width="100%">
        <Card sx={{ width: '100%', maxWidth: 960, p: isMobile ? 2 : 4, borderRadius: 3, boxShadow: 4 }}>
          {/* 🔍 Encabezado y búsqueda */}
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems={isMobile ? 'flex-start' : 'center'}
            mb={2}
            gap={2}
          >
            <Typography variant="h6" fontWeight="bold">Usuarios</Typography>
            <Box display="flex" gap={1} width={isMobile ? '100%' : 'auto'}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  pl: 1,
                  width: isMobile ? '100%' : 280,
                  height: 36,
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Icon sx={{ fontSize: 20, color: '#666' }}>search</Icon>
                <InputBase
                  placeholder="Buscar por usuario o rol"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  sx={{ ml: 1, flex: 1, fontSize: 14 }}
                />
              </Box>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Icon>add</Icon>}
                onClick={abrirModalCrear}
              >
                Agregar
              </Button>
            </Box>
          </Box>

          {/* 👥 Lista de usuarios */}
          <Box sx={{ border: '1px solid #eee', borderRadius: 2, maxHeight: '50vh', overflowY: 'auto', px: 2, py: 1 }}>
            {usuariosFiltrados.length === 0 ? (
              <Typography color="text.secondary">No se encontraron usuarios.</Typography>
            ) : (
              usuariosFiltrados.map((usuario, idx) => (
                <Box key={usuario.username}>
                  <Box
                    display="flex"
                    flexDirection={isMobile ? 'column' : 'row'}
                    justifyContent="space-between"
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    py={1.5}
                    gap={1.5}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Icon sx={{ color: '#555' }}>person</Icon>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="500">{usuario.username}</Typography>
                        <Typography variant="body2" color="text.secondary">Rol: {usuario.rol}</Typography>
                      </Box>
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton onClick={() => abrirModalEditar(usuario)}><Icon>edit</Icon></IconButton>
                      <IconButton onClick={() => eliminarUsuario(usuario.username)}><Icon color="error">delete</Icon></IconButton>
                    </Box>
                  </Box>
                  {idx !== usuariosFiltrados.length - 1 && <Divider sx={{ ml: 5 }} />}
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>

      {/* 🪟 Modal */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth>
        <DialogTitle>{modoEdicion ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Usuario"
            fullWidth
            value={usuarioActual.username}
            disabled={modoEdicion}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, username: e.target.value })}
          />
          <TextField
            label="Contraseña"
            fullWidth
            type="password"
            value={usuarioActual.password}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, password: e.target.value })}
          />
          <InputLabel id="rol-label">Rol</InputLabel>
  <Select
    labelId="rol-label"
    value={usuarioActual.rol}
    label="Rol"
    onChange={(e) => setUsuarioActual({ ...usuarioActual, rol: e.target.value })}
  >
    <MenuItem value="conductor">Conductor</MenuItem>
    <MenuItem value="supervisor">Supervisor</MenuItem>
  </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button onClick={guardarUsuario} variant="contained" color="primary">
            {modoEdicion ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default UsuariosPage;
