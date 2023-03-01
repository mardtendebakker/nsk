import BaseCustomer from './baseCustomer';

export default interface Supplier extends BaseCustomer {
  partner?: string,
}
