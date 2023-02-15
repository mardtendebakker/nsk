import { CanceledError, AxiosError } from 'axios';
import { getUser } from '../storage';
import securityStore, { SIGN_IN_SUCCESS, SIGN_OUT } from '../../stores/security';
import axiosClient from './client';
import { REFRESH_TOKEN_PATH, SIGN_IN_PATH } from './paths';
import buildUserFromResponse from './buildUserFromResponse';

const EXCLUDED_PATHS = [SIGN_IN_PATH, REFRESH_TOKEN_PATH];

let subscribers: Array<(token: string)=>void> = [];
let refreshRequested = false;

export default (err: AxiosError): Promise<any> => {
  const { config, response: originalResponse } = err;

  if (err instanceof CanceledError) {
    return Promise.resolve();
  }

  if (EXCLUDED_PATHS.includes(config.url)) {
    return Promise.reject(err);
  }

  if (originalResponse?.status === 401) {
    if (!refreshRequested) {
      refreshRequested = true;
      const user = getUser();

      axiosClient
        .post(REFRESH_TOKEN_PATH, { username: user.username, token: user.refreshToken })
        .then((response) => {
          const newUser = buildUserFromResponse(response);
          securityStore.emit(SIGN_IN_SUCCESS, newUser);
          subscribers.map((cb) => cb(newUser.accessToken));
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
