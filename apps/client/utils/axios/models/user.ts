export interface User {
  id:string,
}

export interface UserListItem {
  Username:string,
  Enabled:string,
  UserCreateDate:string,
  UserLastModifiedDate:string,
  UserStatus:string,
}

export interface Group {
  group:string,
  assign:boolean,
}
