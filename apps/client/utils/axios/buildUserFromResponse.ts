import { AxiosResponse } from 'axios';
import { User } from '../../stores/security/types';

export default (response: AxiosResponse): User => ({
  username: response.data.idToken.payload['cognito:username'],
  email: response.data.idToken.payload.email,
  accessToken: response.data.idToken.jwtToken,
  refreshToken: response.data.refreshToken.token,
  emailVerified: response.data.idToken.payload.email_verified,
});
