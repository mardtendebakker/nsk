export interface Location {
  id:number,
  name:string,
  zipcodes:string
  location_template: { id: number, template: string }[]
}
