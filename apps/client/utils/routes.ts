import { Group, User } from '../stores/security';

export const DASHBOARD = '/';
export const HOME = '/home';
export const SIGN_IN = '/sign-in';
export const SIGN_UP = '/sign-up';
export const BULK_EMAIL = '/bulk-email';
export const BULK_EMAIL_NEW = '/bulk-email/new';
export const CONTACTS_EDIT = '/contacts/[id]';
export const CONTACTS_NEW = '/contacts/new';
export const CONTACTS = '/contacts';
export const COMPANIES_EDIT = '/companies/[id]';
export const COMPANIES_CONTACTS_EDIT = '/companies/[id]/contacts/[contact_id]';
export const COMPANIES_CONTACTS_NEW = '/companies/[id]/contacts/new';
export const COMPANIES_NEW = '/companies/new';
export const COMPANIES = '/companies';
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
export const STOCKS_WEBSHOP = '/stock/webshop';
export const ADMIN_USERS = '/admin/users';
export const ADMIN_MODULES = '/admin/modules';
export const ADMIN_LOGISTICS = '/admin/logistics';
export const ADMIN_THEME = '/admin/theme';
export const ADMIN_MODULES_PAYMENTS = '/admin/modules/payments';
export const ADMIN_MODULES_CART = '/admin/modules/cart';
export const ADMIN_LOGISTICS_VEHICLES = '/admin/logistics/vehicles';
export const ADMIN_LOGISTICS_DRIVERS = '/admin/logistics/drivers';
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
export const DASHBOARD_TOTAL_COUNT = 'dashboard/total/count';

export const getRouteGroups = (uri: string): Group[] => {
  if (uri.startsWith('/admin')) {
    return ['admin', 'super_admin'];
  }

  if (uri.startsWith('/bulk-email')) {
    return ['admin', 'super_admin', 'manager'];
  }

  if (uri.startsWith('/logistics')) {
    return ['super_admin', 'admin', 'manager', 'logistics'];
  }

  if (uri.startsWith('/stock')) {
    return ['super_admin', 'admin', 'manager', 'logistics', 'local', 'store_publisher'];
  }

  if (
    uri.startsWith('/orders')
    || uri.startsWith('/contacts')
    || uri.startsWith('/companies')
    || DASHBOARD == uri
  ) {
    return ['super_admin', 'admin', 'manager', 'logistics', 'local', 'partner_sale_uploader', 'partner'];
  }
};

export const getDefaultPath = (user: User) => {
  if (user.groups.length == 1 && user.groups[0] == 'store_publisher') {
    return STOCKS_WEBSHOP;
  }
  return DASHBOARD;
};
