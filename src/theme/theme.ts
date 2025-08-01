// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF4D2E',
    },
    secondary: {
      main: '#1976d2',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1c1c',
      secondary: '#5f5f5f',
      },
      
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
