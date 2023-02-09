import { CanceledError, AxiosError } from 'axios';
import { clear, getUser, signIn } from '../storage';
import securityStore, { SIGN_IN_SUCCESS } from '../../stores/security';
import axiosClient from './client';
import { REFRESH_TOKEN_PATH } from './paths';

let subscribers: Array<(token: string)=>void> = [];
let refreshRequested = false;

export default (err: AxiosError): Promise<any> => {
  if (err instanceof CanceledError) return Promise.resolve();

  const {
    config: originalRequest,
    response: originalResponse,
  } = err;
  if (originalResponse?.status === 498) {
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
          signIn(newUser);
          subscribers.map((cb) => cb(data.idToken.jwtToken));
          subscribers = [];
          refreshRequested = false;
        })
        .catch(() => {
          clear();
          window.location.reload();
        });
    }

    return new Promise((resolve): void => {
      subscribers.push((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        resolve(axiosClient(originalRequest));
      });
    });
  }

  return Promise.reject(err);
};
