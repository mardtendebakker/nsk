import { AxiosError, CanceledError } from 'axios';
import refreshTokenInterceptor from './refreshTokenInterceptor';
import buildUserFromResponse from './buildUserFromResponse';
import securityStore from '../../stores/security';

const config = { url: 'resources', headers: {} };
const originalResponse = { status: 401 };
const user = {
  username: 'username',
  refreshToken: 'refresh_token',
  accessToken: 'access_token',
};

jest.mock('./buildUserFromResponse', () => jest.fn(() => user));

function mockedClient() {}
mockedClient.post = jest.fn();
mockedClient.interceptors = {
  request: {
    use: () => {},
  },
  response: {
    use: () => {},
  },
};

jest.mock('./client', () => mockedClient);

jest.mock('../storage', () => ({
  getUser: () => user,
  clear: jest.fn(),
}));

jest.mock('../../stores/security', () => ({
  ...jest.requireActual('../../stores/security'),
  emit: jest.fn(),
  on: jest.fn(),
}));

describe('refreshTokenInterceptor', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('returns a resolved promise for CanceledError', async () => {
    const error = new CanceledError();
    const result = await refreshTokenInterceptor(error);
    expect(result).toBe(undefined);
  });

  it('returns a rejected promise for excluded paths', async () => {
    const error = { config: { url: '/auth/login' }, response: originalResponse };
    expect.assertions(1);

    try {
      await refreshTokenInterceptor(error as AxiosError);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
  it('attempts to refresh the token if status code is 401', async () => {
    const error = { config, response: originalResponse };
    const response = { data: {} };
    mockedClient.post.mockResolvedValue(response);

    await refreshTokenInterceptor(error as AxiosError);

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/auth/refresh',
      { emailOrUsername: user.username, token: user.refreshToken },
    );

    expect(buildUserFromResponse).toHaveReturnedWith(user);
    expect(securityStore.emit).toHaveBeenCalledWith('SIGN_IN_REQUEST_SUCCEEDED', user);
  });
  it('sends a new request with the refreshed token and resolves the promise', async () => {
    const error = { config, response: originalResponse };
    const response = { data: {} };
    mockedClient.post.mockResolvedValueOnce(response);

    await refreshTokenInterceptor(error as AxiosError);

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/auth/refresh',
      { emailOrUsername: user.username, token: user.refreshToken },
    );
    expect(buildUserFromResponse).toHaveReturnedWith(user);
    expect(securityStore.emit).toHaveBeenCalledWith('SIGN_IN_REQUEST_SUCCEEDED', user);
  });
  it('logs the user out if token refresh fails', async () => {
    const error = { config, response: originalResponse };
    mockedClient.post.mockRejectedValueOnce(new Error());

    await refreshTokenInterceptor(error as AxiosError);

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/auth/refresh',
      { emailOrUsername: user.username, token: user.refreshToken },
    );
    expect(securityStore.emit).toHaveBeenCalledWith('SIGN_OUT');
  });
  it('rejects error if status is not 401', async () => {
    const error = { config, response: { status: 500 } };
    expect.assertions(1);
    try {
      await refreshTokenInterceptor(error as AxiosError);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
