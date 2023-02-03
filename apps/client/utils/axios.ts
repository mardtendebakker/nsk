import axios from 'axios';

export { AxiosError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3333/api' : process.env.NX_AXIOS_BASE_URL;

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
  id: number,
  name?: string,
  representative?: string,
  kvk_nr?: string,
  email?: string,
  phone?: string,
  phone2?: string,
  street?: string,
  street_extra?: string,
  city?: string,
  country?: string,
  state?: string,
  zip?: string,
  street2?: string,
  street_extra2?: string,
  city2?: string,
  country2?: string,
  state2?: string,
  zip2?: string,
  is_partner?: number,
}

export interface Supplier {
  id: number,
  name?: string,
  representative?: string,
  email?: string,
  phone?: string,
  phone2?: string,
  street?: string,
  street_extra?: string,
  city?: string,
  country?: string,
  state?: string,
  zip?: string,
  street2?: string,
  street_extra2?: string,
  city2?: string,
  country2?: string,
  state2?: string,
  zip2?: string,
  partner?: string,
}
