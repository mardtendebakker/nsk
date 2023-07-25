import axios from 'axios';
import { getUser } from '../storage';

const baseURL = process.env.NX_AXIOS_BASE_URL;

export const client = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

client.interceptors.request.use(
  (config) => {
    const token = getUser()?.accessToken;
    if (token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${getUser()?.accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err),
);

export default client;
