import axios from 'axios';
import axiosClient from './client';
import refreshToken from './refreshTokenInterceptor';
import exactRefreshToken from './exactRefreshTokenInterceptor';

export * from './paths';
export { AxiosError, CanceledError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

axiosClient.interceptors.response.use((response) => response, refreshToken);
axiosClient.interceptors.response.use((response) => response, exactRefreshToken);

export const { CancelToken } = axios;

export default axiosClient;
