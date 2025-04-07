import { useEffect, useState } from 'react';
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
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_REQUEST_SUCCEEDED,
  FORGOT_PASSWORD_REQUEST_FAILED,
  CHANGE_PASSWORD_REQUEST,
  CHANGE_PASSWORD_REQUEST_SUCCEEDED,
  CHANGE_PASSWORD_REQUEST_FAILED,
  State,
  ModuleName,
} from '../stores/security';
import axiosClient, {
  SIGN_IN_PATH,
  SIGN_UP_PATH,
  USER_INFO_PATH,
  CONFIRM_ACCOUNT_PATH,
  SEND_VERIFICATION_CODE_PATH,
  FORGOT_PASSWORD_PATH,
  CONFIRM_PASSWORD_PATH,
} from '../utils/axios';
import useAxios from './useAxios';
import useTranslation from './useTranslation';

const useSecurity = (): {
  state: State,
  signIn: (object: { emailOrUsername: string, password: string }) => Promise<void>,
  forgotPassword: (object: { emailOrUsername: string }) => Promise<void>,
  changePassword: (
    object: { emailOrUsername: string, verificationCode: string, newPassword: string }
  ) => Promise<void>,
  signUp: (object: { username: string, email: string, password: string }) => Promise<void>,
  confirmAccount: (object: { code: string }) => Promise<void>,
  sendVerificationCode: () => Promise<void>,
  signOut: () => void,
  hasModule: (module: ModuleName) => boolean,
  refreshUserInfo: ()=> Promise<void>,
} => {
  const [state, setState] = useState<State>(securityStore.state);
  const { call } = useAxios('post', SIGN_IN_PATH, { withProgressBar: true });
  const { trans } = useTranslation();
  const { call: signUpCall } = useAxios(
    'post',
    SIGN_UP_PATH,
    { withProgressBar: true, customSuccessMessage: () => trans('signUpSuccessMessage') },
  );
  const { call: confirmAccountCall } = useAxios(
    'post',
    CONFIRM_ACCOUNT_PATH,
    { withProgressBar: true, customSuccessMessage: () => trans('confirmAccountSuccessMessage') },
  );
  const { call: sendVerificationCodeCall } = useAxios(
    'post',
    SEND_VERIFICATION_CODE_PATH,
    { withProgressBar: true, showSuccessMessage: true },
  );
  const { call: forgotPasswordCall } = useAxios(
    'post',
    FORGOT_PASSWORD_PATH,
    { withProgressBar: true, customSuccessMessage: () => trans('forgotPasswordSuccessMessage') },
  );
  const { call: changePasswordCall } = useAxios(
    'post',
    CONFIRM_PASSWORD_PATH,
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
    signOut: () => {
      securityStore.emit(SIGN_OUT);
    },
    forgotPassword: async (body) => {
      securityStore.emit(FORGOT_PASSWORD_REQUEST);
      try {
        await forgotPasswordCall({ body });
        securityStore.emit(FORGOT_PASSWORD_REQUEST_SUCCEEDED);
      } catch (e) {
        securityStore.emit(FORGOT_PASSWORD_REQUEST_FAILED);
        throw e;
      }
    },
    changePassword: async (body) => {
      securityStore.emit(CHANGE_PASSWORD_REQUEST);
      try {
        await changePasswordCall({ body });
        securityStore.emit(CHANGE_PASSWORD_REQUEST_SUCCEEDED);
      } catch (e) {
        securityStore.emit(CHANGE_PASSWORD_REQUEST_FAILED);
        throw e;
      }
    },
    signIn: async (body) : Promise<void> => {
      securityStore.emit(SIGN_IN_REQUEST);
      try {
        const response = await call({ body });
        if (response) {
          securityStore.emit(SIGN_IN_REQUEST_SUCCEEDED, response.data);
        }
      } catch (e) {
        securityStore.emit(SIGN_IN_REQUEST_FAILED);
        throw e;
      }
    },
    signUp: async ({ username, email, password }) => {
      securityStore.emit(SIGN_UP_REQUEST);
      try {
        await signUpCall({ body: { username, email, password } });
        securityStore.emit(SIGN_UP_REQUEST_SUCCEEDED, {
          username, email, emailVerified: false, groups: [], modules: [],
        });
      } catch (e) {
        securityStore.emit(SIGN_UP_REQUEST_FAILED);
        throw e;
      }
    },
    confirmAccount: async ({ code }) => {
      securityStore.emit(CONFIRM_ACCOUNT_REQUEST);
      try {
        await confirmAccountCall({ body: { code, email: state.user.email } });
        securityStore.emit(CONFIRM_ACCOUNT_REQUEST_SUCCEEDED);
      } catch (e) {
        securityStore.emit(CONFIRM_ACCOUNT_REQUEST_FAILED);
        throw e;
      }
    },
    refreshUserInfo: async () => {
      const response = await axiosClient.get(USER_INFO_PATH);
      securityStore.emit(
        SIGN_IN_REQUEST_SUCCEEDED,
        {
          ...securityStore.state.user,
          username: response.data.username,
          email: response.data.email,
          groups: response.data.groups,
          modules: response.data.modules,
        },
      );
    },
    sendVerificationCode: async () => {
      securityStore.emit(SEND_VERIFICATION_CODE_REQUEST);
      try {
        await sendVerificationCodeCall({ body: { emailOrUsername: state.user.username } });
        securityStore.emit(SEND_VERIFICATION_CODE_REQUEST_SUCCEEDED);
      } catch (e) {
        securityStore.emit(SEND_VERIFICATION_CODE_REQUEST_FAILED);
        throw e;
      }
    },
    hasModule: (moduleName: ModuleName) => !!securityStore.state.user?.modules?.find((module) => module.active && module.name == moduleName),
  };
};

export default useSecurity;
