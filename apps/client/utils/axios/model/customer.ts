import BaseCustomer from './baseCustomer';

export default interface Customer extends BaseCustomer {
  kvk_nr?: string,
  is_partner?: number,
}
