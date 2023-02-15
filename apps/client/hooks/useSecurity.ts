import { useEffect, useState } from 'react';
import { State } from '../stores/security/types';
import securityStore, {
  SEND_VERIFICATION_CODE_REQUEST,
  SEND_VERIFICATION_CODE_REQUEST_FAILED,
  SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED,
  CONFIRM_ACCOUNT_REQUEST,
  CONFIRM_ACCOUNT_REQUEST_FAILED,
  CONFIRM_ACCOUNT_REQUEST_SUCCEEDED,
  EVENTS,
  SIGN_IN_REQUEST,
  SIGN_IN_REQUEST_FAILED,
  SIGN_OUT,
  SIGN_UP_REQUEST,
  SIGN_UP_REQUEST_FAILED,
  SIGN_UP_REQUEST_SUCCEEDED,
  SIGN_IN_REQUEST_SUCCEEDED,
} from '../stores/security';
import axiosClient, {
  SIGN_IN_PATH, SIGN_UP_PATH, USER_INFO_PATH, CONFIRM_ACCOUNT_PATH,
} from '../utils/axios';
import useAxios from './useAxios';
import useTranslation from './useTranslation';
import { SEND_VERIFICATION_CODE_PATH } from '../utils/axios/paths';
import buildUserFromResponse from '../utils/axios/buildUserFromResponse';

const useSecurity = (): {
  state: State,
  signIn: (object: { username: string, password: string }) => Promise<void>,
  signUp: (object: { username: string, email: string, password: string }) => Promise<void>,
  confirmAccount: (object: { code: string }) => Promise<void>,
  sendVerificationCode: () => Promise<void>,
  signOut: () => void,
  refreshUserInfo: ()=> Promise<void>,
} => {
  const [state, setState] = useState<State>(securityStore.state);
  const { call } = useAxios('post', SIGN_IN_PATH, { withProgressBar: true });
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
  const { call: sendVerificationCodeCall } = useAxios(
    'post',
    SEND_VERIFICATION_CODE_PATH,
    { withProgressBar: true, showSuccessMessage: true },
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
        const response = await call({ body: { username, password } });
        if (response) {
          securityStore.emit(SIGN_IN_REQUEST_SUCCEEDED, buildUserFromResponse(response));
        }
      } catch (e) {
        securityStore.emit(SIGN_IN_REQUEST_FAILED);
        throw e;
      }
    },
    signUp: async (
      { username, email, password }:
      { username: string, email: string, password: string },
    ) => {
      securityStore.emit(SIGN_UP_REQUEST);
      try {
        await signUpCall({ body: { username, email, password } });
        securityStore.emit(SIGN_UP_REQUEST_SUCCEEDED, { username, email, emailVerified: false });
      } catch (e) {
        securityStore.emit(SIGN_UP_REQUEST_FAILED);
        throw e;
      }
    },
    confirmAccount: async ({ code }: { code: string }) => {
      securityStore.emit(CONFIRM_ACCOUNT_REQUEST);
      try {
        await confirmAccountCall({ body: { code, username: state.user.username } });
        securityStore.emit(CONFIRM_ACCOUNT_REQUEST_SUCCEEDED);
      } catch (e) {
        securityStore.emit(CONFIRM_ACCOUNT_REQUEST_FAILED);
        throw e;
      }
    },
    refreshUserInfo: async (): Promise<void> => {
      const response = await axiosClient.get(USER_INFO_PATH);
      securityStore.emit(
        SIGN_IN_REQUEST_SUCCEEDED,
        {
          ...securityStore.state.user,
          username: response.data.username,
          email: response.data.email,
        },
      );
    },
    sendVerificationCode: async (): Promise<void> => {
      securityStore.emit(SEND_VERIFICATION_CODE_REQUEST);
      try {
        await sendVerificationCodeCall({ body: { username: state.user.username } });
        securityStore.emit(SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED);
      } catch (e) {
        securityStore.emit(SEND_VERIFICATION_CODE_REQUEST_FAILED);
        throw e;
      }
    },
  };
};

export default useSecurity;
