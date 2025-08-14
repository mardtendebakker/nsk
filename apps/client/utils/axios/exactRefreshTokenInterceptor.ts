import { CanceledError, AxiosError } from 'axios';
import axiosClient from './client';
import {
  getExactOnlineRefreshToken,
  setExactOnlineToken,
  setExactOnlineRefreshToken,
} from '../storage';

const EXACT_REFRESH_TOKEN_PATH = '/exact/oauth2/refresh-token';

let subscribers: Array<(token: string) => void> = [];
let refreshRequested = false;

const redirectToOAuth = () => {
  const clientId = process.env.EXACT_ONLINE_CLIENT_ID;
  const redirectUri = `${window.location.origin}/exactonline/oauth2/callback`;
  const authUrl = `${
    process.env.EXACT_ONLINE_AUTH_BASE_URL
  }/api/oauth2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code`;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('exactOnlineReturnUrl', window.location.pathname);
  }
  window.location.href = authUrl;
};

export default async (err: AxiosError): Promise<unknown> => {
  const { config, response: originalResponse } = err;

  if (err instanceof CanceledError) {
    return Promise.reject(err);
  }

  if (config.url === EXACT_REFRESH_TOKEN_PATH) {
    return Promise.reject(err);
  }

  const errorData = originalResponse?.data as { message?: string } | undefined;
  const errorMessage = errorData?.message || '';
  const isInvalidOrExpiredToken =
    typeof errorMessage === 'string' &&
    errorMessage.includes('INVALID_OR_EXPIRED_EXACT_TOKEN');

  if (originalResponse?.status === 401 && isInvalidOrExpiredToken) {
    const returnPromise = new Promise((resolve) => {
      subscribers.push((token) => {
        if (!config.headers) {
          // eslint-disable-next-line no-param-reassign
          config.headers = {} as any;
        }
        // eslint-disable-next-line no-param-reassign
        config.headers.ExactAuthorization = `Bearer ${token}`;
        resolve(axiosClient(config));
      });
    });

    if (!refreshRequested) {
      refreshRequested = true;
      const refreshToken = getExactOnlineRefreshToken();

      if (!refreshToken) {
        redirectToOAuth();
        return Promise.resolve();
      }

      try {
        const response = await axiosClient.post(EXACT_REFRESH_TOKEN_PATH, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        setExactOnlineToken(accessToken);
        setExactOnlineRefreshToken(newRefreshToken);
        subscribers.map((cb) => cb(accessToken));
        subscribers = [];
        refreshRequested = false;
      } catch {
        redirectToOAuth();
        return Promise.resolve();
      }
    }

    return returnPromise;
  }

  return Promise.reject(err);
};
