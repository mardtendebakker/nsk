import { useEffect, useState } from 'react';
import remoteConfigStore, {
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_REQUEST_SUCCEEDED,
  FETCH_CONFIG_REQUEST_FAILED,
  EVENTS,
  State,
} from '../stores/remoteConfig';
import axiosClient, { CONFIG_PATH } from '../utils/axios';

const useRemoteConfig = (): {
  state: State,
  fetchConfig: () => Promise<void>,
} => {
  const [state, setState] = useState<State>(remoteConfigStore.state);

  function cb() {
    setState(remoteConfigStore.state);
  }

  useEffect(() => {
    EVENTS.forEach((event) => {
      remoteConfigStore.on(event, cb);
    });

    return () => {
      EVENTS.forEach((event) => {
        remoteConfigStore.removeListener(event, cb);
      });
    };
  }, []);

  return {
    state,
    fetchConfig: async () => {
      remoteConfigStore.emit(FETCH_CONFIG_REQUEST);
      try {
        const response = await axiosClient.get(CONFIG_PATH);
        remoteConfigStore.emit(FETCH_CONFIG_REQUEST_SUCCEEDED, response.data);
      } catch {
        remoteConfigStore.emit(FETCH_CONFIG_REQUEST_FAILED);
      }
    },
  };
};

export default useRemoteConfig;
