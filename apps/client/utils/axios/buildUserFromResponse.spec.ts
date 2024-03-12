import { AxiosResponse } from 'axios';
import getUserFromResponse from './buildUserFromResponse';
import { User } from '../../stores/security';

jest.mock('axios');

describe('getUserFromResponse', () => {
  it('should extract user data from response', () => {
    const response: AxiosResponse = {
      data: {
        idToken: {
          payload: {
            'cognito:username': 'username',
            email: 'email@mail.com',
            email_verified: false,
          },
          jwtToken: 'ACCESS_TOKEN',
        },
        refreshToken: { token: 'REFRESH_TOKEN' },
      },
      status: 0,
      statusText: '',
      headers: undefined,
      config: undefined,
    };

    const expectedUser: User = {
      username: 'username',
      email: 'email@mail.com',
      refreshToken: 'REFRESH_TOKEN',
      accessToken: 'ACCESS_TOKEN',
      emailVerified: false,
      groups: [],
    };

    expect(getUserFromResponse(response)).toEqual(expectedUser);
  });
});
