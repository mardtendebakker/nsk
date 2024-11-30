import { Theme } from '../../utils/axios/models/theme';
import EventEmitter from '../../utils/eventEmitter';

export interface State {
  theme: Theme,
  loading: boolean,
}

export const FETCH_THEME_REQUEST = 'FETCH_THEME_REQUEST';
export const FETCH_THEME_REQUEST_FAILED = 'FETCH_THEME_REQUEST_FAILED';
export const FETCH_THEME_REQUEST_SUCCEEDED = 'FETCH_THEME_REQUEST_SUCCEEDED';

export const EVENTS = [
  FETCH_THEME_REQUEST,
  FETCH_THEME_REQUEST_FAILED,
  FETCH_THEME_REQUEST_SUCCEEDED,
];

function reducer(
  currentState: State,
  { event, payload }: { event: string, payload?: Theme },
): State {
  switch (event) {
    case FETCH_THEME_REQUEST_SUCCEEDED:
      return { theme: { ...payload, palette: { ...currentState.theme.palette, ...payload.palette } }, loading: false };
    case FETCH_THEME_REQUEST_FAILED:
      return { ...currentState, loading: false };
    case FETCH_THEME_REQUEST:
      return { ...currentState, loading: true };
    default:
      return currentState;
  }
}

class ThemeEmitter extends EventEmitter {
  state: State;

  constructor() {
    super();
    this.state = {
      loading: false,
      theme: {
        companyName: 'Nexxus',
        logo: null,
        favicon: null,
        palette: {
          primary: {
            light: '#D2DCF5',
            main: '#1F0E8F',
            dark: '#1B2A3D',
            contrastText: '#fff',
          },
          secondary: {
            lighter: '#D6E4FF',
            light: '#84A9FF',
            main: '#3366FF',
            dark: '#1939B7',
            darker: '#091A7A',
            contrastText: '#fff',
          },
          info: {
            light: '#D7E0FA',
            main: '#1F0E8F',
            contrastText: '#fff',
          },
          success: {
            light: '#DCFAEA',
            main: '#008A40',
            contrastText: '#1B2A3D',
          },
          warning: {
            lighter: '#FFF7CD',
            light: '#FAF2C6',
            main: '#AA4603',
            dark: '#B78103',
            darker: '#7A4F01',
            contrastText: '#1B2A3D',
          },
          error: {
            light: '#F6D5D5',
            main: '#B82929',
            dark: '#B72136',
            darker: '#850D0D',
            contrastText: '#fff',
          },
        },
      },
    };
  }

  emit(event: string, payload?: Theme) {
    const newState = reducer(this.state, { event, payload });
    if (newState) {
      this.state = newState;
    }

    return super.emit(event, payload);
  }
}

export default new ThemeEmitter();
