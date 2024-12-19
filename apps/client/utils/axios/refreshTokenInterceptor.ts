import { CanceledError, AxiosError } from 'axios';
import { getUser } from '../storage';
import securityStore, { SIGN_IN_REQUEST_SUCCEEDED, SIGN_OUT } from '../../stores/security';
import axiosClient from './client';
import { REFRESH_TOKEN_PATH, SIGN_IN_PATH } from './paths';

const EXCLUDED_PATHS = [SIGN_IN_PATH, REFRESH_TOKEN_PATH];

let subscribers: Array<(token: string)=>void> = [];
let refreshRequested = false;

export default async (err: AxiosError): Promise<any> => {
  const { config, response: originalResponse } = err;

  if (err instanceof CanceledError) {
    return Promise.reject(err);
  }

  if (EXCLUDED_PATHS.includes(config.url)) {
    return Promise.reject(err);
  }

  if (originalResponse?.status === 401) {
    const returnPromise = new Promise((resolve) => {
      subscribers.push((token) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(axiosClient(config));
      });
    });

    if (!refreshRequested) {
      refreshRequested = true;
      const user = getUser();

      try {
        const response = await axiosClient
          .post(REFRESH_TOKEN_PATH, { emailOrUsername: user.username, token: user.refreshToken });
        const newUser = response.data;
        securityStore.emit(SIGN_IN_REQUEST_SUCCEEDED, newUser);
        subscribers.map((cb) => cb(newUser.accessToken));
        subscribers = [];
        refreshRequested = false;
      } catch {
        securityStore.emit(SIGN_OUT);
        return Promise.reject(err);
      }
    }

    return returnPromise;
  }

  return Promise.reject(err);
};
