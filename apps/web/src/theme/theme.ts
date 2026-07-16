import { createTheme, type Theme } from '@mui/material/styles';

const SERIF = 'Georgia, "Times New Roman", "Sarabun", serif';
const SANS =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Sarabun", "Helvetica Neue", Arial, sans-serif';

export type ColorMode = 'light' | 'dark';

export function getTheme(mode: ColorMode): Theme {
  const isLight = mode === 'light';
  return createTheme({
    palette: isLight
      ? {
          mode: 'light',
          primary: { main: '#1a8917' },
          secondary: { main: '#242424' },
          background: { default: '#ffffff', paper: '#ffffff' },
          text: { primary: '#242424', secondary: '#6b6b6b' },
          divider: 'rgba(0,0,0,0.1)',
        }
      : {
          mode: 'dark',
          primary: { main: '#4caf50' },
          secondary: { main: '#e6e6e6' },
          background: { default: '#0d0d0d', paper: '#161616' },
          text: { primary: '#e9e9e9', secondary: '#a3a3a3' },
          divider: 'rgba(255,255,255,0.12)',
        },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: SANS,
      h1: { fontFamily: SERIF, fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontFamily: SERIF, fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontFamily: SERIF, fontWeight: 700 },
      h4: { fontFamily: SERIF, fontWeight: 700 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiAppBar: {
        defaultProps: { elevation: 0, color: 'inherit' },
        styleOverrides: {
          root: ({ theme }) => ({
            borderBottom: `1px solid ${theme.palette.divider}`,
            backgroundImage: 'none',
          }),
        },
      },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  });
}
