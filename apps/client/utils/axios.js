import axios from 'axios';

export { AxiosPromise, AxiosResponse, AxiosError } from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333' : 'production_url';

export const client = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const { CancelToken } = axios;

export const SUPLIERS_PATH = '';

export default client;
