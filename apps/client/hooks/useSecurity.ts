import { useEffect, useState } from 'react';
import { State } from '../stores/security/types';
import securityStore, {
  EVENTS, SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_OUT,
} from '../stores/security';
import axiosClient, { SIGN_IN_PATH, USER_INFO_PATH } from '../utils/axios';
import useAxios from './useAxios';

const useSecurity = (): {
  state: State,
  signIn: (object: { username: string, password: string }) => Promise<void>,
  signOut: () => void,
  refreshUserInfo: ()=> Promise<void>,
} => {
  const [state, setState] = useState<State>(securityStore.state);
  const { data, call } = useAxios('post', SIGN_IN_PATH, { withProgressBar: true });

  function cb() {
    setState(securityStore.state);
  }

  useEffect(() => {
    EVENTS.forEach((event) => {
      securityStore.on(event, cb);
    });

    return () => {
      EVENTS.forEach((event) => {
        securityStore.removeListener(event, cb);
      });
    };
  }, []);

  useEffect(() => {
    if (data) {
      const user = {
        username: data.idToken.payload['cognito:username'],
        email: data.idToken.payload.email,
        accessToken: data.idToken.jwtToken,
        refreshToken: data.refreshToken.token,
      };

      securityStore.emit(SIGN_IN_SUCCESS, user);
    }
  }, [data]);

  return {
    state,
    signOut: () : void => {
      securityStore.emit(SIGN_OUT);
    },
    signIn: async (
      { username, password }: { username: string, password: string },
    ) : Promise<void> => {
      securityStore.emit(SIGN_IN_REQUEST);
      try {
        await call({ body: { username, password } });
      } catch {
        securityStore.emit(SIGN_OUT);
      }
    },
    refreshUserInfo: async (): Promise<void> => {
      const response = await axiosClient.get(USER_INFO_PATH);
      securityStore.emit(
        SIGN_IN_SUCCESS,
        {
          ...securityStore.state.user,
          username: response.data.username,
          email: response.data.email,
        },
      );
    },
  };
};

export default useSecurity;
