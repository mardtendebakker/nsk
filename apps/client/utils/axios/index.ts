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
  SEND_VERIFICATION_CODE_PATH,
  FORGOT_PASSWORD_PATH,
  SALES_ORDERS_PATH,
  PURCHASE_ORDERS_PATH,
  STOCK_PRODUCTS_PATH,
  USERS_PATH,
  STOCK_REPAIR_SERVICES_PATH,
  ORDER_STATUSES_PATH,
  COMPANIES_PATH,
  LOCATIONS_PATH,
  BULK_PRINT_SALES_PATH,
  BULK_PRINT_PURCHASES_PATH,
  ORDERS_ANALYTICS_PATH,
} from './paths';
export { AxiosError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

axiosClient.interceptors.response.use((response) => response, refreshToken);

export const { CancelToken } = axios;

export default axiosClient;
