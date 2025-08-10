// src/pages/Usuarios/Usuarios.tsx
import { useState, useMemo, useEffect } from 'react';
import type { FC } from 'react';
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Box,
  Card,
  Typography,
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import axios from 'axios';
import PageContainer from '../../components/Common/PageContainer';
import PageHeader from '../../components/Common/PageHeader';
import EmptyState from '../../components/Common/EmptyState';
import LoadingBackdrop from '../../components/Feedback/LoadingBackdrop';
import { useSnackbar } from '../../components/Feedback/SnackbarProvider';

interface UserItem {
  username: string;
  password: string;
  rol: 'admin' | 'conductor' | 'supervisor' | string;
}

const UsuariosPage: FC = () => {
  const [usuarios, setUsuarios] = useState<UserItem[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState<UserItem>({
    username: '',
    password: '',
    rol: 'conductor',
  });

  const [loading, setLoading] = useState(false);
  const { enqueue } = useSnackbar();
  const base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    cargarUsuarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarUsuarios = () => {
    setLoading(true);
    axios
      .get(`${base}/usuarios`)
      .then((res) => setUsuarios(res.data))
      .catch(() => enqueue('No se pudieron cargar los usuarios', 'error'))
      .finally(() => setLoading(false));
  };

  const usuariosFiltrados = useMemo(() => {
    const term = busqueda.toLowerCase();
    return usuarios.filter(
      (u) =>
        u.username.toLowerCase().includes(term) ||
        u.rol.toLowerCase().includes(term)
    );
  }, [busqueda, usuarios]);

  const abrirModalCrear = () => {
    setUsuarioActual({ username: '', password: '', rol: 'conductor' });
    setModoEdicion(false);
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario: UserItem) => {
    setUsuarioActual(usuario);
    setModoEdicion(true);
    setModalAbierto(true);
  };

  const guardarUsuario = () => {
    setLoading(true);
    const req = modoEdicion
      ? axios.put(`${base}/usuarios/${usuarioActual.username}`, usuarioActual)
      : axios.post(`${base}/usuarios`, usuarioActual);

    req
      .then(() => {
        enqueue(modoEdicion ? 'Usuario actualizado' : 'Usuario creado', 'success');
        setModalAbierto(false);
        cargarUsuarios();
      })
      .catch(() => enqueue('Error al guardar usuario', 'error'))
      .finally(() => setLoading(false));
  };

  const eliminarUsuario = (username: string) => {
    if (!confirm(`¿Seguro que deseas eliminar a ${username}?`)) return;
    setLoading(true);
    axios
      .delete(`${base}/usuarios/${username}`)
      .then(() => {
        enqueue('Usuario eliminado', 'success');
        cargarUsuarios();
      })
      .catch(() => enqueue('Error al eliminar usuario', 'error'))
      .finally(() => setLoading(false));
  };

  return (
    <PageContainer>
      <PageHeader
        title="Usuarios"
        actions={
          <>
            <TextField
              placeholder="Buscar por usuario o rol"
              size="small"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Icon>search</Icon>
                  </InputAdornment>
                ),
                'aria-label': 'Buscar usuarios',
              }}
              sx={{ width: { xs: '100%', sm: 280 } }}
            />
            <Button onClick={abrirModalCrear} startIcon={<Icon>add</Icon>}>
              Agregar
            </Button>
          </>
        }
      />

      <Card sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <Box
          sx={{
            border: '1px solid #eee',
            borderRadius: 2,
            maxHeight: '50vh',
            overflowY: 'auto',
            px: 2,
            py: 1,
          }}
        >
          {usuariosFiltrados.length === 0 ? (
            <EmptyState text="No se encontraron usuarios." />
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
                      <Typography variant="subtitle1" fontWeight={500}>
                        {usuario.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rol: {usuario.rol}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={1}>
                    <IconButton
                      aria-label={`Editar ${usuario.username}`}
                      onClick={() => abrirModalEditar(usuario)}
                    >
                      <Icon>edit</Icon>
                    </IconButton>
                    <IconButton
                      aria-label={`Eliminar ${usuario.username}`}
                      onClick={() => eliminarUsuario(usuario.username)}
                    >
                      <Icon color="error">delete</Icon>
                    </IconButton>
                  </Box>
                </Box>
                {idx !== usuariosFiltrados.length - 1 && <Divider sx={{ ml: 5 }} />}
              </Box>
            ))
          )}
        </Box>
      </Card>

      {/* Modal */}
      <Dialog open={modalAbierto} onClose={() => setModalAbierto(false)} fullWidth>
        <DialogTitle>{modoEdicion ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Usuario"
            fullWidth
            value={usuarioActual.username}
            disabled={modoEdicion}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, username: e.target.value })}
            inputProps={{ maxLength: 50 }}
          />
          <TextField
            label="Contraseña"
            fullWidth
            type="password"
            value={usuarioActual.password}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, password: e.target.value })}
            autoComplete="new-password"
          />
          <FormControl fullWidth>
            <InputLabel id="rol-label">Rol</InputLabel>
            <Select
              labelId="rol-label"
              label="Rol"
              value={usuarioActual.rol}
              onChange={(e) =>
                setUsuarioActual({ ...usuarioActual, rol: String(e.target.value) })
              }
            >
              {/* Si NO quieres asignar admin desde aquí, quita esta opción */}
              <MenuItem value="admin">Administrador</MenuItem>
              <MenuItem value="conductor">Conductor</MenuItem>
              <MenuItem value="supervisor">Supervisor</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalAbierto(false)}>Cancelar</Button>
          <Button onClick={guardarUsuario} variant="contained" color="primary">
            {modoEdicion ? 'Guardar cambios' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      <LoadingBackdrop open={loading} />
    </PageContainer>
  );
};

export default UsuariosPage;
