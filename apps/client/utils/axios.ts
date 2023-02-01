import axios from 'axios';

export { AxiosError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333/api' : 'production_url';

export const client = axios.create({
  baseURL,
  timeout: 120000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const { CancelToken } = axios;

export const CUSTOMERS_PATH = '/customers/:id';
export const SUPPLIERS_PATH = '/suppliers/:id';

export default client;

export interface Customer {
  id: string,
  name?: string,
  representative?: string,
  email?: string,
  is_partner?: number,
}

export interface Supplier {
  id: string,
  name?: string,
  representative?: string,
  email?: string,
  partner?: string,
}
