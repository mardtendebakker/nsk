import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  10: '#F5F7F9',
  20: '#EDF1F7',
  30: '#D5DCE6',
  40: '#B7C2D1',
  50: '#65758B',
  60: '#4D5D73',
  70: '#1B2A3D',
};

const PRIMARY = {
  light: '#D2DCF5',
  main: '#1F0E8F',
  dark: '#1B2A3D',
  contrastText: '#fff',
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const INFO = {
  light: '#D7E0FA',
  main: '#1F0E8F',
  contrastText: '#fff',
};

const SUCCESS = {
  light: '#DCFAEA',
  main: '#008A40',
  contrastText: GREY[70],
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FAF2C6',
  main: '#AA4603',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[70],
};

const ERROR = {
  light: '#F6D5D5',
  main: '#B82929',
  dark: '#B72136',
  darker: '#850D0D',
  contrastText: '#fff',
};

const palette = {
  common: { black: '#000', white: '#fff' },
  primary: PRIMARY,
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  divider: GREY[30],
  text: {
    primary: GREY[70],
    secondary: GREY[50],
    disabled: GREY[40],
  },
  background: {
    paper: '#fff',
    default: GREY[0],
    neutral: GREY[10],
  },
  action: {
    active: GREY[50],
    hover: alpha(GREY[40], 0.08),
    selected: alpha(GREY[40], 0.16),
    disabled: alpha(GREY[40], 0.8),
    disabledBackground: alpha(GREY[40], 0.24),
    focus: alpha(GREY[40], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
