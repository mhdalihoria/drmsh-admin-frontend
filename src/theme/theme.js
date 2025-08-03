
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0a192f', // navy blue
    },
    secondary: {
      main: '#64ffda',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#0a192f',
      paper: '#112240',
    },
    text: {
      primary: '#ccd6f6',
      secondary: '#8892b0',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: { fontFamily: 'Libre Baskerville, serif' },
    h2: { fontFamily: 'Libre Baskerville, serif' },
    h3: { fontFamily: 'Libre Baskerville, serif' },
    h4: { fontFamily: 'Libre Baskerville, serif' },
    h5: { fontFamily: 'Libre Baskerville, serif' },
    h6: { fontFamily: 'Libre Baskerville, serif' },
  },
});

export default theme;