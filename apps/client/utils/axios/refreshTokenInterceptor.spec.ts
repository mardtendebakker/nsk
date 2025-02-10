import { AxiosError, CanceledError } from 'axios';
import refreshTokenInterceptor from './refreshTokenInterceptor';
import securityStore from '../../stores/security';

const config = { url: 'resources', headers: {} };
const originalResponse = { status: 401 };
const user = {
  username: 'username',
  refreshToken: 'refresh_token',
  accessToken: 'access_token',
};

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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('rejects for CanceledError', async () => {
    const error = new CanceledError();
    expect.assertions(1);

    try {
      await refreshTokenInterceptor(error);
    } catch (e) {
      expect(e).toBe(error);
    }
  });

  it('returns a rejected promise for excluded paths', async () => {
    const error = { config: { url: '/security/sign-in' }, response: originalResponse };
    expect.assertions(1);

    try {
      await refreshTokenInterceptor(error as AxiosError);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
  it('attempts to refresh the token if status code is 401', async () => {
    const error = { config, response: originalResponse, status: 401 };
    const response = { data: user };
    mockedClient.post.mockResolvedValue(response);

    await refreshTokenInterceptor(error as AxiosError);

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/security/refresh-token',
      { emailOrUsername: user.username, token: user.refreshToken },
    );

    expect(securityStore.emit).toHaveBeenCalledWith('SIGN_IN_REQUEST_SUCCEEDED', user);
  });
  it('sends a new request with the refreshed token and resolves the promise', async () => {
    const error = { config, response: originalResponse };
    const response = { data: user };
    mockedClient.post.mockResolvedValueOnce(response);

    await refreshTokenInterceptor(error as AxiosError);

    expect(mockedClient.post).toHaveBeenCalledWith(
      '/security/refresh-token',
      { emailOrUsername: user.username, token: user.refreshToken },
    );
    expect(securityStore.emit).toHaveBeenCalledWith('SIGN_IN_REQUEST_SUCCEEDED', user);
  });
  it('logs the user out if token refresh fails', async () => {
    const error = { config, response: originalResponse };
    mockedClient.post.mockRejectedValueOnce(new Error());
    let thrown = false;

    try {
      await refreshTokenInterceptor(error as AxiosError);
    } catch (e) {
      thrown = true;
    }

    expect(thrown).toBeTruthy();
    expect(mockedClient.post).toHaveBeenCalledWith(
      '/security/refresh-token',
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
