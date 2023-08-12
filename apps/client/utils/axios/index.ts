import axios from 'axios';
import axiosClient from './client';
import refreshToken from './refreshTokenInterceptor';

export * from './paths';
export { AxiosError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

axiosClient.interceptors.response.use((response) => response, refreshToken);

export const { CancelToken } = axios;

export default axiosClient;
