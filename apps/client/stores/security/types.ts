export interface State {
  user?: User,
  loading: boolean,
}

export interface User {
  username: string,
  email: string,
  accessToken?: string,
  refreshToken?: string,
  emailVerified: boolean,
}
