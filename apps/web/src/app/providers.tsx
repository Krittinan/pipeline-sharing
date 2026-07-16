'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getTheme, type ColorMode } from '@/theme/theme';

interface ColorModeCtx {
  mode: ColorMode;
  toggle: () => void;
}

const ColorModeContext = createContext<ColorModeCtx>({
  mode: 'light',
  toggle: () => {},
});

export const useColorMode = () => useContext(ColorModeContext);

export default function Providers({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>('light');

  useEffect(() => {
    const saved = localStorage.getItem('color-mode') as ColorMode | null;
    if (saved === 'light' || saved === 'dark') setMode(saved);
  }, []);

  const toggle = () =>
    setMode((prev) => {
      const next: ColorMode = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('color-mode', next);
      return next;
    });

  const theme = useMemo(() => getTheme(mode), [mode]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ColorModeContext.Provider value={{ mode, toggle }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
