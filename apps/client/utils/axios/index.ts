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
} from './paths';
export { AxiosError } from 'axios';
export type { AxiosPromise, AxiosResponse } from 'axios';

axiosClient.interceptors.response.use((response) => response, refreshToken);

export const { CancelToken } = axios;

export default axiosClient;

export type { default as Customer } from './model/customer';
export type { default as Supplier } from './model/supplier';
export type { default as SalesOrder } from './model/salesOrder';
export type { default as Product } from './model/product';
export type { default as StockProduct } from './model/stockProduct';
export type { default as StockRepairService } from './model/stockRepairService';
export type { default as RepairService } from './model/repairService';
export type { default as PurchaseOrder } from './model/purchaseOrder';
export type { default as User } from './model/user';
