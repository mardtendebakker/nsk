import { useEffect, useState } from 'react';
import { State } from '../stores/security/types';
import securityStore, {
  EVENTS, SIGN_IN_REQUEST, SIGN_IN_SUCCESS, SIGN_OUT,
} from '../stores/security';
import axiosClient, {
  SIGN_IN_PATH, SIGN_UP_PATH, USER_INFO_PATH, CONFIRM_ACCOUNT_PATH,
} from '../utils/axios';
import useAxios from './useAxios';
import useTranslation from './useTranslation';

const useSecurity = (): {
  state: State,
  signIn: (object: { username: string, password: string }) => Promise<void>,
  signUp: (object: { username: string, email: string, password: string }) => Promise<void>,
  confirmAccount: (object: { username: string, code: string }) => Promise<void>,
  signOut: () => void,
  refreshUserInfo: ()=> Promise<void>,
} => {
  const [state, setState] = useState<State>(securityStore.state);
  const { data, call } = useAxios('post', SIGN_IN_PATH, { withProgressBar: true });
  const { trans } = useTranslation();
  const { call: signUpCall } = useAxios(
    'post',
    SIGN_UP_PATH,
    { withProgressBar: true, customSuccessMessage: trans('signUpSuccessMessage') },
  );
  const { call: confirmAccountCall } = useAxios(
    'post',
    CONFIRM_ACCOUNT_PATH,
    { withProgressBar: true, customSuccessMessage: trans('confirmAccountSuccessMessage') },
  );

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
    signUp: async (
      { username, email, password }:
      { username: string, email: string, password: string },
    ) => {
      await signUpCall({ body: { username, email, password } });
    },
    confirmAccount: async ({ username, code }: { username: string, code: string }) => {
      await confirmAccountCall({ body: { username, code } });
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
