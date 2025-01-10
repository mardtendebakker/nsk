import PropTypes from 'prop-types';
import { useEffect, useMemo } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import shadows from './shadows';
import typography from './typography';
import GlobalStyles from './globalStyles';
import customShadows from './customShadows';
import componentsOverride from './overrides';
import useTheme from '../hooks/useTheme';
import initPalette from './palette';

export default function ThemeProvider({ children }) {
  const { state: { theme: { palette } }, fetchTheme } = useTheme();

  useEffect(() => {
    fetchTheme();
  }, []);

  const themeOptions = useMemo(
    () => ({
      palette: {
        ...initPalette,
        ...palette,
      },
      shape: { borderRadius: 2.2 },
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
    }),
    [JSON.stringify(palette)],
  );

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
