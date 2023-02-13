import { CanceledError, AxiosError } from 'axios';
import { getUser } from '../storage';
import securityStore, { SIGN_IN_SUCCESS, SIGN_OUT } from '../../stores/security';
import axiosClient from './client';
import { REFRESH_TOKEN_PATH, SIGN_IN_PATH } from './paths';

const EXCLUDED_PATHS = [SIGN_IN_PATH, REFRESH_TOKEN_PATH];

let subscribers: Array<(token: string)=>void> = [];
let refreshRequested = false;

export default (err: AxiosError): Promise<any> => {
  const { config, response: originalResponse } = err;

  if (err instanceof CanceledError || EXCLUDED_PATHS.includes(config.url)) {
    return Promise.resolve();
  }

  if (originalResponse?.status === 401) {
    if (!refreshRequested) {
      refreshRequested = true;
      const user = getUser();

      axiosClient
        .post(REFRESH_TOKEN_PATH, { username: user.username, token: user.refreshToken })
        .then(({ data }) => {
          const newUser = {
            username: data.idToken.payload['cognito:username'],
            email: data.idToken.payload.email,
            accessToken: data.idToken.jwtToken,
            refreshToken: data.refreshToken.token,
          };
          securityStore.emit(SIGN_IN_SUCCESS, newUser);
          subscribers.map((cb) => cb(data.idToken.jwtToken));
          subscribers = [];
          refreshRequested = false;
        })
        .catch(() => {
          securityStore.emit(SIGN_OUT);
        });
    }

    return new Promise((resolve): void => {
      subscribers.push((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(axiosClient(config));
      });
    });
  }

  return Promise.reject(err);
};
