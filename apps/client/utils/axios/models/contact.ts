export interface ContactListItem {
  id: number,
  name:string,
  company: {
    id:number,
    name:string,
    kvk_nr:string,
    is_partner:boolean,
    is_supplier:boolean,
    is_customer:boolean,
    partner_id:number,
    partner:{ id: number, name: string },
  },
  email:string,
  is_partner:boolean,
  is_supplier:boolean,
  is_customer:boolean,
  ordersCount:number
}

export interface Contact {
  id:number,
  name:string,
  company_id: number,
  company_kvk_nr:string,
  email:string,
  phone:string,
  phone2:string,
  street:string,
  street_extra:string,
  city:string,
  country:string,
  state:string,
  zip:string,
  street2:string,
  street_extra2:string,
  city2:string,
  country2:string,
  discr:string,
  state2:string,
  zip2:string,
  is_partner:boolean,
  is_customer:boolean,
  is_supplier:boolean,
}
