import { useEffect, useState } from 'react';
import { State } from '../stores/security/types';
import securityStore, {
  EVENTS, SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_OUT,
} from '../stores/security';
import { clear, signIn } from '../utils/storage';
import { SIGN_IN_PATH } from '../utils/axios';
import useAxios from './useAxios';

const useSecurity = (): {
  state: State,
  signIn: (object: { username: string, password: string }) => Promise<void>,
  signOut: () => void,
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
      signIn(user);
    }
  }, [data]);

  return {
    state,
    signOut: () => {
      clear();
      securityStore.emit(SIGN_OUT);
    },
    signIn: async ({ username, password }: { username: string, password: string }) => {
      securityStore.emit(SIGN_IN_REQUEST);
      try {
        await call({ body: { username, password } });
      } catch (err) {
        securityStore.emit(SIGN_OUT);
      }
    },
  };
};

export default useSecurity;
