export type Group = 'super_admin' | 'manager' | 'admin' | 'logistics' | 'partner_sale_uploader' | 'partner' | 'local';

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
