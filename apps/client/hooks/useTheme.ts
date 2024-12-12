import { useEffect, useState } from 'react';
import themeStore, {
  FETCH_THEME_REQUEST,
  FETCH_THEME_REQUEST_SUCCEEDED,
  FETCH_THEME_REQUEST_FAILED,
  RESET_PALETTE_REQUEST,
  EVENTS,
  State,
} from '../stores/theme';
import axiosClient, { ADMIN_THEME_PATH } from '../utils/axios';
import { buildAFileLink } from '../utils/afile';

const useTheme = (): {
  state: State,
  fetchTheme: () => Promise<void>,
  resetPalette: () => void,
} => {
  const [state, setState] = useState<State>(themeStore.state);

  function cb() {
    setState(themeStore.state);
  }

  useEffect(() => {
    EVENTS.forEach((event) => {
      themeStore.on(event, cb);
    });

    return () => {
      EVENTS.forEach((event) => {
        themeStore.removeListener(event, cb);
      });
    };
  }, []);

  return {
    state,
    resetPalette: () => {
      themeStore.emit(RESET_PALETTE_REQUEST);
    },
    fetchTheme: async () => {
      themeStore.emit(FETCH_THEME_REQUEST);
      try {
        const response = await axiosClient.get(ADMIN_THEME_PATH);
        themeStore.emit(FETCH_THEME_REQUEST_SUCCEEDED, {
          ...response.data,
          logo: buildAFileLink(response.data.logo),
          favicon: buildAFileLink(response.data.favicon),
        });
      } catch {
        themeStore.emit(FETCH_THEME_REQUEST_FAILED);
      }
    },
  };
};

export default useTheme;
