export interface CompanyListItem {
  id:number,
  name:string,
  kvk_nr:string,
  is_partner:boolean,
  is_supplier:boolean,
  is_customer:boolean,
  contactsCount:number
}

export interface Company {
  id:number,
  name:string,
  kvk_nr:string,
  is_partner:boolean,
  is_supplier:boolean,
  is_customer:boolean,
  partner_id:number,
  tax_code:number,
}
