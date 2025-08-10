// src/components/Layout/Footer.tsx
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 2,
        px: 2,
        textAlign: 'center',
        bgcolor: 'background.paper',
        color: 'text.secondary',
        borderTop: '1px solid #e0e0e0',
        fontSize: '0.875rem',
        mt: 'auto',
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Plataforma Preoperacional - TecnoFuego
      </Typography>
    </Box>
  );
};

export default Footer;
