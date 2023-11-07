export type Group = 'super_admin' | 'manager' | 'admin' | 'logistics' | 'local' | 'partner_sale_uploader' | 'partner';

export interface State {
  user?: User,
  loading: boolean,
}

export interface User {
  username: string,
  email: string,
  groups: Group[],
  accessToken?: string,
  refreshToken?: string,
  emailVerified: boolean,
}
