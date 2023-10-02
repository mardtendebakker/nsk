import { Group } from '../stores/security/types';

export const DASHBOARD = '/';
export const SIGN_IN = '/sign-in';
export const BULK_EMAIL = '/bulk-email';
export const BULK_EMAIL_NEW = '/bulk-email/new';
export const SUPPLIERS_EMAILS_NEW = '/suppliers/emails/new';
export const SUPPLIERS_EMAILS = '/suppliers/emails';
export const CONTACTS_CUSTOMERS = '/contacts/customers';
export const CONTACTS_CUSTOMERS_NEW = '/contacts/customers/new';
export const CONTACTS_CUSTOMERS_EDIT = '/contacts/customers/[id]';
export const CONTACTS_SUPPLIERS = '/contacts/suppliers';
export const CONTACTS_SUPPLIERS_EDIT = '/contacts/suppliers/[id]';
export const CONTACTS_SUPPLIERS_NEW = '/contacts/suppliers/new';
export const ACCOUNT_VERIFICATION = '/account-verification';
export const SETTINGS = '/settings';
export const ORDERS_PURCHASES = '/orders/purchases';
export const ORDERS_SALES = '/orders/sales';
export const ORDERS_REPAIRS = '/orders/repairs';
export const STOCKS_PRODUCTS = '/stock/products';
export const ORDERS_PURCHASES_NEW = '/orders/purchases/new';
export const ORDERS_PURCHASES_EDIT = '/orders/purchases/[id]';
export const ORDERS_REPAIRS_EDIT = '/orders/repairs/[id]';
export const ORDERS_SALES_NEW = '/orders/sales/new';
export const ORDERS_REPAIRS_NEW = '/orders/repairs/new';
export const ORDERS_SALES_EDIT = '/orders/sales/[id]';
export const STOCKS_REPAIR_SERVICES = '/stock/repair-services';
export const STOCKS_ARCHIVED = '/stock/archived';
export const MY_TASKS = '/my-tasks';
export const ADMIN_USERS = '/admin/users';
export const ADMIN_SETTINGS = '/admin/settings';
export const ADMIN_SETTINGS_LOCATIONS = '/admin/settings/locations';
export const ADMIN_SETTINGS_PRODUCT_TYPES = '/admin/settings/product-types';
export const ADMIN_SETTINGS_ATTRIBUTES = '/admin/settings/attributes';
export const ADMIN_SETTINGS_TASKS = '/admin/settings/tasks';
export const ADMIN_SETTINGS_STATUS = '/admin/settings/status';
export const ADMIN_SETTINGS_MAILING_LISTS = '/admin/settings/mailing-lists';
export const ADMIN_SETTINGS_CUSTOMER_TAGS = '/admin/settings/customer-tags';
export const ADMIN_SETTINGS_PRODUCT_STATUSES = '/admin/settings/product-statuses';
export const ADMIN_SETTINGS_ORDER_STATUSES = '/admin/settings/order-statuses';
export const LOGISTICS_PICKUP = '/logistics/pickups';
export const LOGISTICS_DELIVERY = '/logistics/deliveries';

export const ROUTES_GROUPS: { [key: string]: Group[] } = {
  [ADMIN_USERS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_LOCATIONS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_PRODUCT_TYPES]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_ATTRIBUTES]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_TASKS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_STATUS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_MAILING_LISTS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_CUSTOMER_TAGS]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_PRODUCT_STATUSES]: ['admin', 'super_admin'],
  [ADMIN_SETTINGS_ORDER_STATUSES]: ['admin', 'super_admin'],
};
