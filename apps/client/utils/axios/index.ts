import axios from 'axios';
import axiosClient from './client';
import refreshToken from './refreshTokenInterceptor';

export {
  CUSTOMERS_PATH,
  SUPPLIERS_PATH,
  SIGN_IN_PATH,
  REFRESH_TOKEN_PATH,
  USER_INFO_PATH,
  SIGN_UP_PATH,
  CONFIRM_ACCOUNT_PATH,
  CHANGE_PASSWORD_PATH,
} from './paths';
export { AxiosError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

axiosClient.interceptors.response.use((response) => response, refreshToken);

export const { CancelToken } = axios;

export default axiosClient;

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
